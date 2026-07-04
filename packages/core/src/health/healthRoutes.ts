import { sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";

export function registerHealthRoutes(router: Router) {
  router.get("/health", ({ res }) => {
    sendJson(res, 200, {
      service: "semantic-prism-core",
      status: "ok",
      time: new Date().toISOString()
    });
  });
}
