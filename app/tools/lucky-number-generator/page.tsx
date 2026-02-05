'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { calculateLuckyNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function LuckyNumberGenerator() {
  const tool = getToolBySlug('lucky-number-generator');
  if (!tool) return <div>Tool not found</div>;
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    if (!input.trim()) return;
    const num = calculateLuckyNumber(input);
    setResult(num);
    trackToolCalculate('lucky-number-generator');
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      trackCopyClick('lucky-number-generator');
    }
  };

  const luckyColors: Record<number, string> = {
    1: 'from-red-50 to-red-100 border-red-200 text-red-600',
    2: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
    3: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600',
    4: 'from-green-50 to-green-100 border-green-200 text-green-600',
    5: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    6: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600',
    7: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    8: 'from-pink-50 to-pink-100 border-pink-200 text-pink-600',
    9: 'from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-600'
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Your Name or Any Text
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Find Lucky Number
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
          >
            Reset
          </button>
        </div>
      </div>

      {result !== null && (
        <div className={`animate-slideIn bg-gradient-to-br ${luckyColors[result]} dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-white rounded-lg p-8 border-2 text-center`}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your Lucky Number</p>
          <p className="text-7xl font-bold mb-6">{result}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {result === 1 && "A lucky number of independence and leadership"}
            {result === 2 && "A lucky number of balance and harmony"}
            {result === 3 && "A lucky number of creativity and joy"}
            {result === 4 && "A lucky number of stability and strength"}
            {result === 5 && "A lucky number of adventure and freedom"}
            {result === 6 && "A lucky number of family and love"}
            {result === 7 && "A lucky number of wisdom and spirituality"}
            {result === 8 && "A lucky number of success and abundance"}
            {result === 9 && "A lucky number of compassion and completion"}
          </p>
          <button
            onClick={handleCopy}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
          >
            Copy Number
          </button>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Numerology & Lucky Numbers</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Numerology is an ancient practice that assigns mystical meaning to numbers. This tool calculates your lucky number based on the letters in your name using a simple reduction method.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Meaning of Numbers 1-9</h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>1:</strong> Independence, Leadership, New Beginnings</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>2:</strong> Balance, Partnership, Intuition</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>3:</strong> Creativity, Expression, Joy</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>4:</strong> Stability, Foundation, Hard Work</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>5:</strong> Freedom, Adventure, Change</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>6:</strong> Harmony, Love, Family</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>7:</strong> Wisdom, Spirituality, Introspection</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>8:</strong> Success, Abundance, Power</div>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded"><strong>9:</strong> Completion, Compassion, Humanity</div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Note:</strong> This tool is purely for entertainment. The concept of lucky numbers is part of numerology and is not scientifically proven.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
