export type TarotAnalysis = {
  topic: string;
  prompt: string;
  overview: Overview;
  cards: Cards[];
};

export type Cards = {
  interpretation: string;
  keyword: string[];
  naem: string;
  position: string;
  slot: string;
  subcards?: SubCards[];
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
