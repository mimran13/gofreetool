'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateFuelCost, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function FuelCostCalculator() {
  const tool = getToolBySlug('fuel-cost-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const d = parseFloat(distance);
    const m = parseFloat(mileage);
    const f = parseFloat(fuelPrice);

    if (!d || !m || !f || d < 0 || m <= 0 || f < 0) {
      setError('Please enter valid numbers (distance >= 0, mileage > 0, price >= 0)');
      setResult(null);
      return;
    }

    setError('');
    const cost = calculateFuelCost(d, m, f);
    setResult(cost);
    trackToolCalculate('fuel-cost-calculator');
  };

  const handleReset = () => {
    setDistance('');
    setMileage('');
    setFuelPrice('');
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toFixed(2));
      trackCopyClick('fuel-cost-calculator');
    }
  };

  const liters = distance && mileage ? (parseFloat(distance) / parseFloat(mileage)).toFixed(2) : null;

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Distance (km)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="500"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuel Mileage (km/liter)
            </label>
            <input
              type="number"
              step="0.5"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="15"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuel Price (per liter)
            </label>
            <input
              type="number"
              step="0.01"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              placeholder="1.50"
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
        <div className="space-y-4 animate-slideIn">
          {liters && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Fuel Required</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(parseFloat(liters))} liters
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Fuel Cost</p>
            <p className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-4">
              ${formatNumber(result)}
            </p>
            <button
              onClick={handleCopy}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Calculate Your Fuel Costs</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Whether you're planning a road trip or calculating daily commute costs, this calculator helps you estimate fuel expenses based on distance, vehicle mileage, and current fuel prices.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter the total distance you plan to travel</li>
            <li>Enter your vehicle's fuel mileage (km per liter)</li>
            <li>Enter the current fuel price per liter</li>
            <li>Click Calculate to see total cost</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips to Improve Fuel Efficiency</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Maintain proper tire pressure</li>
            <li>Regular engine maintenance and tune-ups</li>
            <li>Remove unnecessary weight from your vehicle</li>
            <li>Drive at steady speeds on highways</li>
            <li>Avoid excessive idling</li>
            <li>Plan efficient routes</li>
            <li>Use cruise control on long drives</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Average Vehicle Mileage</h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Compact Cars</span>
              <span>16-20 km/liter</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Sedans</span>
              <span>12-16 km/liter</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>SUVs</span>
              <span>8-12 km/liter</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Hybrid Vehicles</span>
              <span>18-25 km/liter</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
