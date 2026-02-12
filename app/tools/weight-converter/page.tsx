'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const units = [
  { id: 'kilogram', name: 'Kilograms (kg)', factor: 1 },
  { id: 'gram', name: 'Grams (g)', factor: 0.001 },
  { id: 'milligram', name: 'Milligrams (mg)', factor: 0.000001 },
  { id: 'pound', name: 'Pounds (lb)', factor: 0.453592 },
  { id: 'ounce', name: 'Ounces (oz)', factor: 0.0283495 },
  { id: 'stone', name: 'Stones (st)', factor: 6.35029 },
  { id: 'metric-ton', name: 'Metric Tons (t)', factor: 1000 },
  { id: 'short-ton', name: 'Short Tons (US)', factor: 907.185 },
  { id: 'long-ton', name: 'Long Tons (UK)', factor: 1016.05 },
  { id: 'microgram', name: 'Micrograms (μg)', factor: 0.000000001 },
];

export default function WeightConverter() {
  const tool = getToolBySlug('weight-converter');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('kilogram');
  const [toUnit, setToUnit] = useState('pound');

  const convert = useCallback((val: number, from: string, to: string): number => {
    const fromFactor = units.find(u => u.id === from)?.factor || 1;
    const toFactor = units.find(u => u.id === to)?.factor || 1;
    return (val * fromFactor) / toFactor;
  }, []);

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return convert(num, fromUnit, toUnit);
  }, [value, fromUnit, toUnit, convert]);

  const allConversions = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return [];
    return units.map(unit => ({
      ...unit,
      value: convert(num, fromUnit, unit.id),
    }));
  }, [value, fromUnit, convert]);

  const swapUnits = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999999) {
      return num.toExponential(6);
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert between different <strong>weight and mass units</strong> instantly.
          Supports metric (kilograms, grams) and imperial (pounds, ounces, stones) units.
          <strong> All calculations happen in your browser</strong> — no data is sent to any server.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              placeholder="Enter value"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapUnits}
            className="p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors self-center"
            title="Swap units"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label>
            <div className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
              {result !== '' ? formatNumber(result as number) : '—'}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              {units.map(unit => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
          </div>
        </div>

        {value && !isNaN(parseFloat(value)) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">All Conversions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {allConversions.map(conv => (
                <div key={conv.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{conv.name}</div>
                  <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {formatNumber(conv.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Common Conversions</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• 1 kilogram = 2.205 pounds</li>
          <li>• 1 pound = 453.6 grams = 16 ounces</li>
          <li>• 1 stone = 14 pounds = 6.35 kg</li>
          <li>• 1 ounce = 28.35 grams</li>
          <li>• 1 metric ton = 1,000 kg = 2,205 lbs</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter a numeric value in the input field</li>
          <li>Select the unit you&apos;re converting from</li>
          <li>Select the unit you&apos;re converting to</li>
          <li>See instant results and all other unit conversions</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
