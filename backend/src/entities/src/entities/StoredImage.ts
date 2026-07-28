import { Entity, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';

// StoredImage is still used for User avatar and cover_avatar storage.
// The Post→PostImage relationship has been moved to the PostImage entity.
@Entity({ tableName: 'stored_images' })
export class StoredImage extends CustomBaseEntityWithDeletedAt {
  @Property()
  path: string;

  @Property()
  ext: string;
}
