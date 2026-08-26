import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { CustomBaseEntity } from './CustomBaseEntity';
import { GemWallet } from './GemWallet';

export enum GemTxType {
  EARN_INVITE = 'earn_invite',
  EARN_LOGIN = 'earn_login',
  EARN_SPIN = 'earn_spin',
  EARN_QUEST = 'earn_quest',
  SPEND_BUY = 'spend_buy',
  TRANSFER_SEND = 'transfer_send',
  TRANSFER_RECV = 'transfer_recv',
  SPEND_GAME = 'spend_game',
  EARN_GAME = 'earn_game',
}

@Entity({ tableName: 'gem_transactions' })
export class GemTransaction extends CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', default: null })
  id: string = uuidv4();

  @Property({ type: 'uuid' })
  wallet_id: string;

  @Property({ type: 'uuid' })
  user_id: string;

  @Property({ type: 'varchar' })
  type: GemTxType;

  @Property({ type: 'int' })
  amount: number;

  @Property({ type: 'int' })
  balance_before: number;

  @Property({ type: 'int' })
  balance_after: number;

  @Property({ type: 'uuid', nullable: true, default: null })
  ref_item_id: string | null;

  @Property({ type: 'uuid', nullable: true, default: null })
  ref_user_id: string | null;

  @Property({ nullable: true, default: null })
  note: string | null;

  @ManyToOne({
    entity: () => GemWallet,
    joinColumn: 'wallet_id',
    nullable: true,
  })
  wallet?: GemWallet;
}
