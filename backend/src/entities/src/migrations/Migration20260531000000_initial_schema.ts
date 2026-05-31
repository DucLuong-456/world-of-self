import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260531000000_initial_schema extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. stored_images
    await knex.schema.createTable('stored_images', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('path').notNullable();
      table.string('ext').notNullable();
    });

    // 2. users
    await knex.schema.createTable('users', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('user_name').notNullable();
      table.string('email').notNullable();
      table.string('phone').nullable().defaultTo(null);
      table.string('password').notNullable();
      table.string('avatar').nullable().defaultTo(null);
      table.string('role').notNullable().defaultTo('user');
    });

    // 3. posts (depends on users, stored_images)
    await knex.schema.createTable('posts', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('title').nullable().defaultTo(null);
      table.string('content').notNullable();
      table.integer('react_count').notNullable().defaultTo(0);
      table.uuid('user_id').notNullable();
      table.string('category').nullable().defaultTo(null);
      table.uuid('stored_image_id').notNullable().unique();
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table
        .foreign('stored_image_id')
        .references('id')
        .inTable('stored_images')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 4. post_reacts (depends on users, posts) — composite PK
    await knex.schema.createTable('post_reacts', (table) => {
      table.uuid('user_id').notNullable();
      table.uuid('post_id').notNullable();
      this.addTimestampColumns(table);
      table.string('emotion').nullable().defaultTo('like');
      table.primary(['user_id', 'post_id']);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table
        .foreign('post_id')
        .references('id')
        .inTable('posts')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 5. user_profiles (depends on users)
    await knex.schema.createTable('user_profiles', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('bio').nullable().defaultTo(null);
      table.string('location').nullable().defaultTo(null);
      table.string('website').nullable().defaultTo(null);
      table.dateTime('date_of_birth', { useTz: true }).nullable().defaultTo(null);
      table.string('cover_avatar').nullable().defaultTo(null);
      table.string('profession').nullable().defaultTo(null);
      table.string('company').nullable().defaultTo(null);
      table.string('education').nullable().defaultTo(null);
      table.boolean('is_public').notNullable().defaultTo(true);
      table.uuid('user_id').notNullable().unique();
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 6. user_relationships (depends on users) — composite PK
    await knex.schema.createTable('user_relationships', (table) => {
      table.uuid('user_id').notNullable();
      table.uuid('friend_id').notNullable();
      this.addTimestampColumns(table);
      table.string('status').notNullable().defaultTo('pending');
      table.dateTime('deleted_at', { useTz: true, precision: 3 }).nullable();
      table.primary(['user_id', 'friend_id']);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table
        .foreign('friend_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();

    // Drop in reverse dependency order
    await knex.schema.dropTableIfExists('user_relationships');
    await knex.schema.dropTableIfExists('user_profiles');
    await knex.schema.dropTableIfExists('post_reacts');
    await knex.schema.dropTableIfExists('posts');
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('stored_images');
  }
}
