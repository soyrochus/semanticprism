import type { IncomingMessage, ServerResponse } from "node:http";

export async function readJson<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) {
    return {} as T;
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
}

export function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload)
  });
  res.end(payload);
}

export function sendNoContent(res: ServerResponse) {
  res.writeHead(204);
  res.end();
}

export function sendError(res: ServerResponse, statusCode: number, code: string, message: string) {
  sendJson(res, statusCode, { error: { code, message } });
}
