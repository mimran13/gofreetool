'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// MORSE CODE MAPPING
// ============================================================================

const TEXT_TO_MORSE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.', ' ': '/',
};

const MORSE_TO_TEXT: Record<string, string> = {};
for (const [key, value] of Object.entries(TEXT_TO_MORSE)) {
  if (key !== ' ') {
    MORSE_TO_TEXT[value] = key;
  }
}

function textToMorse(text: string): { success: boolean; result: string; error?: string } {
  try {
    const upper = text.toUpperCase();
    const morseChars: string[] = [];
    for (const char of upper) {
      const morse = TEXT_TO_MORSE[char];
      if (morse !== undefined) {
        morseChars.push(morse);
      } else if (char === '\n') {
        morseChars.push('\n');
      } else {
        // Skip unsupported characters silently
      }
    }
    return { success: true, result: morseChars.join(' ').replace(/ \/ /g, ' / ').replace(/ \n /g, '\n') };
  } catch (e) {
    return { success: false, result: '', error: `Translation failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

function morseToText(morse: string): { success: boolean; result: string; error?: string } {
  try {
    const lines = morse.split('\n');
    const resultLines: string[] = [];

    for (const line of lines) {
      const words = line.split(' / ');
      const textWords: string[] = [];

      for (const word of words) {
        const chars = word.trim().split(/\s+/);
        let textWord = '';
        for (const char of chars) {
          if (!char) continue;
          const letter = MORSE_TO_TEXT[char];
          if (letter !== undefined) {
            textWord += letter;
          } else {
            return { success: false, result: '', error: `Unknown Morse code sequence: "${char}"` };
          }
        }
        textWords.push(textWord);
      }

      resultLines.push(textWords.join(' '));
    }

    return { success: true, result: resultLines.join('\n') };
  } catch (e) {
    return { success: false, result: '', error: `Translation failed: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}

// ============================================================================
// AUDIO PLAYBACK
// ============================================================================

function playMorseAudio(morse: string, abortSignal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dotDuration = 0.08;
    const dashDuration = dotDuration * 3;
    const pauseBetweenParts = dotDuration;
    const pauseBetweenChars = dotDuration * 3;
    const pauseBetweenWords = dotDuration * 7;

    let time = audioCtx.currentTime + 0.1;

    for (const char of morse) {
      if (abortSignal.aborted) {
        audioCtx.close();
        resolve();
        return;
      }

      if (char === '.') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.5;
        osc.start(time);
        osc.stop(time + dotDuration);
        time += dotDuration + pauseBetweenParts;
      } else if (char === '-') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 600;
        gain.gain.value = 0.5;
        osc.start(time);
        osc.stop(time + dashDuration);
        time += dashDuration + pauseBetweenParts;
      } else if (char === ' ') {
        time += pauseBetweenChars - pauseBetweenParts;
      } else if (char === '/') {
        time += pauseBetweenWords - pauseBetweenChars;
      }
    }

    const totalDuration = (time - audioCtx.currentTime) * 1000;
    setTimeout(() => {
      audioCtx.close();
      resolve();
    }, totalDuration + 100);
  });
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type Mode = 'text-to-morse' | 'morse-to-text';

export default function MorseCodeTranslator() {
  const tool = getToolBySlug('morse-code-translator');

  const [mode, setMode] = useState<Mode>('text-to-morse');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const processInput = useCallback((text: string, currentMode: Mode) => {
    if (!text.trim()) {
      setOutput('');
      setError('');
      return;
    }

    if (currentMode === 'text-to-morse') {
      const result = textToMorse(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Translation failed');
      }
    } else {
      const result = morseToText(text);
      if (result.success) {
        setOutput(result.result);
        setError('');
      } else {
        setOutput('');
        setError(result.error || 'Translation failed');
      }
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value;
      setInput(text);
      processInput(text, mode);
    },
    [mode, processInput]
  );

  const handleModeSwitch = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      if (output && !error) {
        setInput(output);
        processInput(output, newMode);
      } else {
        processInput(input, newMode);
      }
    },
    [input, output, error, processInput]
  );

  const handlePlayAudio = useCallback(async () => {
    const morseToPlay = mode === 'text-to-morse' ? output : input;
    if (!morseToPlay || isPlaying) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsPlaying(true);

    try {
      await playMorseAudio(morseToPlay, controller.signal);
    } catch {
      // Ignore abort errors
    }

    setIsPlaying(false);
  }, [mode, output, input, isPlaying]);

  const handleStopAudio = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsPlaying(false);
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
    setOutput('');
    setError('');
    handleStopAudio();
  }, [handleStopAudio]);

  if (!tool) return <div>Tool not found</div>;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Morse code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Morse code is a character encoding method that represents letters and numbers as sequences of dots (short signals) and dashes (long signals). Invented by Samuel Morse and Alfred Vail in the 1830s, it was originally used for telegraph communication. The International (ITU) standard is the most widely used version today.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does SOS look like in Morse code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SOS in Morse code is ... --- ... (three dots, three dashes, three dots). It was chosen as the international distress signal because it is easy to transmit and recognize.',
        },
      },
      {
        '@type': 'Question',
        name: 'How is timing structured in Morse code?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A dot is the basic time unit. A dash is 3 dots long. The gap between parts of a letter is 1 dot, between letters is 3 dots, and between words is 7 dots.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Morse code still used today?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. While Morse code is no longer required for commercial maritime or aviation, it is still used by amateur (ham) radio operators, in aviation navigation aids (VOR/NDB), for accessibility devices, and as a hobby.',
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
          Convert <strong>text to Morse code</strong> and <strong>Morse code to text</strong> instantly.
          This free <strong>Morse code translator</strong> supports the International (ITU) Morse code
          standard, including all letters A-Z, numbers 0-9, and common punctuation marks. Listen to
          the Morse code audio playback using the Web Audio API. All translation happens entirely in
          your browser — no data is sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => handleModeSwitch('text-to-morse')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'text-to-morse'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Text to Morse
            </button>
            <button
              onClick={() => handleModeSwitch('morse-to-text')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'morse-to-text'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Morse to Text
            </button>
          </div>
        </div>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="morse-input" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'text-to-morse' ? 'Text Input' : 'Morse Code Input'}
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {input.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              id="morse-input"
              value={input}
              onChange={handleInputChange}
              placeholder={
                mode === 'text-to-morse'
                  ? 'Enter text to translate to Morse code...'
                  : 'Enter Morse code (use . and -, spaces between letters, / between words)...'
              }
              className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none dark:text-white"
              spellCheck={false}
            />
            {mode === 'morse-to-text' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Use dots (.) and dashes (-), spaces between letters, and slash (/) between words.
              </p>
            )}
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {mode === 'text-to-morse' ? 'Morse Code Output' : 'Text Output'}
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
                mode === 'text-to-morse'
                  ? 'Morse code will appear here...'
                  : 'Decoded text will appear here...'
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
            onClick={handleCopy}
            disabled={!output || !!error}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Output'}
          </button>
          {!isPlaying ? (
            <button
              onClick={handlePlayAudio}
              disabled={!output && mode === 'text-to-morse' || !input && mode === 'morse-to-text'}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Play Audio
            </button>
          ) : (
            <button
              onClick={handleStopAudio}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              Stop
            </button>
          )}
          <button
            onClick={() => {
              if (output && !error) {
                setInput(output);
                const newMode = mode === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse';
                setMode(newMode);
                processInput(output, newMode);
              }
            }}
            disabled={!output || !!error}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            Swap
          </button>
          <button
            onClick={handleClear}
            disabled={!input && !output}
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
              All Morse code translation and audio playback happen directly in your browser using
              JavaScript and the{' '}
              <code className="px-1 bg-green-100 dark:bg-green-900/50 rounded">Web Audio API</code>.
              Your data never leaves your device.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Morse Code Translator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select your mode:</strong> &quot;Text to Morse&quot; converts regular text to
            Morse code, &quot;Morse to Text&quot; decodes Morse back to text.
          </li>
          <li>
            <strong>Enter your input:</strong> Type or paste text for encoding, or enter dots and
            dashes for decoding.
          </li>
          <li>
            <strong>Morse code format:</strong> Use dots (.) and dashes (-) for each character,
            spaces between letters, and slash (/) between words.
          </li>
          <li>
            <strong>Play audio:</strong> Click &quot;Play Audio&quot; to hear the Morse code
            as audio beeps at 600Hz.
          </li>
          <li>
            <strong>Copy or swap:</strong> Copy the result or swap input/output to reverse
            the translation.
          </li>
        </ol>
      </section>

      {/* Morse Code Reference */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          International Morse Code Reference
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(TEXT_TO_MORSE)
            .filter(([key]) => key !== ' ')
            .slice(0, 36)
            .map(([char, morse]) => (
              <div key={char} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm font-mono">
                <span className="font-bold text-gray-900 dark:text-white w-6 text-center">{char}</span>
                <span className="text-teal-600 dark:text-teal-400">{morse}</span>
              </div>
            ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🌍', title: 'ITU Standard', desc: 'International Telecommunication Union Morse code standard' },
            { icon: '🔤', title: 'Full Character Set', desc: 'Letters A-Z, numbers 0-9, and common punctuation' },
            { icon: '🔊', title: 'Audio Playback', desc: 'Listen to Morse code with Web Audio API beeps' },
            { icon: '🔄', title: 'Bidirectional', desc: 'Convert text to Morse and Morse to text' },
            { icon: '⚡', title: 'Real-Time', desc: 'Instant translation as you type' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Works on all devices including phones and tablets' },
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
          Need text encoding? Try our{' '}
          <Link href="/tools/base64-encoder-decoder" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Base64 Encoder/Decoder
          </Link>{' '}
          or{' '}
          <Link href="/tools/hex-text-converter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Hex-Text Converter
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
              What is Morse code?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Morse code is a character encoding method that represents letters and numbers as
              sequences of dots (short signals) and dashes (long signals). Invented by Samuel Morse
              and Alfred Vail in the 1830s, it was originally used for telegraph communication. The
              International (ITU) standard is the most widely used version today.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What does SOS look like in Morse code?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              SOS in Morse code is <strong className="font-mono">... --- ...</strong> (three dots,
              three dashes, three dots). It was chosen as the international distress signal because
              it&apos;s easy to transmit and recognize, not because it stands for &quot;Save Our Souls&quot;
              — that&apos;s a backronym.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How is timing structured in Morse code?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A dot is the basic time unit. A dash is 3 dots long. The gap between parts of a letter
              is 1 dot, between letters is 3 dots, and between words is 7 dots. This audio tool uses
              an 80ms dot duration at 600Hz for clear playback.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is Morse code still used today?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes. While Morse code is no longer required for commercial maritime or aviation, it is
              still used by amateur (ham) radio operators, in aviation navigation aids (VOR/NDB), for
              accessibility devices, and as a fun hobby. Some smartphone keyboards also support Morse
              code input.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
