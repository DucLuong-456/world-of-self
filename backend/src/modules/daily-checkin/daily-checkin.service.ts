import { DailyCheckIn } from '@entities/DailyCheckIn';
import { GemTransaction, GemTxType } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

/** Số Ngọc thưởng theo streak (1-7 ngày, lặp lại mỗi tuần) */
const STREAK_REWARDS = [50, 60, 70, 80, 90, 100, 200];

@Injectable()
export class DailyCheckInService {
  constructor(
    @InjectRepository(DailyCheckIn)
    private readonly checkInRepo: EntityRepository<DailyCheckIn>,
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

  /** Lấy ngày hôm nay dạng 'YYYY-MM-DD' */
  private todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  /** Thông tin điểm danh hôm nay + lịch sử 7 ngày */
  async getStatus() {
    const userId = this.currentUserId;
    const today = this.todayStr();

    const todayRecord = await this.checkInRepo.findOne({
      user_id: userId,
      checked_date: today,
    });

    // Lấy 7 bản ghi gần nhất
    const recent = await this.checkInRepo.find(
      { user_id: userId },
      { orderBy: { checked_date: 'DESC' }, limit: 7 },
    );

    // Tính streak hiện tại
    const currentStreak = recent[0]?.streak ?? 0;

    // Preview thưởng hôm nay nếu chưa điểm danh
    const nextStreak = todayRecord ? currentStreak : (currentStreak % 7) + 1;
    const previewReward = STREAK_REWARDS[(nextStreak - 1) % 7];

    return {
      checked_today: !!todayRecord,
      current_streak: currentStreak,
      today_reward: previewReward,
      recent_checkins: recent,
    };
  }

  /** Thực hiện điểm danh */
  async checkIn() {
    const userId = this.currentUserId;
    const today = this.todayStr();

    // Kiểm tra đã điểm danh hôm nay chưa
    const existing = await this.checkInRepo.findOne({
      user_id: userId,
      checked_date: today,
    });
    if (existing) {
      throw new BadRequestException('Bạn đã điểm danh hôm nay rồi!');
    }

    // Tính streak: kiểm tra xem hôm qua có điểm danh không
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const yesterdayRecord = await this.checkInRepo.findOne({
      user_id: userId,
      checked_date: yesterdayStr,
    });

    const newStreak = yesterdayRecord ? yesterdayRecord.streak + 1 : 1;
    const gemsEarned = STREAK_REWARDS[(newStreak - 1) % 7];

    // Lấy / tạo ví
    let wallet = await this.walletRepo.findOne({ user_id: userId });
    if (!wallet) {
      wallet = this.walletRepo.create({ user_id: userId, balance: 0 });
      await this.em.persist(wallet);
    }

    await this.em.begin();
    try {
      const balanceBefore = wallet.balance;
      wallet.balance += gemsEarned;

      const checkIn = this.checkInRepo.create({
        user_id: userId,
        checked_date: today,
        streak: newStreak,
        gems_earned: gemsEarned,
      });

      const tx = this.txRepo.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.EARN_LOGIN,
        amount: gemsEarned,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        note: `Điểm danh ngày ${today} — Streak ${newStreak}`,
      });

      await this.em.persistAndFlush([wallet, checkIn, tx]);
      await this.em.commit();

      return {
        streak: newStreak,
        gems_earned: gemsEarned,
        new_balance: wallet.balance,
      };
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }
}
