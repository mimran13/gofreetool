'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function SlugGenerator() {
  const tool = getToolBySlug('slug-generator');
  const [text, setText] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [maxLength, setMaxLength] = useState(0);
  const [copied, setCopied] = useState(false);

  const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'it', 'its'];

  const slug = useMemo(() => {
    if (!text.trim()) return '';

    let result = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, ' ')
      .replace(/[\s_-]+/g, ' ')
      .trim();

    if (removeStopWords) {
      const words = result.split(' ');
      result = words.filter(word => !stopWords.includes(word.toLowerCase())).join(' ');
    }

    if (lowercase) {
      result = result.toLowerCase();
    }

    result = result.replace(/\s+/g, separator);

    if (maxLength > 0 && result.length > maxLength) {
      result = result.substring(0, maxLength);
      const lastSep = result.lastIndexOf(separator);
      if (lastSep > maxLength * 0.5) {
        result = result.substring(0, lastSep);
      }
    }

    result = result.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), '');

    return result;
  }, [text, separator, lowercase, removeStopWords, maxLength, stopWords]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [slug]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert text into <strong>URL-friendly slugs</strong> for your blog posts, pages, and products.
          Creates SEO-optimized URLs by removing special characters and formatting properly.
          <strong> All processing happens in your browser</strong> — your content stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Text to Convert
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., How to Build a React App in 2024!"
            className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Separator</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value="">None</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Length</label>
            <input
              type="number"
              value={maxLength || ''}
              onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
              placeholder="No limit"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Lowercase</span>
            </label>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={removeStopWords}
                onChange={(e) => setRemoveStopWords(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remove stop words</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Generated Slug</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-lg text-gray-900 dark:text-white overflow-x-auto">
              {slug || <span className="text-gray-400">Enter text above...</span>}
            </div>
            <button
              onClick={handleCopy}
              disabled={!slug}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
          {slug && <div className="mt-2 text-sm text-gray-500">{slug.length} characters</div>}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">SEO Slug Best Practices</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Keep slugs <strong>short and descriptive</strong> (50-60 chars max)</li>
          <li>• Use hyphens to separate words (Google&apos;s recommendation)</li>
          <li>• Include your <strong>target keyword</strong> in the slug</li>
          <li>• Avoid dates unless content is time-sensitive</li>
          <li>• Remove unnecessary stop words (a, the, and, etc.)</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Examples</h2>
        <div className="space-y-2 font-mono text-sm">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="text-gray-500">Input:</span> &quot;How to Build a React App in 2024!&quot;<br />
            <span className="text-gray-500">Output:</span> <span className="text-teal-600">how-to-build-a-react-app-in-2024</span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span className="text-gray-500">Input:</span> &quot;The Ultimate Guide to SEO&quot;<br />
            <span className="text-gray-500">Output (no stop words):</span> <span className="text-teal-600">ultimate-guide-seo</span>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
