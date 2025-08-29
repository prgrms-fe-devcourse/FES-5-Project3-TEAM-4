export type TarotCardModel = {
  id: number;
  name: string;
  frontSrc: string;
};

export type TarotCardProps = {
  id: number;
  name: string;
  frontSrc: string;
  faceUp?: boolean;
  reversed?: boolean;
  width?: number | string;
  onFlip?: (id: number, faceUp: boolean) => void;
  onClick?: (id: number) => void;
  className?: string;
  clickMode?: 'flip' | 'none';
  flipDir?: 1 | -1;
};

export type TarotCardHandle = {
  flip: (to?: boolean) => void;
  rootEl: HTMLDivElement | null;
  cardEl: HTMLDivElement | null;
  isFaceUp: () => boolean;
};
