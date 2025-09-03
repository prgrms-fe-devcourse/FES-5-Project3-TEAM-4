import tw from '@/common/utils/tw';
import { useEffect, useState } from 'react';

interface Props {
  topText: string;
  bottomText?: string;
  direction: 'left' | 'right';
  className?: string;
}

function InterPretaionText({ topText, bottomText, direction, className }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);
  const textClass =
    'p-5 rounded-xl bg-white/15 shadow-[0_4px_50px_5px_rgba(0,0,0,0.20)] backdrop-blur-[30px]' +
    ` break-keep transition-opacity ease-in-out ${show ? 'opacity-100' : 'opacity-0'}` +
    ` xl:text-base lg:text-sm md:text-xs`;
  return (
    <div className={tw('flex flex-col justify-between gap-40 w-[25%]', className)}>
      <p className={`${textClass} ${direction === 'left' ? 'duration-1000' : 'duration-[2000ms]'}`}>
        {topText}
      </p>
      {bottomText && (
        <p
          className={`${textClass} ${direction === 'left' ? 'duration-[3000ms]' : 'duration-[4000ms]'}`}
        >
          {bottomText}
        </p>
      )}
    </div>
  );
}
export default InterPretaionText;
