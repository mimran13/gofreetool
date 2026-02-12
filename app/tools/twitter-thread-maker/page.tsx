'use client';

import { useState, useMemo, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const TWEET_LIMIT = 280;

export default function TwitterThreadMaker() {
  const tool = getToolBySlug('twitter-thread-maker');
  const [text, setText] = useState('');
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [numberFormat, setNumberFormat] = useState<'slash' | 'bracket' | 'dot'>('slash');
  const [copied, setCopied] = useState(false);

  const tweets = useMemo(() => {
    if (!text.trim()) return [];

    const sentences = text.split(/(?<=[.!?])\s+/);
    const rawTweets: string[] = [];
    let currentTweet = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      if (trimmedSentence.length > TWEET_LIMIT - 10) {
        const words = trimmedSentence.split(' ');
        let chunk = '';
        for (const word of words) {
          if ((chunk + ' ' + word).trim().length > TWEET_LIMIT - 10) {
            if (chunk) rawTweets.push(chunk.trim());
            chunk = word;
          } else {
            chunk = chunk ? chunk + ' ' + word : word;
          }
        }
        if (chunk) {
          if (currentTweet && (currentTweet + ' ' + chunk).length <= TWEET_LIMIT - 10) {
            currentTweet = currentTweet + ' ' + chunk;
          } else {
            if (currentTweet) rawTweets.push(currentTweet.trim());
            currentTweet = chunk;
          }
        }
      } else if ((currentTweet + ' ' + trimmedSentence).trim().length <= TWEET_LIMIT - 10) {
        currentTweet = currentTweet ? currentTweet + ' ' + trimmedSentence : trimmedSentence;
      } else {
        if (currentTweet) rawTweets.push(currentTweet.trim());
        currentTweet = trimmedSentence;
      }
    }
    if (currentTweet) rawTweets.push(currentTweet.trim());

    const getNumbering = (idx: number, total: number) => {
      if (!includeNumbers) return '';
      switch (numberFormat) {
        case 'slash': return `${idx + 1}/${total} `;
        case 'bracket': return `[${idx + 1}/${total}] `;
        case 'dot': return `${idx + 1}. `;
      }
    };

    return rawTweets.map((tweet, i) => getNumbering(i, rawTweets.length) + tweet);
  }, [text, includeNumbers, numberFormat]);

  const handleCopy = useCallback(async (idx?: number) => {
    const textToCopy = idx !== undefined ? tweets[idx] : tweets.join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) { /* Fallback */ }
  }, [tweets]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Split long text into a <strong>Twitter/X thread</strong> with automatic numbering.
          Smart splitting at sentence boundaries ensures clean, readable tweets.
          <strong> All processing happens in your browser</strong> — your content stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Your Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your long-form content here..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
          <div className="mt-2 text-sm text-gray-500">
            {text.length} characters • {tweets.length} tweet{tweets.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Include numbering</span>
          </label>

          {includeNumbers && (
            <div className="flex gap-2">
              {[
                { id: 'slash', label: '1/5' },
                { id: 'bracket', label: '[1/5]' },
                { id: 'dot', label: '1.' },
              ].map(format => (
                <button
                  key={format.id}
                  onClick={() => setNumberFormat(format.id as typeof numberFormat)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    numberFormat === format.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {tweets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Your Thread ({tweets.length} tweets)
              </h3>
              <button
                onClick={() => handleCopy()}
                className="px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                {copied ? '✓ Copied All' : 'Copy All'}
              </button>
            </div>

            <div className="space-y-4">
              {tweets.map((tweet, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap flex-1">{tweet}</p>
                    <button
                      onClick={() => handleCopy(idx)}
                      className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <div className={`mt-2 text-xs ${tweet.length > TWEET_LIMIT ? 'text-red-500' : 'text-gray-500'}`}>
                    {tweet.length}/{TWEET_LIMIT} {tweet.length > TWEET_LIMIT && '⚠️ Over limit'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Thread Tips</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Best performing threads are <strong>3-10 tweets</strong></li>
          <li>• Start with a hook that makes people want to read more</li>
          <li>• End with a call-to-action or summary</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Paste your long-form content in the text area</li>
          <li>Choose your numbering format preference</li>
          <li>Review the generated tweets and character counts</li>
          <li>Copy individual tweets or the entire thread</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
