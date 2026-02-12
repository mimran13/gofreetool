'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const hashtagDatabase: Record<string, string[]> = {
  travel: ['travel', 'wanderlust', 'travelgram', 'instatravel', 'travelphotography', 'adventure', 'explore', 'vacation', 'holiday', 'traveling', 'travelblogger', 'trip', 'tourism', 'traveler', 'travelling', 'nature', 'beautifuldestinations', 'traveltheworld', 'roadtrip', 'backpacking'],
  food: ['food', 'foodie', 'foodporn', 'instafood', 'yummy', 'delicious', 'foodphotography', 'foodstagram', 'foodblogger', 'cooking', 'homemade', 'recipe', 'dinner', 'lunch', 'breakfast', 'healthyfood', 'foodlover', 'tasty', 'chef', 'restaurant'],
  fitness: ['fitness', 'gym', 'workout', 'fit', 'motivation', 'health', 'training', 'exercise', 'fitnessmotivation', 'healthy', 'bodybuilding', 'fitfam', 'lifestyle', 'muscle', 'strong', 'cardio', 'crossfit', 'gains', 'personaltrainer', 'yoga'],
  fashion: ['fashion', 'style', 'ootd', 'fashionblogger', 'love', 'instafashion', 'fashionista', 'streetstyle', 'outfit', 'model', 'beauty', 'shopping', 'fashionstyle', 'trendy', 'dress', 'clothing', 'stylish', 'lookoftheday', 'outfitoftheday', 'accessories'],
  photography: ['photography', 'photooftheday', 'photo', 'photographer', 'naturephotography', 'portrait', 'canon', 'camera', 'travelphotography', 'streetphotography', 'landscape', 'photoshoot', 'nikon', 'art', 'photographylovers', 'wildlife', 'sunset', 'portraitphotography', 'photographyislife', 'photographyeveryday'],
  business: ['business', 'entrepreneur', 'marketing', 'success', 'motivation', 'money', 'startup', 'smallbusiness', 'entrepreneurship', 'businessowner', 'branding', 'digitalmarketing', 'leadership', 'innovation', 'hustle', 'goals', 'ceo', 'mindset', 'work', 'investment'],
  technology: ['technology', 'tech', 'innovation', 'programming', 'coding', 'developer', 'software', 'ai', 'data', 'python', 'javascript', 'webdevelopment', 'machinelearning', 'startup', 'gadgets', 'apple', 'android', 'computer', 'science', 'engineering'],
  art: ['art', 'artist', 'artwork', 'drawing', 'painting', 'illustration', 'digitalart', 'artistsoninstagram', 'creative', 'sketch', 'design', 'contemporaryart', 'instaart', 'artoftheday', 'gallery', 'abstract', 'fineart', 'watercolor', 'portrait', 'artistsofinstagram'],
  music: ['music', 'musician', 'singer', 'song', 'rap', 'hiphop', 'dj', 'producer', 'musicproducer', 'newmusic', 'artist', 'guitar', 'live', 'band', 'rock', 'piano', 'concert', 'beats', 'soundcloud', 'spotify'],
  lifestyle: ['lifestyle', 'life', 'happy', 'love', 'instagood', 'motivation', 'inspiration', 'mindfulness', 'selfcare', 'positivity', 'wellness', 'happiness', 'goals', 'success', 'mindset', 'goodvibes', 'blessed', 'grateful', 'selflove', 'livingmybestlife'],
};

const platforms = {
  instagram: { maxHashtags: 30, recommended: '5-15' },
  twitter: { maxHashtags: 280, recommended: '1-2' },
  tiktok: { maxHashtags: 100, recommended: '3-5' },
  linkedin: { maxHashtags: 30, recommended: '3-5' },
};

export default function HashtagGenerator() {
  const tool = getToolBySlug('hashtag-generator');
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateHashtags = useCallback(() => {
    const results: Set<string> = new Set();
    const topicLower = topic.toLowerCase();

    // Add from selected category
    if (selectedCategory && hashtagDatabase[selectedCategory]) {
      hashtagDatabase[selectedCategory].forEach(tag => results.add(tag));
    }

    // Search all categories for matching terms
    Object.entries(hashtagDatabase).forEach(([category, tags]) => {
      if (topicLower.includes(category)) {
        tags.slice(0, 10).forEach(tag => results.add(tag));
      }
      tags.forEach(tag => {
        if (tag.includes(topicLower) || topicLower.includes(tag)) {
          results.add(tag);
        }
      });
    });

    // Generate from topic words
    const words = topic.split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2) {
        results.add(clean);
        results.add(clean + 's');
        results.add(clean + 'life');
        results.add(clean + 'lover');
        results.add('insta' + clean);
      }
    });

    // Combine words
    if (words.length >= 2) {
      const combined = words.slice(0, 3).join('').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (combined.length > 3) results.add(combined);
    }

    setGeneratedHashtags(Array.from(results).slice(0, 30));
  }, [topic, selectedCategory]);

  const handleCopy = useCallback(async () => {
    const text = generatedHashtags.map(t => `#${t}`).join(' ');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [generatedHashtags]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate relevant <strong>hashtags</strong> for Instagram, Twitter, TikTok, and LinkedIn.
          Enter your topic and get a mix of popular and niche hashtags to increase your reach.
          <strong> All processing happens in your browser</strong> — your content ideas stay private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Your Topic or Keywords
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., sunset beach photography, healthy meal prep, startup tips"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select a Category (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(hashtagDatabase).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                className={`px-3 py-1.5 text-sm rounded-full capitalize transition-colors ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateHashtags}
          disabled={!topic.trim() && !selectedCategory}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          Generate Hashtags
        </button>

        {generatedHashtags.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Generated Hashtags ({generatedHashtags.length})
              </h3>
              <button
                onClick={handleCopy}
                className="px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy All'}
              </button>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Platform Guidelines</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-700 dark:text-blue-400">
          <div>
            <strong>Instagram:</strong><br />Max 30, use 5-15
          </div>
          <div>
            <strong>Twitter/X:</strong><br />Use 1-2 hashtags
          </div>
          <div>
            <strong>TikTok:</strong><br />Use 3-5 hashtags
          </div>
          <div>
            <strong>LinkedIn:</strong><br />Use 3-5 hashtags
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Hashtag Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Mix popular hashtags (high reach) with niche ones (less competition)</li>
          <li>Use hashtags relevant to your specific content, not just your industry</li>
          <li>Avoid banned or spam hashtags that could hurt your reach</li>
          <li>Track which hashtags perform best and adjust your strategy</li>
          <li>Don&apos;t use the same hashtags on every post — rotate them</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
