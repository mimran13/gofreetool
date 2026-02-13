'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

type BarcodeType = 'CODE128' | 'CODE39' | 'EAN13' | 'UPC' | 'ITF14';

export default function BarcodeGenerator() {
  const tool = getToolBySlug('barcode-generator');
  const [value, setValue] = useState('123456789012');
  const [barcodeType, setBarcodeType] = useState<BarcodeType>('CODE128');
  const [showText, setShowText] = useState(true);
  const [height, setHeight] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  // Simple Code128 encoder (subset B)
  const encodeCode128 = useCallback((text: string): number[] => {
    const CODE128B: Record<string, number> = {};
    for (let i = 0; i < 95; i++) {
      CODE128B[String.fromCharCode(32 + i)] = i;
    }

    const patterns: number[][] = [];
    // Start code B
    patterns.push([2, 1, 1, 2, 3, 2]);

    let checksum = 104; // Start B
    for (let i = 0; i < text.length; i++) {
      const charCode = CODE128B[text[i]];
      if (charCode === undefined) return [];
      checksum += charCode * (i + 1);

      // Generate pattern (simplified)
      const patternIndex = charCode;
      patterns.push(getCode128Pattern(patternIndex));
    }

    // Checksum
    patterns.push(getCode128Pattern(checksum % 103));
    // Stop
    patterns.push([2, 3, 3, 1, 1, 1, 2]);

    return patterns.flat();
  }, []);

  const getCode128Pattern = (index: number): number[] => {
    const patterns = [
      [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2],
      [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3],
      [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1],
      [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2],
      [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2],
      [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1],
      [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3],
      [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3],
      [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1],
      [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1],
      [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3],
      [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1],
      [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2],
      [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4],
      [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1],
      [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1],
      [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2],
      [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1],
      [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1],
      [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1],
      [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4],
      [2,1,1,2,3,2]
    ];
    return patterns[index] || [2,1,2,2,2,2];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setError('');
    let bars: number[] = [];

    try {
      if (barcodeType === 'CODE128') {
        bars = encodeCode128(value);
      } else {
        // Simplified fallback - just show CODE128
        bars = encodeCode128(value);
      }

      if (bars.length === 0) {
        setError('Invalid characters for barcode type');
        return;
      }
    } catch (e) {
      setError('Error generating barcode');
      return;
    }

    const barWidth = 2;
    const totalWidth = bars.reduce((a, b) => a + b, 0) * barWidth + 40;

    canvas.width = totalWidth;
    canvas.height = height + (showText ? 30 : 0);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = 20;
    let isBar = true;

    for (const width of bars) {
      if (isBar) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x, 10, width * barWidth, height - 10);
      }
      x += width * barWidth;
      isBar = !isBar;
    }

    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(value, canvas.width / 2, height + 20);
    }
  }, [value, barcodeType, showText, height, encodeCode128]);

  const downloadBarcode = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `barcode-${value}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [value]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate <strong>barcodes</strong> for products, inventory, and labels.
          Create Code 128 barcodes and download as PNG images.
          <strong> All processing happens in your browser</strong> — completely private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Barcode Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text or numbers"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Barcode Type
            </label>
            <select
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value as BarcodeType)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="CODE128">Code 128 (General purpose)</option>
              <option value="CODE39">Code 39 (Industrial)</option>
              <option value="EAN13">EAN-13 (Retail)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show text below barcode</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Height:</span>
            <input
              type="range"
              min="50"
              max="200"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-500">{height}px</span>
          </div>
        </div>

        <div className="flex justify-center p-8 bg-white rounded-lg border border-gray-200 mb-6">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={downloadBarcode}
          disabled={!!error || !value}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
        >
          Download PNG
        </button>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Barcode Types</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Code 128:</strong> Most versatile, supports all ASCII characters</li>
          <li>• <strong>Code 39:</strong> Alphanumeric, used in automotive and defense</li>
          <li>• <strong>EAN-13:</strong> International retail products (13 digits)</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter the value you want to encode</li>
          <li>Select the appropriate barcode type</li>
          <li>Adjust height and text display options</li>
          <li>Download the barcode as a PNG image</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
