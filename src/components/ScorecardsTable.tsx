import { useFilters } from '../context/FilterContext';
import basinData from '../data/basin.json';

const SORT_OPTIONS = [
  { value: 'total', label: 'Total Score' },
  { value: 'economic', label: 'Economic' },
  { value: 'proPoor', label: 'Pro-Poor' },
  { value: 'greenGrowth', label: 'Green Growth' },
  { value: 'systemic', label: 'Systemic' },
  { value: 'pwd', label: 'PWD' },
  { value: 'wee', label: 'WEE' },
  { value: 'quickWin', label: 'Quick Win' },
];

const BAND_COLORS: Record<string, string> = {
  High: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Lower: 'bg-red-100 text-red-800',
};

export default function ScorecardsTable() {
  const { filteredRows, filters, setFilters } = useFilters();

  const weightMap: Record<string, string> = {};
  basinData.meta.weightsPct.forEach((w) => {
    weightMap[w.key] = w.label;
  });

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={filters.sortKey}
          onChange={(e) => setFilters((f) => ({ ...f, sortKey: e.target.value }))}
          className="rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          aria-label="Sort scorecards by"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-400 ml-auto">
          {filteredRows.length} result{filteredRows.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm" aria-label="Value chain scorecards">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left sticky left-0 bg-gray-50">Value Chain</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Province</th>
              <th className="px-4 py-3 text-right">Economic</th>
              <th className="px-4 py-3 text-right">Pro-Poor</th>
              <th className="px-4 py-3 text-right">Green Growth</th>
              <th className="px-4 py-3 text-right">Systemic</th>
              <th className="px-4 py-3 text-right">PWD</th>
              <th className="px-4 py-3 text-right">WEE</th>
              <th className="px-4 py-3 text-right">Quick Win</th>
              <th className="px-4 py-3 text-right font-bold">Total</th>
              <th className="px-4 py-3 text-left">Band</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredRows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800 sticky left-0 bg-white">
                  {row.valueChain}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.country}</td>
                <td className="px-4 py-3 text-gray-600">{row.province}</td>
                <td className="px-4 py-3 text-right">{row.weighted.economic}</td>
                <td className="px-4 py-3 text-right">{row.weighted.proPoor}</td>
                <td className="px-4 py-3 text-right">{row.weighted.greenGrowth}</td>
                <td className="px-4 py-3 text-right">{row.weighted.systemic}</td>
                <td className="px-4 py-3 text-right">{row.weighted.pwd}</td>
                <td className="px-4 py-3 text-right">{row.weighted.wee}</td>
                <td className="px-4 py-3 text-right">{row.weighted.quickWin}</td>
                <td className="px-4 py-3 text-right font-bold text-blue-700">{row.total}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_COLORS[row.band]}`}
                  >
                    {row.band}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRows.length === 0 && (
          <p className="text-center text-gray-400 py-12">No scorecards match your filters.</p>
        )}
      </div>
    </div>
  );
}
