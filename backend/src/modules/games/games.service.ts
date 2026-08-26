import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { GameSession, GameSessionStatus } from '@entities/GameSession';
import { GemWallet } from '@entities/GemWallet';
import { GemTransaction, GemTxType } from '@entities/GemTransaction';
import { User } from '@entities/User';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

const TICKET_PRICE = 10;
const REWARD_AMOUNT = 50;

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(GameSession)
    private readonly sessionRepo: EntityRepository<GameSession>,
    @InjectRepository(GemWallet)
    private readonly walletRepo: EntityRepository<GemWallet>,
    @InjectRepository(GemTransaction)
    private readonly txRepo: EntityRepository<GemTransaction>,
    private readonly em: EntityManager,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get currentUserId(): string {
    return (this.request.user as User)?.id;
  }

  async startMemoryMatch() {
    const userId = this.currentUserId;

    let wallet = await this.walletRepo.findOne({ user_id: userId });
    if (!wallet) {
      wallet = this.walletRepo.create({ user_id: userId, balance: 0 });
      await this.em.persistAndFlush(wallet);
    }

    if (wallet.balance < TICKET_PRICE) {
      throw new BadRequestException('Không đủ Ngọc Vàng để chơi (Cần 10💎)');
    }

    await this.em.begin();
    try {
      const balanceBefore = wallet.balance;
      wallet.balance -= TICKET_PRICE;

      const session = this.sessionRepo.create({
        user_id: userId,
        game_type: 'memory_match',
        status: GameSessionStatus.PLAYING,
      });

      const tx = this.txRepo.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.SPEND_GAME,
        amount: TICKET_PRICE,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        note: 'Vé chơi - Memory Match',
      });

      await this.em.persistAndFlush([wallet, session, tx]);
      await this.em.commit();

      return { session_id: session.id, balance: wallet.balance };
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  async endMemoryMatch(sessionId: string) {
    const userId = this.currentUserId;

    const session = await this.sessionRepo.findOne({
      id: sessionId,
      user_id: userId,
    });

    if (!session) {
      throw new BadRequestException('Phiên chơi không tồn tại!');
    }

    if (session.status !== GameSessionStatus.PLAYING) {
      throw new BadRequestException('Phiên chơi đã kết thúc!');
    }

    const wallet = await this.walletRepo.findOne({ user_id: userId });
    if (!wallet) throw new BadRequestException('Ví không tồn tại');

    await this.em.begin();
    try {
      session.status = GameSessionStatus.COMPLETED;

      const balanceBefore = wallet.balance;
      wallet.balance += REWARD_AMOUNT;

      const tx = this.txRepo.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.EARN_GAME,
        amount: REWARD_AMOUNT,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        note: 'Thắng Game - Memory Match',
      });

      await this.em.persistAndFlush([session, wallet, tx]);
      await this.em.commit();

      return { success: true, reward: REWARD_AMOUNT, balance: wallet.balance };
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  // ==========================================
  // STRIKERS 1945 (Bắn Máy Bay)
  // ==========================================

  async startStrikers() {
    const userId = this.currentUserId;

    let wallet = await this.walletRepo.findOne({ user_id: userId });
    if (!wallet) {
      wallet = this.walletRepo.create({ user_id: userId, balance: 0 });
      await this.em.persistAndFlush(wallet);
    }

    if (wallet.balance < TICKET_PRICE) {
      throw new BadRequestException('Không đủ Ngọc Vàng để chơi (Cần 10💎)');
    }

    await this.em.begin();
    try {
      const balanceBefore = wallet.balance;
      wallet.balance -= TICKET_PRICE;

      const session = this.sessionRepo.create({
        user_id: userId,
        game_type: 'strikers_1945',
        status: GameSessionStatus.PLAYING,
      });

      const tx = this.txRepo.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.SPEND_GAME,
        amount: TICKET_PRICE,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        note: 'Vé chơi - Strikers 1945',
      });

      await this.em.persistAndFlush([wallet, session, tx]);
      await this.em.commit();

      return { session_id: session.id, balance: wallet.balance };
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  async endStrikers(sessionId: string, score: number) {
    const userId = this.currentUserId;

    if (score < 0 || score > 10000) {
      throw new BadRequestException('Điểm số không hợp lệ!');
    }

    const session = await this.sessionRepo.findOne({
      id: sessionId,
      user_id: userId,
    });

    if (!session) {
      throw new BadRequestException('Phiên chơi không tồn tại!');
    }

    if (
      session.status !== GameSessionStatus.PLAYING ||
      session.game_type !== 'strikers_1945'
    ) {
      throw new BadRequestException(
        'Phiên chơi không hợp lệ hoặc đã kết thúc!',
      );
    }

    const wallet = await this.walletRepo.findOne({ user_id: userId });
    if (!wallet) throw new BadRequestException('Ví không tồn tại');

    // Cứ 10 điểm = 5 ngọc
    const reward = Math.floor(score / 10) * 5;

    await this.em.begin();
    try {
      session.status = GameSessionStatus.COMPLETED;

      const balanceBefore = wallet.balance;

      if (reward > 0) {
        wallet.balance += reward;

        const tx = this.txRepo.create({
          wallet_id: wallet.id,
          user_id: userId,
          type: GemTxType.EARN_GAME,
          amount: reward,
          balance_before: balanceBefore,
          balance_after: wallet.balance,
          note: `Thưởng Strikers 1945 (${score} điểm)`,
        });
        this.em.persist(tx);
      }

      await this.em.persistAndFlush([session, wallet]);
      await this.em.commit();

      return { success: true, reward, score, balance: wallet.balance };
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }
}
