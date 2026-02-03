'use client';

import { useState, useCallback, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { getToolBySlug } from '@/lib/tools';

// ============================================================================
// WCAG CONTRAST CALCULATION HELPERS
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

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG 2.1 thresholds
const WCAG_THRESHOLDS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContrastChecker() {
  const tool = getToolBySlug('contrast-checker');

  // State
  const [foreground, setForeground] = useState('#000000');
  const [background, setBackground] = useState('#FFFFFF');
  const [fgError, setFgError] = useState<string | null>(null);
  const [bgError, setBgError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Validate and set foreground color
  const handleForegroundChange = useCallback((value: string) => {
    let cleanValue = value.trim().toUpperCase();
    if (!cleanValue.startsWith('#')) {
      cleanValue = '#' + cleanValue;
    }
    setForeground(cleanValue);

    if (!/^#[A-Fa-f0-9]{6}$/.test(cleanValue) && cleanValue.length > 1) {
      setFgError('Use 6-digit HEX (e.g., #000000)');
    } else {
      setFgError(null);
    }
  }, []);

  // Validate and set background color
  const handleBackgroundChange = useCallback((value: string) => {
    let cleanValue = value.trim().toUpperCase();
    if (!cleanValue.startsWith('#')) {
      cleanValue = '#' + cleanValue;
    }
    setBackground(cleanValue);

    if (!/^#[A-Fa-f0-9]{6}$/.test(cleanValue) && cleanValue.length > 1) {
      setBgError('Use 6-digit HEX (e.g., #FFFFFF)');
    } else {
      setBgError(null);
    }
  }, []);

  // Swap colors
  const handleSwap = useCallback(() => {
    setForeground(background);
    setBackground(foreground);
  }, [foreground, background]);

  // Calculate contrast ratio
  const contrastRatio = useMemo(() => {
    if (fgError || bgError) return null;
    return getContrastRatio(foreground, background);
  }, [foreground, background, fgError, bgError]);

  // WCAG results
  const wcagResults = useMemo(() => {
    if (!contrastRatio) return null;
    return {
      aaNormal: contrastRatio >= WCAG_THRESHOLDS.AA_NORMAL,
      aaLarge: contrastRatio >= WCAG_THRESHOLDS.AA_LARGE,
      aaaNormal: contrastRatio >= WCAG_THRESHOLDS.AAA_NORMAL,
      aaaLarge: contrastRatio >= WCAG_THRESHOLDS.AAA_LARGE,
    };
  }, [contrastRatio]);

  // Copy contrast ratio
  const copyContrastRatio = useCallback(async () => {
    if (!contrastRatio) return;
    const text = `${contrastRatio.toFixed(2)}:1`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [contrastRatio]);

  // Valid colors for preview
  const isValidFg = /^#[A-Fa-f0-9]{6}$/.test(foreground);
  const isValidBg = /^#[A-Fa-f0-9]{6}$/.test(background);
  const isValid = isValidFg && isValidBg;

  // Contrast rating label
  const getRatingLabel = (ratio: number): { label: string; color: string } => {
    if (ratio >= 7) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (ratio >= 4.5) return { label: 'Good', color: 'text-teal-600 dark:text-teal-400' };
    if (ratio >= 3) return { label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Poor', color: 'text-red-600 dark:text-red-400' };
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tool not found. Please add contrast-checker to lib/tools.ts</p>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Check the contrast ratio between text and background colors to ensure your designs meet
          WCAG accessibility standards. Enter foreground and background colors to see if they pass
          AA and AAA requirements for normal and large text.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Live Preview */}
        <div
          className="w-full rounded-xl p-8 mb-6 border border-gray-200 dark:border-gray-600 transition-colors"
          style={{ backgroundColor: isValidBg ? background : '#E5E7EB' }}
        >
          <p
            className="text-2xl font-bold mb-2 transition-colors"
            style={{ color: isValidFg ? foreground : '#6B7280' }}
          >
            Large Text Preview (24px Bold)
          </p>
          <p
            className="text-base transition-colors"
            style={{ color: isValidFg ? foreground : '#6B7280' }}
          >
            Normal text preview (16px). The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        {/* Color Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Foreground Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Foreground (Text) Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={isValidFg ? foreground : '#000000'}
                onChange={(e) => handleForegroundChange(e.target.value)}
                className="w-14 h-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ padding: 0 }}
              />
              <input
                type="text"
                value={foreground}
                onChange={(e) => handleForegroundChange(e.target.value)}
                placeholder="#000000"
                maxLength={7}
                className={`flex-1 px-4 py-2 font-mono border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  fgError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {fgError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fgError}</p>}
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={isValidBg ? background : '#FFFFFF'}
                onChange={(e) => handleBackgroundChange(e.target.value)}
                className="w-14 h-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ padding: 0 }}
              />
              <input
                type="text"
                value={background}
                onChange={(e) => handleBackgroundChange(e.target.value)}
                placeholder="#FFFFFF"
                maxLength={7}
                className={`flex-1 px-4 py-2 font-mono border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  bgError ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {bgError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{bgError}</p>}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleSwap}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <span>⇅</span> Swap Colors
          </button>
        </div>

        {/* Contrast Ratio Display */}
        {isValid && contrastRatio && (
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
            {/* Ratio */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contrast Ratio</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  {contrastRatio.toFixed(2)}:1
                </span>
                <button
                  onClick={copyContrastRatio}
                  className="px-3 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded transition-colors font-medium"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className={`text-lg font-medium mt-2 ${getRatingLabel(contrastRatio).color}`}>
                {getRatingLabel(contrastRatio).label}
              </p>
            </div>

            {/* WCAG Results Grid */}
            {wcagResults && (
              <div className="grid grid-cols-2 gap-3">
                {/* AA Normal Text */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    wcagResults.aaNormal
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{wcagResults.aaNormal ? '✓' : '✗'}</span>
                    <span
                      className={`font-semibold ${
                        wcagResults.aaNormal
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {wcagResults.aaNormal ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AA Normal Text</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">≥ 4.5:1 required</p>
                </div>

                {/* AA Large Text */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    wcagResults.aaLarge
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{wcagResults.aaLarge ? '✓' : '✗'}</span>
                    <span
                      className={`font-semibold ${
                        wcagResults.aaLarge
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {wcagResults.aaLarge ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AA Large Text</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">≥ 3:1 required</p>
                </div>

                {/* AAA Normal Text */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    wcagResults.aaaNormal
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{wcagResults.aaaNormal ? '✓' : '✗'}</span>
                    <span
                      className={`font-semibold ${
                        wcagResults.aaaNormal
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {wcagResults.aaaNormal ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AAA Normal Text</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">≥ 7:1 required</p>
                </div>

                {/* AAA Large Text */}
                <div
                  className={`p-4 rounded-lg border-2 ${
                    wcagResults.aaaLarge
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{wcagResults.aaaLarge ? '✓' : '✗'}</span>
                    <span
                      className={`font-semibold ${
                        wcagResults.aaaLarge
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}
                    >
                      {wcagResults.aaaLarge ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AAA Large Text</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">≥ 4.5:1 required</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Test Examples */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Test Examples</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { fg: '#000000', bg: '#FFFFFF', name: 'Black on White' },
            { fg: '#FFFFFF', bg: '#000000', name: 'White on Black' },
            { fg: '#1F2937', bg: '#F3F4F6', name: 'Gray on Light' },
            { fg: '#0D9488', bg: '#FFFFFF', name: 'Teal on White' },
          ].map((combo) => (
            <button
              key={combo.name}
              onClick={() => {
                handleForegroundChange(combo.fg);
                handleBackgroundChange(combo.bg);
              }}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-400 transition-colors text-left"
            >
              <div
                className="w-full h-10 rounded mb-2 flex items-center justify-center text-sm font-medium border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: combo.bg, color: combo.fg }}
              >
                Aa
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{combo.name}</p>
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
              All contrast calculations happen directly in your browser. No data is sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* WCAG Guidelines Explanation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Understanding WCAG Contrast Requirements
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Level AA (Minimum)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Normal text:</strong> 4.5:1 contrast ratio required</li>
              <li>• <strong>Large text:</strong> 3:1 contrast ratio required</li>
              <li>• Large text is 18pt (24px) or 14pt (18.5px) bold</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Level AAA (Enhanced)</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Normal text:</strong> 7:1 contrast ratio required</li>
              <li>• <strong>Large text:</strong> 4.5:1 contrast ratio required</li>
              <li>• Highest level of accessibility compliance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Contrast Checker
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter your text color</strong> in the foreground input using HEX format.
          </li>
          <li>
            <strong>Enter your background color</strong> in the background input.
          </li>
          <li>
            <strong>View the contrast ratio</strong> and WCAG compliance results instantly.
          </li>
          <li>
            <strong>Adjust colors</strong> until you achieve the desired accessibility level.
          </li>
        </ol>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Contrast Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '👁️',
              title: 'Visual Accessibility',
              desc: 'Helps users with low vision read your content',
            },
            {
              icon: '⚖️',
              title: 'Legal Compliance',
              desc: 'Meet ADA and WCAG requirements for accessibility',
            },
            {
              icon: '📱',
              title: 'Mobile Readability',
              desc: 'Ensure text is readable in bright sunlight',
            },
            {
              icon: '🎨',
              title: 'Better Design',
              desc: 'Good contrast often leads to cleaner designs',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ToolLayout>
  );
}
