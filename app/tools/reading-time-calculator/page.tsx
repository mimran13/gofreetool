'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function ReadingTimeCalculator() {
  const tool = getToolBySlug('reading-time-calculator');
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\n+/).filter(Boolean).length;

    const readingMinutes = words / wpm;
    const readingSeconds = Math.round(readingMinutes * 60);
    const speakingMinutes = words / 150; // Average speaking rate

    return {
      words,
      characters,
      sentences,
      paragraphs,
      readingMinutes,
      readingSeconds,
      speakingMinutes,
    };
  }, [text, wpm]);

  const formatTime = (minutes: number) => {
    if (minutes < 1) {
      return `${Math.round(minutes * 60)} sec`;
    }
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    if (secs === 0) return `${mins} min`;
    return `${mins} min ${secs} sec`;
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Calculate <strong>estimated reading time</strong> for your articles, blog posts, and documents.
          Perfect for content creators who want to help readers plan their time.
          <strong> All processing happens locally</strong> — your content stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste your text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your article, blog post, or any text here..."
              className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reading Speed: {wpm} WPM
              </label>
              <input
                type="range"
                min="100"
                max="400"
                value={wpm}
                onChange={(e) => setWpm(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow (100)</span>
                <span>Average (200)</span>
                <span>Fast (400)</span>
              </div>
            </div>

            <div className="flex gap-2">
              {[150, 200, 250, 300].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setWpm(speed)}
                  className={`flex-1 px-2 py-1 text-sm rounded ${
                    wpm === speed
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {formatTime(stats.readingMinutes)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reading Time</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Words</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.characters.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Characters</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTime(stats.speakingMinutes)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Speaking Time</div>
          </div>
        </div>

        {stats.words > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Copy for your article</h4>
            <code className="text-sm text-blue-700 dark:text-blue-400">
              {Math.ceil(stats.readingMinutes)} min read • {stats.words} words
            </code>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Reading Speed Reference</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• Slow/Careful: 100-150 WPM (technical content)</li>
          <li>• Average: 200-250 WPM (general content)</li>
          <li>• Fast/Skimming: 300-400 WPM (familiar topics)</li>
          <li>• Speaking: ~150 WPM (for presentations)</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Paste your article or blog post text</li>
          <li>Adjust reading speed for your audience</li>
          <li>View estimated reading and speaking times</li>
          <li>Copy the reading time to add to your article</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
