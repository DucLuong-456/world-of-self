import { PrimaryKey } from '@mikro-orm/core';
import { CustomBaseEntity } from './CustomBaseEntity';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseWithPrimaryKey extends CustomBaseEntity {
  @PrimaryKey({ type: 'uuid', default: null })
  id: string = uuidv4();
}
