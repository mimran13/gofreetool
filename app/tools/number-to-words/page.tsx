'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion'];

function convertHundreds(num: number): string {
  let result = '';
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' hundred';
    num %= 100;
    if (num > 0) result += ' ';
  }
  if (num >= 20) {
    result += tens[Math.floor(num / 10)];
    num %= 10;
    if (num > 0) result += '-' + ones[num];
  } else if (num > 0) {
    result += ones[num];
  }
  return result;
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero';
  if (num < 0) return 'negative ' + numberToWords(Math.abs(num));

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      if (scaleIndex > 0) {
        result = chunkWords + ' ' + scales[scaleIndex] + (result ? ' ' + result : '');
      } else {
        result = chunkWords + (result ? ' ' + result : '');
      }
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}

export default function NumberToWords() {
  const tool = getToolBySlug('number-to-words');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const num = parseFloat(input.replace(/,/g, ''));
    if (isNaN(num)) return '';
    if (!Number.isInteger(num)) {
      const [whole, decimal] = input.replace(/,/g, '').split('.');
      const wholeWords = numberToWords(parseInt(whole) || 0);
      const decimalWords = decimal ? ' point ' + decimal.split('').map(d => ones[parseInt(d)] || 'zero').join(' ') : '';
      return wholeWords + decimalWords;
    }
    return numberToWords(num);
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [result]);

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert <strong>numbers to words</strong> in English. Perfect for writing checks,
          legal documents, and formal writing. Supports numbers up to quadrillions.
          <strong> All processing happens in your browser</strong> — completely private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter a Number
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^\d.,\-]/g, ''))}
            placeholder="e.g., 1234567"
            className="w-full px-4 py-3 text-2xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
          />
        </div>

        {result && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">In Words</label>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
              <p className="text-xl text-gray-900 dark:text-white leading-relaxed">
                {result}
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-2 italic">
                {capitalize(result)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[100, 1000, 1000000, 1000000000].map((num) => (
            <button
              key={num}
              onClick={() => setInput(num.toString())}
              className="p-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {num.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Examples</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• 100 = one hundred</li>
          <li>• 1,234 = one thousand two hundred thirty-four</li>
          <li>• 1,000,000 = one million</li>
          <li>• 42.5 = forty-two point five</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">When to Use Words</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Writing checks (required for the legal amount)</li>
          <li>Legal documents and contracts</li>
          <li>Formal invitations</li>
          <li>Numbers under ten in general writing</li>
          <li>Beginning a sentence with a number</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
