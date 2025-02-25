import { Migration } from '@mikro-orm/migrations';

export class Migration20250220045759 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "activities" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "score" int not null, "type" text check ("type" in ('post', 'invite_friend')) not null, constraint "activities_pkey" primary key ("id"));`);

    this.addSql(`create table "posts" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "image_id" varchar(255) not null, "title" varchar(255) not null, "react_count" int not null, "user_id" varchar(255) not null, "category" text check ("category" in ('news', 'technology', 'entertainment')) not null, constraint "posts_pkey" primary key ("id"));`);

    this.addSql(`create table "stored_images" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "path" varchar(255) not null, "ext" varchar(255) not null, constraint "stored_images_pkey" primary key ("id"));`);

    this.addSql(`create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "user_name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "password" varchar(255) not null, "avatar" varchar(255) not null, "role" text check ("role" in ('user', 'admin', 'staff')) not null, constraint "users_pkey" primary key ("id"));`);

    this.addSql(`create table "user_activities" ("user_id" uuid not null, "activity_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "date" varchar(255) not null, constraint "user_activities_pkey" primary key ("user_id", "activity_id"));`);

    this.addSql(`create table "user_relationships" ("user_id" uuid not null, "friend_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_relationships_pkey" primary key ("user_id", "friend_id"));`);

    this.addSql(`create table "user_weekly_rankings" ("id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz not null, "start_date" varchar(255) not null, "total_score" int not null, "rank" int not null, "status" text check ("status" in ('completed', 'unCompleted')) not null, constraint "user_weekly_rankings_pkey" primary key ("id", "user_id"));`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" text check ("role" in ('user', 'admin', 'staff')) not null);`);

    this.addSql(`drop table if exists "activities" cascade;`);

    this.addSql(`drop table if exists "posts" cascade;`);

    this.addSql(`drop table if exists "stored_images" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "user_activities" cascade;`);

    this.addSql(`drop table if exists "user_relationships" cascade;`);

    this.addSql(`drop table if exists "user_weekly_rankings" cascade;`);
  }

}
