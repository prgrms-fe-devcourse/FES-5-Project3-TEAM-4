import DrawMoreMsg from './components/DrawMoreMsg';
import ResultPair from './components/ResultCardPair';
import TarotFront from '@/assets/Tarot/tarot_front.svg';

export default function TarotResult() {
  return (
    <div className="bg-gray-800 py-45 flex flex-col gap-10">
      <div>
        <DrawMoreMsg></DrawMoreMsg>
      </div>

      <div className="relative mx-auto max-w-[90vw]">
        <div className="flex flex-wrap items-start justify-center gap-5 md:gap-8">
          <ResultPair
            main={{ id: 'past', name: 'Past', frontSrc: TarotFront, width: 210 }}
            sub={{ id: 'clarify-past', name: 'Past – Clarifier', frontSrc: TarotFront, width: 210 }}
          />
          <ResultPair
            main={{ id: 'present', name: 'Present', frontSrc: TarotFront, width: 210 }}
            sub={{
              id: 'clarify-present',
              name: 'Present – Clarifier',
              frontSrc: TarotFront,
              width: 210,
            }}
          />
          <ResultPair
            main={{ id: 'future', name: 'Future', frontSrc: TarotFront, width: 210 }}
            sub={{
              id: 'clarify-future',
              name: 'Future – Clarifier',
              frontSrc: TarotFront,
              width: 210,
            }}
          />
        </div>
      </div>
    </div>
  );
}
