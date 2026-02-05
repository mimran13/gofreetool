'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function QRCodeGenerator() {
  const tool = getToolBySlug('qr-code-generator');

  // State
  const [text, setText] = useState('https://gofreetool.com');
  const [size, setSize] = useState(300);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code
  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter text or a URL');
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
      return;
    }

    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: errorCorrection,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    }
  }, [text, size, errorCorrection, fgColor, bgColor]);

  // Generate on mount and when options change
  useEffect(() => {
    generateQR();
  }, [generateQR]);

  // Download as PNG
  const handleDownload = useCallback(() => {
    if (!canvasRef.current || error) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }, [error]);

  // Copy QR code image to clipboard
  const handleCopy = useCallback(async () => {
    if (!canvasRef.current || error) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvasRef.current!.toBlob(resolve, 'image/png')
      );
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch {
      setError('Failed to copy image. Try downloading instead.');
    }
  }, [error]);

  // Clear all
  const handleClear = useCallback(() => {
    setText('');
    setError('');
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // Presets
  const presets = [
    { label: 'URL', value: 'https://' },
    { label: 'Email', value: 'mailto:' },
    { label: 'Phone', value: 'tel:' },
    { label: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' },
  ];

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

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate <strong>QR codes</strong> instantly from any text, URL, email, phone number, or
          WiFi credentials. Customize the size, colors, and error correction level. Download your
          QR code as a high-quality PNG image. All processing happens in your browser—your data
          is never sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input & Options */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="qr-input"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Text or URL
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {text.length.toLocaleString()} chars
                </span>
              </div>
              <textarea
                id="qr-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text, URL, email, phone number..."
                className="w-full h-32 px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-colors"
                spellCheck={false}
              />
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setText(preset.value)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="600"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>100px</span>
                <span>600px</span>
              </div>
            </div>

            {/* Error Correction */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Error Correction
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setErrorCorrection(level)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      errorCorrection === level
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level} ({level === 'L' ? '7%' : level === 'M' ? '15%' : level === 'Q' ? '25%' : '30%'})
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Foreground
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: QR Code Preview */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-600 inline-block">
              <canvas ref={canvasRef} />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg w-full">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={handleDownload}
            disabled={!text.trim() || !!error}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={handleCopy}
            disabled={!text.trim() || !!error}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Image'}
          </button>
          <button
            onClick={handleClear}
            disabled={!text}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Your QR codes are generated entirely in your browser using the{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">qrcode</code> library
              and HTML Canvas. No data is ever sent to any server. This tool works offline after the
              page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the QR Code Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter your content</strong> — type or paste any text, URL, email address, phone
            number, or WiFi credentials into the input field.
          </li>
          <li>
            <strong>Use quick presets</strong> — click URL, Email, Phone, or WiFi buttons to
            pre-fill the correct format for common QR code types.
          </li>
          <li>
            <strong>Customize appearance</strong> — adjust the QR code size (100-600px), change
            foreground and background colors, and set the error correction level.
          </li>
          <li>
            <strong>Preview in real-time</strong> — your QR code updates instantly as you type or
            change settings.
          </li>
          <li>
            <strong>Download or copy</strong> — click &quot;Download PNG&quot; to save the image, or
            &quot;Copy Image&quot; to paste it directly into other apps.
          </li>
        </ol>
      </section>

      {/* What is a QR Code */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is a QR Code?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            A <strong>QR code</strong> (Quick Response code) is a two-dimensional barcode invented in
            1994 by Denso Wave. Unlike traditional barcodes that store data in one direction, QR codes
            store data both horizontally and vertically, allowing them to hold significantly more
            information — up to 4,296 alphanumeric characters.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            QR codes include built-in error correction using Reed-Solomon codes, which means they can
            still be read even if part of the code is damaged or obscured. The four error correction
            levels (L, M, Q, H) let you choose between data density and damage tolerance.
          </p>
        </div>
      </section>

      {/* Error Correction Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Error Correction Levels
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Level</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Recovery</th>
                <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">L (Low)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">~7% damage recovery</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Maximum data capacity, clean environments</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">M (Medium)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">~15% damage recovery</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">General purpose (default), good balance</td>
              </tr>
              <tr className="bg-white dark:bg-gray-900">
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">Q (Quartile)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">~25% damage recovery</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Industrial use, printed materials</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="px-4 py-3 font-mono font-bold text-gray-900 dark:text-white">H (High)</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">~30% damage recovery</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Logos on QR codes, outdoor use</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🔗', title: 'Website URLs', desc: 'Link to any website, landing page, or online resource' },
            { icon: '📱', title: 'Contact Info', desc: 'Share vCards with name, phone, email, and address' },
            { icon: '📶', title: 'WiFi Access', desc: 'Share WiFi credentials — guests scan to connect instantly' },
            { icon: '💳', title: 'Payments', desc: 'Link to payment pages, cryptocurrency addresses, or invoices' },
            { icon: '📧', title: 'Email & SMS', desc: 'Pre-compose emails or text messages with a scan' },
            { icon: '📍', title: 'Locations', desc: 'Share GPS coordinates or Google Maps links' },
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
          Need to encode data in other formats? Try our{' '}
          <Link href="/tools/base64-encoder-decoder" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Base64 Encoder/Decoder
          </Link>{' '}
          for text encoding, or our{' '}
          <Link href="/tools/url-encoder-decoder" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            URL Encoder/Decoder
          </Link>{' '}
          for URL-safe encoding. For generating secure passwords, check out our{' '}
          <Link href="/tools/password-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Password Generator
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
              How much data can a QR code hold?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A QR code can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or
              2,953 bytes of binary data. The actual capacity depends on the error correction level —
              higher error correction reduces capacity. For most URLs and text, this is more than
              sufficient.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I use custom colors for my QR code?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes! You can customize both the foreground (dark modules) and background colors using
              the color pickers. Ensure sufficient contrast between the two colors for reliable
              scanning. Dark foreground on light background works best. Avoid low-contrast
              combinations like yellow on white.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What error correction level should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              For most uses, <strong>M (Medium, 15%)</strong> is recommended as it provides a good
              balance between data capacity and error recovery. Use <strong>L</strong> for long URLs
              where you need maximum capacity, or <strong>H</strong> if the QR code will be printed
              on materials that may get damaged or if you plan to add a logo overlay.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How do I create a WiFi QR code?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Click the &quot;WiFi&quot; preset button and replace the placeholder values. The format
              is: <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">WIFI:T:WPA;S:YourNetworkName;P:YourPassword;;</code>.
              Change <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">WPA</code> to{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">WEP</code> or{' '}
              <code className="px-1 bg-gray-100 dark:bg-gray-900/50 rounded">nopass</code> for
              different security types.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is this QR code generator free?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, this QR code generator is completely free with no limits on usage. There are no
              watermarks, no sign-up required, and no restrictions. All QR codes are generated
              locally in your browser, so your data stays private.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
