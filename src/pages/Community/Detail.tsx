import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCommunity } from '@/common/api/Community/community';
import LikeButton from './components/LikeButton';
import { Button } from '@/common/components/Button';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import { FiArrowLeft } from 'react-icons/fi';
import CommentItem from './components/commentItem/CommentItem';
import { formatDate } from '@/common/utils/format';
import { useToggleLike } from '@/common/hooks/useToggleLike';
import { insertComment } from '@/common/api/Community/comment';
import { getCommunityDetail } from '@/common/api/Community/detail';
import type { CommunityDetail as CommunityDetailVM } from '@/common/types/community';
import { getAuthedUser } from '@/common/api/auth/auth';

export default function CommunityDetail() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toggleLike } = useToggleLike();

  const [communityDetail, setCommunityDetail] = useState<CommunityDetailVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI 전용 상태만 남김
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCommunityDetail(id); // 상세 + 이미지(타로 우선) + 댓글 + 익명 매핑
        setCommunityDetail(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 키보드 네비(이미지만)
  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (!communityDetail) return;
      if (e.key === 'Escape') setViewerOpen(false);
      if (e.key === 'ArrowLeft')
        setViewerIndex(
          (i) => (i - 1 + communityDetail.images.length) % communityDetail.images.length
        );
      if (e.key === 'ArrowRight') setViewerIndex((i) => (i + 1) % communityDetail.images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerOpen, communityDetail?.images.length]);

  if (loading) return <div className="mt-6 text-white/70">로딩 중…</div>;
  if (error) return <div className="mt-6 text-white/70">{error}</div>;
  if (!communityDetail || !id) return null;

  const { row, images, isAuthed, canEdit, comments, anonMap, currentUserId } = communityDetail;

  const openViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const onSubmitComment = async () => {
    const user = await getAuthedUser();
    const text = commentText.trim();
    if (!user) return;
    if (!isAuthed) return showAlert('error', '로그인이 필요합니다.');
    if (!text) return showAlert('error', '댓글 내용을 입력해 주세요.');
    const saved = await insertComment({ community_id: id, contents: text, parent_id: null }, user);
    if (!saved) return;
    setCommentText('');
    setCommunityDetail(await getCommunityDetail(id)); // 댓글/익명/이미지 포함 전체 갱신
  };

  const onClickDelete = async () => {
    showConfirmAlert('삭제 하시겠습니까?', '삭제 후 복구할 수 없습니다.', async () => {
      const ok = await deleteCommunity(id);
      if (ok) {
        showAlert('info', '삭제되었습니다.');
        nav('/community');
      } else {
        showAlert('error', '삭제에 실패했어요.');
      }
    });
  };

  return (
    <section className="space-y-6">
      <Button
        type="button"
        onClick={() => nav('/community')}
        variant="ghost"
        size="sm"
        className="inline-flex items-center gap-2"
      >
        <FiArrowLeft />
        <span className="text-sm">목록으로</span>
      </Button>

      <div className="rounded-xl bg-white/10 backdrop-blur-md px-4 py-3 border border-white/15">
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/80">
            {formatDate(row.created_at)}
          </span>
          <div className="flex-1 rounded-md bg-transparent text-white/90">
            {row.title ?? '제목 없음'}
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3">
          <div className="flex flex-wrap gap-3">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => openViewer(i)}
                className="group flex-1 basis-[240px] aspect-[16/9] rounded-xl overflow-hidden bg-black/20 ring-1 ring-white/10 hover:ring-white/40 active:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
              >
                <img
                  src={src}
                  alt={`attachment-${i + 1}`}
                  className="cursor-pointer w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {viewerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setViewerOpen(false)}
          />
          <div className="relative z-10 w-[min(96vw,1200px)] max-h-[90vh] p-3">
            <div className="flex justify-end mb-2">
              <Button type="button" onClick={() => setViewerOpen(false)} variant="ghost" size="sm">
                닫기
              </Button>
            </div>
            <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/20 overflow-hidden">
              <div className="flex items-center justify-center max-h-[78vh]">
                <img
                  src={images[viewerIndex]}
                  alt={`attachment-large-${viewerIndex + 1}`}
                  className="max-h-[78vh] w-auto object-contain"
                />
              </div>
              {images.length > 1 && (
                <>
                  <Button
                    type="button"
                    onClick={() => setViewerIndex((i) => (i - 1 + images.length) % images.length)}
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60"
                    aria-label="이전 이미지"
                  >
                    ‹
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setViewerIndex((i) => (i + 1) % images.length)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60"
                    aria-label="다음 이미지"
                  >
                    ›
                  </Button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {images.map((thumb, i) => (
                  <button
                    key={`${thumb}-${i}`}
                    type="button"
                    onClick={() => setViewerIndex(i)}
                    className={`h-14 w-20 rounded-md overflow-hidden ring-1 cursor-pointer ${
                      i === viewerIndex ? 'ring-white' : 'ring-white/20 hover:ring-white/40'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`thumb-${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <article className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-5">
        <h2 className="text-white/90 text-lg mb-3">{row.title ?? '제목 없음'}</h2>
        <div className="whitespace-pre-wrap text-white/80 leading-relaxed">
          {row.contents ?? ''}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <LikeButton
            liked={!!row.likedByMe}
            count={row.likes ?? 0}
            onPress={async () => {
              const next = await toggleLike(String(row.id));
              if (!next) return;
              // 화면상 숫자/상태만 반영
              setCommunityDetail((prev) =>
                prev
                  ? { ...prev, row: { ...prev.row, likedByMe: next.liked, likes: next.count } }
                  : prev
              );
            }}
          />
          <div className="flex items-center gap-3 text-white/70">
            {canEdit && (
              <>
                <Button
                  type="button"
                  onClick={() => nav(`/community/edit/${row.id}`, { state: { row } })}
                  variant="ghost"
                  size="sm"
                >
                  수정
                </Button>
                <span aria-hidden className="h-3 w-px bg-white/20" />
                <Button type="button" onClick={onClickDelete} variant="ghost" size="sm">
                  삭제
                </Button>
              </>
            )}
          </div>
        </div>
      </article>

      <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
        <label htmlFor="comment" className="sr-only">
          댓글 입력
        </label>
        <div className="relative">
          <textarea
            id="comment"
            rows={3}
            maxLength={500}
            placeholder={
              isAuthed
                ? '익명으로 마음을 전해요: 따뜻한 댓글을 남겨 주세요'
                : '로그인 후 댓글을 작성할 수 있어요'
            }
            value={commentText}
            onChange={(e) => setCommentText(e.currentTarget.value)}
            disabled={!isAuthed}
            className=" scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/60 w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
          />
          <div className="absolute right-3 bottom-2 text-xs text-white/60">
            {commentText.length}/500
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="button" onClick={onSubmitComment} variant="primary" disabled={!isAuthed}>
            {isAuthed ? '등록' : '로그인 필요'}
          </Button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-6 text-white/60 text-sm">
          아직 댓글이 없어요. 첫 댓글을 남겨보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              depth={0}
              isAuthed={isAuthed}
              postId={row.id}
              currentUserId={currentUserId}
              postAuthorId={row.profile_id}
              anonMap={anonMap}
              onReplied={async () => setCommunityDetail(await getCommunityDetail(id))}
              onEdited={async () => setCommunityDetail(await getCommunityDetail(id))}
              onDeleted={async () => setCommunityDetail(await getCommunityDetail(id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
