import { useState } from 'react';
import { Button } from '@/common/components/Button';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import type { Tables } from '@/common/api/supabase/database.types';
import { insertComment, updateComment, deleteComment } from '@/common/api/Community/comment';
import { formatDate } from '@/common/utils/format';

export type CommentNode = Tables<'comment'> & {
  // API에서 children을 붙여서 내려주거나, 화면에서 buildTree로 구성
  children?: CommentNode[];
  authorName?: string | null; // 필요 시 닉네임 등
};

type Props = {
  comment: CommentNode;
  postAuthorId: string; // 글 작성자 id (post.profile_id)
  currentUserId?: string | null; // 로그인 사용자 id
  isAuthed: boolean;
  depth?: number;
  postId: string; // community id
  anonMap: Record<string, string>;
  // 화면 갱신 핸들러
  onReplied: () => Promise<void> | void;
  onEdited: () => Promise<void> | void;
  onDeleted: () => Promise<void> | void;
};

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
}: Props) {
  const isOwner = !!currentUserId && currentUserId === comment.profile_id;
  const isWriter = comment.profile_id === postAuthorId;
  const displayName = isWriter ? '글쓴이' : (anonMap[comment.profile_id] ?? '익명');
  const canReply = !comment.parent_id;

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState(comment.contents ?? '');

  const submitReply = async () => {
    if (!isAuthed) return showAlert('error', '로그인이 필요합니다.');
    if (depth !== 0) return;
    const text = replyText.trim();
    if (!text) return showAlert('error', '내용을 입력해 주세요.');

    const ok = await insertComment({
      community_id: postId,
      contents: text,
      parent_id: comment.id,
    });
    if (ok) {
      setReplyText('');
      setReplyOpen(false);
      await onReplied();
    }
  };

  const submitEdit = async () => {
    if (!isOwner) return;
    const text = editText.trim();
    if (!text) return showAlert('error', '내용을 입력해 주세요.');

    const ok = await updateComment(comment.id, text);
    if (ok) {
      setEditOpen(false);
      await onEdited();
    }
  };

  const remove = async () => {
    if (!isOwner) return;

    showConfirmAlert('댓글을 삭제할까요?', '삭제 후엔 되돌릴 수 없습니다.', async () => {
      const ok = await deleteComment({ comment_id: comment.id });
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
              src="data:image/png;base64,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"
              alt=""
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
              <Button type="button" variant="ghost" size="sm" onClick={remove}>
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
            <Button type="button" variant="primary" size="sm" onClick={submitEdit}>
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
            <Button type="button" variant="primary" size="sm" onClick={submitReply}>
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
