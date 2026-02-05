'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// BASE CONVERSION TYPES & HELPERS
// ============================================================================

type Base = 'binary' | 'decimal' | 'hexadecimal' | 'octal';

interface BaseInfo {
  name: string;
  radix: number;
  prefix: string;
  regex: RegExp;
  placeholder: string;
  validChars: string;
}

const BASE_INFO: Record<Base, BaseInfo> = {
  binary: {
    name: 'Binary',
    radix: 2,
    prefix: '0b',
    regex: /^(0b)?[01]+$/i,
    placeholder: 'e.g., 1010 or 0b1010',
    validChars: '0-1',
  },
  octal: {
    name: 'Octal',
    radix: 8,
    prefix: '0o',
    regex: /^(0o)?[0-7]+$/i,
    placeholder: 'e.g., 755 or 0o755',
    validChars: '0-7',
  },
  decimal: {
    name: 'Decimal',
    radix: 10,
    prefix: '',
    regex: /^-?[0-9]+$/,
    placeholder: 'e.g., 255',
    validChars: '0-9',
  },
  hexadecimal: {
    name: 'Hexadecimal',
    radix: 16,
    prefix: '0x',
    regex: /^(0x)?[0-9a-f]+$/i,
    placeholder: 'e.g., FF or 0xFF',
    validChars: '0-9, A-F',
  },
};

const BASE_ORDER: Base[] = ['binary', 'octal', 'decimal', 'hexadecimal'];

interface ConversionResult {
  success: boolean;
  values?: Record<Base, string>;
  detectedBase?: Base;
  error?: string;
}

/**
 * Auto-detect the base of the input number
 */
function detectBase(input: string): Base | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check for explicit prefixes first
  if (/^0b[01]+$/i.test(trimmed)) return 'binary';
  if (/^0o[0-7]+$/i.test(trimmed)) return 'octal';
  if (/^0x[0-9a-f]+$/i.test(trimmed)) return 'hexadecimal';

  // Check for hex characters (a-f) without prefix
  if (/^[0-9a-f]+$/i.test(trimmed) && /[a-f]/i.test(trimmed)) return 'hexadecimal';

  // If only 0s and 1s and length > 4, likely binary
  if (/^[01]+$/.test(trimmed) && trimmed.length > 4) return 'binary';

  // Default to decimal if all digits
  if (/^-?[0-9]+$/.test(trimmed)) return 'decimal';

  return null;
}

/**
 * Remove prefix from number string
 */
function removePrefix(input: string, base: Base): string {
  const trimmed = input.trim();
  const prefix = BASE_INFO[base].prefix;
  if (prefix && trimmed.toLowerCase().startsWith(prefix.toLowerCase())) {
    return trimmed.slice(prefix.length);
  }
  return trimmed;
}

/**
 * Convert number from one base to all bases
 */
function convertNumber(input: string, inputBase: Base | 'auto'): ConversionResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { success: false, error: 'Please enter a number to convert' };
  }

  // Determine the base
  let detectedBase: Base;
  if (inputBase === 'auto') {
    const detected = detectBase(trimmed);
    if (!detected) {
      return { success: false, error: 'Could not auto-detect the number base. Please select a base manually.' };
    }
    detectedBase = detected;
  } else {
    detectedBase = inputBase;
  }

  // Validate the input against the detected/selected base
  const baseInfo = BASE_INFO[detectedBase];
  if (!baseInfo.regex.test(trimmed)) {
    return {
      success: false,
      error: `Invalid ${baseInfo.name.toLowerCase()} number. Valid characters: ${baseInfo.validChars}`,
    };
  }

  // Remove prefix and convert to decimal first
  const cleanInput = removePrefix(trimmed, detectedBase);

  try {
    // Handle negative numbers (only for decimal)
    const isNegative = detectedBase === 'decimal' && cleanInput.startsWith('-');
    const absInput = isNegative ? cleanInput.slice(1) : cleanInput;

    // Parse to BigInt for large number support
    const decimalValue = BigInt(parseInt(absInput, baseInfo.radix) * (isNegative ? -1 : 1));

    // For negative numbers, only show decimal representation
    if (decimalValue < BigInt(0)) {
      return {
        success: true,
        detectedBase,
        values: {
          binary: `(negative: ${decimalValue.toString(2).replace('-', '-')})`,
          octal: `(negative: ${decimalValue.toString(8).replace('-', '-')})`,
          decimal: decimalValue.toString(10),
          hexadecimal: `(negative: ${decimalValue.toString(16).toUpperCase().replace('-', '-')})`,
        },
      };
    }

    // Convert to all bases
    const values: Record<Base, string> = {
      binary: decimalValue.toString(2),
      octal: decimalValue.toString(8),
      decimal: decimalValue.toString(10),
      hexadecimal: decimalValue.toString(16).toUpperCase(),
    };

    return {
      success: true,
      detectedBase,
      values,
    };
  } catch (error) {
    return {
      success: false,
      error: `Conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Format binary with spaces every 4 digits
 */
function formatBinary(binary: string): string {
  // Pad to multiple of 4
  const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, '0');
  return padded.match(/.{4}/g)?.join(' ') || binary;
}

/**
 * Format hex with spaces every 2 digits
 */
function formatHex(hex: string): string {
  // Pad to multiple of 2
  const padded = hex.padStart(Math.ceil(hex.length / 2) * 2, '0');
  return padded.match(/.{2}/g)?.join(' ') || hex;
}

// ============================================================================
// OUTPUT CARD COMPONENT
// ============================================================================

interface OutputCardProps {
  base: Base;
  value: string;
  formatted?: string;
  isDetected?: boolean;
}

function OutputCard({ base, value, formatted, isDetected }: OutputCardProps) {
  const [copied, setCopied] = useState(false);
  const baseInfo = BASE_INFO[base];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [value]);

  const isNegativeRepresentation = value.startsWith('(negative:');

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {baseInfo.name}
          </span>
          {baseInfo.prefix && (
            <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
              {baseInfo.prefix}
            </span>
          )}
          {isDetected && (
            <span className="text-xs px-2 py-0.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-400 rounded">
              Detected
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={isNegativeRepresentation}
          className="text-xs px-3 py-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="font-mono text-lg break-all text-gray-900 dark:text-white">
        {isNegativeRepresentation ? (
          <span className="text-gray-500 dark:text-gray-400 text-sm italic">{value}</span>
        ) : (
          formatted || value
        )}
      </div>

      {formatted && formatted !== value && !isNegativeRepresentation && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Raw: {value}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BaseNumberConverter() {
  const tool = getToolBySlug('base-number-converter');

  // State
  const [input, setInput] = useState('');
  const [inputBase, setInputBase] = useState<Base | 'auto'>('auto');
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);

  // Convert the number
  const result = useMemo(() => {
    return convertNumber(input, inputBase);
  }, [input, inputBase]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
    setInputBase('auto');
  }, []);

  // Handle copy all
  const handleCopyAll = useCallback(async () => {
    if (result.success && result.values) {
      const text = BASE_ORDER.map(base =>
        `${BASE_INFO[base].name}: ${result.values![base]}`
      ).join('\n');

      try {
        await navigator.clipboard.writeText(text);
        setCopyAllSuccess(true);
        setTimeout(() => setCopyAllSuccess(false), 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopyAllSuccess(true);
        setTimeout(() => setCopyAllSuccess(false), 2000);
      }
    }
  }, [result]);

  // Load sample
  const handleLoadSample = useCallback(() => {
    setInput('255');
    setInputBase('decimal');
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert numbers between <strong>Binary</strong>, <strong>Decimal</strong>,{' '}
          <strong>Hexadecimal</strong>, and <strong>Octal</strong> instantly with our free{' '}
          <strong>Base Number Converter</strong>. Auto-detect input base from prefixes (0b, 0o, 0x)
          or select manually. Perfect for programmers, computer science students, and anyone
          working with different number systems. <strong>100% client-side processing</strong> means
          your data never leaves your browser.
        </p>
      </ToolContent>

      {/* Main Tool Interface */}
      <ToolInterface className="mb-8">
        {/* Input Section */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <label
              htmlFor="number-input"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Input Number
            </label>
            <button
              onClick={handleLoadSample}
              className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
            >
              Load Sample (255)
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              id="number-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a number (e.g., 255, 0xFF, 0b11111111, 0o377)"
              className="flex-1 px-5 py-4 font-mono text-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              spellCheck={false}
            />

            <select
              value={inputBase}
              onChange={(e) => setInputBase(e.target.value as Base | 'auto')}
              className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            >
              <option value="auto">Auto-detect</option>
              <option value="binary">Binary (base 2)</option>
              <option value="octal">Octal (base 8)</option>
              <option value="decimal">Decimal (base 10)</option>
              <option value="hexadecimal">Hexadecimal (base 16)</option>
            </select>
          </div>

          {/* Quick input buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Quick inputs:</span>
            {[
              { label: '0xFF', value: '0xFF' },
              { label: '0b1010', value: '0b1010' },
              { label: '0o777', value: '0o777' },
              { label: '42', value: '42' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setInput(item.value); setInputBase('auto'); }}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleClear}
            disabled={!input}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleCopyAll}
            disabled={!result.success}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copyAllSuccess ? 'Copied All!' : 'Copy All'}
          </button>
        </div>

        {/* Output Section */}
        {result.error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6">
            <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
          </div>
        )}

        {result.success && result.values && (
          <>
            {/* Detection notice */}
            {inputBase === 'auto' && result.detectedBase && (
              <div className="p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl mb-4">
                <p className="text-sm text-teal-700 dark:text-teal-400">
                  Auto-detected as <strong>{BASE_INFO[result.detectedBase].name}</strong> (base {BASE_INFO[result.detectedBase].radix})
                </p>
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BASE_ORDER.map((base) => (
                <OutputCard
                  key={base}
                  base={base}
                  value={result.values![base]}
                  formatted={
                    base === 'binary' && !result.values![base].startsWith('(')
                      ? formatBinary(result.values![base])
                      : base === 'hexadecimal' && !result.values![base].startsWith('(')
                      ? formatHex(result.values![base])
                      : undefined
                  }
                  isDetected={inputBase === 'auto' && base === result.detectedBase}
                />
              ))}
            </div>
          </>
        )}

        {!input && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">Enter a number to convert</p>
            <p className="text-sm">
              Supports prefixes: <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">0b</code> (binary),{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">0o</code> (octal),{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">0x</code> (hex)
            </p>
          </div>
        )}
      </ToolInterface>

      {/* Privacy Notice */}
      <ToolContent className="mb-12">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">🔒</span>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                All number conversions happen directly in your browser. Your data is never sent to any server,
                stored, or logged. This tool works completely offline after the page loads.
              </p>
            </div>
          </div>
        </div>
      </ToolContent>

      {/* How to Use Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Base Number Converter
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter a number</strong> in the input field. You can use prefixes like{' '}
            <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">0b</code> for binary,{' '}
            <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">0o</code> for octal, or{' '}
            <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">0x</code> for hexadecimal.
          </li>
          <li>
            <strong>Select input base</strong> or leave it on &quot;Auto-detect&quot; to let the tool
            determine the base from prefixes or content.
          </li>
          <li>
            <strong>View conversions</strong> for all four bases (binary, octal, decimal, hexadecimal)
            instantly.
          </li>
          <li>
            <strong>Copy individual values</strong> using the Copy button on each card, or use
            &quot;Copy All&quot; to copy all conversions at once.
          </li>
        </ol>
      </ToolContent>

      {/* Base Reference Table */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Number Base Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Base</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Radix</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Prefix</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Valid Characters</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {BASE_ORDER.map((base) => {
                const info = BASE_INFO[base];
                const examples: Record<Base, string> = {
                  binary: '0b1111',
                  octal: '0o17',
                  decimal: '15',
                  hexadecimal: '0xF',
                };
                return (
                  <tr key={base} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{info.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{info.radix}</td>
                    <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">
                      {info.prefix || '(none)'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{info.validChars}</td>
                    <td className="px-4 py-3 font-mono text-teal-600 dark:text-teal-400">{examples[base]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ToolContent>

      {/* Features Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🔄', title: 'Multi-Base Conversion', desc: 'Convert between binary, decimal, hex, and octal instantly' },
            { icon: '🔍', title: 'Auto-Detection', desc: 'Automatically detect input base from prefixes or content' },
            { icon: '📋', title: 'One-Click Copy', desc: 'Copy individual results or all conversions at once' },
            { icon: '🎨', title: 'Formatted Output', desc: 'Binary shown in groups of 4, hex in groups of 2' },
            { icon: '🔢', title: 'Large Numbers', desc: 'Supports large numbers using BigInt internally' },
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

      {/* Common Conversions */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Number Conversions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Decimal</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Binary</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Octal</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Hex</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700 dark:text-gray-300">Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-mono">
              {[
                { dec: '0', bin: '0000', oct: '0', hex: '0', use: 'Null/False' },
                { dec: '1', bin: '0001', oct: '1', hex: '1', use: 'True' },
                { dec: '8', bin: '1000', oct: '10', hex: '8', use: 'Byte boundary' },
                { dec: '16', bin: '10000', oct: '20', hex: '10', use: 'Nibble' },
                { dec: '255', bin: '11111111', oct: '377', hex: 'FF', use: 'Max byte' },
                { dec: '256', bin: '100000000', oct: '400', hex: '100', use: 'Byte overflow' },
                { dec: '1024', bin: '10000000000', oct: '2000', hex: '400', use: '1 KB' },
                { dec: '65535', bin: '1111111111111111', oct: '177777', hex: 'FFFF', use: 'Max 16-bit' },
              ].map((row) => (
                <tr key={row.dec} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-3 py-2 text-gray-900 dark:text-white">{row.dec}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.bin}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.oct}</td>
                  <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.hex}</td>
                  <td className="px-3 py-2 text-gray-500 dark:text-gray-500 font-sans text-xs">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolContent>

      {/* Related Tools */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Need unique identifiers? Try our{' '}
            <Link
              href="/tools/uuid-generator"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              UUID Generator
            </Link>
            . Generate checksums with our{' '}
            <Link
              href="/tools/hash-generator"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              Hash Generator
            </Link>
            . Working with encoded data? Use our{' '}
            <Link
              href="/tools/base64-encoder-decoder"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              Base64 Encoder/Decoder
            </Link>
            . Format your JSON with our{' '}
            <Link
              href="/tools/json-formatter-viewer"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON Formatter
            </Link>
            .
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
              What is a number base (radix)?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A number base (or radix) determines how many unique digits are used to represent numbers.
              Decimal (base 10) uses digits 0-9, binary (base 2) uses 0-1, octal (base 8) uses 0-7, and
              hexadecimal (base 16) uses 0-9 and A-F. Each position in a number represents a power of the
              base, similar to how in decimal, 123 means 1×100 + 2×10 + 3×1.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why do programmers use hexadecimal?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Hexadecimal is popular in programming because each hex digit represents exactly 4 binary bits
              (a nibble). This makes it compact and easy to convert to binary mentally. For example, 0xFF
              in hex is 11111111 in binary—much shorter to write! It&apos;s commonly used for memory addresses,
              color codes (#FF0000), and byte values.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              When is octal notation used?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Octal (base 8) is most commonly used in Unix/Linux file permissions. Each digit represents
              3 bits, perfect for the read (4), write (2), and execute (1) permission flags. For example,
              chmod 755 sets read+write+execute for owner, and read+execute for group and others.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How does auto-detection work?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              The auto-detection feature checks for common prefixes first: 0b for binary, 0o for octal,
              and 0x for hexadecimal. If no prefix is found, it looks at the characters used. If the
              number contains A-F, it&apos;s assumed to be hex. If it only contains 0s and 1s and is longer
              than 4 digits, it&apos;s likely binary. Otherwise, it defaults to decimal.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does this tool support negative numbers?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, but with limitations. Negative numbers can be entered in decimal format (e.g., -42).
              However, binary, octal, and hexadecimal representations of negative numbers require
              two&apos;s complement notation, which depends on the bit width (8-bit, 16-bit, 32-bit, etc.).
              This tool shows negative decimal values but indicates that other bases would need
              two&apos;s complement representation.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my data safe when using this converter?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, completely safe. This converter runs entirely in your browser using JavaScript. No data
              is ever sent to any server, stored, or logged. You can verify this by disconnecting from the
              internet—the tool will continue to work perfectly.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
