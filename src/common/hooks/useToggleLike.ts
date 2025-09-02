import { useCallback, useRef } from 'react';
import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';

export function useToggleLike() {
  const busyIdRef = useRef<string | null>(null);

  const toggleLike = useCallback(async (communityId: string) => {
    if (busyIdRef.current === communityId) return null;
    busyIdRef.current = communityId;

    try {
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();
      if (authErr || !user) {
        showAlert('error', '로그인 에러', '로그인이 필요합니다.');
        return null;
      }

      const { data, error } = await supabase.rpc('toggle_like', { p_community_id: communityId });
      if (error) throw error;

      const payload = data?.[0];
      return {
        count: Number(payload?.likes_count ?? 0),
        liked: Boolean(payload?.liked),
      };
    } catch (e) {
      showAlert(
        'error',
        '좋아요 에러',
        e instanceof Error ? e.message : '좋아요 처리 중 오류가 발생했어요.'
      );
      return null;
    } finally {
      busyIdRef.current = null;
    }
  }, []);

  return { toggleLike };
}
