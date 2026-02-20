import { useState } from 'react';
import { CRITERION_KEYS, CRITERION_LABELS, type ScorecardWithTotal, type SortField } from '../types';
import { bandColor } from '../utils';

interface ScorecardsProps {
  filtered: ScorecardWithTotal[];
  sortField: SortField;
  onSortFieldChange: (f: SortField) => void;
}

export default function Scorecards({ filtered, sortField, onSortFieldChange }: ScorecardsProps) {
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      onSortFieldChange(field);
      setSortDir('desc');
    }
  }

  const sorted = [...filtered].sort((a, b) => {
    const aVal = sortField === 'total' ? a.total : a.weighted[sortField];
    const bVal = sortField === 'total' ? b.total : b.weighted[sortField];
    return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
  });

  function SortIcon({ field }: { field: SortField }) {
    if (field !== sortField) {
      return <span className="ml-1 text-gray-300">↕</span>;
    }
    return <span className="ml-1 text-blue-600">{sortDir === 'desc' ? '↓' : '↑'}</span>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">
          Showing <strong>{sorted.length}</strong> scorecard{sorted.length !== 1 ? 's' : ''}. Click column headers to sort.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Scorecards table">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Province</th>
              <th className="px-4 py-3 text-left">Value Chain</th>
              {CRITERION_KEYS.map((k) => (
                <th key={k} className="px-3 py-3 text-center whitespace-nowrap">
                  <button
                    className="hover:text-blue-700 transition-colors focus:outline-none focus:underline"
                    onClick={() => handleSort(k)}
                    aria-label={`Sort by ${CRITERION_LABELS[k]}`}
                  >
                    {CRITERION_LABELS[k]}
                    <SortIcon field={k} />
                  </button>
                </th>
              ))}
              <th className="px-4 py-3 text-center">
                <button
                  className="hover:text-blue-700 transition-colors focus:outline-none focus:underline font-bold"
                  onClick={() => handleSort('total')}
                  aria-label="Sort by Total"
                >
                  Total
                  <SortIcon field="total" />
                </button>
              </th>
              <th className="px-4 py-3 text-center">Band</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={CRITERION_KEYS.length + 5} className="text-center py-10 text-gray-400">
                  No results match your current filters.
                </td>
              </tr>
            ) : (
              sorted.map((sc) => (
                <tr key={sc.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{sc.country}</td>
                  <td className="px-4 py-3 text-gray-700">{sc.province}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{sc.valueChain}</td>
                  {CRITERION_KEYS.map((k) => (
                    <td key={k} className="px-3 py-3 text-center text-gray-700">
                      {sc.weighted[k]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold text-blue-700">{sc.total}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bandColor(sc.band)}`}>
                      {sc.band}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Weight legend */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 font-medium mb-2">Scoring Weights (criterion × weight = weighted points):</p>
        <div className="flex flex-wrap gap-3">
          {CRITERION_KEYS.map((k) => (
            <span key={k} className="text-xs text-gray-500">
              <strong>{CRITERION_LABELS[k]}</strong>: {
                k === 'economic' ? '25%' :
                k === 'proPoor' ? '20%' :
                k === 'greenGrowth' ? '20%' :
                k === 'wee' ? '10%' :
                k === 'pwd' ? '5%' :
                k === 'systemic' ? '10%' :
                '10%'
              }
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
