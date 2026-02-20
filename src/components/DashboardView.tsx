import { useFilters } from '../context/FilterContext';
import ScoreBreakdownChart from './ScoreBreakdownChart';

const BAND_COLORS: Record<string, string> = {
  High: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Lower: 'bg-red-100 text-red-800',
};

export default function DashboardView() {
  const { filteredRows, bestMatch, kpis } = useFilters();

  return (
    <div className="p-4 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Value Chains</p>
          <p className="mt-1 text-3xl font-bold text-gray-800">{kpis.totalRows}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Score</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{kpis.avgScore}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">High-Scoring</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{kpis.highCount}</p>
        </div>
      </div>

      {/* Best Match */}
      {bestMatch && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-blue-700 mb-1">Best Match</h2>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-bold text-gray-800">{bestMatch.valueChain}</span>
            <span className="text-sm text-gray-500">
              {bestMatch.province}, {bestMatch.country}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${BAND_COLORS[bestMatch.band]}`}
            >
              {bestMatch.band}
            </span>
            <span className="ml-auto text-2xl font-bold text-blue-700">{bestMatch.total}/100</span>
          </div>
          <div className="mt-4">
            <ScoreBreakdownChart row={bestMatch} />
          </div>
        </div>
      )}

      {/* Score summary table */}
      {filteredRows.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Value Chain</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-left">Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRows.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{row.valueChain}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {row.province}, {row.country}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">{row.total}</td>
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
        </div>
      )}

      {filteredRows.length === 0 && (
        <p className="text-center text-gray-400 py-12">No results match your filters.</p>
      )}
    </div>
  );
}
