import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260826000000_daily_checkin_and_spin extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. daily_check_ins
    await knex.schema.createTable('daily_check_ins', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('user_id').notNullable();
      table.date('checked_date').notNullable();
      table.integer('streak').notNullable().defaultTo(1);
      table.integer('gems_earned').notNullable();
      // Mỗi user chỉ được điểm danh 1 lần/ngày
      table.unique(['user_id', 'checked_date']);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });

    // 2. spin_histories
    await knex.schema.createTable('spin_histories', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('user_id').notNullable();
      table.integer('gems_earned').notNullable();
      table.integer('slot_index').notNullable();
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();
    await knex.schema.dropTableIfExists('spin_histories');
    await knex.schema.dropTableIfExists('daily_check_ins');
  }
}
