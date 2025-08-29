import { AiOutlineHeart } from 'react-icons/ai';

export interface Post {
  id: number | string;
  date: string;
  title: string;
  likes: number;
}

interface ListItemProps {
  post: Post;
  onClick?: (id: Post['id']) => void;
  onLike?: (id: Post['id']) => void;
}

export function ListItem({ post, onClick, onLike }: ListItemProps) {
  const hoverBorderActiveGlow =
    'ring-1 ring-white/10 hover:ring-white/40 active:shadow-[0_0_20px_rgba(255,255,255,0.35)]';

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(post.id)}
        className={`grid grid-cols-[140px_1fr_80px] items-center rounded-[18px] bg-white/5 backdrop-blur-md
                    px-5 py-3 transition cursor-pointer ${hoverBorderActiveGlow}`}
      >
        <span className="text-sm text-white/80">{post.date}</span>
        <span className="text-sm pl-4 line-clamp-1">{post.title}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(post.id);
          }}
          className="ml-auto inline-flex items-center gap-1 justify-end rounded-full px-2 py-1
                     text-sm text-white/80 hover:text-pink-400 focus-visible:outline-0
                     focus-visible:ring-2 focus-visible:ring-pink-400/60 cursor-pointer"
          aria-label={`좋아요 ${post.likes}`}
        >
          <AiOutlineHeart size={16} />
          {post.likes}
        </button>
      </div>
    </li>
  );
}
