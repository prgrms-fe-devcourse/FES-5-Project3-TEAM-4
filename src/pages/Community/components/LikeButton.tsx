import { useState } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { showAlert } from '@/common/utils/sweetalert';
import { toggleLike } from '@/common/api/Community/like';

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
  // 부모가 onChange를 주지 않으면 내부 로컬 상태로 낙관적 UI 처리
  const [local, setLocal] = useState({ count, liked });
  const cur = { count: onChange ? count : local.count, liked: onChange ? liked : local.liked };
  const setNext = (next: { count: number; liked: boolean }) =>
    onChange ? onChange(next) : setLocal(next);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const next = await toggleLike(communityId);
      setNext(next);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '좋아요 처리 중 오류가 발생했어요.';
      showAlert('error', '좋아요 에러', msg);
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
