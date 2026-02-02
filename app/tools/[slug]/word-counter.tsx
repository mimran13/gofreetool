"use client";

import { useState } from "react";
import { generateMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import {
  countWords,
  countCharacters,
  calculateReadingTime,
} from "@/lib/utils";

export default function WordCounter() {
  const tool = getToolBySlug("word-counter");
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<{
    words: number;
    charactersWithSpaces: number;
    charactersWithoutSpaces: number;
    readingTime: number;
  } | null>(null);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    if (value.trim().length > 0) {
      setResult({
        words: countWords(value),
        charactersWithSpaces: countCharacters(value, true),
        charactersWithoutSpaces: countCharacters(value, false),
        readingTime: calculateReadingTime(value),
      });
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Paste or Type Your Text
          </h2>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Start typing or paste your text here... Results will update automatically."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-base"
          />
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors"
            >
              Clear
            </button>
            <div className="text-sm text-gray-500 flex items-center ml-auto">
              Characters: {text.length}
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistics</h2>
          {result ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-gray-600 text-xs font-medium mb-1">
                  Total Words
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {result.words}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-xs font-medium mb-1">
                  Characters (with spaces)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.charactersWithSpaces}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-xs font-medium mb-1">
                  Characters (without spaces)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {result.charactersWithoutSpaces}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-gray-600 text-xs font-medium mb-1">
                  Estimated Reading Time
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {result.readingTime} min
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-900">
                <p>
                  <strong>📖 Note:</strong> Reading time calculated at 200 words
                  per minute.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <p className="text-gray-600 text-sm">
                Start typing or paste text to see statistics
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How to Use Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Type or paste your text in the textarea above</li>
          <li>Statistics update automatically as you type</li>
          <li>See word count, character count, and reading time instantly</li>
          <li>Use "Clear" button to reset and start over</li>
        </ol>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips</h3>
        <ul className="space-y-2 text-gray-700 text-sm list-disc list-inside">
          <li>
            Use this tool for essays, articles, social media posts, and emails
          </li>
          <li>
            Reading time helps you estimate how long your content will take to
            read
          </li>
          <li>Character count is useful for platforms with character limits</li>
          <li>
            Monitor word count to maintain article or assignment length
            requirements
          </li>
        </ul>
      </div>
    </ToolLayout>
  );
}
