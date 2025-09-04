export const TOPIC_LABEL = {
  LOVE: '연애 | 관계',
  MONEY: '금전 | 재물',
  CAREER: '직업 | 진로',
  HEALTH: '건강 | 힐링',
  GROWTH: '자기계발 | 성장',
} as const;

export type TopicLabel = (typeof TOPIC_LABEL)[keyof typeof TOPIC_LABEL];
export type TopicKey = keyof typeof TOPIC_LABEL;

export const TOPIC_LABEL_LIST = Object.values(TOPIC_LABEL) as TopicLabel[];

export const LABEL_TO_KEY: Record<TopicLabel, TopicKey> = Object.entries(TOPIC_LABEL).reduce(
  (acc, [k, v]) => {
    acc[v as TopicLabel] = k as TopicKey;
    return acc;
  },
  {} as Record<TopicLabel, TopicKey>
);
