import type { Recommendation } from '../types';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Market Systems': 'bg-blue-100 text-blue-800',
  'Finance & Investment': 'bg-green-100 text-green-800',
  "Women's Economic Empowerment": 'bg-pink-100 text-pink-800',
  'Green Growth': 'bg-emerald-100 text-emerald-800',
  'Systemic Change': 'bg-purple-100 text-purple-800',
  'Disability Inclusion': 'bg-orange-100 text-orange-800',
};

export default function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Operational recommendations across all value chains and geographies.
      </p>
      {recommendations.map((rec) => (
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
          </div>
          <ul className="space-y-2">
            {rec.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
