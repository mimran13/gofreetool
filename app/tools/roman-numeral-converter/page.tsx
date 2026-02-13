'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const romanNumerals: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

function toRoman(num: number): string {
  if (num <= 0 || num > 3999) return '';
  let result = '';
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

function fromRoman(roman: string): number {
  const values: Record<string, number> = {
    'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
  };
  let result = 0;
  const upper = roman.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    const current = values[upper[i]];
    const next = values[upper[i + 1]];
    if (current === undefined) return 0;
    if (next && current < next) {
      result -= current;
    } else {
      result += current;
    }
  }
  return result;
}

export default function RomanNumeralConverter() {
  const tool = getToolBySlug('roman-numeral-converter');
  const [mode, setMode] = useState<'toRoman' | 'fromRoman'>('toRoman');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return '';
    if (mode === 'toRoman') {
      const num = parseInt(input);
      if (isNaN(num) || num <= 0 || num > 3999) return 'Enter a number between 1 and 3999';
      return toRoman(num);
    } else {
      const num = fromRoman(input);
      if (num === 0) return 'Invalid Roman numeral';
      return num.toString();
    }
  }, [input, mode]);

  const handleCopy = useCallback(async () => {
    if (!result || result.includes('Invalid') || result.includes('Enter')) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [result]);

  const examples = [
    { arabic: 1, roman: 'I' },
    { arabic: 4, roman: 'IV' },
    { arabic: 9, roman: 'IX' },
    { arabic: 49, roman: 'XLIX' },
    { arabic: 99, roman: 'XCIX' },
    { arabic: 499, roman: 'CDXCIX' },
    { arabic: 1999, roman: 'MCMXCIX' },
    { arabic: 2024, roman: 'MMXXIV' },
  ];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert between <strong>Roman numerals</strong> and Arabic numbers. Learn how Roman
          numerals work with step-by-step explanations. Supports numbers from 1 to 3,999.
          <strong> All processing happens in your browser</strong> — completely private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('toRoman'); setInput(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'toRoman'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Number → Roman
          </button>
          <button
            onClick={() => { setMode('fromRoman'); setInput(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'fromRoman'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Roman → Number
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {mode === 'toRoman' ? 'Enter a Number (1-3999)' : 'Enter Roman Numeral'}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(mode === 'toRoman' ? e.target.value.replace(/\D/g, '') : e.target.value.toUpperCase())}
            placeholder={mode === 'toRoman' ? 'e.g., 2024' : 'e.g., MMXXIV'}
            className="w-full px-4 py-3 text-2xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono text-center"
          />
        </div>

        {result && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Result</label>
              {!result.includes('Invalid') && !result.includes('Enter') && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className={`p-6 rounded-lg text-center text-4xl font-mono ${
              result.includes('Invalid') || result.includes('Enter')
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                : 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
            }`}>
              {result}
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {examples.map((ex) => (
            <button
              key={ex.arabic}
              onClick={() => setInput(mode === 'toRoman' ? ex.arabic.toString() : ex.roman)}
              className="p-2 text-center bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-sm font-bold text-gray-900 dark:text-white">{ex.arabic}</div>
              <div className="text-xs text-gray-500">{ex.roman}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Roman Numeral Rules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-400 mb-3">
          <div><strong>I</strong> = 1</div>
          <div><strong>V</strong> = 5</div>
          <div><strong>X</strong> = 10</div>
          <div><strong>L</strong> = 50</div>
          <div><strong>C</strong> = 100</div>
          <div><strong>D</strong> = 500</div>
          <div><strong>M</strong> = 1000</div>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          • Smaller before larger = subtract (IV = 4, IX = 9)<br />
          • Smaller after larger = add (VI = 6, XI = 11)
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Choose conversion direction (Number to Roman or vice versa)</li>
          <li>Enter your value</li>
          <li>See the converted result instantly</li>
          <li>Click examples for quick conversion</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
