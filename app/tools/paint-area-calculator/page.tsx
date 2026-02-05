'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { calculatePaintArea, calculatePaintQuantity, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function PaintAreaCalculator() {
  const tool = getToolBySlug('paint-area-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [coverage, setCoverage] = useState('10');
  const [result, setResult] = useState<{ area: number; quantity: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const c = parseFloat(coverage);

    if (!l || !w || !h || !c || l <= 0 || w <= 0 || h <= 0 || c <= 0) {
      setError('Please enter valid positive numbers');
      setResult(null);
      return;
    }

    setError('');
    const area = calculatePaintArea(l, w, h);
    const quantity = calculatePaintQuantity(area, c);
    setResult({ area, quantity });
    trackToolCalculate('paint-area-calculator');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('paint-area-calculator');
  };

  const handleReset = () => {
    setLength('');
    setWidth('');
    setHeight('');
    setCoverage('10');
    setResult(null);
    setError('');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Length (meters)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              placeholder="5"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Width (meters)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="4"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Height (meters)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paint Coverage (m²/liter)
            </label>
            <input
              type="number"
              step="0.5"
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              placeholder="10"
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
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Calculate
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
          >
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4 animate-slideIn">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Wall Area to Paint</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4">
              {formatNumber(result.area)} m²
            </p>
            <button
              onClick={() => handleCopy(result.area.toFixed(2))}
              className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              Copy Value
            </button>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Paint Required</p>
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-4">
              {formatNumber(result.quantity)} liters
            </p>
            <button
              onClick={() => handleCopy(result.quantity.toFixed(2))}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Much Paint Do You Need?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Calculating the correct amount of paint is essential for budget planning and avoiding waste. This calculator determines wall area and paint quantity based on room dimensions and paint coverage.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Paint Coverage Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Standard coverage:</strong> 10 m²/liter for most interior paints</li>
            <li><strong>Two coats recommended:</strong> Multiply quantity by 2</li>
            <li><strong>Primer:</strong> May need 12-15 m²/liter coverage</li>
            <li><strong>Dark colors:</strong> May need additional coats</li>
            <li><strong>Textured walls:</strong> May need more paint</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Measure your room length, width, and ceiling height in meters</li>
            <li>Note your paint's coverage (check the can)</li>
            <li>Enter the values above</li>
            <li>Click Calculate to see total area and paint needed</li>
          </ol>
        </div>
      </div>
    </ToolLayout>
  );
}
