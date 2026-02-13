'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function GlassmorphismGenerator() {
  const tool = getToolBySlug('glassmorphism-generator');
  const [blur, setBlur] = useState(10);
  const [transparency, setTransparency] = useState(0.25);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [bgColor, setBgColor] = useState('#667eea');
  const [copied, setCopied] = useState(false);

  const cssValue = useMemo(() => {
    return `background: rgba(255, 255, 255, ${transparency});
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: 16px;
border: 1px solid rgba(255, 255, 255, ${borderOpacity});`;
  }, [blur, transparency, saturation, borderOpacity]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [cssValue]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create trendy <strong>glassmorphism</strong> (frosted glass) effects with CSS.
          Adjust blur, transparency, and saturation for the perfect glass look.
          <strong> All processing happens in your browser</strong> — copy CSS instantly.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div
            className="relative flex items-center justify-center p-8 rounded-xl min-h-80 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${bgColor} 0%, #764ba2 100%)`,
            }}
          >
            {/* Background shapes */}
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/30 rounded-full" />
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-purple-400/30 rounded-full" />
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-pink-300/30 rounded-full" />

            {/* Glass card */}
            <div
              className="relative z-10 p-8 rounded-2xl w-64"
              style={{
                background: `rgba(255, 255, 255, ${transparency})`,
                backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
              }}
            >
              <h3 className="text-xl font-bold text-white mb-2">Glass Card</h3>
              <p className="text-white/80 text-sm">
                This is a glassmorphism effect with blur and transparency.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <div className="flex gap-2">
                  {['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBgColor(color)}
                      className="w-8 h-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blur: {blur}px
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transparency: {transparency.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={transparency}
                onChange={(e) => setTransparency(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                min="100"
                max="300"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Border Opacity: {borderOpacity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={borderOpacity}
                onChange={(e) => setBorderOpacity(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</label>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg"
            >
              {copied ? '✓ Copied' : 'Copy CSS'}
            </button>
          </div>
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap">
            {cssValue}
          </pre>
        </div>
      </div>

      <div className="mb-12 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Browser Support</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          <code>backdrop-filter</code> is supported in modern browsers (Chrome, Firefox 103+, Safari, Edge).
          The <code>-webkit-</code> prefix is included for Safari. Consider a fallback for older browsers.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Adjust the blur amount for the frosted glass effect</li>
          <li>Set transparency for the glass overlay</li>
          <li>Tweak saturation to enhance colors through the glass</li>
          <li>Adjust border opacity for the subtle edge</li>
          <li>Copy the CSS code and use in your project</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
