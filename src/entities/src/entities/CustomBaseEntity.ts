import { BaseEntity, Property } from '@mikro-orm/core';

export class CustomBaseEntity extends BaseEntity {
  @Property({ type: 'timestamp', default: 'now()' })
  createdAt = new Date();

  @Property({ type: 'timestamp', default: 'now()', onUpdate: () => new Date() })
  updatedAt = new Date();
}
