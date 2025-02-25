import { Migration } from '@mikro-orm/migrations';

export class Migration20241229032042 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop column "count";`);

    this.addSql(`alter table "user" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null, add column "name" varchar(255) not null, add column "email" varchar(255) not null, add column "password" varchar(255) not null, add column "role" text check ("role" in ('user', 'admin', 'staff')) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "created_at", drop column "updated_at", drop column "name", drop column "email", drop column "password", drop column "role";`);

    this.addSql(`alter table "user" add column "count" int not null;`);
  }

}
