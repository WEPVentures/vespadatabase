import { nanoid } from "nanoid";
import { getKVStore } from "@/lib/kv";
import { VespaRecord } from "./types";

const vespas = () => getKVStore("vespas");

async function readAll(): Promise<VespaRecord[]> {
  const keys = await vespas().list();
  const raws = await Promise.all(keys.map((k) => vespas().get(k)));
  return raws.filter((r): r is string => Boolean(r)).map((r) => JSON.parse(r) as VespaRecord);
}

export async function createVespa(input: {
  ownerId: string;
  year: number | null;
  model: string;
  vin: string | null;
  color: string | null;
  story: string | null;
  photoUrls: string[];
}): Promise<VespaRecord> {
  const now = new Date().toISOString();
  const record: VespaRecord = {
    id: nanoid(16),
    ownerId: input.ownerId,
    year: input.year,
    model: input.model,
    vin: input.vin,
    color: input.color,
    story: input.story,
    createdAt: now,
    photos: input.photoUrls.map((url) => ({ id: nanoid(12), url, createdAt: now })),
  };
  await vespas().set(record.id, JSON.stringify(record));
  return record;
}

export async function getVespaById(id: string): Promise<VespaRecord | null> {
  const raw = await vespas().get(id);
  return raw ? (JSON.parse(raw) as VespaRecord) : null;
}

export async function updateVespa(
  id: string,
  patch: Partial<Pick<VespaRecord, "year" | "model" | "vin" | "color" | "story">>,
  addPhotoUrls: string[] = []
): Promise<VespaRecord | null> {
  const existing = await getVespaById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated: VespaRecord = {
    ...existing,
    ...patch,
    photos: [
      ...existing.photos,
      ...addPhotoUrls.map((url) => ({ id: nanoid(12), url, createdAt: now })),
    ],
  };
  await vespas().set(id, JSON.stringify(updated));
  return updated;
}

export async function deleteVespa(id: string): Promise<void> {
  await vespas().delete(id);
}

export async function listVespasByOwner(ownerId: string): Promise<VespaRecord[]> {
  const all = await readAll();
  return all
    .filter((v) => v.ownerId === ownerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function countAllVespas(): Promise<number> {
  const keys = await vespas().list();
  return keys.length;
}

export async function getDistinctModels(): Promise<string[]> {
  const all = await readAll();
  return Array.from(new Set(all.map((v) => v.model))).sort((a, b) => a.localeCompare(b));
}

export async function getDistinctYears(): Promise<number[]> {
  const all = await readAll();
  const years = all
    .map((v) => v.year)
    .filter((y): y is number => y !== null)
    .filter((y, i, arr) => arr.indexOf(y) === i);
  return years.sort((a, b) => b - a);
}

export type BrowseSortKey = "newest" | "oldest" | "year_desc" | "year_asc" | "model";

const SORTERS: Record<BrowseSortKey, (a: VespaRecord, b: VespaRecord) => number> = {
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  oldest: (a, b) => a.createdAt.localeCompare(b.createdAt),
  year_desc: (a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity),
  year_asc: (a, b) => (a.year ?? Infinity) - (b.year ?? Infinity),
  model: (a, b) => a.model.localeCompare(b.model),
};

export async function listAllVespas(): Promise<VespaRecord[]> {
  return readAll();
}

// Pure in-memory filter/sort, kept separate from the fetch so callers that
// already have the full list (e.g. to build an owner-username map first)
// don't need to read the store twice.
export function filterAndSortVespas(
  vespas: VespaRecord[],
  opts: {
    model?: string;
    year?: number;
    q?: string;
    ownerUsernameOf: (ownerId: string) => string | null;
    sort: BrowseSortKey;
  }
): VespaRecord[] {
  let results = vespas;

  if (opts.model) results = results.filter((v) => v.model === opts.model);
  if (opts.year !== undefined) results = results.filter((v) => v.year === opts.year);

  if (opts.q) {
    const q = opts.q.toLowerCase();
    results = results.filter((v) => {
      const username = opts.ownerUsernameOf(v.ownerId) ?? "";
      return (
        v.model.toLowerCase().includes(q) ||
        (v.color ?? "").toLowerCase().includes(q) ||
        (v.vin ?? "").toLowerCase().includes(q) ||
        username.toLowerCase().includes(q)
      );
    });
  }

  return results.slice().sort(SORTERS[opts.sort]);
}
