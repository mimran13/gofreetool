'use client';

import { useState, useCallback, useRef } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png', description: 'Standard favicon' },
  { size: 32, name: 'favicon-32x32.png', description: 'Standard favicon' },
  { size: 48, name: 'favicon-48x48.png', description: 'Windows site icon' },
  { size: 64, name: 'favicon-64x64.png', description: 'Safari reading list' },
  { size: 96, name: 'favicon-96x96.png', description: 'Google TV icon' },
  { size: 180, name: 'apple-touch-icon.png', description: 'Apple Touch icon' },
  { size: 192, name: 'android-chrome-192x192.png', description: 'Android Chrome' },
  { size: 512, name: 'android-chrome-512x512.png', description: 'Android Chrome splash' },
];

interface GeneratedIcon {
  size: number;
  name: string;
  dataUrl: string;
}

export default function FaviconGenerator() {
  const tool = getToolBySlug('favicon-generator');
  const [preview, setPreview] = useState('');
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateIcons = useCallback((imageDataUrl: string) => {
    setGenerating(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const generatedIcons: GeneratedIcon[] = [];

      FAVICON_SIZES.forEach(({ size, name }) => {
        canvas.width = size;
        canvas.height = size;
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/png');
        generatedIcons.push({ size, name, dataUrl });
      });

      setIcons(generatedIcons);
      setGenerating(false);
    };
    img.src = imageDataUrl;
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      generateIcons(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [generateIcons]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  const downloadIcon = useCallback((icon: GeneratedIcon) => {
    const link = document.createElement('a');
    link.href = icon.dataUrl;
    link.download = icon.name;
    link.click();
  }, []);

  const downloadAll = useCallback(() => {
    icons.forEach((icon, index) => {
      setTimeout(() => downloadIcon(icon), index * 100);
    });
  }, [icons, downloadIcon]);

  const reset = useCallback(() => {
    setPreview('');
    setIcons([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const htmlCode = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">`;

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <canvas ref={canvasRef} className="hidden" />

      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate <strong>favicons</strong> for your website in all required sizes.
          Create icons for browsers, Apple devices, and Android devices from a single image.
          <strong> All processing happens in your browser</strong> — your images stay private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-teal-500 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-4xl mb-4">⭐</div>
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop an image here or click to select
            </div>
            <div className="text-sm text-gray-500">
              Use a square image (512x512 or larger recommended)
            </div>
          </label>
        </div>

        {generating && (
          <div className="mt-6 text-center text-gray-500">
            Generating favicons...
          </div>
        )}

        {preview && icons.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Generated Favicons</h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadAll}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  Download All
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {icons.map((icon) => (
                <div
                  key={icon.size}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center"
                >
                  <div className="flex justify-center mb-3">
                    <img
                      src={icon.dataUrl}
                      alt={icon.name}
                      style={{ width: Math.min(icon.size, 64), height: Math.min(icon.size, 64) }}
                      className="rounded"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {icon.size}x{icon.size}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{icon.name}</div>
                  <button
                    onClick={() => downloadIcon(icon)}
                    className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">HTML Code</h4>
              <pre className="p-4 bg-gray-900 rounded-lg text-sm text-gray-100 overflow-x-auto">
                {htmlCode}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Favicon Sizes Explained</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>16x16, 32x32:</strong> Standard browser tabs</li>
          <li>• <strong>180x180:</strong> Apple Touch Icon (iOS home screen)</li>
          <li>• <strong>192x192:</strong> Android Chrome home screen</li>
          <li>• <strong>512x512:</strong> Android Chrome splash screen</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Upload a square image (512x512 pixels or larger)</li>
          <li>All favicon sizes are generated automatically</li>
          <li>Download individual sizes or all at once</li>
          <li>Copy the HTML code and add it to your website&apos;s head section</li>
          <li>Place the favicon files in your website&apos;s root directory</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
