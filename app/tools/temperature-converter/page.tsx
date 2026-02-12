'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

type Unit = 'celsius' | 'fahrenheit' | 'kelvin';

const unitNames: Record<Unit, string> = {
  celsius: 'Celsius (°C)',
  fahrenheit: 'Fahrenheit (°F)',
  kelvin: 'Kelvin (K)',
};

export default function TemperatureConverter() {
  const tool = getToolBySlug('temperature-converter');
  const [value, setValue] = useState('0');
  const [fromUnit, setFromUnit] = useState<Unit>('celsius');

  const conversions = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return null;

    let celsius: number;
    switch (fromUnit) {
      case 'celsius':
        celsius = num;
        break;
      case 'fahrenheit':
        celsius = (num - 32) * 5 / 9;
        break;
      case 'kelvin':
        celsius = num - 273.15;
        break;
    }

    return {
      celsius: celsius,
      fahrenheit: (celsius * 9 / 5) + 32,
      kelvin: celsius + 273.15,
    };
  }, [value, fromUnit]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert temperatures between <strong>Celsius</strong>, <strong>Fahrenheit</strong>, and <strong>Kelvin</strong> instantly.
          See all conversions at once with accurate calculations.
          <strong> All processing happens in your browser</strong> — no data is sent to any server.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter Temperature</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 px-4 py-3 text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              placeholder="0"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value as Unit)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              {(Object.keys(unitNames) as Unit[]).map(unit => (
                <option key={unit} value={unit}>{unitNames[unit]}</option>
              ))}
            </select>
          </div>
        </div>

        {conversions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-6 rounded-xl text-center ${fromUnit === 'celsius' ? 'bg-teal-100 dark:bg-teal-900/30 ring-2 ring-teal-500' : 'bg-gray-50 dark:bg-gray-900'}`}>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(conversions.celsius)}°C
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Celsius</div>
            </div>
            <div className={`p-6 rounded-xl text-center ${fromUnit === 'fahrenheit' ? 'bg-teal-100 dark:bg-teal-900/30 ring-2 ring-teal-500' : 'bg-gray-50 dark:bg-gray-900'}`}>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(conversions.fahrenheit)}°F
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Fahrenheit</div>
            </div>
            <div className={`p-6 rounded-xl text-center ${fromUnit === 'kelvin' ? 'bg-teal-100 dark:bg-teal-900/30 ring-2 ring-teal-500' : 'bg-gray-50 dark:bg-gray-900'}`}>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {formatNumber(conversions.kelvin)} K
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Kelvin</div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Reference Temperatures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-400">
          <ul className="space-y-1">
            <li>• Water freezes: 0°C = 32°F = 273.15K</li>
            <li>• Water boils: 100°C = 212°F = 373.15K</li>
            <li>• Body temperature: 37°C = 98.6°F</li>
          </ul>
          <ul className="space-y-1">
            <li>• Room temperature: 20-22°C = 68-72°F</li>
            <li>• Absolute zero: -273.15°C = -459.67°F = 0K</li>
          </ul>
        </div>
      </div>

      <div className="mb-12 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Conversion Formulas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono text-gray-600 dark:text-gray-400">
          <div>
            <p>°F = (°C × 9/5) + 32</p>
            <p>°C = (°F - 32) × 5/9</p>
          </div>
          <div>
            <p>K = °C + 273.15</p>
            <p>°C = K - 273.15</p>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter a temperature value</li>
          <li>Select the unit of your input (Celsius, Fahrenheit, or Kelvin)</li>
          <li>See all conversions instantly displayed</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
