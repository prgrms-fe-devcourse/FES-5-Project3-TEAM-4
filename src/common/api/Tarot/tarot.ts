import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';

/**
 * tarot join record 테이블 select 함수
 * @param id
 * @returns
 */
export async function selectTarotRecordListByUserId(profile_id: string) {
  try {
    const { data: tarotRecordData, error: selectTarotRecordError } = await supabase
      .from('tarot')
      .select('*,record(*)')
      .eq('profile_id', profile_id)
      .order('created_at', { ascending: false });
    if (selectTarotRecordError) {
      showAlert('error', '타로 기록 조회 실패', selectTarotRecordError?.message);
      return;
    }
    if (!tarotRecordData) return;
    return tarotRecordData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '타로 기록 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '타로 기록 조회 실패', error);
    }
  }
}
