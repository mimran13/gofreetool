'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function TextToBinary() {
  const tool = getToolBySlug('text-to-binary');
  const [mode, setMode] = useState<'toBinary' | 'toText'>('toBinary');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return '';

    if (mode === 'toBinary') {
      return input.split('').map(char => {
        const binary = char.charCodeAt(0).toString(2);
        return binary.padStart(8, '0');
      }).join(' ');
    } else {
      const bytes = input.trim().split(/\s+/);
      try {
        return bytes.map(byte => {
          const decimal = parseInt(byte, 2);
          if (isNaN(decimal)) return '';
          return String.fromCharCode(decimal);
        }).join('');
      } catch {
        return 'Invalid binary input';
      }
    }
  }, [input, mode]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [result]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert <strong>text to binary</strong> code and decode binary back to text.
          Learn how computers represent text using 1s and 0s.
          <strong> All processing happens in your browser</strong> — completely private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setMode('toBinary'); setInput(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'toBinary'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Text → Binary
          </button>
          <button
            onClick={() => { setMode('toText'); setInput(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'toText'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Binary → Text
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'toBinary' ? 'Enter Text' : 'Enter Binary (space-separated)'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(mode === 'toText' ? e.target.value.replace(/[^01\s]/g, '') : e.target.value)}
              placeholder={mode === 'toBinary' ? 'Hello World' : '01001000 01100101 01101100 01101100 01101111'}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'toBinary' ? 'Binary Output' : 'Text Output'}
              </label>
              <button
                onClick={handleCopy}
                disabled={!result}
                className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={result}
              readOnly
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Quick examples:</span>
          {['Hello', 'Hi', 'Yes', 'No', 'OK'].map((ex) => (
            <button
              key={ex}
              onClick={() => { setMode('toBinary'); setInput(ex); }}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How It Works</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
          Each character has an ASCII code. That code is converted to binary (base 2).
        </p>
        <div className="font-mono text-sm text-blue-700 dark:text-blue-400">
          A = 65 = <span className="bg-blue-200 dark:bg-blue-800 px-1 rounded">01000001</span><br />
          B = 66 = <span className="bg-blue-200 dark:bg-blue-800 px-1 rounded">01000010</span><br />
          a = 97 = <span className="bg-blue-200 dark:bg-blue-800 px-1 rounded">01100001</span>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Choose conversion direction (Text to Binary or vice versa)</li>
          <li>Enter your text or binary code</li>
          <li>See the converted result instantly</li>
          <li>Copy the result to use elsewhere</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
