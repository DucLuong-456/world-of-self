import { PrimaryKey, Property } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { v4 as uuidv4 } from 'uuid';

export abstract class CustomBaseEntityWithDeletedAt extends CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', default: null })
  id: string = uuidv4();

  @Property({ type: 'timestamp', nullable: true, default: null })
  deletedAt?: Date | null;
}
