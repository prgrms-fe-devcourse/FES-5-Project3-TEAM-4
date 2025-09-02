import { useRive } from '@rive-app/react-canvas';
import Bg from './Bg';

function Loading() {
  const { RiveComponent } = useRive({
    src: '/Rive/magic_globes.riv',
    stateMachines: 'State Machine 1',
    autoplay: true, // 직접 play()로 제어
  });

  return (
    <div>
      <Bg className="flex items-center justify-center relative">
        <div className=" absolute w-[40%] h-[40vh] flex flex-col items-center rounded-2xl p-10 bg-white/20 shadow-[0_4px_50px_5px_rgba(0,0,0,0.15)] backdrop-blur-[16px]">
          <RiveComponent />
          <p className="text-main-white">Loading...</p>
        </div>
      </Bg>
    </div>
  );
}
export default Loading;
