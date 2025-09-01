import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { Tables } from '../supabase/database.types';

/**
 * Record 테이블 insert 함수
 * @param id
 * @returns
 */
export async function selectRecordByTarotId(tarotId: string): Promise<Tables<'record'>[] | null> {
  try {
    const { data: recordData, error: selectRecordError } = await supabase
      .from('record')
      .select('*')
      .eq('tarot_id', tarotId);
    if (selectRecordError) {
      showAlert('error', '기록 조회 실패', selectRecordError?.message);
      return null;
    }
    return recordData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '기록 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '기록 조회 실패', error);
    }
    return null;
  }
}

/**
 * Record 테이블 insert 함수
 * @param id
 * @returns
 */
export async function insertRecord(
  tarotId: string,
  profileId: string,
  contents: string
): Promise<{ ok: boolean }> {
  try {
    const { error: insertRecordError } = await supabase.from('record').insert({
      profile_id: profileId,
      tarot_id: tarotId,
      contents: contents,
    });
    if (insertRecordError) {
      showAlert('error', '기록 등록 실패', insertRecordError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '기록 등록 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '기록 등록 실패', error);
    }
    return { ok: false };
  }
}

/**
 * Record 테이블 update 함수
 * @param id
 * @returns
 */
export async function updateRecord(contents: string, recordId: string): Promise<{ ok: boolean }> {
  try {
    const { error: updateRecordError } = await supabase
      .from('record')
      .update({
        contents,
      })
      .eq('id', recordId);
    if (updateRecordError) {
      showAlert('error', '기록 수정 실패', updateRecordError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '기록 수정 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '기록 수정 실패', error);
    }
    return { ok: false };
  }
}

/**
 * Record 테이블 delete 함수
 * @param id
 * @returns
 */
export async function deleteRecord(recordId: string): Promise<{ ok: boolean }> {
  try {
    const { error: deleteRecordError } = await supabase.from('record').delete().eq('id', recordId);
    if (deleteRecordError) {
      showAlert('error', '기록 삭제 실패', deleteRecordError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '기록 삭제 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '기록 삭제 실패', error);
    }
    return { ok: false };
  }
}
