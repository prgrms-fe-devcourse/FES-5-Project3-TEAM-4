import { forwardRef } from 'react';
import clsx from 'clsx';

type Props = {
  label?: string;
  filled?: boolean;
  active?: boolean;
  width?: number | string;
  height?: number;
  className?: string;
};

const DrawMainSlot = forwardRef<HTMLDivElement, Props>(function DrawMainSlot(
  { label = 'Main', filled = false, active = false, width = 240, height = 420, className },
  ref
) {
  return (
    <div
      ref={ref}
      data-slot
      style={{ width, height }}
      className={clsx(
        'relative rounded-xl border-2 border-dashed transition-all pointer-events-none bg-white/5',
        filled ? 'border-main-white/80' : 'border-main-white/20',
        active &&
          !filled &&
          'ring-2 ring-[#EB3678]/40 ring-offset-2 ring-offset-[#0E0724] scale-[1.02]',
        className
      )}
    >
      <div
        className={clsx(
          'absolute inset-0 flex items-center justify-center text-sm tracking-wide select-none',
          filled ? 'text-main-white/80' : 'text-main-white/20'
        )}
      >
        {label}
      </div>
    </div>
  );
});

export default DrawMainSlot;
