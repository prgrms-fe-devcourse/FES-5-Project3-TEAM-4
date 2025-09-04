export const AMBIGUOUS_CARDS = [
  'The Moon',
  'The Lovers',
  'Justice',
  'Wheel of Fortune',
  'The World',
  'The High Priestess',
  'The Hanged Man',
  'Judgement',
  'Two of Swords',
  'Seven of Cups',
  'Two of Pentacles',
  'Seven of Wands',
  'Two of Wands',
  'Four of Cups',
  'Seven of Pentacles',
  'Five of Swords',
];

export const isAmbiguous = (name: string) => AMBIGUOUS_CARDS.includes(name);
