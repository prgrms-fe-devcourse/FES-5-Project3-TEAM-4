import supabase from '../supabase/supabase';
import type { CardInfoProps, TarotAnalysis } from '@/common/types/TarotAnalysis';

type AnalysisDataType = {
  ok: boolean;
  message?: string;
  analysisData?: TarotAnalysis;
};

export async function geminiTarotAnalysis(
  topic: string,
  cards: CardInfoProps[],
  msg: string
): Promise<AnalysisDataType> {
  try {
    // 서버리스 함수를 호출하여 Gemini 분석 요청
    const { data, error: analysisTarotError } = await supabase.functions.invoke(
      'gemini-tarot-analyzer',
      {
        body: {
          topic: topic,
          cards: cards,
          msg: msg,
        },
      }
    );

    if (analysisTarotError) throw analysisTarotError;

    return { ok: true, analysisData: data.analysis }; // 분석 결과 받아서 상태 업데이트
  } catch (error) {
    if (error instanceof Error) {
      return { ok: false, message: error.message };
    } else if (typeof error === 'string') {
      return { ok: false, message: error };
    }
    return { ok: false, message: 'Gemini API 통신 에러' };
  }
}
