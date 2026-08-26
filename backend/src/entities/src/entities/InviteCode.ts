import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';
import { InviteCodeUsage } from './InviteCodeUsage';

@Entity({ tableName: 'invite_codes' })
export class InviteCode extends CustomBaseEntityWithDeletedAt {
  @Property({ unique: true })
  code: string;

  @Property({ type: 'uuid', nullable: true, default: null })
  created_by: string | null;

  @Property({ type: 'int', default: 500 })
  gem_reward: number;

  @Property({ type: 'boolean', default: true })
  is_active: boolean;

  /** -1 = vô hạn */
  @Property({ type: 'int', default: -1 })
  max_uses: number;

  @Property({ type: 'int', default: 0 })
  used_count: number;

  @ManyToOne({ entity: () => User, nullable: true, joinColumn: 'created_by' })
  creator: User | null;

  @OneToMany({ entity: () => InviteCodeUsage, mappedBy: (u) => u.invite_code })
  usages = new Collection<InviteCodeUsage>(this);
}
