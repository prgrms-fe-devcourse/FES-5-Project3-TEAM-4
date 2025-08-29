import { useRef } from 'react';
import TarotTableScene, { type TarotTableSceneHandle } from './TarotTableScene';

export default function TarotTiltPage() {
  const sceneRef = useRef<TarotTableSceneHandle>(null);

  return (
    <div className="relative min-h-screen">
      <TarotTableScene ref={sceneRef} />
      <div className="absolute inset-x-0 bottom-10 z-20 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => sceneRef.current?.lookDown()}
          className="rounded-full px-6 py-3 bg-violet-600 text-white shadow-lg active:scale-95"
        >
          숙이기
        </button>
        <button
          type="button"
          onClick={() => sceneRef.current?.resetView()}
          className="rounded-full px-6 py-3 bg-white/10 text-white border border-white/20 backdrop-blur"
        >
          초기 시점
        </button>
      </div>
    </div>
  );
}
