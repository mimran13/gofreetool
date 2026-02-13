'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const commonRatios = [
  { name: '16:9', width: 16, height: 9, desc: 'Widescreen video, HD TV' },
  { name: '4:3', width: 4, height: 3, desc: 'Classic TV, iPad' },
  { name: '1:1', width: 1, height: 1, desc: 'Square, Instagram post' },
  { name: '9:16', width: 9, height: 16, desc: 'Vertical video, Stories' },
  { name: '21:9', width: 21, height: 9, desc: 'Ultrawide, cinema' },
  { name: '3:2', width: 3, height: 2, desc: 'Photography, 35mm' },
  { name: '2:3', width: 2, height: 3, desc: 'Portrait photography' },
  { name: '4:5', width: 4, height: 5, desc: 'Instagram portrait' },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export default function AspectRatioCalculator() {
  const tool = getToolBySlug('aspect-ratio-calculator');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [targetWidth, setTargetWidth] = useState(1280);
  const [targetHeight, setTargetHeight] = useState(720);
  const [lockWidth, setLockWidth] = useState(true);

  const ratio = useMemo(() => {
    const divisor = gcd(width, height);
    return {
      w: width / divisor,
      h: height / divisor,
      decimal: (width / height).toFixed(4),
    };
  }, [width, height]);

  const calculateFromWidth = (newWidth: number) => {
    setTargetWidth(newWidth);
    setTargetHeight(Math.round(newWidth / (width / height)));
  };

  const calculateFromHeight = (newHeight: number) => {
    setTargetHeight(newHeight);
    setTargetWidth(Math.round(newHeight * (width / height)));
  };

  const applyRatio = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Calculate and convert <strong>aspect ratios</strong> for video, images, and screens.
          Find dimensions that maintain proportions, and compare common ratios.
          <strong> All calculations happen in your browser</strong> — fast and private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Calculate Aspect Ratio</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Width (pixels)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (pixels)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg mb-6 text-center">
          <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">
            {ratio.w}:{ratio.h}
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Decimal: {ratio.decimal}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Resize Maintaining Ratio</h3>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setLockWidth(true)}
              className={`flex-1 py-2 rounded-lg ${lockWidth ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Set Width → Calculate Height
            </button>
            <button
              onClick={() => setLockWidth(false)}
              className={`flex-1 py-2 rounded-lg ${!lockWidth ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Set Height → Calculate Width
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">New Width</label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => lockWidth && calculateFromWidth(Number(e.target.value))}
                disabled={!lockWidth}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">New Height</label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => !lockWidth && calculateFromHeight(Number(e.target.value))}
                disabled={lockWidth}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Common Aspect Ratios</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonRatios.map((r) => (
              <button
                key={r.name}
                onClick={() => applyRatio(r.width * 100, r.height * 100)}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left transition-colors"
              >
                <div className="font-bold text-gray-900 dark:text-white">{r.name}</div>
                <div className="text-xs text-gray-500">{r.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Common Video Resolutions</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>4K UHD:</strong> 3840 × 2160 (16:9)</li>
          <li>• <strong>1080p HD:</strong> 1920 × 1080 (16:9)</li>
          <li>• <strong>720p HD:</strong> 1280 × 720 (16:9)</li>
          <li>• <strong>Instagram Square:</strong> 1080 × 1080 (1:1)</li>
          <li>• <strong>Instagram Story:</strong> 1080 × 1920 (9:16)</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter your current width and height to find the aspect ratio</li>
          <li>Use the resize tool to calculate new dimensions while keeping the ratio</li>
          <li>Click common ratios to apply them quickly</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
