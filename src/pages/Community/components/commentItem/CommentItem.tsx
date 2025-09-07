import { useState } from 'react';
import { Button } from '@/common/components/Button';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import { insertComment, updateComment, deleteComment } from '@/common/api/Community/comment';
import { formatDate } from '@/common/utils/format';
import type { CommentItemProps } from '@/common/types/comment';
import { getAuthedUser } from '@/common/api/auth/auth';

export default function CommentItem({
  comment,
  postAuthorId,
  postId,
  currentUserId,
  isAuthed,
  depth = 0,
  onReplied,
  onEdited,
  onDeleted,
  anonMap,
}: CommentItemProps) {
  const isOwner = !!currentUserId && currentUserId === comment.profile_id;
  const isWriter = comment.profile_id === postAuthorId;
  const displayName = isWriter ? '글쓴이' : (anonMap[comment.profile_id] ?? '익명');
  const canReply = !comment.parent_id;

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState(comment.contents ?? '');

  const handleSubmitReply = async () => {
    const user = await getAuthedUser();
    if (!isAuthed) return showAlert('error', '로그인이 필요합니다.');
    if (depth !== 0) return;
    const text = replyText.trim();
    if (!text) return showAlert('error', '내용을 입력해 주세요.');
    if (!user) return;

    const ok = await insertComment(
      {
        community_id: postId,
        contents: text,
        parent_id: comment.id,
      },
      user
    );
    if (ok) {
      setReplyText('');
      setReplyOpen(false);
      await onReplied();
    }
  };

  const handleSubmitEdit = async () => {
    const user = await getAuthedUser();
    const text = editText.trim();
    if (!isOwner) return;
    if (!user) return;
    if (!text) return showAlert('error', '내용을 입력해 주세요.');

    const ok = await updateComment(comment.id, text, user);
    if (ok) {
      setEditOpen(false);
      await onEdited();
    }
  };

  const handleRemoveReply = async () => {
    const user = await getAuthedUser();
    if (!isOwner) return;
    if (!user) return;

    showConfirmAlert('댓글을 삭제할까요?', '삭제 후엔 되돌릴 수 없습니다.', async () => {
      const ok = await deleteComment({ comment_id: comment.id }, user);
      if (ok) await onDeleted();
    });
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-7 w-7 items-center justify-center  overflow-hidden">
            <img
              src="/icons/profile.svg"
              alt="프로필 이미지"
              className="h-full w-full object-cover"
            />
          </div>

          <span>{displayName}</span>
          <span className="text-white/40">·</span>
          <span>{formatDate(comment.created_at)}</span>
        </div>

        <div className="flex items-center gap-2">
          {canReply && depth === 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!isAuthed}
              onClick={() => setReplyOpen((v) => !v)}
            >
              답글
            </Button>
          )}

          {isOwner && !comment.is_deleted && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen((v) => !v)}
              >
                수정
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveReply}>
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 본문/수정 */}
      {!editOpen ? (
        <div className="mt-3 whitespace-pre-wrap text-white/85">
          {comment.is_deleted ? '삭제된 댓글입니다.' : (comment.contents ?? '')}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.currentTarget.value)}
            className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setEditOpen(false)}>
              취소
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmitEdit}>
              저장
            </Button>
          </div>
        </div>
      )}

      {/* 대댓글 입력 (1뎁스만) */}
      {depth === 0 && replyOpen && (
        <div className="mt-3 space-y-2">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.currentTarget.value)}
            placeholder="답글을 입력해 주세요"
            className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={() => setReplyOpen(false)}>
              취소
            </Button>
            <Button type="button" variant="primary" size="sm" onClick={handleSubmitReply}>
              등록
            </Button>
          </div>
        </div>
      )}

      {/* 자식(대댓글) */}
      {comment.children?.length ? (
        <div className="mt-3 space-y-3 pl-6 border-l border-white/15">
          {comment.children!.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              anonMap={anonMap}
              isAuthed={isAuthed}
              postId={postId}
              onReplied={onReplied}
              onEdited={onEdited}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
