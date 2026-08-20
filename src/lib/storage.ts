import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { getStore } from "@netlify/blobs";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function extensionFor(type: string) {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

// Netlify Functions have an ephemeral filesystem, so plain disk writes
// don't survive between invocations there. Use Netlify Blobs when running
// on Netlify (detected via its own NETLIFY env var), and fall back to
// local disk for local development, where there's no blob store to talk to.
function isNetlify() {
  return Boolean(process.env.NETLIFY);
}

async function savePhotoToBlobs(file: File): Promise<string> {
  const store = getStore("photos");
  const key = `${nanoid(16)}.${extensionFor(file.type)}`;
  await store.set(key, await file.arrayBuffer(), {
    metadata: { contentType: file.type },
  });
  return `/api/photos/${key}`;
}

async function savePhotoToDisk(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${nanoid(16)}.${extensionFor(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

export async function savePhoto(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_TYPES.has(file.type)) return null;
  if (file.size > MAX_SIZE_BYTES) return null;

  return isNetlify() ? savePhotoToBlobs(file) : savePhotoToDisk(file);
}

export async function savePhotos(files: File[]): Promise<string[]> {
  const results = await Promise.all(files.map(savePhoto));
  return results.filter((url): url is string => Boolean(url));
}
