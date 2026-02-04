'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// CSS FORMATTING HELPERS
// ============================================================================

interface FormatResult {
  success: boolean;
  formatted?: string;
  error?: string;
  stats?: {
    selectors: number;
    properties: number;
    characters: number;
  };
}

/**
 * Beautify CSS with proper indentation
 */
function beautifyCSS(css: string, indentSize: number = 2): FormatResult {
  if (!css.trim()) {
    return { success: false, error: 'Please enter CSS code to format' };
  }

  try {
    const indent = ' '.repeat(indentSize);
    let formatted = '';
    let indentLevel = 0;
    let inComment = false;
    let inString = false;
    let stringChar = '';
    let selectorCount = 0;
    let propertyCount = 0;

    // Remove existing formatting
    let cleaned = css
      .replace(/\/\*[\s\S]*?\*\//g, (match) => `/*COMMENT${match.slice(2, -2)}COMMENT*/`) // Preserve comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    let i = 0;
    let currentLine = '';

    while (i < cleaned.length) {
      const char = cleaned[i];
      const nextChar = cleaned[i + 1];

      // Handle comment markers
      if (cleaned.slice(i, i + 9) === '/*COMMENT') {
        // Start of preserved comment
        const endIndex = cleaned.indexOf('COMMENT*/', i);
        if (endIndex !== -1) {
          const comment = '/*' + cleaned.slice(i + 9, endIndex) + '*/';
          if (currentLine.trim()) {
            formatted += currentLine.trim() + '\n';
            currentLine = '';
          }
          formatted += indent.repeat(indentLevel) + comment + '\n';
          i = endIndex + 9;
          continue;
        }
      }

      // Handle strings
      if ((char === '"' || char === "'") && !inComment) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar && cleaned[i - 1] !== '\\') {
          inString = false;
        }
        currentLine += char;
        i++;
        continue;
      }

      if (inString) {
        currentLine += char;
        i++;
        continue;
      }

      // Handle opening brace
      if (char === '{') {
        selectorCount++;
        currentLine = currentLine.trim();
        if (currentLine) {
          formatted += indent.repeat(indentLevel) + currentLine + ' {\n';
        } else {
          formatted += indent.repeat(indentLevel) + '{\n';
        }
        indentLevel++;
        currentLine = '';
        i++;
        continue;
      }

      // Handle closing brace
      if (char === '}') {
        if (currentLine.trim()) {
          formatted += indent.repeat(indentLevel) + currentLine.trim() + '\n';
          currentLine = '';
        }
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += indent.repeat(indentLevel) + '}\n';

        // Add blank line after rule block (but not for nested rules)
        if (indentLevel === 0 && i < cleaned.length - 1) {
          formatted += '\n';
        }
        i++;
        continue;
      }

      // Handle semicolon (end of property)
      if (char === ';') {
        propertyCount++;
        currentLine = currentLine.trim();
        if (currentLine) {
          formatted += indent.repeat(indentLevel) + currentLine + ';\n';
        }
        currentLine = '';
        i++;
        continue;
      }

      // Handle colon in property (add space after)
      if (char === ':' && indentLevel > 0) {
        currentLine += ': ';
        // Skip any following spaces
        while (cleaned[i + 1] === ' ') i++;
        i++;
        continue;
      }

      // Regular character
      currentLine += char;
      i++;
    }

    // Handle any remaining content
    if (currentLine.trim()) {
      formatted += indent.repeat(indentLevel) + currentLine.trim() + '\n';
    }

    // Clean up extra blank lines
    formatted = formatted
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      success: true,
      formatted,
      stats: {
        selectors: selectorCount,
        properties: propertyCount,
        characters: formatted.length,
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
 * Minify CSS by removing unnecessary whitespace
 */
function minifyCSS(css: string): FormatResult {
  if (!css.trim()) {
    return { success: false, error: 'Please enter CSS code to minify' };
  }

  try {
    let minified = css
      // Preserve strings
      .replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => `__STRING__${Buffer.from(match).toString('base64')}__`)
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove whitespace
      .replace(/\s+/g, ' ')
      // Remove space around special characters
      .replace(/\s*([{}:;,>~+])\s*/g, '$1')
      // Remove trailing semicolons before closing braces
      .replace(/;}/g, '}')
      // Remove leading/trailing whitespace
      .trim();

    // Restore strings
    minified = minified.replace(/__STRING__([A-Za-z0-9+/=]+)__/g, (_, encoded) => {
      try {
        return Buffer.from(encoded, 'base64').toString();
      } catch {
        return encoded;
      }
    });

    // Count selectors and properties
    const selectorCount = (minified.match(/{/g) || []).length;
    const propertyCount = (minified.match(/;/g) || []).length + selectorCount; // Approximate

    return {
      success: true,
      formatted: minified,
      stats: {
        selectors: selectorCount,
        properties: propertyCount,
        characters: minified.length,
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

interface SyntaxHighlightedCSSProps {
  css: string;
}

function SyntaxHighlightedCSS({ css }: SyntaxHighlightedCSSProps) {
  const highlighted = useMemo(() => {
    return css
      // Escape HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Highlight comments
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-400 dark:text-gray-500 italic">$1</span>')
      // Highlight selectors (text before {)
      .replace(/^([^{]+)(\{)/gm, '<span class="text-purple-600 dark:text-purple-400">$1</span><span class="text-gray-600 dark:text-gray-400">$2</span>')
      // Highlight properties (text before :)
      .replace(/(\s+)([\w-]+)(\s*:\s*)/g, '$1<span class="text-blue-600 dark:text-blue-400">$2</span><span class="text-gray-600 dark:text-gray-400">$3</span>')
      // Highlight values with units
      .replace(/:\s*([^;{}]+)(;|$)/g, (match, value, end) => {
        const highlightedValue = value
          // Numbers with units
          .replace(/(-?\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg|fr)/g, '<span class="text-orange-600 dark:text-orange-400">$1$2</span>')
          // Hex colors
          .replace(/(#[0-9A-Fa-f]{3,8})/g, '<span class="text-pink-600 dark:text-pink-400">$1</span>')
          // Named colors and keywords
          .replace(/\b(inherit|initial|unset|none|auto|transparent|currentColor)\b/g, '<span class="text-teal-600 dark:text-teal-400">$1</span>')
          // Functions
          .replace(/(\w+)(\()/g, '<span class="text-yellow-600 dark:text-yellow-400">$1</span>$2');
        return ': ' + highlightedValue + '<span class="text-gray-600 dark:text-gray-400">' + end + '</span>';
      })
      // Highlight braces
      .replace(/([{}])/g, '<span class="text-gray-600 dark:text-gray-400">$1</span>');
  }, [css]);

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

export default function CSSFormatter() {
  const tool = getToolBySlug('css-formatter');

  // State
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('beautify');
  const [indentSize, setIndentSize] = useState(2);
  const [copySuccess, setCopySuccess] = useState(false);

  // Process CSS
  const result = useMemo(() => {
    if (!input.trim()) {
      return { success: false, error: 'Please enter CSS code' };
    }
    return mode === 'beautify' ? beautifyCSS(input, indentSize) : minifyCSS(input);
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

  // Load sample CSS
  const handleLoadSample = useCallback(() => {
    setInput(`.container{display:flex;flex-direction:column;align-items:center;padding:20px;background-color:#f5f5f5;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}.container .header{font-size:24px;font-weight:bold;color:#333;margin-bottom:16px}.container .content{width:100%;max-width:800px}.button{display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;border:none;border-radius:6px;cursor:pointer;transition:transform 0.2s ease,box-shadow 0.2s ease}.button:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(102,126,234,0.4)}@media(max-width:768px){.container{padding:12px}.container .header{font-size:18px}}`);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Transform messy or minified CSS into clean, readable code with our free{' '}
          <strong>CSS Formatter & Beautifier</strong>. Instantly format CSS with proper
          indentation, or minify it for production. Features syntax highlighting, customizable
          indent size, and real-time preview. Perfect for web developers, designers, and anyone
          working with stylesheets. <strong>100% client-side processing</strong> means your code
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
                htmlFor="css-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Input CSS
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
              >
                Load Sample
              </button>
            </div>

            <textarea
              id="css-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSS code here..."
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
                  <span>{result.stats.selectors} rules</span>
                  <span>{result.stats.characters.toLocaleString()} chars</span>
                </div>
              )}
            </div>

            <div className="w-full h-[65vh] px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-auto">
              {result.success && result.formatted ? (
                <SyntaxHighlightedCSS css={result.formatted} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    {result.error || 'Enter CSS code to see formatted output'}
                  </p>
                </div>
              )}
            </div>

            {/* Stats/info row */}
            <div className="mt-3 min-h-[40px] flex items-center">
              {mode === 'minify' && result.success && input && (
                <div className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Reduced from {input.length.toLocaleString()} to {result.formatted?.length.toLocaleString()} characters
                    ({Math.round((1 - (result.formatted?.length || 0) / input.length) * 100)}% smaller)
                  </p>
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
              All CSS formatting happens directly in your browser. Your code is never sent to any server,
              stored, or logged. This tool works completely offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the CSS Formatter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Paste your CSS</strong> into the input textarea. You can paste minified,
            unformatted, or messy CSS code.
          </li>
          <li>
            <strong>Choose your mode</strong>: &quot;Beautify&quot; adds proper indentation and line breaks,
            while &quot;Minify&quot; removes all unnecessary whitespace for production.
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
            { icon: '✨', title: 'Beautify CSS', desc: 'Add proper indentation and line breaks for readability' },
            { icon: '📦', title: 'Minify CSS', desc: 'Remove whitespace and comments for smaller file size' },
            { icon: '🎨', title: 'Syntax Highlighting', desc: 'Color-coded selectors, properties, and values' },
            { icon: '⚙️', title: 'Customizable Indent', desc: 'Choose between 2 or 4 spaces for indentation' },
            { icon: '📋', title: 'One-Click Copy', desc: 'Copy formatted CSS to clipboard instantly' },
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

      {/* CSS Tips Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          CSS Formatting Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Development</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Use beautified CSS for readability</li>
              <li>Consistent indentation (2 or 4 spaces)</li>
              <li>Group related properties together</li>
              <li>Add comments for complex sections</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Production</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Minify CSS to reduce file size</li>
              <li>Remove comments and whitespace</li>
              <li>Combine multiple CSS files</li>
              <li>Use build tools for automation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Working with HTML? Try our{' '}
          <Link
            href="/tools/html-formatter"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            HTML Formatter & Beautifier
          </Link>
          . Need to format JSON data? Use our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter
          </Link>
          . Testing patterns? Check out our{' '}
          <Link
            href="/tools/regex-tester"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Regex Tester
          </Link>
          . Working with encoded data? Try our{' '}
          <Link
            href="/tools/base64-encoder-decoder"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Base64 Encoder/Decoder
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
              What is CSS formatting and why is it important?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              CSS formatting refers to organizing CSS code with proper indentation, line breaks, and
              spacing. Well-formatted CSS is easier to read, understand, debug, and maintain. It helps
              developers quickly identify selectors, properties, and values. Minified CSS is the
              opposite—all whitespace is removed to reduce file size for production websites.
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
              and improve page load times. Minified CSS removes comments, whitespace, and unnecessary
              characters, making files significantly smaller but harder to read.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does this tool validate my CSS?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool focuses on formatting rather than validation. It will format any CSS you
              provide, even if it contains errors. For comprehensive CSS validation, consider using
              the W3C CSS Validation Service or your browser&apos;s developer tools to check for
              syntax errors and compatibility issues.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my CSS code safe when using this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, completely safe. This CSS formatter runs entirely in your browser using JavaScript.
              Your code never leaves your computer and is not sent to any server. There&apos;s no
              backend processing, no logging, and no data storage. You can verify this by disconnecting
              from the internet—the tool will continue to work.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does it support CSS preprocessors like SASS or LESS?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool is designed for standard CSS. While it may partially format SASS or LESS code,
              it doesn&apos;t understand preprocessor-specific syntax like variables ($var), mixins, or
              nesting. For SASS/LESS formatting, compile your code to CSS first, or use a dedicated
              preprocessor formatter.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
