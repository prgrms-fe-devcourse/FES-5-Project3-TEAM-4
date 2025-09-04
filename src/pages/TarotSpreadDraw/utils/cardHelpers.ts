import supabase from '@/common/api/supabase/supabase';

export function normalizeImageUrl(u: string | null | undefined): string {
  if (!u) return '';

  if (/^https?:\/\//i.test(u)) return u;

  const [bucket, ...rest] = u.split('/');
  const path = rest.join('/');
  if (!bucket || !path) return u;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
