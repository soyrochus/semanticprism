import { createRequire } from "node:module";

export interface Queryable {
  query: (sql: string, values?: unknown[]) => Promise<{ rows: unknown[] }>;
  close: () => Promise<void>;
}

export async function createPostgresConnection(databaseUrl: string): Promise<Queryable> {
  const require = createRequire(import.meta.url);
  const pg = require("pg") as { Pool: new (config: { connectionString: string }) => { query: Queryable["query"]; end: () => Promise<void> } };
  const pool = new pg.Pool({ connectionString: databaseUrl });

  return {
    query: (sql, values) => pool.query(sql, values),
    close: () => pool.end()
  };
}
