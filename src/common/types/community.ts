import type { Tables } from '@/common/api/supabase/database.types';

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
