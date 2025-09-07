import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { CommentPayload, CommentRow, InsertComment } from '@/common/types/comment';
import type { User } from '@supabase/supabase-js';

type CommentTarget = {
  id: string;
  profile_id: string;
  parent_id: string | null;
};

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

async function selectCommentTarget(commentId: string): Promise<CommentTarget> {
  const { data, error } = await supabase
    .from('comment')
    .select('id, profile_id, parent_id')
    .eq('id', commentId)
    .single();

  if (error) throw error;
  if (!data) throw new Error('댓글을 찾을 수 없습니다.');
  return data as CommentTarget;
}

async function selectHasChildComments(commentId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('comment')
    .select('id', { count: 'exact', head: true })
    .eq('parent_id', commentId);

  if (error) throw error;
  return (count ?? 0) > 0;
}

async function deleteCommentHard(commentId: string, userId: string) {
  const { error } = await supabase
    .from('comment')
    .delete()
    .eq('id', commentId)
    .eq('profile_id', userId);
  if (error) throw error;
}

async function updateCommentSoftDelete(commentId: string, userId: string) {
  const { error } = await supabase
    .from('comment')
    .update({ is_deleted: true, contents: null })
    .eq('id', commentId)
    .eq('profile_id', userId)
    .single();
  if (error) throw error;
}

/** 댓글 삭제 */
export async function deleteComment(params: { comment_id: string }, user: User): Promise<boolean> {
  try {
    const commentId = params.comment_id;

    const target = await selectCommentTarget(commentId);
    if (target.profile_id !== user.id) {
      throw new Error('본인 댓글만 삭제할 수 있어요.');
    }

    // 대댓글: 하드 삭제
    if (target.parent_id) {
      await deleteCommentHard(commentId, user.id);
      return true;
    }

    // 부모 댓글: 자식 유무에 따라 soft/hard
    const hasChildren = await selectHasChildComments(commentId);
    if (hasChildren) {
      await updateCommentSoftDelete(commentId, user.id);
    } else {
      await deleteCommentHard(commentId, user.id);
    }

    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    showAlert('error', '댓글 삭제 실패', msg);
    return false;
  }
}
