'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function LoanPayoffCalculator() {
  const tool = getToolBySlug('loan-payoff-calculator');
  const [balance, setBalance] = useState(25000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [monthlyPayment, setMonthlyPayment] = useState(500);
  const [extraPayment, setExtraPayment] = useState(100);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;

    // Calculate without extra payments
    let balanceNormal = balance;
    let monthsNormal = 0;
    let interestNormal = 0;

    while (balanceNormal > 0 && monthsNormal < 600) {
      const interest = balanceNormal * monthlyRate;
      interestNormal += interest;
      const principal = Math.min(monthlyPayment - interest, balanceNormal);
      if (principal <= 0) break;
      balanceNormal -= principal;
      monthsNormal++;
    }

    // Calculate with extra payments
    let balanceExtra = balance;
    let monthsExtra = 0;
    let interestExtra = 0;
    const totalPayment = monthlyPayment + extraPayment;

    while (balanceExtra > 0 && monthsExtra < 600) {
      const interest = balanceExtra * monthlyRate;
      interestExtra += interest;
      const principal = Math.min(totalPayment - interest, balanceExtra);
      if (principal <= 0) break;
      balanceExtra -= principal;
      monthsExtra++;
    }

    return {
      normal: {
        months: monthsNormal,
        years: Math.floor(monthsNormal / 12),
        remainingMonths: monthsNormal % 12,
        totalInterest: interestNormal,
        totalPaid: balance + interestNormal,
      },
      withExtra: {
        months: monthsExtra,
        years: Math.floor(monthsExtra / 12),
        remainingMonths: monthsExtra % 12,
        totalInterest: interestExtra,
        totalPaid: balance + interestExtra,
      },
      savings: {
        months: monthsNormal - monthsExtra,
        interest: interestNormal - interestExtra,
      },
    };
  }, [balance, interestRate, monthlyPayment, extraPayment]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          See how <strong>extra payments</strong> can reduce your loan payoff time and save
          thousands in interest. Compare your current plan vs. accelerated payoff.
          <strong> All calculations happen in your browser</strong> — your data stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Balance
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Monthly Payment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Extra Monthly Payment
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-sm text-gray-500 mb-2">Without Extra Payments</h4>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {results.normal.years}y {results.normal.remainingMonths}m
            </div>
            <div className="text-sm text-gray-500">
              Interest: {formatCurrency(results.normal.totalInterest)}
            </div>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <h4 className="text-sm text-gray-500 mb-2">With Extra Payments</h4>
            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              {results.withExtra.years}y {results.withExtra.remainingMonths}m
            </div>
            <div className="text-sm text-gray-500">
              Interest: {formatCurrency(results.withExtra.totalInterest)}
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="text-sm text-gray-500 mb-2">You Save</h4>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(results.savings.interest)}
            </div>
            <div className="text-sm text-gray-500">
              {results.savings.months} months earlier
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Try extra:</span>
          {[50, 100, 200, 500].map((amount) => (
            <button
              key={amount}
              onClick={() => setExtraPayment(amount)}
              className={`px-3 py-1 text-sm rounded ${extraPayment === amount ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              ${amount}/mo
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Why Extra Payments Help</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Extra payments go directly to principal, reducing future interest</li>
          <li>• Even small amounts add up significantly over time</li>
          <li>• $100/month extra can save years on a mortgage</li>
          <li>• Pay bi-weekly instead of monthly for an extra payment per year</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter your current loan balance</li>
          <li>Input your interest rate</li>
          <li>Enter your current monthly payment</li>
          <li>Set an extra payment amount to see the impact</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
