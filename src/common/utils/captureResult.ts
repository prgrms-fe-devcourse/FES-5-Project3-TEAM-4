import supabase from '@/common/api/supabase/supabase';
import { insertTarotImage } from '@/common/api/Tarot/tarotImage';
import { toBlob } from 'html-to-image';
import type { RefObject } from 'react';

export async function captureResult(
  rootRef: RefObject<HTMLDivElement | null>,
  tarotId: string,
  userId: string | null
) {
  // const userId = useAuth((state) => state.userId);
  if (!userId) return;
  if (!rootRef.current) return;
  // 웹폰트 준비되길 잠깐 대기 (폰트 누락 방지)
  // @ts-ignore
  if (document.fonts?.ready) await document.fonts.ready;

  // 1) 캡처 대상 노드들 (표지 + 페이지)
  const nodes: HTMLElement[] = [
    ...rootRef.current.querySelectorAll<HTMLElement>('[data-cover], .page'),
  ];
  if (!nodes.length) {
    alert('캡처할 페이지가 없습니다.');
    return;
  }
  // 4) 캡처 (필터로 버튼/툴바 제외)
  const prevOverflow = rootRef.current.style.overflow;
  rootRef.current.style.overflow = 'visible';

  try {
    const blob = await toBlob(rootRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      filter: (node) => {
        const el = node as HTMLElement;
        // 업로드 버튼/툴바 등은 캡처 제외
        if (el?.classList?.contains('no-capture')) return false;
        return true;
      },
    });
    if (!blob) {
      console.error('이미지 생성 실패 blob이 없음');
      return;
    }

    // 5) 업로드
    const filename = `capture_${Date.now()}.png`;
    const path = `captures/${tarotId}/${filename}`;

    const { error } = await supabase.storage
      .from('capture_result')
      .upload(path, blob, { contentType: 'image/png', upsert: true });

    if (error) {
      console.error('supabase 이미지 업로드 실패', error);
      return;
    }

    const { data } = supabase.storage.from('capture_result').getPublicUrl(path);

    await insertTarotImage(tarotId, userId, data.publicUrl);
  } finally {
    rootRef.current.style.overflow = prevOverflow;
  }
}
