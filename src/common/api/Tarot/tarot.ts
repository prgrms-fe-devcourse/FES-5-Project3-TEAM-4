import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { Tables } from '../supabase/database.types';

/**
 * tarot join record 테이블 select 함수
 * @param id
 * @returns
 */
export async function selectTarotRecordListByUserId(
  profileId: string
): Promise<(Tables<'tarot'> & { record: Tables<'record'>[] })[] | null> {
  try {
    const { data: tarotRecordData, error: selectTarotRecordError } = await supabase
      .from('tarot')
      .select('*,record(*)')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });
    if (selectTarotRecordError) {
      showAlert('error', '타로 기록 조회 실패', selectTarotRecordError?.message);
      return null;
    }
    if (!tarotRecordData) return null;
    return tarotRecordData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '타로 기록 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '타로 기록 조회 실패', error);
    }
    return null;
  }
}
/**
 * tarot join record 테이블 select 함수
 * @param id
 * @returns
 */
export async function selectTarotTarotInfoListBytarotId(
  tarotId: string
): Promise<(Tables<'tarot'> & { tarot_info: Tables<'tarot_info'>[] })[] | null> {
  try {
    const { data: tarotInfoData, error: selectTarotInfoError } = await supabase
      .from('tarot')
      .select('*,tarot_info(*)')
      .eq('id', tarotId)
      .order('created_at', { ascending: false });
    if (selectTarotInfoError) {
      showAlert('error', '타로 정보 조회 실패', selectTarotInfoError?.message);
      return null;
    }
    if (!tarotInfoData) return null;

    return tarotInfoData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '타로 정보 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '타로 정보 조회 실패', error);
    }
    return null;
  }
}
