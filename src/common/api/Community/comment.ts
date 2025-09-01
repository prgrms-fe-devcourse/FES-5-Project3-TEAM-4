import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { CommentRow, CommentNode } from '@/common/types/comment';
import type { TablesInsert } from '../supabase/database.types';

type InsertComment = TablesInsert<'comment'>;

/** 평탄화된 rows 를 parent_id 기준으로 트리 변환 */
function buildCommentTree(rows: CommentRow[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  rows.forEach((r) => map.set(r.id, { ...r, children: [] }));

  for (const r of rows) {
    const node = map.get(r.id)!;
    if (r.parent_id) {
      const parent = map.get(r.parent_id);
      if (parent) parent.children!.push(node);
      else roots.push(node); // 혹시 부모가 없으면 루트로
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/** 특정 커뮤니티 글의 댓글 목록 가져오기 (대댓글 포함) */
export async function selectCommentsByCommunityId(communityId: string): Promise<CommentNode[]> {
  try {
    const { data, error } = await supabase
      .from('comment')
      .select('id, community_id, profile_id, parent_id, contents, is_deleted, created_at')
      .eq('community_id', communityId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    const rows = (data ?? []) as CommentRow[];
    return buildCommentTree(rows);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '댓글을 불러오지 못했습니다.';
    console.error('[comment] select error:', msg);
    showAlert('error', msg);
    return [];
  }
}

export async function fetchCommentsByPost(community_id: string) {
  const { data, error } = await supabase
    .from('comment')
    .select('*')
    .eq('community_id', community_id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('fetchCommentsByPost', error.message);
    showAlert('error', '댓글 조회 실패', error.message);
    return [] as CommentRow[];
  }
  return (data ?? []) as CommentRow[];
}

/** 루트/대댓글 공통: parent_id 있으면 대댓글 */
export async function insertComment(payload: {
  community_id: string;
  contents: string;
  parent_id?: string | null;
}) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    showAlert('error', '로그인이 필요합니다.');
    return false;
  }

  const insert: InsertComment = {
    community_id: payload.community_id,
    profile_id: user.id,
    contents: payload.contents,
    parent_id: payload.parent_id ?? null,
  };

  const { error } = await supabase.from('comment').insert(insert).single();
  if (error) {
    console.error('insertComment', error.message);
    showAlert('error', '댓글 등록 실패', error.message);
    return false;
  }
  return true;
}

export async function updateComment(id: string, contents: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    showAlert('error', '로그인이 필요합니다.');
    return false;
  }
  const { error } = await supabase
    .from('comment')
    .update({ contents })
    .eq('id', id)
    .eq('profile_id', user.id) // 본인만 수정
    .select('id')
    .single();

  if (error) {
    console.error('updateComment', error.message);
    showAlert('error', '댓글 수정 실패', error.message);
    return false;
  }
  return true;
}

export async function deleteComment(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    showAlert('error', '로그인이 필요합니다.');
    return false;
  }
  const { error } = await supabase
    .from('comment')
    .update({ is_deleted: true, contents: '(삭제된 댓글입니다)' })
    .eq('id', id)
    .eq('profile_id', user.id) // 본인만 삭제
    .single();

  if (error) {
    console.error('deleteComment', error.message);
    showAlert('error', '댓글 삭제 실패', error.message);
    return false;
  }
  return true;
}

/** 댓글 삭제(소프트 삭제) — is_deleted = true (소유자만) */
// comment.ts

/** 댓글 삭제: 자식 유무/대댓글 여부에 따라 soft/hard delete */
export async function softDeleteComment(params: { comment_id: string }): Promise<boolean> {
  try {
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr) throw authErr;
    if (!user) {
      showAlert('error', '로그인이 필요합니다.');
      return false;
    }

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
  } catch (e) {
    const msg = e instanceof Error ? e.message : '댓글 삭제에 실패했습니다.';
    console.error('[comment] delete error:', msg);
    showAlert('error', msg);
    return false;
  }
}

// 평평하게 전부 가져오기 (루트+대댓글)
export async function fetchCommentsFlat(communityId: string) {
  const { data, error } = await supabase
    .from('comment')
    .select('id, community_id, profile_id, parent_id, contents, is_deleted, created_at')
    .eq('community_id', communityId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Array<{
    id: string;
    community_id: string;
    profile_id: string;
    parent_id: string | null;
    contents: string | null;
    is_deleted: boolean;
    created_at: string | null;
  }>;
}
