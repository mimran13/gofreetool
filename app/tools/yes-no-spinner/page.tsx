'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { generateYesNoAnswer } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function YesNoSpinner() {
  const tool = getToolBySlug('yes-no-spinner');
  if (!tool) return <div>Tool not found</div>;
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (!question.trim()) return;
    
    setIsSpinning(true);
    setResult(null);
    
    setTimeout(() => {
      const answer = generateYesNoAnswer();
      setResult(answer);
      setIsSpinning(false);
      trackToolCalculate('yes-no-spinner');
    }, 800);
  };

  const handleReset = () => {
    setQuestion('');
    setResult(null);
    setIsSpinning(false);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      trackCopyClick('yes-no-spinner');
    }
  };

  const answerColors: Record<string, string> = {
    'Yes': 'from-green-50 to-green-100 border-green-200 text-green-600',
    'No': 'from-red-50 to-red-100 border-red-200 text-red-600',
    'Maybe': 'from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600',
    'Ask again later': 'from-purple-50 to-purple-100 border-purple-200 text-purple-600',
    'Definitely': 'from-blue-50 to-blue-100 border-blue-200 text-blue-600',
    'Not likely': 'from-orange-50 to-orange-100 border-orange-200 text-orange-600'
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ask Your Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isSpinning && handleSpin()}
            placeholder="Will I find success?"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={handleSpin}
            disabled={isSpinning || !question.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            {isSpinning ? 'Spinning...' : 'Spin'}
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
          >
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className={`animate-slideIn bg-gradient-to-br ${answerColors[result]} dark:from-gray-800 dark:to-gray-700 dark:border-gray-600 dark:text-white rounded-lg p-8 border-2 text-center`}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">The Answer Is...</p>
          <p className="text-6xl font-bold mb-6">{result}</p>
          <button
            onClick={handleCopy}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
          >
            Copy Answer
          </button>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Yes/No Spinner</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This is a digital version of the classic Magic 8 Ball toy. It provides random answers to yes-or-no questions for entertainment purposes.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Possible Answers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Yes', 'No', 'Maybe', 'Ask again later', 'Definitely', 'Not likely'].map((answer) => (
              <div key={answer} className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-center font-semibold">
                {answer}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Disclaimer:</strong> This is purely for entertainment. The answers are random and should not be used for making important life decisions!
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
