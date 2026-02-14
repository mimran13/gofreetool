'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const adjectives = ['Swift', 'Epic', 'Cosmic', 'Dark', 'Neon', 'Cyber', 'Shadow', 'Storm', 'Fire', 'Ice', 'Thunder', 'Mystic', 'Stealth', 'Turbo', 'Mega', 'Ultra', 'Hyper', 'Super', 'Golden', 'Silver', 'Crystal', 'Phantom', 'Dragon', 'Phoenix', 'Wolf', 'Ninja', 'Quantum', 'Alpha', 'Omega', 'Nova'];
const nouns = ['Hawk', 'Tiger', 'Wolf', 'Dragon', 'Phoenix', 'Falcon', 'Panther', 'Viper', 'Cobra', 'Eagle', 'Shark', 'Bear', 'Lion', 'Raven', 'Fox', 'Knight', 'Wizard', 'Hunter', 'Warrior', 'Assassin', 'Rider', 'Runner', 'Master', 'Legend', 'Hero', 'Ninja', 'Samurai', 'Spartan', 'Viking', 'Titan'];
const gamingWords = ['Gamer', 'Player', 'Pro', 'Elite', 'Champion', 'King', 'Queen', 'Lord', 'Boss', 'Chief', 'Ace', 'Star', 'Blitz', 'Rush', 'Strike', 'Blade', 'Edge', 'Fury', 'Rage', 'Havoc'];

export default function UsernameGenerator() {
  const tool = getToolBySlug('username-generator');
  const [usernames, setUsernames] = useState<string[]>([]);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [style, setStyle] = useState<'gaming' | 'professional' | 'random'>('gaming');
  const [customWord, setCustomWord] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const generateUsername = useCallback((): string => {
    let username = '';
    const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomNum = () => Math.floor(Math.random() * 1000);

    switch (style) {
      case 'gaming':
        const patterns = [
          () => random(adjectives) + random(nouns),
          () => random(nouns) + random(gamingWords),
          () => random(adjectives) + random(gamingWords),
          () => 'x' + random(nouns) + 'x',
          () => random(nouns) + '_' + random(gamingWords),
        ];
        username = random(patterns)();
        break;
      case 'professional':
        const first = customWord || random(['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Quinn', 'Avery']);
        const suffixes = ['Dev', 'Pro', 'Tech', 'Digital', 'Creative', 'Design', 'Code', 'Web', 'Data', 'Cloud'];
        username = first + random(suffixes);
        break;
      case 'random':
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        for (let i = 0; i < 8; i++) {
          username += chars[Math.floor(Math.random() * chars.length)];
        }
        break;
    }

    if (customWord && style === 'gaming') {
      const customPatterns = [
        () => customWord + random(nouns),
        () => random(adjectives) + customWord,
        () => customWord + random(gamingWords),
      ];
      username = random(customPatterns)();
    }

    if (includeNumbers) {
      username += randomNum();
    }

    return username;
  }, [style, includeNumbers, customWord]);

  const generateUsernames = useCallback(() => {
    const newUsernames: string[] = [];
    for (let i = 0; i < 10; i++) {
      newUsernames.push(generateUsername());
    }
    setUsernames(newUsernames);
  }, [generateUsername]);

  const handleCopy = useCallback(async (username: string) => {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(username);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) { /* Fallback */ }
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate unique <strong>usernames</strong> for gaming, social media, and online accounts.
          Choose from different styles and customize with your own words.
          <strong> All processing happens in your browser</strong> — completely private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as typeof style)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value="gaming">Gaming / Cool</option>
              <option value="professional">Professional</option>
              <option value="random">Random</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Word (optional)
            </label>
            <input
              type="text"
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value)}
              placeholder="e.g., your name or nickname"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Include numbers</span>
          </label>
        </div>

        <button
          onClick={generateUsernames}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
        >
          Generate Usernames
        </button>

        {usernames.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {usernames.map((username, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <span className="font-mono text-gray-900 dark:text-white">{username}</span>
                <button
                  onClick={() => handleCopy(username)}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {copied === username ? '✓' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Good Username Tips</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Keep it short and memorable (under 15 characters)</li>
          <li>• Avoid personal information like birth year or real name</li>
          <li>• Make it easy to type and pronounce</li>
          <li>• Use the same username across platforms for consistency</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Choose a username style (Gaming, Professional, or Random)</li>
          <li>Optionally add a custom word to include</li>
          <li>Toggle numbers on/off</li>
          <li>Click Generate to create 10 username options</li>
          <li>Copy your favorite username</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
