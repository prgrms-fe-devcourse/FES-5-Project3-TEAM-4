import { useEffect } from 'react';

interface Props {
  tarotId: string;
}

const KAKAO_KEY = import.meta.env.VITE_KAKAOTALK_KEY;
function ShareButton({ tarotId }: Props) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY); // JS 키
    }
  }, []);

  const share = () => {
    // 도메인은 개발자 콘솔 "플랫폼 > Web"에 등록된 것만 사용해야 함
    const origin = window.location.origin; // 예: http://localhost:3000
    const url = `${origin}/share/${encodeURIComponent(tarotId)}`; // ':' 대신 일반 경로 권장

    if (!window.Kakao?.isInitialized?.()) {
      console.warn('Kakao SDK not initialized');
      return;
    }

    try {
      (window.Kakao as any).Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '오늘의 타로 결과',
          description: '타로 결과를 확인해보세요.',
          link: { webUrl: url, mobileWebUrl: url },
        },
        buttons: [{ title: '보기', link: { webUrl: url, mobileWebUrl: url } }],
      });
      // (옵션) 공유 후 내 화면에서도 미리보기 열고 싶다면:
      // window.open(url, '_blank');
      // 또는 location.assign(url);
    } catch (e) {
      console.error('Kakao Share error', e);
    }
  };

  return (
    <button
      onClick={share}
      className="px-4 py-2 rounded bg-yellow-400 text-main-black hover:drop-shadow-[0_0_10px_rgba(255,255,200,0.8)] hover:scale-110"
    >
      카카오톡으로 공유
    </button>
  );
}
export default ShareButton;
