import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Queryable } from "./connection.js";

export async function ensureMigrationTable(db: Queryable) {
  await db.query(`
    create table if not exists schema_migrations (
      id text primary key,
      applied_at timestamptz not null default now()
    )
  `);
}

export async function runSqlMigration(db: Queryable, id: string, migrationsDir: string) {
  await ensureMigrationTable(db);
  const existing = await db.query("select id from schema_migrations where id = $1", [id]);
  if (existing.rows.length > 0) {
    return "skipped";
  }
  const sql = await readFile(join(migrationsDir, id), "utf8");
  await db.query("begin");
  try {
    await db.query(sql);
    await db.query("insert into schema_migrations (id) values ($1)", [id]);
    await db.query("commit");
    return "applied";
  } catch (error) {
    await db.query("rollback");
    throw error;
  }
}
