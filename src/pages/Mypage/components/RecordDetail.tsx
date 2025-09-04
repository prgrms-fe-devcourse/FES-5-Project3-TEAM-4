import tw from '@/common/utils/tw';
import { useEffect, useRef, useState } from 'react';
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
import ResultButtonArea from './ResultButtonArea';

import { captureResult } from '@/common/utils/captureResult';

//애니메이션을 보여줄 페이지 갯수
const ANIMATE_PAGE_LENGTH = 20;

interface Props {
  tarotId: string;
  contents?: string | null;
  type: 'write' | 'read' | 'result';
  onClose?: () => void;
}

type TarotInfoListProps = Tables<'tarot'> & { tarot_info: Tables<'tarot_info'>[] };

function RecordDetail({ tarotId, contents, type, onClose }: Props) {
  const pagesRef = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const [tarotInfoList, setTarotInfoList] = useState<TarotInfoListProps[] | null>(null);
  const [recordText, setRecordText] = useState(contents ?? '');
  const [mode, setMode] = useState<'init' | 'edit'>('init');
  const userId = useAuth((state) => state.userId);

  const rootRef = useRef<HTMLDivElement>(null); // ← 캡처할 “자식”에 부착

  //책 펼치는 애니메이션 커스텀 훅
  useBookSpread({
    pagesRef,
    coverRef,
    duration: 1,
    stagger: 0.04,
    onCompleteCallback: () => captureResult(rootRef, tarotId, userId),
    type,
  });

  useEffect(() => {
    const selectTarotInfo = async () => {
      const tarotInfoList = await selectTarotTarotInfoListBytarotId(tarotId);
      setTarotInfoList(tarotInfoList);
    };
    selectTarotInfo();
    if (recordText !== '') setMode('edit');
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
        const res = await insertRecord(tarotId, userId!, recordText);
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
          showAlert('success', '삭제되었습니다!', '', () => {
            setMode('init');
            if (onClose) onClose();
          });
        } else showAlert('error', '삭제 실패', '');
      });
    }
  };

  return (
    <section
      ref={rootRef}
      id="container"
      className="absolute z-1 w-full h-full flex flex-col items-center"
    >
      {type === 'write' && (
        <PopupBottonArea mode={mode} onDelete={() => handleDelete()} onSave={() => handleSave()} />
      )}
      {type === 'result' && <ResultButtonArea tarotId={tarotId} />}
      <div className="w-[95%] h-[80%] flex relative">
        <div ref={pagesRef} className="w-full h-full relative">
          <div
            ref={coverRef}
            className={tw(
              // 오른쪽 절반에만 위치
              'absolute top-0 right-2 w-1/2 h-full rounded-xl',
              // 표지 디자인
              'bg-[url(/images/bookfirst_1.webp)] bg-cover bg-center',
              'border-2 border-black/20 shadow-[0_10px_30px_rgba(0,0,0,0.25)] '
            )}
          />
          {Array.from({ length: ANIMATE_PAGE_LENGTH }).map((_, i) => {
            if (i >= ANIMATE_PAGE_LENGTH - 1) {
              return (
                <div
                  key={i}
                  className={
                    'absolute rounded-xl right-0 w-1/2 h-full border-1 border-main-black pt-4 pr-4 pb-4 bg-[#272524]'
                  }
                >
                  <div
                    className={
                      'w-full h-full rounded-xl bg-[url(/images/book_inner.webp)] bg-cover bg-center '
                    }
                  >
                    {tarotInfoList && (
                      <TarotRecordDescription
                        result={tarotInfoList[0].result}
                        createdAt={tarotInfoList[0].created_at}
                        question={tarotInfoList[0].question}
                        onTextChange={(recordText: string) => setRecordText(recordText)}
                        contents={recordText ?? ''}
                        type={type}
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
                  `page absolute rounded-xl right-0 w-1/2 h-full border-1 border-main-black pt-4 pr-4 pb-4 bg-[#272524]  ${i !== 0 ? 'no-capture' : ''}`
                )}
              >
                <div
                  className={
                    'w-full h-full rounded-xl bg-[url(/images/book_inner.webp)] bg-cover bg-center '
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
  );
}
export default RecordDetail;
