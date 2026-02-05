'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// HELPERS
// ============================================================================

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type OutputFormat = 'jpeg' | 'webp' | 'png';

interface CompressedResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export default function ImageCompressor() {
  const tool = getToolBySlug('image-compressor');

  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [compressed, setCompressed] = useState<CompressedResult | null>(null);
  const [quality, setQuality] = useState(75);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('jpeg');
  const [maxWidth, setMaxWidth] = useState(0); // 0 = original
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Compress image
  const compressImage = useCallback(
    async (file: File, q: number, format: OutputFormat, mw: number) => {
      setIsProcessing(true);
      setError('');

      try {
        const img = new Image();
        const url = URL.createObjectURL(file);

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = url;
        });

        setOriginalDimensions({ width: img.width, height: img.height });

        // Calculate dimensions
        let targetWidth = img.width;
        let targetHeight = img.height;

        if (mw > 0 && img.width > mw) {
          const ratio = mw / img.width;
          targetWidth = mw;
          targetHeight = Math.round(img.height * ratio);
        }

        // Draw to canvas
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to blob
        const mimeType =
          format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
        const qualityParam = format === 'png' ? undefined : q / 100;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error('Failed to compress image'));
            },
            mimeType,
            qualityParam
          );
        });

        // Clean up old URL
        if (compressed?.url) URL.revokeObjectURL(compressed.url);

        const compressedUrl = URL.createObjectURL(blob);
        setCompressed({
          blob,
          url: compressedUrl,
          width: targetWidth,
          height: targetHeight,
        });

        URL.revokeObjectURL(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Compression failed');
      } finally {
        setIsProcessing(false);
      }
    },
    [compressed]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, WebP, etc.)');
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        return;
      }

      if (originalUrl) URL.revokeObjectURL(originalUrl);

      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setError('');
      compressImage(file, quality, outputFormat, maxWidth);
    },
    [quality, outputFormat, maxWidth, originalUrl, compressImage]
  );

  // Handle quality change
  const handleQualityChange = useCallback(
    (q: number) => {
      setQuality(q);
      if (originalFile) compressImage(originalFile, q, outputFormat, maxWidth);
    },
    [originalFile, outputFormat, maxWidth, compressImage]
  );

  // Handle format change
  const handleFormatChange = useCallback(
    (format: OutputFormat) => {
      setOutputFormat(format);
      if (originalFile) compressImage(originalFile, quality, format, maxWidth);
    },
    [originalFile, quality, maxWidth, compressImage]
  );

  // Handle max width change
  const handleMaxWidthChange = useCallback(
    (w: number) => {
      setMaxWidth(w);
      if (originalFile) compressImage(originalFile, quality, outputFormat, w);
    },
    [originalFile, quality, outputFormat, compressImage]
  );

  // Download
  const handleDownload = useCallback(() => {
    if (!compressed) return;
    const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    const link = document.createElement('a');
    link.download = `compressed.${ext}`;
    link.href = compressed.url;
    link.click();
  }, [compressed, outputFormat]);

  // Clear
  const handleClear = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressed?.url) URL.revokeObjectURL(compressed.url);
    setOriginalFile(null);
    setOriginalUrl('');
    setOriginalDimensions({ width: 0, height: 0 });
    setCompressed(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [originalUrl, compressed]);

  // Calculate savings
  const savings = originalFile && compressed
    ? {
        originalSize: originalFile.size,
        compressedSize: compressed.blob.size,
        reduction: Math.max(0, Math.round((1 - compressed.blob.size / originalFile.size) * 100)),
      }
    : null;

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (tool.faq || []).map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* Hidden canvas for compression */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Compress images instantly in your browser. Reduce file size while maintaining visual
          quality by adjusting the compression level. Supports <strong>JPEG</strong>,{' '}
          <strong>WebP</strong>, and <strong>PNG</strong> output formats with optional resizing.
          All processing happens locally — your images never leave your device.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Upload Area */}
        {!originalFile ? (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const file = e.dataTransfer.files[0];
              if (file) {
                const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
                handleFileUpload(fakeEvent);
              }
            }}
          >
            <div className="text-4xl mb-3">🖼️</div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Drop an image here or click to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PNG, JPG, WebP, GIF — up to 50MB
            </p>
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Quality */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-teal-600"
                  disabled={outputFormat === 'png'}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Small file</span>
                  <span>High quality</span>
                </div>
                {outputFormat === 'png' && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    PNG is lossless — quality slider has no effect
                  </p>
                )}
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Output Format
                </label>
                <div className="flex gap-2">
                  {(['jpeg', 'webp', 'png'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleFormatChange(fmt)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex-1 ${
                        outputFormat === fmt
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Width */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Max Width
                </label>
                <select
                  value={maxWidth}
                  onChange={(e) => handleMaxWidthChange(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                >
                  <option value={0}>Original ({originalDimensions.width}px)</option>
                  <option value={1920}>1920px (Full HD)</option>
                  <option value={1280}>1280px (HD)</option>
                  <option value={800}>800px</option>
                  <option value={640}>640px</option>
                  <option value={480}>480px</option>
                </select>
              </div>
            </div>

            {/* Results Stats */}
            {savings && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatFileSize(savings.originalSize)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{originalDimensions.width} x {originalDimensions.height}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Compressed</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatFileSize(savings.compressedSize)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{compressed?.width} x {compressed?.height}</p>
                </div>
                <div className={`p-4 rounded-lg text-center ${
                  savings.reduction > 0
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : 'bg-amber-50 dark:bg-amber-900/20'
                }`}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Saved</p>
                  <p className={`font-bold text-xl ${
                    savings.reduction > 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {savings.reduction}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(Math.abs(savings.originalSize - savings.compressedSize))}
                    {savings.reduction <= 0 ? ' larger' : ' smaller'}
                  </p>
                </div>
              </div>
            )}

            {/* Preview */}
            {compressed && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Preview (Compressed)</p>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-900 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={compressed.url}
                    alt="Compressed preview"
                    className="max-w-full max-h-80 object-contain rounded"
                  />
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">Compressing...</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleDownload}
                disabled={!compressed || isProcessing}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                Download Compressed
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Upload New Image
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All image compression happens in your browser using the HTML Canvas API. Your images
              are never uploaded to any server. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Image Compressor
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Upload an image</strong> — drag and drop or click to select a PNG, JPG, WebP,
            or GIF file (up to 50MB).
          </li>
          <li>
            <strong>Adjust quality</strong> — use the slider to set the compression level (1-100%).
            Lower values = smaller file, higher values = better quality.
          </li>
          <li>
            <strong>Choose output format</strong> — select JPEG for photos, WebP for best
            compression, or PNG for lossless output.
          </li>
          <li>
            <strong>Optionally resize</strong> — set a maximum width to reduce dimensions and further
            decrease file size.
          </li>
          <li>
            <strong>Download</strong> — click &quot;Download Compressed&quot; to save the optimized
            image.
          </li>
        </ol>
      </section>

      {/* Format Comparison */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Image Format Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Format</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Compression</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">JPEG</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Lossy, adjustable quality</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Photos, complex images with gradients</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">WebP</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Lossy or lossless, ~30% smaller than JPEG</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Web images, best overall compression</td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">PNG</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Lossless, no quality loss</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Screenshots, logos, images with transparency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🌐', title: 'Web Performance', desc: 'Reduce image sizes for faster page loads and better Core Web Vitals' },
            { icon: '📧', title: 'Email Attachments', desc: 'Compress images to fit email attachment size limits' },
            { icon: '📱', title: 'Social Media', desc: 'Optimize images for social platforms while keeping quality' },
            { icon: '💾', title: 'Storage Savings', desc: 'Reduce storage space needed for image archives' },
            { icon: '🎨', title: 'Design Workflow', desc: 'Export optimized images from design mockups and prototypes' },
            { icon: '📊', title: 'Presentations', desc: 'Compress images to reduce presentation and document file sizes' },
          ].map((useCase) => (
            <div key={useCase.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{useCase.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{useCase.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{useCase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to resize images? Try our{' '}
          <Link href="/tools/image-resizer" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Image Resizer
          </Link>. To convert between formats, use our{' '}
          <Link href="/tools/image-format-converter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Image Format Converter
          </Link>. For generating QR codes, check our{' '}
          <Link href="/tools/qr-code-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            QR Code Generator
          </Link>.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What quality level should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              For most web images, <strong>75-80%</strong> quality offers the best balance between
              file size and visual quality. For photos where quality matters, use 85-90%. Below 60%,
              compression artifacts become noticeable. For thumbnails or previews, 50-60% is
              acceptable.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Should I use JPEG, WebP, or PNG?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Use <strong>WebP</strong> for the best compression (supported in all modern browsers).
              Use <strong>JPEG</strong> for maximum compatibility, especially for photos. Use{' '}
              <strong>PNG</strong> when you need transparency or lossless quality (screenshots, logos,
              text-heavy images).
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why is my PNG output larger than the original?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              PNG is a lossless format, so the quality slider has no effect. If you convert a
              compressed JPEG to PNG, the output may be larger because PNG preserves all pixel data
              without lossy compression. For smaller file sizes, use JPEG or WebP instead.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Are my images safe?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes. All compression happens entirely in your browser using the HTML Canvas API. Your
              images are never sent to any server. You can verify this by checking your browser&apos;s
              network tab — no image data is transmitted.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
