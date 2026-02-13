'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export default function BoxShadowGenerator() {
  const tool = getToolBySlug('box-shadow-generator');
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: '1', offsetX: 0, offsetY: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
    { id: '2', offsetX: 0, offsetY: 2, blur: 4, spread: -2, color: '#000000', opacity: 0.1, inset: false },
  ]);
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [copied, setCopied] = useState(false);

  const cssValue = useMemo(() => {
    return shadows.map(s => {
      const rgba = `rgba(${parseInt(s.color.slice(1, 3), 16)}, ${parseInt(s.color.slice(3, 5), 16)}, ${parseInt(s.color.slice(5, 7), 16)}, ${s.opacity})`;
      return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`;
    }).join(', ');
  }, [shadows]);

  const updateShadow = useCallback((id: string, field: keyof Shadow, value: number | string | boolean) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, [shadows]);

  const addShadow = useCallback(() => {
    setShadows([...shadows, {
      id: Date.now().toString(),
      offsetX: 0,
      offsetY: 10,
      blur: 15,
      spread: -3,
      color: '#000000',
      opacity: 0.1,
      inset: false,
    }]);
  }, [shadows]);

  const removeShadow = useCallback((id: string) => {
    if (shadows.length > 1) {
      setShadows(shadows.filter(s => s.id !== id));
    }
  }, [shadows]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`box-shadow: ${cssValue};`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [cssValue]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create beautiful <strong>CSS box shadows</strong> visually. Adjust offset, blur, spread,
          and color to design the perfect shadow. Add multiple layers for depth effects.
          <strong> All processing happens in your browser</strong> — copy CSS instantly.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div
            className="flex items-center justify-center p-8 rounded-lg min-h-64"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-32 h-32 rounded-lg"
              style={{ backgroundColor: boxColor, boxShadow: cssValue }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Box Color</label>
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => setBoxColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
              </div>
              <button
                onClick={addShadow}
                className="ml-auto px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg"
              >
                + Add Layer
              </button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {shadows.map((shadow, idx) => (
                <div key={shadow.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Layer {idx + 1}
                    </span>
                    {shadows.length > 1 && (
                      <button
                        onClick={() => removeShadow(shadow.id)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500">X Offset</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.offsetX}
                        onChange={(e) => updateShadow(shadow.id, 'offsetX', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{shadow.offsetX}px</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Y Offset</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.offsetY}
                        onChange={(e) => updateShadow(shadow.id, 'offsetY', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{shadow.offsetY}px</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Blur</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={shadow.blur}
                        onChange={(e) => updateShadow(shadow.id, 'blur', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{shadow.blur}px</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Spread</label>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={shadow.spread}
                        onChange={(e) => updateShadow(shadow.id, 'spread', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{shadow.spread}px</span>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Color</label>
                      <input
                        type="color"
                        value={shadow.color}
                        onChange={(e) => updateShadow(shadow.id, 'color', e.target.value)}
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={shadow.opacity}
                        onChange={(e) => updateShadow(shadow.id, 'opacity', Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-500">{shadow.opacity}</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={shadow.inset}
                      onChange={(e) => updateShadow(shadow.id, 'inset', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-xs text-gray-500">Inset</span>
                  </label>
                </div>
              ))}
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
          <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-100 overflow-x-auto">
            box-shadow: {cssValue};
          </pre>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Adjust shadow properties using the sliders</li>
          <li>Add multiple shadow layers for depth</li>
          <li>Preview the result in real-time</li>
          <li>Copy the CSS code to use in your project</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
