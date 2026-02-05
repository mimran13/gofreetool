'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// UUID GENERATION HELPER
// ============================================================================

/**
 * Generate a cryptographically secure UUID v4
 * Uses crypto.getRandomValues for security (not Math.random)
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * Where x is any hex digit and y is one of 8, 9, a, or b
 */
function generateUUIDv4(): string {
  // Get 16 random bytes
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // Set version (4) in byte 6: clear top 4 bits, set to 0100
  bytes[6] = (bytes[6] & 0x0f) | 0x40;

  // Set variant (RFC 4122) in byte 8: clear top 2 bits, set to 10
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Convert to hex string with proper formatting
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

  // Format as UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generate multiple UUIDs
 */
function generateMultipleUUIDs(count: number): string[] {
  return Array.from({ length: count }, () => generateUUIDv4());
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UUIDGenerator() {
  // Get tool metadata
  const tool = getToolBySlug('uuid-generator');

  // State
  const [count, setCount] = useState<number>(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Generate UUIDs
  const handleGenerate = useCallback(() => {
    const newUuids = generateMultipleUUIDs(count);
    setUuids(newUuids);
  }, [count]);

  // Clear all UUIDs
  const handleClear = useCallback(() => {
    setUuids([]);
  }, []);

  // Copy single UUID to clipboard
  const handleCopySingle = useCallback(async (uuid: string, index: number) => {
    try {
      await navigator.clipboard.writeText(uuid);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = uuid;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  }, []);

  // Copy all UUIDs to clipboard
  const handleCopyAll = useCallback(async () => {
    if (uuids.length === 0) return;

    const allUuids = uuids.join('\n');
    try {
      await navigator.clipboard.writeText(allUuids);
      setCopyAllSuccess(true);
      setTimeout(() => setCopyAllSuccess(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = allUuids;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyAllSuccess(true);
      setTimeout(() => setCopyAllSuccess(false), 2000);
    }
  }, [uuids]);

  // Handle count change with validation
  const handleCountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      setCount(value);
    } else if (e.target.value === '') {
      setCount(1);
    }
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          A <strong>UUID (Universally Unique Identifier)</strong> is a 128-bit identifier used to
          uniquely identify information in computer systems. Our free <strong>UUID v4 Generator</strong>
          creates cryptographically secure random identifiers perfect for database primary keys, API
          tokens, session IDs, file names, and distributed systems. UUID v4 uses random numbers,
          making collisions virtually impossible (1 in 2<sup>122</sup> chance). This tool generates
          UUIDs entirely in your browser using the secure <code>crypto.getRandomValues()</code> API,
          ensuring your identifiers are never sent to any server. Generate single or bulk UUIDs
          instantly with no signup required.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Count selector */}
          <div className="flex items-center gap-3">
            <label
              htmlFor="uuid-count"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap"
            >
              How many?
            </label>
            <input
              id="uuid-count"
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={handleCountChange}
              className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">(1-50)</span>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            className="flex-1 sm:flex-none px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Generate UUID{count > 1 ? 's' : ''}
          </button>

          {/* Clear button */}
          <button
            onClick={handleClear}
            disabled={uuids.length === 0}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Quick generate buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Quick:</span>
          {[1, 5, 10, 25, 50].map((n) => (
            <button
              key={n}
              onClick={() => {
                setCount(n);
                setUuids(generateMultipleUUIDs(n));
              }}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
            >
              {n} UUID{n > 1 ? 's' : ''}
            </button>
          ))}
        </div>

        {/* Output area */}
        {uuids.length > 0 ? (
          <div>
            {/* Copy all button */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Generated {uuids.length} UUID{uuids.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={handleCopyAll}
                className="px-4 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-medium rounded transition-colors"
              >
                {copyAllSuccess ? 'Copied All!' : 'Copy All'}
              </button>
            </div>

            {/* UUID list */}
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={`${uuid}-${index}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  {/* UUID display */}
                  <code className="font-mono text-sm text-gray-800 dark:text-gray-200 select-all">
                    {uuid}
                  </code>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopySingle(uuid, index)}
                    className="ml-4 px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all"
                    aria-label={`Copy UUID ${index + 1}`}
                  >
                    {copiedIndex === index ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Click &quot;Generate UUID&quot; to create unique identifiers
            </p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Secure & Private Generation</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All UUIDs are generated directly in your browser using the cryptographically secure
              <code className="mx-1 px-1 bg-green-100 dark:bg-green-900/50 rounded">crypto.getRandomValues()</code>
              API. No data is ever sent to any server. Your UUIDs are truly private and secure.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the UUID Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select the quantity</strong> of UUIDs you need using the input field (1-50) or
            click a quick-select button.
          </li>
          <li>
            <strong>Click &quot;Generate UUID&quot;</strong> to instantly create your unique identifiers.
          </li>
          <li>
            <strong>Copy individual UUIDs</strong> by hovering over any UUID and clicking the
            &quot;Copy&quot; button that appears.
          </li>
          <li>
            <strong>Copy all UUIDs at once</strong> using the &quot;Copy All&quot; button to get all
            identifiers separated by newlines.
          </li>
          <li>
            <strong>Regenerate anytime</strong> by clicking the generate button again for fresh UUIDs,
            or use &quot;Clear&quot; to reset.
          </li>
        </ol>
      </section>

      {/* UUID v4 Explanation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is UUID v4?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            UUID v4 is one of five UUID versions defined in RFC 4122. Unlike versions 1, 3, and 5
            which use timestamps, MAC addresses, or hashing, <strong>UUID v4 is purely random</strong>.
            This makes it ideal for scenarios where uniqueness matters but traceability doesn&apos;t.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 mb-2">
              Example UUID v4: <strong>f47ac10b-58cc-<span className="text-teal-600">4</span>427-<span className="text-purple-600">a</span>520-6b7e24f77c9d</strong>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              The <span className="text-teal-600 font-semibold">4</span> indicates version 4.
              The <span className="text-purple-600 font-semibold">a</span> (8, 9, a, or b) indicates the variant.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🗄️', title: 'Database Primary Keys', desc: 'Unique identifiers for records in SQL and NoSQL databases' },
            { icon: '🔗', title: 'API Request IDs', desc: 'Track requests across microservices and distributed systems' },
            { icon: '🎫', title: 'Session & Token IDs', desc: 'Secure, unguessable session identifiers and auth tokens' },
            { icon: '📁', title: 'File & Asset Names', desc: 'Unique names for uploads, preventing collisions and overwrites' },
            { icon: '📊', title: 'Analytics Events', desc: 'Track unique events, conversions, and user interactions' },
            { icon: '🔄', title: 'Idempotency Keys', desc: 'Prevent duplicate processing in payment and order systems' },
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
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Developer Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Working with APIs or configuration files? Check out our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter & Viewer
          </Link>{' '}
          to validate and pretty-print your JSON data with syntax highlighting.
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
              What is a UUID and why should I use one?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A UUID (Universally Unique Identifier) is a 128-bit identifier that is guaranteed to be
              unique across all devices and time. UUIDs are used when you need identifiers that won&apos;t
              collide, even when generated by different systems without coordination. They&apos;re essential
              for distributed databases, microservices, offline-first apps, and any system where
              centralized ID generation isn&apos;t practical.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How random is UUID v4? Can there be collisions?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              UUID v4 has 122 random bits (6 bits are fixed for version and variant). This means there
              are 2<sup>122</sup> (about 5.3 × 10<sup>36</sup>) possible UUIDs. To have a 50% chance
              of a collision, you&apos;d need to generate about 2.71 × 10<sup>18</sup> UUIDs. For practical
              purposes, UUID v4 collisions are virtually impossible—you&apos;re more likely to be struck
              by a meteorite while holding a winning lottery ticket.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What&apos;s the difference between UUID and GUID?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              UUID (Universally Unique Identifier) and GUID (Globally Unique Identifier) are essentially
              the same thing. UUID is the term used in RFC 4122 and most open-source/Unix contexts,
              while GUID is Microsoft&apos;s term used in Windows and .NET. They follow the same format
              and can be used interchangeably.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is crypto.getRandomValues() better than Math.random()?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, significantly. <code>Math.random()</code> uses a pseudo-random number generator (PRNG)
              that can be predictable and isn&apos;t suitable for security-sensitive applications.
              <code>crypto.getRandomValues()</code> uses the operating system&apos;s cryptographic random
              number generator, providing true randomness suitable for cryptographic operations, secure
              tokens, and UUIDs. This tool exclusively uses <code>crypto.getRandomValues()</code>.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I use UUIDs as database primary keys?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, UUIDs are commonly used as database primary keys, especially in distributed systems.
              Benefits include no coordination needed between servers, ability to generate IDs client-side,
              and no information leakage about record count. However, be aware that UUID v4&apos;s randomness
              can cause index fragmentation in some databases. Consider UUID v7 (time-ordered) or
              ULID for better index performance if this is a concern.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
