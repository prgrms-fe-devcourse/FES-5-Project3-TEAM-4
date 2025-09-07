import { ListItem, type Post } from '@/common/components/ListItem';

type CommunityListViewProps = {
  posts: Post[];
  loading: boolean;
  onClick: (id: string) => void;
  onLike: (id: string) => void;
};

export function CommunityListView({ posts, loading, onClick, onLike }: CommunityListViewProps) {
  if (loading) return <div className="mt-6 text-white/70">로딩 중…</div>;

  if (posts.length === 0) {
    return (
      <div className="mt-4">
        <ul className="space-y-3">
          <li className="text-white/60 py-6 text-center">검색 결과가 없습니다.</li>
        </ul>
      </div>
    );
  }

  return (
    <ul className="mt-4 space-y-3">
      {posts.map((post) => (
        <ListItem
          key={post.id}
          post={post}
          onClick={(id) => onClick(String(id))}
          onLike={(id) => onLike(String(id))}
        />
      ))}
    </ul>
  );
}
