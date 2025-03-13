import { Migration } from '@mikro-orm/migrations';

export class Migration20250309145328 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user_activities" add column "total_points" int not null;`);

    this.addSql(`alter table "user_weekly_rankings" drop column "total_score", drop column "rank";`);

    this.addSql(`alter table "user_weekly_rankings" add column "week_end_date" varchar(255) not null, add column "total_weekly_points" int not null, add column "ranking" int not null;`);
    this.addSql(`alter table "user_weekly_rankings" rename column "start_date" to "week_start_date";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_activities" drop column "total_points";`);

    this.addSql(`alter table "user_weekly_rankings" drop column "week_end_date", drop column "total_weekly_points", drop column "ranking";`);

    this.addSql(`alter table "user_weekly_rankings" add column "total_score" int not null, add column "rank" int not null;`);
    this.addSql(`alter table "user_weekly_rankings" rename column "week_start_date" to "start_date";`);
  }

}
