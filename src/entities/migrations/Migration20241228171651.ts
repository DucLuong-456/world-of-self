import { Migration } from '@mikro-orm/migrations';

export class Migration20241228171651 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "count" int not null);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
