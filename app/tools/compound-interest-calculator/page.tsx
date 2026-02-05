'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { calculateCompoundInterest, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function CompoundInterestCalculator() {
  const tool = getToolBySlug('compound-interest-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [compounds, setCompounds] = useState('12');
  const [result, setResult] = useState<{ interest: number; totalAmount: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    const c = parseFloat(compounds);

    if (!p || !r || !y || !c || p <= 0 || r < 0 || y < 0 || c <= 0) {
      setError('Please enter valid numbers (all values must be positive)');
      setResult(null);
      return;
    }

    setError('');
    const calculated = calculateCompoundInterest(p, r, y, c);
    setResult(calculated);
    trackToolCalculate('compound-interest-calculator');
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setYears('');
    setCompounds('12');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('compound-interest-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Principal Amount ($)
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5.5"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Period (Years)
            </label>
            <input
              type="number"
              step="0.5"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compounding Frequency
            </label>
            <select
              value={compounds}
              onChange={(e) => setCompounds(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Annually</option>
              <option value="2">Semi-annually</option>
              <option value="4">Quarterly</option>
              <option value="12">Monthly</option>
              <option value="365">Daily</option>
            </select>
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
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Interest Earned</p>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              ${formatNumber(result.interest)}
            </p>
            <button
              onClick={() => handleCopy(result.interest.toFixed(2))}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Copy Value
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Amount (Principal + Interest)</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              ${formatNumber(result.totalAmount)}
            </p>
            <button
              onClick={() => handleCopy(result.totalAmount.toFixed(2))}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is Compound Interest?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Compound interest is interest earned on both the principal and previously earned interest. This creates exponential growth over time and is often called "interest on interest."
          </p>
          <p className="text-center text-lg font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
            A = P(1 + r/n)^(nt)
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Where A = Final Amount, P = Principal, r = Rate, n = Compounding frequency, t = Time
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Calculator</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter the principal amount</li>
            <li>Enter the annual interest rate</li>
            <li>Enter the time period in years</li>
            <li>Select how often interest compounds</li>
            <li>Click "Calculate" to see your results</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Does more frequent compounding give better returns?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, more frequent compounding typically results in slightly higher returns. Daily compounding earns more than monthly, which earns more than annual.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What's continuous compounding?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Continuous compounding is the theoretical maximum where interest compounds infinitely. It's the limit as compounding frequency approaches infinity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
