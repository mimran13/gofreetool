"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
} from "@/lib/utils";
import { trackToolCalculate, trackCopyClick } from "@/lib/analytics";

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel";

export default function TextCaseConverter() {
  const tool = getToolBySlug("text-case-converter");
  const [text, setText] = useState<string>("hello world");
  const [selectedCase, setSelectedCase] = useState<CaseType>("upper");
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (!tool) return <div>Tool not found</div>;

  const handleConvert = () => {
    if (!text.trim()) {
      alert("Please enter some text to convert");
      return;
    }

    let converted = text;
    switch (selectedCase) {
      case "upper":
        converted = toUpperCase(text);
        break;
      case "lower":
        converted = toLowerCase(text);
        break;
      case "title":
        converted = toTitleCase(text);
        break;
      case "sentence":
        converted = toSentenceCase(text);
        break;
      case "camel":
        converted = toCamelCase(text);
        break;
    }
    setResult(converted);
    trackToolCalculate("text-case-converter");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    trackCopyClick("text-case-converter");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setText("hello world");
    setSelectedCase("upper");
    setResult("");
    setCopied(false);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Convert Text Case</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConvert();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">{text.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Convert To
              </label>
              <div className="space-y-2">
                {[
                  { id: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
                  { id: "lower", label: "lowercase", example: "hello world" },
                  { id: "title", label: "Title Case", example: "Hello World" },
                  { id: "sentence", label: "Sentence case", example: "Hello world" },
                  { id: "camel", label: "camelCase", example: "helloWorld" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      value={opt.id}
                      checked={selectedCase === opt.id}
                      onChange={(e) => setSelectedCase(e.target.value as CaseType)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-semibold text-gray-700">{opt.label}</span>
                      <p className="text-xs text-gray-500">{opt.example}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Convert
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div>
          {result ? (
            <div className="space-y-4 result-reveal">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-3">Result</p>
                <p className="text-lg font-mono bg-white border border-gray-200 rounded p-3 break-words min-h-20">
                  {result}
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded transition-colors"
                  >
                    {copied ? "✓ Copied!" : "📋 Copy"}
                  </button>
                  <button
                    onClick={() => setText(result)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
                  >
                    Use as Input
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p><strong>Characters:</strong> {result.length} | <strong>Words:</strong> {result.split(/\s+/).length}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Enter text and click "Convert" to see result</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Enter your text in the textarea</li>
          <li>Select the desired case format</li>
          <li>Click "Convert" to transform your text</li>
          <li>Click "Copy" to copy to clipboard instantly</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
