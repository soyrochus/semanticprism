import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

export async function readJson<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length ? (JSON.parse(Buffer.concat(chunks).toString("utf8")) as T) : ({} as T);
}

export function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

export type Handler = (req: IncomingMessage, res: ServerResponse, url: URL) => Promise<void> | void;

export function createAdapterServer(routes: Record<string, Handler>) {
  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const key = `${req.method ?? "GET"} ${url.pathname}`;
    const handler = routes[key];
    if (!handler) {
      sendJson(res, 404, { error: { code: "not_found", message: "Route not found" } });
      return;
    }
    Promise.resolve(handler(req, res, url)).catch((error: unknown) => {
      sendJson(res, 500, { error: { code: "internal_error", message: error instanceof Error ? error.message : String(error) } });
    });
  });
}
