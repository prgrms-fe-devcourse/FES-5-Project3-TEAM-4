export type TarotAnalysis = {
  topic: string;
  prompt: string;
  overview: Overview;
  cards: Cards[];
};

export type Cards = {
  interpretation: string;
  keywordsInterpretation: string;
  emotional: string;
  keywords: string[];
  name: string;
  position: string;
  slot: string;
  subcards?: SubCards | null;
};

export type SubCards = {
  name: string;
  position: string;
  interpretation: string;
};

export type Overview = {
  summary: string;
  theme: string;
};
export type CardInfoProps = {
  cardName: string;
  direction: 'upright' | 'reversed';
  subCard?: string | null;
  subCardDirection?: 'upright' | 'reversed' | null;
};
