import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCoreConfig } from "../config/config.js";
import { createPostgresConnection } from "../db/connection.js";
import { runSqlMigration } from "../db/migrations.js";

const migrations = ["001_auth_projects.sql", "002_adapters.sql", "003_snapshots_artefacts.sql", "004_semantic_store.sql", "005_extraction_jobs.sql"];
const config = loadCoreConfig();
const db = await createPostgresConnection(config.databaseUrl);
const currentDir = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(currentDir, "../../migrations");

try {
  for (const migration of migrations) {
    const result = await runSqlMigration(db, migration, migrationsDir);
    console.log(`${migration}: ${result}`);
  }
} finally {
  await db.close();
}
