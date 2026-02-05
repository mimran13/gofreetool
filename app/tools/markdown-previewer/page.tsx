'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// LIGHTWEIGHT MARKDOWN PARSER
// ============================================================================

/**
 * Parse markdown to HTML without external dependencies
 * Supports: headings, bold, italic, strikethrough, code, links, images,
 * lists, blockquotes, horizontal rules, tables, and code blocks
 */
function parseMarkdown(markdown: string): string {
  if (!markdown.trim()) return '';

  let html = markdown;

  // Escape HTML entities first (but preserve markdown)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (fenced) - must be processed first to prevent other parsing inside
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langClass}>${code.trim()}</code></pre>`;
  });

  // Inline code - protect from other transformations
  const inlineCodePlaceholders: string[] = [];
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodePlaceholders.length}__`;
    inlineCodePlaceholders.push(`<code>${code}</code>`);
    return placeholder;
  });

  // Tables
  html = html.replace(/^\|(.+)\|\n\|[-:\|\s]+\|\n((?:\|.+\|\n?)+)/gm, (_, header, body) => {
    const headers = header.split('|').map((h: string) => h.trim()).filter(Boolean);
    const headerRow = headers.map((h: string) => `<th>${h}</th>`).join('');

    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean);
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');

    return `<table><thead><tr>${headerRow}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Headings (must be at start of line)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Alternative headings (underline style)
  html = html.replace(/^(.+)\n={2,}$/gm, '<h1>$1</h1>');
  html = html.replace(/^(.+)\n-{2,}$/gm, '<h2>$1</h2>');

  // Horizontal rules
  html = html.replace(/^(?:[-*_]\s*){3,}$/gm, '<hr>');

  // Blockquotes
  html = html.replace(/^(?:&gt;|>)\s*(.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Images (before links to prevent conflict)
  html = html.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, alt, src, title) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<img src="${src}" alt="${alt}"${titleAttr}>`;
    }
  );

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_, text, href, title) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
  );

  // Auto-link URLs
  html = html.replace(/(?<!["\(])(https?:\/\/[^\s<]+[^\s<.,;:!?)\]"'])/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Bold and italic combinations
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_\n]+)_/g, '<em>$1</em>');

  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Unordered lists
  html = html.replace(/^[\*\-\+]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Only wrap consecutive <li> that aren't already in <ul>
  html = html.replace(/(?<!<\/ul>)(<li>.*<\/li>\n?)+(?!<\/ul>)/g, (match) => {
    if (!match.includes('<ul>')) {
      return `<ol>${match}</ol>`;
    }
    return match;
  });

  // Task lists (checkboxes)
  html = html.replace(/<li>\[\s\]\s*/g, '<li class="task-list-item"><input type="checkbox" disabled> ');
  html = html.replace(/<li>\[x\]\s*/gi, '<li class="task-list-item"><input type="checkbox" checked disabled> ');

  // Paragraphs - wrap remaining text blocks
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    // Don't wrap if it's already an HTML block element
    if (/^<(h[1-6]|p|div|ul|ol|li|blockquote|pre|table|hr|img)/i.test(block)) {
      return block;
    }
    // Don't wrap if it's a list or heading continuation
    if (block.startsWith('<')) return block;
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // Restore inline code
  inlineCodePlaceholders.forEach((code, i) => {
    html = html.replace(`__INLINE_CODE_${i}__`, code);
  });

  // Clean up extra whitespace
  html = html.replace(/\n{3,}/g, '\n\n').trim();

  return html;
}

// ============================================================================
// PREVIEW STYLES
// ============================================================================

const previewStyles = `
  .markdown-preview {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: inherit;
  }
  .markdown-preview h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; border-bottom: 1px solid currentColor; padding-bottom: 0.3em; opacity: 0.9; }
  .markdown-preview h2 { font-size: 1.5em; font-weight: 600; margin: 0.83em 0; border-bottom: 1px solid currentColor; padding-bottom: 0.3em; opacity: 0.8; }
  .markdown-preview h3 { font-size: 1.25em; font-weight: 600; margin: 1em 0; }
  .markdown-preview h4 { font-size: 1em; font-weight: 600; margin: 1.33em 0; }
  .markdown-preview h5 { font-size: 0.875em; font-weight: 600; margin: 1.67em 0; }
  .markdown-preview h6 { font-size: 0.85em; font-weight: 600; margin: 2.33em 0; opacity: 0.7; }
  .markdown-preview p { margin: 1em 0; }
  .markdown-preview a { color: #0969da; text-decoration: none; }
  .markdown-preview a:hover { text-decoration: underline; }
  .markdown-preview strong { font-weight: 600; }
  .markdown-preview em { font-style: italic; }
  .markdown-preview del { text-decoration: line-through; opacity: 0.7; }
  .markdown-preview code {
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
    font-size: 0.875em;
    padding: 0.2em 0.4em;
    background: rgba(127, 127, 127, 0.15);
    border-radius: 4px;
  }
  .markdown-preview pre {
    background: rgba(127, 127, 127, 0.1);
    padding: 1em;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;
  }
  .markdown-preview pre code {
    background: none;
    padding: 0;
    font-size: 0.875em;
    line-height: 1.5;
  }
  .markdown-preview blockquote {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid rgba(127, 127, 127, 0.4);
    background: rgba(127, 127, 127, 0.05);
    border-radius: 0 4px 4px 0;
  }
  .markdown-preview ul, .markdown-preview ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  .markdown-preview li { margin: 0.25em 0; }
  .markdown-preview li.task-list-item { list-style: none; margin-left: -1.5em; }
  .markdown-preview li.task-list-item input { margin-right: 0.5em; }
  .markdown-preview hr {
    border: none;
    border-top: 2px solid rgba(127, 127, 127, 0.2);
    margin: 2em 0;
  }
  .markdown-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }
  .markdown-preview table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  .markdown-preview th, .markdown-preview td {
    border: 1px solid rgba(127, 127, 127, 0.3);
    padding: 0.5em 1em;
    text-align: left;
  }
  .markdown-preview th {
    background: rgba(127, 127, 127, 0.1);
    font-weight: 600;
  }
  .markdown-preview tr:nth-child(even) {
    background: rgba(127, 127, 127, 0.05);
  }
`;

// ============================================================================
// SAMPLE MARKDOWN
// ============================================================================

const SAMPLE_MARKDOWN = `# Markdown Previewer

Welcome to the **Markdown Previewer**! This tool lets you write Markdown and see it rendered in real-time.

## Features

- **Bold text** and *italic text*
- ~~Strikethrough~~ text
- \`Inline code\` formatting
- [Links](https://example.com)

### Code Blocks

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

### Lists

#### Unordered List
- First item
- Second item
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

#### Task List
- [x] Completed task
- [ ] Pending task
- [ ] Another task

### Blockquote

> This is a blockquote. It can span multiple lines and is great for highlighting important information.

### Table

| Feature | Supported |
|---------|-----------|
| Headings | Yes |
| Lists | Yes |
| Code | Yes |
| Tables | Yes |

### Horizontal Rule

---

### Image

![Placeholder](https://via.placeholder.com/200x100?text=Image)

---

*Start editing to see your Markdown rendered!*
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type ViewMode = 'split' | 'preview';

export default function MarkdownPreviewer() {
  const tool = getToolBySlug('markdown-previewer');

  // State
  const [input, setInput] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [copyHtmlSuccess, setCopyHtmlSuccess] = useState(false);
  const [copyMdSuccess, setCopyMdSuccess] = useState(false);

  // Parse markdown to HTML
  const renderedHtml = useMemo(() => {
    return parseMarkdown(input);
  }, [input]);

  // Handle copy HTML
  const handleCopyHtml = useCallback(async () => {
    if (renderedHtml) {
      try {
        await navigator.clipboard.writeText(renderedHtml);
        setCopyHtmlSuccess(true);
        setTimeout(() => setCopyHtmlSuccess(false), 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = renderedHtml;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopyHtmlSuccess(true);
        setTimeout(() => setCopyHtmlSuccess(false), 2000);
      }
    }
  }, [renderedHtml]);

  // Handle copy Markdown
  const handleCopyMd = useCallback(async () => {
    if (input) {
      try {
        await navigator.clipboard.writeText(input);
        setCopyMdSuccess(true);
        setTimeout(() => setCopyMdSuccess(false), 2000);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = input;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopyMdSuccess(true);
        setTimeout(() => setCopyMdSuccess(false), 2000);
      }
    }
  }, [input]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Handle load sample
  const handleLoadSample = useCallback(() => {
    setInput(SAMPLE_MARKDOWN);
  }, []);

  // Word and character count
  const stats = useMemo(() => {
    const text = input.trim();
    const chars = text.length;
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const lines = text ? text.split('\n').length : 0;
    return { chars, words, lines };
  }, [input]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Inject preview styles */}
      <style dangerouslySetInnerHTML={{ __html: previewStyles }} />

      {/* Introduction Section */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Preview your <strong>Markdown</strong> as beautifully rendered HTML in real-time with our free{' '}
          <strong>Markdown Previewer</strong>. Supports headings, lists, code blocks, tables, links,
          images, and more. Toggle between split view and preview-only mode. Copy the rendered HTML
          with one click. <strong>100% client-side processing</strong> means your content never leaves
          your browser.
        </p>
      </ToolContent>

      {/* Main Tool Interface */}
      <ToolInterface className="mb-8">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'split'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'preview'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Preview Only
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>{stats.words} words</span>
            <span>{stats.chars} chars</span>
            <span>{stats.lines} lines</span>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Input Section */}
          {viewMode === 'split' && (
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="markdown-input"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Markdown Input
                </label>
                <button
                  onClick={handleLoadSample}
                  className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
                >
                  Load Sample
                </button>
              </div>

              <textarea
                id="markdown-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type or paste your Markdown here..."
                className="w-full h-[65vh] px-5 py-4 font-mono text-sm leading-relaxed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors"
                spellCheck={false}
              />

              {/* Action buttons */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleClear}
                  disabled={!input}
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleCopyMd}
                  disabled={!input}
                  className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                >
                  {copyMdSuccess ? 'Copied!' : 'Copy Markdown'}
                </button>
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Preview
              </span>
              {viewMode === 'preview' && (
                <button
                  onClick={handleLoadSample}
                  className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
                >
                  Load Sample
                </button>
              )}
            </div>

            <div
              className={`w-full ${viewMode === 'split' ? 'h-[65vh]' : 'min-h-[65vh]'} px-6 py-5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-auto`}
            >
              {renderedHtml ? (
                <div
                  className="markdown-preview text-gray-900 dark:text-gray-100"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center px-4">
                    {viewMode === 'preview'
                      ? 'Click "Load Sample" or switch to Split View to start writing'
                      : 'Start typing Markdown to see the preview'}
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons for preview */}
            <div className="flex gap-3 mt-3">
              {viewMode === 'preview' && (
                <>
                  <button
                    onClick={() => setViewMode('split')}
                    className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                  >
                    Edit Markdown
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={!input}
                    className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </>
              )}
              <button
                onClick={handleCopyHtml}
                disabled={!renderedHtml}
                className={`${viewMode === 'split' ? 'flex-1' : 'flex-1'} px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors`}
              >
                {copyHtmlSuccess ? 'Copied!' : 'Copy HTML'}
              </button>
            </div>
          </div>
        </div>
      </ToolInterface>

      {/* Privacy Notice */}
      <ToolContent className="mb-12">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">🔒</span>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                All Markdown parsing happens directly in your browser. Your content is never sent to any server,
                stored, or logged. This tool works completely offline after the page loads.
              </p>
            </div>
          </div>
        </div>
      </ToolContent>

      {/* How to Use Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Markdown Previewer
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Write or paste Markdown</strong> in the input area on the left (Split View) or
            click &quot;Load Sample&quot; to see example syntax.
          </li>
          <li>
            <strong>See live preview</strong> as you type. The rendered HTML appears instantly on the right.
          </li>
          <li>
            <strong>Toggle view modes</strong> between Split View (editor + preview) and Preview Only
            (full-width preview).
          </li>
          <li>
            <strong>Copy the output</strong> using &quot;Copy HTML&quot; to get the rendered HTML code, or
            &quot;Copy Markdown&quot; to copy your source.
          </li>
        </ol>
      </ToolContent>

      {/* Markdown Syntax Reference */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Markdown Syntax Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Element</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Markdown Syntax</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { element: 'Heading 1', syntax: '# Heading', result: 'Large heading' },
                { element: 'Heading 2', syntax: '## Heading', result: 'Medium heading' },
                { element: 'Bold', syntax: '**bold**', result: <strong>bold</strong> },
                { element: 'Italic', syntax: '*italic*', result: <em>italic</em> },
                { element: 'Strikethrough', syntax: '~~deleted~~', result: <del>deleted</del> },
                { element: 'Inline Code', syntax: '`code`', result: <code className="px-1 bg-gray-100 dark:bg-gray-700 rounded">code</code> },
                { element: 'Link', syntax: '[text](url)', result: <span className="text-blue-600">text</span> },
                { element: 'Image', syntax: '![alt](url)', result: 'Image' },
                { element: 'Unordered List', syntax: '- item', result: '• item' },
                { element: 'Ordered List', syntax: '1. item', result: '1. item' },
                { element: 'Blockquote', syntax: '> quote', result: 'Indented quote' },
                { element: 'Horizontal Rule', syntax: '---', result: 'Line' },
                { element: 'Code Block', syntax: '```lang\\ncode\\n```', result: 'Formatted code' },
              ].map((row) => (
                <tr key={row.element} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{row.element}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 dark:text-gray-400">{row.syntax}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ToolContent>

      {/* Features Section */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '⚡', title: 'Live Preview', desc: 'See your Markdown rendered instantly as you type' },
            { icon: '📐', title: 'Split/Preview Modes', desc: 'Toggle between side-by-side and full preview' },
            { icon: '📋', title: 'Copy HTML Output', desc: 'One-click copy of rendered HTML code' },
            { icon: '📊', title: 'Table Support', desc: 'Create tables with pipe syntax' },
            { icon: '✅', title: 'Task Lists', desc: 'Checkbox lists with [x] and [ ] syntax' },
            { icon: '💻', title: 'Code Blocks', desc: 'Syntax-highlighted fenced code blocks' },
            { icon: '🔗', title: 'Links & Images', desc: 'Full support for links and embedded images' },
            { icon: '🔒', title: 'Privacy First', desc: '100% client-side, no server processing' },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ToolContent>

      {/* Related Tools */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Working with HTML? Try our{' '}
            <Link
              href="/tools/html-formatter"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              HTML Formatter & Beautifier
            </Link>
            . Need to format JSON? Use our{' '}
            <Link
              href="/tools/json-formatter-viewer"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON Formatter
            </Link>
            . Styling with CSS? Check out our{' '}
            <Link
              href="/tools/css-formatter"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              CSS Formatter
            </Link>
            . Testing patterns? Try our{' '}
            <Link
              href="/tools/regex-tester"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              Regex Tester
            </Link>
            .
          </p>
        </div>
      </ToolContent>

      {/* FAQ Section */}
      <ToolContent className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is Markdown?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Markdown is a lightweight markup language created by John Gruber in 2004. It allows you to
              write formatted text using plain text syntax that&apos;s easy to read and write. Markdown is
              widely used for documentation, README files, blog posts, comments, and more. It can be
              converted to HTML and other formats.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What Markdown features are supported?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              This previewer supports all common Markdown syntax: headings (# to ######), bold (**),
              italic (*), strikethrough (~~), inline code (`), code blocks (```), links, images,
              unordered lists (-), ordered lists (1.), task lists ([ ] and [x]), blockquotes (&gt;),
              horizontal rules (---), and tables using pipe syntax.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I use this for GitHub README files?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes! This previewer supports GitHub Flavored Markdown (GFM) features like tables, task
              lists, and fenced code blocks. However, some GitHub-specific features like @mentions,
              issue references (#123), and emoji shortcodes (:smile:) are not supported. For those,
              use GitHub&apos;s built-in preview.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does this support syntax highlighting in code blocks?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Code blocks are displayed with monospace formatting and a distinct background, but full
              syntax highlighting (colored keywords, strings, etc.) is not included to keep the tool
              lightweight and fast. The language hint after ``` is preserved in the HTML output for
              use with external syntax highlighting libraries.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is my content safe when using this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, completely safe. This Markdown previewer runs entirely in your browser using JavaScript.
              Your content is never sent to any server, stored, or logged. You can verify this by
              disconnecting from the internet—the tool will continue to work perfectly.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I embed the rendered HTML in my website?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes! Click &quot;Copy HTML&quot; to get the rendered HTML code. You can paste this into any HTML
              document. Note that you may need to add your own CSS styles to match your website&apos;s design,
              as the preview styles are specific to this tool.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
