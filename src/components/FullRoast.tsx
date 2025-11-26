import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface FullRoastData {
  headline: { grade: string; critique: string };
  valueProposition: { grade: string; critique: string };
  visualHierarchy: { grade: string; critique: string };
  cta: { grade: string; critique: string };
  trustSignals: { grade: string; critique: string };
  actionableRecommendations: string[];
}

interface FullRoastProps {
  fullRoast: FullRoastData;
  grade: string;
  screenshotUrl: string;
  onRoastAnother: () => void;
  onClose: () => void;
}

const gradeColors: Record<string, string> = {
  'A+': 'bg-green-600',
  'A': 'bg-green-600',
  'A-': 'bg-green-500',
  'B+': 'bg-blue-600',
  'B': 'bg-blue-600',
  'B-': 'bg-blue-500',
  'C+': 'bg-yellow-600',
  'C': 'bg-yellow-600',
  'C-': 'bg-yellow-500',
  'D+': 'bg-orange-600',
  'D': 'bg-orange-600',
  'D-': 'bg-orange-500',
  'F': 'bg-red-600',
};

export default function FullRoast({ fullRoast, grade, screenshotUrl, onRoastAnother, onClose }: FullRoastProps) {
  const sections = [
    { title: 'Headline', data: fullRoast.headline },
    { title: 'Value Proposition', data: fullRoast.valueProposition },
    { title: 'Visual Hierarchy', data: fullRoast.visualHierarchy },
    { title: 'Call to Action', data: fullRoast.cta },
    { title: 'Trust Signals', data: fullRoast.trustSignals },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative">
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-50 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-500 text-gray-400 hover:text-white rounded-lg p-3 transition-all shadow-lg"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400 text-white rounded-lg shadow-2xl p-8 text-center neon-border">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-lg mb-4 border-2 border-purple-400">
          <span className="text-4xl font-bold text-white">{grade}</span>
        </div>
        <h2 className="text-3xl font-bold mb-2 uppercase tracking-wider">Complete Analysis</h2>
        <p className="text-white/90">Full breakdown unlocked</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-4 sticky top-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Your Page
            </h3>
            <img
              src={screenshotUrl}
              alt="Landing page screenshot"
              className="w-full rounded-lg border border-gray-700"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`${
                      gradeColors[section.data.grade] || 'bg-gray-600'
                    } text-white text-sm font-bold px-3 py-1 rounded`}
                  >
                    {section.data.grade}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{section.data.critique}</p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-500/50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-green-400 uppercase tracking-wider">Quick Wins</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Top priority fixes that will have the biggest impact:
            </p>
            <ul className="space-y-3">
              {fullRoast.actionableRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded flex items-center justify-center text-sm font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-gray-300 flex-1">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-3">
            Another Victim?
          </h3>
          <p className="text-gray-400 mb-6">
            Got another landing page that needs some tough love?
          </p>
          <button
            onClick={onRoastAnother}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 uppercase tracking-wider neon-border"
          >
            Roast Another
          </button>
        </div>
      </div>
    </div>
  );
}
