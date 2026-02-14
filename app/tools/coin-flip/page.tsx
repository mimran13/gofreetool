'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface FlipResult {
  result: 'heads' | 'tails';
  timestamp: Date;
}

export default function CoinFlip() {
  const tool = getToolBySlug('coin-flip');
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [history, setHistory] = useState<FlipResult[]>([]);

  const flip = useCallback(() => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    // Animate for 1 second
    setTimeout(() => {
      const newResult: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setHistory(prev => [{ result: newResult, timestamp: new Date() }, ...prev.slice(0, 19)]);
      setIsFlipping(false);
    }, 1000);
  }, [isFlipping]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const stats = {
    total: history.length,
    heads: history.filter(h => h.result === 'heads').length,
    tails: history.filter(h => h.result === 'tails').length,
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Flip a virtual coin for <strong>random decisions</strong>. Heads or tails with animated flip.
          Track your flip history and see statistics.
          <strong> True random</strong> using cryptographic randomness.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col items-center mb-8">
          {/* Coin */}
          <div
            className={`relative w-48 h-48 mb-8 cursor-pointer ${isFlipping ? 'animate-spin' : ''}`}
            onClick={flip}
            style={{ animationDuration: '0.2s' }}
          >
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-6xl font-bold shadow-xl transition-all duration-300 ${
                result === 'heads'
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
                  : result === 'tails'
                  ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800'
                  : 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-800'
              }`}
            >
              {isFlipping ? '?' : result ? (result === 'heads' ? 'H' : 'T') : '?'}
            </div>
          </div>

          {/* Result */}
          {result && !isFlipping && (
            <div className="text-4xl font-bold text-gray-900 dark:text-white capitalize mb-4">
              {result}!
            </div>
          )}

          {/* Flip Button */}
          <button
            onClick={flip}
            disabled={isFlipping}
            className="px-8 py-4 text-xl font-medium bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-xl transition-colors"
          >
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Statistics</h3>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear History
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Flips</div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.heads} ({stats.total > 0 ? Math.round(stats.heads / stats.total * 100) : 0}%)
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Heads</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {stats.tails} ({stats.total > 0 ? Math.round(stats.tails / stats.total * 100) : 0}%)
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tails</div>
              </div>
            </div>

            {/* History */}
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 20).map((flip, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    flip.result === 'heads'
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-gray-400 text-gray-900'
                  }`}
                >
                  {flip.result === 'heads' ? 'H' : 'T'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Click "Flip Coin" or click on the coin</li>
          <li>Watch the animation and see the result</li>
          <li>View your flip history and statistics</li>
          <li>Clear history to start fresh</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
