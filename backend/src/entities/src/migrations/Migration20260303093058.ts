import { Migration } from '@mikro-orm/migrations';

export class Migration20260303093058 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "posts" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "posts" alter column "title" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "posts" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "posts" alter column "title" set not null;`);
  }

}
