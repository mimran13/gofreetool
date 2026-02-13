'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function MortgageCalculator() {
  const tool = getToolBySlug('mortgage-calculator');
  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const results = useMemo(() => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return {
        monthlyPayment: principal / numberOfPayments,
        totalPayment: principal,
        totalInterest: 0,
        principal,
      };
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal,
    };
  }, [homePrice, downPayment, interestRate, loanTerm]);

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
          Calculate your <strong>monthly mortgage payment</strong>, total interest, and see the full cost of your home loan.
          Compare different down payments, interest rates, and loan terms.
          <strong> All calculations happen in your browser</strong> — your financial data stays private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Home Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Down Payment ({((downPayment / homePrice) * 100).toFixed(0)}%)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
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
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Loan Term
            </label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              <option value={30}>30 years</option>
              <option value={20}>20 years</option>
              <option value={15}>15 years</option>
              <option value={10}>10 years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {formatCurrency(results.monthlyPayment)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(results.principal)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(results.totalInterest)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Interest</div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(results.totalPayment)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Mortgage Tips</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• A 20% down payment avoids Private Mortgage Insurance (PMI)</li>
          <li>• 15-year loans have higher payments but save significantly on interest</li>
          <li>• Your total monthly housing cost should be under 28% of gross income</li>
          <li>• Consider additional costs: property tax, insurance, HOA fees</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Enter the home purchase price</li>
          <li>Set your down payment amount</li>
          <li>Input the expected interest rate</li>
          <li>Choose your loan term (15 or 30 years)</li>
          <li>See your monthly payment and total costs instantly</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
