import NightStarBackGround from '@/pages/Home/components/NightStarBackGround';
import RecordItem from './RecordItem';

import type { Tables } from '@/common/api/supabase/database.types';
import { Link } from 'react-router';
import { useAuth } from '@/common/store/authStore';
import { useEffect, useState } from 'react';
import { selectTarotRecordListByUserId } from '@/common/api/Tarot/tarot';
import Loading from '@/common/components/Loading';

type TarotListProps = Tables<'tarot'> & { record: Tables<'record'>[] };

function Record() {
  const userInfo = useAuth((state) => state.userInfo);
  const [tarotRecordList, setTarotRecordList] = useState<TarotListProps[] | null>(null);
  const [hasList, setHasList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refetchFlag, setRefetchFlag] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const listData = await selectTarotRecordListByUserId(userInfo.userId);
      if (!listData || listData.length === 0) return;
      setHasList(true);
      setTarotRecordList(listData);
    };
    fetchData();
    setIsLoading(false);
  }, [refetchFlag]);

  const onUpdate = () => {
    setRefetchFlag((prev) => !prev);
  };

  return (
    <section className="w-full lg:w-[750px] h-[90vh] lg:h-[85vh] flex flex-col gap-5 xl:pt-10 md:pt-5 md:mb-10">
      <h1 className="text-main-white xl:pt-14 md:pt-4 text-2xl font-semibold">Record</h1>
      <div className="w-full h-[90%] relative">
        <div className="w-full h-[95%] rounded-[20px] p-4 absolute z-30">
          <div className="top-0 flex flex-col h-[100%] items-center pt-4  absolute">
            <img src="/icons/boy2.svg" alt="달에서 낚시하는 소년 이미지" loading="lazy" />
            <div className="w-px ml-[98px] flex-1 bg-white/25" />
            <img
              className="ml-[90px]"
              src="/icons/stargroup.svg"
              alt="별무리 이미지"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-18">
            <div className="ml-[152px]">
              <p className="text-main-white text-base font-semibold pt-8 ">
                간직하고 싶은 기억을 기록하고 언제든 다시 확인해보세요
              </p>
            </div>

            {isLoading ? (
              <Loading mode="contents" />
            ) : hasList ? (
              <ul className="pt-4 overflow-auto h-[40vh] scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
                {tarotRecordList!.map((tarotRecordData) => (
                  <RecordItem
                    key={tarotRecordData.id}
                    tarotId={tarotRecordData.id}
                    createdAt={tarotRecordData.created_at}
                    recordData={tarotRecordData.record}
                    onUpdate={() => onUpdate()}
                  />
                ))}
              </ul>
            ) : (
              <div className="text-main-white h-[40vh] flex flex-col items-center justify-center gap-4 font-semibold rounded-2xl bg-white/5 shadow-[0_4px_50px_5px_rgba(0,0,0,0.20)] backdrop-blur-[30px]">
                <img
                  className="w-[48px]"
                  src="/icons/stargroup.svg"
                  alt="별무리 이미지"
                  loading="lazy"
                />
                <p>기록할 수 있는 기억이 아직 없어요</p>
                <Link
                  className="border border-white rounded-2xl p-1 hover:bg-main-white hover:text-main-black"
                  to={'/taro'}
                >
                  타로 보기
                </Link>
              </div>
            )}
          </div>
        </div>
        <NightStarBackGround className="bg-linear-160 from-[#180018] from-20% via-[#010001] to-[#180018] to-80% rounded-2xl" />
      </div>
    </section>
  );
}
export default Record;
