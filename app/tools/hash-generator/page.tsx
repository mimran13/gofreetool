'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// MD5 IMPLEMENTATION (Web Crypto doesn't support MD5)
// Lightweight pure JavaScript implementation
// ============================================================================

function md5(string: string): string {
  function rotateLeft(value: number, shift: number): number {
    return (value << shift) | (value >>> (32 - shift));
  }

  function addUnsigned(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function f(x: number, y: number, z: number): number {
    return (x & y) | (~x & z);
  }

  function g(x: number, y: number, z: number): number {
    return (x & z) | (y & ~z);
  }

  function h(x: number, y: number, z: number): number {
    return x ^ y ^ z;
  }

  function i(x: number, y: number, z: number): number {
    return y ^ (x | ~z);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string): number[] {
    const utf8 = unescape(encodeURIComponent(str));
    const len = utf8.length;
    const numWords = ((len + 8) >>> 6) + 1;
    const words: number[] = new Array(numWords * 16).fill(0);

    for (let i = 0; i < len; i++) {
      words[i >>> 2] |= utf8.charCodeAt(i) << ((i % 4) * 8);
    }

    words[len >>> 2] |= 0x80 << ((len % 4) * 8);
    words[numWords * 16 - 2] = len * 8;

    return words;
  }

  function wordToHex(value: number): string {
    let hex = '';
    for (let i = 0; i <= 3; i++) {
      const byte = (value >>> (i * 8)) & 255;
      hex += ('0' + byte.toString(16)).slice(-2);
    }
    return hex;
  }

  const x = convertToWordArray(string);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;

    a = ff(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = ff(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15], S14, 0x49b40821);

    a = gg(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = gg(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10], S22, 0x02441453);
    c = gg(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);

    a = hh(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = hh(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6], S34, 0x04881d05);
    a = hh(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2], S34, 0xc4ac5665);

    a = ii(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9], S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
}

// ============================================================================
// SHA HASH FUNCTIONS (using Web Crypto API)
// ============================================================================

/**
 * Generate SHA hash using Web Crypto API
 */
async function generateSHA(text: string, algorithm: 'SHA-1' | 'SHA-256'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// HASH RESULT COMPONENT
// ============================================================================

interface HashResultProps {
  label: string;
  algorithm: string;
  hash: string;
  bits: number;
  isLoading?: boolean;
  color: string;
}

function HashResult({ label, algorithm, hash, bits, isLoading, color }: HashResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = hash;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [hash]);

  return (
    <div className={`border rounded-lg p-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
            {bits}-bit
          </span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!hash || isLoading}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="font-mono text-sm break-all bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 min-h-[44px] flex items-center">
        {isLoading ? (
          <span className="text-gray-400 animate-pulse">Computing {algorithm}...</span>
        ) : hash ? (
          <span className="text-gray-800 dark:text-gray-200 select-all">{hash}</span>
        ) : (
          <span className="text-gray-400">Enter text above to generate hash</span>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
}

export default function HashGenerator() {
  // Get tool metadata
  const tool = getToolBySlug('hash-generator');

  // State
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Hashes>({ md5: '', sha1: '', sha256: '' });
  const [isComputing, setIsComputing] = useState(false);

  // Compute hashes when input changes (with debounce for large text)
  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '' });
      return;
    }

    // Debounce for performance with large text
    const timeoutId = setTimeout(async () => {
      setIsComputing(true);

      try {
        // Compute all hashes in parallel
        const [sha1Hash, sha256Hash] = await Promise.all([
          generateSHA(input, 'SHA-1'),
          generateSHA(input, 'SHA-256'),
        ]);

        // MD5 is synchronous
        const md5Hash = md5(input);

        setHashes({
          md5: md5Hash,
          sha1: sha1Hash,
          sha256: sha256Hash,
        });
      } catch (error) {
        console.error('Hash generation error:', error);
      } finally {
        setIsComputing(false);
      }
    }, 150); // 150ms debounce

    return () => clearTimeout(timeoutId);
  }, [input]);

  // Clear all
  const handleClear = useCallback(() => {
    setInput('');
    setHashes({ md5: '', sha1: '', sha256: '' });
  }, []);

  // Copy all hashes
  const handleCopyAll = useCallback(async () => {
    if (!hashes.md5) return;

    const allHashes = `MD5: ${hashes.md5}\nSHA-1: ${hashes.sha1}\nSHA-256: ${hashes.sha256}`;
    try {
      await navigator.clipboard.writeText(allHashes);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = allHashes;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }, [hashes]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          A <strong>hash function</strong> converts any input text into a fixed-length string of
          characters called a <strong>hash</strong> or <strong>digest</strong>. Our free
          <strong> Hash Generator</strong> creates MD5, SHA-1, and SHA-256 hashes instantly in your
          browser. Hashes are essential for verifying file integrity, creating checksums, storing
          passwords securely, digital signatures, and data deduplication. Each algorithm produces
          a unique fingerprint—even a tiny change in input creates a completely different hash.
          This tool uses the secure Web Crypto API for SHA algorithms, ensuring fast and reliable
          hash generation. All processing happens locally in your browser; your data is never
          transmitted to any server.
        </p>
      </section>

      {/* Important Disclaimer */}
      <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-amber-600 text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Important: Hashing ≠ Encryption</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Hashing is a <strong>one-way function</strong>—you cannot reverse a hash to get the original
              text. Unlike encryption, hashes cannot be decrypted. Use encryption when you need to recover
              the original data. MD5 and SHA-1 are considered weak for cryptographic purposes; use SHA-256
              or stronger for security-sensitive applications.
            </p>
          </div>
        </div>
      </div>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Input Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="hash-input"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Enter Text to Hash
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {input.length.toLocaleString()} characters
            </span>
          </div>
          <textarea
            id="hash-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter any text to generate its hash values..."
            className="w-full h-32 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            spellCheck={false}
          />

          {/* Action buttons */}
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleClear}
              disabled={!input}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleCopyAll}
              disabled={!hashes.md5}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Copy All Hashes
            </button>
          </div>
        </div>

        {/* Hash Results */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Generated Hashes
          </h3>

          <HashResult
            label="MD5"
            algorithm="MD5"
            hash={hashes.md5}
            bits={128}
            isLoading={isComputing}
            color="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10"
          />

          <HashResult
            label="SHA-1"
            algorithm="SHA-1"
            hash={hashes.sha1}
            bits={160}
            isLoading={isComputing}
            color="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10"
          />

          <HashResult
            label="SHA-256"
            algorithm="SHA-256"
            hash={hashes.sha256}
            bits={256}
            isLoading={isComputing}
            color="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
          />
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All hash calculations happen directly in your browser. Your text is never sent to any
              server, stored, or logged. SHA algorithms use the native Web Crypto API for optimal
              performance and security. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Hash Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter your text</strong> in the input field above. The tool accepts any characters
            including Unicode, emojis, and special symbols.
          </li>
          <li>
            <strong>View real-time hashes</strong> as you type. MD5, SHA-1, and SHA-256 hashes are
            computed automatically with each keystroke.
          </li>
          <li>
            <strong>Copy individual hashes</strong> by clicking the &quot;Copy&quot; button next to each
            algorithm&apos;s result.
          </li>
          <li>
            <strong>Copy all hashes at once</strong> using the &quot;Copy All Hashes&quot; button to get
            all three values in a formatted list.
          </li>
          <li>
            <strong>Clear and start fresh</strong> using the &quot;Clear&quot; button to reset the input
            and all hash outputs.
          </li>
        </ol>
      </section>

      {/* Algorithm Comparison */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Hash Algorithm Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Algorithm</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Output Size</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Security</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Best For</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-semibold">MD5</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">128-bit (32 hex)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">
                  <span className="text-red-600 dark:text-red-400">Weak</span>
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Checksums, non-security uses</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-semibold">SHA-1</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">160-bit (40 hex)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">
                  <span className="text-amber-600 dark:text-amber-400">Deprecated</span>
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Legacy systems, Git commits</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-semibold">SHA-256</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">256-bit (64 hex)</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">
                  <span className="text-green-600 dark:text-green-400">Strong</span>
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">Passwords, certificates, blockchain</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Developer Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need unique identifiers? Try our{' '}
          <Link
            href="/tools/uuid-generator"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            UUID Generator
          </Link>{' '}
          to create cryptographically secure UUIDs. Working with API responses? Use our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter & Viewer
          </Link>{' '}
          to validate and pretty-print JSON data.
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
              What is a hash function and how does it work?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A hash function is a mathematical algorithm that takes input data of any size and produces
              a fixed-size output called a hash, digest, or checksum. Key properties include: determinism
              (same input always produces same output), one-way operation (cannot reverse to get input),
              collision resistance (different inputs produce different outputs), and avalanche effect
              (small input changes cause large output changes). These properties make hashes ideal for
              integrity verification and password storage.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I decrypt or reverse a hash to get the original text?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No, hashing is a one-way function by design. Unlike encryption, which can be reversed with
              the correct key, hash functions are mathematically designed to be irreversible. The only
              way to &quot;crack&quot; a hash is through brute force (trying all possible inputs) or rainbow
              tables (precomputed hash databases). This is why strong, unique passwords and salting are
              important—they make brute force attacks impractical.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why is MD5 considered insecure?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              MD5 was designed in 1991 and has known vulnerabilities that allow collision attacks—creating
              two different inputs with the same hash. In 2004, researchers demonstrated practical collision
              attacks. MD5 is now deprecated for cryptographic purposes by NIST and major security standards.
              However, MD5 is still acceptable for non-security uses like checksums, cache keys, and
              deduplication where collision attacks aren&apos;t a concern.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Which hash algorithm should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              For security-sensitive applications (passwords, digital signatures, certificates), use
              <strong> SHA-256</strong> or stronger (SHA-384, SHA-512). For password hashing specifically,
              consider specialized algorithms like bcrypt, scrypt, or Argon2 which include salting and
              key stretching. For non-security purposes like file checksums or cache keys, MD5 or SHA-1
              are acceptable due to their speed. Git uses SHA-1 for commit hashes (though migrating to
              SHA-256).
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How can I verify file integrity using hashes?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              File integrity verification works by comparing hash values. The file provider publishes
              the expected hash (often SHA-256). After downloading, you compute the hash of your copy
              using the same algorithm. If the hashes match exactly, the file is identical to the original
              and wasn&apos;t corrupted or tampered with during transfer. This is commonly used for software
              downloads, ISO images, and important documents.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
