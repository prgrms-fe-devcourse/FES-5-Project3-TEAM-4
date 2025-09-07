import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { CommentPayload, CommentRow, InsertComment } from '@/common/types/comment';
import type { User } from '@supabase/supabase-js';

/** 댓글 추가. parent_id 있으면 대댓글인것 */
export async function insertComment(
  { community_id, contents, parent_id }: CommentPayload,
  user: User
) {
  const insert: InsertComment = {
    community_id,
    profile_id: user.id,
    contents,
    parent_id: parent_id ?? null,
  };

  const { error } = await supabase.from('comment').insert(insert).single();
  if (error) {
    showAlert('error', '댓글 등록 실패', error.message);
    return false;
  }
  return true;
}

/** 댓글 업데이트 */
export async function updateComment(id: string, contents: string, user: User) {
  const { error } = await supabase
    .from('comment')
    .update({ contents })
    .eq('id', id)
    .eq('profile_id', user.id)
    .select('id')
    .single();

  if (error) {
    showAlert('error', '댓글 수정 실패', error.message);
    return false;
  }
  return true;
}

/** 댓글 삭제: 자식 유무에 따라 soft/hard 삭제 */
export async function deleteComment(params: { comment_id: string }, user: User): Promise<boolean> {
  try {
    const commentId = params.comment_id;

    // 1) 대상 댓글 조회
    const { data: target, error: getErr } = await supabase
      .from('comment')
      .select('id, profile_id, parent_id')
      .eq('id', commentId)
      .single();

    if (getErr) throw getErr;
    if (!target) {
      showAlert('error', '댓글을 찾을 수 없습니다.');
      return false;
    }
    if (target.profile_id !== user.id) {
      showAlert('error', '본인 댓글만 삭제할 수 있어요.');
      return false;
    }

    // 2) 자식 여부 확인 (부모 댓글인 경우만)
    let hasChildren = false;
    if (!target.parent_id) {
      const { count, error: cntErr } = await supabase
        .from('comment')
        .select('id', { count: 'exact', head: true })
        .eq('parent_id', commentId);
      if (cntErr) throw cntErr;
      hasChildren = (count ?? 0) > 0;
    }

    // 3) 삭제 규칙 적용
    if (target.parent_id) {
      // ▶ 대댓글: 하드 삭제
      const { error: delErr } = await supabase
        .from('comment')
        .delete()
        .eq('id', commentId)
        .eq('profile_id', user.id);
      if (delErr) throw delErr;
    } else {
      // ▶ 부모 댓글
      if (hasChildren) {
        // 자식 있음 → 소프트 삭제(placeholder 유지)
        const { error: updErr } = await supabase
          .from('comment')
          .update({ is_deleted: true, contents: null })
          .eq('id', commentId)
          .eq('profile_id', user.id)
          .single();
        if (updErr) throw updErr;
      } else {
        // 자식 없음 → 하드 삭제
        const { error: delErr } = await supabase
          .from('comment')
          .delete()
          .eq('id', commentId)
          .eq('profile_id', user.id);
        if (delErr) throw delErr;
      }
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '댓글 삭제 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '댓글 삭제 실패', error);
    }
  }
  return false;
}

/** 특정 커뮤니티 글의 댓글 목록 가져오기 (대댓글 포함) */
export async function selectCommentsByCommunityId(communityId: string) {
  try {
    const { data, error } = await supabase
      .from('comment')
      .select('id, community_id, profile_id, parent_id, contents, is_deleted, created_at')
      .eq('community_id', communityId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data ?? []) as CommentRow[];
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '댓글 목록 가져오기 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '댓글 목록 가져오기 실패', error);
    }
    return [];
  }
}
