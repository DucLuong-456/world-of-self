import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';
import { GemTransaction } from './GemTransaction';

@Entity({ tableName: 'gem_wallets' })
export class GemWallet extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'uuid' })
  user_id: string;

  @Property({ type: 'int', default: 0 })
  balance: number;

  @ManyToOne({ entity: () => User, joinColumn: 'user_id', nullable: true })
  user?: User;

  @OneToMany({ entity: () => GemTransaction, mappedBy: (t) => t.wallet })
  transactions = new Collection<GemTransaction>(this);
}
