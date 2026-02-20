
export type TabId = 'dashboard' | 'scorecards' | 'interventions' | 'recommendations' | 'crosscutting';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'scorecards', label: 'Scorecards' },
  { id: 'interventions', label: 'Interventions' },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'crosscutting', label: 'Cross-Cutting' },
];

export default function TabsNav({ active, onChange }: Props) {
  return (
    <nav aria-label="Main navigation" className="flex overflow-x-auto border-b border-gray-200 bg-white">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500
            ${
              active === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
