'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';

interface UserAgentRule {
  id: string;
  userAgent: string;
  rules: { type: 'allow' | 'disallow'; path: string }[];
  crawlDelay?: number;
}

interface RobotsConfig {
  userAgentRules: UserAgentRule[];
  sitemaps: string[];
  host?: string;
}

const defaultConfig: RobotsConfig = {
  userAgentRules: [
    {
      id: '1',
      userAgent: '*',
      rules: [
        { type: 'allow', path: '/' },
      ],
    },
  ],
  sitemaps: [],
  host: '',
};

const commonUserAgents = [
  { value: '*', label: 'All bots (*)' },
  { value: 'Googlebot', label: 'Googlebot' },
  { value: 'Bingbot', label: 'Bingbot' },
  { value: 'Slurp', label: 'Yahoo Slurp' },
  { value: 'DuckDuckBot', label: 'DuckDuckBot' },
  { value: 'Baiduspider', label: 'Baiduspider' },
  { value: 'YandexBot', label: 'YandexBot' },
  { value: 'facebot', label: 'Facebook Bot' },
  { value: 'ia_archiver', label: 'Alexa (ia_archiver)' },
  { value: 'AhrefsBot', label: 'AhrefsBot' },
  { value: 'MJ12bot', label: 'Majestic (MJ12bot)' },
  { value: 'SemrushBot', label: 'SemrushBot' },
  { value: 'GPTBot', label: 'GPTBot (OpenAI)' },
  { value: 'ChatGPT-User', label: 'ChatGPT-User' },
  { value: 'CCBot', label: 'CCBot (Common Crawl)' },
  { value: 'anthropic-ai', label: 'Anthropic AI' },
  { value: 'Claude-Web', label: 'Claude-Web' },
];

const commonDisallowPaths = [
  '/admin/',
  '/private/',
  '/api/',
  '/cgi-bin/',
  '/wp-admin/',
  '/wp-includes/',
  '/wp-content/plugins/',
  '/search',
  '/cart/',
  '/checkout/',
  '/account/',
  '/login/',
  '/register/',
  '/*.pdf$',
  '/*?*',
  '/tmp/',
  '/cache/',
];

export default function RobotsTxtGenerator() {
  const tool = getToolBySlug('robots-txt-generator');
  const [config, setConfig] = useState<RobotsConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);
  const [newSitemap, setNewSitemap] = useState('');

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const addUserAgent = useCallback(() => {
    setConfig(prev => ({
      ...prev,
      userAgentRules: [
        ...prev.userAgentRules,
        {
          id: generateId(),
          userAgent: '*',
          rules: [{ type: 'disallow', path: '' }],
        },
      ],
    }));
  }, []);

  const removeUserAgent = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      userAgentRules: prev.userAgentRules.filter(ua => ua.id !== id),
    }));
  }, []);

  const updateUserAgent = useCallback((id: string, field: string, value: string | number | undefined) => {
    setConfig(prev => ({
      ...prev,
      userAgentRules: prev.userAgentRules.map(ua =>
        ua.id === id ? { ...ua, [field]: value } : ua
      ),
    }));
  }, []);

  const addRule = useCallback((userAgentId: string) => {
    setConfig(prev => ({
      ...prev,
      userAgentRules: prev.userAgentRules.map(ua =>
        ua.id === userAgentId
          ? { ...ua, rules: [...ua.rules, { type: 'disallow', path: '' }] }
          : ua
      ),
    }));
  }, []);

  const updateRule = useCallback((userAgentId: string, ruleIndex: number, field: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      userAgentRules: prev.userAgentRules.map(ua =>
        ua.id === userAgentId
          ? {
              ...ua,
              rules: ua.rules.map((rule, idx) =>
                idx === ruleIndex ? { ...rule, [field]: value } : rule
              ),
            }
          : ua
      ),
    }));
  }, []);

  const removeRule = useCallback((userAgentId: string, ruleIndex: number) => {
    setConfig(prev => ({
      ...prev,
      userAgentRules: prev.userAgentRules.map(ua =>
        ua.id === userAgentId
          ? { ...ua, rules: ua.rules.filter((_, idx) => idx !== ruleIndex) }
          : ua
      ),
    }));
  }, []);

  const addSitemap = useCallback(() => {
    if (newSitemap.trim()) {
      setConfig(prev => ({
        ...prev,
        sitemaps: [...prev.sitemaps, newSitemap.trim()],
      }));
      setNewSitemap('');
    }
  }, [newSitemap]);

  const removeSitemap = useCallback((index: number) => {
    setConfig(prev => ({
      ...prev,
      sitemaps: prev.sitemaps.filter((_, idx) => idx !== index),
    }));
  }, []);

  const generateRobotsTxt = useCallback(() => {
    const lines: string[] = [];

    // Add user agent rules
    config.userAgentRules.forEach((ua, index) => {
      if (index > 0) lines.push('');
      lines.push(`User-agent: ${ua.userAgent}`);

      ua.rules.forEach(rule => {
        if (rule.path !== undefined) {
          const directive = rule.type === 'allow' ? 'Allow' : 'Disallow';
          lines.push(`${directive}: ${rule.path}`);
        }
      });

      if (ua.crawlDelay && ua.crawlDelay > 0) {
        lines.push(`Crawl-delay: ${ua.crawlDelay}`);
      }
    });

    // Add sitemaps
    if (config.sitemaps.length > 0) {
      lines.push('');
      config.sitemaps.forEach(sitemap => {
        lines.push(`Sitemap: ${sitemap}`);
      });
    }

    // Add host directive
    if (config.host) {
      lines.push('');
      lines.push(`Host: ${config.host}`);
    }

    return lines.join('\n');
  }, [config]);

  const handleCopy = useCallback(async () => {
    const output = generateRobotsTxt();
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
  }, [generateRobotsTxt]);

  const handleDownload = useCallback(() => {
    const output = generateRobotsTxt();
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateRobotsTxt]);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    setNewSitemap('');
    setCopied(false);
  }, []);

  const applyPreset = useCallback((preset: 'allow-all' | 'block-all' | 'block-ai') => {
    switch (preset) {
      case 'allow-all':
        setConfig({
          userAgentRules: [{ id: generateId(), userAgent: '*', rules: [{ type: 'allow', path: '/' }] }],
          sitemaps: config.sitemaps,
          host: config.host,
        });
        break;
      case 'block-all':
        setConfig({
          userAgentRules: [{ id: generateId(), userAgent: '*', rules: [{ type: 'disallow', path: '/' }] }],
          sitemaps: config.sitemaps,
          host: config.host,
        });
        break;
      case 'block-ai':
        setConfig({
          userAgentRules: [
            { id: generateId(), userAgent: '*', rules: [{ type: 'allow', path: '/' }] },
            { id: generateId(), userAgent: 'GPTBot', rules: [{ type: 'disallow', path: '/' }] },
            { id: generateId(), userAgent: 'ChatGPT-User', rules: [{ type: 'disallow', path: '/' }] },
            { id: generateId(), userAgent: 'CCBot', rules: [{ type: 'disallow', path: '/' }] },
            { id: generateId(), userAgent: 'anthropic-ai', rules: [{ type: 'disallow', path: '/' }] },
          ],
          sitemaps: config.sitemaps,
          host: config.host,
        });
        break;
    }
  }, [config.sitemaps, config.host]);

  const output = generateRobotsTxt();

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create a <strong>robots.txt</strong> file to control how search engines crawl your website.
          Define rules for different bots, specify crawl delays, and add your sitemap locations.
          Download the generated file and upload it to your website&apos;s root directory.
          <strong> All processing happens in your browser</strong> — your site structure is never shared.
        </p>
      </section>

      {/* Presets */}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400 self-center mr-2">Quick presets:</span>
        <button
          onClick={() => applyPreset('allow-all')}
          className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
        >
          Allow All Bots
        </button>
        <button
          onClick={() => applyPreset('block-all')}
          className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          Block All Bots
        </button>
        <button
          onClick={() => applyPreset('block-ai')}
          className="px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
        >
          Block AI Crawlers
        </button>
      </div>

      {/* Main Tool */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* User Agent Rules */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">🤖</span> User Agent Rules
            </h3>
            <button
              onClick={addUserAgent}
              className="px-3 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
            >
              + Add User Agent
            </button>
          </div>

          <div className="space-y-6">
            {config.userAgentRules.map((ua, uaIndex) => (
              <div
                key={ua.id}
                className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User Agent
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={commonUserAgents.find(ua2 => ua2.value === ua.userAgent) ? ua.userAgent : 'custom'}
                        onChange={(e) => {
                          if (e.target.value !== 'custom') {
                            updateUserAgent(ua.id, 'userAgent', e.target.value);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {commonUserAgents.map(agent => (
                          <option key={agent.value} value={agent.value}>
                            {agent.label}
                          </option>
                        ))}
                        <option value="custom">Custom...</option>
                      </select>
                      <input
                        type="text"
                        value={ua.userAgent}
                        onChange={(e) => updateUserAgent(ua.id, 'userAgent', e.target.value)}
                        placeholder="User-agent name"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {config.userAgentRules.length > 1 && (
                    <button
                      onClick={() => removeUserAgent(ua.id)}
                      className="mt-6 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Remove user agent"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Rules */}
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rules
                  </label>
                  {ua.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex gap-2">
                      <select
                        value={rule.type}
                        onChange={(e) => updateRule(ua.id, ruleIndex, 'type', e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="allow">Allow</option>
                        <option value="disallow">Disallow</option>
                      </select>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={rule.path}
                          onChange={(e) => updateRule(ua.id, ruleIndex, 'path', e.target.value)}
                          placeholder="/path/to/disallow"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                        />
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              updateRule(ua.id, ruleIndex, 'path', e.target.value);
                            }
                          }}
                          className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                        >
                          <option value="">Common paths...</option>
                          {commonDisallowPaths.map(path => (
                            <option key={path} value={path}>{path}</option>
                          ))}
                        </select>
                      </div>
                      {ua.rules.length > 1 && (
                        <button
                          onClick={() => removeRule(ua.id, ruleIndex)}
                          className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Remove rule"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addRule(ua.id)}
                    className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                  >
                    + Add Rule
                  </button>
                </div>

                {/* Crawl Delay */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Crawl Delay (seconds) <span className="text-gray-400 font-normal">— optional</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={ua.crawlDelay || ''}
                    onChange={(e) => updateUserAgent(ua.id, 'crawlDelay', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 10"
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sitemaps */}
        <div className="mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🗺️</span> Sitemaps
          </h3>

          <div className="space-y-2 mb-3">
            {config.sitemaps.map((sitemap, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={sitemap}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                />
                <button
                  onClick={() => removeSitemap(index)}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Remove sitemap"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="url"
              value={newSitemap}
              onChange={(e) => setNewSitemap(e.target.value)}
              placeholder="https://example.com/sitemap.xml"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSitemap();
                }
              }}
            />
            <button
              onClick={addSitemap}
              disabled={!newSitemap.trim()}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Host Directive */}
        <div className="mb-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🌐</span> Host Directive <span className="text-sm font-normal text-gray-400">— optional</span>
          </h3>
          <input
            type="text"
            value={config.host}
            onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
            placeholder="example.com"
            className="w-full max-w-md px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Preferred domain for Yandex (not used by Google/Bing)
          </p>
        </div>

        {/* Generated Output */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">📄</span> Generated robots.txt
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Download
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
            {output}
          </pre>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Site Structure Stays Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All robots.txt generation happens directly in your browser. Your URL paths and site
              structure are never sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Robots.txt Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Select a user agent</strong> — Use * for all bots or choose specific crawlers.
          </li>
          <li>
            <strong>Add allow/disallow rules</strong> — Specify which paths bots can or cannot crawl.
          </li>
          <li>
            <strong>Add your sitemap URLs</strong> — Help search engines discover your content.
          </li>
          <li>
            <strong>Download or copy</strong> — Save the generated robots.txt file.
          </li>
          <li>
            <strong>Upload to your server</strong> — Place robots.txt in your website&apos;s root directory.
          </li>
        </ol>
      </section>

      {/* Important Notes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Important Notes About robots.txt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Not a Security Measure</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              robots.txt is a guideline, not a security barrier. Malicious bots can ignore it.
              Never use it to hide sensitive content — use proper authentication instead.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Crawling vs. Indexing</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Disallowing a URL prevents crawling but not indexing. Pages can still appear in
              search results if linked from other sites. Use noindex meta tags to prevent indexing.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">File Location</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              robots.txt must be placed in your website&apos;s root directory. For example:
              <code className="block mt-1 text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded">https://example.com/robots.txt</code>
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Case Sensitivity</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Path matching is case-sensitive. /Admin/ is different from /admin/.
              User-agent names are case-insensitive.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related SEO Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Improve your search presence with our{' '}
          <Link href="/tools/meta-tag-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Meta Tag Generator
          </Link>{' '}
          for SEO meta tags, or add rich snippets with our{' '}
          <Link href="/tools/schema-markup-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Schema Markup Generator
          </Link>.
        </p>
      </section>
    </ToolLayout>
  );
}
