'use client';

import { useState, useCallback } from 'react';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { getToolBySlug } from '@/lib/tools';

export default function GradientGenerator() {
  const tool = getToolBySlug('gradient-generator');

  // State
  const [color1, setColor1] = useState('#3B82F6');
  const [color2, setColor2] = useState('#8B5CF6');
  const [angle, setAngle] = useState(90);
  const [copied, setCopied] = useState(false);

  // Generate CSS gradient string
  const gradientCSS = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(gradientCSS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = gradientCSS;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [gradientCSS]);

  // Preset gradients
  const presets = [
    { name: 'Ocean', color1: '#667eea', color2: '#764ba2', angle: 135 },
    { name: 'Sunset', color1: '#f093fb', color2: '#f5576c', angle: 90 },
    { name: 'Mint', color1: '#4facfe', color2: '#00f2fe', angle: 90 },
    { name: 'Peach', color1: '#ffecd2', color2: '#fcb69f', angle: 135 },
    { name: 'Night', color1: '#0f0c29', color2: '#302b63', angle: 180 },
    { name: 'Forest', color1: '#134e5e', color2: '#71b280', angle: 90 },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setColor1(preset.color1);
    setColor2(preset.color2);
    setAngle(preset.angle);
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tool not found. Please add gradient-generator to lib/tools.ts</p>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create beautiful CSS gradients visually. Pick two colors, adjust the angle, and copy the
          generated CSS code instantly. Perfect for backgrounds, buttons, and UI elements.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Live Preview */}
        <div
          className="w-full h-48 rounded-xl mb-6 shadow-inner border border-gray-200 dark:border-gray-600"
          style={{ background: gradientCSS }}
        />

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Color 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color 1
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-14 h-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ padding: 0 }}
              />
              <input
                type="text"
                value={color1.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setColor1(val);
                  }
                }}
                className="flex-1 px-4 py-2 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength={7}
              />
            </div>
          </div>

          {/* Color 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color 2
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-14 h-12 cursor-pointer rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ padding: 0 }}
              />
              <input
                type="text"
                value={color2.toUpperCase()}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                    setColor2(val);
                  }
                }}
                className="flex-1 px-4 py-2 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Angle Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Angle
            </label>
            <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
              {angle}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0°</span>
            <span>90°</span>
            <span>180°</span>
            <span>270°</span>
            <span>360°</span>
          </div>
        </div>

        {/* Quick Angles */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Quick angles:</span>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <button
              key={a}
              onClick={() => setAngle(a)}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                angle === a
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {a}°
            </button>
          ))}
        </div>

        {/* CSS Output */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">CSS Code</h3>
            <button
              onClick={copyToClipboard}
              className="px-4 py-1.5 text-sm bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 rounded transition-colors font-medium"
            >
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
          <code className="block p-3 bg-gray-800 dark:bg-gray-950 text-green-400 rounded font-mono text-sm overflow-x-auto">
            background: {gradientCSS};
          </code>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Preset Gradients</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="group"
            >
              <div
                className="h-16 rounded-lg mb-2 border-2 border-transparent group-hover:border-teal-500 transition-colors"
                style={{
                  background: `linear-gradient(${preset.angle}deg, ${preset.color1}, ${preset.color2})`,
                }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {preset.name}
              </span>
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
              All gradient generation happens directly in your browser. No data is sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Gradient Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Pick your colors</strong> using the color pickers or enter HEX values directly.
          </li>
          <li>
            <strong>Adjust the angle</strong> using the slider or quick-select buttons.
          </li>
          <li>
            <strong>Preview your gradient</strong> in real-time in the preview area.
          </li>
          <li>
            <strong>Copy the CSS</strong> by clicking the Copy button and paste into your stylesheet.
          </li>
        </ol>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '🖥️',
              title: 'Website Backgrounds',
              desc: 'Create eye-catching hero sections and page backgrounds',
            },
            {
              icon: '🔘',
              title: 'Button Styles',
              desc: 'Design gradient buttons that stand out',
            },
            {
              icon: '📱',
              title: 'App UI',
              desc: 'Add depth and visual interest to mobile interfaces',
            },
            {
              icon: '🎴',
              title: 'Card Designs',
              desc: 'Create gradient overlays for cards and containers',
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

      {/* CSS Tips */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">CSS Gradient Tips</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Full Background Coverage</h3>
            <code className="block p-2 bg-gray-800 dark:bg-gray-950 text-green-400 rounded font-mono text-xs">
              background: {gradientCSS};<br />
              background-attachment: fixed;
            </code>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Text Gradient Effect</h3>
            <code className="block p-2 bg-gray-800 dark:bg-gray-950 text-green-400 rounded font-mono text-xs">
              background: {gradientCSS};<br />
              -webkit-background-clip: text;<br />
              -webkit-text-fill-color: transparent;
            </code>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
