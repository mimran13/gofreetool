'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { removeDuplicateLines } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function DuplicateLineRemover() {
  const tool = getToolBySlug('duplicate-line-remover');
  if (!tool) return <div>Tool not found</div>;
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    if (!input.trim()) {
      setResult('');
      return;
    }
    const output = removeDuplicateLines(input);
    setResult(output);
    trackToolCalculate('duplicate-line-remover');
  };

  const handleReset = () => {
    setInput('');
    setResult('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    trackCopyClick('duplicate-line-remover');
  };

  const origLines = input.trim() ? input.split('\n').length : 0;
  const uniqueLines = result.trim() ? result.split('\n').length : 0;
  const duplicatesRemoved = origLines - uniqueLines;

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
              placeholder="Item 1&#10;Item 2&#10;Item 1&#10;Item 3&#10;etc..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output (Duplicates Removed)
            </label>
            <textarea
              value={result}
              readOnly
              placeholder="Unique lines will appear here..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg bg-gray-50 dark:bg-slate-700 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Remove Duplicates
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
        <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg animate-slideIn">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Deduplication Statistics</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{origLines}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Original Lines</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{uniqueLines}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Unique Lines</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{duplicatesRemoved}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Duplicates Removed</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Duplicate Removal</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This tool identifies and removes duplicate lines from your text while preserving the original order of first occurrences. It's perfect for cleaning up lists, removing repeated entries, and deduplicating data.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Paste or type your text (one item per line)</li>
            <li>Click "Remove Duplicates"</li>
            <li>The tool removes duplicate lines and shows statistics</li>
            <li>Click "Copy Result" to copy the cleaned data</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Example</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Before:</p>
              <p className="font-mono text-sm text-red-600 dark:text-red-400">Apple<br/>Banana<br/>Apple<br/>Cherry<br/>Banana<br/>Date</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">After:</p>
              <p className="font-mono text-sm text-green-600 dark:text-green-400">Apple<br/>Banana<br/>Cherry<br/>Date</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">When to Use This Tool</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Deduplicating imported data or lists</li>
            <li>Removing repeated entries from spreadsheets</li>
            <li>Cleaning up database exports</li>
            <li>Processing log file data</li>
            <li>Organizing messy list data</li>
            <li>Finding unique values in lists</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Does it preserve order?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes! The tool preserves the original order of first occurrences. The first time a line appears is kept in its position.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is it case-sensitive?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, duplicates are matched exactly. "Apple" and "apple" are considered different lines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
