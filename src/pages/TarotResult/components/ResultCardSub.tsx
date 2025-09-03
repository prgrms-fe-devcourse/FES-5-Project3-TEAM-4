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

function ResultCardSub({
  id,
  name,
  frontSrc,
  width = 210,
  reversed = false,
  className,
  nameClassName,
}: Props) {
  return (
    <div className={['flex flex-col items-center gap-2', className].filter(Boolean).join(' ')}>
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
      <div
        className={['text-center text-sm md:text-base text-main-white', nameClassName]
          .filter(Boolean)
          .join(' ')}
      >
        {name}
      </div>
    </div>
  );
}
export default ResultCardSub;
