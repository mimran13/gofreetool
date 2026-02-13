'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic';

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function ColorPaletteGenerator() {
  const tool = getToolBySlug('color-palette-generator');
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [harmony, setHarmony] = useState<HarmonyType>('analogous');
  const [copied, setCopied] = useState<string | null>(null);

  const palette = useMemo(() => {
    const [h, s, l] = hexToHsl(baseColor);
    const colors: { hex: string; name: string }[] = [];

    switch (harmony) {
      case 'complementary':
        colors.push({ hex: baseColor, name: 'Base' });
        colors.push({ hex: hslToHex(h + 180, s, l), name: 'Complement' });
        colors.push({ hex: hslToHex(h, s, l + 15), name: 'Light' });
        colors.push({ hex: hslToHex(h, s, l - 15), name: 'Dark' });
        colors.push({ hex: hslToHex(h + 180, s, l + 15), name: 'Light Complement' });
        break;
      case 'analogous':
        colors.push({ hex: hslToHex(h - 30, s, l), name: 'Analogous 1' });
        colors.push({ hex: hslToHex(h - 15, s, l), name: 'Analogous 2' });
        colors.push({ hex: baseColor, name: 'Base' });
        colors.push({ hex: hslToHex(h + 15, s, l), name: 'Analogous 3' });
        colors.push({ hex: hslToHex(h + 30, s, l), name: 'Analogous 4' });
        break;
      case 'triadic':
        colors.push({ hex: baseColor, name: 'Base' });
        colors.push({ hex: hslToHex(h + 120, s, l), name: 'Triadic 1' });
        colors.push({ hex: hslToHex(h + 240, s, l), name: 'Triadic 2' });
        colors.push({ hex: hslToHex(h, s, l + 20), name: 'Light' });
        colors.push({ hex: hslToHex(h, s, l - 20), name: 'Dark' });
        break;
      case 'split-complementary':
        colors.push({ hex: baseColor, name: 'Base' });
        colors.push({ hex: hslToHex(h + 150, s, l), name: 'Split 1' });
        colors.push({ hex: hslToHex(h + 210, s, l), name: 'Split 2' });
        colors.push({ hex: hslToHex(h, s, l + 15), name: 'Light' });
        colors.push({ hex: hslToHex(h, s, l - 15), name: 'Dark' });
        break;
      case 'tetradic':
        colors.push({ hex: baseColor, name: 'Base' });
        colors.push({ hex: hslToHex(h + 90, s, l), name: 'Tetradic 1' });
        colors.push({ hex: hslToHex(h + 180, s, l), name: 'Tetradic 2' });
        colors.push({ hex: hslToHex(h + 270, s, l), name: 'Tetradic 3' });
        colors.push({ hex: hslToHex(h, s, l - 20), name: 'Dark' });
        break;
    }

    return colors;
  }, [baseColor, harmony]);

  const handleCopy = useCallback(async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) { /* Fallback */ }
  }, []);

  const copyAll = useCallback(async () => {
    const text = palette.map(c => `${c.name}: ${c.hex}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied('all');
      setTimeout(() => setCopied(null), 2000);
    } catch (e) { /* Fallback */ }
  }, [palette]);

  const harmonyOptions: { id: HarmonyType; name: string; description: string }[] = [
    { id: 'analogous', name: 'Analogous', description: 'Colors next to each other' },
    { id: 'complementary', name: 'Complementary', description: 'Opposite colors' },
    { id: 'triadic', name: 'Triadic', description: 'Three evenly spaced' },
    { id: 'split-complementary', name: 'Split Complementary', description: 'Base + adjacent complements' },
    { id: 'tetradic', name: 'Tetradic', description: 'Four evenly spaced' },
  ];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate beautiful <strong>color palettes</strong> using color harmony rules.
          Create complementary, analogous, triadic, and other harmonious color schemes.
          <strong> All processing happens in your browser</strong> — export hex codes instantly.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Base Color
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Harmony
            </label>
            <select
              value={harmony}
              onChange={(e) => setHarmony(e.target.value as HarmonyType)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              {harmonyOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {harmonyOptions.find(h => h.id === harmony)?.description}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Generated Palette</h3>
            <button
              onClick={copyAll}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg"
            >
              {copied === 'all' ? '✓ Copied All' : 'Copy All'}
            </button>
          </div>

          <div className="flex rounded-lg overflow-hidden">
            {palette.map((color, idx) => (
              <div key={idx} className="flex-1 h-24" style={{ backgroundColor: color.hex }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {palette.map((color, idx) => (
            <button
              key={idx}
              onClick={() => handleCopy(color.hex)}
              className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div
                className="w-full h-12 rounded mb-2"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-xs text-gray-500">{color.name}</div>
              <div className="font-mono text-sm text-gray-900 dark:text-white">
                {copied === color.hex ? '✓ Copied' : color.hex}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Color Harmony Guide</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Analogous:</strong> Safe, harmonious, easy on the eyes</li>
          <li>• <strong>Complementary:</strong> High contrast, vibrant, eye-catching</li>
          <li>• <strong>Triadic:</strong> Balanced, colorful, playful</li>
          <li>• <strong>Split-Comp:</strong> High contrast but more nuanced</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Pick a base color using the color picker</li>
          <li>Choose a color harmony rule</li>
          <li>View the generated palette</li>
          <li>Click any color to copy its hex code</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
