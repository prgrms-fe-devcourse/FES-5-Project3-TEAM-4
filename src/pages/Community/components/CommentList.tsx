import { useMemo, useState } from 'react';
import { Button } from '@/common/components/Button';
import type { CommentRow } from '@/common/types/comment';

type Props = {
  all: CommentRow[]; // fetchCommentsFlat 결과
  postAuthorId: string; // 글쓴이 id (post.profile_id)
  currentUserId?: string | null;
  onReply: (parentId: string, text: string) => Promise<void>;
  onEdit: (commentId: string, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

/** (3) 루트/자식 1뎁스로 분리 + '자식 없는 삭제 루트' 제거 */
function splitAndPrune(comments: CommentRow[]) {
  const childrenByParent = new Map<string, CommentRow[]>();
  const roots: CommentRow[] = [];

  for (const c of comments) {
    if (c.parent_id) {
      const arr = childrenByParent.get(c.parent_id) ?? [];
      arr.push(c);
      childrenByParent.set(c.parent_id, arr);
    } else {
      roots.push(c);
    }
  }

  // 자식 없는 삭제 루트는 감추기
  const visibleRoots = roots.filter((r) => {
    const kids = childrenByParent.get(r.id) ?? [];
    return !(r.is_deleted && kids.length === 0);
  });

  return { roots: visibleRoots, childrenByParent };
}

/** (4) 2중 루프 렌더 (재귀 X, 대댓글 1뎁스) */
export default function CommentsList({
  all,
  postAuthorId,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
}: Props) {
  const { roots, childrenByParent } = useMemo(() => splitAndPrune(all), [all]);

  if (roots.length === 0) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-6 text-white/60 text-sm">
        아직 댓글이 없어요. 첫 댓글을 남겨보세요!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {roots.map((root) => {
        const kids = childrenByParent.get(root.id) ?? [];
        return (
          <div
            key={root.id}
            className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4"
          >
            <CommentRowItem
              row={root}
              label={root.profile_id === postAuthorId ? '글쓴이' : '익명'}
              canReply={!root.is_deleted}
              canEdit={currentUserId === root.profile_id && !root.is_deleted}
              onReply={(t) => onReply(root.id, t)}
              onEdit={(t) => onEdit(root.id, t)}
              onDelete={() => onDelete(root.id)}
            />

            {kids.length > 0 && (
              <div className="mt-3 space-y-3 pl-6 border-l border-white/15">
                {kids.map((child) => (
                  <CommentRowItem
                    key={child.id}
                    row={child}
                    label={child.profile_id === postAuthorId ? '글쓴이' : '익명'}
                    canReply={false} // 대댓글의 대댓글 금지
                    canEdit={currentUserId === child.profile_id && !child.is_deleted}
                    onReply={async () => {}}
                    onEdit={(t) => onEdit(child.id, t)}
                    onDelete={() => onDelete(child.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CommentRowItem({
  row,
  label,
  canReply,
  canEdit,
  onReply,
  onEdit,
  onDelete,
}: {
  row: CommentRow;
  label: string;
  canReply: boolean;
  canEdit: boolean;
  onReply: (text: string) => Promise<void>;
  onEdit: (text: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState(row.contents ?? '');

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            👤
          </span>
          <span>{label}</span>
          <span className="text-white/40">·</span>
          <span>{(row.created_at ?? '').slice(0, 10)}</span>
        </div>

        <div className="flex items-center gap-2">
          {canReply && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setReplyOpen((v) => !v)}>
              답글
            </Button>
          )}
          {canEdit && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen((v) => !v)}
              >
                수정
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      {!editOpen ? (
        <div className="mt-3 whitespace-pre-wrap text-white/85">
          {row.is_deleted ? '삭제된 댓글입니다.' : (row.contents ?? '')}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.currentTarget.value)}
            className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(false)}>
              취소
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                const t = editText.trim();
                if (!t) return;
                await onEdit(t);
                setEditOpen(false);
              }}
            >
              저장
            </Button>
          </div>
        </div>
      )}

      {replyOpen && (
        <div className="mt-3 space-y-2">
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.currentTarget.value)}
            placeholder="답글을 입력해 주세요"
            className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setReplyOpen(false)}>
              취소
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                const t = replyText.trim();
                if (!t) return;
                await onReply(t);
                setReplyText('');
                setReplyOpen(false);
              }}
            >
              등록
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
