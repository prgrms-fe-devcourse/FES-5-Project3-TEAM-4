import { FiSearch } from 'react-icons/fi';
import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onSearch?: () => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  const hoverBorderActiveGlow =
    'ring-1 ring-white/10 hover:ring-white/40 active:shadow-[0_0_20px_rgba(255,255,255,0.35)]';

  return (
    <label
      htmlFor={props.id ?? 'q'}
      className={`relative flex items-center rounded-full bg-white/10 backdrop-blur-md
                  ${hoverBorderActiveGlow} transition cursor-pointer`}
    >
      <input
        id={props.id ?? 'q'}
        type="text"
        className="w-full bg-transparent pl-4 pr-12 py-3 text-sm placeholder:text-white/60 outline-none cursor-pointer"
        {...props}
      />
      <button
        type="button"
        aria-label="검색"
        onClick={onSearch}
        className="absolute right-2 inline-flex h-8 w-8 items-center justify-center rounded-full
                   hover:bg-white/10 focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-white/60 cursor-pointer"
      >
        <FiSearch size={18} />
      </button>
    </label>
  );
}
