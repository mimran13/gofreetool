"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { formatNumber } from "@/lib/utils";

export default function SplitBillCalculator() {
  const tool = getToolBySlug("split-bill-calculator");
  const [billAmount, setBillAmount] = useState<string>("100");
  const [peopleCount, setPeopleCount] = useState<string>("2");
  const [tipPercent, setTipPercent] = useState<string>("15");
  const [includeTax, setIncludeTax] = useState(false);
  const [taxPercent, setTaxPercent] = useState<string>("8");
  const [result, setResult] = useState<{
    subtotal: number;
    taxAmount: number;
    tipAmount: number;
    total: number;
    perPerson: number;
  } | null>(null);

  if (!tool) return <div>Tool not found</div>;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const bill = parseFloat(billAmount);
    const people = parseInt(peopleCount);
    const tip = parseFloat(tipPercent);
    const tax = includeTax ? parseFloat(taxPercent) : 0;

    if (bill > 0 && people > 0) {
      let subtotal = bill;
      let taxAmount = 0;

      if (includeTax) {
        taxAmount = (subtotal * tax) / 100;
        subtotal += taxAmount;
      }

      const tipAmount = (subtotal * tip) / 100;
      const total = subtotal + tipAmount;
      const perPerson = total / people;

      setResult({ subtotal: bill, taxAmount, tipAmount, total, perPerson });
    }
  };

  const handleReset = () => {
    setBillAmount("100");
    setPeopleCount("2");
    setTipPercent("15");
    setIncludeTax(false);
    setTaxPercent("8");
    setResult(null);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Split The Bill</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bill Amount ($)
              </label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of People
              </label>
              <input
                type="number"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                min="1"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tip (%)
              </label>
              <input
                type="number"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
                min="0"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTax}
                  onChange={(e) => setIncludeTax(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">Include Tax</span>
              </label>
              {includeTax && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        <div>
          {result ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">Per Person</p>
                <p className="text-4xl font-bold text-teal-600">
                  $ {formatNumber(result.perPerson, 2)}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-white border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">$ {formatNumber(result.subtotal, 2)}</span>
                </div>
                {result.taxAmount > 0 && (
                  <div className="flex justify-between bg-white border border-gray-200 rounded-lg p-3">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-semibold">$ {formatNumber(result.taxAmount, 2)}</span>
                  </div>
                )}
                <div className="flex justify-between bg-white border border-gray-200 rounded-lg p-3">
                  <span className="text-gray-600">Tip:</span>
                  <span className="font-semibold">$ {formatNumber(result.tipAmount, 2)}</span>
                </div>
                <div className="flex justify-between bg-teal-50 border border-teal-200 rounded-lg p-3 font-bold">
                  <span>Total:</span>
                  <span>$ {formatNumber(result.total, 2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Enter bill details to calculate split</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Enter the total bill amount</li>
          <li>Specify how many people are splitting</li>
          <li>Add tip percentage (optional)</li>
          <li>Include tax if needed (optional)</li>
          <li>Click "Calculate" to see per-person cost</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
