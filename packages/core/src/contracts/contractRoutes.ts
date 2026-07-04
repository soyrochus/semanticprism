import { r1OpenApiDocument } from "@semantic-prism/shared-contracts";
import { sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";

export function registerContractRoutes(router: Router) {
  router.get("/openapi.json", ({ res }) => {
    sendJson(res, 200, r1OpenApiDocument);
  });
}
