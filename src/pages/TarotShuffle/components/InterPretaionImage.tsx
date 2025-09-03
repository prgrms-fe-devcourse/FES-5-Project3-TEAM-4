import { useFilterCardName } from '@/common/store/cardStore';

interface Props {
  cardName: string;
  subCardName?: string;
  time: 'Past' | 'The Present' | 'Future';
  position: string;
  subPosition?: string;
}

function InterPretaionImage({
  cardName = 'no image',
  subCardName,
  time,
  position,
  subPosition,
}: Props) {
  const mainCard = useFilterCardName(cardName ?? '');
  const subCard = useFilterCardName(subCardName ?? null);

  const imageAreaClass = subCardName ? 'flex gap-10' : 'flex justify-center';
  return (
    <div className="flex flex-col items-center w-[30%] gap-20">
      <p className="text-3xl">{time}</p>
      <div className={imageAreaClass}>
        <div className="flex flex-col gap-4 items-center w-[50%]">
          <p>{cardName}</p>
          <img
            className={`rounded-xl w-full ${position === 'reversed' ? 'rotate-180' : ''}`}
            src={mainCard[0].image_url}
            alt=""
          />
        </div>
        {subCard[0].name !== '이미지 없음' && (
          <div className="flex flex-col gap-4 items-center pt-20 w-[50%]">
            <img
              className={`rounded-xl w-full ${subPosition === 'reversed' ? 'rotate-180' : ''}`}
              src={subCard[0].image_url ?? '/images/Temperance.webp'}
              alt=""
            />
            <p>{subCard[0].name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export default InterPretaionImage;
