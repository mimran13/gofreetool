'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// SQL FORMATTER
// ============================================================================

const MAJOR_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
  'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'JOIN', 'INNER JOIN',
  'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
  'FULL OUTER JOIN', 'CROSS JOIN', 'ON', 'UNION', 'UNION ALL', 'EXCEPT',
  'INTERSECT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'AS', 'IN', 'NOT IN',
  'EXISTS', 'NOT EXISTS', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'INTO', 'WITH', 'RETURNING',
];

// Keywords that should start on their own line
const NEWLINE_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
  'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'JOIN', 'INNER JOIN',
  'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
  'FULL OUTER JOIN', 'CROSS JOIN', 'ON', 'UNION', 'UNION ALL', 'EXCEPT',
  'INTERSECT', 'WHEN', 'THEN', 'ELSE', 'END', 'WITH', 'RETURNING',
];

// Keywords that increase indent
const INDENT_KEYWORDS = ['SELECT', 'SET', 'VALUES'];

function formatSql(sql: string, indentSize: number, uppercase: boolean): string {
  if (!sql.trim()) return '';

  const indent = ' '.repeat(indentSize);
  let formatted = '';
  let currentIndent = 0;
  let i = 0;
  const input = sql.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Tokenize
  const tokens: { type: 'keyword' | 'string' | 'comment' | 'paren' | 'comma' | 'semicolon' | 'other'; value: string }[] = [];

  while (i < input.length) {
    // Skip whitespace
    if (/\s/.test(input[i])) {
      i++;
      continue;
    }

    // Single-line comment
    if (input[i] === '-' && input[i + 1] === '-') {
      let end = i;
      while (end < input.length && input[end] !== '\n') end++;
      tokens.push({ type: 'comment', value: input.slice(i, end) });
      i = end;
      continue;
    }

    // Block comment
    if (input[i] === '/' && input[i + 1] === '*') {
      let end = i + 2;
      while (end < input.length - 1 && !(input[end] === '*' && input[end + 1] === '/')) end++;
      tokens.push({ type: 'comment', value: input.slice(i, end + 2) });
      i = end + 2;
      continue;
    }

    // String literal
    if (input[i] === "'" || input[i] === '"') {
      const quote = input[i];
      let end = i + 1;
      while (end < input.length) {
        if (input[end] === quote) {
          if (end + 1 < input.length && input[end + 1] === quote) {
            end += 2; // Escaped quote
          } else {
            end++;
            break;
          }
        } else {
          end++;
        }
      }
      tokens.push({ type: 'string', value: input.slice(i, end) });
      i = end;
      continue;
    }

    // Parentheses
    if (input[i] === '(' || input[i] === ')') {
      tokens.push({ type: 'paren', value: input[i] });
      i++;
      continue;
    }

    // Comma
    if (input[i] === ',') {
      tokens.push({ type: 'comma', value: ',' });
      i++;
      continue;
    }

    // Semicolon
    if (input[i] === ';') {
      tokens.push({ type: 'semicolon', value: ';' });
      i++;
      continue;
    }

    // Check for multi-word keywords first
    let foundKeyword = false;
    for (const kw of MAJOR_KEYWORDS.sort((a, b) => b.length - a.length)) {
      const chunk = input.slice(i, i + kw.length).toUpperCase();
      if (chunk === kw) {
        // Make sure it's a word boundary
        const nextChar = input[i + kw.length];
        if (!nextChar || /[\s(,;)]/.test(nextChar)) {
          tokens.push({ type: 'keyword', value: kw });
          i += kw.length;
          foundKeyword = true;
          break;
        }
      }
    }
    if (foundKeyword) continue;

    // Other tokens (identifiers, numbers, operators)
    let end = i;
    while (end < input.length && !/[\s()',;"]/.test(input[end])) end++;
    if (end === i) end = i + 1; // Single special char
    tokens.push({ type: 'other', value: input.slice(i, end) });
    i = end;
  }

  // Format tokens
  let parenDepth = 0;
  let needsNewline = false;

  for (let t = 0; t < tokens.length; t++) {
    const token = tokens[t];

    if (token.type === 'comment') {
      if (formatted.length > 0 && !formatted.endsWith('\n')) {
        formatted += '\n';
      }
      formatted += indent.repeat(currentIndent) + token.value + '\n';
      needsNewline = false;
      continue;
    }

    if (token.type === 'semicolon') {
      formatted += ';\n\n';
      currentIndent = 0;
      needsNewline = false;
      continue;
    }

    if (token.type === 'paren') {
      if (token.value === '(') {
        formatted += ' (';
        parenDepth++;
      } else {
        parenDepth--;
        formatted += ')';
      }
      continue;
    }

    if (token.type === 'comma') {
      if (parenDepth > 0) {
        formatted += ', ';
      } else {
        formatted += ',\n' + indent.repeat(currentIndent + 1);
      }
      needsNewline = false;
      continue;
    }

    if (token.type === 'keyword' && parenDepth === 0) {
      const kwUpper = token.value.toUpperCase();
      const kwDisplay = uppercase ? kwUpper : token.value.toLowerCase();

      if (NEWLINE_KEYWORDS.includes(kwUpper)) {
        // Reset indent for major clauses
        if (['SELECT', 'FROM', 'WHERE', 'INSERT INTO', 'UPDATE', 'DELETE FROM',
             'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'WITH'].includes(kwUpper)) {
          currentIndent = 0;
        }

        if (formatted.length > 0 && !formatted.endsWith('\n')) {
          formatted += '\n';
        }
        formatted += indent.repeat(currentIndent) + kwDisplay;

        if (INDENT_KEYWORDS.includes(kwUpper)) {
          // Items after SELECT/SET go on next lines indented
        }

        needsNewline = false;
      } else {
        if (needsNewline) {
          formatted += '\n' + indent.repeat(currentIndent + 1);
        } else {
          formatted += ' ';
        }
        formatted += kwDisplay;
        needsNewline = false;
      }
      continue;
    }

    // String, other
    if (needsNewline && parenDepth === 0) {
      formatted += '\n' + indent.repeat(currentIndent + 1);
      needsNewline = false;
    }

    const display = token.type === 'keyword'
      ? (uppercase ? token.value.toUpperCase() : token.value.toLowerCase())
      : token.value;

    if (formatted.length > 0 && !formatted.endsWith('\n') && !formatted.endsWith('(') && !formatted.endsWith(' ')) {
      formatted += ' ';
    }
    formatted += display;
  }

  return formatted.trim();
}

function minifySql(sql: string): string {
  if (!sql.trim()) return '';

  let result = '';
  let i = 0;
  let inString = false;
  let stringChar = '';

  while (i < sql.length) {
    // Handle comments
    if (!inString && sql[i] === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      i++;
      continue;
    }
    if (!inString && sql[i] === '/' && sql[i + 1] === '*') {
      i += 2;
      while (i < sql.length - 1 && !(sql[i] === '*' && sql[i + 1] === '/')) i++;
      i += 2;
      continue;
    }

    // Handle strings
    if ((sql[i] === "'" || sql[i] === '"') && !inString) {
      inString = true;
      stringChar = sql[i];
      result += sql[i];
      i++;
      continue;
    }
    if (inString && sql[i] === stringChar) {
      if (sql[i + 1] === stringChar) {
        result += sql[i] + sql[i + 1];
        i += 2;
        continue;
      }
      inString = false;
      result += sql[i];
      i++;
      continue;
    }

    if (inString) {
      result += sql[i];
      i++;
      continue;
    }

    // Replace whitespace with single space
    if (/\s/.test(sql[i])) {
      if (result.length > 0 && result[result.length - 1] !== ' ') {
        result += ' ';
      }
      i++;
      continue;
    }

    result += sql[i];
    i++;
  }

  return result.trim();
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'format' | 'minify';

export default function SqlFormatter() {
  const tool = getToolBySlug('sql-formatter');

  const [mode, setMode] = useState<Mode>('format');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [uppercase, setUppercase] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Process
  const process = useCallback((text: string, m: Mode, indent: number, uc: boolean) => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    if (m === 'format') {
      setOutput(formatSql(text, indent, uc));
    } else {
      setOutput(minifySql(text));
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setInput(val);
      process(val, mode, indentSize, uppercase);
    },
    [mode, indentSize, uppercase, process]
  );

  const handleModeSwitch = useCallback(
    (m: Mode) => {
      setMode(m);
      process(input, m, indentSize, uppercase);
    },
    [input, indentSize, uppercase, process]
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
  }, []);

  const loadSample = useCallback(() => {
    const sample = `SELECT u.id, u.name, u.email, o.order_id, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND o.total > 100 ORDER BY o.total DESC LIMIT 10;`;
    setInput(sample);
    process(sample, mode, indentSize, uppercase);
  }, [mode, indentSize, uppercase, process]);

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
          Format and beautify your <strong>SQL queries</strong> instantly. Our free SQL formatter
          adds proper indentation, line breaks, and keyword formatting to make your queries
          readable. Supports SELECT, INSERT, UPDATE, DELETE, JOIN, subqueries, and more. Also
          includes a minify mode to compress SQL into a single line.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('format')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'format'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Format
            </button>
            <button
              onClick={() => handleModeSwitch('minify')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'minify'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Minify
            </button>
          </div>

          {/* Options (format mode only) */}
          {mode === 'format' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">Indent:</label>
                <select
                  value={indentSize}
                  onChange={(e) => {
                    const s = Number(e.target.value);
                    setIndentSize(s);
                    process(input, mode, s, uppercase);
                  }}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={1}>1 tab</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => {
                    setUppercase(e.target.checked);
                    process(input, mode, indentSize, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                UPPERCASE keywords
              </label>
            </div>
          )}
        </div>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="sql-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                SQL Input
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="sql-input"
              value={input}
              onChange={handleInputChange}
              placeholder="Paste your SQL query here..."
              className="w-full h-72 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'format' ? 'Formatted SQL' : 'Minified SQL'}
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
              placeholder={mode === 'format' ? 'Formatted SQL will appear here...' : 'Minified SQL will appear here...'}
              className="w-full h-72 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-lg resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={handleCopy}
            disabled={!output}
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
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All SQL formatting happens in your browser using JavaScript. Your queries are never
              sent to any server. Safe for formatting queries with sensitive table names, column
              names, or data.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the SQL Formatter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Paste your SQL</strong> — enter any SQL query into the left textarea, or click
            &quot;Load Sample&quot; to try with an example.
          </li>
          <li>
            <strong>Choose mode</strong> — &quot;Format&quot; beautifies your SQL with proper
            indentation, &quot;Minify&quot; compresses it to a single line.
          </li>
          <li>
            <strong>Customize options</strong> — select indent size (2 or 4 spaces) and toggle
            uppercase keywords on or off.
          </li>
          <li>
            <strong>Copy the result</strong> — click &quot;Copy Output&quot; to copy the formatted
            SQL to your clipboard.
          </li>
        </ol>
      </section>

      {/* Supported Statements */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Supported SQL Statements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '📋', title: 'SELECT Queries', desc: 'Format complex SELECT statements with JOINs, subqueries, and aggregations' },
            { icon: '➕', title: 'INSERT Statements', desc: 'Format INSERT INTO with VALUES and column lists' },
            { icon: '✏️', title: 'UPDATE Statements', desc: 'Format UPDATE with SET clauses and WHERE conditions' },
            { icon: '🗑️', title: 'DELETE Statements', desc: 'Format DELETE FROM with WHERE conditions' },
            { icon: '🏗️', title: 'CREATE/ALTER/DROP', desc: 'Format DDL statements for table management' },
            { icon: '🔗', title: 'JOINs & Subqueries', desc: 'INNER, LEFT, RIGHT, FULL, CROSS JOINs and nested queries' },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to format other languages? Try our{' '}
          <Link href="/tools/json-formatter-viewer" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            JSON Formatter
          </Link>, {' '}
          <Link href="/tools/html-formatter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            HTML Formatter
          </Link>, or{' '}
          <Link href="/tools/css-formatter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            CSS Formatter
          </Link>. For comparing SQL queries, use our{' '}
          <Link href="/tools/text-diff-checker" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Text Diff Checker
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
              Does this formatter validate SQL syntax?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No, this is a formatting tool, not a SQL validator. It reformats your SQL for
              readability but does not check whether the query is syntactically correct or will
              execute successfully. It preserves your SQL logic exactly as-is.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Which SQL dialects are supported?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This formatter works with standard SQL (ANSI SQL) and is compatible with MySQL,
              PostgreSQL, SQLite, SQL Server, and Oracle queries. It formats based on common keywords
              and structure rather than dialect-specific syntax.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Are my queries safe?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, absolutely. All formatting happens in your browser. Your SQL queries are never
              sent to any server, logged, or stored. This makes it safe to format queries containing
              sensitive table names, credentials, or business logic.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What does minify do?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Minify removes all unnecessary whitespace, line breaks, and comments from your SQL
              query, compressing it into a single line. This is useful for embedding SQL in code,
              reducing payload size in API requests, or logging queries more compactly.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
