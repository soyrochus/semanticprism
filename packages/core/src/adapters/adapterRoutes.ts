import { forbiddenR1Capabilities } from "@semantic-prism/shared-contracts";
import { requireProjectAccess, requireProjectManager } from "../auth/authorization.js";
import { readJson, sendError, sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";
import type { SeedStore } from "../projects/seedStore.js";

export function registerAdapterRoutes(router: Router, store: SeedStore, jwtSecret: string) {
  router.get("/adapter-definitions", (context) => {
    sendJson(context.res, 200, { adapters: store.adapterDefinitions });
  });

  router.get("/projects/:projectId/adapter-bindings", (context) => {
    const user = requireProjectAccess(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    sendJson(context.res, 200, {
      bindings: store.adapterBindings.filter((binding) => binding.projectId === context.params.projectId)
    });
  });

  router.post("/projects/:projectId/adapter-bindings", async (context) => {
    const user = requireProjectManager(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    const body = await readJson<{ repositoryUrl?: string; branch?: string; rootPath?: string }>(context.req);
    const binding = {
      id: `bind-${Date.now()}`,
      projectId: context.params.projectId,
      adapterDefinitionId: "adp-java-struts",
      repositoryUrl: body.repositoryUrl ?? "/sample-struts-repo",
      branch: body.branch ?? "main",
      rootPath: body.rootPath ?? ".",
      credentialsRef: null,
      status: "ready" as const
    };
    store.adapterBindings.push(binding);
    sendJson(context.res, 201, { binding });
  });

  router.post("/projects/:projectId/unsupported-capability", async (context) => {
    const body = await readJson<{ capability?: string }>(context.req);
    if (body.capability && forbiddenR1Capabilities.includes(body.capability as never)) {
      sendError(context.res, 400, "unsupported_capability", `${body.capability} is not executable in R1`);
      return;
    }
    sendError(context.res, 400, "unsupported_capability", "Only read-only R1 adapter capabilities are executable");
  });
}
