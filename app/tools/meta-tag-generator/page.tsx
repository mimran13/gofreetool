'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface MetaTagsData {
  // Basic
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  canonical: string;
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  ogImage: string;
  ogSiteName: string;
  // Twitter Card
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  twitterCreator: string;
}

const defaultData: MetaTagsData = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  robots: 'index, follow',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogType: 'website',
  ogUrl: '',
  ogImage: '',
  ogSiteName: '',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterSite: '',
  twitterCreator: '',
};

const robotsOptions = [
  'index, follow',
  'noindex, follow',
  'index, nofollow',
  'noindex, nofollow',
];

const ogTypes = [
  'website',
  'article',
  'blog',
  'product',
  'profile',
  'video.movie',
  'video.episode',
  'music.song',
  'book',
];

const twitterCardTypes = [
  'summary',
  'summary_large_image',
  'app',
  'player',
];

export default function MetaTagGenerator() {
  const tool = getToolBySlug('meta-tag-generator');
  const [data, setData] = useState<MetaTagsData>(defaultData);
  const [copied, setCopied] = useState(false);
  const [syncOG, setSyncOG] = useState(true);
  const [syncTwitter, setSyncTwitter] = useState(true);

  const updateField = useCallback((field: keyof MetaTagsData, value: string) => {
    setData(prev => {
      const newData = { ...prev, [field]: value };

      // Sync Open Graph with basic fields
      if (syncOG) {
        if (field === 'title' && !prev.ogTitle) newData.ogTitle = value;
        if (field === 'description' && !prev.ogDescription) newData.ogDescription = value;
        if (field === 'canonical' && !prev.ogUrl) newData.ogUrl = value;
      }

      // Sync Twitter with basic/OG fields
      if (syncTwitter) {
        if (field === 'title' && !prev.twitterTitle) newData.twitterTitle = value;
        if (field === 'description' && !prev.twitterDescription) newData.twitterDescription = value;
        if (field === 'ogImage' && !prev.twitterImage) newData.twitterImage = value;
      }

      return newData;
    });
  }, [syncOG, syncTwitter]);

  const generateMetaTags = useCallback(() => {
    const lines: string[] = [];

    // Basic Meta Tags
    lines.push('<!-- Basic Meta Tags -->');
    if (data.title) {
      lines.push(`<title>${escapeHtml(data.title)}</title>`);
    }
    if (data.description) {
      lines.push(`<meta name="description" content="${escapeHtml(data.description)}">`);
    }
    if (data.keywords) {
      lines.push(`<meta name="keywords" content="${escapeHtml(data.keywords)}">`);
    }
    if (data.author) {
      lines.push(`<meta name="author" content="${escapeHtml(data.author)}">`);
    }
    if (data.robots) {
      lines.push(`<meta name="robots" content="${escapeHtml(data.robots)}">`);
    }
    if (data.canonical) {
      lines.push(`<link rel="canonical" href="${escapeHtml(data.canonical)}">`);
    }

    // Open Graph Tags
    const hasOG = data.ogTitle || data.ogDescription || data.ogImage || data.ogUrl;
    if (hasOG) {
      lines.push('');
      lines.push('<!-- Open Graph / Facebook -->');
      if (data.ogType) {
        lines.push(`<meta property="og:type" content="${escapeHtml(data.ogType)}">`);
      }
      if (data.ogTitle || data.title) {
        lines.push(`<meta property="og:title" content="${escapeHtml(data.ogTitle || data.title)}">`);
      }
      if (data.ogDescription || data.description) {
        lines.push(`<meta property="og:description" content="${escapeHtml(data.ogDescription || data.description)}">`);
      }
      if (data.ogUrl || data.canonical) {
        lines.push(`<meta property="og:url" content="${escapeHtml(data.ogUrl || data.canonical)}">`);
      }
      if (data.ogImage) {
        lines.push(`<meta property="og:image" content="${escapeHtml(data.ogImage)}">`);
      }
      if (data.ogSiteName) {
        lines.push(`<meta property="og:site_name" content="${escapeHtml(data.ogSiteName)}">`);
      }
    }

    // Twitter Card Tags
    const hasTwitter = data.twitterTitle || data.twitterDescription || data.twitterImage;
    if (hasTwitter || hasOG) {
      lines.push('');
      lines.push('<!-- Twitter Card -->');
      lines.push(`<meta name="twitter:card" content="${escapeHtml(data.twitterCard)}">`);
      if (data.twitterTitle || data.ogTitle || data.title) {
        lines.push(`<meta name="twitter:title" content="${escapeHtml(data.twitterTitle || data.ogTitle || data.title)}">`);
      }
      if (data.twitterDescription || data.ogDescription || data.description) {
        lines.push(`<meta name="twitter:description" content="${escapeHtml(data.twitterDescription || data.ogDescription || data.description)}">`);
      }
      if (data.twitterImage || data.ogImage) {
        lines.push(`<meta name="twitter:image" content="${escapeHtml(data.twitterImage || data.ogImage)}">`);
      }
      if (data.twitterSite) {
        lines.push(`<meta name="twitter:site" content="${escapeHtml(data.twitterSite)}">`);
      }
      if (data.twitterCreator) {
        lines.push(`<meta name="twitter:creator" content="${escapeHtml(data.twitterCreator)}">`);
      }
    }

    return lines.join('\n');
  }, [data]);

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const handleCopy = useCallback(async () => {
    const output = generateMetaTags();
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generateMetaTags]);

  const handleReset = useCallback(() => {
    setData(defaultData);
    setCopied(false);
  }, []);

  const output = generateMetaTags();
  const charCount = data.description.length;
  const titleCharCount = data.title.length;

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate SEO-optimized <strong>meta tags</strong> for your website including title, description,
          Open Graph, and Twitter Card tags. These tags help search engines understand your content and
          control how your pages appear in search results and social media shares.
          <strong> All processing happens in your browser</strong> — your content is never sent to any server.
        </p>
      </section>

      {/* Main Tool */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Basic Meta Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📝</span> Basic Meta Tags
          </h3>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page Title
                <span className={`ml-2 text-xs ${titleCharCount > 60 ? 'text-red-500' : titleCharCount > 50 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  ({titleCharCount}/60 characters)
                </span>
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Your Page Title | Brand Name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optimal length: 50-60 characters. Include your main keyword.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Description
                <span className={`ml-2 text-xs ${charCount > 160 ? 'text-red-500' : charCount > 150 ? 'text-yellow-500' : 'text-gray-400'}`}>
                  ({charCount}/160 characters)
                </span>
              </label>
              <textarea
                value={data.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="A compelling description of your page content that encourages clicks from search results..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Optimal length: 150-160 characters. Make it compelling to encourage clicks.
              </p>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={data.keywords}
                onChange={(e) => updateField('keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Note: Most search engines ignore this tag, but it can still be useful for internal search.
              </p>
            </div>

            {/* Author & Robots in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={data.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  placeholder="Author Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Robots Directive
                </label>
                <select
                  value={data.robots}
                  onChange={(e) => updateField('robots', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {robotsOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                type="url"
                value={data.canonical}
                onChange={(e) => updateField('canonical', e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Open Graph Tags */}
        <div className="mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">📘</span> Open Graph Tags (Facebook, LinkedIn)
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={syncOG}
                onChange={(e) => setSyncOG(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              Auto-sync with basic tags
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OG Type
                </label>
                <select
                  value={data.ogType}
                  onChange={(e) => updateField('ogType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {ogTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={data.ogSiteName}
                  onChange={(e) => updateField('ogSiteName', e.target.value)}
                  placeholder="Your Site Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OG Title {syncOG && data.title && !data.ogTitle && <span className="text-gray-400">(using page title)</span>}
              </label>
              <input
                type="text"
                value={data.ogTitle}
                onChange={(e) => updateField('ogTitle', e.target.value)}
                placeholder={data.title || "Open Graph Title"}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OG Description {syncOG && data.description && !data.ogDescription && <span className="text-gray-400">(using meta description)</span>}
              </label>
              <textarea
                value={data.ogDescription}
                onChange={(e) => updateField('ogDescription', e.target.value)}
                placeholder={data.description || "Description for social sharing..."}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OG URL {syncOG && data.canonical && !data.ogUrl && <span className="text-gray-400">(using canonical)</span>}
                </label>
                <input
                  type="url"
                  value={data.ogUrl}
                  onChange={(e) => updateField('ogUrl', e.target.value)}
                  placeholder={data.canonical || "https://example.com/page"}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  OG Image URL
                </label>
                <input
                  type="url"
                  value={data.ogImage}
                  onChange={(e) => updateField('ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Recommended size: 1200x630 pixels
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Twitter Card Tags */}
        <div className="mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">🐦</span> Twitter Card Tags
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={syncTwitter}
                onChange={(e) => setSyncTwitter(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              Auto-sync with OG tags
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Type
                </label>
                <select
                  value={data.twitterCard}
                  onChange={(e) => updateField('twitterCard', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {twitterCardTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  @Site Handle
                </label>
                <input
                  type="text"
                  value={data.twitterSite}
                  onChange={(e) => updateField('twitterSite', e.target.value)}
                  placeholder="@yoursite"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  @Creator Handle
                </label>
                <input
                  type="text"
                  value={data.twitterCreator}
                  onChange={(e) => updateField('twitterCreator', e.target.value)}
                  placeholder="@author"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter Title {syncTwitter && (data.ogTitle || data.title) && !data.twitterTitle && <span className="text-gray-400">(using OG/page title)</span>}
              </label>
              <input
                type="text"
                value={data.twitterTitle}
                onChange={(e) => updateField('twitterTitle', e.target.value)}
                placeholder={data.ogTitle || data.title || "Twitter Card Title"}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter Description {syncTwitter && (data.ogDescription || data.description) && !data.twitterDescription && <span className="text-gray-400">(using OG/meta description)</span>}
              </label>
              <textarea
                value={data.twitterDescription}
                onChange={(e) => updateField('twitterDescription', e.target.value)}
                placeholder={data.ogDescription || data.description || "Description for Twitter..."}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter Image {syncTwitter && data.ogImage && !data.twitterImage && <span className="text-gray-400">(using OG image)</span>}
              </label>
              <input
                type="url"
                value={data.twitterImage}
                onChange={(e) => updateField('twitterImage', e.target.value)}
                placeholder={data.ogImage || "https://example.com/twitter-image.jpg"}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Generated Output */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">💻</span> Generated Meta Tags
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              {output || '<!-- Fill in the fields above to generate meta tags -->'}
            </pre>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Data Stays Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All meta tag generation happens directly in your browser. Your page titles, descriptions,
              and URLs are never sent to any server or stored anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Meta Tag Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter your page title</strong> — Keep it under 60 characters and include your main keyword.
          </li>
          <li>
            <strong>Write a compelling meta description</strong> — Aim for 150-160 characters that encourage clicks.
          </li>
          <li>
            <strong>Add Open Graph tags</strong> — These control how your page appears on Facebook and LinkedIn.
          </li>
          <li>
            <strong>Configure Twitter Card tags</strong> — Customize how your content looks when shared on Twitter.
          </li>
          <li>
            <strong>Copy the generated code</strong> — Paste it inside the {"<head>"} section of your HTML.
          </li>
        </ol>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Meta Tag Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Title Tag</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Keep it under 60 characters</li>
              <li>• Include your primary keyword early</li>
              <li>• Make it unique for each page</li>
              <li>• Add your brand name at the end</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Meta Description</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Aim for 150-160 characters</li>
              <li>• Include a call-to-action</li>
              <li>• Match search intent</li>
              <li>• Make it unique and compelling</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Open Graph Image</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Use 1200x630 pixels (1.91:1 ratio)</li>
              <li>• Keep important content centered</li>
              <li>• Use high-quality images</li>
              <li>• Test with Facebook Debugger</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Canonical URL</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Always use absolute URLs</li>
              <li>• Include on every page</li>
              <li>• Points to the preferred version</li>
              <li>• Helps prevent duplicate content</li>
            </ul>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
