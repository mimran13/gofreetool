'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// URL ENCODING/DECODING HELPERS
// ============================================================================

/**
 * Encode a string for use in URLs
 */
function encodeURL(text: string): { success: boolean; result: string; error?: string } {
  try {
    const encoded = encodeURIComponent(text);
    return { success: true, result: encoded };
  } catch (error) {
    return {
      success: false,
      result: '',
      error: `Encoding error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Decode a URL-encoded string
 */
function decodeURL(text: string): { success: boolean; result: string; error?: string; warning?: string } {
  if (!text.trim()) {
    return { success: false, result: '', error: 'Please enter a URL-encoded string' };
  }

  // Check for potentially malformed encoding
  const malformedPattern = /%(?![0-9A-Fa-f]{2})/;
  if (malformedPattern.test(text)) {
    // Try to decode anyway but warn
    try {
      const decoded = decodeURIComponent(text);
      return {
        success: true,
        result: decoded,
        warning: 'Input contains potentially malformed percent-encoding sequences',
      };
    } catch {
      return {
        success: false,
        result: '',
        error: 'Invalid URL encoding: contains malformed percent-encoding (e.g., % not followed by two hex digits)',
      };
    }
  }

  try {
    const decoded = decodeURIComponent(text);
    return { success: true, result: decoded };
  } catch (error) {
    return {
      success: false,
      result: '',
      error: `Decoding error: ${error instanceof Error ? error.message : 'Invalid URL-encoded string'}`,
    };
  }
}

/**
 * Parse URL and extract query parameters
 */
interface QueryParam {
  key: string;
  value: string;
  encodedKey: string;
  encodedValue: string;
}

function parseQueryParams(urlString: string): QueryParam[] {
  try {
    // Handle both full URLs and query strings
    let queryString = urlString;

    // If it looks like a full URL, extract query string
    if (urlString.includes('?')) {
      queryString = urlString.split('?')[1] || '';
    }

    // Remove hash fragment
    queryString = queryString.split('#')[0];

    if (!queryString) return [];

    const params: QueryParam[] = [];
    const pairs = queryString.split('&');

    for (const pair of pairs) {
      if (!pair) continue;

      const [encodedKey, ...valueParts] = pair.split('=');
      const encodedValue = valueParts.join('='); // Handle values containing '='

      let key = encodedKey;
      let value = encodedValue;

      try {
        key = decodeURIComponent(encodedKey);
      } catch {
        // Keep encoded if decoding fails
      }

      try {
        value = decodeURIComponent(encodedValue);
      } catch {
        // Keep encoded if decoding fails
      }

      params.push({
        key,
        value,
        encodedKey,
        encodedValue,
      });
    }

    return params;
  } catch {
    return [];
  }
}

/**
 * Detect if string appears to be URL-encoded
 */
function isLikelyEncoded(text: string): boolean {
  // Check for percent-encoding patterns
  return /%[0-9A-Fa-f]{2}/.test(text);
}

// ============================================================================
// QUERY PARAMS TABLE COMPONENT
// ============================================================================

interface QueryParamsTableProps {
  params: QueryParam[];
}

function QueryParamsTable({ params }: QueryParamsTableProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyValue = useCallback(async (value: string, index: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  }, []);

  if (params.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Query Parameters ({params.length})
      </h3>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Key
              </th>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Value
              </th>
              <th className="w-16 p-3 border-b border-gray-200 dark:border-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {params.map((param, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                  {param.key}
                </td>
                <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                  {param.value || <span className="text-gray-400">(empty)</span>}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopyValue(param.value, index)}
                    className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                  >
                    {copiedIndex === index ? '✓' : 'Copy'}
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
// MAIN COMPONENT
// ============================================================================

type Mode = 'encode' | 'decode';

export default function URLEncoderDecoder() {
  // Get tool metadata
  const tool = getToolBySlug('url-encoder-decoder');

  // State
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Parse query parameters from input (for decode mode) or output (for encode mode)
  const queryParams = useMemo(() => {
    if (mode === 'decode' && input) {
      return parseQueryParams(input);
    }
    return [];
  }, [mode, input]);

  // Auto-detect encoded input
  const showEncodingHint = useMemo(() => {
    return mode === 'encode' && isLikelyEncoded(input);
  }, [mode, input]);

  // Process input (encode or decode)
  const processInput = useCallback((text: string, currentMode: Mode) => {
    if (!text.trim()) {
      setOutput('');
      setError('');
      setWarning('');
      return;
    }

    if (currentMode === 'encode') {
      const result = encodeURL(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
        setWarning('');
      } else {
        setOutput('');
        setError(result.error || 'Encoding failed');
        setWarning('');
      }
    } else {
      const result = decodeURL(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
        setWarning(result.warning || '');
      } else {
        setOutput('');
        setError(result.error || 'Decoding failed');
        setWarning('');
      }
    }
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newInput = e.target.value;
      setInput(newInput);
      processInput(newInput, mode);
    },
    [mode, processInput]
  );

  // Handle mode switch
  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      // Swap input and output when switching modes
      if (output && !error) {
        setInput(output);
        processInput(output, newMode);
      } else {
        processInput(input, newMode);
      }
    },
    [input, output, error, processInput]
  );

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [output]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setWarning('');
  }, []);

  // Load example
  const handleLoadExample = useCallback(() => {
    if (mode === 'encode') {
      const example = 'Hello World! Special chars: @#$%^&*() Query: name=John Doe&city=New York';
      setInput(example);
      processInput(example, mode);
    } else {
      const example = 'https://example.com/search?q=hello%20world&name=John%20Doe&filter=%26%3D%3F';
      setInput(example);
      processInput(example, mode);
    }
  }, [mode, processInput]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>URL encoding</strong> (also called percent-encoding) converts special characters
          into a format that can be safely transmitted in URLs. Our free <strong>URL Encoder/Decoder</strong>
          tool instantly encodes text for use in URLs and decodes percent-encoded strings back to
          readable text. URL encoding is essential for passing data in query strings, handling special
          characters like spaces, ampersands, and non-ASCII characters, and building valid URLs
          programmatically. The tool also parses query parameters into a readable table format.
          All processing happens entirely in your browser—your URLs and data are never sent to any
          server, ensuring complete privacy.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('encode')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'encode'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => handleModeSwitch('decode')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'decode'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="url-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {mode === 'encode' ? 'Text to Encode' : 'URL to Decode'}
              </label>
              <button
                onClick={handleLoadExample}
                className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
              >
                Load Example
              </button>
            </div>

            <textarea
              id="url-input"
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === 'encode'
                  ? 'Enter text to URL-encode...'
                  : 'Paste URL or encoded string to decode...'
              }
              className="w-full h-40 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              spellCheck={false}
            />

            {/* Auto-detection hint */}
            {showEncodingHint && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-400">
                💡 Input appears to be URL-encoded. Switch to &quot;Decode&quot; mode?
                <button
                  onClick={() => handleModeSwitch('decode')}
                  className="ml-2 underline font-medium"
                >
                  Switch
                </button>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? 'Encoded URL' : 'Decoded Text'}
              </label>
              {output && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {output.length.toLocaleString()} chars
                </span>
              )}
            </div>

            <textarea
              value={output}
              readOnly
              placeholder={
                mode === 'encode'
                  ? 'URL-encoded result will appear here...'
                  : 'Decoded text will appear here...'
              }
              className={`w-full h-40 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
                error
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />

            {/* Warning message */}
            {warning && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-700 dark:text-amber-400">⚠️ {warning}</p>
              </div>
            )}

            {/* Error message */}
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
            disabled={!output || !!error}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Output'}
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !output}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              if (output && !error) {
                setInput(output);
                const newMode = mode === 'encode' ? 'decode' : 'encode';
                setMode(newMode);
                processInput(output, newMode);
              }
            }}
            disabled={!output || !!error}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Swap & {mode === 'encode' ? 'Decode' : 'Encode'}
          </button>
        </div>

        {/* Query Parameters Table (decode mode only) */}
        {mode === 'decode' && <QueryParamsTable params={queryParams} />}
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All URL encoding and decoding happens directly in your browser using native JavaScript
              functions (<code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">encodeURIComponent</code>,
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">decodeURIComponent</code>).
              Your URLs and data never leave your device. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the URL Encoder / Decoder
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select your mode</strong> using the toggle: &quot;Encode&quot; converts text to
            URL-safe format, &quot;Decode&quot; converts percent-encoded strings back to text.
          </li>
          <li>
            <strong>Enter your input</strong> in the left textarea. For encoding, enter any text
            including special characters. For decoding, paste a URL or encoded string.
          </li>
          <li>
            <strong>View the result</strong> instantly in the right textarea as you type.
          </li>
          <li>
            <strong>View query parameters</strong> (decode mode) in the table below to see parsed
            key-value pairs from URL query strings.
          </li>
          <li>
            <strong>Copy the output</strong> or use &quot;Swap & Decode/Encode&quot; to quickly
            reverse the operation on your result.
          </li>
        </ol>
      </section>

      {/* What Gets Encoded Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What Characters Get Encoded?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            URL encoding converts unsafe characters to percent-encoded format. Here&apos;s what gets
            converted:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Character</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Encoded</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">(space)</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">%20</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Space character</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">&</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">%26</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Ampersand (query separator)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">=</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">%3D</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Equals (key-value separator)</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">?</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">%3F</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Question mark (query start)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">/</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">%2F</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Forward slash (path separator)</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">#</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">%23</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Hash (fragment identifier)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to encode binary data? Try our{' '}
          <Link
            href="/tools/base64-encoder-decoder"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Base64 Encoder/Decoder
          </Link>{' '}
          for text and file encoding. Working with API responses? Use our{' '}
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
              What is URL encoding and why is it needed?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              URL encoding (percent-encoding) converts characters that are unsafe or have special
              meaning in URLs into a format that can be safely transmitted. URLs can only contain
              ASCII characters, and certain characters like spaces, ampersands, and question marks
              have special meanings. Encoding replaces these with a percent sign followed by two
              hex digits representing the character&apos;s ASCII code. For example, a space becomes
              %20 and an ampersand becomes %26.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What&apos;s the difference between encodeURI and encodeURIComponent?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <code>encodeURI</code> is designed for encoding complete URLs and preserves characters
              that are valid in URLs (like /, ?, #, &, =). <code>encodeURIComponent</code> encodes
              everything except letters, digits, and a few safe characters (- _ . ! ~ * &apos; ( )).
              This tool uses <code>encodeURIComponent</code> because it&apos;s safer for encoding
              individual values that will be used as query parameters or path segments.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why do I see %20 instead of + for spaces?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Both %20 and + can represent spaces, but they come from different encoding standards.
              %20 is the standard URL encoding (RFC 3986). The + character for spaces comes from
              the older application/x-www-form-urlencoded format used in HTML forms. Modern
              JavaScript&apos;s <code>encodeURIComponent</code> uses %20, which is universally
              compatible with all URL contexts, not just form submissions.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I encode non-ASCII characters like emojis or Chinese?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes! JavaScript&apos;s <code>encodeURIComponent</code> handles Unicode characters by
              first converting them to UTF-8 bytes, then encoding each byte. For example, the
              emoji 😀 becomes %F0%9F%98%80 (four UTF-8 bytes). Chinese characters like 你好 become
              %E4%BD%A0%E5%A5%BD. This ensures international text can be safely included in URLs
              while maintaining compatibility with servers worldwide.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why is my decoded URL showing an error?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Decoding errors typically occur when: (1) The input contains a % not followed by
              two valid hex digits (e.g., %GG or %2). (2) The encoded bytes don&apos;t form valid
              UTF-8 sequences. (3) The string was double-encoded and needs to be decoded twice.
              Try checking for stray % characters or ensuring the string was properly encoded
              to begin with. The tool will warn you about potentially malformed sequences.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
