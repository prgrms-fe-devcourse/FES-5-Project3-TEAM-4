import { tarotStore, SLOTS } from '@/pages/Tarot/store/tarotStore';
import type { CardInfoProps } from '@/common/types/TarotAnalysis';

const toDir = (rev?: boolean): 'upright' | 'reversed' => (rev ? 'reversed' : 'upright');

export function buildMainCardsFromStore(): CardInfoProps[] {
  const s = tarotStore.getState();
  return SLOTS.map((slot) => s.slots[slot].main)
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => ({
      cardName: m.name ?? String(m.id),
      direction: toDir(m.reversed),
      subCard: null,
      subCardDirection: null,
    }));
}

export function buildCardsWithSubsFromStore(): CardInfoProps[] {
  const s = tarotStore.getState();
  return SLOTS.map((slot) => {
    const m = s.slots[slot].main;
    if (!m) return null;
    const sub = s.slots[slot].sub ?? null;
    return {
      cardName: m.name ?? String(m.id),
      direction: toDir(m.reversed),
      subCard: sub?.name ?? null,
      subCardDirection: sub ? toDir(sub.reversed) : null,
    } as CardInfoProps;
  }).filter(Boolean) as CardInfoProps[];
}
