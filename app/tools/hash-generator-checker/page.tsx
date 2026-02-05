'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// MD5 IMPLEMENTATION (Web Crypto API doesn't support MD5)
// ============================================================================

function md5(input: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }

  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;

    for (let i = 0; i < x.length; i += 16) {
      const olda = a;
      const oldb = b;
      const oldc = c;
      const oldd = d;

      a = md5ff(a, b, c, d, x[i] || 0, 7, -680876936);
      d = md5ff(d, a, b, c, x[i + 1] || 0, 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2] || 0, 17, 606105819);
      b = md5ff(b, c, d, a, x[i + 3] || 0, 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4] || 0, 7, -176418897);
      d = md5ff(d, a, b, c, x[i + 5] || 0, 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6] || 0, 17, -1473231341);
      b = md5ff(b, c, d, a, x[i + 7] || 0, 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8] || 0, 7, 1770035416);
      d = md5ff(d, a, b, c, x[i + 9] || 0, 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10] || 0, 17, -42063);
      b = md5ff(b, c, d, a, x[i + 11] || 0, 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12] || 0, 7, 1804603682);
      d = md5ff(d, a, b, c, x[i + 13] || 0, 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14] || 0, 17, -1502002290);
      b = md5ff(b, c, d, a, x[i + 15] || 0, 22, 1236535329);

      a = md5gg(a, b, c, d, x[i + 1] || 0, 5, -165796510);
      d = md5gg(d, a, b, c, x[i + 6] || 0, 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11] || 0, 14, 643717713);
      b = md5gg(b, c, d, a, x[i] || 0, 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5] || 0, 5, -701558691);
      d = md5gg(d, a, b, c, x[i + 10] || 0, 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15] || 0, 14, -660478335);
      b = md5gg(b, c, d, a, x[i + 4] || 0, 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9] || 0, 5, 568446438);
      d = md5gg(d, a, b, c, x[i + 14] || 0, 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3] || 0, 14, -187363961);
      b = md5gg(b, c, d, a, x[i + 8] || 0, 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13] || 0, 5, -1444681467);
      d = md5gg(d, a, b, c, x[i + 2] || 0, 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7] || 0, 14, 1735328473);
      b = md5gg(b, c, d, a, x[i + 12] || 0, 20, -1926607734);

      a = md5hh(a, b, c, d, x[i + 5] || 0, 4, -378558);
      d = md5hh(d, a, b, c, x[i + 8] || 0, 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11] || 0, 16, 1839030562);
      b = md5hh(b, c, d, a, x[i + 14] || 0, 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1] || 0, 4, -1530992060);
      d = md5hh(d, a, b, c, x[i + 4] || 0, 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7] || 0, 16, -155497632);
      b = md5hh(b, c, d, a, x[i + 10] || 0, 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13] || 0, 4, 681279174);
      d = md5hh(d, a, b, c, x[i] || 0, 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3] || 0, 16, -722521979);
      b = md5hh(b, c, d, a, x[i + 6] || 0, 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9] || 0, 4, -640364487);
      d = md5hh(d, a, b, c, x[i + 12] || 0, 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15] || 0, 16, 530742520);
      b = md5hh(b, c, d, a, x[i + 2] || 0, 23, -995338651);

      a = md5ii(a, b, c, d, x[i] || 0, 6, -198630844);
      d = md5ii(d, a, b, c, x[i + 7] || 0, 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14] || 0, 15, -1416354905);
      b = md5ii(b, c, d, a, x[i + 5] || 0, 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12] || 0, 6, 1700485571);
      d = md5ii(d, a, b, c, x[i + 3] || 0, 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10] || 0, 15, -1051523);
      b = md5ii(b, c, d, a, x[i + 1] || 0, 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8] || 0, 6, 1873313359);
      d = md5ii(d, a, b, c, x[i + 15] || 0, 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6] || 0, 15, -1560198380);
      b = md5ii(b, c, d, a, x[i + 13] || 0, 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4] || 0, 6, -145523070);
      d = md5ii(d, a, b, c, x[i + 11] || 0, 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2] || 0, 15, 718787259);
      b = md5ii(b, c, d, a, x[i + 9] || 0, 21, -343485551);

      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }

  function rstrMD5(s: string): string {
    const x: number[] = [];
    for (let i = 0; i < s.length * 8; i += 8) {
      x[i >> 5] |= (s.charCodeAt(i / 8) & 0xff) << (i % 32);
    }
    const hash = binlMD5(x, s.length * 8);
    let result = '';
    for (let i = 0; i < hash.length * 32; i += 8) {
      result += String.fromCharCode((hash[i >> 5] >>> (i % 32)) & 0xff);
    }
    return result;
  }

  function rstr2hex(input: string): string {
    const hexTab = '0123456789abcdef';
    let output = '';
    for (let i = 0; i < input.length; i++) {
      const x = input.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output;
  }

  // Convert UTF-8 string to binary string
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  let binaryString = '';
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return rstr2hex(rstrMD5(binaryString));
}

// ============================================================================
// SHA HASH USING WEB CRYPTO API
// ============================================================================

async function sha(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// ALGORITHM DETECTION
// ============================================================================

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

const ALGORITHM_LENGTHS: Record<number, Algorithm> = {
  32: 'MD5',
  40: 'SHA-1',
  64: 'SHA-256',
  128: 'SHA-512',
};

function detectAlgorithm(hash: string): Algorithm | null {
  const cleaned = hash.trim().toLowerCase();
  if (!/^[0-9a-f]+$/.test(cleaned)) return null;
  return ALGORITHM_LENGTHS[cleaned.length] || null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'generate' | 'verify';

export default function HashGeneratorChecker() {
  const tool = getToolBySlug('hash-generator-checker');

  const [mode, setMode] = useState<Mode>('generate');
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [output, setOutput] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ match: boolean; algorithm: Algorithm | null; computed: string } | null>(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateHash = useCallback(async (text: string, algo: Algorithm) => {
    if (!text) {
      setOutput('');
      setError('');
      return;
    }

    setIsProcessing(true);
    try {
      let hash: string;
      if (algo === 'MD5') {
        hash = md5(text);
      } else {
        hash = await sha(algo, text);
      }
      setOutput(hash);
      setError('');
    } catch (e) {
      setError(`Hashing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setOutput('');
    }
    setIsProcessing(false);
  }, []);

  const verifyHash = useCallback(async (text: string, expected: string) => {
    if (!text || !expected) {
      setVerifyResult(null);
      setError('');
      return;
    }

    const detectedAlgo = detectAlgorithm(expected);
    if (!detectedAlgo) {
      setError('Could not detect hash algorithm. Ensure the hash is a valid hex string (32, 40, 64, or 128 characters).');
      setVerifyResult(null);
      return;
    }

    setIsProcessing(true);
    try {
      let computed: string;
      if (detectedAlgo === 'MD5') {
        computed = md5(text);
      } else {
        computed = await sha(detectedAlgo, text);
      }
      const match = computed.toLowerCase() === expected.trim().toLowerCase();
      setVerifyResult({ match, algorithm: detectedAlgo, computed });
      setError('');
    } catch (e) {
      setError(`Verification failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      setVerifyResult(null);
    }
    setIsProcessing(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setInput(text);
      if (mode === 'generate') {
        generateHash(text, algorithm);
      } else {
        verifyHash(text, expectedHash);
      }
    },
    [mode, algorithm, expectedHash, generateHash, verifyHash]
  );

  const handleAlgorithmChange = useCallback(
    (algo: Algorithm) => {
      setAlgorithm(algo);
      if (input) {
        generateHash(input, algo);
      }
    },
    [input, generateHash]
  );

  const handleExpectedHashChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const hash = e.target.value;
      setExpectedHash(hash);
      if (input) {
        verifyHash(input, hash);
      }
    },
    [input, verifyHash]
  );

  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setOutput('');
      setError('');
      setVerifyResult(null);
      if (newMode === 'generate' && input) {
        generateHash(input, algorithm);
      } else if (newMode === 'verify' && input && expectedHash) {
        verifyHash(input, expectedHash);
      }
    },
    [input, algorithm, expectedHash, generateHash, verifyHash]
  );

  const handleCopy = useCallback(async () => {
    const textToCopy = mode === 'generate' ? output : verifyResult?.computed || '';
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [mode, output, verifyResult]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setExpectedHash('');
    setVerifyResult(null);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate <strong>MD5</strong>, <strong>SHA-1</strong>, <strong>SHA-256</strong>, and{' '}
          <strong>SHA-512</strong> hashes from any text, or verify a hash against input text. This
          free <strong>hash generator and checker</strong> is perfect for verifying file integrity,
          creating checksums, and comparing hash values. All hashing happens entirely in your
          browser using the Web Crypto API and a pure JavaScript MD5 implementation — your data is
          never sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('generate')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'generate'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Generate
            </button>
            <button
              onClick={() => handleModeSwitch('verify')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'verify'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Verify
            </button>
          </div>
        </div>

        {/* Algorithm Selector (Generate mode) */}
        {mode === 'generate' && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex flex-wrap gap-2">
              {(['MD5', 'SHA-1', 'SHA-256', 'SHA-512'] as Algorithm[]).map((algo) => (
                <button
                  key={algo}
                  onClick={() => handleAlgorithmChange(algo)}
                  className={`px-4 py-1.5 text-sm font-mono rounded-md border transition-all ${
                    algorithm === algo
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="hash-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Input Text
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="hash-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter text to hash..."
              className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none dark:text-white"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'generate' ? `${algorithm} Hash Output` : 'Expected Hash'}
              </label>
            </div>

            {mode === 'generate' ? (
              <textarea
                value={output}
                readOnly
                placeholder="Hash will appear here..."
                className={`w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
                  error
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
                } dark:text-white`}
                spellCheck={false}
              />
            ) : (
              <textarea
                value={expectedHash}
                onChange={handleExpectedHashChange}
                placeholder="Paste expected hash to verify against..."
                className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none dark:text-white"
                spellCheck={false}
              />
            )}

            {/* Verify Result */}
            {mode === 'verify' && verifyResult && (
              <div
                className={`p-3 border rounded-lg ${
                  verifyResult.match
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    verifyResult.match
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}
                >
                  {verifyResult.match ? '✓ Hash matches!' : '✗ Hash does not match'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Detected algorithm: {verifyResult.algorithm}
                </p>
                {!verifyResult.match && (
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 break-all">
                    Computed: {verifyResult.computed}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={handleCopy}
            disabled={isProcessing || (mode === 'generate' ? !output : !verifyResult?.computed)}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Hash'}
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !output && !expectedHash}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All hashing happens directly in your browser using the{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">Web Crypto API</code> (SHA)
              and a pure JavaScript implementation (MD5). Your data never leaves your device.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Hash Generator & Checker
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Choose your mode:</strong> &quot;Generate&quot; creates a hash from text,
            &quot;Verify&quot; checks if text matches an expected hash.
          </li>
          <li>
            <strong>In Generate mode:</strong> Select an algorithm (MD5, SHA-1, SHA-256, SHA-512),
            type or paste text, and see the hash instantly.
          </li>
          <li>
            <strong>In Verify mode:</strong> Enter the text in the left panel and paste the expected
            hash in the right panel. The algorithm is detected automatically from hash length.
          </li>
          <li>
            <strong>Copy the result</strong> using the &quot;Copy Hash&quot; button.
          </li>
        </ol>
      </section>

      {/* Hash Algorithm Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Hash Algorithm Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Algorithm</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Output Length</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Security</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">MD5</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">128 bits (32 hex)</td>
                <td className="px-4 py-3 text-red-600 dark:text-red-400">Broken</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Checksums only</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">SHA-1</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">160 bits (40 hex)</td>
                <td className="px-4 py-3 text-yellow-600 dark:text-yellow-400">Deprecated</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Legacy systems</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">SHA-256</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">256 bits (64 hex)</td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">Secure</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">General purpose</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-gray-900 dark:text-white">SHA-512</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">512 bits (128 hex)</td>
                <td className="px-4 py-3 text-green-600 dark:text-green-400">Secure</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">High security</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '📦', title: 'File Integrity', desc: 'Verify downloaded files match expected checksums' },
            { icon: '🔐', title: 'Password Storage', desc: 'Hash passwords before storing (use bcrypt/argon2 in production)' },
            { icon: '📝', title: 'Data Deduplication', desc: 'Detect duplicate content by comparing hashes' },
            { icon: '🔗', title: 'Digital Signatures', desc: 'Hash documents before signing for integrity verification' },
            { icon: '💾', title: 'Cache Keys', desc: 'Generate unique cache keys from content' },
            { icon: '🛡️', title: 'Data Integrity', desc: 'Verify data hasn\'t been tampered with in transit' },
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
          Need encryption instead of hashing? Try our{' '}
          <Link href="/tools/aes-encryption-decryption" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            AES Encryption/Decryption
          </Link>{' '}
          tool. For encoding, check out our{' '}
          <Link href="/tools/base64-encoder-decoder" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Base64 Encoder/Decoder
          </Link>.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is the difference between hashing and encryption?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>Hashing</strong> is a one-way function — you cannot reverse a hash to get the
              original data. <strong>Encryption</strong> is a two-way function — you can decrypt
              encrypted data with the correct key. Hashing is used for data integrity and password
              verification, while encryption is used to protect data confidentiality.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is MD5 still safe to use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              MD5 is <strong>cryptographically broken</strong> — collision attacks are practical. It
              should not be used for security purposes like password hashing or digital signatures.
              However, MD5 is still acceptable for non-security uses like quick checksums or data
              deduplication where collision resistance is not critical.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Which hash algorithm should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              For general purposes, <strong>SHA-256</strong> is the recommended choice — it offers
              strong collision resistance and is widely supported. SHA-512 provides even more security
              for sensitive applications. For password hashing, use specialized algorithms like bcrypt,
              scrypt, or Argon2 instead of raw SHA hashes.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can a hash be reversed to get the original text?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No. Cryptographic hash functions are designed to be <strong>one-way</strong>. You
              cannot mathematically reverse a hash to find the original input. However, short or
              common strings can be found using rainbow tables or brute-force attacks, which is why
              passwords should always be hashed with a salt.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
