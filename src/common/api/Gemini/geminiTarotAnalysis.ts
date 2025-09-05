import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { CardInfoProps, TarotAnalysis } from '@/common/types/TarotAnalysis';

const isStorageError = (e: unknown) => {
  const m = e instanceof Error ? e.message : String(e);
  return /(row[-\s]?level\s+security|RLS|permission denied|violat(es|ed)\s+.*policy|insert|update|delete|tarot_(result|info|summary)|storage)/i.test(
    m
  );
};

export async function geminiTarotAnalysis(
  topic: string,
  cards: CardInfoProps[],
  msg: string,
  opts: { guest?: boolean } = {}
): Promise<TarotAnalysis | null> {
  try {
    // 서버리스 함수를 호출하여 Gemini 분석 요청
    const { data, error: analysisTarotError } = await supabase.functions.invoke(
      'gemini-tarot-analyzer',
      {
        body: {
          topic,
          cards,
          msg,
          guest: !!opts.guest,
        },
      }
    );

    if (analysisTarotError) throw analysisTarotError;
    return data.analysis as TarotAnalysis; // 분석 결과 받아서 상태 업데이트
  } catch (error) {
    if (opts.guest && isStorageError(error)) return null;
    const msgText = error instanceof Error ? error.message : String(error);
    showAlert('error', '타로 분석 실패', msgText);
    return null;
  }
}
