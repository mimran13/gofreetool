'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// TYPES
// ============================================================================

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  contentType?: string;
  auth?: { user: string; pass: string };
  queryParams?: Record<string, string>;
  followRedirects?: boolean;
}

type OutputFormat = 'fetch' | 'axios' | 'python';

// ============================================================================
// SAMPLE DATA
// ============================================================================

const CURL_SAMPLE = `curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer tok_abc123" \\
  -d '{"name": "John", "email": "john@example.com"}'`;

// ============================================================================
// CURL PARSER
// ============================================================================

function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (escape) {
      current += ch;
      escape = false;
      continue;
    }

    if (ch === '\\' && !inSingle) {
      escape = true;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }

    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }

    if (/\s/.test(ch) && !inSingle && !inDouble) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += ch;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

function parseCurl(input: string): ParsedCurl {
  // Normalize line continuations
  let normalized = input.replace(/\\\s*\n/g, ' ').trim();

  // Strip leading $ prompt
  normalized = normalized.replace(/^\$\s+/, '');

  // Strip leading curl / curl.exe
  if (normalized.startsWith('curl.exe ')) {
    normalized = normalized.slice(9);
  } else if (normalized.startsWith('curl ')) {
    normalized = normalized.slice(5);
  } else if (normalized === 'curl') {
    throw new Error('No URL provided');
  } else {
    throw new Error('Input must start with "curl"');
  }

  const tokens = tokenize(normalized);

  let method = '';
  let url = '';
  const headers: Record<string, string> = {};
  let body: string | undefined;
  let auth: { user: string; pass: string } | undefined;
  let followRedirects = false;
  const formFields: string[] = [];

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (token === '-X' || token === '--request') {
      i++;
      method = (tokens[i] || '').toUpperCase();
    } else if (token === '-H' || token === '--header') {
      i++;
      const headerVal = tokens[i] || '';
      const colonIdx = headerVal.indexOf(':');
      if (colonIdx > 0) {
        const key = headerVal.slice(0, colonIdx).trim();
        const value = headerVal.slice(colonIdx + 1).trim();
        headers[key] = value;
      }
    } else if (token === '-d' || token === '--data' || token === '--data-raw' || token === '--data-binary') {
      i++;
      body = tokens[i] || '';
    } else if (token === '-u' || token === '--user') {
      i++;
      const userPass = tokens[i] || '';
      const colonIdx = userPass.indexOf(':');
      if (colonIdx > 0) {
        auth = { user: userPass.slice(0, colonIdx), pass: userPass.slice(colonIdx + 1) };
      } else {
        auth = { user: userPass, pass: '' };
      }
    } else if (token === '-A' || token === '--user-agent') {
      i++;
      headers['User-Agent'] = tokens[i] || '';
    } else if (token === '-b' || token === '--cookie') {
      i++;
      headers['Cookie'] = tokens[i] || '';
    } else if (token === '-L' || token === '--location') {
      followRedirects = true;
    } else if (token === '--compressed') {
      headers['Accept-Encoding'] = 'gzip, deflate, br';
    } else if (token === '-F' || token === '--form') {
      i++;
      formFields.push(tokens[i] || '');
    } else if (token.startsWith('-')) {
      // Unknown flag — skip a value arg if next token doesn't start with -
      if (i + 1 < tokens.length && !tokens[i + 1].startsWith('-')) {
        i++;
      }
    } else {
      // Non-flag token: treat as URL
      if (!url) {
        url = token;
      }
    }

    i++;
  }

  if (!url) {
    throw new Error('No URL found in curl command');
  }

  // Handle form data
  if (formFields.length > 0) {
    if (!method) method = 'POST';
    headers['Content-Type'] = 'multipart/form-data';
    body = formFields.join('&');
  }

  // Default method
  if (!method) {
    method = body ? 'POST' : 'GET';
  }

  // Extract Content-Type from headers
  const contentType = headers['Content-Type'] || headers['content-type'] || undefined;

  // Parse query params from URL
  let queryParams: Record<string, string> | undefined;
  try {
    const urlObj = new URL(url);
    if (urlObj.search) {
      queryParams = {};
      urlObj.searchParams.forEach((value, key) => {
        queryParams![key] = value;
      });
    }
  } catch {
    // URL may not be valid, skip query param parsing
  }

  return {
    method,
    url,
    headers,
    body,
    contentType,
    auth,
    queryParams,
    followRedirects,
  };
}

// ============================================================================
// CODE GENERATORS
// ============================================================================

function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function generateFetch(parsed: ParsedCurl): string {
  const lines: string[] = [];
  const options: string[] = [];

  if (parsed.method !== 'GET') {
    options.push(`  method: '${parsed.method}'`);
  }

  // Build headers
  const allHeaders = { ...parsed.headers };
  if (parsed.auth) {
    const encoded = `btoa('${parsed.auth.user}:${parsed.auth.pass}')`;
    allHeaders['Authorization'] = `Basic \${${encoded}}`;
  }

  const headerKeys = Object.keys(allHeaders);
  if (headerKeys.length > 0) {
    const headerLines = headerKeys.map(k => `    '${k}': '${allHeaders[k]}'`);
    options.push(`  headers: {\n${headerLines.join(',\n')}\n  }`);
  }

  // Body
  if (parsed.body) {
    if (parsed.contentType?.includes('application/json') && isJsonString(parsed.body)) {
      options.push(`  body: JSON.stringify(${parsed.body})`);
    } else {
      options.push(`  body: '${parsed.body.replace(/'/g, "\\'")}'`);
    }
  }

  // Redirect
  if (parsed.followRedirects) {
    options.push(`  redirect: 'follow'`);
  }

  if (options.length > 0) {
    lines.push(`const response = await fetch('${parsed.url}', {`);
    lines.push(options.join(',\n'));
    lines.push(`});`);
  } else {
    lines.push(`const response = await fetch('${parsed.url}');`);
  }

  lines.push('');
  lines.push('const data = await response.json();');
  lines.push('console.log(data);');

  return lines.join('\n');
}

function generateAxios(parsed: ParsedCurl): string {
  const lines: string[] = [];
  const config: string[] = [];

  config.push(`  method: '${parsed.method.toLowerCase()}'`);
  config.push(`  url: '${parsed.url}'`);

  // Headers
  const allHeaders = { ...parsed.headers };
  const headerKeys = Object.keys(allHeaders);
  if (headerKeys.length > 0) {
    const headerLines = headerKeys.map(k => `    '${k}': '${allHeaders[k]}'`);
    config.push(`  headers: {\n${headerLines.join(',\n')}\n  }`);
  }

  // Body
  if (parsed.body) {
    if (parsed.contentType?.includes('application/json') && isJsonString(parsed.body)) {
      config.push(`  data: ${parsed.body}`);
    } else {
      config.push(`  data: '${parsed.body.replace(/'/g, "\\'")}'`);
    }
  }

  // Auth
  if (parsed.auth) {
    config.push(`  auth: {\n    username: '${parsed.auth.user}',\n    password: '${parsed.auth.pass}'\n  }`);
  }

  // Redirect
  if (parsed.followRedirects) {
    config.push(`  maxRedirects: 5`);
  }

  lines.push(`const response = await axios({`);
  lines.push(config.join(',\n'));
  lines.push(`});`);
  lines.push('');
  lines.push('console.log(response.data);');

  return lines.join('\n');
}

function generatePythonRequests(parsed: ParsedCurl): string {
  const lines: string[] = [];
  lines.push('import requests');
  lines.push('');

  const methodLower = parsed.method.toLowerCase();
  const args: string[] = [];

  args.push(`    '${parsed.url}'`);

  // Headers (exclude content-type if we're using json= kwarg)
  const allHeaders = { ...parsed.headers };
  const useJsonKwarg = parsed.contentType?.includes('application/json') && parsed.body && isJsonString(parsed.body);

  if (useJsonKwarg) {
    delete allHeaders['Content-Type'];
    delete allHeaders['content-type'];
  }

  const headerKeys = Object.keys(allHeaders);
  if (headerKeys.length > 0) {
    const headerLines = headerKeys.map(k => `        '${k}': '${allHeaders[k]}'`);
    args.push(`    headers={\n${headerLines.join(',\n')}\n    }`);
  }

  // Body
  if (parsed.body) {
    if (useJsonKwarg) {
      args.push(`    json=${parsed.body}`);
    } else {
      args.push(`    data='${parsed.body.replace(/'/g, "\\'")}'`);
    }
  }

  // Auth
  if (parsed.auth) {
    args.push(`    auth=('${parsed.auth.user}', '${parsed.auth.pass}')`);
  }

  // Redirect
  if (parsed.followRedirects === false) {
    args.push(`    allow_redirects=False`);
  }

  lines.push(`response = requests.${methodLower}(`);
  lines.push(args.join(',\n') + ',');
  lines.push(`)');`);
  lines.push('');
  lines.push('print(response.status_code)');
  lines.push('print(response.json())');

  // Fix: the closing line should just be )
  // Let me reconstruct properly
  const fixedLines: string[] = [];
  fixedLines.push('import requests');
  fixedLines.push('');
  fixedLines.push(`response = requests.${methodLower}(`);
  fixedLines.push(args.join(',\n') + ',');
  fixedLines.push(')');
  fixedLines.push('');
  fixedLines.push('print(response.status_code)');
  fixedLines.push('print(response.json())');

  return fixedLines.join('\n');
}

// ============================================================================
// SUPPORTED FLAGS TABLE
// ============================================================================

const SUPPORTED_FLAGS = [
  { flag: '-X, --request', desc: 'HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)' },
  { flag: '-H, --header', desc: 'Add a request header (e.g., "Content-Type: application/json")' },
  { flag: '-d, --data', desc: 'Send request body data (sets method to POST if not specified)' },
  { flag: '--data-raw', desc: 'Send raw data without special interpretation' },
  { flag: '--data-binary', desc: 'Send binary data as-is' },
  { flag: '-u, --user', desc: 'Basic authentication credentials (user:password)' },
  { flag: '-A, --user-agent', desc: 'Set the User-Agent header' },
  { flag: '-b, --cookie', desc: 'Set the Cookie header' },
  { flag: '-L, --location', desc: 'Follow redirects' },
  { flag: '--compressed', desc: 'Request compressed response (Accept-Encoding: gzip, deflate, br)' },
  { flag: '-F, --form', desc: 'Multipart form data' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CurlToHttpConverter() {
  const tool = getToolBySlug('curl-to-http-converter');

  // State
  const [input, setInput] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('fetch');
  const [copySuccess, setCopySuccess] = useState(false);

  // Parse and generate code
  const result = useMemo(() => {
    if (!input.trim()) {
      return { success: false as const };
    }

    try {
      const parsed = parseCurl(input);
      let output = '';

      switch (outputFormat) {
        case 'fetch':
          output = generateFetch(parsed);
          break;
        case 'axios':
          output = generateAxios(parsed);
          break;
        case 'python':
          output = generatePythonRequests(parsed);
          break;
      }

      return { success: true as const, output, parsed };
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      return { success: false as const, error };
    }
  }, [input, outputFormat]);

  // Clipboard paste
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch {
      // Clipboard API not available
    }
  }, []);

  // Copy output
  const handleCopy = useCallback(async () => {
    if (!result.success || !result.output) return;

    try {
      await navigator.clipboard.writeText(result.output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = result.output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [result]);

  // Clear
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Load sample
  const handleLoadSample = useCallback(() => {
    setInput(CURL_SAMPLE);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  const formatLabels: Record<OutputFormat, string> = {
    fetch: 'JavaScript Fetch',
    axios: 'Axios',
    python: 'Python Requests',
  };

  return (
    <ToolLayout tool={tool}>
      {/* ================================================================
          1. INTRODUCTION
          ================================================================ */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our free <strong>Curl to HTTP Request Converter</strong> parses raw curl commands
          and generates equivalent code in <strong>JavaScript fetch</strong>,{' '}
          <strong>Axios</strong>, and <strong>Python requests</strong>. Paste any curl
          command from your terminal, API documentation, or browser DevTools, and get
          clean, ready-to-use code instantly. Perfect for developers migrating API calls
          between languages, learning new HTTP libraries, or converting cURL snippets
          from documentation.{' '}
          <strong>All processing happens in your browser</strong>&mdash;your API keys,
          tokens, and request data are never uploaded to any server.
        </p>
      </ToolContent>

      {/* ================================================================
          2. MAIN TOOL INTERFACE
          ================================================================ */}
      <ToolInterface className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Output Format Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
            {(['fetch', 'axios', 'python'] as OutputFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  outputFormat === fmt
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {formatLabels[fmt]}
              </button>
            ))}
          </div>

          {/* Input / Output Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="curl-input"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Curl Command
                </label>
                <button
                  onClick={handleLoadSample}
                  className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
                >
                  Load Sample
                </button>
              </div>

              <textarea
                id="curl-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={'Paste your curl command here...\ncurl -X GET https://api.example.com/data'}
                className={`w-full h-[65vh] px-5 py-4 font-mono text-sm border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none ${
                  input && !result.success && result.error
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white'
                }`}
                spellCheck={false}
                aria-describedby="parse-error"
              />

              {/* Error message */}
              {input && !result.success && result.error && (
                <div
                  id="parse-error"
                  className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  role="alert"
                >
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    Invalid curl command: {result.error}
                  </p>
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {formatLabels[outputFormat]} Output
                </label>
                {result.success && result.output && (
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    {result.output.split('\n').length} lines
                  </span>
                )}
              </div>

              {result.success && result.output ? (
                <pre className="w-full h-[65vh] px-5 py-4 font-mono text-sm border-2 border-gray-300 dark:border-gray-600 bg-gray-900 text-green-400 rounded-xl overflow-auto whitespace-pre">
                  {result.output}
                </pre>
              ) : (
                <div className="w-full h-[65vh] flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    {input
                      ? 'Fix the input errors to see output'
                      : 'Enter a valid curl command to see generated code'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleClear}
              disabled={!input}
              className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handlePaste}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              Paste from Clipboard
            </button>
            <button
              onClick={handleCopy}
              disabled={!result.success}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {copySuccess ? 'Copied!' : 'Copy Output'}
            </button>
          </div>
        </div>
      </ToolInterface>

      {/* ================================================================
          3. PRIVACY NOTICE
          ================================================================ */}
      <ToolContent className="mb-12">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">&#x1F512;</span>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">Your Data Stays Private</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                All curl parsing and code generation happens directly in your browser using JavaScript.
                Your API keys, authentication tokens, and request data are never uploaded to any server,
                stored, or transmitted. This tool works offline after the page loads&mdash;perfect for
                converting sensitive API calls and internal endpoints.
              </p>
            </div>
          </div>
        </div>
      </ToolContent>

      {/* ================================================================
          4. HOW TO USE
          ================================================================ */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Curl Converter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Choose an output format</strong>&mdash;select &quot;JavaScript Fetch&quot;,
            &quot;Axios&quot;, or &quot;Python Requests&quot; using the toggle at the top.
          </li>
          <li>
            <strong>Paste your curl command</strong> into the input panel on the left. You can also
            click &quot;Load Sample&quot; to try an example, or use &quot;Paste from Clipboard&quot;
            to paste directly.
          </li>
          <li>
            <strong>View the generated code</strong> instantly on the right panel. The output
            updates in real time as you type or edit.
          </li>
          <li>
            <strong>Fix any errors</strong> if the parser detects invalid curl syntax. A clear error
            message below the input will tell you exactly what went wrong.
          </li>
          <li>
            <strong>Copy the output</strong> using the &quot;Copy Output&quot; button, then paste it
            into your code editor or project.
          </li>
        </ol>
      </ToolContent>

      {/* ================================================================
          5. SUPPORTED CURL FLAGS
          ================================================================ */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Supported Curl Flags
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 pr-4 font-semibold text-gray-900 dark:text-white">Flag</th>
                <th className="py-3 font-semibold text-gray-900 dark:text-white">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {SUPPORTED_FLAGS.map((row) => (
                <tr key={row.flag} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-2.5 pr-4 font-mono text-xs text-teal-700 dark:text-teal-400 whitespace-nowrap">
                    {row.flag}
                  </td>
                  <td className="py-2.5">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolContent>

      {/* ================================================================
          6. FEATURES
          ================================================================ */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '&#x26A1;', title: 'Real-time Conversion', desc: 'Output updates instantly as you type or paste your curl command' },
            { icon: '&#x1F4BB;', title: 'Multiple Formats', desc: 'Generate fetch, Axios, or Python requests code from a single curl command' },
            { icon: '&#x2705;', title: 'Input Validation', desc: 'Clear error messages for invalid or incomplete curl commands' },
            { icon: '&#x1F4CB;', title: 'One-Click Copy', desc: 'Copy generated code to clipboard with a single click' },
            { icon: '&#x1F512;', title: 'Privacy First', desc: '100% client-side processing, API keys and tokens never leave your browser' },
            { icon: '&#x1F527;', title: 'Comprehensive Parsing', desc: 'Supports headers, body, auth, cookies, user-agent, and more curl flags' },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-2xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ToolContent>

      {/* ================================================================
          7. RELATED TOOLS
          ================================================================ */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Need to format or validate JSON response data? Use our{' '}
            <Link
              href="/tools/json-formatter-viewer"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON Formatter &amp; Viewer
            </Link>
            . Converting between JSON and YAML configs? Try our{' '}
            <Link
              href="/tools/json-yaml-converter"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON-YAML Converter
            </Link>
            . Testing regex patterns for response parsing? Check out the{' '}
            <Link
              href="/tools/regex-tester"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              Regex Tester
            </Link>
            .
          </p>
        </div>
      </ToolContent>

      {/* ================================================================
          8. FAQ
          ================================================================ */}
      <ToolContent className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is curl?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>curl</strong> is a command-line tool for transferring data using various network
              protocols, most commonly HTTP and HTTPS. It&apos;s available on virtually every operating
              system and is widely used by developers to test APIs, download files, and debug network
              requests. Browser DevTools often provide &quot;Copy as cURL&quot; to export any network
              request as a curl command.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What output formats are supported?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool generates code in three popular formats: <strong>JavaScript fetch</strong> (the
              built-in browser API), <strong>Axios</strong> (a popular HTTP client for Node.js and
              browsers), and <strong>Python requests</strong> (the most popular Python HTTP library).
              Each output includes proper handling of headers, request body, authentication, and other
              curl options.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data uploaded to any server?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No, absolutely not. All parsing and code generation happens entirely in your browser using
              JavaScript. Your curl commands&mdash;including any API keys, tokens, passwords, or
              sensitive URLs they contain&mdash;never leave your device. Nothing is sent to any server,
              stored, or logged.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How do I get a curl command from browser DevTools?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              In Chrome, Firefox, or Edge, open DevTools (F12), go to the Network tab, and right-click
              on any request. Select &quot;Copy&quot; &rarr; &quot;Copy as cURL&quot;. This copies the
              full curl command with all headers, cookies, and body data. Then paste it into this tool
              to generate equivalent code in your preferred language.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
