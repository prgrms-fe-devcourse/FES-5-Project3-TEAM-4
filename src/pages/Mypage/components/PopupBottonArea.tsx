interface Props {
  mode: 'init' | 'edit';
  onSave: () => void;
  onDelete: () => void;
}

function PopupBottonArea({ mode, onSave, onDelete }: Props) {
  const buttonClass =
    'text-main-white underline font-semibold hover:drop-shadow-[0_0_10px_rgba(255,255,200,0.8)] hover:scale-110 hover:no-underline';
  return (
    <div className="mb-10 flex gap-31 justify-between pt-4">
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
    </div>
  );
}
export default PopupBottonArea;
