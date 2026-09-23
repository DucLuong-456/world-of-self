import { Migration } from '@mikro-orm/migrations';
import { Knex } from 'knex';

export class MigrationWithTimestamps extends Migration {
  getKnexBuilder() {
    return this.ctx ?? this.driver.getConnection('write').getKnex();
  }

  addSerialPrimaryColumn(tableBuilder: Knex.CreateTableBuilder) {
    tableBuilder.increments('id', { primaryKey: true });
  }

  addUuidPrimaryColumn(tableBuilder: Knex.CreateTableBuilder) {
    tableBuilder
      .uuid('id')
      .primary()
      .notNullable()
      .defaultTo(this.getKnex().raw('gen_random_uuid()'));
  }

  addTimestampColumns(tableBuilder: Knex.CreateTableBuilder): void {
    const knex = this.getKnex();
    tableBuilder
      .dateTime('created_at', { useTz: true, precision: 3 })
      .nullable()
      .defaultTo(knex.fn.now());
    tableBuilder
      .dateTime('updated_at', { useTz: true, precision: 3 })
      .nullable()
      .defaultTo(knex.fn.now());
  }

  addSoftDeleteColumns(tableBuilder: Knex.CreateTableBuilder): void {
    tableBuilder
      .dateTime('deleted_at', { useTz: true, precision: 3 })
      .nullable();
  }

  addActorColumns(tableBuilder: Knex.CreateTableBuilder): void {
    tableBuilder
      .integer('created_by')
      .nullable()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('set null')
      .onUpdate('CASCADE');
    tableBuilder
      .integer('updated_by')
      .nullable()
      .index()
      .references('id')
      .inTable('users')
      .onDelete('set null')
      .onUpdate('CASCADE');
  }

  createUniqueIndex(options: {
    tableName: string;
    column: string;
    hasSoftDelete?: boolean;
    nullable?: boolean;
    additionalConditions?: string[];
  }) {
    const knex = this.getKnex();
    let sqlRaw = `CREATE UNIQUE INDEX ${options.tableName}_${options.column}_unique_constraint ON ${options.tableName} (${options.column})`;
    const conditions: string[] = [];
    if (options.hasSoftDelete) {
      conditions.push('deleted_at IS NULL');
    }
    if (options.nullable) {
      conditions.push(`${options.column} IS NOT NULL`);
    }
    if (options.additionalConditions) {
      conditions.push(...options.additionalConditions);
    }
    if (conditions.length) {
      sqlRaw += ` WHERE ${conditions.join(' and ')}`;
    }
    this.addSql(knex.raw(sqlRaw));
  }

  renameIndex(oldIndexName: string, newIndexName: string) {
    this.addSql(
      this.getKnex().raw(
        `ALTER INDEX ${oldIndexName} RENAME TO ${newIndexName}`,
      ),
    );
  }

  renameSequence(oldSequenceName: string, newSequenceName: string) {
    this.addSql(
      this.getKnex().raw(
        `ALTER SEQUENCE ${oldSequenceName} RENAME TO ${newSequenceName}`,
      ),
    );
  }

  renameTable(oldTableName: string, newTableName: string) {
    this.addSql(
      this.getKnex().raw(
        `ALTER TABLE ${oldTableName} RENAME TO ${newTableName}`,
      ),
    );
  }

  renameConstraint(
    tableName: string,
    oldConstraint: string,
    newConstraint: string,
  ) {
    this.addSql(
      this.getKnex().raw(
        `ALTER TABLE ${tableName} RENAME CONSTRAINT ${oldConstraint} TO ${newConstraint}`,
      ),
    );
  }

  renameColumn(tableName: string, oldColumn: string, newColumn: string) {
    this.addSql(
      this.getKnex().raw(
        `ALTER TABLE ${tableName} RENAME COLUMN ${oldColumn} TO ${newColumn}`,
      ),
    );
  }

  down(): Promise<any> {
    return Promise.resolve(undefined);
  }

  up(): Promise<any> {
    return Promise.resolve(undefined);
  }
}
