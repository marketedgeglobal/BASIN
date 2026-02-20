import type {
  BasinData,
  Scorecard,
  ScorecardWithTotal,
  ScoringWeights,
} from './types';

export function computeTotal(scorecard: Scorecard, weights: ScoringWeights): ScorecardWithTotal {
  const { criteria } = scorecard;
  const weighted = {
    economic: Math.round(criteria.economic * weights.economic),
    proPoor: Math.round(criteria.proPoor * weights.proPoor),
    greenGrowth: Math.round(criteria.greenGrowth * weights.greenGrowth),
    wee: Math.round(criteria.wee * weights.wee),
    pwd: Math.round(criteria.pwd * weights.pwd),
    systemic: Math.round(criteria.systemic * weights.systemic),
    quickWin: Math.round(criteria.quickWin * weights.quickWin),
  };

  const total = Math.round(
    Object.values(weighted).reduce((sum, v) => sum + v, 0)
  );

  const band: ScorecardWithTotal['band'] =
    total >= 75 ? 'High' : total >= 50 ? 'Medium' : 'Lower';

  return { ...scorecard, weighted, total, band };
}

export function enrichData(data: BasinData): ScorecardWithTotal[] {
  return data.scorecards.map((sc) => computeTotal(sc, data.scoringWeights));
}

export function filterScorecards(
  scorecards: ScorecardWithTotal[],
  country: string,
  province: string,
  valueChain: string,
  search: string
): ScorecardWithTotal[] {
  return scorecards.filter((sc) => {
    if (country && sc.country !== country) return false;
    if (province && sc.province !== province) return false;
    if (valueChain && sc.valueChain !== valueChain) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        sc.country.toLowerCase().includes(q) ||
        sc.province.toLowerCase().includes(q) ||
        sc.valueChain.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

export function bandColor(band: ScorecardWithTotal['band']): string {
  switch (band) {
    case 'High':
      return 'bg-green-100 text-green-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Lower':
      return 'bg-red-100 text-red-800';
  }
}
