import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

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

export async function savePhoto(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!ALLOWED_TYPES.has(file.type)) return null;
  if (file.size > MAX_SIZE_BYTES) return null;

  await mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${nanoid(16)}.${extensionFor(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

export async function savePhotos(files: File[]): Promise<string[]> {
  const results = await Promise.all(files.map(savePhoto));
  return results.filter((url): url is string => Boolean(url));
}
