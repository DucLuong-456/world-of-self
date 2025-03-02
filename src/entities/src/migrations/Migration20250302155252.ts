import { Migration } from '@mikro-orm/migrations';

export class Migration20250302155252 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "post_reacts" ("user_id" uuid not null, "post_id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "post_reacts_pkey" primary key ("user_id", "post_id"));`);

    this.addSql(`alter table "post_reacts" add constraint "post_reacts_user_id_foreign" foreign key ("user_id") references "posts" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "post_reacts" cascade;`);
  }

}
