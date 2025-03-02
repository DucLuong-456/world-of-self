import { Migration } from '@mikro-orm/migrations';

export class Migration20250302155904 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "post_reacts" drop constraint "post_reacts_user_id_foreign";`);

    this.addSql(`alter table "post_reacts" alter column "post_id" drop default;`);
    this.addSql(`alter table "post_reacts" alter column "post_id" type uuid using ("post_id"::text::uuid);`);
    this.addSql(`alter table "post_reacts" add constraint "post_reacts_post_id_foreign" foreign key ("post_id") references "posts" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post_reacts" add constraint "post_reacts_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "post_reacts" alter column "post_id" type text using ("post_id"::text);`);

    this.addSql(`alter table "post_reacts" drop constraint "post_reacts_post_id_foreign";`);
    this.addSql(`alter table "post_reacts" drop constraint "post_reacts_user_id_foreign";`);

    this.addSql(`alter table "post_reacts" alter column "post_id" type varchar(255) using ("post_id"::varchar(255));`);
    this.addSql(`alter table "post_reacts" add constraint "post_reacts_user_id_foreign" foreign key ("user_id") references "posts" ("id") on update cascade on delete set null;`);
  }

}
