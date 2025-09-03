import NightStarBackGround from '@/pages/Home/components/NightStarBackGround';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: ReactNode;
  onClose: () => void;
}

function NightStarPopup({ children, onClose }: Props) {
  const handlePopClose = () => {
    onClose();
  };
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" onClick={handlePopClose} />
      <div className="relative mx-auto mt-24 w-[min(70vw)] h-[min(80vh)] rounded-2x">
        <div className="absolute z-[9999] right-0 p-2">
          <button
            type="button"
            className="right-0 transition rounded-[50%] duration-300 hover:bg-[#C9AA78] cursor-pointer"
            onClick={handlePopClose}
          >
            <img src="/icons/cancel.svg" alt="취소 버튼 이미지" />
          </button>
        </div>
        {children}
        <NightStarBackGround className="bg-linear-160 from-[#180018] from-20% via-[#010001] to-[#180018] to-80% rounded-2xl" />
      </div>
    </div>,
    document.body // ← 여기로 렌더(원하면 특정 엘리먼트로 교체)
  );
}
export default NightStarPopup;
