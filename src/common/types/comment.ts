import type { Tables } from '@/common/api/supabase/database.types';

export type CommentRow = Tables<'comment'>;

export type CommentNode = CommentRow & {
  authorName?: string | null;
  children?: CommentNode[];
};
