'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// DIFF ALGORITHM (Myers-like LCS-based line diff)
// ============================================================================

type DiffLine = {
  type: 'equal' | 'added' | 'removed';
  value: string;
  leftNum?: number;
  rightNum?: number;
};

function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');

  // LCS table
  const m = linesA.length;
  const n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ type: 'equal', value: linesA[i - 1], leftNum: i, rightNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', value: linesB[j - 1], rightNum: j });
      j--;
    } else {
      result.unshift({ type: 'removed', value: linesA[i - 1], leftNum: i });
      i--;
    }
  }

  return result;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TextDiffChecker() {
  const tool = getToolBySlug('text-diff-checker');

  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);

  // Compute diff
  const diff = useMemo(() => {
    let a = textA;
    let b = textB;

    if (ignoreCase) {
      a = a.toLowerCase();
      b = b.toLowerCase();
    }
    if (ignoreWhitespace) {
      a = a.replace(/[ \t]+/g, ' ').replace(/ +$/gm, '');
      b = b.replace(/[ \t]+/g, ' ').replace(/ +$/gm, '');
    }

    return computeDiff(a, b);
  }, [textA, textB, ignoreWhitespace, ignoreCase]);

  // Stats
  const stats = useMemo(() => {
    const added = diff.filter((l) => l.type === 'added').length;
    const removed = diff.filter((l) => l.type === 'removed').length;
    const equal = diff.filter((l) => l.type === 'equal').length;
    return { added, removed, equal, total: diff.length };
  }, [diff]);

  const handleClear = useCallback(() => {
    setTextA('');
    setTextB('');
  }, []);

  const handleSwap = useCallback(() => {
    setTextA(textB);
    setTextB(textA);
  }, [textA, textB]);

  // Sample
  const loadSample = useCallback(() => {
    setTextA(`function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const result = greet("World");
console.log(result);`);
    setTextB(`function greet(name, greeting = "Hello") {
  console.log(greeting + ", " + name + "!");
  return true;
}

const message = greet("World", "Hi");
console.log(message);
// Added a comment`);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (tool.faq || []).map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Compare two blocks of text and see the differences highlighted line by line. Our free
          <strong> text diff checker</strong> shows additions, deletions, and unchanged lines in a
          clear, color-coded view. Supports case-insensitive and whitespace-ignoring comparison.
          All processing happens in your browser.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            Ignore whitespace
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={ignoreCase}
              onChange={(e) => setIgnoreCase(e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            Ignore case
          </label>
        </div>

        {/* Input Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left (Original) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="text-a" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Original Text
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {textA.split('\n').length} lines
              </span>
            </div>
            <textarea
              id="text-a"
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Paste original text here..."
              className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>

          {/* Right (Modified) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="text-b" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Modified Text
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {textB.split('\n').length} lines
              </span>
            </div>
            <textarea
              id="text-b"
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Paste modified text here..."
              className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <button
            onClick={loadSample}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={handleSwap}
            disabled={!textA && !textB}
            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Swap Texts
          </button>
          <button
            onClick={handleClear}
            disabled={!textA && !textB}
            className="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Stats */}
        {(textA || textB) && (
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-green-600 dark:text-green-400">+{stats.added}</span> added
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-red-600 dark:text-red-400">-{stats.removed}</span> removed
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{stats.equal}</span> unchanged
            </span>
          </div>
        )}

        {/* Diff Output */}
        {(textA || textB) && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-auto">
              <table className="w-full text-sm font-mono">
                <tbody>
                  {diff.map((line, idx) => (
                    <tr
                      key={idx}
                      className={
                        line.type === 'added'
                          ? 'bg-green-50 dark:bg-green-900/20'
                          : line.type === 'removed'
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : ''
                      }
                    >
                      {/* Left line number */}
                      <td className="w-12 px-2 py-0.5 text-right text-xs text-gray-400 dark:text-gray-500 select-none border-r border-gray-200 dark:border-gray-700">
                        {line.leftNum || ''}
                      </td>
                      {/* Right line number */}
                      <td className="w-12 px-2 py-0.5 text-right text-xs text-gray-400 dark:text-gray-500 select-none border-r border-gray-200 dark:border-gray-700">
                        {line.rightNum || ''}
                      </td>
                      {/* Indicator */}
                      <td className={`w-6 px-1 py-0.5 text-center select-none font-bold ${
                        line.type === 'added'
                          ? 'text-green-600 dark:text-green-400'
                          : line.type === 'removed'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}>
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </td>
                      {/* Content */}
                      <td className={`px-3 py-0.5 whitespace-pre-wrap break-all ${
                        line.type === 'added'
                          ? 'text-green-800 dark:text-green-300'
                          : line.type === 'removed'
                          ? 'text-red-800 dark:text-red-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {line.value || '\u00A0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!textA && !textB && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <p className="text-lg">Paste text in both boxes to see the diff</p>
            <p className="text-sm mt-1">or click &quot;Load Sample&quot; to try it out</p>
          </div>
        )}

        {textA && textB && stats.added === 0 && stats.removed === 0 && (
          <div className="text-center py-4 mt-4">
            <p className="text-green-600 dark:text-green-400 font-semibold">
              No differences found — the texts are identical.
            </p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All text comparison happens directly in your browser using a JavaScript diff algorithm.
              No data is sent to any server. Safe for comparing sensitive code, documents, and
              configuration files.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Text Diff Checker
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Paste the original text</strong> in the left textarea.
          </li>
          <li>
            <strong>Paste the modified text</strong> in the right textarea.
          </li>
          <li>
            <strong>View the diff</strong> — additions are shown in green (+), deletions in red (-),
            and unchanged lines have no highlight.
          </li>
          <li>
            <strong>Use options</strong> — toggle &quot;Ignore whitespace&quot; or &quot;Ignore
            case&quot; to customize comparison behavior.
          </li>
          <li>
            <strong>Review stats</strong> — the summary shows how many lines were added, removed,
            and unchanged.
          </li>
        </ol>
      </section>

      {/* Common Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '💻', title: 'Code Review', desc: 'Compare two versions of source code to see what changed' },
            { icon: '📄', title: 'Document Comparison', desc: 'Find differences between document drafts or versions' },
            { icon: '⚙️', title: 'Config Files', desc: 'Compare configuration files to spot changes in settings' },
            { icon: '🔍', title: 'Debug Output', desc: 'Compare expected vs actual output in test debugging' },
            { icon: '📝', title: 'Content Editing', desc: 'Track changes in articles, blog posts, or documentation' },
            { icon: '🗄️', title: 'Data Verification', desc: 'Compare data exports to verify consistency' },
          ].map((useCase) => (
            <div key={useCase.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{useCase.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{useCase.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{useCase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Working with text? Try our{' '}
          <Link href="/tools/word-counter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Word Counter
          </Link>{' '}
          for character and word statistics, our{' '}
          <Link href="/tools/remove-extra-spaces" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Remove Extra Spaces
          </Link>{' '}
          to clean up text, or our{' '}
          <Link href="/tools/duplicate-line-remover" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Duplicate Line Remover
          </Link>{' '}
          to find and remove repeated lines.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What diff algorithm does this tool use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool uses a Longest Common Subsequence (LCS) based diff algorithm, similar to
              what Git and other version control systems use. It finds the optimal set of changes
              (additions and deletions) needed to transform the original text into the modified text.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What does &quot;Ignore whitespace&quot; do?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              When enabled, consecutive spaces and tabs are collapsed to a single space, and trailing
              whitespace on each line is removed before comparison. This is useful for comparing code
              with different indentation styles or text from different editors.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I compare large files?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool works well for text up to several thousand lines. Very large files (tens of
              thousands of lines) may be slow in the browser since the diff algorithm runs in O(n*m)
              time. For large files, consider using a command-line tool like{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">diff</code> or your
              IDE&apos;s built-in diff viewer.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data safe?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes. All comparison happens entirely in your browser. Your text is never sent to any
              server or stored anywhere. You can verify this by disconnecting from the internet — the
              tool will continue to work normally.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
