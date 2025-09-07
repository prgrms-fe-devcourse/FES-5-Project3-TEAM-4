import { useState, useMemo, useCallback } from 'react';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import { insertComment, updateComment, deleteComment } from '@/common/api/Community/comment';
import { getAuthedUser } from '@/common/api/auth/auth';
import { formatDate } from '@/common/utils/format';
import { CommentActions, CommentHeader, ChildrenList, CommentContent, ReplyEditor } from './index';
import type { CommentItemProps } from '@/common/types/comment';

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
  const displayName = useMemo(
    () => (isWriter ? '글쓴이' : (anonMap[comment.profile_id] ?? '익명')),
    [isWriter, anonMap, comment.profile_id]
  );
  const canReply = depth === 0 && !comment.parent_id;

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState(comment.contents ?? '');

  const handleSubmitReply = useCallback(async () => {
    const user = await getAuthedUser();
    if (!isAuthed) return showAlert('error', '로그인이 필요합니다.');
    if (depth !== 0) return;

    const text = replyText.trim();
    if (!text) return showAlert('error', '내용을 입력해 주세요.');
    if (!user) return;

    const ok = await insertComment(
      { community_id: postId, contents: text, parent_id: comment.id },
      user
    );

    if (ok) {
      setReplyText('');
      setReplyOpen(false);
      await onReplied();
    }
  }, [isAuthed, depth, replyText, postId, comment.id, onReplied]);

  const handleSubmitEdit = useCallback(async () => {
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
  }, [isOwner, editText, comment.id, onEdited]);

  const handleRemove = useCallback(async () => {
    const user = await getAuthedUser();
    if (!isOwner || !user) return;

    showConfirmAlert('댓글을 삭제할까요?', '삭제 후엔 되돌릴 수 없습니다.', async () => {
      const ok = await deleteComment({ comment_id: comment.id }, user);
      if (ok) await onDeleted();
    });
  }, [isOwner, comment.id, onDeleted]);

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
      <div className="flex items-center justify-between text-sm text-white/70">
        <CommentHeader
          avatarSrc="/icons/profile.svg"
          displayName={displayName}
          createdAt={formatDate(comment.created_at)}
        />
        <CommentActions
          canReply={!!canReply}
          canEdit={isOwner && !comment.is_deleted}
          onToggleReply={() => setReplyOpen((v) => !v)}
          onToggleEdit={() => setEditOpen((v) => !v)}
          onDelete={handleRemove}
          isAuthed={isAuthed}
        />
      </div>

      <CommentContent
        isDeleted={comment.is_deleted}
        editOpen={editOpen}
        contents={comment.contents ?? ''}
        editText={editText}
        onChangeEditText={setEditText}
        onCancelEdit={() => setEditOpen(false)}
        onSaveEdit={handleSubmitEdit}
      />

      {depth === 0 && replyOpen && (
        <ReplyEditor
          value={replyText}
          onChange={setReplyText}
          onCancel={() => setReplyOpen(false)}
          onSubmit={handleSubmitReply}
        />
      )}

      {!!comment.children?.length && (
        <ChildrenList>
          {comment.children!.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              depth={1}
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
        </ChildrenList>
      )}
    </div>
  );
}
