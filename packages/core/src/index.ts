import { createCoreApp } from "./app.js";

const app = createCoreApp();

app.server.listen(app.config.port, app.config.host, () => {
  app.logger.info("Semantic Prism Core listening", {
    host: app.config.host,
    port: app.config.port
  });
});
