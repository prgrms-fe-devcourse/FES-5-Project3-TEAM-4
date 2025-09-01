import NightStarBackGround from '@/pages/Home/components/NightStarBackGround';
import RecordItem from './RecordItem';
import { useEffect, useState } from 'react';
import { useAuth } from '@/common/store/authStore';
import { selectTarotRecordListByUserId } from '@/common/api/Tarot/tarot';
import type { Tables } from '@/common/api/supabase/database.types';
import { Link } from 'react-router';

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
            <img src="/icons/boy2.svg" alt="달에서 낚시하는 소년 이미지" loading="lazy" />

            <div className="w-px ml-[98px] flex-1 bg-white/25" />
            <img
              className="ml-[98px]"
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
            {tarotRecordList && tarotRecordList.length > 0 && (
              <ul className="pt-4 overflow-auto h-[40vh] scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
                {tarotRecordList.map((tarotRecordData) => (
                  <RecordItem
                    key={tarotRecordData.id}
                    tarotId={tarotRecordData.id}
                    createdAt={tarotRecordData.created_at}
                    recordData={tarotRecordData.record}
                  />
                ))}
              </ul>
            )}
            {(!tarotRecordList || (tarotRecordList && tarotRecordList.length === 0)) && (
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
