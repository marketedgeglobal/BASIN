import { useState } from 'react';
import { FilterProvider } from './context/FilterContext';
import SidebarFilters from './components/SidebarFilters';
import TabsNav from './components/TabsNav';
import type { TabId } from './components/TabsNav';
import DashboardView from './components/DashboardView';
import ScorecardsTable from './components/ScorecardsTable';
import InterventionsList from './components/InterventionsList';
import RecommendationsList from './components/RecommendationsList';
import CrossCuttingView from './components/CrossCuttingView';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white px-4 py-3 shadow">
        <h1 className="text-lg font-bold tracking-tight">BASIN iMSD Explorer</h1>
        <p className="text-xs text-blue-200 mt-0.5">
          Inclusive Market Systems Development — Value Chain Scorecard Tool
        </p>
      </header>

      {/* Tabs */}
      <TabsNav active={activeTab} onChange={setActiveTab} />

      {/* Main layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <SidebarFilters />
        <main className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'scorecards' && <ScorecardsTable />}
          {activeTab === 'interventions' && <InterventionsList />}
          {activeTab === 'recommendations' && <RecommendationsList />}
          {activeTab === 'crosscutting' && <CrossCuttingView />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}
