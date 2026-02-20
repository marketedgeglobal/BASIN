import { useFilters } from '../context/FilterContext';

export default function InterventionsList() {
  const { filteredInterventions } = useFilters();

  if (filteredInterventions.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-400 py-12">No interventions match your filters.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-gray-500">
        {filteredInterventions.length} intervention{filteredInterventions.length !== 1 ? 's' : ''}
      </p>
      {filteredInterventions.map((item, i) => (
        <article
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-2"
          aria-labelledby={`intervention-title-${i}`}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="rounded bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5">
              {item.valueChain}
            </span>
            <span className="text-xs text-gray-500">
              {item.province}, {item.country}
            </span>
          </div>
          <h3
            id={`intervention-title-${i}`}
            className="text-sm font-semibold text-gray-800"
          >
            {item.title}
          </h3>
          <p className="text-sm text-gray-600">{item.summary}</p>
        </article>
      ))}
    </div>
  );
}
