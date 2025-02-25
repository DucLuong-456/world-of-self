import { defineConfig } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
dotenv.config();

export default defineConfig({
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  host: process.env.POSTGRES_HOST,
  dbName: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  extensions: [Migrator],
  allowGlobalContext: false,
  autoJoinOneToOneOwner: false,
  ignoreUndefinedInQuery: true,
  discovery: {
    checkDuplicateFieldNames: false,
  },
  autoJoinRefsForFilters: false,
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/entities/migrations',
    pathTs: './src/entities/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
  },
});
