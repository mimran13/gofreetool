'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// URL PARSING HELPERS
// ============================================================================

interface ParsedURL {
  isValid: boolean;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  username: string;
  password: string;
  error?: string;
}

interface QueryParam {
  key: string;
  value: string;
  decodedKey: string;
  decodedValue: string;
}

function parseURL(urlString: string): ParsedURL {
  const trimmed = urlString.trim();

  if (!trimmed) {
    return {
      isValid: false,
      protocol: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      origin: '',
      username: '',
      password: '',
      error: 'Please enter a URL to parse',
    };
  }

  // Try to parse with URL API
  try {
    // Add protocol if missing to help URL parser
    let urlToParse = trimmed;
    if (!trimmed.includes('://') && !trimmed.startsWith('//')) {
      urlToParse = 'https://' + trimmed;
    }

    const url = new URL(urlToParse);

    return {
      isValid: true,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      username: url.username,
      password: url.password,
    };
  } catch {
    return {
      isValid: false,
      protocol: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      origin: '',
      username: '',
      password: '',
      error: 'Invalid URL format. Please enter a valid URL.',
    };
  }
}

function parseQueryParams(search: string): QueryParam[] {
  if (!search || search === '?') return [];

  const queryString = search.startsWith('?') ? search.slice(1) : search;
  const params: QueryParam[] = [];
  const pairs = queryString.split('&');

  for (const pair of pairs) {
    if (!pair) continue;

    const [encodedKey, ...valueParts] = pair.split('=');
    const encodedValue = valueParts.join('='); // Handle values containing '='

    let decodedKey = encodedKey;
    let decodedValue = encodedValue;

    try {
      decodedKey = decodeURIComponent(encodedKey);
    } catch {
      // Keep encoded if decoding fails
    }

    try {
      decodedValue = decodeURIComponent(encodedValue);
    } catch {
      // Keep encoded if decoding fails
    }

    params.push({
      key: encodedKey,
      value: encodedValue,
      decodedKey,
      decodedValue,
    });
  }

  return params;
}

// ============================================================================
// URL COMPONENT DISPLAY
// ============================================================================

interface URLComponentProps {
  label: string;
  value: string;
  description: string;
  onCopy: (value: string) => void;
  copiedValue: string | null;
}

function URLComponent({ label, value, description, onCopy, copiedValue }: URLComponentProps) {
  if (!value) return null;

  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {description}
          </span>
        </div>
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
          {value}
        </code>
      </div>
      <button
        onClick={() => onCopy(value)}
        className="ml-3 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors flex-shrink-0"
      >
        {copiedValue === value ? '✓' : 'Copy'}
      </button>
    </div>
  );
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
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Key
              </th>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Value (Decoded)
              </th>
              <th className="w-16 p-3 border-b border-gray-200 dark:border-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {params.map((param, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                  {param.decodedKey}
                  {param.key !== param.decodedKey && (
                    <span className="block text-xs text-gray-400 mt-1">
                      (encoded: {param.key})
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                  {param.decodedValue || <span className="text-gray-400">(empty)</span>}
                  {param.value !== param.decodedValue && param.decodedValue && (
                    <span className="block text-xs text-gray-400 mt-1">
                      (encoded: {param.value})
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleCopyValue(param.decodedValue, index)}
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

export default function URLParser() {
  // Get tool metadata
  const tool = getToolBySlug('url-parser');

  // State
  const [input, setInput] = useState('');
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  // Parse URL
  const parsedURL = useMemo(() => parseURL(input), [input]);

  // Parse query parameters
  const queryParams = useMemo(() => {
    if (parsedURL.isValid && parsedURL.search) {
      return parseQueryParams(parsedURL.search);
    }
    return [];
  }, [parsedURL]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  // Handle copy
  const handleCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 1500);
    }
  }, []);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Load example
  const handleLoadExample = useCallback(() => {
    setInput('https://user:pass@example.com:8080/path/to/page?search=hello%20world&category=tools&sort=asc&filter=active#section-2');
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>URL Parser</strong> breaks down any URL into its components for easy analysis.
          Enter a URL to instantly see the <strong>protocol</strong>, <strong>host</strong>,
          <strong> pathname</strong>, <strong>query parameters</strong>, and <strong>hash fragment</strong>.
          Query parameters are automatically decoded and displayed in a table with one-click copy
          for each value. Perfect for debugging API calls, analyzing tracking links, or understanding
          complex URLs. All parsing happens in your browser&mdash;your URLs are never sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Input Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label
              htmlFor="url-input"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Enter URL to Parse
            </label>
            <button
              onClick={handleLoadExample}
              className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
            >
              Load Example
            </button>
          </div>

          <div className="space-y-3">
            <textarea
              id="url-input"
              value={input}
              onChange={handleInputChange}
              placeholder="https://example.com/path?query=value#hash"
              className="w-full h-24 px-5 py-4 font-mono text-base leading-relaxed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-y transition-colors"
              spellCheck={false}
            />
            <button
              onClick={handleClear}
              disabled={!input}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Error message */}
        {parsedURL.error && input && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-700 dark:text-red-400">{parsedURL.error}</p>
          </div>
        )}

        {/* Parsed URL Components */}
        {parsedURL.isValid && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              URL Components
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <URLComponent
                label="Protocol"
                value={parsedURL.protocol}
                description="Scheme"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
              <URLComponent
                label="Host"
                value={parsedURL.host}
                description="Domain + Port"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
              <URLComponent
                label="Hostname"
                value={parsedURL.hostname}
                description="Domain only"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
              <URLComponent
                label="Port"
                value={parsedURL.port}
                description="Port number"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
              <URLComponent
                label="Origin"
                value={parsedURL.origin}
                description="Protocol + Host"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
              <URLComponent
                label="Pathname"
                value={parsedURL.pathname}
                description="Path"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
              {parsedURL.username && (
                <URLComponent
                  label="Username"
                  value={parsedURL.username}
                  description="Auth user"
                  onCopy={handleCopy}
                  copiedValue={copiedValue}
                />
              )}
              {parsedURL.password && (
                <URLComponent
                  label="Password"
                  value={parsedURL.password}
                  description="Auth pass"
                  onCopy={handleCopy}
                  copiedValue={copiedValue}
                />
              )}
            </div>

            {parsedURL.search && (
              <URLComponent
                label="Query String"
                value={parsedURL.search}
                description="Full query"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
            )}

            {parsedURL.hash && (
              <URLComponent
                label="Hash / Fragment"
                value={parsedURL.hash}
                description="Anchor"
                onCopy={handleCopy}
                copiedValue={copiedValue}
              />
            )}

            {/* Query Parameters Table */}
            <QueryParamsTable params={queryParams} />
          </div>
        )}

        {/* Empty state */}
        {!input && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <span className="text-4xl mb-4 block">🔗</span>
            <p>Enter a URL above to see its parsed components</p>
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All URL parsing happens directly in your browser using the native JavaScript{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">URL</code> API.
              Your URLs never leave your device. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the URL Parser
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter a URL</strong> in the input field. You can paste a full URL including
            protocol, or just the domain and path (https:// will be added automatically).
          </li>
          <li>
            <strong>View the breakdown</strong> of URL components: protocol, host, hostname, port,
            pathname, query string, and hash fragment.
          </li>
          <li>
            <strong>Examine query parameters</strong> in the table below the components. Keys and
            values are automatically URL-decoded for readability.
          </li>
          <li>
            <strong>Copy any value</strong> with a single click using the Copy button next to each
            component or parameter.
          </li>
        </ol>
      </section>

      {/* URL Components Reference Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          URL Components Explained
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            A URL (Uniform Resource Locator) consists of several parts that identify and locate a
            resource on the web:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Component</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Example</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Protocol</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">https:</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">The scheme indicating how to access the resource (http, https, ftp, etc.)</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Host</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">example.com:8080</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">The domain name and port combined</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Hostname</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">example.com</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">The domain name without the port</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Port</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">8080</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">The network port (empty for default: 80 for HTTP, 443 for HTTPS)</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Pathname</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">/path/to/page</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">The path to the resource on the server</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Query String</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">?key=value&amp;foo=bar</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Parameters passed to the resource, starting with ?</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Hash</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-teal-600">#section</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Fragment identifier for in-page navigation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">API Debugging</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quickly inspect API endpoint URLs, extract query parameters, and verify the correct
              values are being passed.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyze UTM parameters and tracking codes in marketing URLs to verify campaign setup.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">OAuth/Auth Flows</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Debug OAuth redirect URLs, extract authorization codes, and verify callback parameters.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">SEO Analysis</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Examine URL structures, identify canonical issues, and analyze pagination parameters.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to encode special characters for URLs? Try our{' '}
          <Link
            href="/tools/url-encoder-decoder"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            URL Encoder/Decoder
          </Link>
          . Working with JSON data? Use our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter
          </Link>{' '}
          or{' '}
          <Link
            href="/tools/html-formatter"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            HTML Formatter
          </Link>
          .
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What if my URL doesn&apos;t have a protocol?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              If you enter a URL without a protocol (like &quot;example.com/path&quot;), the parser
              will automatically add &quot;https://&quot; to properly parse the URL. This is a common
              convenience for quickly analyzing URLs copied from various sources.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why are some query parameter values shown differently?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Query parameters are URL-decoded for readability. If the original value was encoded
              (e.g., &quot;hello%20world&quot;), it will be displayed as &quot;hello world&quot; with
              the encoded version shown below. This makes it easier to read actual values while still
              seeing the original encoding if needed.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What are username and password in a URL?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              URLs can contain authentication credentials in the format
              &quot;protocol://username:password@host/path&quot;. This is commonly seen with FTP URLs
              or internal systems. Note that including credentials in URLs is generally discouraged
              for security reasons, as URLs may be logged or visible in browser history.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why is the port empty for most URLs?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              When using default ports (80 for HTTP, 443 for HTTPS), the port is typically omitted
              from the URL. The port field will only show a value when a non-default port is
              explicitly specified in the URL, like &quot;example.com:8080&quot;.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data safe when using this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, completely safe. All URL parsing happens directly in your browser using the
              built-in JavaScript URL API. Your URLs are never sent to any server. You can verify
              this by using browser developer tools to monitor network requests, or simply
              disconnect from the internet—the tool will continue to work.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
