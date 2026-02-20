import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CRITERION_LABELS, CRITERION_KEYS, type ScorecardWithTotal } from '../types';
import { bandColor } from '../utils';

interface DashboardProps {
  filtered: ScorecardWithTotal[];
}

const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Dashboard({ filtered }: DashboardProps) {
  const count = filtered.length;
  const avgTotal = count > 0 ? Math.round(filtered.reduce((s, sc) => s + sc.total, 0) / count) : 0;
  const highCount = filtered.filter((sc) => sc.total >= 75).length;

  const best = filtered.length > 0
    ? [...filtered].sort((a, b) => b.total - a.total)[0]
    : null;

  const chartData = best
    ? CRITERION_KEYS.map((k, i) => ({
        name: CRITERION_LABELS[k],
        points: best.weighted[k],
        fill: BAR_COLORS[i % BAR_COLORS.length],
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Matches</p>
          <p className="text-3xl font-bold text-blue-700">{count}</p>
          <p className="text-xs text-gray-400 mt-1">value chain entries</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Avg Total Score</p>
          <p className="text-3xl font-bold text-blue-700">{avgTotal}</p>
          <p className="text-xs text-gray-400 mt-1">weighted average</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">High Scoring</p>
          <p className="text-3xl font-bold text-green-600">{highCount}</p>
          <p className="text-xs text-gray-400 mt-1">score ≥ 75</p>
        </div>
      </div>

      {/* Best Match Card */}
      {best ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Best Match
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <div>
              <p className="text-xl font-bold text-gray-900">{best.valueChain}</p>
              <p className="text-sm text-gray-500">{best.country} · {best.province}</p>
            </div>
            <div className="sm:ml-auto flex items-center gap-3">
              <span className="text-3xl font-extrabold text-blue-700">{best.total}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${bandColor(best.band)}`}
              >
                {best.band}
              </span>
            </div>
          </div>

          {/* Bar chart of weighted criterion points */}
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={55}
                />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 30]} />
                <Tooltip
                  formatter={(value: number) => [`${value} pts`, 'Weighted Points']}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Weighted criterion points for best match</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          No results match your current filters.
        </div>
      )}

      {/* Top 5 list */}
      {filtered.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Top Ranked Matches
          </h3>
          <ol className="space-y-2">
            {[...filtered]
              .sort((a, b) => b.total - a.total)
              .slice(0, 5)
              .map((sc, i) => (
                <li key={sc.id} className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-gray-700">
                    {sc.valueChain} — {sc.country} ({sc.province})
                  </span>
                  <span className="font-semibold text-gray-900 w-8 text-right">{sc.total}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bandColor(sc.band)}`}>
                    {sc.band}
                  </span>
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
}
