'use client';

import { useState, useCallback } from 'react';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { getToolBySlug } from '@/lib/tools';

// ============================================================================
// COLOR CONVERSION HELPERS
// ============================================================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
      .toUpperCase()
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ColorPicker() {
  const tool = getToolBySlug('color-picker');

  // State
  const [hex, setHex] = useState('#3B82F6');
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update all values from hex
  const updateFromHex = useCallback((newHex: string) => {
    const rgbValue = hexToRgb(newHex);
    if (rgbValue) {
      setHex(newHex.toUpperCase());
      setRgb(rgbValue);
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
    }
  }, []);

  // Update all values from RGB
  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  }, []);

  // Update all values from HSL
  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const rgbValue = hslToRgb(h, s, l);
    setRgb(rgbValue);
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b));
  }, []);

  // Handle color picker change
  const handleColorPickerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateFromHex(e.target.value);
    },
    [updateFromHex]
  );

  // Handle hex input change
  const handleHexInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
        setHex(value.toUpperCase());
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          updateFromHex(value);
        }
      }
    },
    [updateFromHex]
  );

  // Handle RGB input changes
  const handleRgbChange = useCallback(
    (channel: 'r' | 'g' | 'b', value: string) => {
      const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
      const newRgb = { ...rgb, [channel]: numValue };
      updateFromRgb(newRgb.r, newRgb.g, newRgb.b);
    },
    [rgb, updateFromRgb]
  );

  // Handle HSL input changes
  const handleHslChange = useCallback(
    (channel: 'h' | 's' | 'l', value: string) => {
      const max = channel === 'h' ? 360 : 100;
      const numValue = Math.max(0, Math.min(max, parseInt(value) || 0));
      const newHsl = { ...hsl, [channel]: numValue };
      updateFromHsl(newHsl.h, newHsl.s, newHsl.l);
    },
    [hsl, updateFromHsl]
  );

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

  // Formatted color strings
  const hexString = hex;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  // Determine text color for preview (light or dark based on luminance)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tool not found. Please add color-picker to lib/tools.ts</p>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Pick any color using the native color picker or enter values directly in HEX, RGB, or HSL
          format. All conversions happen instantly in your browser. Copy any format with one click
          for use in your CSS, design tools, or code.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Color Preview & Picker */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          {/* Large Color Preview */}
          <div
            className="w-full sm:w-48 h-48 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-inner flex items-center justify-center transition-colors"
            style={{ backgroundColor: hex }}
          >
            <span className="font-mono text-sm font-medium" style={{ color: textColor }}>
              {hex}
            </span>
          </div>

          {/* Color Picker + Hex Input */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Picker
              </label>
              <input
                type="color"
                value={hex}
                onChange={handleColorPickerChange}
                className="w-full h-14 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ padding: 0 }}
              />
            </div>

            <div>
              <label
                htmlFor="hex-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                HEX Value
              </label>
              <div className="flex gap-2">
                <input
                  id="hex-input"
                  type="text"
                  value={hex}
                  onChange={handleHexInputChange}
                  maxLength={7}
                  className="flex-1 px-4 py-3 font-mono text-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="#000000"
                />
                <button
                  onClick={() => copyToClipboard(hexString, 'hex')}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                >
                  {copiedField === 'hex' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color Format Sections */}
        <div className="space-y-6">
          {/* RGB Section */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">RGB</h3>
              <button
                onClick={() => copyToClipboard(rgbString, 'rgb')}
                className="px-3 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded transition-colors font-medium"
              >
                {copiedField === 'rgb' ? 'Copied!' : `Copy ${rgbString}`}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  R (0-255)
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.r}
                  onChange={(e) => handleRgbChange('r', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  G (0-255)
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.g}
                  onChange={(e) => handleRgbChange('g', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  B (0-255)
                </label>
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={rgb.b}
                  onChange={(e) => handleRgbChange('b', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* HSL Section */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">HSL</h3>
              <button
                onClick={() => copyToClipboard(hslString, 'hsl')}
                className="px-3 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded transition-colors font-medium"
              >
                {copiedField === 'hsl' ? 'Copied!' : `Copy ${hslString}`}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  H (0-360)
                </label>
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChange('h', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  S (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChange('s', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  L (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChange('l', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-center font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All color conversions happen directly in your browser. No data is sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Color Picker
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Click the color picker</strong> to open your browser&apos;s native color selection
            tool and visually choose any color.
          </li>
          <li>
            <strong>Enter a HEX value</strong> directly in the input field (e.g., #FF5733).
          </li>
          <li>
            <strong>Adjust RGB or HSL values</strong> using the number inputs for precise control.
          </li>
          <li>
            <strong>Copy any format</strong> by clicking the Copy button next to HEX, RGB, or HSL.
          </li>
        </ol>
      </section>

      {/* Color Formats Explained */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Color Formats Explained
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">HEX</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Six-digit hexadecimal code representing RGB values. Most common in web development
              (e.g., #3B82F6).
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">RGB</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Red, Green, Blue values from 0-255. Used in CSS and most design software
              (e.g., rgb(59, 130, 246)).
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">HSL</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hue, Saturation, Lightness. More intuitive for adjusting colors
              (e.g., hsl(217, 91%, 60%)).
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
              title: 'Web Design',
              desc: 'Get exact color codes for CSS styling',
            },
            {
              icon: '🖼️',
              title: 'Graphic Design',
              desc: 'Convert colors between formats for design tools',
            },
            {
              icon: '📱',
              title: 'App Development',
              desc: 'Find RGB values for mobile app interfaces',
            },
            {
              icon: '🎯',
              title: 'Brand Guidelines',
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
