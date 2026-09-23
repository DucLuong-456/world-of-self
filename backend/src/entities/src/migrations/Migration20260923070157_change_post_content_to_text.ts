import { MigrationWithTimestamps } from '../migration-with-timestamps';

export class Migration20260923070157_change_post_content_to_text extends MigrationWithTimestamps {
  override async up(): Promise<void> {
    this.addSql(
      `ALTER TABLE posts ALTER COLUMN content TYPE text USING content::text`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `ALTER TABLE posts ALTER COLUMN content TYPE character varying(255) USING content::character varying`,
    );
  }
}
