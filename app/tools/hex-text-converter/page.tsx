'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// HEX-TEXT CONVERSION HELPERS
// ============================================================================

type Separator = 'space' | 'none' | 'colon';

function textToHex(text: string, separator: Separator, uppercase: boolean): { success: boolean; result: string; error?: string } {
  if (!text) return { success: true, result: '' };

  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hexChars = Array.from(bytes).map((b) => {
      const hex = b.toString(16).padStart(2, '0');
      return uppercase ? hex.toUpperCase() : hex;
    });

    const sep = separator === 'space' ? ' ' : separator === 'colon' ? ':' : '';
    return { success: true, result: hexChars.join(sep) };
  } catch (e) {
    return { success: false, result: '', error: `Conversion failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

function hexToText(hex: string): { success: boolean; result: string; error?: string } {
  if (!hex.trim()) return { success: true, result: '' };

  try {
    // Remove common separators and whitespace
    const cleaned = hex.replace(/[:\s]/g, '');

    // Validate hex string
    if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
      return { success: false, result: '', error: 'Invalid hex characters. Only 0-9 and A-F are allowed.' };
    }

    if (cleaned.length % 2 !== 0) {
      return { success: false, result: '', error: 'Invalid hex string length. Must have an even number of characters.' };
    }

    if (cleaned.length === 0) {
      return { success: true, result: '' };
    }

    const bytes = new Uint8Array(cleaned.length / 2);
    for (let i = 0; i < cleaned.length; i += 2) {
      bytes[i / 2] = parseInt(cleaned.substr(i, 2), 16);
    }

    const decoder = new TextDecoder('utf-8', { fatal: true });
    return { success: true, result: decoder.decode(bytes) };
  } catch (e) {
    if (e instanceof TypeError) {
      return { success: false, result: '', error: 'The hex data contains invalid UTF-8 byte sequences. It may be binary data rather than text.' };
    }
    return { success: false, result: '', error: `Conversion failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'text-to-hex' | 'hex-to-text';

export default function HexTextConverter() {
  const tool = getToolBySlug('hex-text-converter');

  const [mode, setMode] = useState<Mode>('text-to-hex');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [separator, setSeparator] = useState<Separator>('space');
  const [uppercase, setUppercase] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const processInput = useCallback((text: string, currentMode: Mode, sep: Separator, upper: boolean) => {
    if (!text.trim()) {
      setOutput('');
      setError('');
      return;
    }

    if (currentMode === 'text-to-hex') {
      const result = textToHex(text, sep, upper);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Conversion failed');
      }
    } else {
      const result = hexToText(text);
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
      const text = e.target.value;
      setInput(text);
      processInput(text, mode, separator, uppercase);
    },
    [mode, separator, uppercase, processInput]
  );

  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      if (output && !error) {
        setInput(output);
        processInput(output, newMode, separator, uppercase);
      } else {
        processInput(input, newMode, separator, uppercase);
      }
    },
    [input, output, error, separator, uppercase, processInput]
  );

  const handleSeparatorChange = useCallback(
    (sep: Separator) => {
      setSeparator(sep);
      if (mode === 'text-to-hex') {
        processInput(input, mode, sep, uppercase);
      }
    },
    [input, mode, uppercase, processInput]
  );

  const handleCaseChange = useCallback(
    (upper: boolean) => {
      setUppercase(upper);
      if (mode === 'text-to-hex') {
        processInput(input, mode, separator, upper);
      }
    },
    [input, mode, separator, processInput]
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

  if (!tool) return <div>Tool not found</div>;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the difference between hex and Base64?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Both are ways to represent binary data as text. Hex uses 16 characters (0-9, A-F) and doubles the size (1 byte = 2 hex chars). Base64 uses 64 characters and increases size by about 33%. Base64 is more space-efficient for large data, while hex is more human-readable and commonly used in debugging.',
        },
      },
      {
        '@type': 'Question',
        name: 'What encoding does this tool use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This tool uses UTF-8 encoding, which is backward-compatible with ASCII. Standard ASCII characters (A-Z, 0-9, etc.) use 1 byte each. Extended characters like accented letters use 2 bytes, and emojis may use up to 4 bytes in UTF-8.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which separator format should I use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Space-separated (48 65 6C) is the most readable and common in hex editors. Colon-separated (48:65:6C) is used in MAC addresses and network contexts. No separator (48656C) is compact and used in programming and URLs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I convert binary data (non-text) with this tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This tool is designed for text-to-hex conversion. When converting hex to text, the hex values must represent valid UTF-8 byte sequences. Binary data like images or executables will fail hex-to-text conversion because it cannot be displayed as text.',
        },
      },
    ],
  };

  return (
    <ToolLayout tool={tool}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert <strong>text to hexadecimal</strong> and <strong>hex to text</strong> instantly.
          This free <strong>hex-text converter</strong> supports ASCII and UTF-8 encoding with
          configurable separators (space, colon, or none) and uppercase/lowercase output. Perfect for
          debugging, network packet analysis, and data encoding. All conversion happens entirely in
          your browser — your data is never sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('text-to-hex')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'text-to-hex'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Text to Hex
            </button>
            <button
              onClick={() => handleModeSwitch('hex-to-text')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'hex-to-text'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Hex to Text
            </button>
          </div>
        </div>

        {/* Options (Text to Hex mode only) */}
        {mode === 'text-to-hex' && (
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Separator:</span>
              <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
                {([['space', 'Space'], ['colon', 'Colon'], ['none', 'None']] as [Separator, string][]).map(([sep, label]) => (
                  <button
                    key={sep}
                    onClick={() => handleSeparatorChange(sep)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      separator === sep
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Case:</span>
              <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
                <button
                  onClick={() => handleCaseChange(false)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    !uppercase
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  lower
                </button>
                <button
                  onClick={() => handleCaseChange(true)}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    uppercase
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  UPPER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="hex-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'text-to-hex' ? 'Text Input' : 'Hex Input'}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="hex-input"
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === 'text-to-hex'
                  ? 'Enter text to convert to hexadecimal...'
                  : 'Enter hex values (e.g., 48 65 6c 6c 6f)...'
              }
              className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none dark:text-white"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'text-to-hex' ? 'Hex Output' : 'Text Output'}
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
                mode === 'text-to-hex'
                  ? 'Hex values will appear here...'
                  : 'Decoded text will appear here...'
              }
              className={`w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
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
            onClick={() => {
              if (output && !error) {
                setInput(output);
                const newMode = mode === 'text-to-hex' ? 'hex-to-text' : 'text-to-hex';
                setMode(newMode);
                processInput(output, newMode, separator, uppercase);
              }
            }}
            disabled={!output || !!error}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Swap
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
              All hex-text conversion happens directly in your browser using{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">TextEncoder</code> and{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">TextDecoder</code> APIs.
              Your data never leaves your device.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Hex-Text Converter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select your mode:</strong> &quot;Text to Hex&quot; converts text characters to
            hexadecimal bytes, &quot;Hex to Text&quot; decodes hex back to text.
          </li>
          <li>
            <strong>Configure options:</strong> In text-to-hex mode, choose a separator (space,
            colon, or none) and uppercase or lowercase output.
          </li>
          <li>
            <strong>Enter your input:</strong> Type or paste text or hex values.
          </li>
          <li>
            <strong>View the result:</strong> Conversion happens instantly as you type.
          </li>
          <li>
            <strong>Copy or swap:</strong> Copy the result or swap input/output to reverse
            the conversion.
          </li>
        </ol>
      </section>

      {/* Hex Encoding Explained */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is Hexadecimal Encoding?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Hexadecimal (base-16) uses digits 0-9 and letters A-F to represent values. Each hex
            digit represents 4 bits (a nibble), so two hex digits represent one byte (8 bits).
            This makes hex a compact and readable way to represent binary data.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 mb-2">
              <strong>Example:</strong>
            </p>
            <p className="font-mono text-sm">
              Text: <span className="text-teal-600 dark:text-teal-400">Hello</span>
            </p>
            <p className="font-mono text-sm">
              Hex: <span className="text-purple-600 dark:text-purple-400">48 65 6c 6c 6f</span>
            </p>
            <p className="font-mono text-sm text-gray-500 dark:text-gray-400 mt-1">
              H=0x48(72) e=0x65(101) l=0x6c(108) l=0x6c(108) o=0x6f(111)
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🌐', title: 'UTF-8 Support', desc: 'Full Unicode/UTF-8 encoding for international characters' },
            { icon: '📏', title: 'Configurable Separator', desc: 'Choose between space, colon, or no separator' },
            { icon: '🔠', title: 'Case Toggle', desc: 'Switch between uppercase (FF) and lowercase (ff) hex output' },
            { icon: '🔄', title: 'Bidirectional', desc: 'Convert text to hex and hex back to text' },
            { icon: '⚡', title: 'Real-Time', desc: 'Instant conversion as you type' },
            { icon: '📋', title: 'Auto-Detect Format', desc: 'Hex-to-text mode accepts spaces, colons, or no separators' },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need Base64 encoding instead? Try our{' '}
          <Link href="/tools/base64-encoder-decoder" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Base64 Encoder/Decoder
          </Link>. For number base conversion, check out our{' '}
          <Link href="/tools/base-number-converter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Base Number Converter
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
              What is the difference between hex and Base64?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Both are ways to represent binary data as text. <strong>Hex</strong> uses 16 characters
              (0-9, A-F) and doubles the size (1 byte = 2 hex chars). <strong>Base64</strong> uses 64
              characters and increases size by ~33%. Base64 is more space-efficient for large data,
              while hex is more human-readable and commonly used in debugging.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What encoding does this tool use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool uses <strong>UTF-8</strong> encoding, which is backward-compatible with ASCII.
              Standard ASCII characters (A-Z, 0-9, etc.) use 1 byte each. Extended characters like
              accented letters use 2 bytes, and emojis may use up to 4 bytes in UTF-8.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Which separator format should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>Space-separated</strong> (48 65 6C) is the most readable and common in debugging
              and hex editors. <strong>Colon-separated</strong> (48:65:6C) is used in MAC addresses and
              network contexts. <strong>No separator</strong> (48656C) is compact and used in
              programming and URLs.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I convert binary data (non-text) with this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool is designed for text-to-hex conversion. When converting hex to text, the hex
              values must represent valid UTF-8 byte sequences. If the hex data represents binary data
              (like images or executables), the hex-to-text conversion will fail because binary data
              cannot be meaningfully displayed as text.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
