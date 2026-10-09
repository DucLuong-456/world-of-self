import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260924083800_add_conversations_and_messages_tables extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    // 1. Create conversations table (without FK on last_message_id yet)
    await knex.schema.createTableIfNotExists('conversations', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.string('type', 50).notNullable().defaultTo('DIRECT');
      table.string('name').nullable().defaultTo(null);
      table.text('avatar_url').nullable().defaultTo(null);
      table.uuid('last_message_id').nullable().defaultTo(null);
    });

    // 2. Create messages table
    await knex.schema.createTableIfNotExists('messages', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);
      table.uuid('conversation_id').notNullable();
      table
        .foreign('conversation_id')
        .references('id')
        .inTable('conversations')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.uuid('sender_id').notNullable();
      table
        .foreign('sender_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.text('content').nullable().defaultTo(null);
      table.string('type', 50).notNullable().defaultTo('TEXT');

      table.uuid('reply_to_id').nullable().defaultTo(null);
      table
        .foreign('reply_to_id')
        .references('id')
        .inTable('messages')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 3. Add foreign key for conversations.last_message_id -> messages.id
    await knex.schema.alterTable('conversations', (table) => {
      table
        .foreign('last_message_id')
        .references('id')
        .inTable('messages')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });

    // 4. Create conversation_members table
    await knex.schema.createTableIfNotExists(
      'conversation_members',
      (table) => {
        this.addUuidPrimaryColumn(table);
        this.addTimestampColumns(table);
        this.addSoftDeleteColumns(table);
        table.uuid('conversation_id').notNullable();
        table
          .foreign('conversation_id')
          .references('id')
          .inTable('conversations')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');

        table.uuid('user_id').notNullable();
        table
          .foreign('user_id')
          .references('id')
          .inTable('users')
          .onUpdate('CASCADE')
          .onDelete('CASCADE');

        table.string('role', 50).notNullable().defaultTo('MEMBER');

        table.uuid('last_read_message_id').nullable().defaultTo(null);
        table
          .foreign('last_read_message_id')
          .references('id')
          .inTable('messages')
          .onUpdate('CASCADE')
          .onDelete('SET NULL');

        table
          .dateTime('joined_at', { useTz: true, precision: 3 })
          .notNullable()
          .defaultTo(knex.fn.now());
      },
    );

    // Add unique index for (conversation_id, user_id) in conversation_members
    this.addSql(
      knex.raw(
        `CREATE UNIQUE INDEX conversation_members_conversation_user_unique ON conversation_members (conversation_id, user_id) WHERE deleted_at IS NULL`,
      ),
    );

    // 5. Create message_attachments table
    await knex.schema.createTableIfNotExists('message_attachments', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);

      table.uuid('message_id').notNullable();
      table
        .foreign('message_id')
        .references('id')
        .inTable('messages')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.text('file_url').notNullable();
      table.string('file_type', 100).nullable().defaultTo(null);
      table.string('file_name').nullable().defaultTo(null);
      table.integer('file_size').nullable().defaultTo(null);
    });

    // 6. Create message_reactions table
    await knex.schema.createTableIfNotExists('message_reactions', (table) => {
      this.addUuidPrimaryColumn(table);
      this.addTimestampColumns(table);
      this.addSoftDeleteColumns(table);

      table.uuid('message_id').notNullable();
      table
        .foreign('message_id')
        .references('id')
        .inTable('messages')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.uuid('user_id').notNullable();
      table
        .foreign('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.string('emoji', 50).notNullable();
    });

    // Add unique index for (message_id, user_id, emoji) in message_reactions
    this.addSql(
      knex.raw(
        `CREATE UNIQUE INDEX message_reactions_msg_user_emoji_unique ON message_reactions (message_id, user_id, emoji) WHERE deleted_at IS NULL`,
      ),
    );
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();

    await knex.schema.dropTableIfExists('message_reactions');
    await knex.schema.dropTableIfExists('message_attachments');
    await knex.schema.dropTableIfExists('conversation_members');

    // Drop FK from conversations before dropping messages table
    await knex.schema.alterTable('conversations', (table) => {
      table.dropForeign(['last_message_id']);
    });

    await knex.schema.dropTableIfExists('messages');
    await knex.schema.dropTableIfExists('conversations');
  }
}
