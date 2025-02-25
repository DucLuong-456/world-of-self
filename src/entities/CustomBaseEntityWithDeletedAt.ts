import { PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';

export abstract class CustomBaseEntityWithDeletedAt extends CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', default: null })
  id!: string;

  @Property({ type: 'timestamp', nullable: true })
  deletedAt = new Date();
}
