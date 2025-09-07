type TitleFieldProps = {
  value: string;
  onChange: (next: string) => void;
};

export default function TitleField({ value, onChange }: TitleFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs md:text-sm text-white/70">제목</label>
      <input
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        placeholder="제목을 입력해 주세요"
        className="w-full px-4 py-2 rounded-md bg-transparent text-white placeholder:text-white/50 border border-white/25 focus:border-white/60 outline-none"
      />
    </div>
  );
}
