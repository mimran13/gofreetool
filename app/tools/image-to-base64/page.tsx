'use client';

import { useState, useCallback, useRef } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function ImageToBase64() {
  const tool = getToolBySlug('image-to-base64');
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [mimeType, setMimeType] = useState('');
  const [copied, setCopied] = useState<'base64' | 'dataurl' | 'css' | 'html' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);
    setMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreview(dataUrl);
      // Extract base64 part (remove data:image/...;base64, prefix)
      const base64Part = dataUrl.split(',')[1];
      setBase64(base64Part);
    };
    reader.readAsDataURL(file);
  }, []);

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

  const handleCopy = useCallback(async (type: 'base64' | 'dataurl' | 'css' | 'html') => {
    let text = '';
    switch (type) {
      case 'base64':
        text = base64;
        break;
      case 'dataurl':
        text = `data:${mimeType};base64,${base64}`;
        break;
      case 'css':
        text = `background-image: url('data:${mimeType};base64,${base64}');`;
        break;
      case 'html':
        text = `<img src="data:${mimeType};base64,${base64}" alt="${fileName}" />`;
        break;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) { /* Fallback */ }
  }, [base64, mimeType, fileName]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const reset = useCallback(() => {
    setBase64('');
    setPreview('');
    setFileName('');
    setFileSize(0);
    setMimeType('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert images to <strong>Base64 encoded strings</strong> for embedding directly in HTML, CSS, or JSON.
          Useful for reducing HTTP requests for small images like icons and logos.
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
            <div className="text-4xl mb-4">🖼️</div>
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop an image here or click to select
            </div>
            <div className="text-sm text-gray-500">
              Supports PNG, JPG, GIF, WebP, SVG
            </div>
          </label>
        </div>

        {preview && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Preview</h3>
              <button
                onClick={reset}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-48 max-h-48 rounded-lg border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="flex-1 space-y-2 text-sm">
                <div><span className="text-gray-500">File:</span> <span className="font-medium">{fileName}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{mimeType}</span></div>
                <div><span className="text-gray-500">Original Size:</span> <span className="font-medium">{formatBytes(fileSize)}</span></div>
                <div><span className="text-gray-500">Base64 Size:</span> <span className="font-medium">{formatBytes(base64.length)}</span></div>
                <div className="text-yellow-600 dark:text-yellow-400">
                  ⚠️ Base64 increases size by ~33%
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data URL</label>
                  <button
                    onClick={() => handleCopy('dataurl')}
                    className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors"
                  >
                    {copied === 'dataurl' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <textarea
                  value={`data:${mimeType};base64,${base64.substring(0, 100)}...`}
                  readOnly
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleCopy('base64')}
                  className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {copied === 'base64' ? '✓ Copied!' : 'Copy Base64 Only'}
                  </div>
                  <div className="text-xs text-gray-500">Raw base64 string</div>
                </button>
                <button
                  onClick={() => handleCopy('css')}
                  className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {copied === 'css' ? '✓ Copied!' : 'Copy as CSS'}
                  </div>
                  <div className="text-xs text-gray-500">background-image: url(...)</div>
                </button>
                <button
                  onClick={() => handleCopy('html')}
                  className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {copied === 'html' ? '✓ Copied!' : 'Copy as HTML'}
                  </div>
                  <div className="text-xs text-gray-500">&lt;img src=&quot;...&quot; /&gt;</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">When to Use Base64 Images</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Good for:</strong> Small images under 10KB (icons, logos, UI elements)</li>
          <li>• <strong>Benefit:</strong> Eliminates extra HTTP requests</li>
          <li>• <strong>Avoid for:</strong> Large images (increased HTML/CSS file size)</li>
          <li>• <strong>Note:</strong> Base64 images cannot be cached separately</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Drop an image or click to select from your device</li>
          <li>Preview the image and check size information</li>
          <li>Copy the Base64 in your preferred format (raw, CSS, or HTML)</li>
          <li>Paste into your code</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
