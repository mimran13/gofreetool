'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', limits: { post: 280, bio: 160 } },
  { id: 'instagram', name: 'Instagram', icon: '📷', limits: { caption: 2200, bio: 150 } },
  { id: 'facebook', name: 'Facebook', icon: '📘', limits: { post: 63206, ad: 125 } },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', limits: { post: 3000, headline: 220 } },
  { id: 'youtube', name: 'YouTube', icon: '🎬', limits: { title: 100, description: 5000 } },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', limits: { caption: 2200, bio: 80 } },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', limits: { pin: 500, board: 180 } },
];

export default function SocialMediaCharacterCounter() {
  const tool = getToolBySlug('social-media-character-counter');
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split('\n').length,
      hashtags: (text.match(/#\w+/g) || []).length,
      mentions: (text.match(/@\w+/g) || []).length,
      urls: (text.match(/https?:\/\/\S+/g) || []).length,
    };
  }, [text]);

  const getStatus = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage > 100) return { color: 'text-red-600', bg: 'bg-red-500', status: 'over' };
    if (percentage > 90) return { color: 'text-yellow-600', bg: 'bg-yellow-500', status: 'warning' };
    return { color: 'text-green-600', bg: 'bg-green-500', status: 'ok' };
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Check <strong>character counts</strong> for all major social media platforms.
          See limits for Twitter, Instagram, Facebook, LinkedIn, YouTube, TikTok, and Pinterest.
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
            placeholder="Paste your social media post here..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.characters}</div>
            <div className="text-xs text-gray-500">Characters</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.charactersNoSpaces}</div>
            <div className="text-xs text-gray-500">No Spaces</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.words}</div>
            <div className="text-xs text-gray-500">Words</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lines}</div>
            <div className="text-xs text-gray-500">Lines</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.hashtags}</div>
            <div className="text-xs text-gray-500">Hashtags</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.mentions}</div>
            <div className="text-xs text-gray-500">Mentions</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.urls}</div>
            <div className="text-xs text-gray-500">URLs</div>
          </div>
        </div>

        {/* Platform Limits */}
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Platform Character Limits</h3>
        <div className="space-y-4">
          {platforms.map(platform => (
            <div key={platform.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{platform.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">{platform.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(platform.limits).map(([type, limit]) => {
                  const status = getStatus(stats.characters, limit);
                  const percentage = Math.min((stats.characters / limit) * 100, 100);
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{type}</span>
                        <span className={status.color}>
                          {stats.characters} / {limit.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${status.bg} transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quick Reference</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Twitter/X:</strong> 280 chars (posts), 160 chars (bio)</li>
          <li>• <strong>Instagram:</strong> 2,200 chars (captions), 150 chars (bio)</li>
          <li>• <strong>LinkedIn:</strong> 3,000 chars (posts), 220 chars (headline)</li>
          <li>• <strong>YouTube:</strong> 100 chars (title), 5,000 chars (description)</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Paste or type your social media content in the text area</li>
          <li>See real-time character counts and statistics</li>
          <li>Check progress bars for each platform&apos;s limits</li>
          <li>Adjust your content to fit within platform requirements</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
