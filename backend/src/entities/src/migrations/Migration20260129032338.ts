import { Migration } from '@mikro-orm/migrations';

export class Migration20260129032338 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_profiles" add column "cover_avatar" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_profiles" drop column "cover_avatar";`);
  }

}
