'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { generateRandomNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function RandomNumberGenerator() {
  const tool = getToolBySlug('random-number-generator');
  if (!tool) return <div>Tool not found</div>;
  const [minNum, setMinNum] = useState('1');
  const [maxNum, setMaxNum] = useState('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [count, setCount] = useState(1);

  const handleGenerate = () => {
    const min = parseInt(minNum);
    const max = parseInt(maxNum);

    if (!minNum || !maxNum || min > max || isNaN(min) || isNaN(max)) {
      setError('Min must be less than or equal to Max');
      setResult(null);
      return;
    }

    setError('');
    const num = generateRandomNumber(min, max);
    setResult(num);
    setCount(count + 1);
    trackToolCalculate('random-number-generator');
  };

  const handleReset = () => {
    setMinNum('1');
    setMaxNum('100');
    setResult(null);
    setError('');
    setCount(1);
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      trackCopyClick('random-number-generator');
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Value</label>
            <input
              type="number"
              value={minNum}
              onChange={(e) => setMinNum(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maximum Value</label>
            <input
              type="number"
              value={maxNum}
              onChange={(e) => setMaxNum(e.target.value)}
              placeholder="100"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Generate
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
        <div className="space-y-4 animate-slideIn">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-8 border border-purple-200 dark:border-purple-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Your Random Number</p>
            <p className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-6">{result}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCopy}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                Copy
              </button>
              <button
                onClick={handleGenerate}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                Generate Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Uses for Random Numbers</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Games and gaming decisions</li>
            <li>Lottery number selection</li>
            <li>Random sampling</li>
            <li>Making unbiased decisions</li>
            <li>Picking random items from a list</li>
            <li>Dice rolls and probability testing</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
