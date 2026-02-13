'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const styles: { name: string; transform: (text: string) => string }[] = [
  {
    name: 'Bold',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Bold Italic',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D468 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D482 + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Script',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D49C + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D4B6 + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Double-Struck',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D538 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Fraktur',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D504 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D51E + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Monospace',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Circled',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x24B6 + code - 65);
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x24D0 + code - 97);
      return c;
    }).join('')
  },
  {
    name: 'Squared',
    transform: (text) => text.toUpperCase().split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1F130 + code - 65);
      return c;
    }).join('')
  },
  {
    name: 'Fullwidth',
    transform: (text) => text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 33 && code <= 126) return String.fromCodePoint(0xFF01 + code - 33);
      return c;
    }).join('')
  },
  {
    name: 'Small Caps',
    transform: (text) => {
      const smallCaps: Record<string, string> = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ',
        'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ',
        'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x',
        'y': 'ʏ', 'z': 'ᴢ'
      };
      return text.toLowerCase().split('').map(c => smallCaps[c] || c).join('');
    }
  },
  {
    name: 'Upside Down',
    transform: (text) => {
      const upsideDown: Record<string, string> = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
        'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
        'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
        'y': 'ʎ', 'z': 'z', '!': '¡', '?': '¿', '.': '˙', ',': "'", "'": ',',
        'A': '∀', 'B': 'q', 'C': 'Ɔ', 'D': 'p', 'E': 'Ǝ', 'F': 'Ⅎ', 'G': '⅁', 'H': 'H',
        'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
        'Q': 'Q', 'R': 'ɹ', 'S': 'S', 'T': '⊥', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
        'Y': '⅄', 'Z': 'Z'
      };
      return text.split('').map(c => upsideDown[c] || c).reverse().join('');
    }
  },
];

export default function FancyTextGenerator() {
  const tool = getToolBySlug('fancy-text-generator');
  const [input, setInput] = useState('Hello World');
  const [copied, setCopied] = useState<string | null>(null);

  const results = useMemo(() => {
    return styles.map(style => ({
      name: style.name,
      text: style.transform(input),
    }));
  }, [input]);

  const handleCopy = useCallback(async (text: string, name: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) { /* Fallback */ }
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert your text into <strong>fancy Unicode styles</strong> for social media bios,
          usernames, and posts. Works on Instagram, Twitter, Facebook, TikTok, and more.
          <strong> All processing happens in your browser</strong> — completely private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Your Text
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something..."
            className="w-full px-4 py-3 text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-3">
          {results.map(({ name, text }) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{name}</div>
                <div className="text-lg text-gray-900 dark:text-white truncate">{text}</div>
              </div>
              <button
                onClick={() => handleCopy(text, name)}
                className="ml-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded-lg transition-colors flex-shrink-0"
              >
                {copied === name ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How It Works</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          These aren&apos;t fonts—they&apos;re special Unicode characters that look like styled letters.
          They work anywhere Unicode is supported, including Instagram bios, Twitter names, and more.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Popular Uses</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Instagram bio and display name</li>
          <li>Twitter/X username and bio</li>
          <li>TikTok profile</li>
          <li>Discord nicknames</li>
          <li>Gaming usernames</li>
          <li>WhatsApp status</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
