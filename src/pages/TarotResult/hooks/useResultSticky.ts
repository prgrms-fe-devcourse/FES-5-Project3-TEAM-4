import { useEffect } from 'react';
import { tarotStore, SLOTS, type Slot, type SlotPack } from '@/pages/Tarot/store/tarotStore';
import type { TopicLabel } from '@/pages/TarotQuestion/types/TarotTopics';

const KEY = 'tarot:result:v1';

type Snap = {
  tarotId: string | null;
  readingId?: string;
  question: string;
  topic: TopicLabel | null;
  slots: Record<Slot, SlotPack>;
};

const isSlotsEmpty = (slots: Record<Slot, SlotPack>) =>
  SLOTS.every((k) => !slots[k].main && !slots[k].sub);

const isResultEmpty = () => {
  const s = tarotStore.getState();
  return !s.question && s.topic === null && isSlotsEmpty(s.slots);
};

const save = (s = tarotStore.getState()) => {
  const snap: Snap = {
    tarotId: s.tarotId,
    readingId: s.readingId,
    question: s.question,
    topic: s.topic,
    slots: s.slots,
  };
  sessionStorage.setItem(KEY, JSON.stringify(snap));
};

const load = (): Snap | null => {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Snap;
  } catch {
    return null;
  }
};

export function useResultSticky() {
  useEffect(() => {
    if (isResultEmpty()) {
      const snap = load();
      if (snap) {
        const { setTarotId, setReadingId, setQuestion, setTopic, setSlotPack, setStage } =
          tarotStore.getState();

        setTarotId(snap.tarotId ?? undefined);
        setReadingId(snap.readingId);
        setQuestion(snap.question);
        setTopic(snap.topic);
        SLOTS.forEach((slot) => {
          const pack = snap.slots[slot] ?? { main: null, sub: null };
          setSlotPack(slot, { main: pack.main ?? null, sub: pack.sub ?? null });
        });
        setStage('results');
      }
    }

    save();
    const unsub = tarotStore.subscribe((next) => save(next));

    const onBeforeUnload = () => save();
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      unsub();
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);
}
