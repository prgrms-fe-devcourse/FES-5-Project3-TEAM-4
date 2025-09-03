import TarotCard from '@/pages/Tarot/components/TarotCard';

type Props = {
  id: number | string;
  name: string;
  frontSrc: string;
  width?: number;
  reversed?: boolean;
  className?: string;
  nameClassName?: string;
};

function ResultCardMain({
  id,
  name,
  frontSrc,
  width = 210,
  reversed = false,
  className,
  nameClassName,
}: Props) {
  return (
    <div className={['flex flex-col items-center gap-3', className].filter(Boolean).join(' ')}>
      <div
        className={['text-center text-base md:text-lg text-main-white', nameClassName]
          .filter(Boolean)
          .join(' ')}
      >
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
        className="shadow-[0_10px_40px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
export default ResultCardMain;
