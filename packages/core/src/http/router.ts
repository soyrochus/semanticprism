import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Logger } from "../config/logger.js";
import { sendError } from "./response.js";
import type { HttpContext, RouteHandler } from "./types.js";

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: RouteHandler;
}

function compilePath(path: string) {
  const keys: string[] = [];
  const pattern = path
    .split("/")
    .map((part) => {
      if (part.startsWith(":")) {
        keys.push(part.slice(1));
        return "([^/]+)";
      }
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return { pattern: new RegExp(`^${pattern}$`), keys };
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler) {
    this.add("GET", path, handler);
  }

  post(path: string, handler: RouteHandler) {
    this.add("POST", path, handler);
  }

  put(path: string, handler: RouteHandler) {
    this.add("PUT", path, handler);
  }

  private add(method: string, path: string, handler: RouteHandler) {
    const compiled = compilePath(path);
    this.routes.push({ method, ...compiled, handler });
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    setCorsHeaders(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const method = req.method ?? "GET";
    for (const route of this.routes) {
      if (route.method !== method) {
        continue;
      }
      const match = route.pattern.exec(url.pathname);
      if (!match) {
        continue;
      }
      const params = Object.fromEntries(route.keys.map((key, index) => [key, decodeURIComponent(match[index + 1])]));
      await route.handler({ req, res, url, params });
      return;
    }
    sendError(res, 404, "not_found", "Route not found");
  }
}

export function createHttpServer(router: Router, logger: Logger) {
  return createServer((req, res) => {
    router.handle(req, res).catch((error: unknown) => {
      logger.error("Unhandled request error", { error: error instanceof Error ? error.message : String(error) });
      sendError(res, 500, "internal_error", "Internal server error");
    });
  });
}

function setCorsHeaders(res: ServerResponse) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET,POST,PUT,OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type,authorization");
}
