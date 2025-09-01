import { debounce } from '@/common/utils/debounce';
import { useRef } from 'react';

interface Props {
  result: string | null;
  question: string | null;
  createdAt: string | null;
  onTextChange: (recordText: string) => void;
  contents?: string;
}

function TarotRecordDescription({ result, question, createdAt, onTextChange, contents }: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputText = debounce(() => {
    const textElement = textAreaRef.current as HTMLTextAreaElement;
    onTextChange(textElement?.value);
  });

  return (
    <div className="p-14 flex flex-col h-full gap-1 text-main-black">
      <div>{createdAt?.slice(0, 10)}</div>
      <div className="min-h-[20%]">
        <p className="text-xl font-semibold">해석</p>
        <p className="text-sm max-h-[66px] overflow-y-auto break-all">{result}</p>
      </div>
      <div className="min-h-[20%]">
        <p className="text-xl font-semibold">나의 질문</p>
        <p className="text-sm max-h-[66px] overflow-y-auto break-all">{question}</p>
      </div>
      <div className="min-h-[30%] flex-1">
        <p className="text-xl font-semibold">기록하기</p>
        <textarea
          name="recordInput"
          id="recordInput"
          className="w-full h-[80%]  resize-none overflow-y-auto border-2 border-[#454545] rounded-md text-sm focus:outline-none"
          ref={textAreaRef}
          onInput={handleInputText}
          defaultValue={contents ?? ''}
        ></textarea>
      </div>
    </div>
  );
}
export default TarotRecordDescription;
