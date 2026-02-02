'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateBMR, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function BMRCalculator() {
  const tool = getToolBySlug('bmr-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0 || a > 150) {
      setError('Please enter valid positive numbers');
      setResult(null);
      return;
    }

    setError('');
    const calculated = calculateBMR(w, h, a, gender);
    setResult(calculated);
    trackToolCalculate('bmr-calculator');
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setAge('');
    setGender('male');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('bmr-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> This calculator is for informational purposes only. Consult a healthcare professional for personalized nutritional advice.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              Age (years)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
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

      {result !== null && (
        <div className="animate-slideIn">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Your Basal Metabolic Rate (BMR)</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {formatNumber(result)} calories/day
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              This is the number of calories your body burns at rest
            </p>
            <button
              onClick={() => handleCopy(result.toFixed(0))}
              className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is BMR?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Basal Metabolic Rate (BMR) is the number of calories your body burns while at rest to maintain basic functions like breathing, circulation, and cell production. It represents the minimum calories your body needs daily.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">BMR vs. TDEE</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>BMR:</strong> Calories burned at complete rest</p>
            <p><strong>TDEE (Total Daily Energy Expenditure):</strong> BMR × Activity Level</p>
            <ul className="list-disc list-inside mt-2">
              <li>Sedentary: BMR × 1.2</li>
              <li>Lightly Active: BMR × 1.375</li>
              <li>Moderately Active: BMR × 1.55</li>
              <li>Very Active: BMR × 1.725</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Factors Affecting BMR</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li><strong>Age:</strong> BMR decreases with age</li>
            <li><strong>Gender:</strong> Men typically have higher BMR than women</li>
            <li><strong>Muscle Mass:</strong> More muscle = higher BMR</li>
            <li><strong>Body Composition:</strong> Lean body mass burns more calories</li>
            <li><strong>Hormones:</strong> Thyroid hormones affect BMR</li>
            <li><strong>Genetics:</strong> Natural variation in metabolism</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Why is the Harris-Benedict formula used?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                It's one of the most widely used formulas for BMR estimation. It was developed in 1919 and updated in 1984, making it reliable for most people.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
