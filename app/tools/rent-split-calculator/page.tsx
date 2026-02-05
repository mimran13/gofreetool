'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function RentSplitCalculator() {
  const tool = getToolBySlug('rent-split-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [totalRent, setTotalRent] = useState('');
  const [roommates, setRoommates] = useState('');
  const [utilities, setUtilities] = useState('0');
  const [result, setResult] = useState<{ perPerson: number; withUtilities: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const rent = parseFloat(totalRent);
    const people = parseFloat(roommates);
    const util = parseFloat(utilities);

    if (!rent || !people || rent <= 0 || people <= 0 || util < 0) {
      setError('Please enter valid positive numbers');
      setResult(null);
      return;
    }

    setError('');
    const perPerson = rent / people;
    const withUtilities = (rent + util) / people;

    setResult({ perPerson, withUtilities });
    trackToolCalculate('rent-split-calculator');
  };

  const handleReset = () => {
    setTotalRent('');
    setRoommates('');
    setUtilities('0');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('rent-split-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Monthly Rent ($)
            </label>
            <input
              type="number"
              value={totalRent}
              onChange={(e) => setTotalRent(e.target.value)}
              placeholder="3000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Roommates (including you)
            </label>
            <input
              type="number"
              value={roommates}
              onChange={(e) => setRoommates(e.target.value)}
              placeholder="3"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Utilities ($)
            </label>
            <input
              type="number"
              value={utilities}
              onChange={(e) => setUtilities(e.target.value)}
              placeholder="300"
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Per Person (Rent Only)</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ${formatNumber(result.perPerson)}
            </p>
            <button
              onClick={() => handleCopy(result.perPerson.toFixed(2))}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy Value
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Per Person (with Utilities)</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              ${formatNumber(result.withUtilities)}
            </p>
            <button
              onClick={() => handleCopy(result.withUtilities.toFixed(2))}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips for Fair Rent Division</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Divide rent equally if all rooms are similar size</li>
            <li>Pay more if you have a larger/better room</li>
            <li>Include utilities in the total split</li>
            <li>Keep clear records of who pays whom</li>
            <li>Set up automatic payments when possible</li>
            <li>Review utilities monthly to ensure fairness</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Calculator</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter the total monthly rent</li>
            <li>Enter the number of people including yourself</li>
            <li>Enter monthly utilities (optional)</li>
            <li>Click "Calculate" to see what each person owes</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Utility Cost Breakdown</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p className="font-semibold">Typical monthly utility costs include:</p>
            <ul className="list-disc list-inside">
              <li>Electricity: $80-150</li>
              <li>Water/Sewer: $30-80</li>
              <li>Internet: $30-100</li>
              <li>Gas: $20-100 (seasonal)</li>
              <li>Trash: $20-50</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Should utilities be split equally?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Generally yes, unless someone uses significantly more (like working from home). Splitting equally is simplest and fairest.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if rent varies by room size?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You might negotiate different amounts per room. Use this calculator for each person's individual share, adjusting up or down as agreed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
