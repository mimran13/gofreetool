'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface Shadow {
  id: string;
  x: number;
  y: number;
  blur: number;
  color: string;
  opacity: number;
}

export default function TextShadowGenerator() {
  const tool = getToolBySlug('text-shadow-generator');
  const [previewText, setPreviewText] = useState('Hello World');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [fontSize, setFontSize] = useState(48);
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: '1', x: 2, y: 2, blur: 4, color: '#000000', opacity: 50 },
  ]);
  const [copied, setCopied] = useState(false);

  const addShadow = useCallback(() => {
    setShadows([...shadows, {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      blur: 10,
      color: '#00ffff',
      opacity: 100,
    }]);
  }, [shadows]);

  const removeShadow = useCallback((id: string) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(s => s.id !== id));
    }
  }, [shadows]);

  const updateShadow = useCallback((id: string, field: keyof Shadow, value: number | string) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, [shadows]);

  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  };

  const cssValue = useMemo(() => {
    return shadows.map(s =>
      `${s.x}px ${s.y}px ${s.blur}px ${hexToRgba(s.color, s.opacity)}`
    ).join(', ');
  }, [shadows]);

  const cssCode = `text-shadow: ${cssValue};`;

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssCode]);

  const presets = [
    { name: 'Simple', shadows: [{ x: 2, y: 2, blur: 4, color: '#000000', opacity: 50 }] },
    { name: 'Soft', shadows: [{ x: 0, y: 4, blur: 8, color: '#000000', opacity: 30 }] },
    { name: 'Neon Blue', shadows: [
      { x: 0, y: 0, blur: 10, color: '#00ffff', opacity: 100 },
      { x: 0, y: 0, blur: 20, color: '#00ffff', opacity: 80 },
      { x: 0, y: 0, blur: 40, color: '#00ffff', opacity: 60 },
    ]},
    { name: 'Neon Pink', shadows: [
      { x: 0, y: 0, blur: 10, color: '#ff00ff', opacity: 100 },
      { x: 0, y: 0, blur: 20, color: '#ff00ff', opacity: 80 },
      { x: 0, y: 0, blur: 40, color: '#ff00ff', opacity: 60 },
    ]},
    { name: '3D', shadows: [
      { x: 1, y: 1, blur: 0, color: '#666666', opacity: 100 },
      { x: 2, y: 2, blur: 0, color: '#555555', opacity: 100 },
      { x: 3, y: 3, blur: 0, color: '#444444', opacity: 100 },
    ]},
    { name: 'Fire', shadows: [
      { x: 0, y: 0, blur: 4, color: '#ff0000', opacity: 100 },
      { x: 0, y: -5, blur: 4, color: '#ff6600', opacity: 80 },
      { x: 0, y: -10, blur: 6, color: '#ffff00', opacity: 60 },
    ]},
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setShadows(preset.shadows.map((s, i) => ({ ...s, id: `preset-${i}` })));
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create <strong>CSS text shadows</strong> visually. Design neon glow, 3D effects,
          and layered shadows with multiple shadow support.
          <strong> Copy the CSS code</strong> for your projects.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
            <div
              className="flex items-center justify-center p-8 rounded-lg min-h-[250px] transition-colors"
              style={{ backgroundColor: bgColor }}
            >
              <span
                className="font-bold text-center break-words max-w-full transition-all"
                style={{
                  color: textColor,
                  fontSize: `${fontSize}px`,
                  textShadow: cssValue,
                }}
              >
                {previewText}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Text</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Size: {fontSize}px</label>
                <input
                  type="range"
                  min="16"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Preview text..."
              className="w-full mt-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          {/* Controls */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Shadows ({shadows.length})</h3>
              <button
                onClick={addShadow}
                className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
              >
                + Add Layer
              </button>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
              {shadows.map((shadow, index) => (
                <div key={shadow.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Shadow {index + 1}
                    </span>
                    {shadows.length > 1 && (
                      <button
                        onClick={() => removeShadow(shadow.id)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">X</label>
                      <input
                        type="number"
                        value={shadow.x}
                        onChange={(e) => updateShadow(shadow.id, 'x', Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Y</label>
                      <input
                        type="number"
                        value={shadow.y}
                        onChange={(e) => updateShadow(shadow.id, 'y', Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Blur</label>
                      <input
                        type="number"
                        min="0"
                        value={shadow.blur}
                        onChange={(e) => updateShadow(shadow.id, 'blur', Number(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Color</label>
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                        className="w-full h-[30px] rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Opacity: {shadow.opacity}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadow.opacity}
                      onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Presets</h4>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
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
              <code className="text-green-400 font-mono text-xs break-all block">{cssCode}</code>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Adjust shadow offset (X/Y), blur, and color</li>
          <li>Add multiple shadow layers for complex effects</li>
          <li>Try presets for quick inspiration</li>
          <li>Copy the CSS and paste into your stylesheet</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
