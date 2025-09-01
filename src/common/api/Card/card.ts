import { showAlert } from '@/common/utils/sweetalert';
import type { Tables } from '../supabase/database.types';
import supabase from '../supabase/supabase';

export async function selectCardsInfo(): Promise<Tables<'card'>[] | null> {
  try {
    const { data, error } = await supabase.from('card').select('*').order('arcana');
    if (error) throw error;
    return data;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '카드 정보 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '카드 정보 조회실패', error);
    }
    return null;
  }
}
