import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';

/**
 * Record 테이블 insert 함수
 * @param id
 * @returns
 */
export async function insertTarotImage(
  tarotId: string,
  profileId: string,
  imageUrl: string
): Promise<{ ok: boolean }> {
  try {
    const { error: insertTarotImgError } = await supabase.from('tarot_image').insert({
      profile_id: profileId,
      tarot_id: tarotId,
      image_url: imageUrl,
    });
    if (insertTarotImgError) {
      showAlert('error', '타로 이미지 저장 실패', insertTarotImgError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '타로 이미지 저장 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '타로 이미지 저장 실패', error);
    }
    return { ok: false };
  }
}

/**
 * Tarot image 테이블 select 함수
 * @param id
 * @returns
 */
export async function selectTarotImage(tartoId: string) {
  try {
    const { data: tarotImageData, error: selectarotImageError } = await supabase
      .from('tarot_image')
      .select('*')
      .eq('tarot_id', tartoId);
    if (selectarotImageError) {
      showAlert('error', 'Tarot image 조회 실패', selectarotImageError?.message);
      return;
    }
    if (!tarotImageData) return;
    return tarotImageData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', 'Tarot image 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', 'Tarot image 조회 실패', error);
    }
    return;
  }
}
