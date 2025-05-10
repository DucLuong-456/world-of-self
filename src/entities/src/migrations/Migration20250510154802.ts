import { Migration } from '@mikro-orm/migrations';

export class Migration20250510154802 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "stored_images" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "path" varchar(255) not null, "ext" varchar(255) not null, constraint "stored_images_pkey" primary key ("id"));`);

    this.addSql(`create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "user_name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) null, "password" varchar(255) not null, "avatar" varchar(255) null, "role" varchar(255) not null default 'user', constraint "users_pkey" primary key ("id"));`);

    this.addSql(`create table "posts" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "title" varchar(255) not null, "react_count" int not null default 0, "user_id" varchar(255) not null, "category" varchar(255) null, "stored_image_id" uuid not null, "activity_id" uuid null, constraint "posts_pkey" primary key ("id"));`);
    this.addSql(`alter table "posts" add constraint "posts_stored_image_id_unique" unique ("stored_image_id");`);

    this.addSql(`create table "post_reacts" ("user_id" uuid not null, "post_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "post_reacts_pkey" primary key ("user_id", "post_id"));`);

    this.addSql(`create table "user_relationships" ("user_id" uuid not null, "friend_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "status" varchar(255) not null default 'pending', "deleted_at" timestamptz null, constraint "user_relationships_pkey" primary key ("user_id", "friend_id"));`);

    this.addSql(`alter table "posts" add constraint "posts_activity_id_foreign" foreign key ("activity_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "posts" add constraint "posts_stored_image_id_foreign" foreign key ("stored_image_id") references "stored_images" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "post_reacts" add constraint "post_reacts_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "post_reacts" add constraint "post_reacts_post_id_foreign" foreign key ("post_id") references "posts" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "user_relationships" add constraint "user_relationships_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "user_relationships" add constraint "user_relationships_friend_id_foreign" foreign key ("friend_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "posts" drop constraint "posts_stored_image_id_foreign";`);

    this.addSql(`alter table "posts" drop constraint "posts_activity_id_foreign";`);

    this.addSql(`alter table "post_reacts" drop constraint "post_reacts_user_id_foreign";`);

    this.addSql(`alter table "user_relationships" drop constraint "user_relationships_user_id_foreign";`);

    this.addSql(`alter table "user_relationships" drop constraint "user_relationships_friend_id_foreign";`);

    this.addSql(`alter table "post_reacts" drop constraint "post_reacts_post_id_foreign";`);

    this.addSql(`drop table if exists "stored_images" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "posts" cascade;`);

    this.addSql(`drop table if exists "post_reacts" cascade;`);

    this.addSql(`drop table if exists "user_relationships" cascade;`);
  }

}
