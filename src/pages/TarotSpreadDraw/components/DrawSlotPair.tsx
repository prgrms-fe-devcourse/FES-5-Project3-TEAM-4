import type { ForwardedRef } from 'react';
import DrawMainSlot from './DrawMainSlot';
import DrawSubSlot from './DrawSubSlot';

type Props = {
  label: string;
  mainRef: ForwardedRef<HTMLDivElement>;
  subRef: ForwardedRef<HTMLDivElement>;
  mainFilled: boolean;
  subFilled: boolean;
  width?: number | string;
  mainHeight?: number;
  subHeight?: number;
  gap?: number;
  overlap?: number;
  subHidden?: boolean;
  subOffsetX?: number;
  subOffsetY?: number;
  subZ?: number;
};

export default function DrawSlotPair({
  label,
  mainRef,
  subRef,
  mainFilled,
  subFilled,
  width = 'clamp(200px, 22vw, 260px)',
  mainHeight = 420,
  subHeight = 420,
  overlap = 80,
  subHidden = true,
  subOffsetX = 150,
  subOffsetY = -310,
  subZ = 0,
}: Props) {
  return (
    <div className="relative flex flex-col items-center">
      <DrawMainSlot
        ref={mainRef}
        label={label}
        width={width}
        height={mainHeight}
        filled={mainFilled}
      />
      <div
        className={[
          'absolute left-1/2 -translate-x-1/2',
          subHidden ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible',
        ].join(' ')}
        style={{
          top: `calc(100% - ${overlap}px)`,
          transform: `translateX(-50%) translate(${subOffsetX}px, ${subOffsetY}px)`,
          zIndex: subZ,
        }}
      >
        <DrawSubSlot
          ref={subRef}
          label={`${label} · Sub`}
          width={width}
          height={subHeight}
          filled={subFilled}
        />
      </div>
    </div>
  );
}
