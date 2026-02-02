'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculatePercentage, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function TipCalculator() {
  const tool = getToolBySlug('tip-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [splitPeople, setSplitPeople] = useState('1');
  const [result, setResult] = useState<{ tipAmount: number; totalBill: number; perPerson: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const bill = parseFloat(billAmount);
    const tip = parseFloat(tipPercent);
    const people = parseFloat(splitPeople);

    if (!bill || tip < 0 || people <= 0 || bill <= 0) {
      setError('Please enter valid amounts');
      setResult(null);
      return;
    }

    setError('');
    const tipAmount = calculatePercentage(bill, tip);
    const totalBill = bill + tipAmount;
    const perPerson = totalBill / people;

    setResult({ tipAmount, totalBill, perPerson });
    trackToolCalculate('tip-calculator');
  };

  const handleReset = () => {
    setBillAmount('');
    setTipPercent('15');
    setSplitPeople('1');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('tip-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bill Amount ($)
            </label>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="50"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tip Percentage (%)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
                placeholder="15"
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setTipPercent('10')}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium"
                >
                  10%
                </button>
                <button
                  onClick={() => setTipPercent('15')}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium"
                >
                  15%
                </button>
                <button
                  onClick={() => setTipPercent('20')}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm font-medium"
                >
                  20%
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Split Among (People)
            </label>
            <input
              type="number"
              value={splitPeople}
              onChange={(e) => setSplitPeople(e.target.value)}
              placeholder="1"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tip Amount</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                ${formatNumber(result.tipAmount)}
              </p>
              <button
                onClick={() => handleCopy(result.tipAmount.toFixed(2))}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                Copy Value
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Bill</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                ${formatNumber(result.totalBill)}
              </p>
              <button
                onClick={() => handleCopy(result.totalBill.toFixed(2))}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Copy Value
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Per Person</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                ${formatNumber(result.perPerson)}
              </p>
              <button
                onClick={() => handleCopy(result.perPerson.toFixed(2))}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Copy Value
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tip Etiquette & Guidelines</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Tipping is a way to show appreciation for good service. Standard tip percentages vary by situation:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Restaurants:</strong> 15-20% for good service</li>
            <li><strong>Delivery:</strong> $2-5 or 15-20% of order</li>
            <li><strong>Taxi/Rideshare:</strong> 15-20%</li>
            <li><strong>Hair Salon:</strong> 15-20%</li>
            <li><strong>Bartender:</strong> $1-2 per drink or 15-20%</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Calculator</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter the original bill amount</li>
            <li>Select or enter the tip percentage</li>
            <li>Enter how many people are splitting the bill</li>
            <li>Click "Calculate" to see the tip, total, and per-person amount</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is it rude not to tip?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                In countries with a tipping culture (like the US), not tipping is generally considered rude, as service workers often rely on tips. However, tipping customs vary by country.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if the service was poor?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You can tip less (5-10%) if service was subpar, but it's better to speak to management. Everyone has bad days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
