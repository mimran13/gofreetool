'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { getDayOfWeek } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function DayOfWeekFinder() {
  const tool = getToolBySlug('day-of-week-finder');
  if (!tool) return <div>Tool not found</div>;
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleCalculate = () => {
    if (!dateInput) {
      setResult(null);
      return;
    }

    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setResult(null);
        return;
      }

      const day = getDayOfWeek(date);
      setResult(day);
      trackToolCalculate('day-of-week-finder');
    } catch {
      setResult(null);
    }
  };

  const handleReset = () => {
    setDateInput('');
    setResult(null);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      trackCopyClick('day-of-week-finder');
    }
  };

  const dayColors: Record<string, string> = {
    Monday: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    Tuesday: 'from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-600',
    Wednesday: 'from-green-50 to-green-100 border-green-200 text-green-600',
    Thursday: 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600',
    Friday: 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    Saturday: 'from-pink-50 to-pink-100 border-pink-200 text-pink-600',
    Sunday: 'from-red-50 to-red-100 border-red-200 text-red-600'
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select a Date
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Find Day
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
        <div className={`animate-slideIn bg-gradient-to-br ${dayColors[result]} dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-white rounded-lg p-8 border-2 text-center`}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Day of the Week</p>
          <p className="text-5xl font-bold mb-6">{result}</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date(dateInput).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <button
            onClick={handleCopy}
            className="text-sm hover:underline font-semibold"
          >
            Copy Day
          </button>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Days of the Week</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The Gregorian calendar divides time into weeks of seven days. This tool uses Zeller's congruence algorithm to determine which day of the week any date falls on, including dates in the past or far future.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Select a date from the calendar picker</li>
            <li>Click "Find Day" to calculate</li>
            <li>The day of the week will be displayed in a colorful card</li>
            <li>Copy the result if needed</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fun Facts</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>The week cycle repeats every 7 days</li>
            <li>You can find the day for any date past or future</li>
            <li>The Gregorian calendar has been in use since 1582</li>
            <li>Different cultures may have different week start days</li>
            <li>Knowing the day of the week helps with historical research</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I find historical dates?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes! The calculator works for dates back to the Gregorian calendar's adoption (1582) and forward centuries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
