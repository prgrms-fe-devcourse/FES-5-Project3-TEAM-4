import TarotCard from '@/pages/Tarot/components/TarotCard';
import WarnIcon from '@/assets/Tarot/icons/warning.svg';
import { isAmbiguous } from '../utils/ambiguous';

type Props = {
  id: number | string;
  name: string;
  frontSrc: string;
  width?: number;
  reversed?: boolean;
  className?: string;
  nameClassName?: string;
  hasSub?: boolean;
};

function ResultCardMain({
  id,
  name,
  frontSrc,
  width = 210,
  reversed = false,
  className,
  nameClassName,
  hasSub = false,
}: Props) {
  const showWarn = isAmbiguous(name) && !hasSub;

  return (
    <div className={['flex flex-col items-center gap-3', className].filter(Boolean).join(' ')}>
      <div
        className={[
          'text-center text-base md:text-lg text-main-white flex items-center gap-2',
          nameClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {showWarn && <img src={WarnIcon} alt="주의 아이콘" className="w-5 h-5" />}
        {name}
      </div>
      <TarotCard
        id={id}
        name={name}
        frontSrc={frontSrc}
        width={width}
        faceUp
        reversed={reversed}
        locked
        className=""
      />
    </div>
  );
}
export default ResultCardMain;
