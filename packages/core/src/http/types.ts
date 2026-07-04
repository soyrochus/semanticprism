import type { IncomingMessage, ServerResponse } from "node:http";
import type { AuthenticatedUser } from "../auth/session.js";

export interface HttpContext {
  req: IncomingMessage;
  res: ServerResponse;
  url: URL;
  params: Record<string, string>;
  user?: AuthenticatedUser;
}

export type RouteHandler = (context: HttpContext) => Promise<void> | void;
