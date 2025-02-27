import { FriendshipStatus } from '@constants/friendshipStatus';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchFriendDto } from './dto/search-friend.dto';
import { User } from '@entities/User';
import { UserRelationship } from '@entities/UserRelationship';
import { PaginationDto } from '@dtos/pagination.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

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
    const { keyword } = data;

    const qb = this.em
      .createQueryBuilder(UserRelationship, 'ur')
      .select('*')
      .leftJoin('ur.friend', 'friend')
      .where({
        user: { id: userId },
        deleted_at: null,
        status: FriendshipStatus.ACCEPTED,
      });

    if (keyword) {
      qb.andWhere({ 'friend.user_name': { $ilike: `%${keyword}%` } });
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

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    if (user) {
      throw new NotFoundException('user already exists');
    }

    const newUser = this.userRepository.create(createUserDto);
    await this.em.persistAndFlush(newUser);

    return newUser;
  }

  async findAll(data: PaginationDto) {
    const limit = data?.limit || 5;
    const page = data?.page || 1;
    const [users, totalCount] = await this.userRepository.findAndCount(
      {},
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
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('user already exists');
    }
    return user;
  }
}
