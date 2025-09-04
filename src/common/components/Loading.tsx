import { useRive } from '@rive-app/react-canvas';
import Bg from './Bg';

interface Props {
  message?: string;
  mode?: 'contents' | 'default';
}

function Loading({ message = 'Loading...', mode = 'default' }: Props) {
  const { RiveComponent } = useRive({
    src: '/Rive/magic_globes.riv',
    stateMachines: 'State Machine 1',
    autoplay: true, // 직접 play()로 제어
  });
  if (mode === 'default') {
    return (
      <div>
        <Bg className="flex items-center justify-center relative">
          <div className=" absolute w-[40%] h-[40vh] flex flex-col items-center rounded-2xl p-10 bg-white/20 shadow-[0_4px_50px_5px_rgba(0,0,0,0.15)] backdrop-blur-[16px]">
            <RiveComponent />
            <p className="text-main-white">{message}</p>
          </div>
        </Bg>
      </div>
    );
  } else {
    return (
      <div className="w-full h-[90%] flex flex-col items-center">
        <div className="w-[200px] h-[300px]">
          <RiveComponent />
        </div>
        <p className="text-main-white">{message}</p>
      </div>
    );
  }
}

export default Loading;
