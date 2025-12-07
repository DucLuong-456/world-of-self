import { BaseEntity, Property } from '@mikro-orm/core';

export class CustomBaseEntity extends BaseEntity {
  @Property({ type: 'timestamp' })
  created_at = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updated_at = new Date();
}
