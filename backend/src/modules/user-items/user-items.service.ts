import { User } from '@entities/User';
import { UserItem, UserItemStatus } from '@entities/UserItem';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class UserItemsService {
  constructor(
    @InjectRepository(UserItem)
    private readonly userItemRepository: EntityRepository<UserItem>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get currentUserId(): string {
    return (this.request.user as User)?.id;
  }

  /** Danh sách vật phẩm đang sở hữu (status = owned) */
  async getMyItems() {
    return this.userItemRepository.find(
      { user_id: this.currentUserId, status: UserItemStatus.OWNED },
      { populate: ['item'], orderBy: { created_at: 'DESC' } },
    );
  }
}
