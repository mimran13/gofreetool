'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// HTML FORMATTING HELPERS
// ============================================================================

interface FormatResult {
  success: boolean;
  formatted?: string;
  error?: string;
  stats?: {
    lines: number;
    characters: number;
    tags: number;
  };
}

/**
 * Format and beautify HTML with proper indentation
 */
function formatHTML(html: string, indentSize: number = 2): FormatResult {
  if (!html.trim()) {
    return { success: false, error: 'Please enter HTML code to format' };
  }

  try {
    const indent = ' '.repeat(indentSize);
    let formatted = '';
    let indentLevel = 0;
    let inPreTag = false;
    let inScriptTag = false;
    let inStyleTag = false;
    let tagCount = 0;

    // Self-closing tags that don't need closing tags
    const voidElements = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);

    // Tags that should preserve whitespace
    const preserveWhitespace = new Set(['pre', 'code', 'textarea']);

    // Inline elements that shouldn't force new lines
    const inlineElements = new Set([
      'a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite',
      'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map',
      'object', 'output', 'q', 'samp', 'script', 'select', 'small', 'span',
      'strong', 'sub', 'sup', 'textarea', 'time', 'tt', 'var'
    ]);

    // Clean up the input
    let cleanedHtml = html
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();

    // Tokenize the HTML
    const tokens: string[] = [];
    let current = '';
    let inTag = false;
    let inComment = false;

    for (let i = 0; i < cleanedHtml.length; i++) {
      const char = cleanedHtml[i];

      // Handle comments
      if (cleanedHtml.slice(i, i + 4) === '<!--') {
        if (current.trim()) tokens.push(current.trim());
        current = '';
        inComment = true;
        const endComment = cleanedHtml.indexOf('-->', i);
        if (endComment !== -1) {
          tokens.push(cleanedHtml.slice(i, endComment + 3));
          i = endComment + 2;
        }
        inComment = false;
        continue;
      }

      if (char === '<' && !inComment) {
        if (current.trim()) tokens.push(current.trim());
        current = '<';
        inTag = true;
      } else if (char === '>' && inTag && !inComment) {
        current += '>';
        tokens.push(current);
        current = '';
        inTag = false;
      } else {
        current += char;
      }
    }
    if (current.trim()) tokens.push(current.trim());

    // Process tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Handle comments
      if (token.startsWith('<!--')) {
        formatted += indent.repeat(indentLevel) + token + '\n';
        continue;
      }

      // Handle DOCTYPE
      if (token.toLowerCase().startsWith('<!doctype')) {
        formatted += token + '\n';
        continue;
      }

      // Handle tags
      if (token.startsWith('<')) {
        const isClosingTag = token.startsWith('</');
        const isSelfClosing = token.endsWith('/>');
        const tagMatch = token.match(/<\/?([a-zA-Z0-9]+)/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';

        if (tagName) tagCount++;

        // Track pre/script/style tags for special handling
        if (tagName === 'pre') inPreTag = !isClosingTag;
        if (tagName === 'script') inScriptTag = !isClosingTag;
        if (tagName === 'style') inStyleTag = !isClosingTag;

        // Check if this is a void element
        const isVoidElement = voidElements.has(tagName);
        const isInlineElement = inlineElements.has(tagName);

        if (isClosingTag) {
          indentLevel = Math.max(0, indentLevel - 1);
          formatted += indent.repeat(indentLevel) + token + '\n';
        } else if (isSelfClosing || isVoidElement) {
          formatted += indent.repeat(indentLevel) + token + '\n';
        } else {
          formatted += indent.repeat(indentLevel) + token + '\n';
          if (!isVoidElement && !isInlineElement) {
            indentLevel++;
          } else if (!isVoidElement) {
            indentLevel++;
          }
        }
      } else {
        // Handle text content
        const trimmedToken = token.trim();
        if (trimmedToken) {
          if (inPreTag || inScriptTag || inStyleTag) {
            formatted += token + '\n';
          } else {
            formatted += indent.repeat(indentLevel) + trimmedToken + '\n';
          }
        }
      }
    }

    // Clean up extra blank lines
    formatted = formatted
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return {
      success: true,
      formatted,
      stats: {
        lines: formatted.split('\n').length,
        characters: formatted.length,
        tags: tagCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Minify HTML by removing unnecessary whitespace
 */
function minifyHTML(html: string): FormatResult {
  if (!html.trim()) {
    return { success: false, error: 'Please enter HTML code to minify' };
  }

  try {
    const minified = html
      .replace(/<!--[\s\S]*?-->/g, '')           // Remove comments
      .replace(/\s+/g, ' ')                       // Collapse whitespace
      .replace(/>\s+</g, '><')                    // Remove space between tags
      .replace(/\s+>/g, '>')                      // Remove space before >
      .replace(/<\s+/g, '<')                      // Remove space after <
      .trim();

    const tagMatches = minified.match(/<[^>]+>/g);

    return {
      success: true,
      formatted: minified,
      stats: {
        lines: 1,
        characters: minified.length,
        tags: tagMatches ? tagMatches.length : 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: `Minifying error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// ============================================================================
// SYNTAX HIGHLIGHTING COMPONENT
// ============================================================================

interface SyntaxHighlightedHTMLProps {
  html: string;
}

function SyntaxHighlightedHTML({ html }: SyntaxHighlightedHTMLProps) {
  const highlighted = useMemo(() => {
    return html
      // Escape HTML entities first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Highlight DOCTYPE
      .replace(/(&lt;!DOCTYPE[^&]*&gt;)/gi, '<span class="text-gray-500 dark:text-gray-400">$1</span>')
      // Highlight comments
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-gray-400 dark:text-gray-500 italic">$1</span>')
      // Highlight tags
      .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="text-pink-600 dark:text-pink-400">$2</span>')
      // Highlight attributes
      .replace(/([\w-]+)(=)(&quot;|')/g, '<span class="text-orange-600 dark:text-orange-400">$1</span><span class="text-gray-600 dark:text-gray-400">$2</span>$3')
      // Highlight attribute values
      .replace(/(&quot;|')([^&]*)(&quot;|')/g, '<span class="text-green-600 dark:text-green-400">$1$2$3</span>')
      // Highlight brackets
      .replace(/(&lt;|&gt;|\/&gt;)/g, '<span class="text-gray-600 dark:text-gray-400">$1</span>');
  }, [html]);

  return (
    <pre
      className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'beautify' | 'minify';

export default function HTMLFormatter() {
  const tool = getToolBySlug('html-formatter');

  // State
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('beautify');
  const [indentSize, setIndentSize] = useState(2);
  const [copySuccess, setCopySuccess] = useState(false);

  // Process HTML
  const result = useMemo(() => {
    if (!input.trim()) {
      return { success: false, error: 'Please enter HTML code' };
    }
    return mode === 'beautify' ? formatHTML(input, indentSize) : minifyHTML(input);
  }, [input, mode, indentSize]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (result.formatted) {
      try {
        await navigator.clipboard.writeText(result.formatted);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = result.formatted;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  }, [result.formatted]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Load sample HTML
  const handleLoadSample = useCallback(() => {
    setInput(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sample Page</title><style>body { font-family: sans-serif; }</style></head>
<body><header><nav><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li><li><a href="/contact">Contact</a></li></ul></nav></header><main><article><h1>Welcome to Our Website</h1><p>This is a <strong>sample paragraph</strong> with some <em>formatted text</em> and a <a href="https://example.com">link</a>.</p><img src="image.jpg" alt="Sample Image"><div class="container"><section><h2>Features</h2><ul><li>Feature One</li><li>Feature Two</li><li>Feature Three</li></ul></section></div></article></main><footer><p>&copy; 2024 Sample Company. All rights reserved.</p></footer></body>
</html>`);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Transform messy or minified HTML into clean, readable code with our free{' '}
          <strong>HTML Formatter & Beautifier</strong>. Instantly format HTML with proper
          indentation, or minify it for production. Features syntax highlighting, customizable
          indent size, and real-time preview. Perfect for web developers, designers, and anyone
          working with HTML code. <strong>100% client-side processing</strong> means your code
          never leaves your browser.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setMode('beautify')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'beautify'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Beautify
            </button>
            <button
              onClick={() => setMode('minify')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'minify'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Minify
            </button>
          </div>

          {/* Indent Size (only for beautify mode) */}
          {mode === 'beautify' && (
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
              <div className="flex gap-1">
                {[2, 4].map((size) => (
                  <button
                    key={size}
                    onClick={() => setIndentSize(size)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      indentSize === size
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {size} spaces
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="html-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Input HTML
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
              >
                Load Sample
              </button>
            </div>

            <textarea
              id="html-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your HTML code here..."
              className="w-full h-[65vh] px-5 py-4 font-mono text-sm leading-relaxed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors"
              spellCheck={false}
            />

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
                disabled={!result.success}
                className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {copySuccess ? 'Copied!' : 'Copy Output'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'beautify' ? 'Formatted Output' : 'Minified Output'}
              </span>
              {result.stats && (
                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{result.stats.lines.toLocaleString()} lines</span>
                  <span>{result.stats.characters.toLocaleString()} chars</span>
                  <span>{result.stats.tags.toLocaleString()} tags</span>
                </div>
              )}
            </div>

            <div className="w-full h-[65vh] px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-auto">
              {result.success && result.formatted ? (
                <SyntaxHighlightedHTML html={result.formatted} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    {result.error || 'Enter HTML code to see formatted output'}
                  </p>
                </div>
              )}
            </div>

            {/* Stats/Compression info row - always present for alignment */}
            <div className="mt-3 min-h-[40px] flex items-center">
              {mode === 'minify' && result.success && input ? (
                <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Reduced from {input.length.toLocaleString()} to {result.formatted?.length.toLocaleString()} characters
                    ({Math.round((1 - (result.formatted?.length || 0) / input.length) * 100)}% smaller)
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {result.stats && `${result.stats.characters.toLocaleString()} characters output`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All HTML formatting happens directly in your browser. Your code is never sent to any server,
              stored, or logged. This tool works completely offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the HTML Formatter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Paste your HTML</strong> into the input textarea. You can paste minified,
            unformatted, or messy HTML code.
          </li>
          <li>
            <strong>Choose your mode</strong>: &quot;Beautify&quot; adds proper indentation and line breaks,
            while &quot;Minify&quot; removes all unnecessary whitespace.
          </li>
          <li>
            <strong>Select indent size</strong> (2 or 4 spaces) if using Beautify mode.
          </li>
          <li>
            <strong>View the result</strong> with syntax highlighting in the output panel.
          </li>
          <li>
            <strong>Copy the output</strong> using the Copy button to use in your project.
          </li>
        </ol>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '✨', title: 'Beautify HTML', desc: 'Add proper indentation and line breaks for readability' },
            { icon: '📦', title: 'Minify HTML', desc: 'Remove whitespace and comments for smaller file size' },
            { icon: '🎨', title: 'Syntax Highlighting', desc: 'Color-coded tags, attributes, and values' },
            { icon: '⚙️', title: 'Customizable Indent', desc: 'Choose between 2 or 4 spaces for indentation' },
            { icon: '📋', title: 'One-Click Copy', desc: 'Copy formatted HTML to clipboard instantly' },
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
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Working with JSON data? Try our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter & Viewer
          </Link>{' '}
          for validating and prettifying JSON. Need to analyze URLs? Use our{' '}
          <Link
            href="/tools/url-parser"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            URL Parser
          </Link>{' '}
          to break down complex URLs.
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
              What is HTML formatting and why is it important?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              HTML formatting refers to organizing HTML code with proper indentation and line breaks.
              Well-formatted HTML is easier to read, understand, debug, and maintain. It helps
              developers quickly identify the structure of a web page and find specific elements.
              Minified HTML is the opposite—all whitespace is removed to reduce file size for
              production use.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my HTML code safe when using this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, completely safe. This HTML formatter runs entirely in your browser using JavaScript.
              Your code never leaves your computer and is not sent to any server. There&apos;s no
              backend processing, no logging, and no data storage. You can verify this by disconnecting
              from the internet—the tool will continue to work.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              When should I use Beautify vs Minify?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Use <strong>Beautify</strong> during development for readable, maintainable code that&apos;s
              easy to debug and edit. Use <strong>Minify</strong> for production to reduce file size
              and improve page load times. Minified HTML removes comments and unnecessary whitespace,
              making files smaller but harder to read.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does this tool validate HTML?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool focuses on formatting rather than validation. It will format any HTML you
              provide, even if it contains errors. For comprehensive HTML validation, consider using
              the W3C Markup Validation Service or your browser&apos;s developer tools to check for
              syntax errors and accessibility issues.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I format HTML with embedded CSS and JavaScript?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, this tool handles HTML documents with embedded <code>&lt;style&gt;</code> and
              <code>&lt;script&gt;</code> tags. The content inside these tags is preserved. However,
              for dedicated CSS and JavaScript formatting, you may want to use specialized formatters
              for those languages.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
