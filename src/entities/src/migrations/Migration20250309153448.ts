import { Migration } from '@mikro-orm/migrations';

export class Migration20250309153448 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "daily_scores" ("id" uuid not null, "user_id" uuid not null, "created_at" timestamptz not null default 'now()', "updated_at" timestamptz not null default 'now()', "date" varchar(255) not null, "total_points" int not null, constraint "daily_scores_pkey" primary key ("id", "user_id"));`);
    this.addSql(`alter table "daily_scores" add constraint "daily_scores_date_unique" unique ("date");`);

    this.addSql(`alter table "user_activities" drop column "total_points";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "daily_scores" cascade;`);

    this.addSql(`alter table "user_activities" add column "total_points" int not null;`);
  }

}
