'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// CSV PARSING UTILITIES
// ============================================================================

/**
 * Parse a CSV line handling quoted values with commas inside
 * Follows RFC 4180 standards for CSV
 */
function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === delimiter) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Parse full CSV text to 2D array
 */
function parseCSV(text: string, delimiter: string = ','): string[][] {
  // Normalize line endings
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into lines and filter empty
  const lines = normalized.split('\n').filter((line) => line.trim() !== '');

  // Parse each line
  return lines.map((line) => parseCSVLine(line, delimiter));
}

/**
 * Convert CSV to JSON
 */
interface CSVToJSONOptions {
  hasHeaders: boolean;
  delimiter: string;
}

function csvToJSON(
  csvText: string,
  options: CSVToJSONOptions
): { success: boolean; result: string; error?: string; rowCount?: number } {
  try {
    const rows = parseCSV(csvText, options.delimiter);

    if (rows.length === 0) {
      return { success: false, result: '', error: 'No data found in CSV' };
    }

    if (options.hasHeaders) {
      if (rows.length < 2) {
        return { success: false, result: '', error: 'CSV with headers must have at least 2 rows (header + data)' };
      }

      const headers = rows[0];
      const data = rows.slice(1);

      // Convert to array of objects
      const jsonArray = data.map((row) => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
          // Clean header name (remove quotes, trim)
          const cleanHeader = header.replace(/^["']|["']$/g, '').trim() || `column${index + 1}`;
          obj[cleanHeader] = row[index] || '';
        });
        return obj;
      });

      return {
        success: true,
        result: JSON.stringify(jsonArray, null, 2),
        rowCount: jsonArray.length,
      };
    } else {
      // Return as array of arrays
      return {
        success: true,
        result: JSON.stringify(rows, null, 2),
        rowCount: rows.length,
      };
    }
  } catch (error) {
    return {
      success: false,
      result: '',
      error: `CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// ============================================================================
// JSON TO CSV UTILITIES
// ============================================================================

/**
 * Escape a CSV field value
 */
function escapeCSVField(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);

  // Check if quoting is needed
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    // Escape quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Convert JSON to CSV
 */
interface JSONToCSVOptions {
  includeHeaders: boolean;
  delimiter: string;
}

function jsonToCSV(
  jsonText: string,
  options: JSONToCSVOptions
): { success: boolean; result: string; error?: string; rowCount?: number } {
  try {
    const data = JSON.parse(jsonText);

    if (!Array.isArray(data)) {
      // If it's a single object, wrap in array
      if (typeof data === 'object' && data !== null) {
        return jsonToCSV(JSON.stringify([data]), options);
      }
      return { success: false, result: '', error: 'JSON must be an array of objects or arrays' };
    }

    if (data.length === 0) {
      return { success: false, result: '', error: 'JSON array is empty' };
    }

    const lines: string[] = [];

    // Check if array of objects or array of arrays
    if (typeof data[0] === 'object' && !Array.isArray(data[0]) && data[0] !== null) {
      // Array of objects
      const headers = Object.keys(data[0]);

      if (options.includeHeaders) {
        lines.push(headers.map(escapeCSVField).join(options.delimiter));
      }

      for (const row of data) {
        const values = headers.map((header) => escapeCSVField(row[header]));
        lines.push(values.join(options.delimiter));
      }
    } else if (Array.isArray(data[0])) {
      // Array of arrays
      for (const row of data) {
        const values = (row as unknown[]).map(escapeCSVField);
        lines.push(values.join(options.delimiter));
      }
    } else {
      // Array of primitives
      for (const item of data) {
        lines.push(escapeCSVField(item));
      }
    }

    return {
      success: true,
      result: lines.join('\n'),
      rowCount: options.includeHeaders ? lines.length - 1 : lines.length,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { success: false, result: '', error: 'Invalid JSON format. Please check your JSON syntax.' };
    }
    return {
      success: false,
      result: '',
      error: `JSON conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'csv-to-json' | 'json-to-csv';
type Delimiter = ',' | ';' | '\t' | '|';

const DELIMITER_OPTIONS: { value: Delimiter; label: string }[] = [
  { value: ',', label: 'Comma (,)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '\t', label: 'Tab' },
  { value: '|', label: 'Pipe (|)' },
];

export default function CSVJSONConverter() {
  // Get tool metadata
  const tool = getToolBySlug('csv-json-converter');

  // State
  const [mode, setMode] = useState<Mode>('csv-to-json');
  const [input, setInput] = useState('');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [copySuccess, setCopySuccess] = useState(false);

  // Process conversion
  const conversionResult = useMemo(() => {
    if (!input.trim()) {
      return { success: false, result: '', error: undefined, rowCount: undefined };
    }

    if (mode === 'csv-to-json') {
      return csvToJSON(input, { hasHeaders, delimiter });
    } else {
      return jsonToCSV(input, { includeHeaders: hasHeaders, delimiter });
    }
  }, [input, mode, hasHeaders, delimiter]);

  // Handle mode switch
  const handleModeSwitch = useCallback((newMode: Mode) => {
    setMode(newMode);
    setInput('');
  }, []);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!conversionResult.success || !conversionResult.result) return;

    try {
      await navigator.clipboard.writeText(conversionResult.result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = conversionResult.result;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [conversionResult]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Load sample data
  const handleLoadSample = useCallback(() => {
    if (mode === 'csv-to-json') {
      setInput(`name,email,age,city
John Doe,john@example.com,28,New York
Jane Smith,jane@example.com,34,"Los Angeles"
Bob Johnson,bob@example.com,45,"San Francisco, CA"
Alice Brown,alice@example.com,29,Chicago`);
    } else {
      setInput(`[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28,
    "city": "New York"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 34,
    "city": "Los Angeles"
  },
  {
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "age": 45,
    "city": "San Francisco, CA"
  }
]`);
    }
  }, [mode]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our free <strong>CSV to JSON Converter</strong> instantly transforms data between CSV
          (Comma-Separated Values) and JSON (JavaScript Object Notation) formats. CSV is the standard
          format for spreadsheets and data exports, while JSON is essential for web APIs, databases,
          and modern applications. This tool handles complex cases like quoted values containing
          commas, multiple delimiters, and nested data structures. Perfect for developers migrating
          data between systems, analysts converting spreadsheet exports for APIs, and anyone working
          with data interoperability. <strong>All conversion happens in your browser</strong>—your
          data is never uploaded to any server, ensuring complete privacy for sensitive information.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('csv-to-json')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'csv-to-json'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              CSV → JSON
            </button>
            <button
              onClick={() => handleModeSwitch('json-to-csv')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'json-to-csv'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              JSON → CSV
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          {/* Delimiter selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="delimiter"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Delimiter:
            </label>
            <select
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as Delimiter)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              {DELIMITER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Headers toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={hasHeaders}
              onChange={(e) => setHasHeaders(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {mode === 'csv-to-json' ? 'First row is headers' : 'Include headers in output'}
            </span>
          </label>

          {/* Sample button */}
          <button
            onClick={handleLoadSample}
            className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline ml-auto"
          >
            Load Sample Data
          </button>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="converter-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>

            <textarea
              id="converter-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'csv-to-json'
                  ? 'Paste your CSV data here...\nname,email,age\nJohn,john@example.com,28'
                  : 'Paste your JSON array here...\n[{"name": "John", "email": "john@example.com"}]'
              }
              className="w-full h-64 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>

          {/* Output Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
              </label>
              {conversionResult.rowCount !== undefined && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {conversionResult.rowCount} rows
                </span>
              )}
            </div>

            <textarea
              value={conversionResult.success ? conversionResult.result : ''}
              readOnly
              placeholder={
                mode === 'csv-to-json'
                  ? 'JSON output will appear here...'
                  : 'CSV output will appear here...'
              }
              className={`w-full h-64 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
                conversionResult.error
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />

            {/* Error message */}
            {conversionResult.error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{conversionResult.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={handleCopy}
            disabled={!conversionResult.success}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Output'}
          </button>
          <button
            onClick={handleClear}
            disabled={!input}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => {
              if (conversionResult.success && conversionResult.result) {
                setInput(conversionResult.result);
                setMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json');
              }
            }}
            disabled={!conversionResult.success}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Swap & Convert Back
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Data Stays Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All CSV and JSON conversion happens directly in your browser using JavaScript. Your
              data is never uploaded to any server, stored, or transmitted. This tool works offline
              after the page loads—perfect for converting sensitive data like customer records or
              financial information.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the CSV to JSON Converter
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* CSV to JSON */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-teal-600">CSV → JSON</span>
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Select &quot;CSV → JSON&quot; mode</li>
              <li>Choose your delimiter (comma, semicolon, tab, or pipe)</li>
              <li>Check &quot;First row is headers&quot; if your CSV has column names</li>
              <li>Paste your CSV data in the input area</li>
              <li>View the JSON output and copy it</li>
            </ol>
          </div>

          {/* JSON to CSV */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-purple-600">JSON → CSV</span>
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Select &quot;JSON → CSV&quot; mode</li>
              <li>Choose your preferred delimiter</li>
              <li>Check &quot;Include headers&quot; to add column names</li>
              <li>Paste your JSON array in the input area</li>
              <li>View the CSV output and copy it</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Supported Formats */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Supported Formats
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">CSV Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Quoted values with commas inside</li>
              <li>Escaped quotes (&quot;&quot; within quoted fields)</li>
              <li>Multiple delimiters (comma, semicolon, tab, pipe)</li>
              <li>Windows and Unix line endings</li>
              <li>Optional header row</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">JSON Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>Array of objects (with headers)</li>
              <li>Array of arrays (raw data)</li>
              <li>Nested objects (flattened to JSON string)</li>
              <li>Pretty-printed output</li>
              <li>Proper escaping of special characters</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to format or validate your JSON? Use our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter & Viewer
          </Link>{' '}
          for pretty-printing and syntax highlighting. Want to encode data for transmission? Try our{' '}
          <Link
            href="/tools/base64-encoder-decoder"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Base64 Encoder/Decoder
          </Link>{' '}
          for text and file encoding.
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
              What is the difference between CSV and JSON?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>CSV (Comma-Separated Values)</strong> is a simple tabular format where data is
              organized in rows and columns, separated by commas or other delimiters. It&apos;s widely
              used in spreadsheets (Excel, Google Sheets) and data exports. <strong>JSON
              (JavaScript Object Notation)</strong> is a structured format that supports nested data,
              arrays, and key-value pairs. JSON is the standard for web APIs and modern applications.
              CSV is simpler and more compact for flat data; JSON is more flexible for complex structures.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How are commas inside values handled?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool follows RFC 4180, the CSV standard. Values containing commas, quotes, or
              newlines should be enclosed in double quotes. For example: <code>&quot;San Francisco, CA&quot;</code>.
              If a value contains quotes, they should be escaped by doubling: <code>&quot;He said &quot;&quot;Hello&quot;&quot;&quot;</code>.
              When converting JSON to CSV, the tool automatically adds quotes where needed and properly
              escapes special characters.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why should I check &quot;First row is headers&quot;?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              When enabled for CSV → JSON, the first row is treated as column names, producing an
              array of objects like <code>[{'{'}name: &quot;John&quot;, age: 28{'}'}]</code>. Without it, you get
              an array of arrays: <code>[[&quot;John&quot;, &quot;28&quot;]]</code>. For JSON → CSV, this option adds
              a header row with property names at the top of your CSV output. Most spreadsheet
              applications expect headers for proper column labeling.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I convert Excel files directly?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool works with CSV text, not Excel files (.xlsx, .xls) directly. To convert an
              Excel file: (1) Open the file in Excel or Google Sheets, (2) Export or &quot;Save As&quot; CSV
              format, (3) Open the CSV file in a text editor and copy the contents, (4) Paste into
              this converter. Most spreadsheet applications have a &quot;Save As CSV&quot; or &quot;Download as CSV&quot;
              option.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What happens to nested JSON objects?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              When converting JSON → CSV, nested objects and arrays are converted to their JSON string
              representation within the CSV cell. For example, <code>{'{'}address: {'{'}city: &quot;NYC&quot;{'}'}{'}'}</code>
              would become a cell containing <code>{'{&quot;city&quot;:&quot;NYC&quot;}'}</code>. This preserves the
              data but may need additional processing if you need flat columns. For truly nested data,
              consider flattening your JSON structure before conversion.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
