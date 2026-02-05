'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// AES-GCM ENCRYPTION/DECRYPTION HELPERS
// ============================================================================

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptAES(plaintext: string, passphrase: string): Promise<{ success: boolean; result: string; error?: string }> {
  if (!plaintext) return { success: false, result: '', error: 'Please enter text to encrypt' };
  if (!passphrase) return { success: false, result: '', error: 'Please enter a passphrase' };

  try {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );

    // Combine salt + iv + ciphertext into single array
    const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(encrypted).length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    // Encode to Base64
    const base64 = btoa(String.fromCharCode(...combined));
    return { success: true, result: base64 };
  } catch (e) {
    return { success: false, result: '', error: `Encryption failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

async function decryptAES(ciphertext: string, passphrase: string): Promise<{ success: boolean; result: string; error?: string }> {
  if (!ciphertext) return { success: false, result: '', error: 'Please enter ciphertext to decrypt' };
  if (!passphrase) return { success: false, result: '', error: 'Please enter the passphrase' };

  try {
    // Decode from Base64
    const combined = new Uint8Array(
      atob(ciphertext).split('').map((c) => c.charCodeAt(0))
    );

    if (combined.length < 28) {
      return { success: false, result: '', error: 'Invalid ciphertext: too short' };
    }

    // Extract salt (16 bytes), iv (12 bytes), and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);

    const key = await deriveKey(passphrase, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    return { success: true, result: decoder.decode(decrypted) };
  } catch {
    return { success: false, result: '', error: 'Decryption failed. Check that the passphrase is correct and the ciphertext is valid.' };
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'encrypt' | 'decrypt';

export default function AESEncryptionDecryption() {
  const tool = getToolBySlug('aes-encryption-decryption');

  const [mode, setMode] = useState<Mode>('encrypt');
  const [input, setInput] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = useCallback(async () => {
    if (!input.trim()) {
      setError(mode === 'encrypt' ? 'Please enter text to encrypt' : 'Please enter ciphertext to decrypt');
      setOutput('');
      return;
    }
    if (!passphrase) {
      setError('Please enter a passphrase');
      setOutput('');
      return;
    }

    setIsProcessing(true);
    setError('');

    if (mode === 'encrypt') {
      const result = await encryptAES(input, passphrase);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Encryption failed');
      }
    } else {
      const result = await decryptAES(input.trim(), passphrase);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Decryption failed');
      }
    }

    setIsProcessing(false);
  }, [mode, input, passphrase]);

  const handleModeSwitch = useCallback((newMode: Mode) => {
    setMode(newMode);
    setOutput('');
    setError('');
  }, []);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
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

  const handleClear = useCallback(() => {
    setInput('');
    setPassphrase('');
    setOutput('');
    setError('');
  }, []);

  if (!tool) return <div>Tool not found</div>;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AES encryption?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AES (Advanced Encryption Standard) is a symmetric encryption algorithm adopted by the U.S. government and used worldwide. AES-256 uses a 256-bit key, providing extremely strong security. GCM (Galois/Counter Mode) adds authenticated encryption, ensuring data integrity alongside confidentiality.',
        },
      },
      {
        '@type': 'Question',
        name: 'What happens if I lose my passphrase?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If you lose the passphrase, the encrypted data cannot be recovered. AES-256 encryption is designed to be unbreakable without the correct key. There is no backdoor or recovery mechanism. Always store your passphrase securely.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this tool secure enough for sensitive data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'This tool uses AES-256-GCM with PBKDF2, which is industry-standard encryption. The processing happens entirely in your browser. However, for highly sensitive data, consider using dedicated encryption software with additional security features like key management.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why does encrypting the same text twice produce different results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Each encryption generates a random salt and initialization vector (IV). This ensures that even identical plaintext with the same passphrase produces different ciphertext each time, preventing attackers from detecting patterns.',
        },
      },
    ],
  };

  return (
    <ToolLayout tool={tool}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Encrypt and decrypt text using <strong>AES-256-GCM</strong>, one of the strongest
          encryption standards available. This free <strong>AES encryption tool</strong> uses the
          Web Crypto API with PBKDF2 key derivation (100,000 iterations) to convert your passphrase
          into a secure encryption key. The output is a Base64-encoded string containing the salt,
          initialization vector, and ciphertext. All processing happens entirely in your browser —
          your data and passphrase are never sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('encrypt')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'encrypt'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Encrypt
            </button>
            <button
              onClick={() => handleModeSwitch('decrypt')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'decrypt'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Decrypt
            </button>
          </div>
        </div>

        {/* Passphrase Input */}
        <div className="mb-6 max-w-lg mx-auto">
          <label htmlFor="passphrase" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Passphrase
          </label>
          <div className="relative">
            <input
              id="passphrase"
              type={showPassphrase ? 'text' : 'password'}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter your secret passphrase..."
              className="w-full px-4 py-3 pr-24 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white"
            />
            <button
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-600 rounded transition-colors"
            >
              {showPassphrase ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Use a strong passphrase. You&apos;ll need the exact same passphrase to decrypt.
          </p>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="aes-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Base64)'}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="aes-input"
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(''); setError(''); }}
              placeholder={
                mode === 'encrypt'
                  ? 'Enter text to encrypt...'
                  : 'Paste encrypted Base64 string...'
              }
              className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none dark:text-white"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'encrypt' ? 'Encrypted Output (Base64)' : 'Decrypted Plaintext'}
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
                mode === 'encrypt'
                  ? 'Encrypted output will appear here...'
                  : 'Decrypted text will appear here...'
              }
              className={`w-full h-48 px-4 py-3 font-mono text-sm border rounded-lg resize-none ${
                error
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />

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
            onClick={handleProcess}
            disabled={isProcessing || !input.trim() || !passphrase}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isProcessing ? 'Processing...' : mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Output'}
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !output && !passphrase}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear All
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
              All encryption and decryption happens directly in your browser using the{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">Web Crypto API</code>.
              Your plaintext, passphrase, and encrypted data never leave your device. This tool works
              offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use AES Encryption / Decryption
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select your mode:</strong> &quot;Encrypt&quot; converts plaintext to encrypted
            ciphertext, &quot;Decrypt&quot; reverses it.
          </li>
          <li>
            <strong>Enter a passphrase:</strong> Choose a strong, memorable passphrase. You&apos;ll
            need the exact same passphrase to decrypt later.
          </li>
          <li>
            <strong>Enter your text:</strong> Type or paste the text to encrypt or the Base64
            ciphertext to decrypt.
          </li>
          <li>
            <strong>Click Encrypt/Decrypt:</strong> The result will appear in the output panel.
          </li>
          <li>
            <strong>Copy the result:</strong> Use the &quot;Copy Output&quot; button to copy the
            encrypted or decrypted text.
          </li>
        </ol>
      </section>

      {/* Technical Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Technical Details
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Algorithm:</strong> AES-256-GCM (Galois/Counter Mode)
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Key Derivation:</strong> PBKDF2 with SHA-256, 100,000 iterations
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Salt:</strong> 16 bytes (128 bits), randomly generated per encryption
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>IV:</strong> 12 bytes (96 bits), randomly generated per encryption
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Output Format:</strong> Base64(salt || iv || ciphertext || auth_tag)
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🛡️', title: 'AES-256-GCM', desc: 'Military-grade encryption with authenticated encryption' },
            { icon: '🔑', title: 'PBKDF2 Key Derivation', desc: '100,000 iterations to resist brute-force attacks' },
            { icon: '🎲', title: 'Random Salt & IV', desc: 'Unique salt and IV generated for every encryption' },
            { icon: '✅', title: 'Authenticated Encryption', desc: 'GCM mode provides both confidentiality and integrity' },
            { icon: '📦', title: 'Base64 Output', desc: 'Safe text output for storage and transmission' },
            { icon: '🔒', title: 'Zero Server Contact', desc: 'Everything runs in your browser, nothing sent anywhere' },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need one-way hashing instead of encryption? Try our{' '}
          <Link href="/tools/hash-generator-checker" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Hash Generator & Checker
          </Link>{' '}
          for MD5 and SHA hashes. For encoding, check out our{' '}
          <Link href="/tools/base64-encoder-decoder" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Base64 Encoder/Decoder
          </Link>.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is AES encryption?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              AES (Advanced Encryption Standard) is a symmetric encryption algorithm adopted by the
              U.S. government and used worldwide. AES-256 uses a 256-bit key, providing extremely
              strong security. GCM (Galois/Counter Mode) adds authenticated encryption, ensuring data
              integrity alongside confidentiality.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What happens if I lose my passphrase?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              If you lose the passphrase, the encrypted data <strong>cannot be recovered</strong>.
              AES-256 encryption is designed to be unbreakable without the correct key. There is no
              backdoor or recovery mechanism. Always store your passphrase securely.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is this tool secure enough for sensitive data?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This tool uses AES-256-GCM with PBKDF2, which is industry-standard encryption. The
              processing happens entirely in your browser. However, for highly sensitive data, consider
              using dedicated encryption software with additional security features like key management.
              The security of the encryption depends heavily on your passphrase strength.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why does encrypting the same text twice produce different results?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Each encryption generates a random salt and initialization vector (IV). This ensures
              that even identical plaintext with the same passphrase produces different ciphertext
              each time, preventing attackers from detecting patterns. Both outputs will decrypt to
              the same plaintext with the correct passphrase.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
