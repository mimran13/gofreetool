'use client';

import { useState, useCallback, useRef } from 'react';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { getToolBySlug } from '@/lib/tools';

interface ImageData {
  src: string;
  name: string;
  originalWidth: number;
  originalHeight: number;
}

export default function ImageResizer() {
  const tool = getToolBySlug('image-resizer');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [image, setImage] = useState<ImageData | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file upload
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setImage({
          src: event.target?.result as string,
          name: file.name,
          originalWidth: img.width,
          originalHeight: img.height,
        });
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(ratio);
        setResizedImage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle width change
  const handleWidthChange = useCallback(
    (value: string) => {
      const newWidth = parseInt(value) || 0;
      setWidth(newWidth);
      if (maintainAspectRatio && newWidth > 0) {
        setHeight(Math.round(newWidth / aspectRatio));
      }
      setResizedImage(null);
    },
    [maintainAspectRatio, aspectRatio]
  );

  // Handle height change
  const handleHeightChange = useCallback(
    (value: string) => {
      const newHeight = parseInt(value) || 0;
      setHeight(newHeight);
      if (maintainAspectRatio && newHeight > 0) {
        setWidth(Math.round(newHeight * aspectRatio));
      }
      setResizedImage(null);
    },
    [maintainAspectRatio, aspectRatio]
  );

  // Toggle aspect ratio
  const handleAspectRatioToggle = useCallback(() => {
    setMaintainAspectRatio((prev) => !prev);
  }, []);

  // Resize image
  const handleResize = useCallback(() => {
    if (!image || !canvasRef.current || width <= 0 || height <= 0) return;

    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const img = new Image();
    img.onload = () => {
      // Use better quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const resizedDataUrl = canvas.toDataURL('image/png');
      setResizedImage(resizedDataUrl);
      setIsProcessing(false);
    };
    img.src = image.src;
  }, [image, width, height]);

  // Download resized image
  const handleDownload = useCallback(() => {
    if (!resizedImage || !image) return;

    const link = document.createElement('a');
    const extension = 'png';
    const baseName = image.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}-${width}x${height}.${extension}`;
    link.href = resizedImage;
    link.click();
  }, [resizedImage, image, width, height]);

  // Reset
  const handleReset = useCallback(() => {
    setImage(null);
    setWidth(0);
    setHeight(0);
    setResizedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Preset sizes
  const presets = [
    { name: 'Profile (400x400)', width: 400, height: 400 },
    { name: 'Thumbnail (150x150)', width: 150, height: 150 },
    { name: 'HD (1280x720)', width: 1280, height: 720 },
    { name: 'Full HD (1920x1080)', width: 1920, height: 1080 },
    { name: 'Instagram (1080x1080)', width: 1080, height: 1080 },
    { name: 'Twitter (1200x675)', width: 1200, height: 675 },
  ];

  const applyPreset = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
    setMaintainAspectRatio(false);
    setResizedImage(null);
  };

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Tool not found. Please add image-resizer to lib/tools.ts</p>
      </div>
    );
  }

  return (
    <ToolLayout tool={tool}>
      {/* Hidden canvas for resizing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Resize images instantly in your browser. Upload any image, set your desired dimensions,
          and download the resized version. All processing happens locally — your images never
          leave your device.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* File Upload */}
        {!image ? (
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Click to upload an image
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, GIF, WebP, and more
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
                  className="max-h-64 max-w-full object-contain rounded"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                {image.name} • {image.originalWidth} × {image.originalHeight} px
              </p>
            </div>

            {/* Dimension Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Width"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Height"
                />
              </div>
            </div>

            {/* Aspect Ratio Toggle */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleAspectRatioToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  maintainAspectRatio ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    maintainAspectRatio ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Maintain aspect ratio
              </span>
            </div>

            {/* Preset Sizes */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Resize Button */}
            <button
              onClick={handleResize}
              disabled={isProcessing || width <= 0 || height <= 0}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-6"
            >
              {isProcessing ? 'Processing...' : `Resize to ${width} × ${height}`}
            </button>

            {/* Resized Preview & Download */}
            {resizedImage && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-green-800 dark:text-green-300">
                    Resized Image Ready
                  </h3>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {width} × {height} px
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center justify-center mb-4">
                  <img
                    src={resizedImage}
                    alt="Resized"
                    className="max-h-48 max-w-full object-contain rounded"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>⬇️</span>
                  Download Resized Image
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
              Your images never leave your device. All resizing is done locally in your browser
              using the HTML Canvas API. No uploads, no servers, complete privacy.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Image Resizer
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Upload an image</strong> by clicking the upload area or dragging a file.
          </li>
          <li>
            <strong>Set dimensions</strong> by entering width and height in pixels, or use a preset.
          </li>
          <li>
            <strong>Toggle aspect ratio</strong> to maintain or change the image proportions.
          </li>
          <li>
            <strong>Click Resize</strong> to process the image.
          </li>
          <li>
            <strong>Download</strong> your resized image with one click.
          </li>
        </ol>
      </section>

      {/* Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: '📱',
              title: 'Social Media',
              desc: 'Resize images for Instagram, Twitter, Facebook profiles and posts',
            },
            {
              icon: '🌐',
              title: 'Web Optimization',
              desc: 'Reduce image dimensions for faster website loading',
            },
            {
              icon: '📧',
              title: 'Email Attachments',
              desc: 'Shrink images to fit email size limits',
            },
            {
              icon: '🖨️',
              title: 'Print Preparation',
              desc: 'Resize images to specific print dimensions',
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

      {/* Tips */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips</h2>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            <span>Keep aspect ratio enabled to prevent image distortion.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            <span>Enlarging images may reduce quality — best results when downsizing.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500">•</span>
            <span>Output is PNG format for best quality and transparency support.</span>
          </li>
        </ul>
      </section>
    </ToolLayout>
  );
}
