import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteCommunity } from '@/common/api/Community/community';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import { formatDate } from '@/common/utils/format';
import { useToggleLike } from '@/common/hooks/useToggleLike';
import { insertComment } from '@/common/api/Community/comment';
import { getCommunityDetail } from '@/common/api/Community/detail';
import type { CommunityDetail as CommunityDetailVM } from '@/common/types/community';
import { getAuthedUser } from '@/common/api/auth/auth';
import {
  DetailMetaBar,
  ImageGallery,
  PostArticle,
  CommentComposer,
  CommentSection,
} from './components/detail/index';

export default function CommunityDetail() {
  const nav = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { toggleLike } = useToggleLike();

  const [communityDetail, setCommunityDetail] = useState<CommunityDetailVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // 상세 + 이미지 + 댓글 + 익명 매핑
        const data = await getCommunityDetail(id);
        setCommunityDetail(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="mt-6 text-white/70">로딩 중…</div>;
  if (error) return <div className="mt-6 text-white/70">{error}</div>;
  if (!communityDetail || !id) return null;

  const { row, images, isAuthed, canEdit, comments, anonMap, currentUserId } = communityDetail;

  const onSubmitComment = async () => {
    const user = await getAuthedUser();
    const text = commentText.trim();
    if (!user) return;
    if (!isAuthed) return showAlert('error', '로그인이 필요합니다.');
    if (!text) return showAlert('error', '댓글 내용을 입력해 주세요.');

    const saved = await insertComment({ community_id: id, contents: text, parent_id: null }, user);
    if (!saved) return;

    setCommentText('');
    // 댓글,익명,이미지 포함 전체 갱신
    setCommunityDetail(await getCommunityDetail(id));
  };

  const onDeletePost = async () => {
    showConfirmAlert('삭제 하시겠습니까?', '삭제 후 복구할 수 없습니다.', async () => {
      const ok = await deleteCommunity(id);
      if (ok) {
        showAlert('info', '삭제되었습니다.');
        nav('/community');
      } else {
        showAlert('error', '삭제에 실패했습니다.');
      }
    });
  };

  return (
    <section className="space-y-6">
      <DetailMetaBar
        createdAt={formatDate(row.created_at)}
        title={row.title ?? '제목 없음'}
        onBack={() => nav('/community')}
      />

      <ImageGallery images={images} />

      <PostArticle
        title={row.title ?? '제목 없음'}
        contents={row.contents ?? ''}
        liked={!!row.likedByMe}
        likeCount={row.likes ?? 0}
        onToggleLike={async () => {
          const next = await toggleLike(String(row.id));
          if (!next) return;
          setCommunityDetail((prev) =>
            prev
              ? { ...prev, row: { ...prev.row, likedByMe: next.liked, likes: next.count } }
              : prev
          );
        }}
        canEdit={canEdit}
        onEdit={() => nav(`/community/edit/${row.id}`, { state: { row } })}
        onDelete={onDeletePost}
      />

      <CommentComposer
        value={commentText}
        disabled={!isAuthed}
        onChange={setCommentText}
        onSubmit={onSubmitComment}
        counter={`${commentText.length}/500`}
        placeholderAuthed="익명으로 마음을 전해요: 따뜻한 댓글을 남겨 주세요"
        placeholderGuest="로그인 후 댓글을 작성할 수 있어요"
      />

      <CommentSection
        comments={comments}
        isAuthed={isAuthed}
        anonMap={anonMap}
        postId={row.id}
        currentUserId={currentUserId}
        postAuthorId={row.profile_id}
        onRefresh={async () => setCommunityDetail(await getCommunityDetail(id))}
      />
    </section>
  );
}
