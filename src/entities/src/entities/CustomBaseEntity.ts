import { BaseEntity, Property } from '@mikro-orm/core';

export class CustomBaseEntity extends BaseEntity {
  @Property({ type: 'timestamp' })
  createdAt = new Date();

  @Property({ type: 'timestamp', onUpdate: () => new Date() })
  updatedAt = new Date();
}
