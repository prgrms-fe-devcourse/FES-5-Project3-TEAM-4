import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { TarotAnalysis } from '@/common/types/TarotAnalysis';

type CardInfoProps = {
  cardName: string;
  direction: string;
  subCard?: string;
  subCardDirection?: string;
};

export async function geminiTarotAnalysis(
  topic: string,
  cards: CardInfoProps[],
  msg: string
): Promise<TarotAnalysis | null> {
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

    return data.analysis; // 분석 결과 받아서 상태 업데이트
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '타로 분석 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '타로 분석 실패', error);
    }
    return null;
  }
}
