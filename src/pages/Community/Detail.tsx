import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteCommunity, selectCommunityById } from '@/common/api/Community/community';
import type { CommunityRow, CommunityRowUI } from '@/common/types/community';
import LikeButton from './components/LikeButton';
import { Button } from '@/common/components/Button';
import supabase from '@/common/api/supabase/supabase';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import { FiArrowLeft } from 'react-icons/fi';
import type { CommentNode } from '@/common/types/comment';
import { fetchCommentsFlat, insertComment } from '@/common/api/Community/comment';
import CommentItem from './components/CommentItem';
import { formatDate } from '@/common/utils/format';

export default function CommunityDetail() {
  const nav = useNavigate();
  const [canEdit, setCanEdit] = useState(false);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateRow = (location.state as { row?: CommunityRow } | undefined)?.row;
  const [row, setRow] = useState<CommunityRowUI | null>(stateRow ?? null);
  const [loading, setLoading] = useState(!stateRow);
  const [error, setError] = useState<string | null>(null);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // 로그인 정보 (사용자 id) 보관용

  const [anonMap, setAnonMap] = useState<Record<string, string>>({});

  // 트리 빌더(간단 버전)
  function buildTree(
    rows: Array<{
      id: string;
      community_id: string;
      profile_id: string;
      parent_id: string | null;
      contents: string | null;
      is_deleted: boolean;
      created_at: string | null;
    }>
  ): CommentNode[] {
    const map = new Map<string, CommentNode>();
    const roots: CommentNode[] = [];
    rows.forEach((r) => map.set(r.id, { ...r, children: [] }));

    rows.forEach((r) => {
      const node = map.get(r.id)!;
      if (r.parent_id) {
        const parent = map.get(r.parent_id);
        if (parent) parent.children!.push(node);
        else roots.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  // 댓글 새로고침 로직
  const refetchCommentsAndAnon = useCallback(async () => {
    if (!id || !row) return;

    // 1) 평탄 데이터
    const flat = await fetchCommentsFlat(id);

    // 2) 익명 매핑 (글쓴이 제외, 첫 등장 순서대로)
    const orderAsc = flat
      .slice()
      .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''));
    const map = new Map<string, string>();
    let num = 1;
    for (const r of orderAsc) {
      if (r.profile_id === row.profile_id) continue; // 글쓴이 제외
      if (!map.has(r.profile_id)) map.set(r.profile_id, `익명${num++}`);
    }
    setAnonMap(Object.fromEntries(map));

    // 3) 트리로 변환 후 상태 저장
    setComments(buildTree(flat));
  }, [id, row]);

  // 댓글 등록
  const onSubmitComment = async () => {
    if (!id) return;
    if (!isAuthed) {
      showAlert('error', '로그인이 필요합니다.');
      return;
    }

    const text = commentText.trim();
    if (!text) {
      showAlert('error', '댓글 내용을 입력해 주세요.');
      return;
    }

    const saved = await insertComment({
      community_id: id,
      contents: text,
    });
    if (!saved) return;

    // 성공 → 입력 비우고, 댓글 목록 리프레시
    setCommentText('');
    refetchCommentsAndAnon();
  };

  const openViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const images = useMemo(() => {
    const arr = (row?.file_urls as string[] | null | undefined) ?? [];
    return arr.filter(Boolean);
  }, [row]);

  const closeViewer = () => setViewerOpen(false);
  const showPrev = () => setViewerIndex((i) => (i - 1 + images.length) % images.length);
  const showNext = () => setViewerIndex((i) => (i + 1) % images.length);

  // ESC / 좌우 방향키
  useEffect(() => {
    if (!viewerOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewerOpen(false); // closeViewer() 대신 인라인
      }
      if (e.key === 'ArrowLeft') {
        setViewerIndex((i) => (i - 1 + images.length) % images.length); // showPrev 내용
      }
      if (e.key === 'ArrowRight') {
        setViewerIndex((i) => (i + 1) % images.length); // showNext 내용
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerOpen, images.length]);

  // 글 상세 fetch
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        // const data = await selectCommunityById(id);
        // if (!data) setError('게시글을 찾을 수 없습니다.');
        // setRow(data);
        const base = await selectCommunityById(id);
        if (!base) {
          setError('게시글을 찾을 수 없습니다.');
          return;
        }

        // 로그인 유저가 이 글을 좋아요했는지 확인
        const {
          data: { user },
        } = await supabase.auth.getUser();
        let likedByMe = row?.likedByMe ?? false; // state에 있으면 보존

        if (user) {
          const { data: likeRow } = await supabase
            .from('likes')
            .select('id')
            .eq('profile_id', user.id)
            .eq('community_id', id)
            .maybeSingle(); // 없으면 null
          likedByMe = !!likeRow;
        }

        setRow(() => ({ ...base, likedByMe }));
      } catch {
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 로그인 여부/사용자 id/수정 권한 한 번에 처리
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsAuthed(Boolean(user));
      setCurrentUserId(user?.id ?? null);

      if (row) {
        setCanEdit(Boolean(user && user.id === row.profile_id));
      }
    })();
  }, [row]);

  // 로그인 상태 변화 감지
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthed(Boolean(user));
      setCurrentUserId(user?.id ?? null);
      if (row) setCanEdit(Boolean(user && user.id === row.profile_id));
    });
    return () => sub.subscription.unsubscribe();
  }, [row]);

  // 댓글 fetch
  useEffect(() => {
    if (!id || !row) return;
    (async () => {
      setCommentsLoading(true);
      await refetchCommentsAndAnon();
      setCommentsLoading(false);
    })();
  }, [id, row, refetchCommentsAndAnon]); // 함수 자체를 deps 로

  const onClickEdit = () => {
    nav(`/community/edit/${row!.id}`, { state: { row } });
  };

  const onClickDelete = async () => {
    if (!id) return;

    showConfirmAlert('삭제 하시겠습니까?', '삭제 후 복구할 수 없습니다.', async () => {
      const success = await deleteCommunity(id);
      if (success) {
        showAlert('info', '삭제되었습니다.');
        nav('/community');
      } else {
        showAlert('error', '삭제에 실패했어요.');
      }
    });
  };

  if (loading) return <div className="mt-6 text-white/70">로딩 중…</div>;
  if (error) return <div className="mt-6 text-white/70">{error}</div>;
  if (!row) return null;

  return (
    <section className="space-y-6">
      {/* ← 목록으로 */}
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

      {/* 상단: 날짜 + 제목 바 */}
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

      {/* 이미지 갤러리 */}
      {images.length > 0 && (
        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-3">
          <div className="flex flex-wrap gap-3">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => openViewer(i)}
                className="group flex-1 basis-[240px] aspect-[16/9] rounded-xl overflow-hidden bg-black/20
                     ring-1 ring-white/10 hover:ring-white/40 active:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
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

      {/* 라이트박스 모달 */}
      {viewerOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeViewer} />

          {/* 패널 */}
          <div className="relative z-10 w-[min(96vw,1200px)] max-h-[90vh] p-3">
            {/* 상단 닫기 */}
            <div className="flex justify-end mb-2">
              <Button type="button" onClick={closeViewer} variant="ghost" size="sm">
                닫기
              </Button>
            </div>

            {/* 이미지 영역 */}
            <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/20 overflow-hidden">
              <div className="flex items-center justify-center max-h-[78vh]">
                <img
                  src={images[viewerIndex]}
                  alt={`attachment-large-${viewerIndex + 1}`}
                  className="max-h-[78vh] w-auto object-contain"
                />
              </div>

              {/* 좌/우 네비게이션 */}
              {images.length > 1 && (
                <>
                  <Button
                    type="button"
                    onClick={showPrev}
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2
                 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60"
                    aria-label="이전 이미지"
                  >
                    ‹
                  </Button>

                  <Button
                    type="button"
                    onClick={showNext}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2
                 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60"
                    aria-label="다음 이미지"
                  >
                    ›
                  </Button>
                </>
              )}
            </div>

            {/* 하단 인덱스/썸네일 */}
            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {images.map((thumb, i) => (
                  <button
                    key={thumb + i}
                    type="button"
                    onClick={() => setViewerIndex(i)}
                    className={`h-14 w-20 rounded-md overflow-hidden ring-1 cursor-pointer 
                ${i === viewerIndex ? 'ring-white' : 'ring-white/20 hover:ring-white/40'}`}
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
            onChange={({ count, liked }) => {
              // 디테일 화면의 상태 동기화
              setRow((prev) => (prev ? { ...prev, likes: count, likedByMe: liked } : prev));
            }}
          />

          <div className="flex items-center gap-3 text-white/70">
            {canEdit && (
              <>
                <Button type="button" onClick={onClickEdit} variant="ghost" size="sm">
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

      {/* 댓글 작성 (루트 댓글) */}
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
            className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
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

      {/* 댓글 리스트 */}
      {commentsLoading ? (
        <div className="text-white/70">댓글 불러오는 중…</div>
      ) : comments.length === 0 ? (
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
              onReplied={async () => {
                if (!id) return;
                await refetchCommentsAndAnon();
              }}
              onEdited={async () => {
                if (!id) return;
                await refetchCommentsAndAnon();
              }}
              onDeleted={async () => {
                if (!id) return;
                await refetchCommentsAndAnon();
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
