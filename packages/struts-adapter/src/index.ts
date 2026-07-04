import { loadAdapterConfig } from "./config/config.js";
import { createStrutsAdapterApp } from "./app.js";

const config = loadAdapterConfig();
const server = createStrutsAdapterApp(config.defaultRepositoryRoot);

server.listen(config.port, config.host, () => {
  console.log(
    JSON.stringify({
      level: "info",
      message: "Struts adapter listening",
      host: config.host,
      port: config.port,
      time: new Date().toISOString()
    })
  );
});
