'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';

interface OGData {
  url: string;
  title: string;
  description: string;
  image: string;
  siteName: string;
  type: string;
}

const defaultData: OGData = {
  url: 'https://example.com/article',
  title: 'Your Amazing Article Title Goes Here',
  description: 'This is a compelling description that will make people want to click through to read your content. Keep it engaging and informative.',
  image: '',
  siteName: 'Example Site',
  type: 'article',
};

type Platform = 'facebook' | 'twitter' | 'linkedin' | 'discord';

export default function OpenGraphPreview() {
  const tool = getToolBySlug('open-graph-preview');
  const [data, setData] = useState<OGData>(defaultData);
  const [activePlatform, setActivePlatform] = useState<Platform>('facebook');

  const updateField = useCallback((field: keyof OGData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setData(defaultData);
  }, []);

  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url || 'example.com';
    }
  };

  const truncate = (text: string, length: number): string => {
    if (text.length <= length) return text;
    return text.substring(0, length - 3) + '...';
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Preview how your webpage will appear when shared on <strong>Facebook</strong>, <strong>Twitter</strong>,
          <strong> LinkedIn</strong>, and <strong>Discord</strong>. Enter your Open Graph data below to see
          live previews across all major social platforms. Perfect for testing before publishing.
          <strong> All processing happens in your browser</strong> — no data is sent to any server.
        </p>
      </section>

      {/* Main Tool */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Input Fields */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📝</span> Enter Open Graph Data
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Page URL
              </label>
              <input
                type="url"
                value={data.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://example.com/your-page"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title (og:title)
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Your Page Title"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (og:description)
              </label>
              <textarea
                value={data.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="A brief description of your page..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL (og:image)
              </label>
              <input
                type="url"
                value={data.image}
                onChange={(e) => updateField('image', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 1200x630 pixels (1.91:1 aspect ratio)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Name (og:site_name)
                </label>
                <input
                  type="text"
                  value={data.siteName}
                  onChange={(e) => updateField('siteName', e.target.value)}
                  placeholder="Your Site Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content Type (og:type)
                </label>
                <select
                  value={data.type}
                  onChange={(e) => updateField('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="blog">blog</option>
                  <option value="product">product</option>
                  <option value="profile">profile</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">👁️</span> Preview
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'facebook' as Platform, label: 'Facebook', icon: '📘' },
              { id: 'twitter' as Platform, label: 'Twitter/X', icon: '🐦' },
              { id: 'linkedin' as Platform, label: 'LinkedIn', icon: '💼' },
              { id: 'discord' as Platform, label: 'Discord', icon: '💬' },
            ].map(platform => (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activePlatform === platform.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {platform.icon} {platform.label}
              </button>
            ))}
          </div>

          {/* Facebook Preview */}
          {activePlatform === 'facebook' && (
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Facebook Feed Preview</p>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-[500px] overflow-hidden border border-gray-200 dark:border-gray-700">
                {data.image ? (
                  <div className="aspect-[1.91/1] bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={data.image}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[1.91/1] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No image provided</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    {getDomain(data.url)}
                  </p>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-tight mb-1">
                    {truncate(data.title, 100)}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">
                    {truncate(data.description, 110)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Twitter Preview */}
          {activePlatform === 'twitter' && (
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Twitter/X Card Preview (summary_large_image)</p>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm max-w-[500px] overflow-hidden border border-gray-200 dark:border-gray-700">
                {data.image ? (
                  <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={data.image}
                      alt="Twitter Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[2/1] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No image provided</span>
                  </div>
                )}
                <div className="p-3">
                  <h4 className="font-bold text-gray-900 dark:text-white text-[15px] leading-tight mb-0.5">
                    {truncate(data.title, 70)}
                  </h4>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-snug mb-1">
                    {truncate(data.description, 125)}
                  </p>
                  <p className="text-[13px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {getDomain(data.url)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LinkedIn Preview */}
          {activePlatform === 'linkedin' && (
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">LinkedIn Feed Preview</p>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-[550px] overflow-hidden border border-gray-200 dark:border-gray-700">
                {data.image ? (
                  <div className="aspect-[1.91/1] bg-gray-200 dark:bg-gray-700 relative">
                    <img
                      src={data.image}
                      alt="LinkedIn Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="aspect-[1.91/1] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-sm">No image provided</span>
                  </div>
                )}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1">
                    {truncate(data.title, 100)}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getDomain(data.url)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Discord Preview */}
          {activePlatform === 'discord' && (
            <div className="bg-[#36393f] p-4 rounded-lg">
              <p className="text-xs text-gray-400 mb-3">Discord Embed Preview</p>
              <div className="flex gap-4 max-w-[520px]">
                <div className="w-1 bg-[#202225] rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  {data.siteName && (
                    <p className="text-xs text-gray-400 mb-1">{data.siteName}</p>
                  )}
                  <a href="#" className="text-[#00aff4] hover:underline font-semibold text-sm block mb-1">
                    {truncate(data.title, 100)}
                  </a>
                  <p className="text-sm text-[#dcddde] mb-2 leading-snug">
                    {truncate(data.description, 300)}
                  </p>
                  {data.image && (
                    <div className="mt-2 rounded overflow-hidden max-w-[400px]">
                      <img
                        src={data.image}
                        alt="Discord Preview"
                        className="max-w-full h-auto rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Client-Side Preview</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All preview rendering happens directly in your browser. Your URLs, titles, and descriptions
              are never sent to any server. This tool simulates how platforms display your content.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Open Graph Preview Tool
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter your page URL</strong> — This is displayed below the preview on most platforms.
          </li>
          <li>
            <strong>Add your title and description</strong> — These are the og:title and og:description values.
          </li>
          <li>
            <strong>Include an image URL</strong> — Use a direct link to an image (1200x630px recommended).
          </li>
          <li>
            <strong>Switch between platforms</strong> — See how your content looks on Facebook, Twitter, LinkedIn, and Discord.
          </li>
          <li>
            <strong>Adjust your content</strong> — Modify text until you&apos;re happy with all previews.
          </li>
        </ol>
      </section>

      {/* Tips Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tips for Better Social Previews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Image Requirements</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Facebook:</strong> 1200x630px (1.91:1)</li>
              <li>• <strong>Twitter:</strong> 1200x600px (2:1)</li>
              <li>• <strong>LinkedIn:</strong> 1200x627px (1.91:1)</li>
              <li>• Keep important content centered</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Character Limits</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>Title:</strong> 60-70 characters</li>
              <li>• <strong>Description:</strong> 155-200 characters</li>
              <li>• Longer text may be truncated</li>
              <li>• Front-load important keywords</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Clear Cache</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Platforms cache OG data aggressively</li>
              <li>• Use Facebook Debugger to refresh</li>
              <li>• Twitter has Card Validator tool</li>
              <li>• LinkedIn has Post Inspector</li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Testing Tools</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Facebook: developers.facebook.com/tools/debug</li>
              <li>• Twitter: cards-dev.twitter.com/validator</li>
              <li>• LinkedIn: linkedin.com/post-inspector</li>
              <li>• Test after any OG tag changes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related SEO Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to generate the actual meta tags? Use our{' '}
          <Link href="/tools/meta-tag-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Meta Tag Generator
          </Link>{' '}
          to create all the Open Graph and Twitter Card HTML code. For structured data, try our{' '}
          <Link href="/tools/schema-markup-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Schema Markup Generator
          </Link>.
        </p>
      </section>
    </ToolLayout>
  );
}
