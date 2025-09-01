import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteCommunity, selectCommunityById } from '@/common/api/Community/community';
import type { CommunityRow, CommunityRowUI } from '@/common/types/community';
import LikeButton from './components/LikeButton';
import { Button } from '@/common/components/Button';
import supabase from '@/common/api/supabase/supabase';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import { FiArrowLeft } from 'react-icons/fi';
import type { CommentNode } from '@/common/types/comment';
import {
  insertComment,
  selectCommentsByCommunityId,
  // softDeleteComment,
  // updateComment,
} from '@/common/api/Community/comment';
// import { formatDate } from '@/common/utils/format';
import CommentItem from './components/CommentItem';

const toDate10 = (s?: string | null) => (s ? s.slice(0, 10) : '');

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

  // 로그인 사용자 / 수정권한 체크
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthed(Boolean(user));
      if (row && user) setCanEdit(user.id === row.profile_id);
    })();
  }, [row]);

  // 글 상세 fetch
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

  // ✅ 댓글 fetch
  useEffect(() => {
    if (!id) return;
    (async () => {
      setCommentsLoading(true);
      const nodes = await selectCommentsByCommunityId(id);
      setComments(nodes);
      setCommentsLoading(false);
    })();
  }, [id]);

  // ✅ 댓글 등록
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
    const nodes = await selectCommentsByCommunityId(id);
    setComments(nodes);
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

  useEffect(() => {
    // 로그인 유저가 작성자인지 확인
    (async () => {
      if (!row) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCanEdit(Boolean(user && user.id === row.profile_id));
    })();
  }, [row]);

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

  // 로그인 여부/수정권한 체크 useEffect에서 사용자 id도 세팅
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthed(Boolean(user));
      setCurrentUserId(user?.id ?? null);
      if (row && user) setCanEdit(user.id === row.profile_id);
    })();
  }, [row]);

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
            {toDate10(row.created_at)}
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

            {/* 하단 인덱스/썸네일(선택) */}
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
              onReplied={async () => {
                if (!id) return;
                const refreshed = await selectCommentsByCommunityId(id);
                setComments(refreshed);
              }}
              onEdited={async () => {
                if (!id) return;
                const refreshed = await selectCommentsByCommunityId(id);
                setComments(refreshed);
              }}
              onDeleted={async () => {
                if (!id) return;
                const refreshed = await selectCommentsByCommunityId(id);
                setComments(refreshed);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* 글 카드 컴포넌트 TODO: api 데이터로 */
// function CommentCard({
//   comment,
//   isAuthed,
//   postAuthorId,
//   depth = 0,
//   currentUserId,
//   onReplied,
//   onEdited,
//   onDeleted,
// }: {
//   comment: CommentNode;
//   isAuthed: boolean;
//   depth?: number;
//   postAuthorId: string;
//   currentUserId: string | null;
//   onReplied: () => Promise<void> | void;
//   onEdited: () => Promise<void> | void;
//   onDeleted: () => Promise<void> | void;
// }) {
//   const isOwner = !!currentUserId && currentUserId === comment.profile_id;
//   const isWriter = !!postAuthorId && String(postAuthorId) === String(comment.profile_id);
//   const displayName = isWriter ? '글쓴이' : (comment.authorName ?? '익명');

//   // 로컬 상태: 답글/수정 모드
//   const [replyOpen, setReplyOpen] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const [editText, setEditText] = useState(comment.contents ?? '');

//   useEffect(() => {
//     if (comment.is_deleted && replyOpen) setReplyOpen(false);
//   }, [comment.is_deleted, replyOpen]);

//   const submitReply = async () => {
//     if (!isAuthed) return showAlert('error', '로그인이 필요합니다.');
//     if (depth !== 0) return;
//     const text = replyText.trim();
//     if (!text) return showAlert('error', '내용을 입력해 주세요.');
//     const saved = await insertComment({
//       community_id: comment.community_id,
//       contents: text,
//       parent_id: comment.id,
//     });
//     if (saved) {
//       setReplyText('');
//       setReplyOpen(false);
//       await onReplied();
//     }
//   };

//   const submitEdit = async () => {
//     if (!isOwner) return;
//     const text = editText.trim();
//     if (!text) return showAlert('error', '내용을 입력해 주세요.');
//     const ok = await updateComment(comment.id, text);
//     if (ok) {
//       setEditOpen(false);
//       await onEdited();
//     }
//   };

//   const remove = async () => {
//     if (!isOwner) return;
//     const ok = await softDeleteComment({ comment_id: comment.id });
//     if (ok) await onDeleted();
//   };

//   return (
//     <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
//       {/* 헤더 */}
//       <div className="flex items-center justify-between text-sm text-white/70">
//         <div className="flex items-center gap-2">
//           <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
//             👤
//           </span>
//           <span>{displayName}</span>
//           <span className="text-white/40">·</span>
//           <span>{formatDate(comment.created_at ?? '')}</span>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* 답글 */}
//           {!comment.is_deleted && depth === 0 && (
//             <button
//               className={`hover:text-white cursor-pointer ${!isAuthed ? 'opacity-50 cursor-not-allowed' : ''}`}
//               onClick={() => isAuthed && setReplyOpen((v) => !v)}
//             >
//               답글
//             </button>
//           )}

//           {/* 수정/삭제: 소유자만 */}
//           {isOwner && !comment.is_deleted && (
//             <>
//               <button
//                 className="hover:text-white cursor-pointer"
//                 onClick={() => setEditOpen((v) => !v)}
//               >
//                 수정
//               </button>
//               <button className="hover:text-white cursor-pointer" onClick={remove}>
//                 삭제
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* 본문 (수정모드가 아니고, 삭제된 댓글이면 안내) */}
//       {!editOpen && (
//         <div className="mt-3 whitespace-pre-wrap text-white/85">
//           {comment.is_deleted ? '삭제된 댓글입니다.' : (comment.contents ?? '')}
//         </div>
//       )}

//       {/* 수정 폼 */}
//       {editOpen && (
//         <div className="mt-3 space-y-2">
//           <textarea
//             rows={3}
//             value={editText}
//             onChange={(e) => setEditText(e.currentTarget.value)}
//             className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
//           />
//           <div className="flex gap-2 justify-end">
//             <Button type="button" variant="ghost" size="sm" onClick={() => setEditOpen(false)}>
//               취소
//             </Button>
//             <Button type="button" variant="primary" size="sm" onClick={submitEdit}>
//               저장
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* 답글 폼 */}
//       {depth === 0 && replyOpen && (
//         <div className="mt-3 space-y-2">
//           <textarea
//             rows={3}
//             value={replyText}
//             onChange={(e) => setReplyText(e.currentTarget.value)}
//             placeholder="답글을 입력해 주세요"
//             className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
//           />
//           <div className="flex gap-2 justify-end">
//             <Button type="button" variant="ghost" size="sm" onClick={() => setReplyOpen(false)}>
//               취소
//             </Button>
//             <Button type="button" variant="primary" size="sm" onClick={submitReply}>
//               등록
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* 자식(대댓글) */}
//       {comment.children && comment.children.length > 0 && (
//         <div className="mt-3 space-y-3 pl-6 border-l border-white/15">
//           {comment.children.map((child) => (
//             <CommentItem
//               key={child.id}
//               comment={child}
//               depth={depth + 1}
//               isAuthed={isAuthed}
//               currentUserId={currentUserId}
//               onReplied={onReplied}
//               onEdited={onEdited}
//               onDeleted={onDeleted}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
