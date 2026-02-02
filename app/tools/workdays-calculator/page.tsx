'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateWorkdays, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function WorkdaysCalculator() {
  const tool = getToolBySlug('workdays-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError('Start date must be before end date');
      setResult(null);
      return;
    }

    setError('');
    const workdays = calculateWorkdays(start, end);
    setResult(workdays);
    trackToolCalculate('workdays-calculator');
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toString());
      trackCopyClick('workdays-calculator');
    }
  };

  const totalDays = startDate && endDate ? 
    Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
        <div className="space-y-4 animate-slideIn">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Business Days (Monday-Friday)</p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
              {formatNumber(result)} days
            </p>
            <button
              onClick={handleCopy}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Copy Value
            </button>
          </div>

          {totalDays > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Total Calendar Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDays}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Weekend Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDays - result}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Business Days</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Business days, or workdays, are typically Monday through Friday. This calculator counts only these days between two dates, excluding Saturdays and Sundays. It's useful for project management, deadline calculation, and understanding work timelines.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Select your start date from the calendar</li>
            <li>Select your end date</li>
            <li>Click "Calculate" to count workdays</li>
            <li>See the results including weekend count</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">When to Use This Tool</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Planning project timelines</li>
            <li>Calculating delivery/deadline dates</li>
            <li>Employee time tracking</li>
            <li>Business process planning</li>
            <li>Understanding work schedules</li>
            <li>Managing team availability</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Note:</strong> This calculator does not account for public holidays. You may need to subtract additional days for holidays that fall on weekdays.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Does this include holidays?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No, it only excludes Saturdays and Sundays. You'll need to manually subtract holidays that fall on weekdays.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Are the start and end dates inclusive?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, both dates are counted if they fall on weekdays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
