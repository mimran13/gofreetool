'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// JSON ↔ XML CONVERSION HELPERS
// ============================================================================

function jsonToXml(json: unknown, rootName: string, indent: string, level: number): string {
  const pad = indent.repeat(level);
  const pad1 = indent.repeat(level + 1);

  if (json === null || json === undefined) {
    return `${pad}<${rootName}/>`;
  }

  if (typeof json === 'string' || typeof json === 'number' || typeof json === 'boolean') {
    return `${pad}<${rootName}>${escapeXml(String(json))}</${rootName}>`;
  }

  if (Array.isArray(json)) {
    if (json.length === 0) return `${pad}<${rootName}/>`;
    return json
      .map((item) => jsonToXml(item, rootName, indent, level))
      .join('\n');
  }

  if (typeof json === 'object') {
    const entries = Object.entries(json as Record<string, unknown>);
    if (entries.length === 0) return `${pad}<${rootName}/>`;

    const children = entries
      .map(([key, value]) => {
        const safeName = sanitizeTagName(key);
        return jsonToXml(value, safeName, indent, level + 1);
      })
      .join('\n');

    return `${pad}<${rootName}>\n${children}\n${pad}</${rootName}>`;
  }

  return `${pad}<${rootName}>${escapeXml(String(json))}</${rootName}>`;
}

function convertJsonToXml(jsonStr: string, rootName: string): { success: boolean; result: string; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    const indent = '  ';
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';

    if (Array.isArray(parsed)) {
      const itemName = rootName === 'root' ? 'item' : rootName;
      xml += `<${rootName}>\n`;
      xml += parsed.map((item) => jsonToXml(item, itemName, indent, 1)).join('\n');
      xml += `\n</${rootName}>`;
    } else {
      xml += jsonToXml(parsed, rootName, indent, 0);
    }

    return { success: true, result: xml };
  } catch (err) {
    return {
      success: false,
      result: '',
      error: `Invalid JSON: ${err instanceof Error ? err.message : 'Parse error'}`,
    };
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeTagName(name: string): string {
  // XML tag names must start with a letter or underscore
  let safe = name.replace(/[^a-zA-Z0-9_.-]/g, '_');
  if (/^[^a-zA-Z_]/.test(safe)) safe = '_' + safe;
  return safe || '_';
}

// Simple XML to JSON parser
function convertXmlToJson(xmlStr: string): { success: boolean; result: string; error?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr.trim(), 'text/xml');

    // Check for parse errors
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      return {
        success: false,
        result: '',
        error: `Invalid XML: ${errorNode.textContent?.slice(0, 200) || 'Parse error'}`,
      };
    }

    const rootElement = doc.documentElement;
    const json = xmlNodeToJson(rootElement);
    const result = JSON.stringify(json, null, 2);

    return { success: true, result };
  } catch (err) {
    return {
      success: false,
      result: '',
      error: `XML parse error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    };
  }
}

function xmlNodeToJson(node: Element): unknown {
  const result: Record<string, unknown> = {};

  // Handle attributes
  if (node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      result[`@${attr.name}`] = attr.value;
    }
  }

  // Handle child nodes
  const children = Array.from(node.childNodes);
  const elementChildren = children.filter((c) => c.nodeType === Node.ELEMENT_NODE) as Element[];
  const textContent = children
    .filter((c) => c.nodeType === Node.TEXT_NODE || c.nodeType === Node.CDATA_SECTION_NODE)
    .map((c) => c.textContent || '')
    .join('')
    .trim();

  if (elementChildren.length === 0) {
    // Leaf node
    if (node.attributes.length > 0) {
      if (textContent) result['#text'] = parseValue(textContent);
      return result;
    }
    return parseValue(textContent);
  }

  // Group children by tag name
  const childGroups: Record<string, unknown[]> = {};
  for (const child of elementChildren) {
    const tag = child.tagName;
    if (!childGroups[tag]) childGroups[tag] = [];
    childGroups[tag].push(xmlNodeToJson(child));
  }

  for (const [tag, values] of Object.entries(childGroups)) {
    result[tag] = values.length === 1 ? values[0] : values;
  }

  if (textContent) {
    result['#text'] = parseValue(textContent);
  }

  return result;
}

function parseValue(str: string): string | number | boolean | null {
  if (str === '') return '';
  if (str === 'true') return true;
  if (str === 'false') return false;
  if (str === 'null') return null;
  const num = Number(str);
  if (!isNaN(num) && str.trim() !== '') return num;
  return str;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'json-to-xml' | 'xml-to-json';

export default function JsonXmlConverter() {
  const tool = getToolBySlug('json-xml-converter');

  const [mode, setMode] = useState<Mode>('json-to-xml');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [rootName, setRootName] = useState('root');
  const [copySuccess, setCopySuccess] = useState(false);

  // Convert
  const convert = useCallback((text: string, currentMode: Mode, root: string) => {
    if (!text.trim()) {
      setOutput('');
      setError('');
      return;
    }

    if (currentMode === 'json-to-xml') {
      const result = convertJsonToXml(text, root);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Conversion failed');
      }
    } else {
      const result = convertXmlToJson(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Conversion failed');
      }
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setInput(val);
      convert(val, mode, rootName);
    },
    [mode, rootName, convert]
  );

  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      if (output && !error) {
        setInput(output);
        convert(output, newMode, rootName);
      } else {
        setInput('');
        setOutput('');
        setError('');
      }
    },
    [output, error, rootName, convert]
  );

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

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, []);

  // Sample data
  const sampleJson = `{
  "person": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "hobbies": ["reading", "coding", "gaming"],
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "country": "USA"
    }
  }
}`;

  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <age>30</age>
  <email>john@example.com</email>
  <hobbies>reading</hobbies>
  <hobbies>coding</hobbies>
  <hobbies>gaming</hobbies>
  <address>
    <street>123 Main St</street>
    <city>New York</city>
    <country>USA</country>
  </address>
</person>`;

  const loadSample = useCallback(() => {
    const sample = mode === 'json-to-xml' ? sampleJson : sampleXml;
    setInput(sample);
    convert(sample, mode, rootName);
  }, [mode, rootName, convert, sampleJson, sampleXml]);

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
          Convert between <strong>JSON and XML</strong> formats instantly. Transform JSON objects to
          well-formatted XML documents with proper indentation, or parse XML back into clean JSON.
          Supports nested objects, arrays, attributes, and mixed content. All conversion happens in
          your browser — no data is sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('json-to-xml')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'json-to-xml'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              JSON → XML
            </button>
            <button
              onClick={() => handleModeSwitch('xml-to-json')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'xml-to-json'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              XML → JSON
            </button>
          </div>
        </div>

        {/* Root element name (JSON to XML only) */}
        {mode === 'json-to-xml' && (
          <div className="mb-4">
            <label htmlFor="root-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Root Element Name
            </label>
            <input
              id="root-name"
              type="text"
              value={rootName}
              onChange={(e) => {
                const val = e.target.value || 'root';
                setRootName(val);
                if (input) convert(input, mode, val);
              }}
              className="w-48 px-3 py-2 text-sm font-mono border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="root"
            />
          </div>
        )}

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="converter-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'json-to-xml' ? 'JSON Input' : 'XML Input'}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="converter-input"
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === 'json-to-xml'
                  ? '{"key": "value", "items": [1, 2, 3]}'
                  : '<root>\n  <key>value</key>\n</root>'
              }
              className="w-full h-72 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-colors"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'json-to-xml' ? 'XML Output' : 'JSON Output'}
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
                mode === 'json-to-xml'
                  ? 'XML output will appear here...'
                  : 'JSON output will appear here...'
              }
              className={`w-full h-72 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
                error
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />

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
            onClick={loadSample}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Load Sample
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
                const newMode = mode === 'json-to-xml' ? 'xml-to-json' : 'json-to-xml';
                setMode(newMode as Mode);
                setInput(output);
                convert(output, newMode as Mode, rootName);
              }
            }}
            disabled={!output || !!error}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Swap & Convert
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
              All conversions happen in your browser using JavaScript&apos;s{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">JSON.parse</code> and{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">DOMParser</code> APIs.
              No data is sent to any server. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the JSON ↔ XML Converter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Choose conversion direction</strong> — select &quot;JSON → XML&quot; or
            &quot;XML → JSON&quot; using the toggle.
          </li>
          <li>
            <strong>Paste your data</strong> — enter JSON or XML content in the left textarea, or
            click &quot;Load Sample&quot; to try with example data.
          </li>
          <li>
            <strong>Set the root element</strong> — when converting JSON to XML, specify the root
            element name (defaults to &quot;root&quot;).
          </li>
          <li>
            <strong>View the conversion</strong> — output appears instantly in the right textarea
            with proper formatting and indentation.
          </li>
          <li>
            <strong>Copy or swap</strong> — copy the output to your clipboard, or use &quot;Swap &
            Convert&quot; to reverse the conversion.
          </li>
        </ol>
      </section>

      {/* JSON vs XML */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          JSON vs XML: Key Differences
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Feature</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">JSON</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">XML</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Readability</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Compact, easy to read</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Verbose, self-describing</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Data Types</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Strings, numbers, booleans, arrays, objects, null</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">All text (no native types)</td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Arrays</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Native support</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Repeated elements (no array syntax)</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Attributes</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Not supported</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Native support</td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">Use Cases</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">REST APIs, web apps, config files</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">SOAP APIs, RSS, SVG, config files</td>
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
            { icon: '🔄', title: 'API Migration', desc: 'Convert between REST (JSON) and SOAP (XML) API formats' },
            { icon: '📊', title: 'Data Exchange', desc: 'Transform data between systems using different formats' },
            { icon: '⚙️', title: 'Config Files', desc: 'Convert application configuration between JSON and XML' },
            { icon: '📡', title: 'RSS/Atom Feeds', desc: 'Parse XML feeds into JSON for web application consumption' },
            { icon: '🧪', title: 'Testing', desc: 'Generate test data in both formats for API testing' },
            { icon: '📋', title: 'Documentation', desc: 'Show data structures in both formats for documentation' },
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
          Need to format JSON? Try our{' '}
          <Link href="/tools/json-formatter-viewer" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            JSON Formatter & Viewer
          </Link>. For YAML conversion, use our{' '}
          <Link href="/tools/json-yaml-converter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            JSON ↔ YAML Converter
          </Link>. Converting CSV data? Check our{' '}
          <Link href="/tools/csv-json-converter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            CSV ↔ JSON Converter
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
              How are JSON arrays converted to XML?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              JSON arrays are converted to repeated XML elements with the same tag name. For
              example, <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">{`"colors": ["red", "blue"]`}</code> becomes{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">{`<colors>red</colors><colors>blue</colors>`}</code>.
              When converting back, repeated elements are automatically detected and converted to arrays.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How are XML attributes handled?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              When converting XML to JSON, attributes are prefixed with <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">@</code>.
              For example, <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">{`<person id="1">`}</code> becomes{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">{`{"@id": "1"}`}</code>.
              Text content of elements with attributes is stored in <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">#text</code>.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is the conversion lossless?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              JSON to XML conversion is generally lossless for common data structures. However, XML
              to JSON conversion may lose some information like comments, processing instructions,
              CDATA sections, and namespace prefixes. Data types in JSON (numbers, booleans) become
              text in XML and are heuristically parsed when converting back.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is the root element name for?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              XML requires a single root element wrapping all content. When converting JSON to XML,
              you can specify this root element name (defaults to &quot;root&quot;). For example, if
              your JSON represents a user, you might set it to &quot;user&quot; for more meaningful XML output.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
