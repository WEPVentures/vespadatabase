import { nanoid } from "nanoid";
import { getKVStore } from "@/lib/kv";
import { LoginTokenRecord } from "./types";

const tokens = () => getKVStore("login-tokens");

export async function createLoginToken(
  email: string,
  userId: string,
  ttlMinutes: number
): Promise<string> {
  const token = nanoid(32);
  const record: LoginTokenRecord = {
    token,
    email,
    userId,
    expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
    usedAt: null,
    createdAt: new Date().toISOString(),
  };
  await tokens().set(token, JSON.stringify(record));
  return token;
}

// Validates and marks the token used in one step. Returns the token record
// (pre-consumption) if it was valid, or null if missing/expired/already used.
export async function consumeLoginToken(token: string): Promise<LoginTokenRecord | null> {
  const raw = await tokens().get(token);
  if (!raw) return null;

  const record = JSON.parse(raw) as LoginTokenRecord;
  if (record.usedAt || new Date(record.expiresAt) < new Date()) return null;

  const updated: LoginTokenRecord = { ...record, usedAt: new Date().toISOString() };
  await tokens().set(token, JSON.stringify(updated));
  return record;
}
