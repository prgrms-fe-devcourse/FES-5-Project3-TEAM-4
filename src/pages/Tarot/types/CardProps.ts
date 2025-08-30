export type TarotCardHandle = {
  flip: (to?: boolean) => void;
  lock: () => void;
  unlock: () => void;
  moveTo: (x: number, y: number, ms?: number) => void;
  reset: (ms?: number) => void;
  isFaceUp: () => boolean;
  rootEl: HTMLDivElement | null;
  cardEl: HTMLDivElement | null;
};

export type TarotCardProps = {
  id: number | string;
  name: string;
  frontSrc: string;
  width?: number | string;
  faceUp?: boolean;
  reversed?: boolean;
  flipDir?: 1 | -1;
  locked?: boolean;
  hoverBackScale?: number;
  onFlip?: (id: number | string, faceUp: boolean) => void;
  onClick?: (id: number | string) => void;
  onOpenModal?: (id: number | string) => void;
  onDragStart?: (id: number | string) => void;
  onDragEnd?: (
    id: number | string,
    payload: {
      clientX: number;
      clientY: number;
      translate: { x: number; y: number };
      cardRect: DOMRect;
    }
  ) => void;
  className?: string;
};
