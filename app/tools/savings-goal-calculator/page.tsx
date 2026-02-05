'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { calculateMonthlySavings, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function SavingsGoalCalculator() {
  const tool = getToolBySlug('savings-goal-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [goal, setGoal] = useState('');
  const [months, setMonths] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const g = parseFloat(goal);
    const m = parseFloat(months);

    if (!g || !m || g <= 0 || m <= 0) {
      setError('Please enter valid positive numbers');
      setResult(null);
      return;
    }

    setError('');
    const calculated = calculateMonthlySavings(g, m);
    setResult(calculated);
    trackToolCalculate('savings-goal-calculator');
  };

  const handleReset = () => {
    setGoal('');
    setMonths('');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('savings-goal-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Savings Goal ($)
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="50000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Months to Save
            </label>
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="24"
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

      {result !== null && (
        <div className="animate-slideIn">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Savings Required</p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              ${formatNumber(result)}
            </p>
            <button
              onClick={() => handleCopy(result.toFixed(2))}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Achieve Your Savings Goal</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This calculator helps you determine the monthly savings amount needed to reach a specific financial goal within a given timeframe. It divides your total goal by the number of months available.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Calculator</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter your total savings goal amount</li>
            <li>Enter how many months you have to save</li>
            <li>Click "Calculate" to see your monthly savings target</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Example</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            If you want to save $50,000 over 24 months:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Monthly Savings = $50,000 ÷ 24 = $2,083.33</li>
            <li>You need to save approximately $2,083 per month</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips for Reaching Your Savings Goal</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Set up automatic transfers on payday</li>
            <li>Use a separate savings account to avoid temptation</li>
            <li>Track your progress monthly</li>
            <li>Consider investing to earn interest on your savings</li>
            <li>Adjust your timeline if you can save more or less</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Should I factor in inflation?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This calculator shows the basic amount. In reality, inflation may increase your actual goal amount. Consider adjusting your target upward for inflation.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if I can't save that much?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You can adjust either the goal amount or extend the timeframe. Even saving less than the calculated amount gets you closer to your goal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
