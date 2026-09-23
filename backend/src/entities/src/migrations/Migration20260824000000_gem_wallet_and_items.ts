import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260824000000_gem_wallet_and_items extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. items
    await knex.schema.createTable('items', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('name').notNullable();
      table.text('description').nullable().defaultTo(null);
      table.string('image_url').nullable().defaultTo(null);
      table.integer('gem_price').notNullable();
      table.string('rarity').notNullable().defaultTo('common');
      table.boolean('is_active').notNullable().defaultTo(true);
    });

    // 2. gem_wallets (depends on users)
    await knex.schema.createTable('gem_wallets', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('user_id').notNullable().unique();
      table.integer('balance').notNullable().defaultTo(0);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });

    // 3. gem_transactions (depends on gem_wallets)
    await knex.schema.createTable('gem_transactions', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      table.uuid('wallet_id').notNullable();
      table.uuid('user_id').notNullable();
      table.string('type').notNullable();
      table.integer('amount').notNullable();
      table.integer('balance_before').notNullable();
      table.integer('balance_after').notNullable();
      table.uuid('ref_item_id').nullable().defaultTo(null);
      table.uuid('ref_user_id').nullable().defaultTo(null);
      table.string('note').nullable().defaultTo(null);
      table
        .foreign('wallet_id')
        .references('id')
        .inTable('gem_wallets')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });

    // 4. user_items (depends on users + items)
    await knex.schema.createTable('user_items', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('user_id').notNullable();
      table.uuid('item_id').notNullable();
      table.string('status').notNullable().defaultTo('owned');
      table.uuid('gifted_by').nullable().defaultTo(null);
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table
        .foreign('item_id')
        .references('id')
        .inTable('items')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    });

    // 5. invite_codes
    await knex.schema.createTable('invite_codes', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('code').notNullable().unique();
      table.uuid('created_by').nullable().defaultTo(null);
      table.integer('gem_reward').notNullable().defaultTo(500);
      table.boolean('is_active').notNullable().defaultTo(true);
      table.integer('max_uses').notNullable().defaultTo(-1);
      table.integer('used_count').notNullable().defaultTo(0);
      table
        .foreign('created_by')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 6. invite_code_usages (depends on invite_codes + users)
    await knex.schema.createTable('invite_code_usages', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      table.uuid('code_id').notNullable();
      table.uuid('user_id').notNullable();
      // Unique: mỗi user chỉ dùng 1 code 1 lần
      table.unique(['code_id', 'user_id']);
      table
        .foreign('code_id')
        .references('id')
        .inTable('invite_codes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
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
    await knex.schema.dropTableIfExists('invite_code_usages');
    await knex.schema.dropTableIfExists('invite_codes');
    await knex.schema.dropTableIfExists('user_items');
    await knex.schema.dropTableIfExists('gem_transactions');
    await knex.schema.dropTableIfExists('gem_wallets');
    await knex.schema.dropTableIfExists('items');
  }
}
