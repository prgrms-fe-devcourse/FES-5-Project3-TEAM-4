import type { CommentNode } from '../types/comment';

export function buildCommentTree(
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
