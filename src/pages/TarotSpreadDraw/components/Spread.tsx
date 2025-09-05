import {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  type RefObject,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import TarotCard from '@/pages/Tarot/components/TarotCard';
import type { TarotCardModel, TarotCardHandle } from '../../Tarot/types/CardProps';
import { tarotStore, type Slot, type CardPick } from '@/pages/Tarot/store/tarotStore';
import { isAmbiguous } from '@/pages/TarotResult/utils/ambiguous';
import { geminiTarotAnalysis } from '@/common/api/Gemini/geminiTarotAnalysis';
import {
  buildCardsWithSubsFromStore,
  buildMainCardsFromStore,
} from '@/pages/Tarot/utils/buildCardsFromStore';
import Loading from '@/common/components/Loading';
import { createPortal, flushSync } from 'react-dom';

import supabase from '@/common/api/supabase/supabase';
import { saveTarotResult, updateTarotSummary } from '@/pages/TarotResult/utils/saveTarotResult';
import { saveTarotInfoMain, saveTarotInfoSubs } from '@/pages/TarotResult/utils/saveTarotInfo';

type Props = {
  deck: TarotCardModel[];
  cardWidth: number;
  transforms: string[];
  slotRefs?: readonly RefObject<HTMLDivElement | null>[];
  resizeKey?: number;
  onSnap?: (slotIdx: number, cardId: number | string) => void;
  canAccept?: (slotIdx: number) => boolean;
};

function Spread({ deck, cardWidth, transforms, slotRefs, resizeKey, onSnap, canAccept }: Props) {
  const wrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(TarotCardHandle | null)[]>([]);
  const preWrapAngleRef = useRef<number[]>([]);
  const [filledBySlot, setFilledBySlot] = useState<Array<number | null>>([]);
  const [slotOfCard, setSlotOfCard] = useState<Array<number | null>>([]);
  const [flippedMain, setFlippedMain] = useState(false);

  const slots = tarotStore((s) => s.slots);
  const setCard = tarotStore((s) => s.setCard);
  const setStage = tarotStore((s) => s.setStage);
  const clarifyMode = tarotStore((s) => s.clarifyMode);
  const spreadSnapshot = tarotStore((s) => s.spreadSnapshot);
  const saveSpreadSnapshot = tarotStore((s) => s.saveSpreadSnapshot);
  const setReadingId = tarotStore((s) => s.setReadingId);
  const readingId = tarotStore((s) => s.readingId);

  const setTarotId = tarotStore((s) => s.setTarotId);
  const setGeminiAnalysis = tarotStore((s) => s.setGeminiAnalysis);

  const topic = tarotStore((s) => s.topic);
  const question = tarotStore((s) => s.question);

  const mainSentOnceRef = useRef(false);
  const subSentOnceRef = useRef(false);

  const savedMainOnceRef = useRef(false);
  const expectFlipIdsRef = useRef<Set<string>>(new Set());
  const navigatingRef = useRef(false);
  const restoredOnceRef = useRef(false);
  const phaseRef = useRef<'main' | 'sub' | null>(null);

  const tarotIdRef = useRef<string | null>(null);
  const mainInfoIdMapRef = useRef<Record<string, string>>({});

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading...');
  const loadingDelayTimerRef = useRef<number | null>(null);
  const fetchInFlightRef = useRef(false);

  const navigatedRef = useRef(false);
  const navigate = useNavigate();

  const [mainDeckIdxSet, setMainDeckIdxSet] = useState<Set<number>>(new Set());

  const authedUidRef = useRef<string | null | undefined>(undefined);
  const getUid = useCallback(async () => {
    if (authedUidRef.current !== undefined) return authedUidRef.current;
    const { data } = await supabase.auth.getUser();
    authedUidRef.current = data?.user?.id ?? null;
    return authedUidRef.current;
  }, []);
  useEffect(() => {
    getUid();
  }, [getUid]);

  const goResults = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;
    setStage('results');
    navigate('/tarot/result', { replace: true });
  }, [navigate, setStage]);

  useEffect(() => {
    return () => {
      if (loadingDelayTimerRef.current) {
        clearTimeout(loadingDelayTimerRef.current);
        loadingDelayTimerRef.current = null;
      }
      setLoading(false);
      fetchInFlightRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (readingId && !tarotIdRef.current) {
      tarotIdRef.current = readingId;
    }
  }, [readingId]);

  const ensureTarotId = useCallback(async (): Promise<string | null> => {
    if (tarotIdRef.current) return tarotIdRef.current;
    if (readingId) {
      tarotIdRef.current = readingId;
      return readingId;
    }
    const uid = await getUid();
    if (!uid) return null;
    try {
      const { data } = await supabase
        .from('tarot')
        .select('id')
        .eq('profile_id', uid)
        .order('created_at', { ascending: false })
        .limit(1);
      const id = data?.[0]?.id ?? null;
      if (id) {
        tarotIdRef.current = id;
        setReadingId(id);
      }
      return id;
    } catch {
      return null;
    }
  }, [getUid, readingId, setReadingId]);

  const setWrapRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      wrapsRef.current[i] = el;
    },
    []
  );
  const setCardRef = useCallback(
    (i: number) => (el: TarotCardHandle | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const n = slotRefs?.length ?? 0;
    if (n > 0 && filledBySlot.length !== n) setFilledBySlot(Array(n).fill(null));
  }, [slotRefs?.length, filledBySlot.length]);

  const realignOne = useCallback(
    (cardIdx: number, slotIdx: number, dur = 0) => {
      const ref = cardRefs.current[cardIdx];
      const slotEl = slotRefs?.[slotIdx]?.current || null;
      const root = ref?.rootEl || null;
      const cardEl = ref?.cardEl || null;
      if (!ref || !slotEl || !root || !cardEl) return;

      const cardRect = cardEl.getBoundingClientRect();
      const cX = cardRect.left + cardRect.width / 2;
      const cY = cardRect.top + cardRect.height / 2;

      const r = slotEl.getBoundingClientRect();
      const sX = r.left + r.width / 2;
      const sY = r.top + r.height / 2;

      const tx = Number(gsap.getProperty(root, 'x')) || 0;
      const ty = Number(gsap.getProperty(root, 'y')) || 0;

      const ratio = Number((root as HTMLElement).dataset.fitr) || 0.8;
      const desired = r.width * ratio;
      const currentScale = Number(gsap.getProperty(root, 'scale')) || 1;
      const currentWidth = (root as HTMLElement).getBoundingClientRect().width;
      const nextScale = currentScale * (desired / currentWidth);

      ref.moveTo(tx + (sX - cX), ty + (sY - cY), dur);

      const tl = gsap.timeline({
        onComplete: () => {
          const renderedWidth = (root as HTMLElement).getBoundingClientRect().width;
          (root as HTMLElement).style.width = `${Math.round(renderedWidth)}px`;
          gsap.set(root, { scale: 1 });
          gsap.to(root, {
            width: desired,
            duration: Math.max(0.18, (dur / 1000) * 0.4),
            ease: 'power2.out',
          });
        },
      });

      tl.to(root, { scale: nextScale, duration: dur / 1000, ease: 'power3.out' });
    },
    [slotRefs]
  );

  const realignSnapped = useCallback(() => {
    if (!slotRefs) return;
    for (let i = 0; i < slotOfCard.length; i++) {
      const s = slotOfCard[i];
      if (s == null) continue;
      realignOne(i, s, 0);
    }
  }, [slotOfCard, slotRefs, realignOne]);

  const [slotResizeTick, setSlotResizeTick] = useState(0);
  useEffect(() => {
    if (!slotRefs || slotRefs.length === 0) return;
    const observers: ResizeObserver[] = [];
    slotRefs.forEach((ref) => {
      const el = ref?.current;
      if (!el) return;
      const ro = new ResizeObserver(() => setSlotResizeTick((t) => t + 1));
      ro.observe(el);
      observers.push(ro);
    });
    return () => observers.forEach((ro) => ro.disconnect());
  }, [slotRefs]);

  useEffect(() => {
    realignSnapped();
  }, [resizeKey, realignSnapped, slotRefs?.length, slotResizeTick]);

  const scheduleRealign = useCallback(
    (cardIdx: number, slotIdx: number, dur = 220) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          realignOne(cardIdx, slotIdx, dur);
          const wrap = wrapsRef.current[cardIdx];
          if (wrap) gsap.set(wrap, { zIndex: slotIdx + 1 });
        });
      });
    },
    [realignOne]
  );

  const orderedDeck = useMemo(() => {
    const order = spreadSnapshot?.deckOrder;
    if (!order || !order.length) return deck;
    const m = new Map(order.map((id, i) => [String(id), i]));
    return [...deck].sort((a, b) => {
      const ai = m.get(String(a.id));
      const bi = m.get(String(b.id));
      if (ai == null && bi == null) return 0;
      if (ai == null) return 1;
      if (bi == null) return -1;
      return ai - bi;
    });
  }, [deck, spreadSnapshot?.deckOrder]);

  useEffect(() => {
    const n = slotRefs?.length ?? 0;
    if (!n || filledBySlot.length !== n || flippedMain) return;

    const mainIdxList = Array.from({ length: n }, (_, i) => i).filter((i) => i % 2 === 0);
    const allMainFilled = mainIdxList.every((mi) => filledBySlot[mi] !== null);
    if (!allMainFilled) return;

    if (!savedMainOnceRef.current) {
      const idxToSlot = (mi: number): Slot | null =>
        mi === 0 ? 'past' : mi === 2 ? 'present' : mi === 4 ? 'future' : null;

      mainIdxList.forEach((mi) => {
        const deckIdx = filledBySlot[mi];
        if (deckIdx == null) return;
        const card = orderedDeck[deckIdx];
        const slot = idxToSlot(mi);
        if (!slot) return;
        setCard(slot, 'main', {
          id: card.id,
          name: card.name,
          frontSrc: card.frontSrc,
          reversed: card.reversed,
        });
      });

      saveSpreadSnapshot({ deckOrder: orderedDeck.map((c) => c.id) });
      savedMainOnceRef.current = true;
    }

    expectFlipIdsRef.current = new Set(
      mainIdxList
        .map((mi) => filledBySlot[mi])
        .filter((v) => v != null)
        .map((deckIdx) => String(orderedDeck[deckIdx!].id))
    );
    navigatingRef.current = true;
    phaseRef.current = 'main';

    window.setTimeout(() => {
      if (navigatingRef.current && phaseRef.current === 'main') {
        navigatingRef.current = false;
        expectFlipIdsRef.current.clear();
      }
    }, 4000);

    mainIdxList.forEach((mi, order) => {
      const cardIdx = filledBySlot[mi];
      const ref = cardIdx != null ? cardRefs.current[cardIdx] : null;
      setTimeout(() => {
        ref?.flip(true);
      }, order * 150);
    });

    setFlippedMain(true);
  }, [filledBySlot, slotRefs?.length, flippedMain, orderedDeck, setCard, saveSpreadSnapshot]);

  useLayoutEffect(() => {
    if (!clarifyMode) return;
    if (restoredOnceRef.current) return;
    const n = slotRefs?.length ?? 0;
    if (!n) return;
    if (!orderedDeck.length) return;

    const mainIdxList = Array.from({ length: n }, (_, i) => i).filter((i) => i % 2 === 0);
    const slotKeyByMi = (mi: number): Slot | null =>
      mi === 0 ? 'past' : mi === 2 ? 'present' : mi === 4 ? 'future' : null;

    const idxById = new Map<string, number>();
    orderedDeck.forEach((c, i) => idxById.set(String(c.id), i));

    const baseFilled = Array(n).fill(null) as Array<number | null>;
    const baseSlotOfCard = Array(orderedDeck.length).fill(null) as Array<number | null>;
    const mains = new Set<number>();

    flushSync(() => {
      mainIdxList.forEach((mi) => {
        const key = slotKeyByMi(mi);
        if (!key) return;
        const pick: CardPick | null = slots[key]?.main ?? null;
        if (!pick) return;
        const deckIdx = idxById.get(String(pick.id));
        if (deckIdx == null) return;
        baseFilled[mi] = deckIdx;
        baseSlotOfCard[deckIdx] = mi;
        mains.add(deckIdx);
      });

      setFilledBySlot(baseFilled);
      setSlotOfCard(baseSlotOfCard);
      setMainDeckIdxSet(mains);
    });

    requestAnimationFrame(() => {
      mainIdxList.forEach((mi) => {
        const deckIdx = baseSlotOfCard.findIndex((s) => s === mi);
        if (deckIdx == null || deckIdx < 0) return;

        const ref = cardRefs.current[deckIdx];
        const root = ref?.rootEl as HTMLElement | null;
        const wrap = wrapsRef.current[deckIdx];

        if (wrap) gsap.set(wrap, { rotation: 0, x: 0, y: 0, zIndex: mi + 1 });
        if (root) {
          root.dataset.fitr = '0.8';
          gsap.set(root, { x: 0, y: 0, scale: 1 });
        }

        realignOne(deckIdx, mi, 0);
        ref?.lock();
      });
    });

    restoredOnceRef.current = true;
  }, [clarifyMode, orderedDeck, slotRefs, slots, realignOne]);

  useEffect(() => {
    if (!clarifyMode) return;
    const n = slotRefs?.length ?? 0;
    if (!n) return;
    if (!orderedDeck.length) return;

    const slotKeyByPair = (pair: number): Slot | null =>
      pair === 0 ? 'past' : pair === 1 ? 'present' : pair === 2 ? 'future' : null;

    const subIdxList: number[] = [];
    for (let pair = 0; pair < n / 2; pair++) {
      const key = slotKeyByPair(pair);
      if (!key) continue;
      const mainPick = slots[key].main;
      const ambiguous = Boolean(mainPick && isAmbiguous(mainPick.name ?? String(mainPick.id)));
      if (!ambiguous) continue;
      const subFlatIdx = pair * 2 + 1;
      subIdxList.push(subFlatIdx);
    }

    if (subIdxList.length === 0) return;

    const allSubsFilled = subIdxList.every((si) => filledBySlot[si] != null);
    if (!allSubsFilled) return;

    if (navigatingRef.current) return;

    const flipIdSet = new Set<string>();
    subIdxList.forEach((si) => {
      const deckIdx = filledBySlot[si];
      if (deckIdx == null) return;
      const card = orderedDeck[deckIdx];

      const pair = Math.floor(si / 2);
      const key = slotKeyByPair(pair);
      if (key) {
        setCard(key, 'sub', {
          id: card.id,
          name: card.name,
          frontSrc: card.frontSrc,
          reversed: card.reversed,
        });
      }

      flipIdSet.add(String(card.id));
    });

    expectFlipIdsRef.current = flipIdSet;
    navigatingRef.current = true;
    phaseRef.current = 'sub';

    window.setTimeout(() => {
      if (navigatingRef.current && phaseRef.current === 'sub') {
        navigatingRef.current = false;
        expectFlipIdsRef.current.clear();
      }
    }, 4000);

    subIdxList.forEach((si, order) => {
      const deckIdx = filledBySlot[si];
      const ref = deckIdx != null ? cardRefs.current[deckIdx] : null;
      setTimeout(() => {
        ref?.flip(true);
      }, order * 150);
      const wrap = wrapsRef.current[deckIdx!];
      if (wrap) gsap.set(wrap, { zIndex: si + 1 });
    });
  }, [clarifyMode, slotRefs?.length, orderedDeck, filledBySlot, slots, setCard]);

  const onDragEndFactory =
    (idx: number) =>
    (
      _id: number | string,
      payload: {
        clientX: number;
        clientY: number;
        translate: { x: number; y: number };
        cardRect: DOMRect;
      }
    ) => {
      const ref = cardRefs.current[idx];
      if (!ref) return;

      const restore = () => {
        const ang = preWrapAngleRef.current[idx] ?? 0;
        if (wrapsRef.current[idx]) {
          gsap.to(wrapsRef.current[idx]!, { rotation: ang, duration: 0.28, ease: 'power3.out' });
        }
        ref.reset(280);
      };

      if (!slotRefs || slotRefs.length === 0) {
        restore();
        return;
      }

      const cX = payload.cardRect.left + payload.cardRect.width / 2;
      const cY = payload.cardRect.top + payload.cardRect.height / 2;

      const isVisible = (el: Element) => {
        const style = window.getComputedStyle(el as HTMLElement);
        if (style.visibility === 'hidden') return false;
        if (style.opacity === '0') return false;
        const rect = (el as HTMLElement).getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return false;
        return true;
      };

      const n = slotRefs.length;
      const order: number[] = [];
      if (clarifyMode) {
        for (let i = 0; i < n; i += 2) {
          if (i + 1 < n) order.push(i + 1);
          order.push(i);
        }
      } else {
        for (let i = 0; i < n; i += 2) {
          order.push(i);
          if (i + 1 < n) order.push(i + 1);
        }
      }

      let hit: number | null = null;

      for (const i of order) {
        const el = slotRefs[i]?.current;
        if (!el) continue;
        if (!isVisible(el)) continue;

        const r = el.getBoundingClientRect();
        const within = cX > r.left && cX < r.right && cY > r.top && cY < r.bottom;
        if (within) {
          hit = i;
          break;
        }
      }

      if (hit === null) {
        restore();
        return;
      }

      const occupiedLocal = filledBySlot[hit] !== null;
      if ((canAccept && !canAccept(hit)) || (!canAccept && occupiedLocal)) {
        restore();
        return;
      }

      const r0 = slotRefs[hit]!.current!.getBoundingClientRect();
      const sX0 = r0.left + r0.width / 2;
      const sY0 = r0.top + r0.height / 2;
      const nx = payload.translate.x + (sX0 - cX);
      const ny = payload.translate.y + (sY0 - cY);

      if (wrapsRef.current[idx]) gsap.set(wrapsRef.current[idx]!, { rotation: 0 });

      ref.moveTo(nx, ny, 140);
      ref.lock();

      setFilledBySlot((prev) => {
        const next = [...prev];
        next[hit!] = idx;
        return next;
      });
      setSlotOfCard((prev) => {
        const next = [...prev];
        next[idx] = hit!;
        return next;
      });

      const root = ref.rootEl as HTMLElement | null;
      if (root) root.dataset.fitr = '0.8';

      onSnap?.(hit, _id);
      scheduleRealign(idx, hit!, 220);
    };

  function LoadingOverlay({ message }: { message: string }) {
    return createPortal(
      <div className="fixed inset-0 z-[2147483647]">
        <Loading message={message} mode="default" />
      </div>,
      document.body
    );
  }

  return (
    <>
      {loading && <LoadingOverlay message={loadingMsg} />}

      {orderedDeck.map((c, i) => {
        const snapped = slotOfCard[i] != null;
        return (
          <div
            key={String(c.id)}
            data-card
            ref={setWrapRef(i)}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: snapped ? 'none' : transforms[i],
              transformOrigin: 'bottom center',
              zIndex: snapped && slotOfCard[i] != null ? (slotOfCard[i] as number) + 1 : i + 1,
            }}
          >
            <div data-anim className="origin-bottom will-change-transform">
              <TarotCard
                ref={setCardRef(i)}
                id={String(c.id)}
                name={c.name}
                frontSrc={c.frontSrc}
                width={cardWidth}
                reversed={c.reversed}
                flipDir={c.reversed ? 1 : -1}
                initialFaceUp={clarifyMode && mainDeckIdxSet.has(i)}
                onFlip={async (id, faceUp) => {
                  if (!navigatingRef.current) return;
                  if (!faceUp) return;
                  const key = String(id);
                  if (!expectFlipIdsRef.current.has(key)) return;
                  expectFlipIdsRef.current.delete(key);

                  if (expectFlipIdsRef.current.size === 0) {
                    navigatingRef.current = false;

                    if (phaseRef.current === 'main' && !mainSentOnceRef.current) {
                      mainSentOnceRef.current = true;
                      const cards = buildMainCardsFromStore();
                      const msg = (question || '').trim() || '가까운 시일 내 흐름의 포인트는?';

                      fetchInFlightRef.current = true;
                      if (loadingDelayTimerRef.current) clearTimeout(loadingDelayTimerRef.current);
                      loadingDelayTimerRef.current = window.setTimeout(() => {
                        if (fetchInFlightRef.current) {
                          setLoadingMsg('리딩 생성 중…');
                          setLoading(true);
                        }
                        loadingDelayTimerRef.current = null;
                      }, 3000);

                      try {
                        const data = await geminiTarotAnalysis(topic ?? '일반', cards, msg);
                        if (data) {
                          setGeminiAnalysis(data);
                          const uid = await getUid();
                          if (uid && !tarotIdRef.current) {
                            const tarotRow = await saveTarotResult(data);
                            if (tarotRow) {
                              setTarotId(tarotRow.id);
                              tarotIdRef.current = tarotRow.id;
                              setReadingId(tarotRow.id);
                            }
                          }
                          const uid2 = await getUid();
                          if (uid2 && tarotIdRef.current) {
                            const map = await saveTarotInfoMain(data, tarotIdRef.current);
                            if (map) mainInfoIdMapRef.current = map;
                          }
                        }
                      } finally {
                        fetchInFlightRef.current = false;
                        if (loadingDelayTimerRef.current) {
                          clearTimeout(loadingDelayTimerRef.current);
                          loadingDelayTimerRef.current = null;
                        }
                        setLoading(false);
                        if (!clarifyMode) goResults();
                      }
                    }

                    if (phaseRef.current === 'sub' && !subSentOnceRef.current) {
                      subSentOnceRef.current = true;
                      const cards = buildCardsWithSubsFromStore();
                      const msg = (question || '').trim() || '보조 카드까지 포함한 상세 리딩';

                      fetchInFlightRef.current = true;
                      if (loadingDelayTimerRef.current) clearTimeout(loadingDelayTimerRef.current);
                      loadingDelayTimerRef.current = window.setTimeout(() => {
                        if (fetchInFlightRef.current) {
                          setLoadingMsg('보조 리딩 생성 중…');
                          setLoading(true);
                        }
                        loadingDelayTimerRef.current = null;
                      }, 3000);

                      try {
                        const data = await geminiTarotAnalysis(topic ?? '일반', cards, msg);
                        if (data) {
                          setGeminiAnalysis(data);

                          const uid = await getUid();
                          if (uid) {
                            const tid = await ensureTarotId();
                            if (tid) {
                              await updateTarotSummary(tid, data);
                              await saveTarotInfoSubs(data, tid, mainInfoIdMapRef.current);
                            }
                          }
                        }
                      } finally {
                        fetchInFlightRef.current = false;
                        if (loadingDelayTimerRef.current) {
                          clearTimeout(loadingDelayTimerRef.current);
                          loadingDelayTimerRef.current = null;
                        }
                        setLoading(false);
                        goResults();
                      }
                    }
                  }
                }}
                onDragStart={(_, payload) => {
                  const wrap = wrapsRef.current[i];
                  if (wrap) {
                    const ang = Number(gsap.getProperty(wrap, 'rotation')) || 0;
                    preWrapAngleRef.current[i] = ang;
                    gsap.set(wrap, { rotation: 0 });
                  }
                  if (!payload) return;
                  const { clientX, clientY, translate, cardRect } = payload;
                  const cx = cardRect.left + cardRect.width / 2;
                  const cy = cardRect.top + cardRect.height / 2;
                  const dx = cx - clientX;
                  const dy = cy - clientY;
                  const card = cardRefs.current[i];
                  if (card) card.moveTo(translate.x + dx, translate.y + dy, 0);
                }}
                onDragEnd={onDragEndFactory(i)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Spread;
