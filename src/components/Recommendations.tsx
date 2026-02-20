import type { Intervention, Recommendation, ScorecardWithTotal } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
  interventions: Intervention[];
  scorecards: ScorecardWithTotal[];
  country: string;
  valueChain: string;
  onCountryChange: (value: string) => void;
  onValueChainChange: (value: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Market Systems': 'bg-blue-100 text-blue-800',
  'Finance & Investment': 'bg-green-100 text-green-800',
  "Women's Economic Empowerment": 'bg-pink-100 text-pink-800',
  'Green Growth': 'bg-emerald-100 text-emerald-800',
  'Systemic Change': 'bg-purple-100 text-purple-800',
  'Disability Inclusion': 'bg-orange-100 text-orange-800',
};

type CategoryKey =
  | 'Market Systems'
  | 'Finance & Investment'
  | "Women's Economic Empowerment"
  | 'Green Growth'
  | 'Systemic Change'
  | 'Disability Inclusion';

const CATEGORY_SIGNAL: Record<CategoryKey, { criterion: keyof ScorecardWithTotal['criteria']; tags: string[] }> = {
  'Market Systems': {
    criterion: 'systemic',
    tags: ['market linkage', 'collective marketing', 'market access', 'traceability', 'branding'],
  },
  'Finance & Investment': {
    criterion: 'economic',
    tags: ['processing', 'value addition', 'export', 'carbon market', 'finance'],
  },
  "Women's Economic Empowerment": {
    criterion: 'wee',
    tags: ['women', 'women empowerment'],
  },
  'Green Growth': {
    criterion: 'greenGrowth',
    tags: ['climate-smart', 'irrigation', 'emission reduction', 'mangrove', 'biodiversity', 'sustainable production'],
  },
  'Systemic Change': {
    criterion: 'systemic',
    tags: ['certification', 'cooperative', 'digital', 'market linkage', 'policy'],
  },
  'Disability Inclusion': {
    criterion: 'pwd',
    tags: ['inclusion', 'accessibility', 'pwd'],
  },
};

export default function Recommendations({
  recommendations,
  interventions,
  scorecards,
  country,
  valueChain,
  onCountryChange,
  onValueChainChange,
}: RecommendationsProps) {
  const countries = [...new Set(scorecards.map((sc) => sc.country))];
  const valueChains = [...new Set(scorecards.map((sc) => sc.valueChain))];

  const scopedInterventions = interventions.filter((iv) => {
    if (country && iv.country !== country) return false;
    if (valueChain && iv.valueChain !== valueChain) return false;
    return true;
  });

  const scopedScorecards = scorecards.filter((sc) => {
    if (country && sc.country !== country) return false;
    if (valueChain && sc.valueChain !== valueChain) return false;
    return true;
  });

  const avgTotal = scopedScorecards.length > 0
    ? Math.round(scopedScorecards.reduce((sum, sc) => sum + sc.total, 0) / scopedScorecards.length)
    : 0;

  const criterionAverages: Record<keyof ScorecardWithTotal['criteria'], number> = {
    economic: 0,
    proPoor: 0,
    greenGrowth: 0,
    wee: 0,
    pwd: 0,
    systemic: 0,
    quickWin: 0,
  };

  (Object.keys(criterionAverages) as (keyof ScorecardWithTotal['criteria'])[]).forEach((key) => {
    criterionAverages[key] = scopedScorecards.length > 0
      ? Math.round(scopedScorecards.reduce((sum, sc) => sum + sc.criteria[key], 0) / scopedScorecards.length)
      : 0;
  });

  const tagCounts = new Map<string, number>();
  scopedInterventions.forEach((iv) => {
    iv.tags.forEach((tag) => tagCounts.set(tag.toLowerCase(), (tagCounts.get(tag.toLowerCase()) ?? 0) + 1));
  });

  const analyzed = recommendations
    .map((rec) => {
      const signal = CATEGORY_SIGNAL[rec.category as CategoryKey];
      if (!signal) return { rec, priority: 0, criterionGap: 0, tagHits: 0 };

      const criterionScore = criterionAverages[signal.criterion] ?? 0;
      const criterionGap = Math.max(0, 100 - criterionScore);

      const tagHits = signal.tags.reduce((sum, tag) => sum + (tagCounts.get(tag.toLowerCase()) ?? 0), 0);
      const priority = Math.round((criterionGap * 0.65) + Math.min(tagHits * 8, 35));

      return { rec, priority, criterionGap, tagHits };
    })
    .sort((a, b) => b.priority - a.priority);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Adjust Country</span>
          <button
            onClick={() => onCountryChange('')}
            className={`px-2.5 py-1 text-xs rounded-full border ${country === '' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            All
          </button>
          {countries.map((name) => (
            <button
              key={name}
              onClick={() => onCountryChange(name)}
              className={`px-2.5 py-1 text-xs rounded-full border ${country === name ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Adjust Value Chain</span>
          <button
            onClick={() => onValueChainChange('')}
            className={`px-2.5 py-1 text-xs rounded-full border ${valueChain === '' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            All
          </button>
          {valueChains.map((name) => (
            <button
              key={name}
              onClick={() => onValueChainChange(name)}
              className={`px-2.5 py-1 text-xs rounded-full border ${valueChain === name ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Context Scorecards</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{scopedScorecards.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Context Interventions</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{scopedInterventions.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Avg Total Score</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{avgTotal}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Recommendations are ranked by context priority using country/value-chain score gaps and intervention signals.
      </p>

      {analyzed.map(({ rec, priority, criterionGap, tagHits }) => (
        <article
          key={rec.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
        >
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                CATEGORY_COLORS[rec.category] ?? 'bg-gray-100 text-gray-700'
              }`}
            >
              {rec.category}
            </span>
            <h3 className="text-base font-semibold text-gray-900">{rec.title}</h3>
            <span className="ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
              Priority {priority}
            </span>
          </div>
          <div className="mb-3 text-xs text-gray-500">
            Context gap signal: {criterionGap} · Intervention tag signal: {tagHits}
          </div>
          <div className="space-y-2.5">
            {rec.narrative.map((paragraph, i) => (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
