'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// LOREM IPSUM TEXT DATA
// ============================================================================

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'iusto', 'odio', 'dignissimos', 'ducimus', 'blanditiis',
  'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti', 'quos', 'dolores',
  'quas', 'molestias', 'excepturi', 'obcaecati', 'cupiditate', 'provident',
  'similique', 'architecto', 'beatae', 'vitae', 'dicta', 'explicabo', 'nemo',
  'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolorem', 'porro', 'quisquam', 'nihil',
  'impedit', 'quo', 'minus', 'quod', 'maxime', 'placeat', 'facere', 'possimus',
  'omnis', 'repudiandae', 'temporibus', 'autem', 'quibusdam', 'officiis',
  'debitis', 'rerum', 'necessitatibus', 'saepe', 'eveniet', 'voluptates',
  'repellat', 'recusandae', 'itaque', 'earum', 'hic', 'tenetur', 'sapiente',
  'delectus', 'reiciendis', 'voluptatibus', 'maiores', 'alias', 'perferendis',
  'doloribus', 'asperiores', 'repellat', 'perspiciatis', 'unde', 'totam', 'rem',
  'aperiam', 'eaque', 'inventore', 'veritatis', 'quasi', 'nesciunt', 'neque',
  'corporis', 'suscipit', 'laboriosam', 'aliquid', 'commodi', 'consequatur',
  'vel', 'illum', 'dolore', 'fugiat', 'harum', 'quidem', 'rerum', 'facilis',
  'expedita', 'distinctio', 'nam', 'libero', 'tempore', 'cum', 'soluta', 'nobis',
  'eligendi', 'optio', 'cumque', 'impedit', 'assumenda', 'ratione', 'fuga',
];

const CLASSIC_FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

// ============================================================================
// GENERATION HELPERS
// ============================================================================

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSentence(): string {
  const wordCount = randomInt(6, 18);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
  }
  return capitalize(words.join(' ')) + '.';
}

function generateParagraph(): string {
  const sentenceCount = randomInt(3, 7);
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(' ');
}

type OutputType = 'paragraphs' | 'sentences' | 'words';

function generateLoremIpsum(count: number, type: OutputType, startWithClassic: boolean): string {
  if (count <= 0) return '';

  if (type === 'words') {
    const words: string[] = [];
    if (startWithClassic) {
      const classicWords = CLASSIC_FIRST_SENTENCE.replace('.', '').split(' ');
      words.push(...classicWords.slice(0, Math.min(count, classicWords.length)));
    }
    while (words.length < count) {
      words.push(LOREM_WORDS[randomInt(0, LOREM_WORDS.length - 1)]);
    }
    // Capitalize first word
    if (words.length > 0) {
      words[0] = capitalize(words[0]);
    }
    return words.slice(0, count).join(' ') + '.';
  }

  if (type === 'sentences') {
    const sentences: string[] = [];
    if (startWithClassic) {
      sentences.push(CLASSIC_FIRST_SENTENCE);
    }
    while (sentences.length < count) {
      sentences.push(generateSentence());
    }
    return sentences.slice(0, count).join(' ');
  }

  // paragraphs
  const paragraphs: string[] = [];
  if (startWithClassic) {
    const firstPara = CLASSIC_FIRST_SENTENCE + ' ' + generateParagraph();
    paragraphs.push(firstPara);
  }
  while (paragraphs.length < count) {
    paragraphs.push(generateParagraph());
  }
  return paragraphs.slice(0, count).join('\n\n');
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LoremIpsumGenerator() {
  const tool = getToolBySlug('lorem-ipsum-generator');

  const [count, setCount] = useState(5);
  const [outputType, setOutputType] = useState<OutputType>('paragraphs');
  const [startWithClassic, setStartWithClassic] = useState(true);
  const [output, setOutput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleGenerate = useCallback(() => {
    const text = generateLoremIpsum(count, outputType, startWithClassic);
    setOutput(text);
    setWordCount(text.split(/\s+/).filter(Boolean).length);
  }, [count, outputType, startWithClassic]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setOutput('');
    setWordCount(0);
  }, []);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Lorem Ipsum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lorem Ipsum is placeholder text used in the printing and typesetting industry since the 1500s. It originates from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" by Cicero, written in 45 BC. It is used because it has a roughly normal distribution of letters, making it look like readable English.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do designers use Lorem Ipsum?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Designers use Lorem Ipsum because it allows them to focus on visual design elements like typography, layout, and spacing without being distracted by readable content. It provides a natural-looking text distribution that simulates real content.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Lorem Ipsum real Latin?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lorem Ipsum is derived from real Latin text by Cicero, but the standard passage used today has been altered and scrambled over the centuries. Some words have been changed or removed, so it is not proper Latin and has no coherent meaning.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use Lorem Ipsum in production?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Lorem Ipsum should only be used as placeholder text during the design and development phase. It must be replaced with real content before publishing. Leaving Lorem Ipsum in production is considered unprofessional and can hurt SEO.',
        },
      },
    ],
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate <strong>Lorem Ipsum</strong> placeholder text for your designs, mockups, and
          layouts. Choose between paragraphs, sentences, or a specific word count. Start with the
          classic &quot;Lorem ipsum dolor sit amet...&quot; opening or get fully randomized text.
          All generation happens in your browser — no data is sent to any server.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Controls */}
        <div className="flex flex-wrap items-end gap-4 mb-6 justify-center">
          {/* Count */}
          <div>
            <label htmlFor="count" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Count
            </label>
            <input
              id="count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:text-white text-center"
            />
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {(['paragraphs', 'sentences', 'words'] as OutputType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setOutputType(type)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                    outputType === type
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Classic Start Toggle */}
          <div className="flex items-center gap-2">
            <input
              id="classic"
              type="checkbox"
              checked={startWithClassic}
              onChange={(e) => setStartWithClassic(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-gray-300 dark:border-gray-600"
            />
            <label htmlFor="classic" className="text-sm text-gray-700 dark:text-gray-300">
              Start with &quot;Lorem ipsum...&quot;
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
          >
            Generate
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <span className="text-xs text-gray-500 dark:text-gray-400 self-center">Quick:</span>
          {[
            { label: '1 Paragraph', count: 1, type: 'paragraphs' as OutputType },
            { label: '3 Paragraphs', count: 3, type: 'paragraphs' as OutputType },
            { label: '5 Paragraphs', count: 5, type: 'paragraphs' as OutputType },
            { label: '10 Sentences', count: 10, type: 'sentences' as OutputType },
            { label: '50 Words', count: 50, type: 'words' as OutputType },
            { label: '200 Words', count: 200, type: 'words' as OutputType },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setCount(preset.count);
                setOutputType(preset.type);
                const text = generateLoremIpsum(preset.count, preset.type, startWithClassic);
                setOutput(text);
                setWordCount(text.split(/\s+/).filter(Boolean).length);
              }}
              className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Generated Text
            </label>
            {output && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {wordCount.toLocaleString()} words • {output.length.toLocaleString()} chars
              </span>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder='Click "Generate" to create Lorem Ipsum text...'
            className="w-full h-64 px-4 py-3 font-mono text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 rounded-lg resize-none dark:text-white"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={handleCopy}
            disabled={!output}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {copySuccess ? 'Copied!' : 'Copy Text'}
          </button>
          <button
            onClick={handleGenerate}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Regenerate
          </button>
          <button
            onClick={handleClear}
            disabled={!output}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All text generation happens directly in your browser using JavaScript. No data is sent
              to any server. This tool works offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Lorem Ipsum Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Set the count:</strong> Enter how many paragraphs, sentences, or words you need.
          </li>
          <li>
            <strong>Choose the type:</strong> Select Paragraphs, Sentences, or Words to control the output format.
          </li>
          <li>
            <strong>Classic start:</strong> Check the box to begin with the traditional &quot;Lorem ipsum dolor sit amet...&quot; opening.
          </li>
          <li>
            <strong>Generate:</strong> Click &quot;Generate&quot; or use a quick preset for common sizes.
          </li>
          <li>
            <strong>Copy:</strong> Click &quot;Copy Text&quot; to copy the generated text to your clipboard.
          </li>
        </ol>
      </section>

      {/* What is Lorem Ipsum */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is Lorem Ipsum?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            <strong>Lorem Ipsum</strong> is standard placeholder text used in the printing and
            typesetting industry since the 1500s. It originates from sections 1.10.32 and 1.10.33
            of &quot;de Finibus Bonorum et Malorum&quot; (The Extremes of Good and Evil) by Cicero,
            written in 45 BC. The text has been the industry&apos;s standard dummy text for over
            five centuries.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Designers and developers use Lorem Ipsum because it has a natural distribution of
            letters and words, making it resemble readable English. This allows focusing on visual
            design and layout without meaningful content causing distraction.
          </p>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🎨', title: 'Web & UI Design', desc: 'Fill mockups and wireframes with realistic-looking text' },
            { icon: '📄', title: 'Print Layout', desc: 'Placeholder text for brochures, magazines, and posters' },
            { icon: '🖥️', title: 'Website Development', desc: 'Populate templates and themes during development' },
            { icon: '📱', title: 'App Prototyping', desc: 'Simulate text content in mobile and web app prototypes' },
            { icon: '📝', title: 'Typography Testing', desc: 'Test fonts, line heights, and text rendering' },
            { icon: '📊', title: 'Presentations', desc: 'Fill slide layouts to preview design before final content' },
          ].map((useCase) => (
            <div key={useCase.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{useCase.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{useCase.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{useCase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to count words in your content? Try our{' '}
          <Link href="/tools/word-counter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Word & Character Counter
          </Link>. For text formatting, check out our{' '}
          <Link href="/tools/text-case-converter" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Text Case Converter
          </Link>.
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is Lorem Ipsum?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Lorem Ipsum is placeholder text used in the printing and typesetting industry since the
              1500s. It originates from sections 1.10.32 and 1.10.33 of &quot;de Finibus Bonorum et
              Malorum&quot; by Cicero, written in 45 BC. It is used because it has a roughly normal
              distribution of letters, making it look like readable English.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why do designers use Lorem Ipsum?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Designers use Lorem Ipsum because it allows them to focus on visual design elements like
              typography, layout, and spacing without being distracted by readable content. It provides
              a natural-looking text distribution that simulates real content.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is Lorem Ipsum real Latin?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Lorem Ipsum is derived from real Latin text by Cicero, but the standard passage used
              today has been altered and scrambled over the centuries. Some words have been changed or
              removed, so it is not proper Latin and has no coherent meaning.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can I use Lorem Ipsum in production?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Lorem Ipsum should only be used as placeholder text during the design and development
              phase. It must be replaced with real content before publishing. Leaving Lorem Ipsum in
              production is considered unprofessional and can hurt SEO.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How much Lorem Ipsum text should I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Use roughly the same amount of text as the final content. For a blog post, 3-5 paragraphs
              work well. For a heading, 3-7 words. For a product description, 50-100 words. Matching
              the expected content length ensures your design accommodates real text properly.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
