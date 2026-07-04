import { loadCoreConfig } from "./config/config.js";
import { createLogger } from "./config/logger.js";
import { registerAdapterRoutes } from "./adapters/adapterRoutes.js";
import { registerAuthRoutes } from "./auth/session.js";
import { registerContractRoutes } from "./contracts/contractRoutes.js";
import { registerExtractionRoutes } from "./extraction/extractionRoutes.js";
import { registerHealthRoutes } from "./health/healthRoutes.js";
import { createHttpServer, Router } from "./http/router.js";
import { registerAdminRoutes } from "./projects/adminRoutes.js";
import { registerProjectRoutes } from "./projects/projectRoutes.js";
import { SeedStore } from "./projects/seedStore.js";
import { registerSemanticQueryRoutes } from "./semantic/queryRoutes.js";
import { registerSnapshotRoutes } from "./snapshots/snapshotRoutes.js";

export function createCoreApp(config = loadCoreConfig()) {
  const logger = createLogger();
  const router = new Router();
  const store = new SeedStore();

  registerHealthRoutes(router);
  registerContractRoutes(router);
  registerAuthRoutes(router, store, config.jwtSecret);
  registerAdminRoutes(router, store, config.jwtSecret);
  registerProjectRoutes(router, store, config.jwtSecret);
  registerAdapterRoutes(router, store, config.jwtSecret);
  registerSnapshotRoutes(router, store, config.jwtSecret);
  registerExtractionRoutes(router, store, config.jwtSecret, config);
  registerSemanticQueryRoutes(router, store, config.jwtSecret);

  return {
    config,
    logger,
    router,
    store,
    server: createHttpServer(router, logger)
  };
}
