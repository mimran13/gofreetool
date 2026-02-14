'use client';

import { useState, useEffect } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface ScreenInfo {
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  orientation: string;
}

export default function ScreenResolutionChecker() {
  const tool = getToolBySlug('screen-resolution-checker');
  const [info, setInfo] = useState<ScreenInfo | null>(null);

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        colorDepth: window.screen.colorDepth,
        orientation: window.screen.orientation?.type || 'unknown',
      });
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Check your <strong>screen resolution, viewport size, and display information</strong>.
          Useful for responsive design testing and display troubleshooting.
          <strong> Values update in real-time</strong> as you resize your browser.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {info ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Screen Resolution</h3>
                <div className="text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2">
                  {info.screenWidth} × {info.screenHeight}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Your monitor's native resolution
                </p>
              </div>

              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Viewport Size</h3>
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {info.viewportWidth} × {info.viewportHeight}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Browser window's visible area
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {info.devicePixelRatio}x
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pixel Ratio</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {info.colorDepth}-bit
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Color Depth</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(info.screenWidth / info.screenHeight).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Aspect Ratio</div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {info.orientation.replace('-primary', '').replace('-secondary', '')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Orientation</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">CSS Media Query</h4>
              <code className="text-sm text-teal-600 dark:text-teal-400 font-mono">
                @media (min-width: {info.viewportWidth}px)
              </code>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Common Breakpoints</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700 dark:text-blue-400">
          <span>Mobile: 320-480px</span>
          <span>Tablet: 768-1024px</span>
          <span>Laptop: 1024-1440px</span>
          <span>Desktop: 1440px+</span>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Your screen information is displayed automatically</li>
          <li>Resize your browser to see viewport changes in real-time</li>
          <li>Use the pixel ratio for responsive image sizing</li>
          <li>Reference the media query for CSS breakpoints</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
