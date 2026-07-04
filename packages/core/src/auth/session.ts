import type { R1Role, R1User } from "@semantic-prism/shared-contracts";
import type { SeedStore } from "../projects/seedStore.js";
import { readJson, sendError, sendJson, sendNoContent } from "../http/response.js";
import type { Router } from "../http/router.js";
import type { HttpContext } from "../http/types.js";
import { signJwt, verifyJwt } from "./jwt.js";
import { verifyPassword } from "./password.js";

export interface AuthenticatedUser extends R1User {
  memberships: Record<string, R1Role>;
}

interface LoginBody {
  email?: string;
  password?: string;
}

export function authenticate(context: HttpContext, store: SeedStore, jwtSecret: string): AuthenticatedUser | null {
  const header = context.req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  const payload = verifyJwt<{ sub: string }>(header.slice("Bearer ".length), jwtSecret);
  if (!payload?.sub) {
    return null;
  }
  return store.getAuthenticatedUser(payload.sub);
}

export function requireAuth(context: HttpContext, store: SeedStore, jwtSecret: string): AuthenticatedUser | null {
  const user = authenticate(context, store, jwtSecret);
  if (!user) {
    sendError(context.res, 401, "unauthorized", "Valid JWT required");
    return null;
  }
  context.user = user;
  return user;
}

export function requireProjectRole(
  context: HttpContext,
  projectId: string,
  allowed: R1Role[],
  store: SeedStore,
  jwtSecret: string
) {
  const user = requireAuth(context, store, jwtSecret);
  if (!user) {
    return null;
  }
  const role = user.memberships[projectId];
  if (user.roles.includes("admin")) {
    return user;
  }
  if (!role || !allowed.includes(role)) {
    sendError(context.res, 403, "forbidden", "Insufficient project role");
    return null;
  }
  return user;
}

export function registerAuthRoutes(router: Router, store: SeedStore, jwtSecret: string) {
  router.post("/auth/login", async (context) => {
    const body = await readJson<LoginBody>(context.req);
    const user = body.email ? store.findUserByEmail(body.email) : undefined;
    if (!user || !body.password || !verifyPassword(body.password, user.passwordHash)) {
      sendError(context.res, 401, "invalid_credentials", "Invalid email or password");
      return;
    }
    const token = signJwt({ sub: user.id }, jwtSecret);
    sendJson(context.res, 200, {
      token,
      user: store.getAuthenticatedUser(user.id)
    });
  });

  router.post("/auth/logout", ({ res }) => {
    sendNoContent(res);
  });

  router.get("/auth/me", (context) => {
    const user = requireAuth(context, store, jwtSecret);
    if (!user) {
      return;
    }
    sendJson(context.res, 200, { user });
  });
}
