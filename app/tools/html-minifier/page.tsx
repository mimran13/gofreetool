'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function HTMLMinifier() {
  const tool = getToolBySlug('html-minifier');
  const [input, setInput] = useState('');
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);

  const minified = useMemo(() => {
    if (!input.trim()) return '';

    let result = input;

    if (removeComments) {
      // Remove HTML comments (but not conditional comments)
      result = result.replace(/<!--(?!\[)[\s\S]*?-->/g, '');
    }

    if (collapseWhitespace) {
      // Collapse whitespace between tags
      result = result.replace(/>\s+</g, '><');
      // Collapse multiple spaces to single space
      result = result.replace(/\s+/g, ' ');
      // Remove whitespace around tags
      result = result.replace(/\s*(<[^>]+>)\s*/g, '$1');
    }

    // Remove unnecessary quotes from attributes
    result = result.replace(/=["']([^"'\s>]+)["']/g, '=$1');

    // Remove optional closing tags (careful subset)
    result = result.replace(/<\/li>/gi, '');
    result = result.replace(/<\/dt>/gi, '');
    result = result.replace(/<\/dd>/gi, '');
    result = result.replace(/<\/option>/gi, '');

    // Remove type attribute from script/style
    result = result.replace(/<script\s+type=["']?text\/javascript["']?/gi, '<script');
    result = result.replace(/<style\s+type=["']?text\/css["']?/gi, '<style');

    return result.trim();
  }, [input, removeComments, collapseWhitespace]);

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
          <strong>Minify HTML</strong> by removing whitespace, comments, and optional elements.
          Reduce page size for faster loading while maintaining valid markup.
          <strong> All processing happens in your browser</strong> — your code stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Remove comments</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={collapseWhitespace}
              onChange={(e) => setCollapseWhitespace(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Collapse whitespace</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input HTML
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <!-- Main content -->
  <div class="container">
    <h1>Hello World</h1>
    <p>Welcome to my website.</p>
  </div>
</body>
</html>`}
              rows={14}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono text-sm"
            />
            <div className="mt-1 text-sm text-gray-500">{formatBytes(stats.original)}</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Minified HTML</label>
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
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">What Gets Optimized</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• HTML comments removed</li>
          <li>• Whitespace between tags collapsed</li>
          <li>• Optional closing tags removed (li, dt, dd, option)</li>
          <li>• Redundant attributes removed (type on script/style)</li>
          <li>• Unnecessary quotes from attributes</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Paste your HTML code in the input area</li>
          <li>Toggle options as needed</li>
          <li>Copy the minified HTML for production</li>
          <li>Keep your original HTML for development</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
