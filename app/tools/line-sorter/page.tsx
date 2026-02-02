'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { sortLines } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function LineSorter() {
  const tool = getToolBySlug('line-sorter');
  if (!tool) return <div>Tool not found</div>;
  const [input, setInput] = useState('');
  const [reverse, setReverse] = useState(false);
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    if (!input.trim()) {
      setResult('');
      return;
    }
    const output = sortLines(input, reverse);
    setResult(output);
    trackToolCalculate('line-sorter');
  };

  const handleReset = () => {
    setInput('');
    setResult('');
    setReverse(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    trackCopyClick('line-sorter');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Text (one item per line)
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apple&#10;Zebra&#10;Banana&#10;etc..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sorted Output
            </label>
            <textarea
              value={result}
              readOnly
              placeholder="Your sorted lines will appear here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg bg-gray-50 dark:bg-slate-700 font-mono text-sm"
            />
          </div>
        </div>

        <div className="my-6 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={reverse}
              onChange={(e) => setReverse(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reverse (Z to A)</span>
          </label>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Sort Lines
          </button>
          {result && (
            <button
              onClick={handleCopy}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition transform active:scale-95"
            >
              Copy Result
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
          >
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sorting Statistics</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{input.split('\n').filter(l => l.trim()).length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Lines</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reverse ? 'Z → A' : 'A → Z'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Sort Order</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Line Sorter</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This tool takes a list of items (one per line) and sorts them alphabetically. You can choose between ascending order (A to Z) or descending order (Z to A). It's case-insensitive and perfect for organizing lists, names, or any line-separated data.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter your items with each on a new line</li>
            <li>Optionally check "Reverse" for Z to A sorting</li>
            <li>Click "Sort Lines" to alphabetize</li>
            <li>Copy the result or refine further</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Example</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Before:</p>
              <p className="font-mono text-sm text-red-600 dark:text-red-400">Zebra<br/>Apple<br/>Banana<br/>Cherry</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">After (A→Z):</p>
              <p className="font-mono text-sm text-green-600 dark:text-green-400">Apple<br/>Banana<br/>Cherry<br/>Zebra</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">When to Use This Tool</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Organizing lists of names or items</li>
            <li>Sorting data from spreadsheets</li>
            <li>Creating alphabetical indexes</li>
            <li>Organizing reference materials</li>
            <li>Preparing sorted lists for documents</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is the sorting case-sensitive?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No, it's case-insensitive. "apple" and "Apple" are treated the same in the sort order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
