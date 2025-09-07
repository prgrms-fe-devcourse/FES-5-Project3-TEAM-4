import type { CommentNode } from '@/common/types/comment';
import { CommentItem } from '../commentItem';

type CommentSectionProps = {
  comments: CommentNode[];
  isAuthed: boolean;
  anonMap: Record<string, string>;
  postId: string;
  currentUserId: string | null;
  postAuthorId: string;
  onRefresh: () => Promise<void>;
};

export default function CommentSection({
  comments,
  isAuthed,
  anonMap,
  postId,
  currentUserId,
  postAuthorId,
  onRefresh,
}: CommentSectionProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-6 text-white/60 text-sm">
        아직 댓글이 없어요. 첫 댓글을 남겨보세요!
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <CommentItem
          key={c.id}
          comment={c}
          depth={0}
          isAuthed={isAuthed}
          postId={postId}
          currentUserId={currentUserId}
          postAuthorId={postAuthorId}
          anonMap={anonMap}
          onReplied={onRefresh}
          onEdited={onRefresh}
          onDeleted={onRefresh}
        />
      ))}
    </div>
  );
}
