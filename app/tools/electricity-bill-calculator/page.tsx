'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateElectricityBill, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function ElectricityBillCalculator() {
  const tool = getToolBySlug('electricity-bill-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [powerWatts, setPowerWatts] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [daysPerMonth, setDaysPerMonth] = useState('30');
  const [ratePerKwh, setRatePerKwh] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const p = parseFloat(powerWatts);
    const h = parseFloat(hoursPerDay);
    const d = parseFloat(daysPerMonth);
    const r = parseFloat(ratePerKwh);

    if (!p || !h || !d || !r || p <= 0 || h < 0 || d <= 0 || r < 0) {
      setError('Please enter valid numbers');
      setResult(null);
      return;
    }

    setError('');
    const bill = calculateElectricityBill(p, h, d, r);
    setResult(bill);
    trackToolCalculate('electricity-bill-calculator');
  };

  const handleReset = () => {
    setPowerWatts('');
    setHoursPerDay('');
    setDaysPerMonth('30');
    setRatePerKwh('');
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(result.toFixed(2));
      trackCopyClick('electricity-bill-calculator');
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Power Consumption (Watts)
            </label>
            <input
              type="number"
              value={powerWatts}
              onChange={(e) => setPowerWatts(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hours Per Day
            </label>
            <input
              type="number"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(e.target.value)}
              placeholder="8"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Days Per Month
            </label>
            <input
              type="number"
              value={daysPerMonth}
              onChange={(e) => setDaysPerMonth(e.target.value)}
              placeholder="30"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate Per kWh ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={ratePerKwh}
              onChange={(e) => setRatePerKwh(e.target.value)}
              placeholder="0.12"
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
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Electricity Bill</p>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-4">
              ${formatNumber(result)}
            </p>
            <button
              onClick={handleCopy}
              className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Electricity Bills</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Your electricity bill is calculated based on kilowatt-hours (kWh) consumed. This calculator helps you estimate costs for specific appliances and usage patterns.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Typical Appliance Wattages</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>LED Light Bulb</span>
              <span>10-15W</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Ceiling Fan</span>
              <span>50-80W</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Washing Machine</span>
              <span>400-1500W</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Refrigerator</span>
              <span>150-600W</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Air Conditioner</span>
              <span>1000-3500W</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips to Reduce Electricity Bill</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Switch to LED bulbs - use 75% less energy</li>
            <li>Use ceiling fans instead of AC when possible</li>
            <li>Unplug devices when not in use</li>
            <li>Maintain AC filters regularly</li>
            <li>Use power strips to reduce phantom loads</li>
            <li>Adjust thermostat settings seasonally</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
