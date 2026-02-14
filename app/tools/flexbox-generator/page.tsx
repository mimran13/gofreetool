'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function FlexboxGenerator() {
  const tool = getToolBySlug('flexbox-generator');
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState(10);
  const [numItems, setNumItems] = useState(4);
  const [copied, setCopied] = useState(false);

  const flexDirectionOptions = ['row', 'row-reverse', 'column', 'column-reverse'];
  const justifyContentOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
  const alignItemsOptions = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
  const flexWrapOptions = ['nowrap', 'wrap', 'wrap-reverse'];

  const containerStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: flexDirection as React.CSSProperties['flexDirection'],
    justifyContent,
    alignItems,
    flexWrap: flexWrap as React.CSSProperties['flexWrap'],
    gap: `${gap}px`,
  }), [flexDirection, justifyContent, alignItems, flexWrap, gap]);

  const cssCode = `display: flex;
flex-direction: ${flexDirection};
justify-content: ${justifyContent};
align-items: ${alignItems};
flex-wrap: ${flexWrap};
gap: ${gap}px;`;

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [cssCode]);

  const itemSizes = [
    { w: 80, h: 60 },
    { w: 100, h: 80 },
    { w: 60, h: 100 },
    { w: 90, h: 70 },
    { w: 70, h: 90 },
    { w: 110, h: 60 },
  ];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Build <strong>CSS flexbox layouts visually</strong>. Adjust flex-direction, justify-content,
          align-items, and more with real-time preview. <strong>Copy the CSS code</strong> for your projects.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
            <div
              className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-700"
              style={containerStyle}
            >
              {Array.from({ length: numItems }).map((_, i) => (
                <div
                  key={i}
                  className="bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md"
                  style={{
                    minWidth: itemSizes[i % itemSizes.length].w,
                    minHeight: itemSizes[i % itemSizes.length].h,
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Items: {numItems}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={numItems}
                onChange={(e) => setNumItems(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                flex-direction
              </label>
              <div className="grid grid-cols-2 gap-2">
                {flexDirectionOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFlexDirection(opt)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      flexDirection === opt
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                justify-content
              </label>
              <div className="grid grid-cols-2 gap-2">
                {justifyContentOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setJustifyContent(opt)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      justifyContent === opt
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                align-items
              </label>
              <div className="grid grid-cols-3 gap-2">
                {alignItemsOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAlignItems(opt)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      alignItems === opt
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                flex-wrap
              </label>
              <div className="grid grid-cols-3 gap-2">
                {flexWrapOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFlexWrap(opt)}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      flexWrap === opt
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                gap: {gap}px
              </label>
              <input
                type="range"
                min="0"
                max="40"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
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
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{cssCode}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Flexbox Cheatsheet</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>justify-content:</strong> Aligns items along the main axis (horizontal in row)</li>
          <li>• <strong>align-items:</strong> Aligns items along the cross axis (vertical in row)</li>
          <li>• <strong>flex-wrap:</strong> Controls whether items wrap to new lines</li>
          <li>• <strong>gap:</strong> Adds space between flex items</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
