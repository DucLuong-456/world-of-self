import { Migration } from '@mikro-orm/migrations';

export class Migration20250309151605 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "activities" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "activities" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "activities" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "activities" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "stored_images" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "stored_images" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "stored_images" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "stored_images" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "users" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "users" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "users" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "users" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "posts" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "posts" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "posts" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "posts" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "post_reacts" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "post_reacts" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "post_reacts" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "post_reacts" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "user_activities" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user_activities" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "user_activities" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "user_activities" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "user_relationships" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user_relationships" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "user_relationships" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "user_relationships" alter column "updated_at" set default 'now()';`);

    this.addSql(`alter table "user_weekly_rankings" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user_weekly_rankings" alter column "created_at" set default 'now()';`);
    this.addSql(`alter table "user_weekly_rankings" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "user_weekly_rankings" alter column "updated_at" set default 'now()';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "activities" alter column "created_at" drop default;`);
    this.addSql(`alter table "activities" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "activities" alter column "updated_at" drop default;`);
    this.addSql(`alter table "activities" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "stored_images" alter column "created_at" drop default;`);
    this.addSql(`alter table "stored_images" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "stored_images" alter column "updated_at" drop default;`);
    this.addSql(`alter table "stored_images" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "users" alter column "created_at" drop default;`);
    this.addSql(`alter table "users" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "users" alter column "updated_at" drop default;`);
    this.addSql(`alter table "users" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "posts" alter column "created_at" drop default;`);
    this.addSql(`alter table "posts" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "posts" alter column "updated_at" drop default;`);
    this.addSql(`alter table "posts" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "post_reacts" alter column "created_at" drop default;`);
    this.addSql(`alter table "post_reacts" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "post_reacts" alter column "updated_at" drop default;`);
    this.addSql(`alter table "post_reacts" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "user_activities" alter column "created_at" drop default;`);
    this.addSql(`alter table "user_activities" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user_activities" alter column "updated_at" drop default;`);
    this.addSql(`alter table "user_activities" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "user_relationships" alter column "created_at" drop default;`);
    this.addSql(`alter table "user_relationships" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user_relationships" alter column "updated_at" drop default;`);
    this.addSql(`alter table "user_relationships" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`alter table "user_weekly_rankings" alter column "created_at" drop default;`);
    this.addSql(`alter table "user_weekly_rankings" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "user_weekly_rankings" alter column "updated_at" drop default;`);
    this.addSql(`alter table "user_weekly_rankings" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
  }

}
