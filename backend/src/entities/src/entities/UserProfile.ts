import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';

@Entity({ tableName: 'user_profiles' })
export class UserProfile extends CustomBaseEntityWithDeletedAt {
  @Property({ nullable: true, default: null })
  bio: string;

  @Property({ nullable: true, default: null })
  location: string;

  @Property({ nullable: true, default: null })
  website: string;

  @Property({ nullable: true, default: null })
  date_of_birth: Date;

  @Property({ nullable: true, default: null })
  cover_avatar: string;

  @Property({ nullable: true, default: null })
  profession: string;

  @Property({ nullable: true, default: null })
  company: string;

  @Property({ nullable: true, default: null })
  education: string;

  @Property({ type: 'boolean', default: true })
  is_public: boolean;

  @Property()
  user_id: string;

  @OneToOne({
    entity: () => User,
    nullable: true,
    inversedBy: (user) => user.profile,
    joinColumn: 'user_id',
  })
  user: User;
}
