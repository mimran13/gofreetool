'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface Timestamp {
  id: string;
  time: string;
  title: string;
}

export default function YouTubeTimestampGenerator() {
  const tool = getToolBySlug('youtube-timestamp-generator');
  const [videoUrl, setVideoUrl] = useState('');
  const [timestamps, setTimestamps] = useState<Timestamp[]>([
    { id: '1', time: '0:00', title: 'Introduction' },
  ]);
  const [copied, setCopied] = useState(false);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const timeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return parts[0] || 0;
  };

  const generateTimestampLink = useCallback((time: string): string => {
    const videoId = extractVideoId(videoUrl);
    const seconds = timeToSeconds(time);
    if (videoId) {
      return `https://youtu.be/${videoId}?t=${seconds}`;
    }
    return `?t=${seconds}`;
  }, [videoUrl]);

  const addTimestamp = useCallback(() => {
    setTimestamps(prev => [...prev, { id: Date.now().toString(), time: '', title: '' }]);
  }, []);

  const updateTimestamp = useCallback((id: string, field: 'time' | 'title', value: string) => {
    setTimestamps(prev => prev.map(ts => ts.id === id ? { ...ts, [field]: value } : ts));
  }, []);

  const removeTimestamp = useCallback((id: string) => {
    setTimestamps(prev => prev.filter(ts => ts.id !== id));
  }, []);

  const generateDescription = useCallback((): string => {
    return timestamps
      .filter(ts => ts.time && ts.title)
      .sort((a, b) => timeToSeconds(a.time) - timeToSeconds(b.time))
      .map(ts => `${ts.time} ${ts.title}`)
      .join('\n');
  }, [timestamps]);

  const handleCopy = useCallback(async () => {
    const text = generateDescription();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [generateDescription]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create <strong>YouTube timestamps</strong> and video chapters for your video descriptions.
          Generate timestamped links to specific moments and format chapter markers for better navigation.
          <strong> All processing happens in your browser</strong> — your video data stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            YouTube Video URL (optional)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Add your video URL to generate direct links to specific timestamps
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Timestamps / Chapters
            </label>
            <button
              onClick={addTimestamp}
              className="px-3 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              + Add Timestamp
            </button>
          </div>

          <div className="space-y-3">
            {timestamps.map((ts, index) => (
              <div key={ts.id} className="flex gap-3 items-start">
                <div className="w-24">
                  <input
                    type="text"
                    value={ts.time}
                    onChange={(e) => updateTimestamp(ts.id, 'time', e.target.value)}
                    placeholder="0:00"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={ts.title}
                    onChange={(e) => updateTimestamp(ts.id, 'title', e.target.value)}
                    placeholder="Chapter title"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {videoUrl && ts.time && (
                  <a
                    href={generateTimestampLink(ts.time)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    ▶
                  </a>
                )}
                {timestamps.length > 1 && (
                  <button
                    onClick={() => removeTimestamp(ts.id)}
                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">Generated Description Format</h3>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm font-mono text-gray-900 dark:text-white whitespace-pre-wrap">
            {generateDescription() || 'Add timestamps above to generate chapter format'}
          </pre>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">YouTube Chapter Requirements</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• First timestamp must be 0:00</li>
          <li>• Minimum 3 timestamps required for chapters to appear</li>
          <li>• Each chapter must be at least 10 seconds long</li>
          <li>• Timestamps must be in chronological order</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Timestamp Format</h2>
        <div className="text-gray-700 dark:text-gray-300">
          <p className="mb-4">Use these formats for your timestamps:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">0:00</code> - Minutes:Seconds</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">1:30:00</code> - Hours:Minutes:Seconds</li>
          </ul>
        </div>
      </section>
    </ToolLayout>
  );
}
