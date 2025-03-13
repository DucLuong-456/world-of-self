import { Migration } from '@mikro-orm/migrations';

export class Migration20250309161548 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "daily_scores" alter column "total_points" type int using ("total_points"::int);`);
    this.addSql(`alter table "daily_scores" alter column "total_points" set default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "daily_scores" alter column "total_points" drop default;`);
    this.addSql(`alter table "daily_scores" alter column "total_points" type int using ("total_points"::int);`);
  }

}
