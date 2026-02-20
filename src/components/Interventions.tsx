import type { Intervention } from '../types';

interface InterventionsProps {
  interventions: Intervention[];
  country: string;
  onCountryChange: (value: string) => void;
  province: string;
  valueChain: string;
  onValueChainChange: (value: string) => void;
  search: string;
}

export default function Interventions({
  interventions,
  country,
  onCountryChange,
  province,
  valueChain,
  onValueChainChange,
  search,
}: InterventionsProps) {
  const filtered = interventions.filter((iv) => {
    if (country && iv.country !== country) return false;
    if (province && iv.province !== province) return false;
    if (valueChain && iv.valueChain !== valueChain) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        iv.title.toLowerCase().includes(q) ||
        iv.summary.toLowerCase().includes(q) ||
        iv.country.toLowerCase().includes(q) ||
        iv.province.toLowerCase().includes(q) ||
        iv.valueChain.toLowerCase().includes(q) ||
        iv.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const countryBase = interventions.filter((iv) => {
    if (province && iv.province !== province) return false;
    if (valueChain && iv.valueChain !== valueChain) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        iv.title.toLowerCase().includes(q) ||
        iv.summary.toLowerCase().includes(q) ||
        iv.country.toLowerCase().includes(q) ||
        iv.province.toLowerCase().includes(q) ||
        iv.valueChain.toLowerCase().includes(q) ||
        iv.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const valueChainBase = interventions.filter((iv) => {
    if (country && iv.country !== country) return false;
    if (province && iv.province !== province) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        iv.title.toLowerCase().includes(q) ||
        iv.summary.toLowerCase().includes(q) ||
        iv.country.toLowerCase().includes(q) ||
        iv.province.toLowerCase().includes(q) ||
        iv.valueChain.toLowerCase().includes(q) ||
        iv.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const countries = [...new Set(interventions.map((iv) => iv.country))];
  const valueChains = [...new Set(interventions.map((iv) => iv.valueChain))];

  const countryCounts = countries
    .map((name) => ({ name, count: countryBase.filter((iv) => iv.country === name).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const valueChainCounts = valueChains
    .map((name) => ({ name, count: valueChainBase.filter((iv) => iv.valueChain === name).length }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const tagCounts = new Map<string, number>();
  filtered.forEach((iv) => {
    iv.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });
  const topTag = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Adjust Country</span>
          <button
            onClick={() => onCountryChange('')}
            className={`px-2.5 py-1 text-xs rounded-full border ${country === '' ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            All
          </button>
          {countryCounts.map((item) => (
            <button
              key={item.name}
              onClick={() => onCountryChange(item.name)}
              className={`px-2.5 py-1 text-xs rounded-full border ${country === item.name ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {item.name} ({item.count})
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
          {valueChainCounts.map((item) => (
            <button
              key={item.name}
              onClick={() => onValueChainChange(item.name)}
              className={`px-2.5 py-1 text-xs rounded-full border ${valueChain === item.name ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              {item.name} ({item.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Filtered Interventions</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Countries Covered</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{new Set(filtered.map((iv) => iv.country)).size}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Top Theme Tag</p>
          <p className="text-sm font-semibold text-gray-800 mt-2">{topTag ? `#${topTag[0]} (${topTag[1]})` : 'No tag signal'}</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Showing <strong>{filtered.length}</strong> intervention concept{filtered.length !== 1 ? 's' : ''}.
      </p>
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          No interventions match your current filters.
        </div>
      ) : (
        filtered.map((iv) => (
          <article
            key={iv.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <h3 className="text-base font-semibold text-gray-900 mb-2">{iv.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Tag color="blue">{iv.country}</Tag>
              <Tag color="purple">{iv.province}</Tag>
              <Tag color="teal">{iv.valueChain}</Tag>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{iv.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {iv.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: 'blue' | 'purple' | 'teal' }) {
  const cls = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    teal: 'bg-teal-100 text-teal-800',
  }[color];
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cls}`}>
      {children}
    </span>
  );
}
