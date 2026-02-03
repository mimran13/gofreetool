'use client';

import { useState, useCallback, useRef } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { getToolBySlug } from '@/lib/tools';

type OutputFormat = 'png' | 'jpg' | 'webp';

interface ImageData {
  src: string;
  name: string;
  originalFormat: string;
  width: number;
  height: number;
  size: number;
}

const FORMAT_OPTIONS: { value: OutputFormat; label: string; mime: string }[] = [
  { value: 'png', label: 'PNG', mime: 'image/png' },
  { value: 'jpg', label: 'JPG', mime: 'image/jpeg' },
  { value: 'webp', label: 'WebP', mime: 'image/webp' },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getFormatFromFile(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (ext === 'jpg' || ext === 'jpeg') return 'JPG';
  if (ext === 'png') return 'PNG';
  if (ext === 'webp') return 'WebP';
  return ext.toUpperCase();
}

export default function ImageFormatConverter() {
  const tool = getToolBySlug('image-format-converter');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [image, setImage] = useState<ImageData | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(92);

  // Handle file upload
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage({
          src: event.target?.result as string,
          name: file.name,
          originalFormat: getFormatFromFile(file),
          width: img.width,
          height: img.height,
          size: file.size,
        });
        setConvertedImage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // Convert image
  const handleConvert = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsConverting(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // For JPG, fill white background (no transparency support)
      if (outputFormat === 'jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      // Get format config
      const formatConfig = FORMAT_OPTIONS.find((f) => f.value === outputFormat);
      const mimeType = formatConfig?.mime || 'image/png';

      // Convert to target format
      const qualityValue = outputFormat === 'png' ? undefined : quality / 100;
      const dataUrl = canvas.toDataURL(mimeType, qualityValue);

      // Calculate converted size
      const base64Length = dataUrl.split(',')[1]?.length || 0;
      const sizeInBytes = Math.round((base64Length * 3) / 4);

      setConvertedImage(dataUrl);
      setConvertedSize(sizeInBytes);
      setIsConverting(false);
    };
    img.src = image.src;
  }, [image, outputFormat, quality]);

  // Download converted image
  const handleDownload = useCallback(() => {
    if (!convertedImage || !image) return;

    const link = document.createElement('a');
    const baseName = image.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}.${outputFormat}`;
    link.href = convertedImage;
    link.click();
  }, [convertedImage, image, outputFormat]);

  // Reset
  const handleReset = useCallback(() => {
    setImage(null);
    setConvertedImage(null);
    setConvertedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Handle drag and drop
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tool not found. Please add image-format-converter to lib/tools.ts</p>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {/* Hidden canvas for conversion */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert images between PNG, JPG, and WebP formats instantly in your browser.
          Upload any image and download it in your preferred format. All processing
          happens locally — your images never leave your device.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* File Upload */}
        {!image ? (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop an image here or click to upload
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PNG, JPG, and WebP formats
            </p>
          </div>
        ) : (
          <>
            {/* Image Preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Original Image</h3>
                <button
                  onClick={handleReset}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Remove
                </button>
              </div>
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-center">
                <img
                  src={image.src}
                  alt="Original"
                  className="max-h-48 max-w-full object-contain rounded"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{image.name}</span>
                <span>{image.originalFormat}</span>
                <span>{image.width} × {image.height}</span>
                <span>{formatFileSize(image.size)}</span>
              </div>
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Output Format
              </label>
              <div className="flex flex-wrap gap-3">
                {FORMAT_OPTIONS.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => {
                      setOutputFormat(format.value);
                      setConvertedImage(null);
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      outputFormat === format.value
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider (for JPG and WebP) */}
            {outputFormat !== 'png' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quality
                  </label>
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseInt(e.target.value));
                    setConvertedImage(null);
                  }}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={isConverting || image.originalFormat.toLowerCase() === outputFormat}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-6"
            >
              {isConverting
                ? 'Converting...'
                : image.originalFormat.toLowerCase() === outputFormat
                ? `Already in ${outputFormat.toUpperCase()} format`
                : `Convert to ${outputFormat.toUpperCase()}`}
            </button>

            {/* Converted Result */}
            {convertedImage && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    Conversion Complete
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {outputFormat.toUpperCase()} • {formatFileSize(convertedSize)}
                  </span>
                </div>

                {/* Size comparison */}
                <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Original:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{formatFileSize(image.size)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600 dark:text-gray-400">Converted:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{formatFileSize(convertedSize)}</span>
                  </div>
                  {convertedSize < image.size && (
                    <div className="flex items-center justify-between text-sm mt-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-green-600 dark:text-green-400">Saved:</span>
                      <span className="font-mono text-green-600 dark:text-green-400">
                        {formatFileSize(image.size - convertedSize)} ({Math.round((1 - convertedSize / image.size) * 100)}%)
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>⬇️</span>
                  Download {outputFormat.toUpperCase()}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Your images never leave your device. All conversion happens locally in your browser
              using the HTML Canvas API. No uploads, no servers, complete privacy.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Convert Image Formats
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Upload an image</strong> by clicking the upload area or dragging a file.
          </li>
          <li>
            <strong>Select output format</strong> — choose PNG, JPG, or WebP.
          </li>
          <li>
            <strong>Adjust quality</strong> (for JPG/WebP) using the slider.
          </li>
          <li>
            <strong>Click Convert</strong> to process the image.
          </li>
          <li>
            <strong>Download</strong> your converted image.
          </li>
        </ol>
      </section>

      {/* Format Comparison */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Format Comparison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">PNG</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ Lossless compression</li>
              <li>✓ Supports transparency</li>
              <li>✓ Best for graphics/logos</li>
              <li>✗ Larger file size</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">JPG</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ Small file size</li>
              <li>✓ Best for photos</li>
              <li>✓ Wide compatibility</li>
              <li>✗ No transparency</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">WebP</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✓ Smallest file size</li>
              <li>✓ Supports transparency</li>
              <li>✓ Best for web use</li>
              <li>✗ Limited older browser support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '🌐',
              title: 'Web Optimization',
              desc: 'Convert PNG to WebP for faster website loading',
            },
            {
              icon: '📧',
              title: 'Email Attachments',
              desc: 'Convert to JPG for smaller email attachments',
            },
            {
              icon: '🎨',
              title: 'Design Work',
              desc: 'Convert to PNG to preserve transparency',
            },
            {
              icon: '📱',
              title: 'Social Media',
              desc: 'Convert to compatible formats for different platforms',
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
    </ToolLayout>
  );
}
