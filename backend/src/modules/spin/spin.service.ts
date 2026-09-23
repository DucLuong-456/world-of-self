import { GemTransaction, GemTxType } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { SpinHistory } from '@entities/SpinHistory';
import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

/**
 * 8 ô trên vòng quay — index tương ứng với vị trí trên vòng quay frontend
 * Mỗi ô có xác suất riêng (weight). Tổng weight = 100
 */
export const SPIN_SLOTS = [
  { gems: 30, weight: 30, label: '30 💎' },
  { gems: 50, weight: 25, label: '50 💎' },
  { gems: 100, weight: 20, label: '100 💎' },
  { gems: 150, weight: 10, label: '150 💎' },
  { gems: 200, weight: 7, label: '200 💎' },
  { gems: 300, weight: 5, label: '300 💎' },
  { gems: 500, weight: 2, label: '500 💎' },
  { gems: 1000, weight: 1, label: '1000 💎 🎉' },
];

function weightedRandom(): number {
  const total = SPIN_SLOTS.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.floor(Math.random() * total);
  for (let i = 0; i < SPIN_SLOTS.length; i++) {
    rand -= SPIN_SLOTS[i].weight;
    if (rand < 0) return i;
  }
  return 0;
}

@Injectable()
export class SpinService {
  constructor(
    @InjectRepository(SpinHistory)
    private readonly spinRepo: EntityRepository<SpinHistory>,
    @InjectRepository(GemWallet)
    private readonly walletRepo: EntityRepository<GemWallet>,
    @InjectRepository(GemTransaction)
    private readonly txRepo: EntityRepository<GemTransaction>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    private readonly em: EntityManager,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get currentUserId(): string {
    return (this.request.user as User)?.id;
  }

  private todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  /** Kiểm tra trạng thái vòng quay hôm nay */
  async getStatus() {
    const userId = this.currentUserId;
    const today = this.todayStr();
    const startOfDay = new Date(`${today}T00:00:00.000Z`);
    const endOfDay = new Date(`${today}T23:59:59.999Z`);

    const todaySpin = await this.spinRepo.findOne({
      user_id: userId,
      created_at: { $gte: startOfDay, $lte: endOfDay },
    });

    const history = await this.spinRepo.find(
      { user_id: userId },
      { orderBy: { created_at: 'DESC' }, limit: 10 },
    );

    return {
      spun_today: !!todaySpin,
      slots: SPIN_SLOTS.map(({ gems, label }) => ({ gems, label })),
      history,
    };
  }

  /** Thực hiện quay */
  async spin() {
    const userId = this.currentUserId;
    const today = this.todayStr();
    const startOfDay = new Date(`${today}T00:00:00.000Z`);
    const endOfDay = new Date(`${today}T23:59:59.999Z`);

    // Kiểm tra đã quay hôm nay chưa
    const alreadySpun = await this.spinRepo.findOne({
      user_id: userId,
      created_at: { $gte: startOfDay, $lte: endOfDay },
    });
    if (alreadySpun) {
      throw new BadRequestException(
        'Bạn đã quay vòng quay hôm nay rồi! Quay lại vào ngày mai.',
      );
    }

    const slotIndex = weightedRandom();
    const slot = SPIN_SLOTS[slotIndex];

    let wallet = await this.walletRepo.findOne({ user_id: userId });
    if (!wallet) {
      wallet = this.walletRepo.create({ user_id: userId, balance: 0 });
      await this.em.persist(wallet);
    }

    await this.em.begin();
    try {
      const balanceBefore = wallet.balance;
      wallet.balance += slot.gems;

      const spinRecord = this.spinRepo.create({
        user_id: userId,
        gems_earned: slot.gems,
        slot_index: slotIndex,
      });

      const tx = this.txRepo.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.EARN_SPIN,
        amount: slot.gems,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        note: `Vòng quay may mắn — ${slot.label}`,
      });

      await this.em.persistAndFlush([wallet, spinRecord, tx]);
      await this.em.commit();

      return {
        slot_index: slotIndex,
        gems_earned: slot.gems,
        label: slot.label,
        new_balance: wallet.balance,
      };
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }
}
