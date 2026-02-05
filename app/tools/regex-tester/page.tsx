'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// TYPES
// ============================================================================

interface MatchGroup {
  index: number;
  text: string;
  groups: { [key: string]: string | undefined } | undefined;
  start: number;
  end: number;
}

interface RegexResult {
  success: boolean;
  matches: MatchGroup[];
  error?: string;
  totalMatches: number;
}

// ============================================================================
// REGEX HELPERS
// ============================================================================

function testRegex(pattern: string, flags: string, text: string): RegexResult {
  if (!pattern) {
    return { success: true, matches: [], totalMatches: 0 };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: MatchGroup[] = [];

    if (flags.includes('g')) {
      let match: RegExpExecArray | null;
      let iterations = 0;
      const maxIterations = 10000; // Prevent infinite loops

      while ((match = regex.exec(text)) !== null && iterations < maxIterations) {
        matches.push({
          index: matches.length,
          text: match[0],
          groups: match.groups,
          start: match.index,
          end: match.index + match[0].length,
        });

        // Prevent infinite loop for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
        iterations++;
      }
    } else {
      const match = regex.exec(text);
      if (match) {
        matches.push({
          index: 0,
          text: match[0],
          groups: match.groups,
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }

    return { success: true, matches, totalMatches: matches.length };
  } catch (e) {
    return {
      success: false,
      matches: [],
      totalMatches: 0,
      error: e instanceof Error ? e.message : 'Invalid regular expression',
    };
  }
}

// ============================================================================
// HIGHLIGHTED TEXT COMPONENT
// ============================================================================

interface HighlightedTextProps {
  text: string;
  matches: MatchGroup[];
}

function HighlightedText({ text, matches }: HighlightedTextProps) {
  if (!text) {
    return (
      <span className="text-gray-400 dark:text-gray-500">
        Enter test text to see matches...
      </span>
    );
  }

  if (matches.length === 0) {
    return <span className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{text}</span>;
  }

  // Sort matches by start position
  const sortedMatches = [...matches].sort((a, b) => a.start - b.start);

  const elements: JSX.Element[] = [];
  let lastEnd = 0;

  sortedMatches.forEach((match, idx) => {
    // Add text before this match
    if (match.start > lastEnd) {
      elements.push(
        <span key={`text-${idx}`} className="text-gray-700 dark:text-gray-300">
          {text.slice(lastEnd, match.start)}
        </span>
      );
    }

    // Add the match (highlighted)
    elements.push(
      <mark
        key={`match-${idx}`}
        className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white px-0.5 rounded"
        title={`Match ${idx + 1}: "${match.text}"`}
      >
        {match.text}
      </mark>
    );

    lastEnd = match.end;
  });

  // Add remaining text after last match
  if (lastEnd < text.length) {
    elements.push(
      <span key="text-end" className="text-gray-700 dark:text-gray-300">
        {text.slice(lastEnd)}
      </span>
    );
  }

  return <span className="whitespace-pre-wrap">{elements}</span>;
}

// ============================================================================
// MATCHES TABLE COMPONENT
// ============================================================================

interface MatchesTableProps {
  matches: MatchGroup[];
}

function MatchesTable({ matches }: MatchesTableProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  }, []);

  if (matches.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Matches ({matches.length})
      </h3>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl max-h-[300px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-16">
                #
              </th>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Match
              </th>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 w-24">
                Index
              </th>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Groups
              </th>
              <th className="w-16 p-3 border-b border-gray-200 dark:border-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {matches.map((match, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-3 text-gray-500 dark:text-gray-400">
                  {idx + 1}
                </td>
                <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-200">
                  <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded">
                    {match.text || '(empty)'}
                  </code>
                </td>
                <td className="p-3 text-gray-600 dark:text-gray-400 text-xs">
                  {match.start}-{match.end}
                </td>
                <td className="p-3 font-mono text-xs text-gray-600 dark:text-gray-400">
                  {match.groups && Object.keys(match.groups).length > 0 ? (
                    <div className="space-y-1">
                      {Object.entries(match.groups).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-purple-600 dark:text-purple-400">{key}</span>
                          <span className="text-gray-400">: </span>
                          <span className="text-green-600 dark:text-green-400">&quot;{value}&quot;</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopy(match.text, idx)}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                  >
                    {copiedIndex === idx ? '✓' : 'Copy'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// FLAG TOGGLE COMPONENT
// ============================================================================

interface FlagToggleProps {
  flag: string;
  label: string;
  description: string;
  enabled: boolean;
  onChange: (flag: string) => void;
}

function FlagToggle({ flag, label, description, enabled, onChange }: FlagToggleProps) {
  return (
    <button
      onClick={() => onChange(flag)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
        enabled
          ? 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      title={description}
    >
      <code className="font-mono font-bold">{flag}</code>
      <span className="text-xs">{label}</span>
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function RegexTester() {
  const tool = getToolBySlug('regex-tester');

  // State
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState<Set<string>>(new Set(['g']));

  // Toggle a flag
  const toggleFlag = useCallback((flag: string) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) {
        next.delete(flag);
      } else {
        next.add(flag);
      }
      return next;
    });
  }, []);

  // Build flags string
  const flagsString = useMemo(() => {
    return Array.from(flags).sort().join('');
  }, [flags]);

  // Test regex
  const result = useMemo(() => {
    return testRegex(pattern, flagsString, testText);
  }, [pattern, flagsString, testText]);

  // Handle clear
  const handleClear = useCallback(() => {
    setPattern('');
    setTestText('');
  }, []);

  // Load sample
  const handleLoadSample = useCallback(() => {
    setPattern('(?<protocol>https?):\\/\\/(?<domain>[\\w.-]+)(?<path>\\/[\\w./-]*)?');
    setTestText(`Here are some URLs to test:
https://example.com/path/to/page
http://subdomain.example.org/api/v1/users
https://test.io
Visit http://localhost:3000/dashboard for local testing.
Invalid: ftp://files.example.com (won't match - wrong protocol)`);
    setFlags(new Set(['g', 'i']));
  }, []);

  // Copy regex
  const handleCopyRegex = useCallback(async () => {
    const regexString = `/${pattern}/${flagsString}`;
    try {
      await navigator.clipboard.writeText(regexString);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = regexString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [pattern, flagsString]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Test and debug <strong>regular expressions</strong> in real-time with our free regex tester.
          Enter a pattern and test string to see all matches highlighted instantly. View capture groups,
          match positions, and counts. Supports JavaScript regex flags including global (g), case-insensitive (i),
          multiline (m), and dotAll (s). <strong>100% client-side processing</strong> means your patterns
          and text never leave your browser.
        </p>
      </ToolContent>

      {/* Main Tool Interface */}
      <ToolInterface className="mb-8">
        {/* Pattern Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="regex-pattern"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Regular Expression
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadSample}
                className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
              >
                Load Sample
              </button>
              {pattern && (
                <button
                  onClick={handleCopyRegex}
                  className="text-xs text-gray-600 hover:text-gray-700 dark:text-gray-400 hover:underline"
                >
                  Copy Regex
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-2xl text-gray-400 dark:text-gray-500 font-mono">/</span>
            <input
              id="regex-pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern (e.g., \w+@\w+\.\w+)"
              className={`flex-1 px-4 py-3 font-mono text-base border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors ${
                pattern && !result.success
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />
            <span className="text-2xl text-gray-400 dark:text-gray-500 font-mono">/</span>
            <span className="text-lg text-teal-600 dark:text-teal-400 font-mono min-w-[3rem]">
              {flagsString || <span className="text-gray-300 dark:text-gray-600">flags</span>}
            </span>
          </div>

          {/* Error message */}
          {pattern && !result.success && (
            <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {result.error}
              </p>
            </div>
          )}
        </div>

        {/* Flags */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Flags
          </label>
          <div className="flex flex-wrap gap-2">
            <FlagToggle
              flag="g"
              label="Global"
              description="Find all matches, not just the first"
              enabled={flags.has('g')}
              onChange={toggleFlag}
            />
            <FlagToggle
              flag="i"
              label="Case Insensitive"
              description="Match regardless of case"
              enabled={flags.has('i')}
              onChange={toggleFlag}
            />
            <FlagToggle
              flag="m"
              label="Multiline"
              description="^ and $ match line starts/ends"
              enabled={flags.has('m')}
              onChange={toggleFlag}
            />
            <FlagToggle
              flag="s"
              label="DotAll"
              description="Dot matches newlines too"
              enabled={flags.has('s')}
              onChange={toggleFlag}
            />
            <FlagToggle
              flag="u"
              label="Unicode"
              description="Enable Unicode support"
              enabled={flags.has('u')}
              onChange={toggleFlag}
            />
          </div>
        </div>

        {/* Test Text and Results Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Test Text Input */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="test-text"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Test String
              </label>
              <button
                onClick={handleClear}
                disabled={!pattern && !testText}
                className="text-xs text-gray-600 hover:text-gray-700 dark:text-gray-400 hover:underline disabled:opacity-50"
              >
                Clear All
              </button>
            </div>

            <textarea
              id="test-text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test your regex against..."
              className="w-full h-[50vh] px-5 py-4 font-mono text-sm leading-relaxed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors"
              spellCheck={false}
            />
          </div>

          {/* Results Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Highlighted Matches
              </span>
              {result.success && result.totalMatches > 0 && (
                <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                  {result.totalMatches} match{result.totalMatches !== 1 ? 'es' : ''} found
                </span>
              )}
            </div>

            <div className="w-full h-[50vh] px-5 py-4 font-mono text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-auto">
              {result.success ? (
                <HighlightedText text={testText} matches={result.matches} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    Fix the regex error to see matches
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Matches Table */}
        {result.success && result.matches.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <MatchesTable matches={result.matches} />
          </div>
        )}
      </ToolInterface>

      {/* Privacy Notice */}
      <ToolContent className="mb-12">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All regex testing happens directly in your browser using JavaScript&apos;s native RegExp engine.
              Your patterns and text are never sent to any server. This tool works completely offline.
            </p>
          </div>
        </div>
        </div>
      </ToolContent>

      {/* How to Use Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Regex Tester
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter your regex pattern</strong> in the input field. Don&apos;t include the
            surrounding slashes - they&apos;re added automatically.
          </li>
          <li>
            <strong>Select flags</strong> to modify how the pattern matches. Enable &quot;g&quot; for
            finding all matches, &quot;i&quot; for case-insensitive matching, etc.
          </li>
          <li>
            <strong>Enter test text</strong> in the textarea below. Matches will be highlighted
            in real-time as you type.
          </li>
          <li>
            <strong>View match details</strong> in the table, including capture groups, positions,
            and the ability to copy individual matches.
          </li>
          <li>
            <strong>Use named groups</strong> like <code>(?&lt;name&gt;pattern)</code> to make
            your captures more readable.
          </li>
        </ol>
      </ToolContent>

      {/* Quick Reference Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Regex Quick Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { pattern: '.', desc: 'Any character except newline' },
            { pattern: '\\d', desc: 'Digit (0-9)' },
            { pattern: '\\w', desc: 'Word character (a-z, A-Z, 0-9, _)' },
            { pattern: '\\s', desc: 'Whitespace (space, tab, newline)' },
            { pattern: '^', desc: 'Start of string/line' },
            { pattern: '$', desc: 'End of string/line' },
            { pattern: '*', desc: 'Zero or more' },
            { pattern: '+', desc: 'One or more' },
            { pattern: '?', desc: 'Zero or one (optional)' },
            { pattern: '{n,m}', desc: 'Between n and m times' },
            { pattern: '[abc]', desc: 'Character class (a, b, or c)' },
            { pattern: '[^abc]', desc: 'Not a, b, or c' },
            { pattern: '(abc)', desc: 'Capture group' },
            { pattern: '(?:abc)', desc: 'Non-capturing group' },
            { pattern: 'a|b', desc: 'Alternation (a or b)' },
            { pattern: '\\b', desc: 'Word boundary' },
            { pattern: '(?=abc)', desc: 'Positive lookahead' },
            { pattern: '(?!abc)', desc: 'Negative lookahead' },
          ].map((item) => (
            <div key={item.pattern} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <code className="text-teal-600 dark:text-teal-400 font-mono text-sm font-bold whitespace-nowrap">
                {item.pattern}
              </code>
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</span>
            </div>
          ))}
        </div>
      </ToolContent>

      {/* Flags Reference */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Regex Flags Explained
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Flag</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Name</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono font-bold text-teal-600 dark:text-teal-400">g</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Global</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Find all matches rather than stopping after the first match</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono font-bold text-teal-600 dark:text-teal-400">i</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Case Insensitive</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Match uppercase and lowercase letters interchangeably</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono font-bold text-teal-600 dark:text-teal-400">m</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Multiline</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">^ and $ match the start/end of each line, not just the whole string</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono font-bold text-teal-600 dark:text-teal-400">s</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">DotAll</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Dot (.) matches newline characters as well</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono font-bold text-teal-600 dark:text-teal-400">u</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Unicode</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Enable full Unicode support (surrogate pairs, Unicode property escapes)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ToolContent>

      {/* Related Tools */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Working with JSON data? Try our{' '}
            <Link
              href="/tools/json-formatter-viewer"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON Formatter & Viewer
            </Link>
            . Need to parse URLs? Use our{' '}
            <Link
              href="/tools/url-parser"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              URL Parser
            </Link>{' '}
            to break down complex URLs and query strings.
          </p>
        </div>
      </ToolContent>

      {/* FAQ Section */}
      <ToolContent className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What regex flavor does this tool use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool uses JavaScript&apos;s built-in RegExp engine, which implements ECMAScript regular
              expressions. This is the same regex flavor used in browsers, Node.js, and many other
              JavaScript environments. Some features like lookbehind assertions are supported in modern
              browsers but may not work in older ones.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How do I match special characters literally?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Special regex characters like <code>. * + ? ^ $ {'{'} {'}'} [ ] \ | ( )</code> need to be
              escaped with a backslash to match them literally. For example, to match a period, use
              <code>\.</code> instead of <code>.</code>. To match a backslash itself, use <code>\\</code>.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What are capture groups and how do I use them?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Capture groups let you extract specific parts of a match. Use parentheses <code>(pattern)</code>
              to create a group. For named groups, use <code>(?&lt;name&gt;pattern)</code>. For example,
              the pattern <code>(?&lt;area&gt;\d{3})-(?&lt;number&gt;\d{4})</code> would capture the
              area code and number separately from a phone number like &quot;555-1234&quot;.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why doesn&apos;t my pattern find all matches?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Make sure you have the &quot;g&quot; (global) flag enabled. Without it, the regex engine
              stops after finding the first match. Also check if your pattern is too specific or if
              the &quot;i&quot; (case insensitive) flag should be enabled for matching different cases.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data safe when using this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, completely safe. This regex tester runs entirely in your browser using JavaScript.
              Your patterns and test text are never sent to any server. There&apos;s no backend processing,
              no logging, and no data storage. You can even disconnect from the internet and the tool
              will continue to work.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
