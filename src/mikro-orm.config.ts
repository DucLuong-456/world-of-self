import { defineConfig } from '@mikro-orm/postgresql';
import * as dotenv from 'dotenv';
import { Migrator, TSMigrationGenerator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { User } from '@entities/User';
import { Post } from '@nestjs/common';
import { PostReact } from '@entities/PostReact';
import { StoredImage } from '@entities/StoredImage';
import { UserRelationship } from '@entities/UserRelationship';
dotenv.config();

export default defineConfig({
  entities: [User, Post, PostReact, StoredImage, UserRelationship],
  entitiesTs: ['./src/entities/src/entities'],
  host: process.env.POSTGRES_HOST,
  dbName: process.env.POSTGRES_DB,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  extensions: [Migrator, SeedManager],
  allowGlobalContext: false,
  autoJoinOneToOneOwner: false,
  ignoreUndefinedInQuery: true,
  discovery: {
    checkDuplicateFieldNames: false,
  },
  autoJoinRefsForFilters: false,
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/entities/src/migrations',
    pathTs: './src/entities/src/migrations',
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
  seeder: {
    path: './dist/entities/src/seeders', // path to the folder with seeders
    pathTs: './src/entities/src/seeders', // path to the folder with TS seeders (if used, you should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
});
