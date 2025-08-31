import NightStarBackGround from '@/pages/Home/components/NightStarBackGround';
import RecordItem from './RecordItem';
import { useEffect, useState } from 'react';
import { useAuth } from '@/common/store/authStore';
import { selectTarotRecordListByUserId } from '@/common/api/Tarot/tarot';
import type { Tables } from '@/common/api/supabase/database.types';

type TarotListProps = Tables<'tarot'> & { record: Tables<'record'>[] };

function Record() {
  const userInfo = useAuth((state) => state.userInfo);
  const [tarotRecordList, setTarotRecordList] = useState<TarotListProps[] | null>(null);
  useEffect(() => {
    const getListData = async () => {
      const listData = await selectTarotRecordListByUserId(userInfo.userId);
      setTarotRecordList(listData);
    };
    getListData();
  }, []);
  return (
    <section className=" w-[750px] h-[85vh] flex flex-col gap-5 pt-10">
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Record</h1>
      <div className="w-[750px] h-[90%] relative">
        <div className="w-[100%] h-[95%] rounded-[20px] p-4 absolute z-30">
          <div className="top-0 flex flex-col h-[100%] items-center pt-4  absolute">
            <img src="/icons/boy2.svg" alt="달에서 낚시하는 소년 이미지" />
            <div className="w-px ml-[98px] flex-1 bg-white/25" />
            <img className="ml-[98px]" src="/icons/stargroup.svg" alt="" />
          </div>
          <div className="flex flex-col gap-18">
            <div className="ml-[152px]">
              <p className="text-main-white text-base font-semibold pt-8 ">
                간직하고 싶은 기억을 기록하고 언제든 다시 확인해보세요
              </p>
            </div>
            <ul className="pt-4 overflow-auto h-[40vh] scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
              {tarotRecordList &&
                tarotRecordList.length > 0 &&
                tarotRecordList.map((tarotRecordData) => (
                  <RecordItem
                    key={tarotRecordData.id}
                    tarotId={tarotRecordData.id}
                    createdAt={tarotRecordData.created_at}
                    recordData={tarotRecordData.record}
                  />
                ))}
            </ul>
          </div>
        </div>
        <NightStarBackGround className="bg-linear-160 from-[#180018] from-20% via-[#010001] to-[#180018] to-80% rounded-2xl" />
      </div>
    </section>
  );
}
export default Record;
