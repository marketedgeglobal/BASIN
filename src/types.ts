export interface ScoringWeights {
  economic: number;
  proPoor: number;
  greenGrowth: number;
  wee: number;
  pwd: number;
  systemic: number;
  quickWin: number;
}

export interface CriteriaScores {
  economic: number;
  proPoor: number;
  greenGrowth: number;
  wee: number;
  pwd: number;
  systemic: number;
  quickWin: number;
}

export interface Scorecard {
  id: string;
  country: string;
  province: string;
  valueChain: string;
  criteria: CriteriaScores;
}

export interface ScorecardWithTotal extends Scorecard {
  weighted: CriteriaScores;
  total: number;
  band: 'High' | 'Medium' | 'Lower';
}

export interface Intervention {
  id: string;
  country: string;
  province: string;
  valueChain: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  narrative: string[];
}

export interface CrossCuttingTheme {
  theme: string;
  description: string;
}

export interface QualitativeFinding {
  title: string;
  text: string;
}

export interface SharedChallenge {
  title: string;
  description: string;
  countries: string[];
  valueChains: string[];
}

export interface CrossCutting {
  sharedChallenge: SharedChallenge;
  designImplications: string[];
  crossCuttingThemes: CrossCuttingTheme[];
  qualitativeFindings: QualitativeFinding[];
}

export interface BasinData {
  scoringWeights: ScoringWeights;
  scorecards: Scorecard[];
  interventions: Intervention[];
  recommendations: Recommendation[];
  crossCutting: CrossCutting;
}

export type CriterionKey = keyof CriteriaScores;
export type SortField = 'total' | CriterionKey;

export const CRITERION_LABELS: Record<CriterionKey, string> = {
  economic: 'Economic',
  proPoor: 'Pro-poor',
  greenGrowth: 'Green Growth',
  wee: 'WEE',
  pwd: 'PWD',
  systemic: 'Systemic',
  quickWin: 'Quick Win',
};

export const CRITERION_KEYS: CriterionKey[] = [
  'economic',
  'proPoor',
  'greenGrowth',
  'wee',
  'pwd',
  'systemic',
  'quickWin',
];
