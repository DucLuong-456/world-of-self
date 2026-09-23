import { GemTransaction, GemTxType } from '@entities/GemTransaction';
import { GemWallet } from '@entities/GemWallet';
import { Item } from '@entities/Item';
import { User } from '@entities/User';
import { UserItem, UserItemStatus } from '@entities/UserItem';
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
import { CreateItemDto } from './dto/create-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: EntityRepository<Item>,
    @InjectRepository(GemWallet)
    private readonly walletRepository: EntityRepository<GemWallet>,
    @InjectRepository(GemTransaction)
    private readonly transactionRepository: EntityRepository<GemTransaction>,
    @InjectRepository(UserItem)
    private readonly userItemRepository: EntityRepository<UserItem>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get currentUserId(): string {
    return (this.request.user as User)?.id;
  }

  /** Danh sách vật phẩm đang active trong shop */
  async getItems() {
    return this.itemRepository.findAll({
      where: { is_active: true, deletedAt: null },
      orderBy: { gem_price: 'ASC' },
    });
  }

  /** Chi tiết 1 vật phẩm */
  async getItem(id: string) {
    const item = await this.itemRepository.findOne({ id, is_active: true });
    if (!item) throw new NotFoundException('Vật phẩm không tồn tại.');
    return item;
  }

  /** Tạo vật phẩm mới (Admin) */
  async createItem(dto: CreateItemDto) {
    const item = this.itemRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      image_url: dto.image_url ?? null,
      gem_price: dto.gem_price,
      rarity: dto.rarity,
      is_active: true,
    });
    await this.em.persistAndFlush(item);
    return item;
  }

  /** Mua vật phẩm: trừ Ngọc Vàng, tạo UserItem */
  async buyItem(itemId: string) {
    const userId = this.currentUserId;

    const item = await this.itemRepository.findOne({
      id: itemId,
      is_active: true,
    });
    if (!item)
      throw new NotFoundException(
        'Vật phẩm không tồn tại hoặc không khả dụng.',
      );

    let wallet = await this.walletRepository.findOne({ user_id: userId });
    if (!wallet) {
      wallet = this.walletRepository.create({ user_id: userId, balance: 0 });
      await this.em.persist(wallet);
    }

    if (wallet.balance < item.gem_price) {
      throw new BadRequestException(
        `Số dư Ngọc Vàng không đủ. Cần ${item.gem_price} 💎, bạn có ${wallet.balance} 💎.`,
      );
    }

    await this.em.begin();
    try {
      const balanceBefore = wallet.balance;
      wallet.balance -= item.gem_price;

      const tx = this.transactionRepository.create({
        wallet_id: wallet.id,
        user_id: userId,
        type: GemTxType.SPEND_BUY,
        amount: item.gem_price,
        balance_before: balanceBefore,
        balance_after: wallet.balance,
        ref_item_id: item.id,
        note: `Mua vật phẩm: ${item.name}`,
      });

      const userItem = this.userItemRepository.create({
        user_id: userId,
        item_id: item.id,
        status: UserItemStatus.OWNED,
        gifted_by: null,
      });

      await this.em.persistAndFlush([wallet, tx, userItem]);
      await this.em.commit();

      return { user_item: userItem, balance: wallet.balance };
    } catch (error) {
      await this.em.rollback();
      throw error;
    }
  }
}
