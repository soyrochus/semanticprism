import type { R1Role } from "@semantic-prism/shared-contracts";
import type { SeedStore } from "../projects/seedStore.js";
import { sendError } from "../http/response.js";
import type { HttpContext } from "../http/types.js";
import { requireAuth, type AuthenticatedUser } from "./session.js";

export const projectRoles: R1Role[] = ["admin", "project-owner", "analyst", "viewer"];

export function isR1Role(value: string): value is R1Role {
  return projectRoles.includes(value as R1Role);
}

export function canManageAdminResources(user: AuthenticatedUser) {
  return user.roles.includes("admin");
}

export function canManageProject(user: AuthenticatedUser, projectId: string) {
  return user.roles.includes("admin") || user.memberships[projectId] === "project-owner";
}

export function canRunExtraction(user: AuthenticatedUser, projectId: string) {
  const role = user.memberships[projectId];
  return user.roles.includes("admin") || role === "project-owner" || role === "analyst";
}

export function canViewProject(user: AuthenticatedUser, projectId: string) {
  return user.roles.includes("admin") || Boolean(user.memberships[projectId]);
}

export function requireAdmin(context: HttpContext, store: SeedStore, jwtSecret: string) {
  const user = requireAuth(context, store, jwtSecret);
  if (!user) {
    return null;
  }
  if (!canManageAdminResources(user)) {
    sendError(context.res, 403, "forbidden", "Admin role required");
    return null;
  }
  return user;
}

export function requireProjectAccess(context: HttpContext, projectId: string, store: SeedStore, jwtSecret: string) {
  const user = requireAuth(context, store, jwtSecret);
  if (!user) {
    return null;
  }
  if (!canViewProject(user, projectId)) {
    sendError(context.res, 403, "forbidden", "Project membership required");
    return null;
  }
  return user;
}

export function requireProjectManager(context: HttpContext, projectId: string, store: SeedStore, jwtSecret: string) {
  const user = requireAuth(context, store, jwtSecret);
  if (!user) {
    return null;
  }
  if (!canManageProject(user, projectId)) {
    sendError(context.res, 403, "forbidden", "Project owner or admin role required");
    return null;
  }
  return user;
}

export function requireExtractionRunner(context: HttpContext, projectId: string, store: SeedStore, jwtSecret: string) {
  const user = requireAuth(context, store, jwtSecret);
  if (!user) {
    return null;
  }
  if (!canRunExtraction(user, projectId)) {
    sendError(context.res, 403, "forbidden", "Project owner, analyst, or admin role required to run extraction");
    return null;
  }
  return user;
}
