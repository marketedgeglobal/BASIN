import { useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  PieChart,
  Pie,
} from 'recharts';
import { CRITERION_LABELS, CRITERION_KEYS, type ScorecardWithTotal } from '../types';
import { bandColor } from '../utils';

interface DashboardProps {
  filtered: ScorecardWithTotal[];
}

const BAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];
const BAND_COLORS: Record<string, string> = {
  High: '#16a34a',
  Medium: '#f59e0b',
  Lower: '#ef4444',
};

function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeCsv(value: string | number) {
  const stringValue = String(value ?? '');
  const escaped = stringValue.replace(/"/g, '""');
  return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export default function Dashboard({ filtered }: DashboardProps) {
  const bestChartRef = useRef<HTMLDivElement | null>(null);
  const radarChartRef = useRef<HTMLDivElement | null>(null);
  const bandChartRef = useRef<HTMLDivElement | null>(null);
  const countryChartRef = useRef<HTMLDivElement | null>(null);

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

  const radarData = CRITERION_KEYS.map((k) => {
    const avg = count > 0
      ? Math.round(filtered.reduce((sum, sc) => sum + sc.criteria[k], 0) / count)
      : 0;

    return {
      criterion: CRITERION_LABELS[k],
      average: avg,
      best: best ? best.criteria[k] : 0,
    };
  });

  const avgProfileTotal = radarData.reduce((sum, item) => sum + item.average, 0);
  const bestProfileTotal = radarData.reduce((sum, item) => sum + item.best, 0);
  const profileGap = bestProfileTotal - avgProfileTotal;

  const bandData = ['High', 'Medium', 'Lower']
    .map((band) => ({
      name: band,
      value: filtered.filter((sc) => sc.band === band).length,
      fill: BAND_COLORS[band],
    }))
    .filter((item) => item.value > 0);

  const countryMap = new Map<string, { sum: number; count: number }>();
  filtered.forEach((sc) => {
    const current = countryMap.get(sc.country) ?? { sum: 0, count: 0 };
    countryMap.set(sc.country, { sum: current.sum + sc.total, count: current.count + 1 });
  });

  const countryData = [...countryMap.entries()]
    .map(([country, value]) => ({
      country,
      avgTotal: Math.round(value.sum / value.count),
      entries: value.count,
    }))
    .sort((a, b) => b.avgTotal - a.avgTotal);

  const strongestCriterion = [...radarData].sort((a, b) => b.average - a.average)[0];
  const weakestCriterion = [...radarData].sort((a, b) => a.average - b.average)[0];

  function exportFilteredCsv() {
    if (filtered.length === 0) return;

    const headers = [
      'ID',
      'Country',
      'Province',
      'Value Chain',
      ...CRITERION_KEYS.map((key) => `${CRITERION_LABELS[key]} Raw`),
      ...CRITERION_KEYS.map((key) => `${CRITERION_LABELS[key]} Weighted`),
      'Total',
      'Band',
    ];

    const rows = filtered.map((sc) => [
      sc.id,
      sc.country,
      sc.province,
      sc.valueChain,
      ...CRITERION_KEYS.map((key) => sc.criteria[key]),
      ...CRITERION_KEYS.map((key) => sc.weighted[key]),
      sc.total,
      sc.band,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    downloadFile(url, 'dashboard-filtered-analysis.csv');
    URL.revokeObjectURL(url);
  }

  function exportChartPng(containerRef: React.RefObject<HTMLDivElement>, fileName: string) {
    const svg = containerRef.current?.querySelector('svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgText = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      const { width: rectWidth, height: rectHeight } = svg.getBoundingClientRect();
      const width = Math.max(1, Math.round(rectWidth));
      const height = Math.max(1, Math.round(rectHeight));
      const scale = 2;

      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;

      const context = canvas.getContext('2d');
      if (!context) {
        URL.revokeObjectURL(svgUrl);
        return;
      }

      context.scale(scale, scale);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          URL.revokeObjectURL(svgUrl);
          return;
        }
        const pngUrl = URL.createObjectURL(blob);
        downloadFile(pngUrl, fileName);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(svgUrl);
      }, 'image/png');
    };

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
    };

    image.src = svgUrl;
  }

  return (
    <div className="space-y-6">
      {count > 0 && (
        <div className="flex justify-end">
          <button
            onClick={exportFilteredCsv}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            aria-label="Export filtered analysis as CSV"
          >
            Export CSV
          </button>
        </div>
      )}

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

      {/* Insights strip */}
      {count > 0 && strongestCriterion && weakestCriterion && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Strongest Average Criterion</p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {strongestCriterion.criterion} ({strongestCriterion.average})
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Weakest Average Criterion</p>
            <p className="text-base font-semibold text-gray-900 mt-1">
              {weakestCriterion.criterion} ({weakestCriterion.average})
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Best vs Average Profile Gap</p>
            <p className={`text-base font-semibold mt-1 ${profileGap >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {profileGap >= 0 ? '+' : ''}{profileGap} criterion points
            </p>
          </div>
        </div>
      )}

      {/* Best Match Card */}
      {best ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Best Match
            </h3>
            <button
              onClick={() => exportChartPng(bestChartRef, 'best-match-weighted-points.png')}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              aria-label="Export best match chart as PNG"
            >
              Export PNG
            </button>
          </div>
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
          <div className="h-52" ref={bestChartRef}>
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

      {/* Radar + distribution infographics */}
      {count > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Criteria Radar Profile
              </h3>
              <button
                onClick={() => exportChartPng(radarChartRef, 'criteria-radar-profile.png')}
                className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                aria-label="Export radar chart as PNG"
              >
                Export PNG
              </button>
            </div>
            <div className="h-72" ref={radarChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="70%">
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="criterion" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value: number) => [`${value}`, 'Score']} />
                  <Legend />
                  <Radar name="Filtered average" dataKey="average" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                  <Radar name="Best match" dataKey="best" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Compares the average criteria profile of filtered entries against the top-ranked value chain.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Score Band Distribution
              </h3>
              <button
                onClick={() => exportChartPng(bandChartRef, 'score-band-distribution.png')}
                className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                aria-label="Export score band chart as PNG"
              >
                Export PNG
              </button>
            </div>
            <div className="h-72" ref={bandChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bandData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {bandData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}`, 'Entries']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Distribution of High, Medium, and Lower ranked scorecards in the current filter set.
            </p>
          </div>
        </div>
      )}

      {/* Country comparative infographic */}
      {countryData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Country Comparison (Average Total)
            </h3>
            <button
              onClick={() => exportChartPng(countryChartRef, 'country-comparison-average-total.png')}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              aria-label="Export country comparison chart as PNG"
            >
              Export PNG
            </button>
          </div>
          <div className="h-64" ref={countryChartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number, name: string, payload) => {
                    if (name === 'avgTotal') return [`${value}`, 'Avg total'];
                    return [`${payload?.payload?.entries ?? 0}`, 'Entries'];
                  }}
                />
                <Bar dataKey="avgTotal" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Average weighted score per country for current filters.
          </p>
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
