import { Migration } from '@mikro-orm/migrations';

export class Migration20250301162946 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "phone" type varchar(255) using ("phone"::varchar(255));`);
    this.addSql(`alter table "users" alter column "phone" drop not null;`);
    this.addSql(`alter table "users" alter column "avatar" type varchar(255) using ("avatar"::varchar(255));`);
    this.addSql(`alter table "users" alter column "avatar" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" alter column "phone" type varchar(255) using ("phone"::varchar(255));`);
    this.addSql(`alter table "users" alter column "phone" set not null;`);
    this.addSql(`alter table "users" alter column "avatar" type varchar(255) using ("avatar"::varchar(255));`);
    this.addSql(`alter table "users" alter column "avatar" set not null;`);
  }

}
