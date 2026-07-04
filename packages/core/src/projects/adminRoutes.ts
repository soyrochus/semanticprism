import type { R1Role } from "@semantic-prism/shared-contracts";
import { isR1Role, requireAdmin } from "../auth/authorization.js";
import { readJson, sendError, sendJson, sendNoContent } from "../http/response.js";
import type { Router } from "../http/router.js";
import type { SeedStore } from "./seedStore.js";

interface CreateUserBody {
  email?: string;
  displayName?: string;
  roles?: string[];
  password?: string;
}

interface CreateProjectBody {
  slug?: string;
  name?: string;
  description?: string;
}

interface MembershipBody {
  userId?: string;
  role?: string;
}

export function registerAdminRoutes(router: Router, store: SeedStore, jwtSecret: string) {
  router.get("/admin/users", (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, { users: store.listUsers() });
  });

  router.post("/admin/users", async (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    const body = await readJson<CreateUserBody>(context.req);
    if (!body.email || !body.displayName) {
      sendError(context.res, 400, "invalid_request", "email and displayName are required");
      return;
    }
    const roles = validateRoles(body.roles ?? ["viewer"]);
    if (!roles) {
      sendError(context.res, 400, "invalid_role", "roles must be valid R1 roles");
      return;
    }
    try {
      const user = store.createUser({
        email: body.email,
        displayName: body.displayName,
        roles,
        password: body.password
      });
      sendJson(context.res, 201, { user });
    } catch (error) {
      sendError(context.res, 409, "conflict", error instanceof Error ? error.message : "User conflict");
    }
  });

  router.get("/admin/projects", (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, { projects: store.listAllProjects() });
  });

  router.post("/admin/projects", async (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    const body = await readJson<CreateProjectBody>(context.req);
    if (!body.slug || !body.name) {
      sendError(context.res, 400, "invalid_request", "slug and name are required");
      return;
    }
    try {
      const project = store.createProject({
        slug: body.slug,
        name: body.name,
        description: body.description
      });
      sendJson(context.res, 201, { project });
    } catch (error) {
      sendError(context.res, 409, "conflict", error instanceof Error ? error.message : "Project conflict");
    }
  });

  router.get("/admin/projects/:projectId/memberships", (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, { memberships: store.listMemberships(context.params.projectId) });
  });

  router.post("/admin/projects/:projectId/memberships", async (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    const body = await readJson<MembershipBody>(context.req);
    if (!body.userId || !body.role || !isR1Role(body.role)) {
      sendError(context.res, 400, "invalid_request", "userId and valid role are required");
      return;
    }
    try {
      const membership = store.upsertMembership({
        userId: body.userId,
        projectId: context.params.projectId,
        role: body.role
      });
      sendJson(context.res, 201, { membership });
    } catch (error) {
      sendError(context.res, 404, "not_found", error instanceof Error ? error.message : "User or project not found");
    }
  });

  router.post("/admin/projects/:projectId/memberships/remove", async (context) => {
    if (!requireAdmin(context, store, jwtSecret)) {
      return;
    }
    const body = await readJson<{ userId?: string }>(context.req);
    if (!body.userId) {
      sendError(context.res, 400, "invalid_request", "userId is required");
      return;
    }
    const removed = store.removeMembership({ userId: body.userId, projectId: context.params.projectId });
    if (!removed) {
      sendError(context.res, 404, "not_found", "Membership not found");
      return;
    }
    sendNoContent(context.res);
  });
}

function validateRoles(roles: string[]): R1Role[] | null {
  if (!roles.every(isR1Role)) {
    return null;
  }
  return roles;
}
