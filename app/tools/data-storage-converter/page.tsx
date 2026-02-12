'use client';

import { useState, useCallback, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const binaryUnits = [
  { id: 'byte', name: 'Bytes (B)', factor: 1 },
  { id: 'kibibyte', name: 'Kibibytes (KiB)', factor: 1024 },
  { id: 'mebibyte', name: 'Mebibytes (MiB)', factor: 1024 ** 2 },
  { id: 'gibibyte', name: 'Gibibytes (GiB)', factor: 1024 ** 3 },
  { id: 'tebibyte', name: 'Tebibytes (TiB)', factor: 1024 ** 4 },
  { id: 'pebibyte', name: 'Pebibytes (PiB)', factor: 1024 ** 5 },
];

const decimalUnits = [
  { id: 'byte-d', name: 'Bytes (B)', factor: 1 },
  { id: 'kilobyte', name: 'Kilobytes (KB)', factor: 1000 },
  { id: 'megabyte', name: 'Megabytes (MB)', factor: 1000 ** 2 },
  { id: 'gigabyte', name: 'Gigabytes (GB)', factor: 1000 ** 3 },
  { id: 'terabyte', name: 'Terabytes (TB)', factor: 1000 ** 4 },
  { id: 'petabyte', name: 'Petabytes (PB)', factor: 1000 ** 5 },
];

const bitUnits = [
  { id: 'bit', name: 'Bits (b)', factor: 0.125 },
  { id: 'kilobit', name: 'Kilobits (Kb)', factor: 125 },
  { id: 'megabit', name: 'Megabits (Mb)', factor: 125000 },
  { id: 'gigabit', name: 'Gigabits (Gb)', factor: 125000000 },
];

export default function DataStorageConverter() {
  const tool = getToolBySlug('data-storage-converter');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('gigabyte');
  const [standard, setStandard] = useState<'decimal' | 'binary'>('decimal');

  const allUnits = [...(standard === 'decimal' ? decimalUnits : binaryUnits), ...bitUnits];

  const convert = useCallback((val: number, from: string, to: string): number => {
    const units = [...decimalUnits, ...binaryUnits, ...bitUnits];
    const fromFactor = units.find(u => u.id === from)?.factor || 1;
    const toFactor = units.find(u => u.id === to)?.factor || 1;
    return (val * fromFactor) / toFactor;
  }, []);

  const conversions = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return { decimal: [], binary: [], bits: [] };

    const bytes = convert(num, fromUnit, 'byte-d');

    return {
      decimal: decimalUnits.map(u => ({ ...u, value: bytes / u.factor })),
      binary: binaryUnits.map(u => ({ ...u, value: bytes / u.factor })),
      bits: bitUnits.map(u => ({ ...u, value: bytes / u.factor })),
    };
  }, [value, fromUnit, convert]);

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) < 0.001 || Math.abs(num) > 999999999999) {
      return num.toExponential(4);
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert between <strong>data storage units</strong> including bytes, kilobytes, megabytes, gigabytes, and terabytes.
          Supports both <strong>decimal (1000)</strong> and <strong>binary (1024)</strong> standards.
          <strong> All calculations happen in your browser</strong> — no data is sent to any server.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setStandard('decimal')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${standard === 'decimal' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Decimal (1000)
          </button>
          <button
            onClick={() => setStandard('binary')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${standard === 'binary' ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            Binary (1024)
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            placeholder="Enter value"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          >
            {allUnits.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>
        </div>

        {value && !isNaN(parseFloat(value)) && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Decimal (SI) Units</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {conversions.decimal.map(conv => (
                  <div key={conv.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{conv.name}</div>
                    <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {formatNumber(conv.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Binary (IEC) Units</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {conversions.binary.map(conv => (
                  <div key={conv.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{conv.name}</div>
                    <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {formatNumber(conv.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bit Units</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {conversions.bits.map(conv => (
                  <div key={conv.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{conv.name}</div>
                    <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {formatNumber(conv.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-12 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Decimal vs Binary</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          <strong>Decimal (SI):</strong> Used by storage manufacturers. 1 KB = 1,000 bytes.<br />
          <strong>Binary (IEC):</strong> Used by operating systems. 1 KiB = 1,024 bytes.<br />
          This is why a &quot;500 GB&quot; drive shows as ~465 GiB in your OS.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Choose decimal (1000) or binary (1024) standard</li>
          <li>Enter a value and select its unit</li>
          <li>See all conversions instantly in both standards</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
