import { promises as fs } from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";

export interface KVStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<string[]>;
}

function isNetlify() {
  return Boolean(process.env.NETLIFY);
}

class BlobKVStore implements KVStore {
  private store: ReturnType<typeof getStore>;

  constructor(name: string) {
    this.store = getStore(name);
  }

  async get(key: string) {
    return this.store.get(key, { type: "text" });
  }

  async set(key: string, value: string) {
    await this.store.set(key, value);
  }

  async delete(key: string) {
    await this.store.delete(key);
  }

  async list() {
    const result = await this.store.list();
    return result.blobs.map((b) => b.key);
  }
}

// Local-dev-only fallback: a JSON file per store under .data/, so the app
// runs with zero external services when not deployed on Netlify. Not used
// in production — Netlify Blobs is used there instead.
const DATA_DIR = path.join(/* turbopackIgnore: true */ process.cwd(), ".data");

class FileKVStore implements KVStore {
  private file: string;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(name: string) {
    this.file = path.join(DATA_DIR, `${name}.json`);
  }

  private async readAll(): Promise<Record<string, string>> {
    try {
      const raw = await fs.readFile(this.file, "utf8");
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  private async writeAll(data: Record<string, string>) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(data, null, 2));
  }

  private enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.queue.then(fn, fn);
    this.queue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  async get(key: string) {
    const data = await this.readAll();
    return data[key] ?? null;
  }

  async set(key: string, value: string) {
    await this.enqueue(async () => {
      const data = await this.readAll();
      data[key] = value;
      await this.writeAll(data);
    });
  }

  async delete(key: string) {
    await this.enqueue(async () => {
      const data = await this.readAll();
      delete data[key];
      await this.writeAll(data);
    });
  }

  async list() {
    const data = await this.readAll();
    return Object.keys(data);
  }
}

const stores = new Map<string, KVStore>();

export function getKVStore(name: string): KVStore {
  let store = stores.get(name);
  if (!store) {
    store = isNetlify() ? new BlobKVStore(name) : new FileKVStore(name);
    stores.set(name, store);
  }
  return store;
}
