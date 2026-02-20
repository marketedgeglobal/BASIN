import type { CrossCutting } from '../types';

interface CrossCuttingTabProps {
  crossCutting: CrossCutting;
}

export default function CrossCuttingTab({ crossCutting }: CrossCuttingTabProps) {
  const { sharedChallenge, designImplications, crossCuttingThemes, qualitativeFindings } = crossCutting;

  return (
    <div className="space-y-6">
      {/* Shared Challenge */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-3">
          <svg className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-base font-semibold text-amber-900">{sharedChallenge.title}</h3>
        </div>
        <p className="text-sm text-amber-800 leading-relaxed mb-4">{sharedChallenge.description}</p>
        <div className="flex flex-wrap gap-2">
          {sharedChallenge.countries.map((c) => (
            <span key={c} className="bg-amber-200 text-amber-900 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {c}
            </span>
          ))}
          {sharedChallenge.valueChains.map((vc) => (
            <span key={vc} className="bg-white border border-amber-300 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {vc}
            </span>
          ))}
        </div>
      </div>

      {/* Design Implications */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Design Implications
        </h3>
        <ul className="space-y-3">
          {designImplications.map((imp, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                {i + 1}
              </span>
              {imp}
            </li>
          ))}
        </ul>
      </div>

      {/* Cross-cutting Themes */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Cross-Cutting Themes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crossCuttingThemes.map((theme) => (
            <div key={theme.theme} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">{theme.theme}</h4>
              <p className="text-xs text-blue-800 leading-relaxed">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Qualitative Findings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Qualitative Findings
        </h3>
        <div className="space-y-3">
          {qualitativeFindings.map((finding) => (
            <article key={finding.title} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{finding.title}</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{finding.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
