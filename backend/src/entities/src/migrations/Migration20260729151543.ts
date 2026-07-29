import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260729151543 extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    const knex = this.getKnexBuilder();

    this.addSql(
      knex.schema
        .createTable('comments', (table) => {
          this.addUuidPrimaryColumn(table);
          this.addTimestampColumns(table);
          this.addSoftDeleteColumns(table);

          table.text('content').notNullable();

          table.uuid('post_id').notNullable();
          table
            .foreign('post_id')
            .references('id')
            .inTable('posts')
            .onUpdate('CASCADE');

          table.uuid('parent_id').nullable();
          table
            .foreign('parent_id')
            .references('id')
            .inTable('comments')
            .onUpdate('CASCADE')
            .onDelete('SET NULL');

          table.uuid('created_by').notNullable();
          table
            .foreign('created_by')
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE');
        })
        .toQuery()
    );
  }

  override async down(): Promise<void> {
    const knex = this.getKnexBuilder();
    this.addSql(knex.schema.dropTableIfExists('comments').toQuery());
  }
}
