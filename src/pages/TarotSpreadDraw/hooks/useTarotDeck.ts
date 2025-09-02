import { useEffect, useState, useCallback } from 'react';
import type { TarotCardModel } from '@/pages/Tarot/types/CardProps';
import { selectCardsInfo } from '@/common/api/Card/card';
import { normalizeImageUrl, shuffle } from '../utils/cardHelpers';

export function useTarotDeck() {
  const [deck, setDeck] = useState<TarotCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const rows = await selectCardsInfo(); // 내부에서 showAlert 처리
    if (!rows) {
      setError('카드 정보를 불러오지 못했습니다.');
      setLoading(false);
      return;
    }

    const mapped: TarotCardModel[] = rows
      .filter((r) => !!r.name && !!r.image_url)
      .map((r) => ({
        id: r.name,
        name: r.name!,
        frontSrc: normalizeImageUrl(r.image_url!),
        reversed: Math.random() < 0.5, // ⬅️ 50% 확률
      }));

    setDeck(shuffle(mapped)); // 매 로드마다 랜덤
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // // 선택 사항: 다시 섞기/다시 로드
  // const reshuffle = useCallback(() => setDeck((d) => shuffle(d)), []);
  // const reload = load;

  // return { deck, loading, error, reshuffle, reload };
  return { deck, loading, error };
}
