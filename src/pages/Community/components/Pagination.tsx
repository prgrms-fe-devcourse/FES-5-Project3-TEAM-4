import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';

type Props = {
  total: number; // 전체 아이템 수
  page: number; // 현재 페이지
  pageSize: number; // 페이지당 아이템 수
  onPageChange: (p: number) => void;
  maxButtons?: number; // 가운데 숫자 버튼 최대 개수 (기본 5)
  className?: string;
};

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  maxButtons = 5,
  className = '',
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const clamp = (n: number) => Math.min(totalPages, Math.max(1, n));

  // 가운데 페이지 버튼 범위 계산
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const btnBase =
    'inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition cursor-pointer';
  const iconBtn =
    'bg-white/10 text-white/80 hover:bg-white/15 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/50';
  const active = 'bg-pink-500 text-white shadow-[0_4px_24px_rgba(236,72,153,0.35)]';
  const normal = 'bg-white/15 text-white/90 hover:bg-white/25';

  return (
    <nav
      aria-label="페이지네이션"
      className={`flex justify-center items-center gap-3 min-h-8 ${className}`}
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        className={`${btnBase} ${iconBtn} disabled:opacity-40 disabled:cursor-not-allowed`}
        onClick={() => onPageChange(clamp(page - 1))}
      >
        <AiOutlineLeft />
      </button>

      {/* 첫 페이지로 점프 + 앞쪽 생략 표시 */}
      {start > 1 && (
        <>
          <button type="button" className={`${btnBase} ${normal}`} onClick={() => onPageChange(1)}>
            1
          </button>
          {start > 2 && <span className="px-1 text-white/60">…</span>}
        </>
      )}

      {/* 가운데 윈도우 */}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? 'page' : undefined}
          className={`${btnBase} ${p === page ? active : normal}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      {/* 뒤쪽 생략 표시 + 마지막 페이지로 점프 */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-white/60">…</span>}
          <button
            type="button"
            className={`${btnBase} ${normal}`}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        className={`${btnBase} ${iconBtn} disabled:opacity-40 disabled:cursor-not-allowed`}
        onClick={() => onPageChange(clamp(page + 1))}
      >
        <AiOutlineRight />
      </button>
    </nav>
  );
}
