import { User } from '@entities/User';
import { UserRelationship } from '@entities/UserRelationship';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(UserRelationship)
    private readonly userRelationshipRepository: EntityRepository<UserRelationship>,
    private em: EntityManager,
  ) {}

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    return user;
  }
}
