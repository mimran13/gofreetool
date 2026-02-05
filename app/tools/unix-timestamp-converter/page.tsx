'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// HELPERS
// ============================================================================

function formatDate(date: Date, format: string): string {
  const pad = (n: number, len = 2) => String(n).padStart(len, '0');

  switch (format) {
    case 'iso':
      return date.toISOString();
    case 'utc':
      return date.toUTCString();
    case 'locale':
      return date.toLocaleString();
    case 'date-only':
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    case 'time-only':
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    case 'full':
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    case 'rfc2822':
      return date.toUTCString().replace('GMT', '+0000');
    default:
      return date.toISOString();
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absMs = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const seconds = Math.floor(absMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  let text: string;
  if (seconds < 60) text = `${seconds} second${seconds !== 1 ? 's' : ''}`;
  else if (minutes < 60) text = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  else if (hours < 24) text = `${hours} hour${hours !== 1 ? 's' : ''}`;
  else if (days < 30) text = `${days} day${days !== 1 ? 's' : ''}`;
  else if (months < 12) text = `${months} month${months !== 1 ? 's' : ''}`;
  else text = `${years} year${years !== 1 ? 's' : ''}`;

  return isFuture ? `${text} from now` : `${text} ago`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'timestamp-to-date' | 'date-to-timestamp';

export default function UnixTimestampConverter() {
  const tool = getToolBySlug('unix-timestamp-converter');

  // State
  const [mode, setMode] = useState<Mode>('timestamp-to-date');
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [result, setResult] = useState<{ date: Date; timestamp: number } | null>(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');

  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert timestamp to date
  const convertTimestampToDate = useCallback((input: string) => {
    if (!input.trim()) {
      setResult(null);
      setError('');
      return;
    }

    const num = Number(input.trim());
    if (isNaN(num)) {
      setError('Please enter a valid number');
      setResult(null);
      return;
    }

    // Determine if seconds or milliseconds
    const ms = unit === 'milliseconds' ? num : num * 1000;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setError('Invalid timestamp — resulting date is out of range');
      setResult(null);
      return;
    }

    setResult({ date, timestamp: unit === 'seconds' ? num : Math.floor(num / 1000) });
    setError('');
  }, [unit]);

  // Convert date to timestamp
  const convertDateToTimestamp = useCallback((dateStr: string, timeStr: string) => {
    if (!dateStr) {
      setResult(null);
      setError('');
      return;
    }

    const fullStr = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00:00`;
    const date = new Date(fullStr);

    if (isNaN(date.getTime())) {
      setError('Invalid date or time');
      setResult(null);
      return;
    }

    const timestamp = Math.floor(date.getTime() / 1000);
    setResult({ date, timestamp });
    setError('');
  }, []);

  // Handle mode switch
  const handleModeSwitch = useCallback((newMode: Mode) => {
    setMode(newMode);
    setResult(null);
    setError('');
  }, []);

  // Handle copy
  const handleCopy = useCallback(async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(''), 2000);
    }
  }, []);

  // Use current timestamp
  const useNow = useCallback(() => {
    if (mode === 'timestamp-to-date') {
      const now = Math.floor(Date.now() / 1000);
      const val = unit === 'milliseconds' ? String(Date.now()) : String(now);
      setTimestampInput(val);
      convertTimestampToDate(val);
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const d = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const t = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setDateInput(d);
      setTimeInput(t);
      convertDateToTimestamp(d, t);
    }
  }, [mode, unit, convertTimestampToDate, convertDateToTimestamp]);

  // Date format outputs
  const formats = [
    { key: 'iso', label: 'ISO 8601' },
    { key: 'utc', label: 'UTC String' },
    { key: 'full', label: 'YYYY-MM-DD HH:mm:ss' },
    { key: 'date-only', label: 'Date Only' },
    { key: 'time-only', label: 'Time Only' },
    { key: 'rfc2822', label: 'RFC 2822' },
    { key: 'locale', label: 'Local Format' },
  ];

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
          Convert <strong>Unix timestamps</strong> to human-readable dates and vice versa. Unix
          timestamps (also called Epoch time or POSIX time) represent the number of seconds since
          January 1, 1970 (UTC). This tool supports both seconds and milliseconds, multiple output
          formats, and shows relative time. All processing is client-side.
        </p>
      </section>

      {/* Current Timestamp Banner */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Current Unix Timestamp:</span>
          <span className="ml-2 font-mono font-bold text-xl text-teal-600 dark:text-teal-400">
            {currentTimestamp}
          </span>
        </div>
        <button
          onClick={() => handleCopy(String(currentTimestamp), 'current')}
          className="px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
        >
          {copySuccess === 'current' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('timestamp-to-date')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'timestamp-to-date'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Timestamp → Date
            </button>
            <button
              onClick={() => handleModeSwitch('date-to-timestamp')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'date-to-timestamp'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Date → Timestamp
            </button>
          </div>
        </div>

        {/* Input */}
        {mode === 'timestamp-to-date' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
              <label htmlFor="timestamp-input" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Unix Timestamp
              </label>
              <div className="flex gap-2">
                {(['seconds', 'milliseconds'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setUnit(u);
                      if (timestampInput) {
                        // Re-convert with new unit
                        setTimeout(() => convertTimestampToDate(timestampInput), 0);
                      }
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      unit === u
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <input
                id="timestamp-input"
                type="text"
                value={timestampInput}
                onChange={(e) => {
                  setTimestampInput(e.target.value);
                  convertTimestampToDate(e.target.value);
                }}
                placeholder={unit === 'seconds' ? '1704067200' : '1704067200000'}
                className="flex-1 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                onClick={useNow}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Now
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Date & Time
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => {
                  setDateInput(e.target.value);
                  convertDateToTimestamp(e.target.value, timeInput);
                }}
                className="px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <input
                type="time"
                step="1"
                value={timeInput}
                onChange={(e) => {
                  setTimeInput(e.target.value);
                  convertDateToTimestamp(dateInput, e.target.value);
                }}
                className="px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={useNow}
              className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Use Current Date & Time
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              {/* Relative time */}
              <div className="text-center mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getRelativeTime(result.date)}
                </span>
              </div>

              {/* Timestamp result (in date-to-timestamp mode) */}
              {mode === 'date-to-timestamp' && (
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unix Timestamp (seconds)</span>
                    <button
                      onClick={() => handleCopy(String(result.timestamp), 'ts-sec')}
                      className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      {copySuccess === 'ts-sec' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{result.timestamp}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unix Timestamp (milliseconds)</span>
                    <button
                      onClick={() => handleCopy(String(result.timestamp * 1000), 'ts-ms')}
                      className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400"
                    >
                      {copySuccess === 'ts-ms' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{result.timestamp * 1000}</p>
                </div>
              )}

              {/* Date formats */}
              <div className="space-y-2">
                {formats.map(({ key, label }) => {
                  const value = formatDate(result.date, key);
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">{label}</span>
                        <span className="font-mono text-sm text-gray-900 dark:text-white break-all">{value}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(value, key)}
                        className="ml-3 px-3 py-1 text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded transition-colors flex-shrink-0"
                      >
                        {copySuccess === key ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
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
              All conversions happen directly in your browser using JavaScript&apos;s built-in{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">Date</code> API.
              No data is sent to any server. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Unix Timestamp Converter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Choose conversion direction</strong> — select &quot;Timestamp → Date&quot; to
            convert a Unix timestamp to a readable date, or &quot;Date → Timestamp&quot; to get a
            timestamp from a date.
          </li>
          <li>
            <strong>Enter your value</strong> — type a Unix timestamp (seconds or milliseconds), or
            pick a date and time using the date/time pickers.
          </li>
          <li>
            <strong>View results</strong> — see the conversion in multiple formats including ISO 8601,
            UTC, RFC 2822, and local time, plus relative time (e.g., &quot;3 days ago&quot;).
          </li>
          <li>
            <strong>Copy any format</strong> — click &quot;Copy&quot; next to any result row to copy
            it to your clipboard.
          </li>
        </ol>
      </section>

      {/* What is Unix Timestamp */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is a Unix Timestamp?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            A <strong>Unix timestamp</strong> (also called Epoch time, POSIX time, or Unix Epoch) is a
            system for tracking time as a running total of seconds. It counts the number of seconds
            that have elapsed since <strong>January 1, 1970, 00:00:00 UTC</strong> (the Unix Epoch).
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 mb-2">
              <strong>Examples:</strong>
            </p>
            <p className="font-mono text-sm">
              <span className="text-teal-600 dark:text-teal-400">0</span> = January 1, 1970 00:00:00 UTC
            </p>
            <p className="font-mono text-sm">
              <span className="text-teal-600 dark:text-teal-400">1000000000</span> = September 9, 2001 01:46:40 UTC
            </p>
            <p className="font-mono text-sm">
              <span className="text-teal-600 dark:text-teal-400">1704067200</span> = January 1, 2024 00:00:00 UTC
            </p>
          </div>
          <p className="text-gray-700 dark:text-gray-300">
            Unix timestamps are used extensively in programming, databases, APIs, and system logs
            because they are timezone-independent and easy to store and compare as simple integers.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '💻', title: 'API Development', desc: 'Parse and debug timestamps in API responses and requests' },
            { icon: '🗄️', title: 'Database Queries', desc: 'Convert stored timestamps to readable dates for analysis' },
            { icon: '📊', title: 'Log Analysis', desc: 'Translate timestamps in server logs and error reports' },
            { icon: '🔍', title: 'Debugging', desc: 'Verify timestamp values during development and testing' },
            { icon: '📅', title: 'Date Math', desc: 'Calculate time differences using simple integer arithmetic' },
            { icon: '🌐', title: 'Timezone Handling', desc: 'Work with UTC-based timestamps to avoid timezone issues' },
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
          Working with dates? Try our{' '}
          <Link href="/tools/date-difference-calculator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Date Difference Calculator
          </Link>{' '}
          to find the days between two dates, or our{' '}
          <Link href="/tools/age-calculator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Age Calculator
          </Link>{' '}
          for exact age in years, months, and days. For parsing cron schedules, use our{' '}
          <Link href="/tools/cron-expression-parser" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Cron Expression Parser
          </Link>.
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
              What is the Unix Epoch?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              The Unix Epoch is <strong>January 1, 1970, 00:00:00 UTC</strong>. It serves as the
              reference point from which Unix time is measured. All Unix timestamps are the number
              of seconds (or milliseconds) that have elapsed since this moment. Dates before the
              Epoch are represented as negative timestamps.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Seconds vs. milliseconds — which should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Unix timestamps in <strong>seconds</strong> (10 digits, e.g., 1704067200) are the
              traditional format used in C, Python, PHP, and most Unix tools. JavaScript&apos;s{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">Date.now()</code> returns
              <strong> milliseconds</strong> (13 digits, e.g., 1704067200000). Java and .NET also
              commonly use milliseconds. Use whichever your system expects.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is the Year 2038 problem?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Systems using a <strong>32-bit signed integer</strong> for Unix timestamps will overflow
              on <strong>January 19, 2038, 03:14:07 UTC</strong> (timestamp 2,147,483,647). After
              this, the value wraps to a negative number, causing errors. Most modern systems now
              use 64-bit integers, which can handle timestamps far into the future.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Do Unix timestamps account for leap seconds?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No, Unix timestamps do <strong>not</strong> account for leap seconds. Each day is
              treated as exactly 86,400 seconds. When a leap second is inserted, Unix time either
              repeats a second or is adjusted by the system. This means Unix time differs slightly
              from UTC, but the difference is minimal (less than 30 seconds accumulated since 1972).
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
