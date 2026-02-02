'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateSimpleInterest, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function SimpleInterestCalculator() {
  const tool = getToolBySlug('simple-interest-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<{ interest: number; totalAmount: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);

    if (!p || !r || !y || p <= 0 || r < 0 || y < 0) {
      setError('Please enter valid numbers (Principal and Rate must be positive)');
      setResult(null);
      return;
    }

    setError('');
    const calculated = calculateSimpleInterest(p, r, y);
    setResult(calculated);
    trackToolCalculate('simple-interest-calculator');
  };

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setYears('');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('simple-interest-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Interest Amount</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ${formatNumber(result.interest)}
            </p>
            <button
              onClick={() => handleCopy(result.interest.toFixed(2))}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is Simple Interest?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Simple interest is a method of calculating interest on a principal amount. It's based only on the principal and does not account for interest earned on interest (compounding). The simple interest formula is:
          </p>
          <p className="text-center text-lg font-mono bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
            Simple Interest = (Principal × Rate × Time) / 100
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Calculator</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter the principal amount (initial investment or loan)</li>
            <li>Enter the annual interest rate as a percentage</li>
            <li>Enter the time period in years</li>
            <li>Click "Calculate" to see the interest earned and total amount</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Example</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            If you invest $10,000 at 5% annual interest for 3 years:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Interest = ($10,000 × 5 × 3) / 100 = $1,500</li>
            <li>Total Amount = $10,000 + $1,500 = $11,500</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What's the difference between simple and compound interest?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Simple interest is calculated only on the principal. Compound interest includes interest earned on previously earned interest, resulting in faster growth.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Where is simple interest commonly used?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Simple interest is commonly used for short-term loans, student loans, and some savings accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
