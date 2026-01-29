import { Migration } from '@mikro-orm/migrations';

export class Migration20260126104511 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_profiles" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "bio" varchar(255) null, "location" varchar(255) null, "website" varchar(255) null, "date_of_birth" timestamptz null, "profession" varchar(255) null, "company" varchar(255) null, "education" varchar(255) null, "is_public" boolean not null default true, "user_id" uuid not null, constraint "user_profiles_pkey" primary key ("id"));`);
    this.addSql(`alter table "user_profiles" add constraint "user_profiles_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "user_profiles" add constraint "user_profiles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_profiles" cascade;`);
  }

}
