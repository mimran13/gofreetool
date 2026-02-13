'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

type InputType = 'hourly' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annual';

export default function SalaryCalculator() {
  const tool = getToolBySlug('salary-calculator');
  const [amount, setAmount] = useState(50000);
  const [inputType, setInputType] = useState<InputType>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const results = useMemo(() => {
    const hoursPerYear = hoursPerWeek * weeksPerYear;
    let annual: number;

    switch (inputType) {
      case 'hourly':
        annual = amount * hoursPerYear;
        break;
      case 'daily':
        annual = amount * (hoursPerYear / (hoursPerWeek / 5));
        break;
      case 'weekly':
        annual = amount * weeksPerYear;
        break;
      case 'biweekly':
        annual = amount * (weeksPerYear / 2);
        break;
      case 'monthly':
        annual = amount * 12;
        break;
      case 'annual':
      default:
        annual = amount;
    }

    return {
      hourly: annual / hoursPerYear,
      daily: annual / (weeksPerYear * 5),
      weekly: annual / weeksPerYear,
      biweekly: annual / (weeksPerYear / 2),
      monthly: annual / 12,
      annual: annual,
    };
  }, [amount, inputType, hoursPerWeek, weeksPerYear]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const inputTypes: { id: InputType; label: string }[] = [
    { id: 'hourly', label: 'Hourly' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Bi-Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'annual', label: 'Annual' },
  ];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert between <strong>hourly, daily, weekly, bi-weekly, monthly, and annual salary</strong>.
          Calculate equivalent wages across different pay periods.
          <strong> All calculations happen in your browser</strong> — your salary information stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter Salary Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pay Period
            </label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as InputType)}
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              {inputTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hours per Week
            </label>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weeks per Year
            </label>
            <input
              type="number"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Equivalent Salary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(results).map(([period, value]) => (
            <div
              key={period}
              className={`p-4 rounded-lg text-center ${
                period === inputType
                  ? 'bg-teal-100 dark:bg-teal-900/30 ring-2 ring-teal-500'
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(value)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{period}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quick Reference</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Annual = Hourly × Hours/Week × Weeks/Year</li>
          <li>• Monthly = Annual ÷ 12</li>
          <li>• Bi-Weekly = Annual ÷ 26 (26 pay periods)</li>
          <li>• Weekly = Annual ÷ 52</li>
          <li>• Adjust weeks/year for unpaid vacation time</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter your salary amount</li>
          <li>Select the pay period (hourly, weekly, annual, etc.)</li>
          <li>Adjust hours per week and weeks per year if needed</li>
          <li>See equivalent salary across all pay periods</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
