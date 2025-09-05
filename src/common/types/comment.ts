import type { Tables } from '@/common/api/supabase/database.types';

export type CommentRow = Tables<'comment'>;

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
