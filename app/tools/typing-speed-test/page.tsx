'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
  "Programming is the art of telling another human what one wants the computer to do. Software is a great combination of artistry and engineering.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity. Life is what happens when you're busy making other plans. The future belongs to those who believe in the beauty of their dreams.",
];

export default function TypingSpeedTest() {
  const tool = getToolBySlug('typing-speed-test');
  const [text, setText] = useState('');
  const [sampleText, setSampleText] = useState(sampleTexts[0]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const stats = {
    wpm: 0,
    accuracy: 0,
    time: 0,
    correctChars: 0,
    totalChars: 0,
  };

  if (startTime && (endTime || isRunning)) {
    const elapsed = ((endTime || Date.now()) - startTime) / 1000 / 60; // minutes
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    stats.wpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
    stats.time = Math.round(((endTime || Date.now()) - startTime) / 1000);

    let correct = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === sampleText[i]) correct++;
    }
    stats.correctChars = correct;
    stats.totalChars = text.length;
    stats.accuracy = text.length > 0 ? Math.round((correct / text.length) * 100) : 100;
  }

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isRunning && value.length === 1) {
      setIsRunning(true);
      setStartTime(Date.now());
    }

    setText(value);
    setCurrentIndex(value.length);

    if (value.length >= sampleText.length) {
      setEndTime(Date.now());
      setIsRunning(false);
    }
  }, [isRunning, sampleText]);

  const reset = useCallback(() => {
    setText('');
    setStartTime(null);
    setEndTime(null);
    setIsRunning(false);
    setCurrentIndex(0);
    inputRef.current?.focus();
  }, []);

  const newText = useCallback(() => {
    const currentIdx = sampleTexts.indexOf(sampleText);
    const nextIdx = (currentIdx + 1) % sampleTexts.length;
    setSampleText(sampleTexts[nextIdx]);
    reset();
  }, [sampleText, reset]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!tool) return <div>Tool not found</div>;

  const isComplete = endTime !== null;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Test your <strong>typing speed</strong> and accuracy. See your Words Per Minute (WPM) score
          and track your accuracy percentage. Practice regularly to improve your typing skills.
          <strong> All processing happens in your browser</strong> — no data is collected.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg font-mono text-lg leading-relaxed">
          {sampleText.split('').map((char, idx) => {
            let className = 'text-gray-400';
            if (idx < text.length) {
              className = text[idx] === char ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
            } else if (idx === currentIndex) {
              className = 'bg-teal-200 dark:bg-teal-800 text-gray-900 dark:text-white';
            }
            return (
              <span key={idx} className={className}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleInput}
          disabled={isComplete}
          placeholder={isComplete ? "Test complete!" : "Start typing..."}
          className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono disabled:opacity-50"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.wpm}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.time}s</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.correctChars}/{stats.totalChars}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={reset}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={newText}
            className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
          >
            New Text
          </button>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Typing Speed Benchmarks</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Beginner:</strong> 20-30 WPM</li>
          <li>• <strong>Average:</strong> 40-50 WPM</li>
          <li>• <strong>Good:</strong> 50-70 WPM</li>
          <li>• <strong>Professional:</strong> 70-90 WPM</li>
          <li>• <strong>Expert:</strong> 90+ WPM</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips to Improve</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Use all fingers and learn touch typing</li>
          <li>Maintain proper posture and hand position</li>
          <li>Practice regularly, even just 10-15 minutes daily</li>
          <li>Focus on accuracy first, speed will follow</li>
          <li>Don&apos;t look at the keyboard while typing</li>
        </ul>
      </section>
    </ToolLayout>
  );
}
