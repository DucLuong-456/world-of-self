import { PrimaryKey } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';

export abstract class BaseWithPrimaryKey extends CustomBaseEntity {
  @PrimaryKey()
  id!: number;
}
