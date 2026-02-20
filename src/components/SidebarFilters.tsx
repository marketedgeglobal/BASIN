import type { ChangeEvent } from 'react';
import { useFilters } from '../context/FilterContext';
import basinData from '../data/basin.json';

export default function SidebarFilters() {
  const { filters, setFilters } = useFilters();

  const countries = Array.from(new Set(basinData.meta.locations.map((l) => l.country)));
  const provinces = basinData.meta.locations
    .filter((l) => !filters.country || l.country === filters.country)
    .map((l) => l.province);
  const allValueChains = Array.from(
    new Set(
      basinData.scorecards
        .filter((sc) => !filters.country || sc.country === filters.country)
        .filter((sc) => !filters.province || sc.province === filters.province)
        .flatMap((sc) => sc.valueChains.map((vc) => vc.valueChain))
    )
  );

  function handleCountry(e: ChangeEvent<HTMLSelectElement>) {
    setFilters((f) => ({ ...f, country: e.target.value, province: '', valueChain: '' }));
  }
  function handleProvince(e: ChangeEvent<HTMLSelectElement>) {
    setFilters((f) => ({ ...f, province: e.target.value, valueChain: '' }));
  }
  function handleValueChain(e: ChangeEvent<HTMLSelectElement>) {
    setFilters((f) => ({ ...f, valueChain: e.target.value }));
  }
  function handleQuery(e: ChangeEvent<HTMLInputElement>) {
    setFilters((f) => ({ ...f, query: e.target.value }));
  }
  function handleReset() {
    setFilters({ country: '', province: '', valueChain: '', query: '', sortKey: 'total' });
  }

  const selectClass =
    'w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <aside className="flex flex-col gap-4 p-4 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:w-64 shrink-0">
      <h2 className="text-base font-semibold text-gray-800">Filters</h2>

      <div>
        <label htmlFor="filter-query" className="block text-xs font-medium text-gray-600 mb-1">
          Search
        </label>
        <input
          id="filter-query"
          type="search"
          placeholder="Value chain, country…"
          value={filters.query}
          onChange={handleQuery}
          className={selectClass}
          aria-label="Search value chains"
        />
      </div>

      <div>
        <label htmlFor="filter-country" className="block text-xs font-medium text-gray-600 mb-1">
          Country
        </label>
        <select
          id="filter-country"
          value={filters.country}
          onChange={handleCountry}
          className={selectClass}
          aria-label="Filter by country"
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-province" className="block text-xs font-medium text-gray-600 mb-1">
          Province
        </label>
        <select
          id="filter-province"
          value={filters.province}
          onChange={handleProvince}
          className={selectClass}
          aria-label="Filter by province"
          disabled={!filters.country}
        >
          <option value="">All provinces</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-vc" className="block text-xs font-medium text-gray-600 mb-1">
          Value Chain
        </label>
        <select
          id="filter-vc"
          value={filters.valueChain}
          onChange={handleValueChain}
          className={selectClass}
          aria-label="Filter by value chain"
        >
          <option value="">All value chains</option>
          {allValueChains.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleReset}
        className="mt-auto rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Reset filters
      </button>
    </aside>
  );
}
