import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

type LikeButtonProps = {
  liked: boolean;
  count: number;
  size?: number;
  className?: string;
  onPress?: () => void;
};

export default function LikeButton({
  liked,
  count,
  size = 16,
  className = '',
  onPress,
}: LikeButtonProps) {
  const Icon = liked ? AiFillHeart : AiOutlineHeart;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onPress?.();
      }}
      aria-pressed={liked}
      aria-label={`좋아요 ${count}`}
      className={`cursor-pointer inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm
        ${liked ? 'text-pink-400' : 'text-white/80 hover:text-pink-400'} ${className}`}
    >
      <Icon size={size} />
      {count}
    </button>
  );
}
