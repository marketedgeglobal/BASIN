import basinData from '../data/basin.json';

export default function RecommendationsList() {
  const recs = basinData.operationalRecommendations;
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-base font-semibold text-gray-800">Operational Recommendations</h2>
      {recs.map((rec, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-2"
        >
          <h3 className="text-sm font-semibold text-gray-800">{rec.title}</h3>
          <p className="text-sm text-gray-600">{rec.detail}</p>
        </div>
      ))}
    </div>
  );
}
