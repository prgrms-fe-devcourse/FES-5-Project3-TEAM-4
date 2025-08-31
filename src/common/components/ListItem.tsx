import LikeButton from '@/pages/Community/components/LikeButton';

export interface Post {
  id: number | string;
  date: string;
  title: string;
  likes: number;
  liked?: boolean;
}

interface ListItemProps {
  post: Post;
  onClick?: (id: Post['id']) => void;
  onLike?: (id: Post['id']) => void;
}

export function ListItem({ post, onClick }: ListItemProps) {
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
        <LikeButton communityId={String(post.id)} count={post.likes} liked={post.liked} />
      </div>
    </li>
  );
}
