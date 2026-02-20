import { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode, Dispatch, SetStateAction } from 'react';
import type { Filters, FlatRow, Intervention } from '../types';
import basinData from '../data/basin.json';

function scoreBand(total: number): 'High' | 'Medium' | 'Lower' {
  if (total >= 75) return 'High';
  if (total >= 65) return 'Medium';
  return 'Lower';
}

const allRows: FlatRow[] = basinData.scorecards.flatMap((sc) =>
  sc.valueChains.map((vc) => ({
    country: sc.country,
    province: sc.province,
    valueChain: vc.valueChain,
    weighted: vc.weighted as FlatRow['weighted'],
    total: vc.total,
    band: scoreBand(vc.total),
  }))
);

interface FilterContextValue {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  filteredRows: FlatRow[];
  filteredInterventions: Intervention[];
  bestMatch: FlatRow | null;
  kpis: { avgScore: number; highCount: number; totalRows: number };
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({
    country: '',
    province: '',
    valueChain: '',
    query: '',
    sortKey: 'total',
  });

  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (filters.country) rows = rows.filter((r) => r.country === filters.country);
    if (filters.province) rows = rows.filter((r) => r.province === filters.province);
    if (filters.valueChain) rows = rows.filter((r) => r.valueChain === filters.valueChain);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.valueChain.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.province.toLowerCase().includes(q)
      );
    }
    const key = filters.sortKey as keyof FlatRow['weighted'] | 'total';
    rows = [...rows].sort((a, b) => {
      const av = key === 'total' ? a.total : a.weighted[key as keyof FlatRow['weighted']];
      const bv = key === 'total' ? b.total : b.weighted[key as keyof FlatRow['weighted']];
      return bv - av;
    });
    return rows;
  }, [filters]);

  const filteredInterventions = useMemo(() => {
    let items = basinData.interventions as Intervention[];
    if (filters.country) items = items.filter((i) => i.country === filters.country);
    if (filters.province) items = items.filter((i) => i.province === filters.province);
    if (filters.valueChain) items = items.filter((i) => i.valueChain === filters.valueChain);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q) ||
          i.valueChain.toLowerCase().includes(q)
      );
    }
    return items;
  }, [filters]);

  const bestMatch = useMemo(
    () => (filteredRows.length > 0 ? filteredRows[0] : null),
    [filteredRows]
  );

  const kpis = useMemo(() => {
    const total = filteredRows.length;
    const highCount = filteredRows.filter((r) => r.band === 'High').length;
    const avgScore =
      total > 0
        ? Math.round(filteredRows.reduce((s, r) => s + r.total, 0) / total)
        : 0;
    return { avgScore, highCount, totalRows: total };
  }, [filteredRows]);

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, filteredRows, filteredInterventions, bestMatch, kpis }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
