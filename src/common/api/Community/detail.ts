import supabase from '@/common/api/supabase/supabase';
import { selectCommunityById } from '@/common/api/Community/community';
import { fetchCommentsFlat } from '@/common/api/Community/comment';
import { showAlert } from '@/common/utils/sweetalert';
import type { CommentNode } from '@/common/types/comment';
import type { CommunityDetail } from '@/common/types/community';

function buildCommentTree(
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
      const p = map.get(r.parent_id);
      if (p) p.children!.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

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
  const flat = await fetchCommentsFlat(communityId);
  const orderAsc = flat.slice().sort((a, b) => {
    const at = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
    return at - bt;
  });
  const anon = new Map<string, string>();
  let num = 1;
  for (const r of orderAsc) {
    if (r.profile_id === base.profile_id) continue;
    if (!anon.has(r.profile_id)) anon.set(r.profile_id, `익명${num++}`);
  }

  return {
    row: { ...base, likedByMe },
    images,
    comments: buildCommentTree(flat),
    anonMap: Object.fromEntries(anon),
    isAuthed: !!user,
    currentUserId: user?.id ?? null,
    canEdit: !!(user && user.id === base.profile_id),
  };
}
