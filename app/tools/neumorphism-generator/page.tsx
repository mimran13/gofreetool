'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function NeumorphismGenerator() {
  const tool = getToolBySlug('neumorphism-generator');
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(50);
  const [distance, setDistance] = useState(20);
  const [intensity, setIntensity] = useState(15);
  const [blur, setBlur] = useState(60);
  const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
  const [copied, setCopied] = useState(false);

  const adjustColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(2.55 * percent)));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + Math.round(2.55 * percent)));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + Math.round(2.55 * percent)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const styles = useMemo(() => {
    const lightColor = adjustColor(bgColor, intensity);
    const darkColor = adjustColor(bgColor, -intensity);

    let boxShadow: string;
    let background: string = bgColor;

    switch (shape) {
      case 'concave':
        boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
        background = `linear-gradient(145deg, ${adjustColor(bgColor, -5)}, ${adjustColor(bgColor, 5)})`;
        break;
      case 'convex':
        boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
        background = `linear-gradient(145deg, ${adjustColor(bgColor, 5)}, ${adjustColor(bgColor, -5)})`;
        break;
      case 'pressed':
        boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
        break;
      default: // flat
        boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
    }

    return { boxShadow, background, lightColor, darkColor };
  }, [bgColor, distance, intensity, blur, shape]);

  const cssCode = `background: ${styles.background};
border-radius: ${radius}px;
box-shadow: ${styles.boxShadow};`;

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssCode]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create <strong>soft UI (neumorphism) effects</strong> with CSS. Generate the trendy
          soft shadow look for buttons, cards, and UI elements.
          <strong> Copy the CSS code</strong> for your designs.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
            <div
              className="flex items-center justify-center p-12 rounded-xl min-h-[350px] transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              <div
                style={{
                  width: size,
                  height: size,
                  borderRadius: radius,
                  background: styles.background,
                  boxShadow: styles.boxShadow,
                }}
                className="transition-all duration-200"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shape
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['flat', 'concave', 'convex', 'pressed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`px-3 py-2 text-sm rounded-lg capitalize ${
                      shape === s
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="50"
                max="300"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Radius: {radius}px
              </label>
              <input
                type="range"
                min="0"
                max="150"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Distance: {distance}px
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Intensity: {intensity}%
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blur: {blur}px
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* CSS Output */}
            <div className="p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">CSS</span>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="text-green-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap">{cssCode}</pre>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Shape Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div><strong>Flat:</strong> Standard raised surface with dual shadows</div>
          <div><strong>Concave:</strong> Inward curve with gradient lighting</div>
          <div><strong>Convex:</strong> Outward curve with gradient lighting</div>
          <div><strong>Pressed:</strong> Inset/pressed state using inset shadows</div>
        </div>
      </section>
    </ToolLayout>
  );
}
