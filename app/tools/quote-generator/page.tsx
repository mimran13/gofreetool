'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "People who are crazy enough to think they can change the world, are the ones who do.", author: "Rob Siltanen" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Two roads diverged in a wood, and I—I took the one less traveled by, and that has made all the difference.", author: "Robert Frost" },
  { text: "The most difficult thing is the decision to act, the rest is merely tenacity.", author: "Amelia Earhart" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
];

export default function QuoteGenerator() {
  const tool = getToolBySlug('quote-generator');
  const [currentQuote, setCurrentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<typeof quotes>([]);

  const generateQuote = useCallback(() => {
    let newQuote;
    do {
      newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote.text === currentQuote.text && quotes.length > 1);
    setCurrentQuote(newQuote);
  }, [currentQuote]);

  const copyQuote = useCallback(async () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentQuote]);

  const toggleFavorite = useCallback(() => {
    const isFavorite = favorites.some(f => f.text === currentQuote.text);
    if (isFavorite) {
      setFavorites(favorites.filter(f => f.text !== currentQuote.text));
    } else {
      setFavorites([...favorites, currentQuote]);
    }
  }, [currentQuote, favorites]);

  const isFavorite = favorites.some(f => f.text === currentQuote.text);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Get <strong>random inspirational quotes</strong> for motivation, social media, or daily inspiration.
          Save your favorites and copy quotes with one click.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="mb-8">
            <p className="text-2xl md:text-3xl font-serif text-gray-900 dark:text-white leading-relaxed mb-4">
              "{currentQuote.text}"
            </p>
            <footer className="text-lg text-teal-600 dark:text-teal-400">
              — {currentQuote.author}
            </footer>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={generateQuote}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              New Quote
            </button>
            <button
              onClick={copyQuote}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={toggleFavorite}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isFavorite
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">
            Saved Quotes ({favorites.length})
          </h3>
          <div className="space-y-4">
            {favorites.map((quote, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-900 dark:text-white mb-1">"{quote.text}"</p>
                <p className="text-sm text-teal-600 dark:text-teal-400">— {quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quote Tips</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Use quotes to start presentations or blog posts</li>
          <li>• Share on social media for engagement</li>
          <li>• Create quote graphics with design tools</li>
          <li>• Save favorites for daily motivation</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Click "New Quote" to get a random inspirational quote</li>
          <li>Click "Copy" to copy the quote to your clipboard</li>
          <li>Save your favorites with the heart button</li>
          <li>View all saved quotes below the generator</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
