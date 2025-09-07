import { Button } from '@/common/components/Button';
import LikeButton from '../shared/LikeButton';

type PostArticleProps = {
  title: string;
  contents: string;
  liked: boolean;
  likeCount: number;
  onToggleLike: () => Promise<void> | void;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function PostArticle({
  title,
  contents,
  liked,
  likeCount,
  onToggleLike,
  canEdit,
  onEdit,
  onDelete,
}: PostArticleProps) {
  return (
    <article className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-5">
      <h2 className="text-white/90 text-lg mb-3">{title || '제목 없음'}</h2>
      <div className="whitespace-pre-wrap text-white/80 leading-relaxed">{contents ?? ''}</div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <LikeButton liked={liked} count={likeCount} onPress={onToggleLike} />
        <div className="flex items-center gap-3 text-white/70">
          {canEdit && (
            <>
              <Button type="button" onClick={onEdit} variant="ghost" size="sm">
                수정
              </Button>
              <span aria-hidden className="h-3 w-px bg-white/20" />
              <Button type="button" onClick={onDelete} variant="ghost" size="sm">
                삭제
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
