import { GemTransaction, GemTxType } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { InviteCode } from '@entities/InviteCode';
import { InviteCodeUsage } from '@entities/InviteCodeUsage';
import { User } from '@entities/User';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { RedeemInviteCodeDto } from './dto/redeem-invite-code.dto';
import { TransferGemDto } from './dto/transfer-gem.dto';

@Injectable()
export class GemWalletService {
  constructor(
    @InjectRepository(GemWallet)
    private readonly walletRepository: EntityRepository<GemWallet>,
    @InjectRepository(GemTransaction)
    private readonly transactionRepository: EntityRepository<GemTransaction>,
    @InjectRepository(InviteCode)
    private readonly inviteCodeRepository: EntityRepository<InviteCode>,
    @InjectRepository(InviteCodeUsage)
    private readonly inviteCodeUsageRepository: EntityRepository<InviteCodeUsage>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get currentUserId(): string {
    return (this.request.user as User)?.id;
  }

  /** Lấy ví của user hiện tại (auto-create nếu chưa có) */
  async getMyWallet() {
    const userId = this.currentUserId;
    let wallet = await this.walletRepository.findOne({ user_id: userId });
    if (!wallet) {
      wallet = this.walletRepository.create({ user_id: userId, balance: 0 });
      await this.em.persistAndFlush(wallet);
    }
    return wallet;
  }

  /** Lịch sử giao dịch của user hiện tại */
  async getMyTransactions(page = 1, limit = 20) {
    const wallet = await this.getMyWallet();
    const [transactions, totalCount] =
      await this.transactionRepository.findAndCount(
        { wallet_id: wallet.id },
        {
          orderBy: { created_at: 'DESC' },
          limit,
          offset: (page - 1) * limit,
        },
      );
    return { transactions, paging: { page, limit, totalCount } };
  }

  /** Nhập invite code — tặng Ngọc Vàng cho user */
  async redeemInviteCode(dto: RedeemInviteCodeDto) {
    const userId = this.currentUserId;
    const code = dto.code.trim().toUpperCase();

    const inviteCode = await this.inviteCodeRepository.findOne({ code });
    if (!inviteCode || !inviteCode.is_active) {
      throw new NotFoundException(
        'Mã mời không tồn tại hoặc đã bị vô hiệu hóa.',
      );
    }
    if (
      inviteCode.max_uses !== -1 &&
      inviteCode.used_count >= inviteCode.max_uses
    ) {
      throw new BadRequestException('Mã mời đã đạt giới hạn số lượt sử dụng.');
    }

    // Kiểm tra user đã dùng code này chưa
    const alreadyUsed = await this.inviteCodeUsageRepository.findOne({
      code_id: inviteCode.id,
      user_id: userId,
    });
    if (alreadyUsed) {
      throw new BadRequestException('Bạn đã sử dụng mã mời này rồi.');
    }

    const wallet = await this.getMyWallet();

    await this.em.begin();
    try {
      const balanceBefore = wallet.balance;
      wallet.balance += inviteCode.gem_reward;

      // Ghi transaction
      const tx = this.transactionRepository.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.EARN_INVITE,
        amount: inviteCode.gem_reward,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        note: `Nhập mã mời: ${code}`,
      });

      // Ghi usage
      const usage = this.inviteCodeUsageRepository.create({
        code_id: inviteCode.id,
        user_id: userId,
      });

      inviteCode.used_count += 1;

      await this.em.persistAndFlush([wallet, tx, usage, inviteCode]);
      await this.em.commit();

      return { balance: wallet.balance, earned: inviteCode.gem_reward };
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }

  /** Chuyển Ngọc Vàng cho user khác */
  async transfer(dto: TransferGemDto) {
    const fromUserId = this.currentUserId;
    if (fromUserId === dto.to_user_id) {
      throw new BadRequestException(
        'Không thể chuyển Ngọc Vàng cho chính mình.',
      );
    }

    const toUser = await this.userRepository.findOne({ id: dto.to_user_id });
    if (!toUser) {
      throw new NotFoundException('Người nhận không tồn tại.');
    }

    const fromWallet = await this.getMyWallet();
    if (fromWallet.balance < dto.amount) {
      throw new BadRequestException('Số dư Ngọc Vàng không đủ.');
    }

    // Auto-create ví cho người nhận nếu chưa có
    let toWallet = await this.walletRepository.findOne({
      user_id: dto.to_user_id,
    });
    if (!toWallet) {
      toWallet = this.walletRepository.create({
        user_id: dto.to_user_id,
        balance: 0,
      });
      await this.em.persist(toWallet);
    }

    await this.em.begin();
    try {
      const fromBefore = fromWallet.balance;
      fromWallet.balance -= dto.amount;

      const toBefore = toWallet.balance;
      toWallet.balance += dto.amount;

      const sendTx = this.transactionRepository.create({
        wallet_id: fromWallet.id,
        user_id: fromUserId,
        type: GemTxType.TRANSFER_SEND,
        amount: dto.amount,
        balance_before: fromBefore,
        balance_after: fromWallet.balance,
        ref_user_id: dto.to_user_id,
        note: `Chuyển Ngọc cho ${toUser.user_name}`,
      });

      const recvTx = this.transactionRepository.create({
        wallet_id: toWallet.id,
        user_id: dto.to_user_id,
        type: GemTxType.TRANSFER_RECV,
        amount: dto.amount,
        balance_before: toBefore,
        balance_after: toWallet.balance,
        ref_user_id: fromUserId,
        note: `Nhận Ngọc từ ${(this.request.user as User)?.user_name}`,
      });

      await this.em.persistAndFlush([fromWallet, toWallet, sendTx, recvTx]);
      await this.em.commit();

      return { balance: fromWallet.balance, transferred: dto.amount };
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }
}
