import type { Intervention } from '../types';

interface InterventionsProps {
  interventions: Intervention[];
  country: string;
  province: string;
  valueChain: string;
  search: string;
}

export default function Interventions({ interventions, country, province, valueChain, search }: InterventionsProps) {
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

  return (
    <div className="space-y-4">
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
