import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { selectCommunityById } from '@/common/api/Community/community';
import type { CommunityRow, CommunityRowUI } from '@/common/types/community';
import LikeButton from './components/LikeButton';
import { Button } from '@/common/components/Button';

type Comment = {
  id: string;
  author: string;
  created_at: string;
  contents: string;
  children?: Comment[];
};

const toDate10 = (s?: string | null) => (s ? s.slice(0, 10) : '');

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateRow = (location.state as { row?: CommunityRow } | undefined)?.row;
  const [row, setRow] = useState<CommunityRowUI | null>(stateRow ?? null);
  const [loading, setLoading] = useState(!stateRow);
  const [error, setError] = useState<string | null>(null);

  // TODO: 실제 데이터로 교체
  const [commentText, setCommentText] = useState('');
  const [comments] = useState<Comment[]>([
    {
      id: 'c1',
      author: '익명',
      created_at: '2025-08-24',
      contents: '익명 댓글 예시 텍스트…',
      children: [
        {
          id: 'c1-1',
          author: '익명',
          created_at: '2025-08-24',
          contents: '대댓글 예시 텍스트…',
        },
      ],
    },
    {
      id: 'c2',
      author: '익명',
      created_at: '2025-08-24',
      contents: '두 번째 댓글 예시…',
    },
  ]);

  useEffect(() => {
    if (row || !id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await selectCommunityById(id);
        if (!data) setError('게시글을 찾을 수 없습니다.');
        setRow(data);
      } catch {
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, row]);

  const coverImage = useMemo(() => {
    const files = (row?.file_urls as string[] | null | undefined) ?? [];
    return files[0] ?? '';
  }, [row]);

  if (loading) return <div className="mt-6 text-white/70">로딩 중…</div>;
  if (error) return <div className="mt-6 text-white/70">{error}</div>;
  if (!row) return null;

  return (
    <section className="space-y-6">
      {/* 상단: 날짜 + 제목 바 */}
      <div className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/15">
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80">
            {toDate10(row.created_at)}
          </span>
          <div className="flex-1 rounded-md bg-transparent text-white/90">
            {row.title ?? '제목 없음'}
          </div>
        </div>
      </div>

      {/* 이미지 카드 */}
      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3">
        <div className="rounded-xl overflow-hidden bg-black/20 aspect-[16/9] flex items-center justify-center">
          {coverImage ? (
            // 실제 이미지
            <img
              src={coverImage}
              alt={row.title ?? 'community image'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            // 플레이스홀더
            // 빈자리를 차지하는게 나을지
            <div className="text-white/60 text-sm">이미지가 없습니다</div>
          )}
        </div>
      </div>

      {/* 본문 카드 */}
      <article className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-5">
        <h2 className="text-white/90 text-lg mb-3">{row.title ?? '제목 없음'}</h2>
        <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
          {row.contents ?? ''}
        </div>

        {/* 푸터: 좋아요 / 수정 / 삭제 */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <LikeButton
            communityId={String(row.id)}
            count={row.likes ?? 0}
            liked={row.likedByMe ?? false}
          />

          <div className="flex items-center gap-3 text-white/70">
            <button
              type="button"
              onClick={() => console.log('수정', row.id)}
              className="hover:text-white cursor-pointer"
            >
              수정
            </button>
            <span aria-hidden className="h-3 w-px bg-white/20" />
            <button
              type="button"
              onClick={() => console.log('삭제', row.id)}
              className="hover:text-white cursor-pointer"
            >
              삭제
            </button>
          </div>
        </div>
      </article>

      {/* 댓글 작성 */}
      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
        <label htmlFor="comment" className="sr-only">
          댓글 입력
        </label>
        <div className="relative">
          <textarea
            id="comment"
            rows={3}
            maxLength={500}
            placeholder="익명으로 마음을 전해요: 따뜻한 댓글을 남겨 주세요"
            value={commentText}
            onChange={(e) => setCommentText(e.currentTarget.value)}
            className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
          />
          <div className="absolute right-3 bottom-2 text-xs text-white/60">
            {commentText.length}/500
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            onClick={() => {
              console.log('댓글 등록', commentText);
              setCommentText('');
            }}
            variant="primary"
          >
            등록
          </Button>
        </div>
      </div>

      {/* 댓글 리스트 */}
      <div className="space-y-4">
        {comments.map((c) => (
          <CommentCard key={c.id} comment={c} />
        ))}
      </div>
    </section>
  );
}

/* 글 카드 컴포넌트 TODO: api 데이터로 */
function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
      <div className="flex items-center justify-between text-sm text-white/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
            👤
          </span>
          <span>{comment.author}</span>
          <span className="text-white/40">·</span>
          <span>{comment.created_at}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="hover:text-white cursor-pointer"
            onClick={() => console.log('수정', comment.id)}
          >
            수정
          </button>
          <button
            className="hover:text-white cursor-pointer"
            onClick={() => console.log('삭제', comment.id)}
          >
            삭제
          </button>
        </div>
      </div>

      <div className="mt-3 whitespace-pre-wrap text-white/85">{comment.contents}</div>

      {comment.children && comment.children.length > 0 && (
        <div className="mt-3 space-y-3 pl-6 border-l border-white/15">
          {comment.children.map((child) => (
            <div key={child.id} className="rounded-xl border border-white/15 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  👤
                </span>
                <span>{child.author}</span>
                <span className="text-white/40">·</span>
                <span>{child.created_at}</span>
              </div>
              <div className="mt-2 whitespace-pre-wrap text-white/85">{child.contents}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
