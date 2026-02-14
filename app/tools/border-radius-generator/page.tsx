'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function BorderRadiusGenerator() {
  const tool = getToolBySlug('border-radius-generator');
  const [topLeft, setTopLeft] = useState(20);
  const [topRight, setTopRight] = useState(20);
  const [bottomRight, setBottomRight] = useState(20);
  const [bottomLeft, setBottomLeft] = useState(20);
  const [linked, setLinked] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleRadiusChange = useCallback((value: number, corner: 'tl' | 'tr' | 'br' | 'bl') => {
    if (linked) {
      setTopLeft(value);
      setTopRight(value);
      setBottomRight(value);
      setBottomLeft(value);
    } else {
      switch (corner) {
        case 'tl': setTopLeft(value); break;
        case 'tr': setTopRight(value); break;
        case 'br': setBottomRight(value); break;
        case 'bl': setBottomLeft(value); break;
      }
    }
  }, [linked]);

  const cssValue = useMemo(() => {
    if (topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft) {
      return `${topLeft}px`;
    }
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  }, [topLeft, topRight, bottomRight, bottomLeft]);

  const cssCode = `border-radius: ${cssValue};`;

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssCode]);

  const presets = [
    { name: 'None', values: [0, 0, 0, 0] },
    { name: 'Small', values: [4, 4, 4, 4] },
    { name: 'Medium', values: [8, 8, 8, 8] },
    { name: 'Large', values: [16, 16, 16, 16] },
    { name: 'XL', values: [24, 24, 24, 24] },
    { name: 'Pill', values: [999, 999, 999, 999] },
    { name: 'Top Only', values: [16, 16, 0, 0] },
    { name: 'Bottom Only', values: [0, 0, 16, 16] },
    { name: 'Left Only', values: [16, 0, 0, 16] },
    { name: 'Blob', values: [30, 70, 70, 30] },
  ];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create <strong>CSS border-radius</strong> values visually. Design rounded corners,
          pill shapes, and organic blob shapes with individual corner control.
          <strong> Copy the CSS code</strong> instantly for your projects.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
            <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 rounded-lg min-h-[300px]">
              <div
                className="w-48 h-48 bg-gradient-to-br from-teal-500 to-blue-600 shadow-lg transition-all duration-200"
                style={{ borderRadius: cssValue }}
              />
            </div>
          </div>

          {/* Controls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Corner Radius</h3>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={linked}
                  onChange={(e) => setLinked(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                Link corners
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Top Left', value: topLeft, corner: 'tl' as const },
                { label: 'Top Right', value: topRight, corner: 'tr' as const },
                { label: 'Bottom Left', value: bottomLeft, corner: 'bl' as const },
                { label: 'Bottom Right', value: bottomRight, corner: 'br' as const },
              ].map((item) => (
                <div key={item.corner}>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.value}
                      onChange={(e) => handleRadiusChange(Number(e.target.value), item.corner)}
                      className="flex-1"
                    />
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={item.value}
                      onChange={(e) => handleRadiusChange(Number(e.target.value), item.corner)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-center"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Presets</h4>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setLinked(false);
                      setTopLeft(preset.values[0]);
                      setTopRight(preset.values[1]);
                      setBottomRight(preset.values[2]);
                      setBottomLeft(preset.values[3]);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
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
              <code className="text-green-400 font-mono text-sm">{cssCode}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Border Radius Tips</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Use consistent values across your design for visual harmony</li>
          <li>• Pill shapes use a very large value (like 999px) on shorter elements</li>
          <li>• Combine with box-shadow for modern card designs</li>
          <li>• Values can be in px, %, em, or rem units</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Adjust the sliders to set corner radius values</li>
          <li>Uncheck "Link corners" for individual corner control</li>
          <li>Use presets for common shapes</li>
          <li>Copy the CSS code and paste into your stylesheet</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
