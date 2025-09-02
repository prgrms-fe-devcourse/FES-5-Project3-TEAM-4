interface Props {
  mode: 'init' | 'edit';
  onSave: () => void;
  onDelete: () => void;
  onPopClose: () => void;
}

function PopupBottonArea({ mode, onSave, onDelete, onPopClose }: Props) {
  const buttonClass =
    'text-main-white underline font-semibold hover:drop-shadow-[0_0_10px_rgba(255,255,200,0.8)] hover:scale-110 hover:no-underline';
  return (
    <div className="w-full mb-10 flex gap-31 justify-between pt-4">
      <div className="flex gap-5 ml-4">
        {mode === 'edit' && (
          <button type="button" className={buttonClass} onClick={onSave}>
            수정
          </button>
        )}
        {mode === 'init' && (
          <button type="button" className={buttonClass} onClick={onSave}>
            저장
          </button>
        )}
        {mode === 'edit' && (
          <button type="button" className={buttonClass} onClick={onDelete}>
            삭제
          </button>
        )}
      </div>
      <button
        type="button"
        className="mr-4 transition rounded-[50%] duration-300 hover:bg-[#C9AA78]"
        onClick={onPopClose}
      >
        <img src="/icons/cancel.svg" alt="취소 버튼 이미지" />
      </button>
    </div>
  );
}
export default PopupBottonArea;
