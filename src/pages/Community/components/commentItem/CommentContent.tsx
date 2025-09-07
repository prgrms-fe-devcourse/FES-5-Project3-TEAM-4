import { Button } from '@/common/components/Button';

type CommentContentProps = {
  isDeleted: boolean;
  editOpen: boolean;
  contents: string;
  editText: string;
  onChangeEditText: (v: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
};

export default function CommentContent({
  isDeleted,
  editOpen,
  contents,
  editText,
  onChangeEditText,
  onCancelEdit,
  onSaveEdit,
}: CommentContentProps) {
  if (!editOpen) {
    return (
      <div className="mt-3 whitespace-pre-wrap text-white/85">
        {isDeleted ? '삭제된 댓글입니다.' : contents}
      </div>
    );
  }
  return (
    <div className="mt-3 space-y-2">
      <textarea
        rows={3}
        value={editText}
        onChange={(e) => onChangeEditText(e.currentTarget.value)}
        className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
          취소
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onSaveEdit}>
          저장
        </Button>
      </div>
    </div>
  );
}
