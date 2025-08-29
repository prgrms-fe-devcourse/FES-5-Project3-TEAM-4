import NightStarBackGround from '@/pages/Home/components/NightStarBackGround';
import RecordItem from './RecordItem';
import { useEffect, useState } from 'react';
import { useAuth } from '@/common/store/authStore';
import { selectTarotRecordListByUserId } from '@/common/api/Tarot/tarot';

function Record() {
  const userInfo = useAuth((state) => state.userInfo);
  const [tarotRecordList, setTarotRecordList] = useState(null);
  useEffect(() => {
    const getListData = async () => {
      const listData = await selectTarotRecordListByUserId(userInfo.userId);
      console.log(listData);
    };
    getListData();
  }, []);
  return (
    <section className=" w-[750px] h-[85vh] flex flex-col gap-5 pt-10">
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Record</h1>
      <div className="w-[750px] h-[800px] relative">
        <div className="w-[100%] h-[800px]  rounded-[20px] p-4 absolute z-30">
          <img src="/icons/boy3.svg" className="absolute" alt="달에서 낚시하는 소년 이미지" />
          <div className="flex flex-col gap-20">
            <div className="ml-[152px]">
              <p className="text-main-white text-base font-semibold pt-8">
                간직하고 싶은 기억을 기록하고 언제든 다시 확인해보세요
              </p>
            </div>
            <ul className="pt-4 overflow-auto max-h-[450px] scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
              <RecordItem />
            </ul>
          </div>
        </div>
        <NightStarBackGround className="bg-linear-160 from-[#180018] from-20% via-[#010001] to-[#180018] to-80% rounded-2xl" />
      </div>
    </section>
  );
}
export default Record;
