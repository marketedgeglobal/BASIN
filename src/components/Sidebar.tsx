import { CRITERION_KEYS, CRITERION_LABELS, type SortField } from '../types';

interface SidebarProps {
  search: string;
  onSearchChange: (v: string) => void;
  country: string;
  onCountryChange: (v: string) => void;
  province: string;
  onProvinceChange: (v: string) => void;
  valueChain: string;
  onValueChainChange: (v: string) => void;
  sortField: SortField;
  onSortFieldChange: (v: SortField) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const COUNTRIES = ['Cambodia', 'Laos', 'Vietnam'];
const PROVINCES = ['Kratie', 'Champasak', 'An Giang'];
const VALUE_CHAINS = ['Vegetables', 'Cashews', 'Premium Rice', 'Livestock', 'Shrimp', 'Bananas'];

export default function Sidebar({
  search,
  onSearchChange,
  country,
  onCountryChange,
  province,
  onProvinceChange,
  valueChain,
  onValueChainChange,
  sortField,
  onSortFieldChange,
  onReset,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded shadow-lg"
        onClick={onToggle}
        aria-label={isOpen ? 'Close filters' : 'Open filters'}
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-auto z-40
          w-72 bg-white border-r border-gray-200 shadow-lg md:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col p-5 gap-5 overflow-y-auto
        `}
        aria-label="Filters"
      >
        <div className="flex items-center gap-2 pt-12 md:pt-0">
          <svg className="w-6 h-6 text-blue-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <h2 className="text-base font-semibold text-gray-800">Filters & Search</h2>
        </div>

        {/* Search */}
        <div>
          <label htmlFor="search-input" className="block text-xs font-medium text-gray-600 mb-1">
            Search
          </label>
          <input
            id="search-input"
            type="search"
            placeholder="Search country, province, value chain…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search"
          />
        </div>

        {/* Country filter */}
        <div>
          <label htmlFor="country-filter" className="block text-xs font-medium text-gray-600 mb-1">
            Country
          </label>
          <select
            id="country-filter"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Province filter */}
        <div>
          <label htmlFor="province-filter" className="block text-xs font-medium text-gray-600 mb-1">
            Province
          </label>
          <select
            id="province-filter"
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Provinces</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Value Chain filter */}
        <div>
          <label htmlFor="vc-filter" className="block text-xs font-medium text-gray-600 mb-1">
            Value Chain
          </label>
          <select
            id="vc-filter"
            value={valueChain}
            onChange={(e) => onValueChainChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Value Chains</option>
            {VALUE_CHAINS.map((vc) => (
              <option key={vc} value={vc}>{vc}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort-field" className="block text-xs font-medium text-gray-600 mb-1">
            Sort By
          </label>
          <select
            id="sort-field"
            value={sortField}
            onChange={(e) => onSortFieldChange(e.target.value as SortField)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="total">Total Score</option>
            {CRITERION_KEYS.map((k) => (
              <option key={k} value={k}>{CRITERION_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="mt-auto w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-md transition-colors"
          aria-label="Reset all filters"
        >
          Reset Filters
        </button>
      </aside>
    </>
  );
}
