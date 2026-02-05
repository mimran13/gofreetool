'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import yaml from 'js-yaml';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// SAMPLE DATA
// ============================================================================

const JSON_SAMPLE = JSON.stringify({
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: {
    name: "web-app",
    labels: { app: "web", environment: "production" }
  },
  spec: {
    replicas: 3,
    selector: { matchLabels: { app: "web" } },
    template: {
      metadata: { labels: { app: "web" } },
      spec: {
        containers: [{
          name: "web",
          image: "nginx:1.24",
          ports: [{ containerPort: 80 }]
        }]
      }
    }
  }
}, null, 2);

const YAML_SAMPLE = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
    environment: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: 'nginx:1.24'
          ports:
            - containerPort: 80`;

// ============================================================================
// TYPES
// ============================================================================

type Direction = 'json-to-yaml' | 'yaml-to-json';

interface ConversionResult {
  success: boolean;
  output?: string;
  error?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function JsonYamlConverter() {
  // Get tool metadata
  const tool = getToolBySlug('json-yaml-converter');

  // State
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<Direction>('json-to-yaml');
  const [copySuccess, setCopySuccess] = useState(false);

  // Real-time conversion via useMemo
  const conversionResult: ConversionResult = useMemo(() => {
    if (!input.trim()) {
      return { success: false };
    }

    try {
      if (direction === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        const output = yaml.dump(parsed, { indent: 2, lineWidth: -1 });
        return { success: true, output };
      } else {
        const parsed = yaml.load(input);
        const output = JSON.stringify(parsed, null, 2);
        return { success: true, output };
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : 'Unknown error';
      return { success: false, error };
    }
  }, [input, direction]);

  // Handle direction switch
  const handleDirectionSwitch = useCallback((newDirection: Direction) => {
    setDirection(newDirection);
    setInput('');
  }, []);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!conversionResult.success || !conversionResult.output) return;

    try {
      await navigator.clipboard.writeText(conversionResult.output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = conversionResult.output;
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
    if (direction === 'json-to-yaml') {
      setInput(JSON_SAMPLE);
    } else {
      setInput(YAML_SAMPLE);
    }
  }, [direction]);

  if (!tool) return <div>Tool not found</div>;

  const inputLabel = direction === 'json-to-yaml' ? 'JSON Input' : 'YAML Input';
  const outputLabel = direction === 'json-to-yaml' ? 'YAML Output' : 'JSON Output';
  const inputPlaceholder = direction === 'json-to-yaml'
    ? 'Paste your JSON here...\n{\n  "key": "value"\n}'
    : 'Paste your YAML here...\nkey: value\nlist:\n  - item1\n  - item2';

  return (
    <ToolLayout tool={tool}>
      {/* ================================================================
          1. INTRODUCTION
          ================================================================ */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our free <strong>JSON to YAML Converter</strong> instantly transforms data between{' '}
          <strong>JSON</strong> (JavaScript Object Notation) and <strong>YAML</strong> (YAML
          Ain&apos;t Markup Language) formats. JSON is the standard for web APIs and data exchange,
          while YAML is the preferred format for <strong>Kubernetes manifests</strong>,{' '}
          <strong>Docker Compose files</strong>, <strong>Ansible playbooks</strong>, and CI/CD
          pipeline configurations. This tool validates your input in real time and shows clear
          error messages for any syntax issues. Perfect for DevOps engineers, backend developers,
          and anyone working with configuration files.{' '}
          <strong>All conversion happens in your browser</strong>&mdash;your data is never
          uploaded to any server, ensuring complete privacy for sensitive configurations.
        </p>
      </ToolContent>

      {/* ================================================================
          2. MAIN TOOL INTERFACE
          ================================================================ */}
      <ToolInterface className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Direction Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-4">
            <button
              onClick={() => handleDirectionSwitch('json-to-yaml')}
              className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                direction === 'json-to-yaml'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              JSON → YAML
            </button>
            <button
              onClick={() => handleDirectionSwitch('yaml-to-json')}
              className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                direction === 'yaml-to-json'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              YAML → JSON
            </button>
          </div>

          {/* Input / Output Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="converter-input"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {inputLabel}
                </label>
                <button
                  onClick={handleLoadSample}
                  className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
                >
                  Load Sample
                </button>
              </div>

              <textarea
                id="converter-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputPlaceholder}
                className={`w-full h-[65vh] px-5 py-4 font-mono text-sm border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none ${
                  input && !conversionResult.success && conversionResult.error
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white'
                }`}
                spellCheck={false}
                aria-describedby="conversion-error"
              />

              {/* Error message */}
              {input && !conversionResult.success && conversionResult.error && (
                <div
                  id="conversion-error"
                  className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  role="alert"
                >
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                    {direction === 'json-to-yaml' ? 'Invalid JSON: ' : 'Invalid YAML: '}
                    {conversionResult.error}
                  </p>
                </div>
              )}
            </div>

            {/* Output Panel */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {outputLabel}
                </label>
                {conversionResult.success && conversionResult.output && (
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    {conversionResult.output.split('\n').length} lines
                  </span>
                )}
              </div>

              {conversionResult.success && conversionResult.output ? (
                <pre
                  className="w-full h-[65vh] px-5 py-4 font-mono text-sm border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl overflow-auto whitespace-pre"
                >
                  {conversionResult.output}
                </pre>
              ) : (
                <div className="w-full h-[65vh] flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    {input
                      ? 'Fix the input errors to see output'
                      : `Enter valid ${direction === 'json-to-yaml' ? 'JSON' : 'YAML'} to see converted output`}
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
              onClick={handleCopy}
              disabled={!conversionResult.success}
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
                All JSON and YAML conversion happens directly in your browser using JavaScript.
                Your data is never uploaded to any server, stored, or transmitted. This tool works
                offline after the page loads&mdash;perfect for converting sensitive configuration
                files, API keys, and infrastructure definitions.
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
          How to Use the JSON YAML Converter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Choose a direction</strong>&mdash;select &quot;JSON → YAML&quot; or &quot;YAML → JSON&quot;
            using the toggle at the top.
          </li>
          <li>
            <strong>Paste your data</strong> into the input panel on the left. You can also click
            &quot;Load Sample&quot; to try a Kubernetes Deployment example.
          </li>
          <li>
            <strong>View the converted output</strong> instantly on the right panel. The conversion
            updates in real time as you type or edit.
          </li>
          <li>
            <strong>Fix any errors</strong> if the validator detects invalid syntax. A clear error
            message below the input will tell you exactly what went wrong.
          </li>
          <li>
            <strong>Copy the output</strong> using the &quot;Copy Output&quot; button, then paste it
            into your config files, CI/CD pipelines, or code editors.
          </li>
        </ol>
      </ToolContent>

      {/* ================================================================
          5. FEATURES
          ================================================================ */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '&#x26A1;', title: 'Real-time Conversion', desc: 'Output updates instantly as you type or paste input' },
            { icon: '&#x2705;', title: 'Input Validation', desc: 'Clear error messages for invalid JSON or YAML syntax' },
            { icon: '&#x1F504;', title: 'Bidirectional', desc: 'Convert JSON to YAML or YAML to JSON with a single toggle' },
            { icon: '&#x1F4CB;', title: 'One-Click Copy', desc: 'Copy converted output to clipboard instantly' },
            { icon: '&#x1F512;', title: 'Privacy First', desc: '100% client-side processing, no server involvement' },
            { icon: '&#x1F4E6;', title: 'Sample Data', desc: 'Load a Kubernetes Deployment manifest to try it out' },
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
          6. RELATED TOOLS
          ================================================================ */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Need to format or validate your JSON? Use our{' '}
            <Link
              href="/tools/json-formatter-viewer"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON Formatter &amp; Viewer
            </Link>
            . Working with regular expressions? Try our{' '}
            <Link
              href="/tools/regex-tester"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              Regex Tester
            </Link>
            . Converting between CSV and JSON? Check out the{' '}
            <Link
              href="/tools/csv-json-converter"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              CSV-JSON Converter
            </Link>
            .
          </p>
        </div>
      </ToolContent>

      {/* ================================================================
          7. FAQ
          ================================================================ */}
      <ToolContent className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is JSON?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>JSON (JavaScript Object Notation)</strong> is a lightweight data-interchange
              format that is easy for humans to read and write and easy for machines to parse and
              generate. It uses key-value pairs and ordered lists (arrays), and is the most common
              format for web APIs, configuration files, and data storage. JSON is language-independent
              and supported by virtually every programming language.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is YAML?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>YAML (YAML Ain&apos;t Markup Language)</strong> is a human-friendly data
              serialization format commonly used for configuration files. Instead of braces and
              brackets, YAML relies on indentation to represent structure, making it significantly
              more readable for complex configurations. YAML is the standard format for{' '}
              <strong>Kubernetes</strong> manifests, <strong>Docker Compose</strong> files,{' '}
              <strong>Ansible</strong> playbooks, GitHub Actions workflows, and many CI/CD pipeline
              definitions.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data uploaded to any server?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No, absolutely not. All conversion happens entirely in your browser using JavaScript.
              Your data never leaves your device&mdash;nothing is sent to any server, stored, or
              logged. You can even disconnect from the internet after the page loads and the tool
              will continue to work perfectly. This makes it safe for converting sensitive
              configurations containing API keys, database credentials, or internal infrastructure
              details.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              When should I use YAML over JSON?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              YAML is generally preferred for <strong>configuration files</strong> that humans read
              and edit frequently, because its indentation-based syntax is cleaner and more readable
              than JSON&apos;s braces and brackets. Use YAML for Kubernetes configs, Docker Compose,
              Ansible playbooks, and CI/CD pipelines. Use JSON when you need strict parsing (JSON
              has no ambiguous syntax), when working with web APIs, or when the data is primarily
              machine-generated and consumed. JSON is also better for data interchange between
              services due to its simpler specification.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does this support YAML anchors and aliases?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool provides basic support for YAML anchors (<code>&amp;</code>) and aliases
              (<code>*</code>) through the <code>js-yaml</code> library. When converting YAML to
              JSON, anchors and aliases are resolved and expanded into their full values in the JSON
              output. However, when converting JSON to YAML, the output will not re-create anchors
              since JSON has no equivalent concept. For complex YAML documents with heavy use of
              anchors, the converted JSON will contain the fully expanded data.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
