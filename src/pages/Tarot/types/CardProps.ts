export type DragPayload = {
  clientX: number;
  clientY: number;
  translate: { x: number; y: number };
  cardRect: DOMRect;
};

export type TarotCardHandle = {
  flip: (faceUp?: boolean) => void;
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
  width?: number;
  faceUp?: boolean;
  reversed?: boolean;
  flipDir?: number;
  locked?: boolean;
  hoverBackScale?: number;
  onFlip?: (id: number | string, faceUp: boolean) => void;
  onClick?: (id: number | string) => void;
  onOpenModal?: (id: number | string) => void;
  onDragStart?: (id: number | string, payload?: DragPayload) => void;
  onDragEnd?: (id: number | string, payload: DragPayload) => void;
  className?: string;
};

export type TarotCardModel = {
  id: string;
  name: string;
  frontSrc: string;
  reversed: boolean;
};
