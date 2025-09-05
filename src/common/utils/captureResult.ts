import supabase from '@/common/api/supabase/supabase';
import { insertTarotImage, selectTarotImage } from '@/common/api/Tarot/tarotImage';
import { toBlob } from 'html-to-image';
import type { RefObject } from 'react';

// 캡처 전에 준비(폰트/이미지/2프레임 대기)
async function ensureReadyForCapture(root: HTMLElement) {
  // @ts-ignore
  if (document.fonts?.ready) await document.fonts.ready;
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.allSettled(imgs.map((img) => img.decode?.() ?? Promise.resolve()));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

// 오프스크린 클론 캡처
async function captureOffscreen(
  node: HTMLElement,
  opts?: { pixelRatio?: number; filter?: (n: Node) => boolean }
) {
  // 1) 깊은 클론
  const clone = node.cloneNode(true) as HTMLElement;

  // 2) 오프스크린 래퍼
  const rect = node.getBoundingClientRect();
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'fixed',
    left: '-10000px', // 화면 밖으로
    top: '0',
    width: `${Math.round(rect.width)}px`,
    height: `${Math.round(rect.height)}px`,
    zIndex: '2147483647', // 최상단 (겹침 방지)
    contain: 'layout paint size',
    // 절대 금지: opacity:0 / visibility:hidden  (렌더도 숨겨져서 캡처가 빈 화면이 됨)
  });

  // 3) 캡처 안정화용 스타일(슬라이더/3D 영향 제거)
  clone.style.transform = 'none';
  clone.style.animation = 'none';
  clone.style.transition = 'none';
  clone.style.willChange = 'auto';

  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    await ensureReadyForCapture(clone);
    const blob = await toBlob(clone, {
      pixelRatio: opts?.pixelRatio ?? 2,
      cacheBust: true,
      filter: opts?.filter, // 필요시 제외 노드 지정
      // style: { backgroundColor: '#fff' }  // 배경 필요하면
    });
    return blob;
  } finally {
    document.body.removeChild(wrapper);
  }
}

export async function captureResult(
  rootRef: RefObject<HTMLDivElement | null>,
  tarotId: string,
  userId: string | null
) {
  // const userId = useAuth((state) => state.userId);
  if (!userId) return;
  if (!rootRef.current) return;
  const tarotImageData = (await selectTarotImage(tarotId)) ?? [];
  console.log(tarotImageData);
  if (tarotImageData?.length > 0) return;
  // 1) 캡처 대상 노드들 (표지 + 페이지)
  const nodes: HTMLElement[] = [
    ...rootRef.current.querySelectorAll<HTMLElement>('[data-cover], .page'),
  ];
  if (!nodes.length) {
    console.error('캡처할 페이지가 없습니다.');
    return;
  }
  // 4) 캡처 (필터로 버튼/툴바 제외)
  const prevOverflow = rootRef.current.style.overflow;
  rootRef.current.style.overflow = 'visible';

  try {
    const blob = await captureOffscreen(rootRef.current, {
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
