import { sendError, sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";
import { requireAuth } from "../auth/session.js";
import { requireProjectAccess } from "../auth/authorization.js";
import type { SeedStore } from "./seedStore.js";

export function registerProjectRoutes(router: Router, store: SeedStore, jwtSecret: string) {
  router.get("/projects", (context) => {
    const user = requireAuth(context, store, jwtSecret);
    if (!user) {
      return;
    }
    sendJson(context.res, 200, { projects: store.listProjectsForUser(user.id) });
  });

  router.get("/projects/:projectId", (context) => {
    const user = requireProjectAccess(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    const projectId = context.params.projectId;
    const project = store.getProject(projectId);
    if (!project) {
      sendError(context.res, 404, "not_found", "Project not found");
      return;
    }
    sendJson(context.res, 200, { project, role: user.memberships[projectId] ?? "admin" });
  });

  router.get("/projects/:projectId/status", (context) => {
    const user = requireProjectAccess(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    const projectId = context.params.projectId;
    sendJson(context.res, 200, { status: store.getProjectStatus(projectId) });
  });
}
