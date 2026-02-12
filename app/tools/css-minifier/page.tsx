'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function CSSMinifier() {
  const tool = getToolBySlug('css-minifier');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const minified = useMemo(() => {
    if (!input.trim()) return '';

    let result = input
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove newlines and extra whitespace
      .replace(/\s+/g, ' ')
      // Remove space before and after special characters
      .replace(/\s*([{}:;,>~+])\s*/g, '$1')
      // Remove trailing semicolons before closing braces
      .replace(/;}/g, '}')
      // Remove quotes from url() if possible
      .replace(/url\(["']([^"']+)["']\)/g, 'url($1)')
      // Remove leading zeros from decimals
      .replace(/:0\./g, ':.')
      // Remove units from zero values
      .replace(/(:|\s)0(px|em|rem|%|pt|cm|mm|in|ex|pc|vw|vh|vmin|vmax)/g, '$10')
      // Trim
      .trim();

    return result;
  }, [input]);

  const stats = useMemo(() => {
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    const saved = originalSize - minifiedSize;
    const percentage = originalSize > 0 ? ((saved / originalSize) * 100).toFixed(1) : 0;

    return {
      original: originalSize,
      minified: minifiedSize,
      saved,
      percentage,
    };
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
          <strong>Minify CSS</strong> by removing whitespace, comments, and unnecessary characters.
          Reduce file size for faster page loads while preserving functionality.
          <strong> All processing happens in your browser</strong> — your code stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input CSS
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Navigation styles */
.nav {
  display: flex;
  gap: 10px;
}`}
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono text-sm"
            />
            <div className="mt-1 text-sm text-gray-500">{formatBytes(stats.original)}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minified CSS</label>
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

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">What Gets Removed</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Comments (/* ... */)</li>
          <li>• Unnecessary whitespace and newlines</li>
          <li>• Trailing semicolons before closing braces</li>
          <li>• Units from zero values (0px → 0)</li>
          <li>• Leading zeros from decimals (0.5 → .5)</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Paste your CSS code in the input area</li>
          <li>See the minified result instantly</li>
          <li>Copy the minified CSS for production use</li>
          <li>Keep your original formatted CSS for development</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
