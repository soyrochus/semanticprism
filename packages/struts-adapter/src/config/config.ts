export interface AdapterConfig {
  host: string;
  port: number;
  defaultRepositoryRoot: string;
}

export function loadAdapterConfig(env: NodeJS.ProcessEnv = process.env): AdapterConfig {
  return {
    host: env.STRUTS_ADAPTER_HOST ?? "0.0.0.0",
    port: Number.parseInt(env.STRUTS_ADAPTER_PORT ?? "4100", 10),
    defaultRepositoryRoot: env.SAMPLE_REPOSITORY_PATH ?? "/sample-struts-repo"
  };
}
