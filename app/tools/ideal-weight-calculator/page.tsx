'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateIdealWeight, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function IdealWeightCalculator() {
  const tool = getToolBySlug('ideal-weight-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const h = parseFloat(height);

    if (!h || h <= 0) {
      setError('Please enter a valid height');
      setResult(null);
      return;
    }

    setError('');
    const calculated = calculateIdealWeight(h, gender);
    setResult(calculated);
    trackToolCalculate('ideal-weight-calculator');
  };

  const handleReset = () => {
    setHeight('');
    setGender('male');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('ideal-weight-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> This is an estimate using the Devine formula. Consult a healthcare professional about your ideal weight, as it varies based on muscle mass, bone density, and body composition.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
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

      {result && (
        <div className="space-y-4 animate-slideIn">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Ideal Weight Range</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
              {formatNumber(result.min)} - {formatNumber(result.max)} kg
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleCopy(`${result.min.toFixed(1)} - ${result.max.toFixed(1)} kg`)}
                className="text-sm text-green-600 dark:text-green-400 hover:underline block"
              >
                Copy Range
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Ideal Weight</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your ideal weight isn't a single number, but rather a healthy range. This range accounts for different body compositions, muscle mass, and bone density. The Devine formula is commonly used to calculate this range.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Factors Affecting Ideal Weight</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Height:</strong> Primary factor in ideal weight calculation</li>
            <li><strong>Gender:</strong> Different formulas for men and women</li>
            <li><strong>Muscle Mass:</strong> Muscle weighs more than fat</li>
            <li><strong>Bone Density:</strong> Varies between individuals</li>
            <li><strong>Body Composition:</strong> Lean vs. fat percentage</li>
            <li><strong>Age:</strong> Can affect healthy weight ranges</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Beyond the Number on the Scale</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Weight is just one measure of health. Other important factors include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Physical fitness and strength</li>
            <li>Energy levels and endurance</li>
            <li>Blood pressure and cholesterol</li>
            <li>How clothes fit and feel</li>
            <li>Overall health metrics</li>
            <li>Mental well-being and confidence</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Should I aim for the minimum weight in my range?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No. Your ideal weight within the range depends on your personal body composition, fitness level, and how you feel. The entire range is healthy.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What if my current weight is outside the range?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Consult a healthcare professional. They can help create a healthy plan. Weight changes should be gradual and sustainable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
