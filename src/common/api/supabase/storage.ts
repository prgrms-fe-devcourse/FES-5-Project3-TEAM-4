import supabase from '@/common/api/supabase/supabase';

export function sanitizeFilename(name: string) {
  return name
    .normalize('NFKC')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function uploadFilesToBucket(
  bucket: string,
  userId: string,
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];

  for (const file of files) {
    const path = `${userId}/${crypto.randomUUID()}-${encodeURIComponent(sanitizeFilename(file.name))}`;

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (upErr) continue;

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    if (data?.publicUrl) urls.push(data.publicUrl);
  }

  return urls;
}
