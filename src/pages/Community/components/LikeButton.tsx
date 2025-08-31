import { useState } from 'react';
import supabase from '@/common/api/supabase/supabase';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { showAlert } from '@/common/utils/sweetalert';

type Props = {
  communityId: string;
  count: number;
  liked?: boolean;
  size?: number;
  className?: string;
  onChange?: (next: { count: number; liked: boolean }) => void;
};

export default function LikeButton({
  communityId,
  count,
  liked = false,
  size = 16,
  className = '',
  onChange,
}: Props) {
  // 낙관적 ui
  // 로컬 상태 (부모가 안 내려줄 때 대비)
  const [local, setLocal] = useState({ count, liked });

  const cur = { count: onChange ? count : local.count, liked: onChange ? liked : local.liked };

  const setNext = (next: { count: number; liked: boolean }) => {
    if (onChange) onChange(next);
    else setLocal(next);
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      showAlert('error', '로그인 에러', '로그인이 필요합니다.');
      return;
    }

    try {
      // 서버에서 원자적으로 토글
      const { data, error } = await supabase.rpc('toggle_like', {
        p_community_id: communityId,
      });
      if (error) throw error;

      const payload = data?.[0];
      setNext({
        liked: Boolean(payload?.liked),
        count: Number(payload?.likes_count ?? 0),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : '좋아요 처리 중 오류가 발생했어요.');
    }
  };

  const Icon = cur.liked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={cur.liked}
      aria-label={`좋아요 ${cur.count}`}
      className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm
        ${cur.liked ? 'text-pink-400' : 'text-white/80 hover:text-pink-400'} ${className}`}
    >
      <Icon size={size} />
      {cur.count}
    </button>
  );
}
