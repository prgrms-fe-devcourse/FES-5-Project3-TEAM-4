import { Button } from '@/common/components/Button';

type CommentReplyEditorProps = {
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function CommentReplyEditor({
  value,
  onChange,
  onCancel,
  onSubmit,
}: CommentReplyEditorProps) {
  return (
    <div className="mt-3 space-y-2">
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="답글을 입력해 주세요"
        className="w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40"
      />
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          취소
        </Button>
        <Button type="button" variant="primary" size="sm" onClick={onSubmit}>
          등록
        </Button>
      </div>
    </div>
  );
}
