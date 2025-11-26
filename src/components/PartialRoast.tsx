import { Flame, Lock, AlertTriangle } from 'lucide-react';

interface PartialRoastProps {
  grade: string;
  partialRoast: string;
  screenshotUrl: string;
  onGetFullRoast: () => void;
}

const gradeConfig: Record<string, { color: string; emoji: string; bg: string; border: string }> = {
  'A+': { color: 'text-green-400', emoji: '🔥', bg: 'bg-green-500/20', border: 'border-green-500' },
  'A': { color: 'text-green-400', emoji: '🔥', bg: 'bg-green-500/20', border: 'border-green-500' },
  'A-': { color: 'text-green-400', emoji: '👍', bg: 'bg-green-500/20', border: 'border-green-500' },
  'B+': { color: 'text-blue-400', emoji: '👍', bg: 'bg-blue-500/20', border: 'border-blue-500' },
  'B': { color: 'text-blue-400', emoji: '👌', bg: 'bg-blue-500/20', border: 'border-blue-500' },
  'B-': { color: 'text-blue-400', emoji: '😐', bg: 'bg-blue-500/20', border: 'border-blue-500' },
  'C+': { color: 'text-yellow-400', emoji: '⚠️', bg: 'bg-yellow-500/20', border: 'border-yellow-500' },
  'C': { color: 'text-yellow-400', emoji: '😬', bg: 'bg-yellow-500/20', border: 'border-yellow-500' },
  'C-': { color: 'text-yellow-400', emoji: '😬', bg: 'bg-yellow-500/20', border: 'border-yellow-500' },
  'D+': { color: 'text-orange-400', emoji: '🙈', bg: 'bg-orange-500/20', border: 'border-orange-500' },
  'D': { color: 'text-orange-400', emoji: '🙈', bg: 'bg-orange-500/20', border: 'border-orange-500' },
  'D-': { color: 'text-orange-400', emoji: '😱', bg: 'bg-orange-500/20', border: 'border-orange-500' },
  'F': { color: 'text-red-400', emoji: '💀', bg: 'bg-red-500/20', border: 'border-red-500' },
};

export default function PartialRoast({ grade, partialRoast, screenshotUrl, onGetFullRoast }: PartialRoastProps) {
  const config = gradeConfig[grade] || gradeConfig['F'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-lg ${config.bg} border-2 ${config.border} mb-4`}>
          <span className={`text-5xl font-bold ${config.color}`}>{grade}</span>
          <span className="ml-2 text-4xl">{config.emoji}</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-wider">
          Verdict Rendered
        </h2>
        <p className="text-gray-400">The AI has spoken. Brace yourself.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Your Landing Page
          </h3>
          <img
            src={screenshotUrl}
            alt="Landing page screenshot"
            className="w-full rounded-lg border border-gray-700"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-lg p-6 neon-border">
            <div className="flex items-start gap-3 mb-4">
              <Flame className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-pink-400 uppercase tracking-wider mb-3">
                  The Roast
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">{partialRoast}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border-2 border-yellow-500/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider mb-2">
                  Partial Roast Only
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  This is just the surface-level burn. The full analysis includes:
                </p>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">▸</span>
                    <span>Detailed breakdown of 5 key conversion areas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">▸</span>
                    <span>Individual grades with specific critiques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400">▸</span>
                    <span>3-5 prioritized actionable recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-8 text-center neon-border">
        <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-3">
          Want The Full Roast?
        </h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          Get the complete analysis with detailed breakdowns, individual section grades,
          and specific fixes to boost your conversion rates. Free.
        </p>
        <button
          onClick={onGetFullRoast}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 uppercase tracking-wider neon-border"
        >
          Unlock Full Report
        </button>
      </div>
    </div>
  );
}
