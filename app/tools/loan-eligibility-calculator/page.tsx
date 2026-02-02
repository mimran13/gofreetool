'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import { formatNumber } from '@/lib/utils';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function LoanEligibilityCalculator() {
  const tool = getToolBySlug('loan-eligibility-calculator');
  if (!tool) return <div>Tool not found</div>;
  const [income, setIncome] = useState('');
  const [existingDebt, setExistingDebt] = useState('0');
  const [creditScore, setCreditScore] = useState('');
  const [result, setResult] = useState<{ maxLoan: number; recommendation: string } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const inc = parseFloat(income);
    const debt = parseFloat(existingDebt);
    const score = parseFloat(creditScore);

    if (!inc || inc <= 0 || debt < 0 || !score || score < 300 || score > 850) {
      setError('Please enter valid numbers (Income > 0, Debt >= 0, Credit Score 300-850)');
      setResult(null);
      return;
    }

    setError('');

    // Simplified calculation: typically lenders allow 28/36 rule
    // 28% of gross income for housing, 36% for total debt
    const maxDebtPayment = (inc * 0.36) / 12; // Monthly
    const maxLoan = (maxDebtPayment * 360) / 12; // Assuming 30-year loan
    const adjustedLoan = maxLoan * (1 - debt / inc / 10);

    let recommendation = 'Standard approval';
    if (score < 580) {
      recommendation = 'Poor credit - May need co-signer or higher interest rate';
    } else if (score < 670) {
      recommendation = 'Fair credit - May qualify with higher interest rate';
    } else if (score < 740) {
      recommendation = 'Good credit - Standard approval likely';
    } else {
      recommendation = 'Excellent credit - Best rates available';
    }

    setResult({ maxLoan: Math.max(adjustedLoan, 0), recommendation });
    trackToolCalculate('loan-eligibility-calculator');
  };

  const handleReset = () => {
    setIncome('');
    setExistingDebt('0');
    setCreditScore('');
    setResult(null);
    setError('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    trackCopyClick('loan-eligibility-calculator');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Annual Income ($)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="75000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Existing Monthly Debt ($)
            </label>
            <input
              type="number"
              value={existingDebt}
              onChange={(e) => setExistingDebt(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credit Score
            </label>
            <input
              type="number"
              value={creditScore}
              onChange={(e) => setCreditScore(e.target.value)}
              placeholder="700"
              min="300"
              max="850"
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
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estimated Maximum Loan Amount</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              ${formatNumber(result.maxLoan)}
            </p>
            <button
              onClick={() => handleCopy(result.maxLoan.toFixed(0))}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Copy Value
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Loan Recommendation</p>
            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {result.recommendation}
            </p>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Understanding Loan Eligibility</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Lenders use the 28/36 rule to determine loan eligibility: You should spend no more than 28% of gross income on housing and no more than 36% on total debt obligations.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Credit Score Ranges</h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>300-579: Poor Credit</span>
              <span>May face challenges getting approved</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>580-669: Fair Credit</span>
              <span>Higher interest rates likely</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>670-739: Good Credit</span>
              <span>Standard rates available</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded">
              <span>740-850: Excellent Credit</span>
              <span>Best rates available</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tips for Better Loan Approval</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Improve your credit score before applying</li>
            <li>Reduce existing debt obligations</li>
            <li>Provide a stable income history</li>
            <li>Consider a co-signer if needed</li>
            <li>Save for a larger down payment</li>
            <li>Compare rates from multiple lenders</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is this calculation accurate?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                This is an estimate based on standard lending criteria. Actual approval depends on many factors including employment history, assets, and specific lender policies. Consult with a lender for accurate information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
