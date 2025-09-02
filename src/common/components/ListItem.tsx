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

export function ListItem({ post, onClick, onLike }: ListItemProps) {
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onClick?.(post.id)}
        className="flex items-center rounded-[18px] bg-white/5 px-5 py-3 cursor-pointer ring-1 ring-white/10 hover:ring-white/40"
      >
        <span className="w-[140px] shrink-0 text-sm text-white/80">{post.date}</span>
        <span className="flex-1 text-sm pl-4 line-clamp-1">{post.title}</span>
        <div className="w-[50px] flex justify-end shrink-0">
          <LikeButton liked={!!post.liked} count={post.likes} onPress={() => onLike?.(post.id)} />
        </div>
      </div>
    </li>
  );
}
