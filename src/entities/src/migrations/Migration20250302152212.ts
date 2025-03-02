import { Migration } from '@mikro-orm/migrations';

export class Migration20250302152212 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "posts" alter column "react_count" type int using ("react_count"::int);`);
    this.addSql(`alter table "posts" alter column "react_count" set default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "posts" alter column "react_count" drop default;`);
    this.addSql(`alter table "posts" alter column "react_count" type int using ("react_count"::int);`);
  }

}
