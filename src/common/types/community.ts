import type { Tables } from '../api/supabase/database.types';

export type CommunityRow = Tables<'community'>;
export type CommunitySortKey = 'created_at' | 'likes';

export interface CommunityOptions {
  page?: number;
  pageSize?: number;
  sort?: CommunitySortKey;
  ascending?: boolean;
  selectColumns?: string;
}
