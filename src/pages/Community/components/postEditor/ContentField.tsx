type ContentFieldProps = {
  value: string;
  onChange: (next: string) => void;
};

export default function ContentField({ value, onChange }: ContentFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs md:text-sm text-white/70">글</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="내용을 입력해 주세요"
        className="w-full h-[320px] resize-none px-4 py-3 rounded-md bg-transparent text-white placeholder:text-white/50 border border-white/25 focus:border-white/60 outline-none"
      />
    </div>
  );
}
