import { useState, useMemo } from 'react';
import basinData from './data/basin-data.json';
import type { BasinData, SortField } from './types';
import { enrichData, filterScorecards } from './utils';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Scorecards from './components/Scorecards';
import Interventions from './components/Interventions';
import Recommendations from './components/Recommendations';
import CrossCuttingTab from './components/CrossCuttingTab';

const data = basinData as unknown as BasinData;
const allScorecards = enrichData(data);

type TabId = 'dashboard' | 'scorecards' | 'interventions' | 'recommendations' | 'crosscutting';

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'scorecards', label: 'Scorecards' },
  { id: 'interventions', label: 'Interventions' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'crosscutting', label: 'Cross-cutting' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [province, setProvince] = useState('');
  const [valueChain, setValueChain] = useState('');
  const [sortField, setSortField] = useState<SortField>('total');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredScorecards = useMemo(
    () => filterScorecards(allScorecards, country, province, valueChain, search),
    [country, province, valueChain, search]
  );

  function handleReset() {
    setSearch('');
    setCountry('');
    setProvince('');
    setValueChain('');
    setSortField('total');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <div className="ml-10 md:ml-0">
            <h1 className="text-xl font-bold tracking-tight">BASIN iMSD Explorer</h1>
            <p className="text-blue-200 text-xs mt-0.5">
              Cambodia · Laos · Vietnam — Market Systems Development
            </p>
          </div>
          {/* Active filter pills */}
          <div className="hidden md:flex flex-wrap gap-2 ml-6">
            {country && (
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                {country}
                <button onClick={() => setCountry('')} aria-label="Remove country filter" className="hover:text-blue-200">×</button>
              </span>
            )}
            {province && (
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                {province}
                <button onClick={() => setProvince('')} aria-label="Remove province filter" className="hover:text-blue-200">×</button>
              </span>
            )}
            {valueChain && (
              <span className="bg-blue-600 text-white text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                {valueChain}
                <button onClick={() => setValueChain('')} aria-label="Remove value chain filter" className="hover:text-blue-200">×</button>
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-screen-xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar
          search={search}
          onSearchChange={setSearch}
          country={country}
          onCountryChange={setCountry}
          province={province}
          onProvinceChange={setProvince}
          valueChain={valueChain}
          onValueChainChange={setValueChain}
          sortField={sortField}
          onSortFieldChange={setSortField}
          onReset={handleReset}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 md:p-6">
          {/* Tab navigation */}
          <nav aria-label="Main navigation" className="mb-6">
            <ul
              className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm overflow-x-auto"
              role="tablist"
            >
              {TABS.map((tab) => (
                <li key={tab.id} role="none" className="flex-1 min-w-0">
                  <button
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      ${activeTab === tab.id
                        ? 'bg-blue-700 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Tab panels */}
          <div role="tabpanel" aria-label={activeTab}>
            {activeTab === 'dashboard' && (
              <Dashboard filtered={filteredScorecards} />
            )}
            {activeTab === 'scorecards' && (
              <Scorecards
                filtered={filteredScorecards}
                sortField={sortField}
                onSortFieldChange={setSortField}
              />
            )}
            {activeTab === 'interventions' && (
              <Interventions
                interventions={data.interventions}
                country={country}
                onCountryChange={setCountry}
                province={province}
                valueChain={valueChain}
                onValueChainChange={setValueChain}
                search={search}
              />
            )}
            {activeTab === 'recommendations' && (
              <Recommendations
                recommendations={data.recommendations}
                interventions={data.interventions}
                scorecards={allScorecards}
                country={country}
                valueChain={valueChain}
                onCountryChange={setCountry}
                onValueChainChange={setValueChain}
              />
            )}
            {activeTab === 'crosscutting' && (
              <CrossCuttingTab crossCutting={data.crossCutting} />
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6 text-center text-xs text-gray-400">
        BASIN iMSD Explorer — Market Systems Development · Cambodia, Laos, Vietnam
      </footer>
    </div>
  );
}
