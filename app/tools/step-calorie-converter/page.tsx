'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { calculateCaloriesFromSteps, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function StepCalorieConverter() {
  const tool = getToolBySlug('step-calorie-converter');
  if (!tool) return <div>Tool not found</div>;
  const [steps, setSteps] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const s = parseFloat(steps);
    const w = parseFloat(weight);

    if (!s || !w || s < 0 || w <= 0) {
      setError('Please enter valid numbers (steps >= 0, weight > 0)');
      setResult(null);
      return;
    }

    setError('');
    const calculated = calculateCaloriesFromSteps(s, w);
    setResult(calculated);
    trackToolCalculate('step-calorie-converter');
  };

  const handleReset = () => {
    setSteps('');
    setWeight('');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('step-calorie-converter');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> This is an estimate. Actual calories burned depend on walking speed, terrain, and individual metabolism.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Steps
            </label>
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="10000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Body Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCalculate}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform active:scale-95"
          >
            Calculate
          </button>
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
          >
            Reset
          </button>
        </div>
      </div>

      {result !== null && (
        <div className="animate-slideIn">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10 rounded-lg p-6 border border-pink-200 dark:border-pink-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Calories Burned</p>
            <p className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4">
              {formatNumber(result)} kcal
            </p>
            <button
              onClick={() => handleCopy(result.toFixed(2))}
              className="text-sm text-pink-600 dark:text-pink-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Many Steps Should You Walk?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The popular recommendation is 10,000 steps per day, though recent research suggests 7,000-8,000 steps provides significant health benefits. Any movement is better than none!
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Steps to Common Activities</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>1 mile (1.6 km)</span>
              <span>≈ 2,000 steps</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>30 minutes of walking</span>
              <span>≈ 3,000-4,000 steps</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>1 hour of walking</span>
              <span>≈ 5,000-7,000 steps</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>10,000 steps</span>
              <span>≈ 5-6 miles (8-9.5 km)</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Factors Affecting Calories Burned</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Walking Speed:</strong> Faster walking burns more calories</li>
            <li><strong>Terrain:</strong> Hills burn more than flat surfaces</li>
            <li><strong>Body Weight:</strong> Heavier individuals burn more calories</li>
            <li><strong>Age & Metabolism:</strong> Affects calorie burn rate</li>
            <li><strong>Fitness Level:</strong> More fit individuals may burn fewer calories</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Health Benefits of Walking</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Improves cardiovascular health</li>
            <li>Supports weight management</li>
            <li>Strengthens bones and muscles</li>
            <li>Enhances mental health and mood</li>
            <li>Reduces risk of chronic diseases</li>
            <li>Low impact exercise suitable for most ages</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Are 10,000 steps necessary?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Not necessarily. Studies show significant health benefits from 7,000-8,000 steps. The best target is one you can maintain consistently.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Does walking speed matter?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes. Brisk walking (faster pace) burns significantly more calories than leisurely strolls, while still being a low-impact activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
