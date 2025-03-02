import { Migration } from '@mikro-orm/migrations';

export class Migration20250301161626 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "activities" drop constraint if exists "activities_type_check";`);

    this.addSql(`alter table "users" drop constraint if exists "users_role_check";`);

    this.addSql(`alter table "posts" drop constraint if exists "posts_category_check";`);

    this.addSql(`alter table "activities" alter column "type" type varchar(255) using ("type"::varchar(255));`);
    this.addSql(`alter table "activities" alter column "type" drop not null;`);

    this.addSql(`alter table "users" alter column "role" type varchar(255) using ("role"::varchar(255));`);
    this.addSql(`alter table "users" alter column "role" set default 'user';`);

    this.addSql(`alter table "posts" alter column "category" type varchar(255) using ("category"::varchar(255));`);
    this.addSql(`alter table "posts" alter column "category" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "activities" alter column "type" type text using ("type"::text);`);
    this.addSql(`alter table "activities" alter column "type" set not null;`);
    this.addSql(`alter table "activities" add constraint "activities_type_check" check("type" in ('post', 'invite_friend', 'check_in'));`);

    this.addSql(`alter table "posts" alter column "category" type text using ("category"::text);`);
    this.addSql(`alter table "posts" alter column "category" set not null;`);
    this.addSql(`alter table "posts" add constraint "posts_category_check" check("category" in ('news', 'technology', 'entertainment'));`);

    this.addSql(`alter table "users" alter column "role" drop default;`);
    this.addSql(`alter table "users" alter column "role" type text using ("role"::text);`);
    this.addSql(`alter table "users" add constraint "users_role_check" check("role" in ('user', 'admin', 'staff'));`);
  }

}
