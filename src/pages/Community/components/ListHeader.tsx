interface Column {
  text: string;
  className?: string;
}

export function ListHeader({
  columns = [
    { text: '날짜', className: 'basis-[140px] shrink-0' },
    { text: '제목', className: 'flex-1 min-w-0 pl-4' },
    { text: '좋아요', className: 'basis-[80px] shrink-0 text-right' },
  ],
  className = '',
}: {
  columns?: Column[];
  className?: string;
}) {
  return (
    <div
      className={[
        'mt-6 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-sm text-white/70',
        className,
      ].join(' ')}
    >
      <div className="flex items-center">
        {columns.map((col, i) => (
          <span key={i} className={col.className}>
            {col.text}
          </span>
        ))}
      </div>
    </div>
  );
}
