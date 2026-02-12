'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

type ReverseMode = 'characters' | 'words' | 'lines' | 'sentences';

export default function TextReverser() {
  const tool = getToolBySlug('text-reverser');
  const [text, setText] = useState('');
  const [mode, setMode] = useState<ReverseMode>('characters');
  const [copied, setCopied] = useState(false);

  const reversed = useMemo(() => {
    if (!text) return '';

    switch (mode) {
      case 'characters':
        return text.split('').reverse().join('');
      case 'words':
        return text.split(/(\s+)/).reverse().join('');
      case 'lines':
        return text.split('\n').reverse().join('\n');
      case 'sentences':
        return text.split(/(?<=[.!?])\s+/).reverse().join(' ');
      default:
        return text;
    }
  }, [text, mode]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reversed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [reversed]);

  const modes: { id: ReverseMode; name: string; description: string }[] = [
    { id: 'characters', name: 'Characters', description: 'Reverse all characters (mirror text)' },
    { id: 'words', name: 'Words', description: 'Reverse word order (keep letters)' },
    { id: 'lines', name: 'Lines', description: 'Reverse line order' },
    { id: 'sentences', name: 'Sentences', description: 'Reverse sentence order' },
  ];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>Reverse text</strong> by characters, words, lines, or sentences.
          Create mirror text, flip word order, or rearrange content in various ways.
          <strong> All processing happens in your browser</strong> — your content stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reverse Mode</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  mode === m.id
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">{m.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{m.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to reverse..."
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
            />
            <div className="mt-1 text-sm text-gray-500">{text.length} characters</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reversed Text</label>
              <button
                onClick={handleCopy}
                disabled={!reversed}
                className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <textarea
              value={reversed}
              readOnly
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
            />
            <div className="mt-1 text-sm text-gray-500">{reversed.length} characters</div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Examples</h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-500">Characters:</span>
            <span className="ml-2 font-mono">&quot;Hello World&quot;</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="font-mono text-teal-600">&quot;dlroW olleH&quot;</span>
          </div>
          <div>
            <span className="text-gray-500">Words:</span>
            <span className="ml-2 font-mono">&quot;Hello World&quot;</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="font-mono text-teal-600">&quot;World Hello&quot;</span>
          </div>
          <div>
            <span className="text-gray-500">Sentences:</span>
            <span className="ml-2 font-mono">&quot;First. Second. Third.&quot;</span>
            <span className="mx-2 text-gray-400">→</span>
            <span className="font-mono text-teal-600">&quot;Third. Second. First.&quot;</span>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use Cases</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Create mirror text for fun or artistic purposes</li>
          <li>Reverse word order for language exercises</li>
          <li>Flip list items or lines in code/text</li>
          <li>Generate backwards text for puzzles and games</li>
          <li>Test text rendering and display issues</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
