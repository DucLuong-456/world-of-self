import { Migration } from '@mikro-orm/migrations';

export class Migration20250510155248 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "post_reacts" add column "emotion" varchar(255) null default 'like';`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post_reacts" drop column "emotion";`);
  }
}
