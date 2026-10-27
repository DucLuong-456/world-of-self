import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20261009100000_add_sticker_packs_and_stickers_tables extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. Create sticker_packs table
    await knex.schema.createTableIfNotExists('sticker_packs', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('name').notNullable();
      table.text('description').nullable().defaultTo(null);
      table.text('icon_url').nullable().defaultTo(null);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.integer('sort_order').notNullable().defaultTo(0);
    });

    // 2. Create stickers table
    await knex.schema.createTableIfNotExists('stickers', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('pack_id').notNullable();
      table
        .foreign('pack_id')
        .references('id')
        .inTable('sticker_packs')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.string('name').nullable().defaultTo(null);
      table.text('image_url').notNullable();
      table.integer('sort_order').notNullable().defaultTo(0);
    });
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();
    await knex.schema.dropTableIfExists('stickers');
    await knex.schema.dropTableIfExists('sticker_packs');
  }
}
