import { create } from 'zustand';
import type { TopicLabel } from '@/common/types/TarotTopics';
import type { TarotAnalysis } from '@/common/types/TarotAnalysis';

export type Slot = 'past' | 'present' | 'future';
export const SLOTS: readonly Slot[] = ['past', 'present', 'future'] as const;

export type CardPick = {
  id: number | string;
  name?: string;
  frontSrc?: string;
  reversed?: boolean;
};

export type SlotPack = {
  main: CardPick | null;
  sub: CardPick | null;
};

type SpreadSnapshot = {
  deckOrder: Array<string | number>;
};

type State = {
  tarotId: string | null;
  geminiAnalysis: TarotAnalysis | null;
  readingId?: string;
  question: string;
  topic: TopicLabel | null;
  slots: Record<Slot, SlotPack>;
  stage: 'spread' | 'results' | 'clarify';
  clarifyMode: boolean;
  spreadSnapshot?: SpreadSnapshot;

  setTarotId: (id?: string) => void;
  setGeminiAnalysis: (analysisData: TarotAnalysis) => void;
  setReadingId: (id?: string) => void;
  setQuestion: (q: string) => void;
  setTopic: (t: TopicLabel | null) => void;
  setStage: (stage: State['stage']) => void;
  setCard: (slot: Slot, kind: keyof SlotPack, card: CardPick | null) => void;
  setSlotPack: (slot: Slot, pack: Partial<SlotPack>) => void;
  saveSpreadSnapshot: (snap: SpreadSnapshot) => void;
  setClarifyMode: (on: boolean) => void;

  clearSlot: (slot: Slot) => void;
  clearAll: () => void;
};

const emptyPack: SlotPack = { main: null, sub: null };
const initialSlots: Record<Slot, SlotPack> = {
  past: { ...emptyPack },
  present: { ...emptyPack },
  future: { ...emptyPack },
};

export const tarotStore = create<State>((set) => ({
  tarotId: null,
  geminiAnalysis: null,
  readingId: undefined,
  question: '',
  topic: null,
  slots: { ...initialSlots },
  stage: 'spread',
  clarifyMode: false,
  spreadSnapshot: undefined,
  setTarotId: (tarotId) => set({ tarotId }),
  setGeminiAnalysis: (geminiAnalysis) => set({ geminiAnalysis }),
  setReadingId: (readingId) => set({ readingId }),
  setQuestion: (question) => set({ question }),
  setTopic: (topic) => set({ topic }),
  setStage: (stage) => set({ stage }),

  setCard: (slot, kind, card) =>
    set((s) => ({ slots: { ...s.slots, [slot]: { ...s.slots[slot], [kind]: card } } })),

  setSlotPack: (slot, pack) =>
    set((s) => ({ slots: { ...s.slots, [slot]: { ...s.slots[slot], ...pack } } })),

  saveSpreadSnapshot: (snap) => set({ spreadSnapshot: snap }),
  setClarifyMode: (on) => set({ clarifyMode: on, stage: on ? 'clarify' : 'spread' }),

  clearSlot: (slot) => set((s) => ({ slots: { ...s.slots, [slot]: { ...emptyPack } } })),
  clearAll: () =>
    set({
      tarotId: null,
      readingId: undefined,
      question: '',
      topic: null,
      slots: { ...initialSlots },
      stage: 'spread',
      clarifyMode: false,
      spreadSnapshot: undefined,
    }),
}));

export const isMainComplete = (s: State) => SLOTS.every((k) => Boolean(s.slots[k].main));
export const getMainArray = (s: State) =>
  SLOTS.map((k) => s.slots[k].main).filter(Boolean) as CardPick[];
export const getSubArray = (s: State) =>
  SLOTS.map((k) => s.slots[k].sub).filter(Boolean) as CardPick[];
export const getSlotPack = (s: State, slot: Slot) => s.slots[slot];
