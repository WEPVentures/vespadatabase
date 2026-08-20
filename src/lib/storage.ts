import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const SUPABASE_BUCKET = "photos";

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

function getSupabaseCredentials() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && serviceRoleKey ? { url, serviceRoleKey } : null;
}

// Use Supabase Storage when it's configured; otherwise fall back to local
// disk for local development, where there's no Supabase project to talk to.
async function savePhotoToSupabase(
  file: File,
  credentials: { url: string; serviceRoleKey: string }
): Promise<string> {
  const supabase = createClient(credentials.url, credentials.serviceRoleKey);
  const key = `${nanoid(16)}.${extensionFor(file.type)}`;

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(key, await file.arrayBuffer(), { contentType: file.type });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
  return data.publicUrl;
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

  const credentials = getSupabaseCredentials();
  return credentials ? savePhotoToSupabase(file, credentials) : savePhotoToDisk(file);
}

export async function savePhotos(files: File[]): Promise<string[]> {
  const results = await Promise.all(files.map(savePhoto));
  return results.filter((url): url is string => Boolean(url));
}
