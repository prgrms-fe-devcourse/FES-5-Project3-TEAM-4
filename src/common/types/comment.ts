import type { Tables, TablesInsert } from '@/common/api/supabase/database.types';

export type CommentRow = Tables<'comment'>;
export type InsertComment = TablesInsert<'comment'>;

export type CommentNode = CommentRow & {
  authorName?: string | null;
  children?: CommentNode[];
};

export type CommentItemProps = {
  comment: CommentNode;
  postAuthorId: string;
  currentUserId?: string | null;
  isAuthed: boolean;
  depth?: number;
  postId: string;
  anonMap: Record<string, string>;
  onReplied: () => Promise<void> | void;
  onEdited: () => Promise<void> | void;
  onDeleted: () => Promise<void> | void;
};

export type CommentPayload = {
  community_id: string;
  contents: string;
  parent_id?: string | null;
};
