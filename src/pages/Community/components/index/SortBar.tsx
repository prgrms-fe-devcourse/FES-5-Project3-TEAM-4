import { memo } from 'react';

export type SortKey = 'new' | 'old' | 'like-desc' | 'like-asc';

interface Option {
  key: SortKey;
  label: string;
}

interface SortBarProps {
  value: SortKey;
  onChange: (next: SortKey) => void;
  options?: Option[];
  className?: string;
}

const DEFAULT_OPTIONS: Option[] = [
  { key: 'new', label: '최신순' },
  { key: 'old', label: '오래된순' },
  { key: 'like-desc', label: '좋아요↑' },
  { key: 'like-asc', label: '좋아요↓' },
];

export const SortBar = memo(function SortBar({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
  className = '',
}: SortBarProps) {
  return (
    <div
      className={`flex justify-end gap-3 mt-[var(--spacing-8,1rem)] text-sm text-white/70 ${className}`}
    >
      {options.map((opt, i) => (
        <span key={opt.key} className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={value === opt.key}
            onClick={() => onChange(opt.key)}
            className={[
              'px-2 py-1 rounded-md focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/50 cursor-pointer transition',
              value === opt.key ? 'text-white' : 'hover:text-white',
            ].join(' ')}
          >
            {opt.label}
          </button>
          {i !== options.length - 1 && <span aria-hidden className="h-3 w-px bg-white/20" />}
        </span>
      ))}
    </div>
  );
});
