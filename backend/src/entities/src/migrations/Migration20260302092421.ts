import { Migration } from '@mikro-orm/migrations';

export class Migration20260302092421 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "posts" alter column "user_id" drop default;`);
    this.addSql(`alter table "posts" alter column "user_id" type uuid using ("user_id"::text::uuid);`);
    this.addSql(`alter table "posts" add constraint "posts_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "posts" alter column "user_id" type text using ("user_id"::text);`);

    this.addSql(`alter table "posts" drop constraint "posts_user_id_foreign";`);

    this.addSql(`alter table "posts" alter column "user_id" type varchar(255) using ("user_id"::varchar(255));`);
  }

}
