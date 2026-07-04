import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = pbkdf2Sync(password, salt, 120_000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$120000$${salt}$${derived}`;
}

export function verifyPassword(password: string, hash: string) {
  const [algorithm, iterationsText, salt, expected] = hash.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterationsText || !salt || !expected) {
    return false;
  }
  const actual = pbkdf2Sync(password, salt, Number.parseInt(iterationsText, 10), 32, "sha256");
  return timingSafeEqual(Buffer.from(expected, "hex"), actual);
}
