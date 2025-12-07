import { FriendshipStatus } from '@constants/friendshipStatus';
import { User } from '@entities/User';
import { UserRelationship } from '@entities/UserRelationship';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { SearchFriendDto } from './dto/search-friend.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserRelationship)
    private readonly userRelationshipRepository: EntityRepository<UserRelationship>,
    private em: EntityManager,
  ) {}

  async getFriends(userId: string, data: SearchFriendDto) {
    const limit = data?.limit || 5;
    const page = data?.page || 1;
    const { q } = data;

    const qb = this.em
      .createQueryBuilder(UserRelationship, 'ur')
      .select('*')
      .leftJoin('ur.friend', 'friend')
      .where({
        user: { id: userId },
        deleted_at: null,
        status: FriendshipStatus.ACCEPTED,
      });

    if (q) {
      qb.andWhere({ 'friend.user_name': { $ilike: `%${q}%` } });
    }

    const relationships = await qb.execute();

    return {
      relationships,
      paging: {
        limit: limit,
        page: page,
        totalCount: relationships.length,
      },
    };
  }

  async findAll(data: GetUsersDto) {
    const limit = Number(data?.limit || 5);
    const page = Number(data?.page || 1);

    const whereCondition = data?.q
      ? {
          $or: [
            { user_name: { $ilike: `%${data.q}%` } },
            { email: { $ilike: `%${data.q}%` } },
            { phone: { $ilike: `%${data.q}%` } },
          ],
        }
      : {};
    const [users, totalCount] = await this.userRepository.findAndCount(
      whereCondition,
      {
        limit: limit,
        offset: (page - 1) * limit,
      },
    );

    return {
      users,
      paging: {
        limit: limit,
        page: page,
        totalCount,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneOrFail(
      {
        id: id,
      },
      {
        populate: ['posts'],
        failHandler: () => {
          throw new NotFoundException('user not found!');
        },
      },
    );

    return user;
  }
}
