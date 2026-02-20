export interface Location {
  country: string;
  province: string;
}

export interface WeightPct {
  key: string;
  label: string;
  weightPct: number;
}

export interface MaxPoint {
  key: string;
  label: string;
  max: number;
}

export interface Meta {
  title: string;
  locations: Location[];
  weightsPct: WeightPct[];
  maxPoints: MaxPoint[];
}

export interface WeightedScores {
  economic: number;
  proPoor: number;
  greenGrowth: number;
  systemic: number;
  pwd: number;
  wee: number;
  quickWin: number;
}

export interface ValueChainRow {
  valueChain: string;
  weighted: WeightedScores;
  total: number;
}

export interface Scorecard {
  country: string;
  province: string;
  valueChains: ValueChainRow[];
}

export interface Intervention {
  country: string;
  province: string;
  valueChain: string;
  title: string;
  summary: string;
}

export interface OperationalRecommendation {
  title: string;
  detail: string;
}

export interface CrossCutting {
  focus: string;
  sampleChallenges: { title: string; gist: string }[];
  designImplications: string[];
}

export interface BasinData {
  meta: Meta;
  scorecards: Scorecard[];
  interventions: Intervention[];
  operationalRecommendations: OperationalRecommendation[];
  crossCutting: CrossCutting;
}

export interface FlatRow {
  country: string;
  province: string;
  valueChain: string;
  weighted: WeightedScores;
  total: number;
  band: 'High' | 'Medium' | 'Lower';
}

export interface Filters {
  country: string;
  province: string;
  valueChain: string;
  query: string;
  sortKey: string;
}
