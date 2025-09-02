import tw from '@/common/utils/tw';
import NightStarBackGround from '@/pages/Home/components/NightStarBackGround';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBookSpread } from '../hooks/useBookSpread';
import TarotRecordDescription from './TarotRecordDescription';
import TarotCardDescription from './TarotCardDescription';
import type { Tables } from '@/common/api/supabase/database.types';
import { selectTarotTarotInfoListBytarotId } from '@/common/api/Tarot/tarot';
import {
  deleteRecord,
  insertRecord,
  selectRecordByTarotId,
  updateRecord,
} from '@/common/api/Record/record';
import { useAuth } from '@/common/store/authStore';
import { showAlert, showConfirmAlert } from '@/common/utils/sweetalert';
import PopupBottonArea from './PopupBottonArea';

//애니메이션을 보여줄 페이지 갯수
const ANIMATE_PAGE_LENGTH = 20;

interface Props {
  tarotId: string;
  contents?: string | null;
  onClose: () => void;
}

type TarotInfoListProps = Tables<'tarot'> & { tarot_info: Tables<'tarot_info'>[] };

function RecordPopup({ tarotId, contents, onClose }: Props) {
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const [tarotInfoList, setTarotInfoList] = useState<TarotInfoListProps[] | null>(null);
  const [recordText, setRecordText] = useState(contents ?? '');
  const [mode, setMode] = useState<'init' | 'edit'>('init');
  const userInfo = useAuth((state) => state.userInfo);

  //책 펼치는 애니메이션 커스텀 훅
  useBookSpread({
    pagesRef,
    coverRef,
    duration: 1,
    stagger: 0.04,
  });

  useEffect(() => {
    const selectTarotInfo = async () => {
      const tarotInfoList = await selectTarotTarotInfoListBytarotId(tarotId);
      setTarotInfoList(tarotInfoList);
    };
    selectTarotInfo();
    if (contents) setMode('edit');
  }, []);

  const handleSave = async () => {
    const recordData = await selectRecordByTarotId(tarotId);
    if (recordData && recordData.length > 0) {
      const recordId = recordData[0].id;
      if (!recordId) return;
      showConfirmAlert('기록을 수정하시겠습니까?', '', async () => {
        const res = await updateRecord(recordText, recordId);
        if (res.ok) showAlert('success', '수정되었습니다!', '');
        else showAlert('error', '수정 실패', '');
      });
    } else {
      showConfirmAlert('기록을 저장하시겠습니까?', '', async () => {
        const res = await insertRecord(tarotId, userInfo.userId, recordText);
        if (res.ok) {
          setMode('edit');
          showAlert('success', '저장되었습니다!', '');
        } else showAlert('error', '저장 실패', '');
      });
    }
  };

  const handleDelete = async () => {
    const recordData = await selectRecordByTarotId(tarotId);
    if (recordData && recordData.length > 0) {
      const recordId = recordData[0].id;
      showConfirmAlert('기록을 삭제하시겠습니까?', '', async () => {
        const res = await deleteRecord(recordId);
        if (res.ok) {
          showAlert('success', '삭제되었습니다!', '');
          setMode('init');
          handlePopClose();
        } else showAlert('error', '삭제 실패', '');
      });
    }
  };

  const handlePopClose = () => {
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" onClick={handlePopClose} />
      <div className="relative mx-auto mt-24 w-[min(70vw)] h-[min(80vh)] rounded-2xl bg-white">
        <section id="container" className="absolute z-1 w-full h-full flex flex-col items-center">
          <PopupBottonArea
            mode={mode}
            onDelete={() => handleDelete()}
            onPopClose={() => handlePopClose()}
            onSave={() => handleSave()}
          />
          <div className="w-[95%] h-[80%] flex relative">
            <div ref={pagesRef} className="w-full h-full relative">
              <div
                ref={coverRef}
                className={tw(
                  // 오른쪽 절반에만 위치
                  'absolute top-0 right-2 w-1/2 h-full rounded-xl',
                  // 표지 디자인
                  'bg-[url(/images/bookfirst_resized_635x604.png)] bg-cover bg-center',
                  'border-2 border-black/20 shadow-[0_10px_30px_rgba(0,0,0,0.25)] '
                )}
              />
              {Array.from({ length: ANIMATE_PAGE_LENGTH }).map((_, i) => {
                if (i >= ANIMATE_PAGE_LENGTH - 1) {
                  return (
                    <div
                      key={i}
                      className={
                        'absolute rounded-xl right-0 w-1/2 h-full border-1 border-main-black pt-4 pr-4 pb-4 bg-[#372B19]'
                      }
                    >
                      <div
                        className={
                          'w-full h-full rounded-xl bg-[url(/images/page_resized_635x604_border.png)] bg-cover bg-center '
                        }
                      >
                        {tarotInfoList && (
                          <TarotRecordDescription
                            result={tarotInfoList[0].result}
                            createdAt={tarotInfoList[0].created_at}
                            question={tarotInfoList[0].question}
                            onTextChange={(recordText: string) => setRecordText(recordText)}
                            contents={contents ?? ''}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={i}
                    className={tw(
                      'page absolute rounded-xl right-0 w-1/2 h-full border-1 border-main-black pt-4 pr-4 pb-4 bg-[#372B19]',
                      i !== 0 && i !== ANIMATE_PAGE_LENGTH - 2 && 'bg-linear-to-r',
                      'to-[#372B19]',
                      'from-1%',
                      'from-main-black'
                    )}
                  >
                    <div
                      className={
                        'w-full h-full rounded-xl bg-[url(/images/page_resized_635x604_border.png)] bg-cover bg-center '
                      }
                    >
                      {i == 0 && (
                        <div className="p-10 flex flex-col h-full gap-1 rotate-y-175 text-main-black">
                          {tarotInfoList &&
                            tarotInfoList[0].tarot_info.length > 0 &&
                            tarotInfoList[0].tarot_info.map((infoItem) => {
                              const subItems = tarotInfoList[0].tarot_info.filter(
                                (subItem) => subItem.parent_id
                              );
                              if (infoItem.parent_id) return;
                              return (
                                <TarotCardDescription
                                  key={infoItem.id}
                                  infoId={infoItem.id}
                                  name={infoItem.name}
                                  result={infoItem.result}
                                  subInfo={subItems}
                                />
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <NightStarBackGround className="bg-linear-160 from-[#180018] from-20% via-[#010001] to-[#180018] to-80% rounded-2xl" />
      </div>
    </div>,
    document.body // ← 여기로 렌더(원하면 특정 엘리먼트로 교체)
  );
}
export default RecordPopup;
