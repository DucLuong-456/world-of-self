import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260728095903_add_post_images_and_templates extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. post_templates (no dependencies)
    await knex.schema.createTableIfNotExists('post_templates', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('name').notNullable();
      table.string('bg_color').notNullable();
      table.string('text_color').notNullable();
      table.string('font_style').nullable().defaultTo(null);
    });

    // 2. post_images (depends on posts)
    await knex.schema.createTableIfNotExists('post_images', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('path').notNullable();
      table.string('ext').notNullable();
      table.integer('sort_order').notNullable().defaultTo(0);
      table.uuid('post_id').notNullable();
      table
        .foreign('post_id')
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });

    // 3. Alter posts: remove stored_image_id, add template_id
    await knex.schema.alterTable('posts', (table) => {
      table.dropForeign(['stored_image_id']);
      table.dropUnique(['stored_image_id']);
      table.dropColumn('stored_image_id');
      table.uuid('template_id').nullable().defaultTo(null);
      table
        .foreign('template_id')
        .references('id')
        .inTable('post_templates')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. Revert posts: remove template_id, re-add stored_image_id
    await knex.schema.alterTable('posts', (table) => {
      table.dropForeign(['template_id']);
      table.dropColumn('template_id');
      table.uuid('stored_image_id').notNullable().unique();
      table
        .foreign('stored_image_id')
        .references('id')
        .inTable('stored_images')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 2. Drop post_images
    await knex.schema.dropTableIfExists('post_images');

    // 3. Drop post_templates
    await knex.schema.dropTableIfExists('post_templates');
  }
}
