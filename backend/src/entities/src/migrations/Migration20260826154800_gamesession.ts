import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260826154800_gamesession extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    await knex.schema.createTable('game_sessions', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('user_id').notNullable();
      table.string('game_type').notNullable().defaultTo('memory_match');
      table.string('status').notNullable().defaultTo('playing');

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
    await knex.schema.dropTableIfExists('game_sessions');
  }
}
