import basinData from '../data/basin.json';

export default function CrossCuttingView() {
  const cc = basinData.crossCutting;
  return (
    <div className="p-4 space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-2">Cross-Cutting Themes</h2>
        <p className="text-sm text-gray-600">{cc.focus}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sample Challenges</h3>
        <div className="space-y-3">
          {cc.sampleChallenges.map((ch, i) => (
            <div key={i} className="border-l-4 border-yellow-400 pl-3">
              <p className="text-sm font-medium text-gray-800">{ch.title}</p>
              <p className="text-sm text-gray-600 mt-0.5">{ch.gist}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Design Implications</h3>
        <ul className="space-y-2 list-disc list-inside">
          {cc.designImplications.map((imp, i) => (
            <li key={i} className="text-sm text-gray-600">
              {imp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
