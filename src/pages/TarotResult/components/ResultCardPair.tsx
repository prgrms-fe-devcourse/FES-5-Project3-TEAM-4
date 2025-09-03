import ResultCardMain from './ResultCardMain';
import ResultCardSub from './ResultCardSub';

type Props = {
  main: { id: string | number; name: string; frontSrc: string; width?: number; reversed?: boolean };
  sub?: { id: string | number; name: string; frontSrc: string; width?: number; reversed?: boolean };
  className?: string;
  subClassName?: string;
};

export default function ResultPair({ main, sub, className, subClassName }: Props) {
  const offsetY = 320;
  const offsetX = 70;

  return (
    <div className={['flex flex-col items-center', className].filter(Boolean).join(' ')}>
      <ResultCardMain {...main} />
      {sub ? (
        <div
          className={['w-full flex justify-center', subClassName].filter(Boolean).join(' ')}
          style={{
            marginTop: `-${offsetY}px`,
            marginLeft: `${offsetX}px`,
          }}
        >
          <ResultCardSub {...sub} />
        </div>
      ) : null}
    </div>
  );
}
