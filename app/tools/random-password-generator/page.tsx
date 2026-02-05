'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { generateRandomPassword } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function RandomPasswordGenerator() {
  const tool = getToolBySlug('random-password-generator');
  if (!tool) return <div>Tool not found</div>;
  const [length, setLength] = useState('12');
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [result, setResult] = useState('');

  const handleGenerate = () => {
    const len = parseInt(length);
    if (!len || len < 4 || len > 128) {
      return;
    }
    const password = generateRandomPassword(len, includeSymbols);
    setResult(password);
    trackToolCalculate('random-password-generator');
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      trackCopyClick('random-password-generator');
    }
  };

  const handleReset = () => {
    setLength('12');
    setIncludeSymbols(true);
    setResult('');
  };

  const getStrength = (pwd: string) => {
    if (pwd.length < 8) return { text: 'Weak', color: 'text-red-600' };
    if (pwd.length < 12) return { text: 'Good', color: 'text-yellow-600' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  const strength = result ? getStrength(result) : null;

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="space-y-4 mb-6">
          <div>
            <label className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Length</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{length}</span>
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Include Symbols (!@#$%^&*)</span>
          </label>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Generate Password
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
        <div className="space-y-4 animate-slideIn">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Generated Password</p>
                <p className="font-mono text-lg text-indigo-600 dark:text-indigo-400 break-all">{result}</p>
              </div>
              {strength && (
                <div className={`text-sm font-semibold ${strength.color}`}>{strength.text}</div>
              )}
            </div>
            <button
              onClick={handleCopy}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
            >
              Copy Password
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Use Strong Passwords?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Protects your accounts from unauthorized access</li>
            <li>Prevents identity theft</li>
            <li>Secures sensitive personal information</li>
            <li>Reduces risk of data breaches</li>
            <li>Required by most security standards</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Password Best Practices</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Use at least 12 characters</li>
            <li>Mix uppercase, lowercase, numbers, and symbols</li>
            <li>Avoid common words and patterns</li>
            <li>Use unique passwords for each account</li>
            <li>Store passwords in a password manager</li>
            <li>Change passwords regularly</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
