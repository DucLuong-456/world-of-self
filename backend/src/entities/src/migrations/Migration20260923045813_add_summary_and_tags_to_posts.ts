import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260923045813_add_summary_and_tags_to_posts extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();
    await knex.schema.alterTable('posts', (table) => {
      table.text('summary').nullable();
      table.specificType('tags', 'text[]').nullable();
    });
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();
    await knex.schema.alterTable('posts', (table) => {
      table.dropColumn('summary');
      table.dropColumn('tags');
    });
  }
}
