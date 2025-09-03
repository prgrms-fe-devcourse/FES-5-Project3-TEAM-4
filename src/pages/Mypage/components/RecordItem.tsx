import type { Tables } from '@/common/api/supabase/database.types';
import { useState } from 'react';
import NightStarPopup from '@/common/components/NightStarPopup';
import RecordDetail from './RecordDetail';

interface Props {
  tarotId: string;
  createdAt: string | null;
  recordData: Tables<'record'>[];
}

function RecordItem({ tarotId, createdAt, recordData }: Props) {
  const [popOpen, setPopOpen] = useState(false);

  const handlePopup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPopOpen((prev) => !prev);
  };
  return (
    <>
      <li
        key={tarotId}
        className="flex mb-3 rounded-3xl h-[32px] bg-white/5 shadow-[0_4px_50px_5px_rgba(0,0,0,0.20)] backdrop-blur-[30px]"
      >
        <a className="flex gap-6.5 items-center w-[100%] " href="#" onClick={handlePopup}>
          <span className="text-main-white text-xs ml-6">{createdAt?.slice(0, 10)}</span>
          <img src="/icons/timelineBtn.svg" alt="" />
          {recordData.length > 0 && (
            <span className="text-main-white text-xs">{recordData[0].contents}</span>
          )}
          {recordData.length <= 0 && <span className="text-gray-400 text-xs">기록해보세요</span>}
        </a>
      </li>
      {popOpen && (
        <NightStarPopup onClose={() => setPopOpen((prev) => !prev)}>
          <RecordDetail
            tarotId={tarotId}
            contents={recordData.length > 0 ? recordData[0].contents : ''}
            type="write"
          />
        </NightStarPopup>
      )}
    </>
  );
}
export default RecordItem;
