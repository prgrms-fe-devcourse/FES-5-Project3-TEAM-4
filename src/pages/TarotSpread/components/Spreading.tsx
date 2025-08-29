import TarotCard from '@/pages/Tarot/components/TarotCard';
import { type TarotCardModel } from '../../Tarot/types/tarot';

type Props = {
  deck: TarotCardModel[];
  cardWidth: number;
  transforms: string[];
};

function Spread({ deck, cardWidth, transforms }: Props) {
  return (
    <>
      {deck.map((c, i) => (
        <div
          key={c.id}
          data-card
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            transform: transforms[i],
            zIndex: i + 1,
          }}
        >
          <div data-anim className="origin-bottom will-change-transform">
            <TarotCard
              id={c.id}
              name={c.name}
              frontSrc={c.frontSrc}
              width={cardWidth}
              clickMode="none"
              className="cursor-default"
            />
          </div>
        </div>
      ))}
    </>
  );
}
export default Spread;
