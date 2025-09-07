import supabase from '@/common/api/supabase/supabase';
import { selectCommunityById } from '@/common/api/Community/community';
import { selectCommentsByCommunityId } from '@/common/api/Community/comment';
import { showAlert } from '@/common/utils/sweetalert';
import type { CommunityDetail } from '@/common/types/community';
import { buildCommentTree } from '@/common/utils/comment';

export async function getCommunityDetail(communityId: string): Promise<CommunityDetail> {
  // 게시글 기본 데이터
  const base = await selectCommunityById(communityId);
  if (!base) {
    const err = new Error('게시글을 찾을 수 없습니다.');
    showAlert('error', err.message);
    throw err;
  }

  // 현재 유저
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 내가 좋아요 눌렀는지
  let likedByMe = false;
  if (user) {
    const { data: likeRow } = await supabase
      .from('likes')
      .select('id')
      .eq('profile_id', user.id)
      .eq('community_id', communityId)
      .maybeSingle();
    likedByMe = !!likeRow;
  }

  // 이미지: file_urls → 없으면 tarot_image 백필
  let images = ((base.file_urls ?? []) as string[]).filter(Boolean);
  if (images.length === 0 && base.tarot_id) {
    const { data, error } = await supabase
      .from('tarot_image')
      .select('image_url')
      .eq('tarot_id', base.tarot_id)
      .order('created_at', { ascending: true });
    if (!error) {
      images = (data ?? []).map((d) => d.image_url).filter(Boolean);
    }
  }

  // 댓글 + 익명 매핑
  const commentList = await selectCommentsByCommunityId(communityId);
  const anonCommentList: Record<string, string> = {};

  let num = 1;
  for (const comment of commentList) {
    if (comment.profile_id === base.profile_id) continue;
    if (!anonCommentList[comment.profile_id]) anonCommentList[comment.profile_id] = `익명${num++}`;
  }

  return {
    row: { ...base, likedByMe },
    images,
    comments: buildCommentTree(commentList),
    anonMap: anonCommentList,
    isAuthed: !!user,
    currentUserId: user?.id ?? null,
    canEdit: !!(user && user.id === base.profile_id),
  };
}
