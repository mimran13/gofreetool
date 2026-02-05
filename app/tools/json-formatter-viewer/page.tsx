'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// TYPES
// ============================================================================

interface JsonNode {
  key: string;
  value: unknown;
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';
  depth: number;
  path: string;
}

interface ParseResult {
  success: boolean;
  data?: unknown;
  error?: string;
  formatted?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Safely parse JSON with error handling
 */
function safeParseJson(input: string): ParseResult {
  if (!input.trim()) {
    return { success: false, error: 'Please enter JSON data' };
  }

  try {
    const data = JSON.parse(input);
    const formatted = JSON.stringify(data, null, 2);
    return { success: true, data, formatted };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON';
    return { success: false, error: `JSON Parse Error: ${error}` };
  }
}

/**
 * Get the type of a JSON value
 */
function getJsonType(value: unknown): JsonNode['type'] {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value as JsonNode['type'];
}

/**
 * Count items in object or array
 */
function countItems(value: unknown): number {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length;
  return 0;
}

// ============================================================================
// JSON TREE VIEWER COMPONENT
// ============================================================================

interface JsonTreeNodeProps {
  nodeKey: string;
  value: unknown;
  depth: number;
  isLast: boolean;
  expandedPaths: Set<string>;
  togglePath: (path: string) => void;
  path: string;
}

function JsonTreeNode({
  nodeKey,
  value,
  depth,
  isLast,
  expandedPaths,
  togglePath,
  path
}: JsonTreeNodeProps) {
  const type = getJsonType(value);
  const isExpandable = type === 'object' || type === 'array';
  const isExpanded = expandedPaths.has(path);
  const itemCount = countItems(value);

  // Indentation based on depth
  const indent = depth * 16;

  // Render primitive values with syntax highlighting
  const renderValue = () => {
    switch (type) {
      case 'string':
        return <span className="text-green-600 dark:text-green-400">&quot;{String(value)}&quot;</span>;
      case 'number':
        return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>;
      case 'boolean':
        return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
      case 'null':
        return <span className="text-gray-500 dark:text-gray-400">null</span>;
      default:
        return null;
    }
  };

  // Render expandable containers (objects/arrays)
  if (isExpandable) {
    const openBracket = type === 'array' ? '[' : '{';
    const closeBracket = type === 'array' ? ']' : '}';

    return (
      <div className="font-mono text-sm">
        <div
          className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer py-0.5 rounded"
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => togglePath(path)}
        >
          {/* Expand/Collapse indicator */}
          <span className="w-4 h-4 flex items-center justify-center mr-1 text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </span>

          {/* Key name (if not root or array index) */}
          {nodeKey && (
            <>
              <span className="text-red-600 dark:text-red-400">&quot;{nodeKey}&quot;</span>
              <span className="text-gray-600 dark:text-gray-400 mx-1">:</span>
            </>
          )}

          {/* Opening bracket and item count when collapsed */}
          <span className="text-gray-700 dark:text-gray-300">{openBracket}</span>
          {!isExpanded && (
            <>
              <span className="text-gray-400 mx-1">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-gray-700 dark:text-gray-300">{closeBracket}</span>
            </>
          )}
        </div>

        {/* Render children when expanded */}
        {isExpanded && (
          <>
            {type === 'array' ? (
              (value as unknown[]).map((item, index) => (
                <JsonTreeNode
                  key={`${path}[${index}]`}
                  nodeKey=""
                  value={item}
                  depth={depth + 1}
                  isLast={index === (value as unknown[]).length - 1}
                  expandedPaths={expandedPaths}
                  togglePath={togglePath}
                  path={`${path}[${index}]`}
                />
              ))
            ) : (
              Object.entries(value as Record<string, unknown>).map(([k, v], index, arr) => (
                <JsonTreeNode
                  key={`${path}.${k}`}
                  nodeKey={k}
                  value={v}
                  depth={depth + 1}
                  isLast={index === arr.length - 1}
                  expandedPaths={expandedPaths}
                  togglePath={togglePath}
                  path={`${path}.${k}`}
                />
              ))
            )}
            <div style={{ paddingLeft: `${indent}px` }} className="py-0.5">
              <span className="w-4 h-4 inline-block mr-1"></span>
              <span className="text-gray-700 dark:text-gray-300">{closeBracket}</span>
              {!isLast && <span className="text-gray-600">,</span>}
            </div>
          </>
        )}
      </div>
    );
  }

  // Render primitive values
  return (
    <div
      className="font-mono text-sm py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
      style={{ paddingLeft: `${indent + 20}px` }}
    >
      {nodeKey && (
        <>
          <span className="text-red-600 dark:text-red-400">&quot;{nodeKey}&quot;</span>
          <span className="text-gray-600 dark:text-gray-400 mx-1">:</span>
        </>
      )}
      {renderValue()}
      {!isLast && <span className="text-gray-600">,</span>}
    </div>
  );
}

// ============================================================================
// JSON TREE VIEWER WRAPPER
// ============================================================================

interface JsonTreeViewerProps {
  data: unknown;
}

function JsonTreeViewer({ data }: JsonTreeViewerProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));

  const togglePath = useCallback((path: string) => {
    setExpandedPaths(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const paths = new Set<string>(['root']);

    const collectPaths = (value: unknown, path: string) => {
      if (Array.isArray(value)) {
        paths.add(path);
        value.forEach((item, index) => collectPaths(item, `${path}[${index}]`));
      } else if (typeof value === 'object' && value !== null) {
        paths.add(path);
        Object.entries(value).forEach(([k, v]) => collectPaths(v, `${path}.${k}`));
      }
    };

    collectPaths(data, 'root');
    setExpandedPaths(paths);
  }, [data]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set(['root']));
  }, []);

  return (
    <div>
      {/* Tree controls */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={expandAll}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
        >
          Collapse All
        </button>
      </div>

      {/* Tree view */}
      <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 overflow-auto h-[65vh]">
        <JsonTreeNode
          nodeKey=""
          value={data}
          depth={0}
          isLast={true}
          expandedPaths={expandedPaths}
          togglePath={togglePath}
          path="root"
        />
      </div>
    </div>
  );
}

// ============================================================================
// SYNTAX HIGHLIGHTED CODE VIEW
// ============================================================================

interface SyntaxHighlightedJsonProps {
  json: string;
}

function SyntaxHighlightedJson({ json }: SyntaxHighlightedJsonProps) {
  // Tokenize and highlight JSON string
  const highlighted = useMemo(() => {
    return json
      // Highlight keys (property names)
      .replace(/"([^"]+)":/g, '<span class="text-red-600 dark:text-red-400">"$1"</span>:')
      // Highlight string values
      .replace(/: "([^"]*)"/g, ': <span class="text-green-600 dark:text-green-400">"$1"</span>')
      // Highlight numbers
      .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-blue-600 dark:text-blue-400">$1</span>')
      // Highlight booleans
      .replace(/: (true|false)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      // Highlight null
      .replace(/: (null)/g, ': <span class="text-gray-500 dark:text-gray-400">$1</span>');
  }, [json]);

  return (
    <pre
      className="font-mono text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 overflow-auto h-[65vh] whitespace-pre"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type ViewMode = 'formatted' | 'tree';

export default function JsonFormatterViewer() {
  // Get tool metadata
  const tool = getToolBySlug('json-formatter-viewer');

  // State
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [copySuccess, setCopySuccess] = useState(false);

  // Parse and validate JSON whenever input changes
  const parseResult = useMemo(() => safeParseJson(input), [input]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (parseResult.formatted) {
      try {
        await navigator.clipboard.writeText(parseResult.formatted);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = parseResult.formatted;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  }, [parseResult.formatted]);

  // Handle clear/reset
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Handle sample JSON
  const handleLoadSample = useCallback(() => {
    const sample = {
      name: "John Doe",
      age: 30,
      isActive: true,
      email: null,
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
      },
      hobbies: ["reading", "gaming", "coding"],
      projects: [
        { id: 1, title: "Website Redesign", completed: true },
        { id: 2, title: "Mobile App", completed: false }
      ]
    };
    setInput(JSON.stringify(sample, null, 2));
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our free <strong>JSON Formatter & Viewer</strong> helps developers and data professionals
          instantly format, validate, and explore JSON data. Paste your minified or messy JSON and
          get beautifully formatted output with syntax highlighting. The interactive tree view lets
          you expand and collapse nested objects for easy navigation. Perfect for debugging APIs,
          working with configuration files, or analyzing data structures. <strong>100% client-side
          processing</strong> means your data never leaves your browser, ensuring complete privacy
          and security. No signup required, no data stored, no limits.
        </p>
      </ToolContent>

      {/* Main Tool Interface */}
      <ToolInterface className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="json-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Input JSON
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
              >
                Load Sample
              </button>
            </div>

            <textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here, e.g., {"name": "John", "age": 30}'
              className={`w-full h-[65vh] px-5 py-4 font-mono text-sm leading-relaxed border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors ${
                input && !parseResult.success
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
              aria-describedby="json-error"
            />

            {/* Error message */}
            {input && !parseResult.success && (
              <div
                id="json-error"
                className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                role="alert"
              >
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  {parseResult.error}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleClear}
                disabled={!input}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleCopy}
                disabled={!parseResult.success}
                className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {copySuccess ? 'Copied!' : 'Copy Formatted'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Output
              </span>

              {/* View mode toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('formatted')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'formatted'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Formatted
                </button>
                <button
                  onClick={() => setViewMode('tree')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    viewMode === 'tree'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Tree View
                </button>
              </div>
            </div>

            {/* Output display */}
            {parseResult.success && parseResult.formatted ? (
              viewMode === 'formatted' ? (
                <SyntaxHighlightedJson json={parseResult.formatted} />
              ) : (
                <JsonTreeViewer data={parseResult.data} />
              )
            ) : (
              <div className="h-[65vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                  {input ? 'Fix the JSON errors to see output' : 'Enter valid JSON to see formatted output'}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3 min-h-[40px] items-center">
              {parseResult.success && (
                <>
                  <span>Characters: {parseResult.formatted?.length.toLocaleString()}</span>
                  <span>Lines: {parseResult.formatted?.split('\n').length.toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      </ToolInterface>

      {/* Privacy Notice */}
      <ToolContent className="mb-12">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Data Stays Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All JSON processing happens directly in your browser. Your data is never sent to any server,
              stored, or logged. You can even use this tool offline after the page loads.
            </p>
          </div>
        </div>
        </div>
      </ToolContent>

      {/* How to Use Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the JSON Formatter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Paste your JSON</strong> into the input textarea on the left. You can paste minified,
            unformatted, or messy JSON data.
          </li>
          <li>
            <strong>View the formatted output</strong> instantly on the right panel with proper indentation
            and syntax highlighting.
          </li>
          <li>
            <strong>Switch to Tree View</strong> to explore nested objects and arrays interactively.
            Click on any object or array to expand or collapse it.
          </li>
          <li>
            <strong>Copy the formatted JSON</strong> using the &quot;Copy Formatted&quot; button to use it in your
            code, documentation, or share with colleagues.
          </li>
          <li>
            <strong>Fix errors</strong> if the validator detects invalid JSON. The error message will
            tell you exactly what went wrong.
          </li>
        </ol>
      </ToolContent>

      {/* Features Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '✨', title: 'Pretty Print', desc: 'Automatically formats JSON with proper indentation' },
            { icon: '🎨', title: 'Syntax Highlighting', desc: 'Color-coded keys, strings, numbers, and booleans' },
            { icon: '🌳', title: 'Tree View', desc: 'Interactive expand/collapse for nested structures' },
            { icon: '⚡', title: 'Real-time Validation', desc: 'Instant feedback on JSON syntax errors' },
            { icon: '📋', title: 'One-Click Copy', desc: 'Copy formatted JSON to clipboard instantly' },
            { icon: '🔒', title: 'Privacy First', desc: '100% client-side, no server processing' },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ToolContent>

      {/* Related Tools */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Working with HTML code? Try our{' '}
            <a
              href="/tools/html-formatter"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              HTML Formatter & Beautifier
            </a>
            . Need to parse URLs? Use our{' '}
            <a
              href="/tools/url-parser"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              URL Parser
            </a>{' '}
            to break down complex URLs and query strings.
          </p>
        </div>
      </ToolContent>

      {/* FAQ Section */}
      <ToolContent className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is JSON and why do I need to format it?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              JSON (JavaScript Object Notation) is a lightweight data format used for storing and
              exchanging data between servers and applications. Raw JSON is often minified (compressed
              without spaces or line breaks) to reduce file size. Formatting makes it human-readable
              with proper indentation, making it easier to understand, debug, and edit.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data safe when using this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, absolutely. This JSON formatter runs entirely in your browser using JavaScript.
              Your data never leaves your computer and is not sent to any server. There&apos;s no backend
              processing, no logging, and no data storage. Once you close or refresh the page,
              your data is gone. You can even disconnect from the internet and the tool will
              continue to work.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What does &quot;Invalid JSON&quot; error mean?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              JSON has strict syntax rules. Common errors include: missing or extra commas,
              unquoted keys (keys must be in double quotes), single quotes instead of double quotes,
              trailing commas after the last item, and unescaped special characters. The error
              message will indicate where the parser encountered the problem.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I format large JSON files?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, this tool can handle reasonably large JSON data. However, extremely large files
              (several megabytes) may cause your browser to slow down since all processing happens
              locally. For very large files, consider using a desktop JSON editor or splitting
              the data into smaller chunks.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What&apos;s the difference between Formatted and Tree View?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>Formatted View</strong> shows the JSON as text with syntax highlighting and
              proper indentation - perfect for copying and pasting into code. <strong>Tree View</strong>
              displays the JSON as an interactive, collapsible structure where you can expand
              and collapse nested objects and arrays - ideal for exploring complex data.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
