import { useEffect, useState } from 'react';
import type { Tables } from '@/common/api/supabase/database.types';
import { getAuthedUser } from '@/common/api/auth/auth';
import { listTarotImagesByUser } from '@/common/api/Tarot/tarotImage';

export function useTarotPicker(open: boolean) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Tables<'tarot_image'>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const user = await getAuthedUser();
        if (!user) return;
        const r = await listTarotImagesByUser(user.id);
        if (!cancelled) setRows(r ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '불러오기에 실패했어요.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  return { loading, rows, error };
}
