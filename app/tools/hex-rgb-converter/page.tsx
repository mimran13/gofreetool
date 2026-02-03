'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { getToolBySlug } from '@/lib/tools';

export default function HexRgbConverter() {
  const tool = getToolBySlug('hex-rgb-converter');

  // State
  const [hex, setHex] = useState('#FF5733');
  const [rgb, setRgb] = useState({ r: 255, g: 87, b: 51 });
  const [hexError, setHexError] = useState<string | null>(null);
  const [rgbError, setRgbError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Validate and convert HEX to RGB
  const handleHexChange = useCallback((value: string) => {
    // Allow typing with or without #
    let cleanValue = value.trim();
    if (!cleanValue.startsWith('#')) {
      cleanValue = '#' + cleanValue;
    }

    setHex(cleanValue.toUpperCase());
    setHexError(null);

    // Validate HEX format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(cleanValue)) {
      if (cleanValue.length > 1) {
        setHexError('Invalid HEX format. Use #RGB or #RRGGBB');
      }
      return;
    }

    // Expand shorthand (e.g., #FFF -> #FFFFFF)
    let fullHex = cleanValue;
    if (cleanValue.length === 4) {
      fullHex = '#' + cleanValue[1] + cleanValue[1] + cleanValue[2] + cleanValue[2] + cleanValue[3] + cleanValue[3];
    }

    // Convert to RGB
    const r = parseInt(fullHex.slice(1, 3), 16);
    const g = parseInt(fullHex.slice(3, 5), 16);
    const b = parseInt(fullHex.slice(5, 7), 16);

    setRgb({ r, g, b });
    setRgbError(null);
  }, []);

  // Validate and convert RGB to HEX
  const handleRgbChange = useCallback((channel: 'r' | 'g' | 'b', value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);

    // Validate range
    if (isNaN(numValue)) {
      setRgbError(`Invalid ${channel.toUpperCase()} value`);
      return;
    }

    if (numValue < 0 || numValue > 255) {
      setRgbError('RGB values must be between 0 and 255');
      return;
    }

    const newRgb = { ...rgb, [channel]: numValue };
    setRgb(newRgb);
    setRgbError(null);

    // Convert to HEX
    const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
    const newHex = `#${toHex(newRgb.r)}${toHex(newRgb.g)}${toHex(newRgb.b)}`;
    setHex(newHex);
    setHexError(null);
  }, [rgb]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    }
  }, []);

  // Formatted strings
  const hexString = hex;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Determine if current color is valid for preview
  const isValidColor = !hexError && !rgbError && /^#[A-Fa-f0-9]{6}$/.test(hex);

  // Text color for preview (contrast)
  const luminance = isValidColor ? (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255 : 0.5;
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tool not found. Please add hex-rgb-converter to lib/tools.ts</p>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert colors between HEX and RGB formats instantly. Enter a HEX code or RGB values
          and see the conversion in real-time. Perfect for web developers and designers.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Color Preview */}
        <div
          className="w-full h-32 rounded-xl mb-6 flex items-center justify-center border border-gray-200 dark:border-gray-600 transition-colors"
          style={{ backgroundColor: isValidColor ? hex : '#E5E7EB' }}
        >
          {isValidColor ? (
            <span className="font-mono font-medium" style={{ color: textColor }}>
              {hex}
            </span>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Invalid color</span>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HEX Input */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">HEX</h3>
              <button
                onClick={() => copyToClipboard(hexString, 'hex')}
                disabled={!isValidColor}
                className="px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-teal-700 dark:text-teal-300 rounded transition-colors font-medium"
              >
                {copiedField === 'hex' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#FF5733"
              maxLength={7}
              className={`w-full px-4 py-3 font-mono text-lg border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                hexError
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {hexError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{hexError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Format: #RGB or #RRGGBB
            </p>
          </div>

          {/* RGB Input */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">RGB</h3>
              <button
                onClick={() => copyToClipboard(rgbString, 'rgb')}
                disabled={!isValidColor}
                className="px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 disabled:opacity-50 disabled:cursor-not-allowed text-teal-700 dark:text-teal-300 rounded transition-colors font-medium"
              >
                {copiedField === 'rgb' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                  R
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange('r', e.target.value)}
                  className={`w-full px-3 py-3 font-mono text-center border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    rgbError
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                  G
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange('g', e.target.value)}
                  className={`w-full px-3 py-3 font-mono text-center border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    rgbError
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 text-center">
                  B
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange('b', e.target.value)}
                  className={`w-full px-3 py-3 font-mono text-center border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
                    rgbError
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
            </div>
            {rgbError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{rgbError}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Values: 0-255 each
            </p>
          </div>
        </div>

        {/* Output Display */}
        {isValidColor && (
          <div className="mt-6 p-4 bg-gray-800 dark:bg-gray-950 rounded-lg">
            <p className="text-xs text-gray-400 mb-2">CSS Values</p>
            <div className="space-y-1 font-mono text-sm">
              <p className="text-green-400">
                color: <span className="text-white">{hexString}</span>;
              </p>
              <p className="text-green-400">
                color: <span className="text-white">{rgbString}</span>;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Examples */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Examples</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { hex: '#FF0000', name: 'Red' },
            { hex: '#00FF00', name: 'Green' },
            { hex: '#0000FF', name: 'Blue' },
            { hex: '#FFFF00', name: 'Yellow' },
            { hex: '#FF00FF', name: 'Magenta' },
            { hex: '#00FFFF', name: 'Cyan' },
            { hex: '#000000', name: 'Black' },
            { hex: '#FFFFFF', name: 'White' },
          ].map((color) => (
            <button
              key={color.hex}
              onClick={() => handleHexChange(color.hex)}
              className="group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
            >
              <div
                className="w-full h-8 rounded mb-2 border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: color.hex }}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                {color.name}
              </p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-500">{color.hex}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All conversions happen directly in your browser. No data is sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Convert Colors
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter a HEX code</strong> (like #FF5733) to see the RGB values instantly.
          </li>
          <li>
            <strong>Or enter RGB values</strong> (0-255 for each channel) to get the HEX code.
          </li>
          <li>
            <strong>Copy either format</strong> with the copy button for use in your code.
          </li>
        </ol>
      </section>

      {/* Explanation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          HEX vs RGB Explained
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">HEX Colors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hexadecimal colors use a 6-digit code preceded by #. Each pair represents Red, Green,
              and Blue (00-FF). Example: #FF5733 = Red:FF, Green:57, Blue:33.
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">RGB Colors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              RGB uses decimal values 0-255 for Red, Green, and Blue channels. Example:
              rgb(255, 87, 51) represents bright orange-red with full red, some green, and less blue.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '🎨',
              title: 'CSS Styling',
              desc: 'Convert colors for web stylesheets',
            },
            {
              icon: '🖌️',
              title: 'Design Tools',
              desc: 'Match colors between different software',
            },
            {
              icon: '📱',
              title: 'App Development',
              desc: 'Convert colors for iOS, Android, or web apps',
            },
            {
              icon: '🎯',
              title: 'Brand Colors',
              desc: 'Document brand colors in multiple formats',
            },
          ].map((useCase) => (
            <div
              key={useCase.title}
              className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-2xl">{useCase.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{useCase.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{useCase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ToolLayout>
  );
}
