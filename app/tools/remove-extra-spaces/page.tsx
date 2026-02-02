'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { removeExtraSpaces } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function RemoveExtraSpaces() {
  const tool = getToolBySlug('remove-extra-spaces');
  if (!tool) return <div>Tool not found</div>;
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleCalculate = () => {
    if (!input.trim()) {
      setResult('');
      return;
    }
    const output = removeExtraSpaces(input);
    setResult(output);
    trackToolCalculate('remove-extra-spaces');
  };

  const handleReset = () => {
    setInput('');
    setResult('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    trackCopyClick('remove-extra-spaces');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your text here with multiple spaces..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Output Text
            </label>
            <textarea
              value={result}
              readOnly
              placeholder="Your cleaned text will appear here..."
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
            Remove Spaces
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
        <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Character Statistics</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{input.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Original Characters</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Cleaned Characters</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{input.length - result.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Characters Removed</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Extra Spaces</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Extra spaces often accumulate in text when copying from different sources, editing documents, or formatting inconsistencies. This tool removes multiple consecutive spaces and replaces them with a single space, leaving your text clean and properly formatted.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Paste or type your text in the Input Text area</li>
            <li>Click "Remove Spaces" to process the text</li>
            <li>The cleaned text will appear in the Output Text area</li>
            <li>Click "Copy Result" to copy the output to clipboard</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Example</h2>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm space-y-3">
            <p className="text-red-600 dark:text-red-400">Before: "Hello   world    this    is    a    test"</p>
            <p className="text-green-600 dark:text-green-400">After: "Hello world this is a test"</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">When to Use This Tool</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Cleaning up text copied from web pages</li>
            <li>Formatting document text with irregular spacing</li>
            <li>Preparing text for publication or submission</li>
            <li>Removing extra spaces from code comments</li>
            <li>Standardizing spacing in data entries</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Does this remove line breaks?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No, this tool only removes extra spaces between words. Line breaks are preserved to maintain paragraph structure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
