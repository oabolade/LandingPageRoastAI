import { AlertTriangle, CheckCircle, XCircle, Terminal } from 'lucide-react';

interface RoastResultsProps {
  grade: string;
  summary: string;
  adviceList: string[];
  screenshotPreview: string;
  onRoastAnother: () => void;
}

const gradeConfig: Record<string, { color: string; emoji: string; bg: string }> = {
  'A': { color: 'text-green-400', emoji: '🔥', bg: 'bg-green-500/20' },
  'B': { color: 'text-blue-400', emoji: '👍', bg: 'bg-blue-500/20' },
  'C': { color: 'text-yellow-400', emoji: '⚠️', bg: 'bg-yellow-500/20' },
  'D': { color: 'text-orange-400', emoji: '😬', bg: 'bg-orange-500/20' },
  'F': { color: 'text-red-400', emoji: '💀', bg: 'bg-red-500/20' },
};

export default function RoastResults({ grade, summary, adviceList, screenshotPreview, onRoastAnother }: RoastResultsProps) {
  const config = gradeConfig[grade] || gradeConfig['F'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-8 neon-border">
        <div className="flex items-center gap-4 mb-6">
          <Terminal className="w-8 h-8 text-purple-400" />
          <h2 className="text-2xl font-bold text-purple-400 uppercase tracking-wider">
            [ROAST_REPORT_GENERATED]
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className={`${config.bg} border-2 border-${grade === 'A' ? 'green' : grade === 'B' ? 'blue' : grade === 'C' ? 'yellow' : grade === 'D' ? 'orange' : 'red'}-500 rounded-lg p-6`}>
              <div className="text-center">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Overall Grade</p>
                <div className="text-6xl font-bold mb-2">
                  <span className={config.color}>{grade}</span>
                  <span className="ml-2">{config.emoji}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">[PREVIEW]</p>
              <img
                src={screenshotPreview}
                alt="Landing page screenshot"
                className="w-full rounded border border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-pink-500/50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-pink-400 uppercase tracking-wider mb-2">
                    [THE_ROAST]
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{summary}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-purple-500/50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider">
                  [ACTIONABLE_FIXES]
                </h3>
              </div>
              <ul className="space-y-3">
                {adviceList.map((advice, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded flex items-center justify-center text-sm font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-8 text-center">
        <XCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-300 uppercase tracking-wider mb-3">
          [ANOTHER_VICTIM?]
        </h3>
        <p className="text-gray-500 mb-6">
          Got another landing page that needs some tough love?
        </p>
        <button
          onClick={onRoastAnother}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all uppercase tracking-wider neon-border"
        >
          [ ROAST ANOTHER ]
        </button>
      </div>
    </div>
  );
}
