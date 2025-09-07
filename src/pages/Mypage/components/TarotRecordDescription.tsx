import { debounce } from '@/common/utils/debounce';
import tw from '@/common/utils/tw';
import { useRef } from 'react';
import { Link } from 'react-router';

interface Props {
  result: string | null;
  question: string | null;
  createdAt: string | null;
  onTextChange: (recordText: string) => void;
  contents?: string;
  type: 'write' | 'read' | 'result';
}

function TarotRecordDescription({
  result,
  question,
  createdAt,
  onTextChange,
  contents,
  type,
}: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputText = debounce(() => {
    const textElement = textAreaRef.current as HTMLTextAreaElement;
    onTextChange(textElement?.value);
  });

  const scroll = 'scrollbar scrollbar-thin scrollbar-thumb-black/60 scrollbar-track-transparent';
  return (
    <div
      className={tw(
        'p-14 flex flex-col h-full  text-main-black',
        type === 'read' ? 'gap-7' : 'gap-1'
      )}
    >
      <div className="text-xs">{createdAt?.slice(0, 10)}</div>
      <div className="min-h-[20%]">
        <p className="text-xl font-semibold">나의 질문</p>
        <p className={`text-sm max-h-[66px] overflow-y-auto break-all ${scroll}`}>{question}</p>
      </div>
      <div className="min-h-[20%]">
        <p className="text-xl font-semibold">해석</p>
        <p className={`text-sm max-h-[66px] overflow-y-auto break-all ${scroll}`}>{result}</p>
      </div>
      {type === 'write' && (
        <div className="min-h-[30%] flex-1">
          <p className="text-xl font-semibold">기록하기</p>
          <textarea
            name="recordInput"
            id="recordInput"
            className={`w-full h-[80%] resize-none overflow-y-auto border-2 border-[#454545] rounded-md text-sm focus:outline-none ${scroll}`}
            ref={textAreaRef}
            onInput={handleInputText}
            defaultValue={contents ?? ''}
          ></textarea>
        </div>
      )}
      {(type === 'read' || type === 'result') && (
        <div className="h-[50%] flex gap-5 justify-center items-center border-2 rounded-2xl">
          <img className="w-[50%]" src="/images/threeCard.webp" alt="세 장의 카드 뒷면 이미지" />
          <Link
            to={'/tarot'}
            className="font-semibold border border-gray-400 rounded-2xl p-2 text-main-black hover:scale-110"
          >
            타로 카드 뽑기
          </Link>
        </div>
      )}
    </div>
  );
}
export default TarotRecordDescription;
