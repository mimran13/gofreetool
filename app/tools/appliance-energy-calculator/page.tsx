'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { calculateApplianceEnergy, formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function ApplianceEnergyCalculator() {
  const tool = getToolBySlug('appliance-energy-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [wattage, setWattage] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [daysPerYear, setDaysPerYear] = useState('365');
  const [ratePerKwh, setRatePerKwh] = useState('');
  const [result, setResult] = useState<{ yearlyConsumption: number; yearlyBill: number } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const w = parseFloat(wattage);
    const h = parseFloat(hoursPerDay);
    const d = parseFloat(daysPerYear);
    const r = parseFloat(ratePerKwh);

    if (!w || !h || !d || !r || w <= 0 || h < 0 || d <= 0 || r < 0) {
      setError('Please enter valid numbers');
      setResult(null);
      return;
    }

    setError('');
    const yearlyConsumption = (w * h * d) / 1000;
    const yearlyBill = yearlyConsumption * r;
    setResult({ yearlyConsumption, yearlyBill });
    trackToolCalculate('appliance-energy-calculator');
  };

  const handleReset = () => {
    setWattage('');
    setHoursPerDay('');
    setDaysPerYear('365');
    setRatePerKwh('');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('appliance-energy-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Appliance Wattage (W)
            </label>
            <input
              type="number"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              placeholder="1500"
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
              placeholder="4"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Days Per Year
            </label>
            <input
              type="number"
              value={daysPerYear}
              onChange={(e) => setDaysPerYear(e.target.value)}
              placeholder="365"
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

      {result && (
        <div className="space-y-4 animate-slideIn">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Yearly Energy Consumption</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              {formatNumber(result.yearlyConsumption)} kWh
            </p>
            <button
              onClick={() => handleCopy(result.yearlyConsumption.toFixed(2))}
              className="text-sm text-green-600 dark:text-green-400 hover:underline"
            >
              Copy Value
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Yearly Energy Cost</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ${formatNumber(result.yearlyBill)}
            </p>
            <button
              onClick={() => handleCopy(result.yearlyBill.toFixed(2))}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy Value
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understand Your Appliance Costs</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Different appliances consume different amounts of energy. This calculator helps you understand the annual cost of running any appliance, enabling you to make energy-efficient choices.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Appliance Costs (Annual Estimate)</h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Refrigerator (24/7)</span>
              <span>~$150-300/year</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Washing Machine (3x/week)</span>
              <span>~$50-100/year</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Water Heater</span>
              <span>~$150-300/year</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>Air Conditioner (4 hrs/day)</span>
              <span>~$500-1000/year</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Energy-Saving Tips</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Choose ENERGY STAR certified appliances</li>
            <li>Regular maintenance keeps appliances efficient</li>
            <li>Newer appliances are typically more efficient</li>
            <li>Unplug devices to avoid phantom loads</li>
            <li>Use timers and smart plugs for automation</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
