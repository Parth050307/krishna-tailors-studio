import { supabase } from "@/integrations/supabase/client";

/**
 * Storage abstraction. Today it is backed by Lovable Cloud storage; swapping in
 * S3/GCS later means implementing this same interface and changing `driver`.
 */
export const STORAGE_BUCKET = "order-uploads";
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type StoredFile = {
  path: string;
  url: string;
  name: string;
  mime: string;
  size: number;
};

export function validateFile(file: File): string | null {
  if (!ALLOWED_MIME.includes(file.type as (typeof ALLOWED_MIME)[number])) {
    return `${file.name}: only JPG, PNG, WEBP or PDF files are allowed.`;
  }
  if (file.size > MAX_FILE_BYTES) {
    return `${file.name}: files must be under 10 MB.`;
  }
  return null;
}

export interface StorageDriver {
  upload(userId: string, file: File): Promise<StoredFile>;
  signedUrl(path: string, expiresIn?: number): Promise<string | null>;
  remove(path: string): Promise<void>;
}

const cloudDriver: StorageDriver = {
  async upload(userId, file) {
    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${userId}/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    const url = (await cloudDriver.signedUrl(path)) ?? "";
    return { path, url, name: file.name, mime: file.type, size: file.size };
  },
  async signedUrl(path, expiresIn = 60 * 60 * 24 * 7) {
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, expiresIn);
    return data?.signedUrl ?? null;
  },
  async remove(path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  },
};

export const storage: StorageDriver = cloudDriver;
