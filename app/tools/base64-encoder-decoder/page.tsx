'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// BASE64 ENCODING/DECODING HELPERS (Unicode-safe)
// ============================================================================

/**
 * Encode a string to Base64 (Unicode-safe)
 * Standard btoa() doesn't handle Unicode, so we use TextEncoder
 */
function encodeToBase64(text: string): { success: boolean; result: string; error?: string } {
  try {
    // Convert string to UTF-8 bytes, then to Base64
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    const base64 = btoa(binaryString);
    return { success: true, result: base64 };
  } catch (error) {
    return {
      success: false,
      result: '',
      error: `Encoding error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Decode a Base64 string to text (Unicode-safe)
 * Standard atob() doesn't handle Unicode, so we use TextDecoder
 */
function decodeFromBase64(base64: string): { success: boolean; result: string; error?: string } {
  // Remove whitespace and validate
  const cleanedBase64 = base64.replace(/\s/g, '');

  if (!cleanedBase64) {
    return { success: false, result: '', error: 'Please enter a Base64 string' };
  }

  // Validate Base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(cleanedBase64)) {
    return {
      success: false,
      result: '',
      error: 'Invalid Base64 format. Base64 can only contain A-Z, a-z, 0-9, +, /, and = (for padding)',
    };
  }

  // Check padding
  if (cleanedBase64.length % 4 !== 0) {
    return {
      success: false,
      result: '',
      error: 'Invalid Base64 length. Base64 strings must have a length divisible by 4',
    };
  }

  try {
    // Decode Base64 to binary string, then to UTF-8 text
    const binaryString = atob(cleanedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder('utf-8', { fatal: true });
    const text = decoder.decode(bytes);
    return { success: true, result: text };
  } catch (error) {
    // If UTF-8 decoding fails, try to show raw decoded bytes info
    try {
      const binaryString = atob(cleanedBase64);
      return {
        success: false,
        result: '',
        error: `Decoded successfully but contains binary/non-text data (${binaryString.length} bytes). This may be a file or image encoded in Base64.`,
      };
    } catch {
      return {
        success: false,
        result: '',
        error: `Decoding error: ${error instanceof Error ? error.message : 'Invalid Base64 string'}`,
      };
    }
  }
}

/**
 * Read file and convert to Base64
 */
function fileToBase64(file: File): Promise<{ success: boolean; result: string; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1] || result;
      resolve({ success: true, result: base64 });
    };

    reader.onerror = () => {
      resolve({
        success: false,
        result: '',
        error: `Failed to read file: ${reader.error?.message || 'Unknown error'}`,
      });
    };

    reader.readAsDataURL(file);
  });
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'encode' | 'decode';

export default function Base64EncoderDecoder() {
  // Get tool metadata
  const tool = getToolBySlug('base64-encoder-decoder');

  // State
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process input (encode or decode)
  const processInput = useCallback((text: string, currentMode: Mode) => {
    if (!text.trim()) {
      setOutput('');
      setError('');
      return;
    }

    if (currentMode === 'encode') {
      const result = encodeToBase64(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Encoding failed');
      }
    } else {
      const result = decodeFromBase64(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Decoding failed');
      }
    }
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newInput = e.target.value;
      setInput(newInput);
      setFileName('');
      processInput(newInput, mode);
    },
    [mode, processInput]
  );

  // Handle mode switch
  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      // Swap input and output when switching modes (if output exists)
      if (output && !error) {
        setInput(output);
        processInput(output, newMode);
      } else {
        processInput(input, newMode);
      }
      setFileName('');
    },
    [input, output, error, processInput]
  );

  // Handle file upload
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check file size (limit to 5MB for browser performance)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit. Please choose a smaller file.');
        return;
      }

      setIsProcessing(true);
      setFileName(file.name);
      setError('');

      const result = await fileToBase64(file);

      if (result.success) {
        setInput(`[File: ${file.name}]`);
        setOutput(result.result);
        setMode('encode');
        setError('');
      } else {
        setError(result.error || 'Failed to read file');
        setOutput('');
      }

      setIsProcessing(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    []
  );

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [output]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Base64</strong> is a binary-to-text encoding scheme that converts binary data into
          ASCII characters. Our free <strong>Base64 Encoder/Decoder</strong> tool lets you instantly
          convert text and files to Base64 format and decode Base64 strings back to their original
          content. Base64 is widely used for embedding images in HTML/CSS, encoding email attachments
          (MIME), storing binary data in JSON/XML, transmitting data in URLs, and encoding
          authentication credentials. This tool supports full Unicode text and file uploads up to 5MB.
          All encoding and decoding happens entirely in your browser using native JavaScript APIs—your
          data is never sent to any server, ensuring complete privacy and security.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('encode')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'encode'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => handleModeSwitch('decode')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'decode'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="base64-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>

            <textarea
              id="base64-input"
              value={fileName ? `[File: ${fileName}]` : input}
              onChange={handleInputChange}
              disabled={!!fileName}
              placeholder={
                mode === 'encode'
                  ? 'Enter text to encode to Base64...'
                  : 'Paste Base64 string to decode...'
              }
              className={`w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-colors ${
                fileName
                  ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700'
              } dark:text-white`}
              spellCheck={false}
            />

            {/* File Upload (only in encode mode) */}
            {mode === 'encode' && (
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg cursor-pointer transition-colors"
                >
                  {isProcessing ? 'Processing...' : 'Upload File'}
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Max 5MB • Any file type
                </span>
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
              </label>
              {output && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {output.length.toLocaleString()} chars
                </span>
              )}
            </div>

            <textarea
              value={output}
              readOnly
              placeholder={
                mode === 'encode'
                  ? 'Base64 encoded result will appear here...'
                  : 'Decoded text will appear here...'
              }
              className={`w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
                error
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={handleCopy}
            disabled={!output || !!error}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Output'}
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !output}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              if (output && !error) {
                setInput(output);
                const newMode = mode === 'encode' ? 'decode' : 'encode';
                setMode(newMode);
                processInput(output, newMode);
                setFileName('');
              }
            }}
            disabled={!output || !!error}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Swap & {mode === 'encode' ? 'Decode' : 'Encode'}
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
              All Base64 encoding and decoding happens directly in your browser using native JavaScript
              APIs (<code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">btoa</code>,
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">atob</code>,
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">FileReader</code>).
              Your data never leaves your device. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Base64 Encoder / Decoder
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select your mode</strong> using the toggle at the top: &quot;Encode&quot; converts
            text/files to Base64, &quot;Decode&quot; converts Base64 back to text.
          </li>
          <li>
            <strong>Enter your input</strong> in the left textarea. For encoding, type or paste any
            text including Unicode characters and emojis.
          </li>
          <li>
            <strong>Upload a file</strong> (encode mode only) by clicking &quot;Upload File&quot; to
            convert images, documents, or any file to Base64.
          </li>
          <li>
            <strong>View the result</strong> instantly in the right textarea as you type or after
            file upload.
          </li>
          <li>
            <strong>Copy the output</strong> using the &quot;Copy Output&quot; button, or use
            &quot;Swap & Decode/Encode&quot; to quickly reverse the operation.
          </li>
        </ol>
      </section>

      {/* What is Base64 Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is Base64 Encoding?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Base64 is a binary-to-text encoding scheme that represents binary data using 64 ASCII
            characters: A-Z, a-z, 0-9, +, and /. The equals sign (=) is used for padding. This
            encoding increases data size by approximately 33% but ensures safe transmission through
            text-only channels.
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
            <p className="font-mono text-sm text-gray-800 dark:text-gray-200 mb-2">
              <strong>Example:</strong>
            </p>
            <p className="font-mono text-sm">
              Text: <span className="text-teal-600 dark:text-teal-400">Hello World</span>
            </p>
            <p className="font-mono text-sm">
              Base64: <span className="text-purple-600 dark:text-purple-400">SGVsbG8gV29ybGQ=</span>
            </p>
          </div>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🖼️', title: 'Data URIs', desc: 'Embed images directly in HTML/CSS as Base64 data URIs' },
            { icon: '📧', title: 'Email Attachments', desc: 'MIME encoding for email attachments and content' },
            { icon: '🔐', title: 'Basic Auth', desc: 'HTTP Basic Authentication header encoding' },
            { icon: '📦', title: 'JSON/XML Storage', desc: 'Store binary data in text-only formats' },
            { icon: '🔗', title: 'URL Parameters', desc: 'Safely pass binary data in URL query strings' },
            { icon: '💾', title: 'LocalStorage', desc: 'Store binary data in browser localStorage' },
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
          Need to generate checksums? Try our{' '}
          <Link
            href="/tools/hash-generator"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Hash Generator
          </Link>{' '}
          for MD5, SHA-1, and SHA-256 hashes. For URL-safe encoding, check out our{' '}
          <span className="font-medium">URL Encoder/Decoder</span> (coming soon).
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
              Is Base64 encoding the same as encryption?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              No, <strong>Base64 is not encryption</strong>. It&apos;s simply an encoding scheme that
              converts binary data to text format. Anyone can decode Base64 without any key or password.
              Base64 is used for data transport, not security. If you need to protect sensitive data,
              use proper encryption algorithms like AES. Base64 is often used <em>after</em> encryption
              to safely transmit encrypted binary data as text.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why does Base64 increase data size?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Base64 uses 6 bits per character (2⁶ = 64 characters) to represent 8-bit bytes. This
              means every 3 bytes (24 bits) of input become 4 characters (24 bits) of output. The
              result is approximately 33% larger than the original. Additionally, padding characters
              (=) may be added to make the output length divisible by 4. This overhead is the trade-off
              for text-safe encoding.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What&apos;s the difference between Base64 and Base64URL?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Standard Base64 uses + and / characters, which have special meaning in URLs. Base64URL
              (also called URL-safe Base64) replaces + with - and / with _ to make the encoded string
              safe for use in URLs and filenames. Base64URL is commonly used in JWTs (JSON Web Tokens)
              and URL parameters. This tool uses standard Base64; for URL encoding, consider using
              encodeURIComponent() after Base64 encoding.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I encode/decode images with this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes! Use the &quot;Upload File&quot; button to select any image (PNG, JPG, GIF, etc.) and
              convert it to Base64. The output can be used as a data URI in HTML/CSS. For example:
              <code className="block mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                &lt;img src=&quot;data:image/png;base64,YOUR_BASE64_HERE&quot; /&gt;
              </code>
              Note that large images will produce very long Base64 strings, which may not be practical
              for embedding.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why do I get an error when decoding?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Decoding errors typically occur when: (1) The input contains invalid characters—Base64
              only allows A-Z, a-z, 0-9, +, /, and = for padding. (2) The string length isn&apos;t
              divisible by 4. (3) The decoded content is binary data (like an image) rather than text.
              If you&apos;re decoding binary data, the raw bytes can&apos;t be displayed as text. Try removing
              any whitespace or line breaks from your input.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
