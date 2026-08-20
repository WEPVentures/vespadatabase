import { nanoid } from "nanoid";
import { getKVStore } from "@/lib/kv";
import { UserRecord } from "./types";

const users = () => getKVStore("users");
const usersByEmail = () => getKVStore("users-by-email");
const usersByUsername = () => getKVStore("users-by-username");

export async function findOrCreateUserByEmail(email: string): Promise<UserRecord> {
  const existingId = await usersByEmail().get(email);
  if (existingId) {
    const existing = await getUserById(existingId);
    if (existing) return existing;
  }

  const user: UserRecord = {
    id: nanoid(16),
    email,
    username: null,
    createdAt: new Date().toISOString(),
  };
  await users().set(user.id, JSON.stringify(user));
  await usersByEmail().set(email, user.id);
  return user;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const raw = await users().get(id);
  return raw ? (JSON.parse(raw) as UserRecord) : null;
}

export async function getUsersByIds(ids: string[]): Promise<Map<string, UserRecord>> {
  const uniqueIds = Array.from(new Set(ids));
  const entries = await Promise.all(
    uniqueIds.map(async (id) => [id, await getUserById(id)] as const)
  );
  const map = new Map<string, UserRecord>();
  for (const [id, user] of entries) {
    if (user) map.set(id, user);
  }
  return map;
}

export async function getUserByUsername(username: string): Promise<UserRecord | null> {
  const id = await usersByUsername().get(username);
  return id ? getUserById(id) : null;
}

export async function isUsernameTaken(username: string, excludeUserId: string): Promise<boolean> {
  const id = await usersByUsername().get(username);
  return Boolean(id && id !== excludeUserId);
}

export async function setUsername(userId: string, username: string): Promise<UserRecord> {
  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const updated: UserRecord = { ...user, username };
  await users().set(userId, JSON.stringify(updated));
  await usersByUsername().set(username, userId);
  return updated;
}

export async function countUsersWithUsername(): Promise<number> {
  const keys = await users().list();
  const records = await Promise.all(keys.map((id) => getUserById(id)));
  return records.filter((u) => u?.username).length;
}
