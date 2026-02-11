'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';

interface KeywordData {
  word: string;
  count: number;
  density: number;
}

// Common stop words to optionally exclude
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these',
  'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
  'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here',
  'there', 'then', 'once', 'if', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'any', 'up', 'down', 'out',
  'off', 'over', 'because', 'until', 'while', 'being', 'having', 'doing', 'get', 'got',
]);

export default function KeywordDensityChecker() {
  const tool = getToolBySlug('keyword-density-checker');
  const [text, setText] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [excludeStopWords, setExcludeStopWords] = useState(true);
  const [minWordLength, setMinWordLength] = useState(3);
  const [showCount, setShowCount] = useState(20);

  // Analyze the text
  const analysis = useMemo(() => {
    if (!text.trim()) {
      return {
        totalWords: 0,
        uniqueWords: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        singleWords: [] as KeywordData[],
        twoWordPhrases: [] as KeywordData[],
        threeWordPhrases: [] as KeywordData[],
        targetKeywordData: null as KeywordData | null,
      };
    }

    // Clean and normalize text
    const cleanText = text.toLowerCase().replace(/[^\w\s'-]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' ').filter(w => w.length > 0);
    const totalWords = words.length;

    // Count characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Count sentences and paragraphs
    const sentences = (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);

    // Helper to count n-grams
    const countNGrams = (n: number): Map<string, number> => {
      const counts = new Map<string, number>();
      for (let i = 0; i <= words.length - n; i++) {
        const ngram = words.slice(i, i + n).join(' ');

        // Check if any word in the n-gram should be excluded
        if (excludeStopWords && n === 1) {
          if (STOP_WORDS.has(ngram)) continue;
        }

        // Check minimum word length for single words
        if (n === 1 && ngram.length < minWordLength) continue;

        counts.set(ngram, (counts.get(ngram) || 0) + 1);
      }
      return counts;
    };

    // Convert map to sorted array
    const mapToSortedArray = (map: Map<string, number>): KeywordData[] => {
      return Array.from(map.entries())
        .map(([word, count]) => ({
          word,
          count,
          density: totalWords > 0 ? (count / totalWords) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count);
    };

    const singleWordCounts = countNGrams(1);
    const twoWordCounts = countNGrams(2);
    const threeWordCounts = countNGrams(3);

    const singleWords = mapToSortedArray(singleWordCounts);
    const twoWordPhrases = mapToSortedArray(twoWordCounts);
    const threeWordPhrases = mapToSortedArray(threeWordCounts);

    // Target keyword analysis
    let targetKeywordData: KeywordData | null = null;
    if (targetKeyword.trim()) {
      const targetLower = targetKeyword.toLowerCase().trim();
      const targetWords = targetLower.split(/\s+/);

      // Count occurrences (case-insensitive)
      const regex = new RegExp(`\\b${targetLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex) || [];
      const count = matches.length;

      // For multi-word keywords, density is based on possible positions
      const possiblePositions = Math.max(0, totalWords - targetWords.length + 1);
      const density = possiblePositions > 0 ? (count / possiblePositions) * 100 : 0;

      targetKeywordData = {
        word: targetKeyword.trim(),
        count,
        density,
      };
    }

    return {
      totalWords,
      uniqueWords: singleWordCounts.size,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      singleWords,
      twoWordPhrases,
      threeWordPhrases,
      targetKeywordData,
    };
  }, [text, targetKeyword, excludeStopWords, minWordLength]);

  const handleClear = useCallback(() => {
    setText('');
    setTargetKeyword('');
  }, []);

  const getDensityColor = (density: number): string => {
    if (density < 0.5) return 'text-gray-500';
    if (density < 1) return 'text-blue-600 dark:text-blue-400';
    if (density < 2) return 'text-green-600 dark:text-green-400';
    if (density < 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getDensityBadge = (density: number): { label: string; color: string } => {
    if (density < 0.5) return { label: 'Low', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' };
    if (density < 1) return { label: 'Normal', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    if (density < 2) return { label: 'Good', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    if (density < 3) return { label: 'High', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'Too High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Analyze your content&apos;s <strong>keyword density</strong> for better SEO optimization.
          Check word frequency, find overused terms, and ensure natural keyword distribution.
          Supports single words and multi-word phrases (2-grams and 3-grams).
          <strong> All analysis happens in your browser</strong> — your content is never sent to any server.
        </p>
      </section>

      {/* Main Tool */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter Your Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article, blog post, or any text content here to analyze keyword density..."
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {/* Target Keyword */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Keyword (optional)
          </label>
          <div className="flex gap-4 items-start">
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Enter your focus keyword or phrase"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            {analysis.targetKeywordData && (
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {analysis.targetKeywordData.count}
                </div>
                <div className="text-xs text-gray-500">occurrences</div>
                <div className={`text-sm font-medium ${getDensityColor(analysis.targetKeywordData.density)}`}>
                  {analysis.targetKeywordData.density.toFixed(2)}% density
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={excludeStopWords}
              onChange={(e) => setExcludeStopWords(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            Exclude common words (the, and, is, etc.)
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Min word length:
            </label>
            <select
              value={minWordLength}
              onChange={(e) => setMinWordLength(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Show top:
            </label>
            <select
              value={showCount}
              onChange={(e) => setShowCount(parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <button
            onClick={handleClear}
            className="ml-auto px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Stats Overview */}
        {text.trim() && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.totalWords.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Words</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.uniqueWords.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Unique Words</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.characters.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Characters</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.charactersNoSpaces.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Chars (no spaces)</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.sentences}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Sentences</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.paragraphs}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Paragraphs</div>
            </div>
          </div>
        )}

        {/* Keyword Tables */}
        {text.trim() && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Single Words */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span> Single Words
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Word</th>
                      <th className="text-right p-2 font-medium text-gray-700 dark:text-gray-300">#</th>
                      <th className="text-right p-2 font-medium text-gray-700 dark:text-gray-300">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.singleWords.slice(0, showCount).map((item, index) => {
                      const badge = getDensityBadge(item.density);
                      return (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-2 font-mono text-gray-900 dark:text-white">{item.word}</td>
                          <td className="p-2 text-right text-gray-600 dark:text-gray-400">{item.count}</td>
                          <td className="p-2 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                              {item.density.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {analysis.singleWords.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500">No words found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Two-Word Phrases */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-xl">📄</span> 2-Word Phrases
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Phrase</th>
                      <th className="text-right p-2 font-medium text-gray-700 dark:text-gray-300">#</th>
                      <th className="text-right p-2 font-medium text-gray-700 dark:text-gray-300">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.twoWordPhrases.slice(0, showCount).map((item, index) => {
                      const badge = getDensityBadge(item.density);
                      return (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-2 font-mono text-gray-900 dark:text-white text-xs">{item.word}</td>
                          <td className="p-2 text-right text-gray-600 dark:text-gray-400">{item.count}</td>
                          <td className="p-2 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                              {item.density.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {analysis.twoWordPhrases.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500">No phrases found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Three-Word Phrases */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-xl">📑</span> 3-Word Phrases
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="text-left p-2 font-medium text-gray-700 dark:text-gray-300">Phrase</th>
                      <th className="text-right p-2 font-medium text-gray-700 dark:text-gray-300">#</th>
                      <th className="text-right p-2 font-medium text-gray-700 dark:text-gray-300">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.threeWordPhrases.slice(0, showCount).map((item, index) => {
                      const badge = getDensityBadge(item.density);
                      return (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                          <td className="p-2 font-mono text-gray-900 dark:text-white text-xs">{item.word}</td>
                          <td className="p-2 text-right text-gray-600 dark:text-gray-400">{item.count}</td>
                          <td className="p-2 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                              {item.density.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {analysis.threeWordPhrases.length === 0 && (
                      <tr>
                        <td colSpan={3} className="p-4 text-center text-gray-500">No phrases found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!text.trim() && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <span className="text-4xl mb-4 block">📊</span>
            <p>Enter or paste your content above to analyze keyword density</p>
          </div>
        )}
      </div>

      {/* Density Guide */}
      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Keyword Density Guidelines</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="inline-block w-3 h-3 rounded bg-gray-400 mr-2"></span>
            <span className="text-gray-600 dark:text-gray-400">&lt;0.5%: Low</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded bg-blue-500 mr-2"></span>
            <span className="text-gray-600 dark:text-gray-400">0.5-1%: Normal</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded bg-green-500 mr-2"></span>
            <span className="text-gray-600 dark:text-gray-400">1-2%: Good</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 rounded bg-red-500 mr-2"></span>
            <span className="text-gray-600 dark:text-gray-400">&gt;3%: Too High</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-blue-700 dark:text-blue-400">
          Aim for 1-2% keyword density for your target keywords. Higher than 3% may be considered keyword stuffing.
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Content Stays Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All analysis happens directly in your browser. Your articles and content are never
              sent to any server or stored anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Keyword Density Checker
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li><strong>Paste your content</strong> — Copy your article or blog post into the text area.</li>
          <li><strong>Enter a target keyword</strong> (optional) — Check how often your focus keyword appears.</li>
          <li><strong>Review the analysis</strong> — See word frequency across 1, 2, and 3-word phrases.</li>
          <li><strong>Check density levels</strong> — Green (1-2%) is optimal, red (&gt;3%) indicates over-optimization.</li>
          <li><strong>Adjust your content</strong> — Rewrite to achieve natural keyword distribution.</li>
        </ol>
      </section>

      {/* Tips */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          SEO Content Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Write Naturally</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Focus on creating valuable content for readers first. Keywords should flow naturally —
              if it sounds forced when reading aloud, rewrite it.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Use Variations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Include synonyms and related terms. Search engines understand semantic relationships,
              so &quot;car,&quot; &quot;vehicle,&quot; and &quot;automobile&quot; all help your content.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Check Competitors</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analyze top-ranking pages for your target keywords. Note their keyword density and
              content structure, then create something better.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Prioritize Placement</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Keywords in titles, headings, first paragraph, and meta descriptions carry more weight
              than those buried in content.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related SEO Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Generate optimized meta tags with our{' '}
          <Link href="/tools/meta-tag-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Meta Tag Generator
          </Link>{' '}
          or add structured data with our{' '}
          <Link href="/tools/schema-markup-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Schema Markup Generator
          </Link>.
        </p>
      </section>
    </ToolLayout>
  );
}
