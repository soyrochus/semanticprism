export interface CoreConfig {
  nodeEnv: string;
  host: string;
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  strutsAdapterUrl: string;
  sampleRepositoryPath: string;
}

export function loadCoreConfig(env: NodeJS.ProcessEnv = process.env): CoreConfig {
  return {
    nodeEnv: env.NODE_ENV ?? "development",
    host: env.CORE_HOST ?? "0.0.0.0",
    port: Number.parseInt(env.CORE_PORT ?? "4000", 10),
    jwtSecret: env.CORE_JWT_SECRET ?? "semantic-prism-r1-local-secret",
    databaseUrl: env.DATABASE_URL ?? "postgres://semantic_prism:semantic_prism@localhost:5432/semantic_prism",
    strutsAdapterUrl: env.STRUTS_ADAPTER_URL ?? "http://localhost:4100",
    sampleRepositoryPath: env.SAMPLE_REPOSITORY_PATH ?? "/sample-struts-repo"
  };
}
