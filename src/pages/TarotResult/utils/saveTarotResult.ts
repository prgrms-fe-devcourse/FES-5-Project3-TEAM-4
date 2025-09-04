import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { TablesInsert } from '@/common/api/supabase/database.types';
import type { TarotAnalysis } from '@/common/types/TarotAnalysis';

export type TarotRow = {
  id: string;
  profile_id: string;
  result: string;
  created_at: string;
  topic: string;
  question: string;
};

export async function saveTarotResult(analysis: TarotAnalysis): Promise<TarotRow | null> {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  if (authErr) {
    showAlert('error', '저장 실패', authErr.message);
    return null;
  }
  const user = authData?.user;
  if (!user) {
    showAlert('error', '저장 실패', '로그인이 필요합니다.');
    return null;
  }

  const id = crypto.randomUUID();

  const payload: TablesInsert<'tarot'> = {
    id,
    profile_id: user.id,
    result: analysis.overview?.summary ?? '',
    topic: analysis.topic ?? '',
    question: analysis.prompt ?? '',
  };

  const { error } = await supabase.from('tarot').insert([payload]);
  if (error) {
    showAlert('error', '저장 실패', error.message);
    return null;
  }

  return {
    id,
    profile_id: user.id,
    result: payload.result ?? '',
    created_at: new Date().toISOString(),
    topic: payload.topic ?? '',
    question: payload.question ?? '',
  };
}

export async function updateTarotSummary(
  tarotId: string,
  analysis: TarotAnalysis
): Promise<boolean> {
  const nextResult = analysis.overview?.summary ?? '';
  const { error } = await supabase.from('tarot').update({ result: nextResult }).eq('id', tarotId);
  if (error) {
    showAlert('error', '리딩 요약 업데이트 실패', error.message);
    return false;
  }
  return true;
}
