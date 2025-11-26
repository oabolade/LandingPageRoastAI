import { Flame, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50 animate-pulse-slow"></div>
          <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-lg border-2 border-purple-400">
            <Flame className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
        <span className="neon-text">ROAST</span> MY LANDING PAGE
      </h1>

      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500"></div>
        <Zap className="w-4 h-4 text-pink-500" />
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-500"></div>
      </div>

      <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
        <span className="text-purple-400 font-semibold">BRUTAL MODE ENABLED</span> Upload your hero section. Get roasted by AI. Fix your conversion-killing design.
      </p>

      <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400">GPT-4o Vision</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-purple-400">Instant Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          <span className="text-pink-400">Actionable Fixes</span>
        </div>
      </div>
    </div>
  );
}
