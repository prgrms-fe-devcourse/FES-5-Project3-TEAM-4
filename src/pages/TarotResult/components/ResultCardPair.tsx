import ResultCardMain from './ResultCardMain';
import ResultCardSub from './ResultCardSub';

type CardLike = {
  id: string | number;
  name: string;
  frontSrc: string;
  width?: number;
  reversed?: boolean;
};

type Props = {
  main: CardLike;
  sub?: CardLike;
  className?: string;
  subClassName?: string;
};

export default function ResultPair({ main, sub, className, subClassName }: Props) {
  const offsetY = 320;
  const offsetX = 70;

  return (
    <div className={['flex flex-col items-center', className].filter(Boolean).join(' ')}>
      <ResultCardMain {...main} hasSub={!!sub} />
      <div
        className={['w-full flex justify-center', subClassName].filter(Boolean).join(' ')}
        style={{ marginTop: `-${offsetY}px`, marginLeft: `${offsetX}px` }}
      >
        {sub ? (
          <ResultCardSub {...sub} />
        ) : (
          <ResultCardSub
            id="sub-placeholder"
            name=""
            frontSrc=""
            width={main.width ?? 210}
            className="invisible pointer-events-none"
            nameClassName="invisible"
          />
        )}
      </div>
    </div>
  );
}
