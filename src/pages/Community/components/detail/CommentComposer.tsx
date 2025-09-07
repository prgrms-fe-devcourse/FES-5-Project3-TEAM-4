import { Button } from '@/common/components/Button';

type CommentComposerProps = {
  value: string;
  disabled: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
  counter?: string;
  placeholderAuthed: string;
  placeholderGuest: string;
};

export default function CommentComposer({
  value,
  disabled,
  onChange,
  onSubmit,
  counter,
  placeholderAuthed,
  placeholderGuest,
}: CommentComposerProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-4">
      <label htmlFor="comment" className="sr-only">
        댓글 입력
      </label>
      <div className="relative">
        <textarea
          id="comment"
          rows={3}
          maxLength={500}
          placeholder={disabled ? placeholderGuest : placeholderAuthed}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          disabled={disabled}
          className="scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/60 w-full resize-none rounded-xl bg-transparent border border-white/20 px-4 py-3 text-sm text-white/90 placeholder:text-white/50 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
        />
        <div className="absolute right-3 bottom-2 text-xs text-white/60">{counter}</div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button type="button" onClick={onSubmit} variant="primary" disabled={disabled}>
          {disabled ? '로그인 필요' : '등록'}
        </Button>
      </div>
    </div>
  );
}
