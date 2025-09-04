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

    const rows = await selectCardsInfo();
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
        reversed: Math.random() < 0.5,
      }));

    setDeck(shuffle(mapped));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { deck, loading, error };
}
