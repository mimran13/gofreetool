'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function JavaScriptMinifier() {
  const tool = getToolBySlug('javascript-minifier');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const minified = useMemo(() => {
    if (!input.trim()) return '';

    let result = input
      // Remove single-line comments (but preserve URLs)
      .replace(/([^:])\/\/.*$/gm, '$1')
      // Remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove leading/trailing whitespace per line
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      // Collapse multiple newlines
      .replace(/\n+/g, '\n')
      // Remove newlines around operators and brackets
      .replace(/\n?\s*([{}\[\]();,:<>+\-*/%=&|!?])\s*\n?/g, '$1')
      // Fix specific patterns that need spaces
      .replace(/\bfunction\(/g, 'function (')
      .replace(/\)function/g, ') function')
      .replace(/\breturn\{/g, 'return {')
      .replace(/\belse\{/g, 'else {')
      .replace(/\}else/g, '} else')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}\[\]();,:<>+\-*/%=&|!?])\s*/g, '$1')
      // Restore necessary spaces
      .replace(/\bvar\b/g, 'var ')
      .replace(/\blet\b/g, 'let ')
      .replace(/\bconst\b/g, 'const ')
      .replace(/\breturn\b/g, 'return ')
      .replace(/\bfunction\b/g, 'function ')
      .replace(/\bif\(/g, 'if(')
      .replace(/\belse\b/g, 'else ')
      .replace(/\bfor\(/g, 'for(')
      .replace(/\bwhile\(/g, 'while(')
      .trim();

    return result;
  }, [input]);

  const stats = useMemo(() => {
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    const saved = originalSize - minifiedSize;
    const percentage = originalSize > 0 ? ((saved / originalSize) * 100).toFixed(1) : 0;

    return { original: originalSize, minified: minifiedSize, saved, percentage };
  }, [input, minified]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(minified);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [minified]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Minify JavaScript</strong> by removing whitespace, comments, and optimizing code.
          Reduce file size for faster page loads. Note: For production, use dedicated tools like Terser.
          <strong> All processing happens in your browser</strong> — your code stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input JavaScript
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`// Calculate factorial
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

/* Test the function */
console.log(factorial(5));`}
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono text-sm"
            />
            <div className="mt-1 text-sm text-gray-500">{formatBytes(stats.original)}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minified JavaScript</label>
              <button
                onClick={handleCopy}
                disabled={!minified}
                className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={minified}
              readOnly
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
            />
            <div className="mt-1 text-sm text-gray-500">{formatBytes(stats.minified)}</div>
          </div>
        </div>

        {input && (
          <div className="flex flex-wrap gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.percentage}%</div>
              <div className="text-sm text-green-700 dark:text-green-300">Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{formatBytes(stats.saved)}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Saved</div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Note</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          This is a basic minifier for quick tasks. For production builds, use professional tools
          like <strong>Terser</strong>, <strong>UglifyJS</strong>, or your bundler&apos;s built-in minification
          which can also mangle variable names and perform dead code elimination.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Paste your JavaScript code in the input area</li>
          <li>See the minified result instantly</li>
          <li>Copy the minified code for use</li>
          <li>Keep your original code for development</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
