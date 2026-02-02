"use client";

import { useState } from "react";
import { generateMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { calculateEMI, formatNumber } from "@/lib/utils";

export default function EMICalculator() {
  const tool = getToolBySlug("emi-calculator");
  const [principal, setPrincipal] = useState<string>("500000");
  const [rate, setRate] = useState<string>("8.5");
  const [years, setYears] = useState<string>("20");
  const [result, setResult] = useState<{
    monthlyEMI: number;
    totalInterest: number;
    totalPayable: number;
  } | null>(null);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);

    if (p > 0 && r >= 0 && y > 0) {
      const emiResult = calculateEMI(p, r, y);
      setResult(emiResult);
    }
  };

  const handleReset = () => {
    setPrincipal("500000");
    setRate("8.5");
    setYears("20");
    setResult(null);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Calculate Your EMI
          </h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Amount ($)
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                placeholder="Enter loan amount"
              />
              <input
                type="range"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                min="0"
                max="10000000"
                step="10000"
                className="w-full mt-2 accent-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                placeholder="Enter interest rate"
              />
              <input
                type="range"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="0"
                max="30"
                step="0.1"
                className="w-full mt-2 accent-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Tenure (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                min="0.5"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                placeholder="Enter tenure in years"
              />
              <input
                type="range"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                min="0.5"
                max="40"
                step="0.5"
                className="w-full mt-2 accent-teal-600"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Calculate EMI
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        <div>
          {result ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Monthly EMI
                </p>
                <p className="text-4xl font-bold text-teal-600">
                  $ {formatNumber(result.monthlyEMI, 2)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Interest
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    $ {formatNumber(result.totalInterest, 2)}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Payable
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $ {formatNumber(result.totalPayable, 2)}
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-green-900">
                  <strong>💡 Tip:</strong> Adjust the sliders above to see how
                  different loan amounts, interest rates, or tenures affect your
                  monthly payment.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                Enter your loan details and click "Calculate EMI" to see results
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How to Use Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Enter your loan amount in rupees</li>
          <li>Input the annual interest rate offered by your bank</li>
          <li>Specify the loan tenure in years</li>
          <li>Click "Calculate EMI" to see your monthly payment</li>
          <li>Use the sliders to adjust values and see instant updates</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
