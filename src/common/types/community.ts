import type { Tables } from '@/common/api/supabase/database.types';
import type { CommentNode } from '@/common/types/comment';

export type CommunityRow = Tables<'community'>;
export type CommunitySortKey = 'created_at' | 'likes';
export type CommunityRowUI = CommunityRow & { likedByMe?: boolean };

export interface CommunityOptions {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface ListResult<T> {
  items: T[];
  total: number;
}

export type CommunityDetail = {
  row: CommunityRowUI;
  images: string[];
  comments: CommentNode[];
  anonMap: Record<string, string>;
  isAuthed: boolean;
  currentUserId: string | null;
  canEdit: boolean;
};

export type UploadFile = { id: string; file: File };

export type PostEditorProps = {
  mode: 'create' | 'edit';
  initial?: Tables<'community'> | null;
  onSubmitDone: (savedId: string) => void;
};
