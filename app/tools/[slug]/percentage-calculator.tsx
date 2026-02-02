"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import {
  calculatePercentage,
  calculatePercentOf,
  calculatePercentageIncrease,
  calculatePercentageDecrease,
  formatNumber,
} from "@/lib/utils";
import { trackToolCalculate } from "@/lib/analytics";

export default function PercentageCalculator() {
  const tool = getToolBySlug("percentage-calculator");
  const [mode, setMode] = useState<"percent-of" | "increase" | "decrease" | "value">("percent-of");
  const [value1, setValue1] = useState<string>("100");
  const [value2, setValue2] = useState<string>("20");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>("");

  if (!tool) return <div>Tool not found</div>;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (isNaN(v1) || isNaN(v2)) {
      setError("Please enter valid numbers");
      return;
    }

    if (v1 <= 0 || v2 < 0) {
      setError("Please enter positive numbers");
      return;
    }

    let res = 0;
    switch (mode) {
      case "percent-of":
        res = calculatePercentOf(v1, v2);
        break;
      case "increase":
        res = calculatePercentageIncrease(v1, v2);
        break;
      case "decrease":
        res = calculatePercentageDecrease(v1, v2);
        break;
      case "value":
        res = calculatePercentage(v1, v2);
        break;
    }
    setResult(res);
    trackToolCalculate("percentage-calculator");
  };

  const handleReset = () => {
    setValue1("100");
    setValue2("20");
    setResult(null);
    setMode("percent-of");
    setError("");
  };

  const getLabel = () => {
    switch (mode) {
      case "percent-of":
        return "What percent is value 1 of value 2?";
      case "increase":
        return "What is the percent increase?";
      case "decrease":
        return "What is the percent decrease?";
      case "value":
        return "What is the value of the percentage?";
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Calculate Percentage</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Calculation Type
              </label>
              <div className="space-y-2">
                {["percent-of", "value", "increase", "decrease"].map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <input
                      type="radio"
                      value={m}
                      checked={mode === m}
                      onChange={(e) => setMode(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700">
                      {m === "percent-of" && "What % is X of Y?"}
                      {m === "value" && "Find % of value"}
                      {m === "increase" && "% increase"}
                      {m === "decrease" && "% decrease"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {mode === "percent-of" && "Value 1"}
                {mode === "value" && "Number"}
                {mode === "increase" && "Original"}
                {mode === "decrease" && "Original"}
              </label>
              <input
                type="number"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {mode === "percent-of" && "Value 2"}
                {mode === "value" && "Percentage (%)"}
                {mode === "increase" && "New Value"}
                {mode === "decrease" && "New Value"}
              </label>
              <input
                type="number"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

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
          {result !== null ? (
            <div className="space-y-4 result-reveal">
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">{getLabel()}</p>
                <p className="text-4xl font-bold text-teal-600">
                  {formatNumber(result, 2)}%
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p><strong>Result:</strong> {formatNumber(result, 2)}%</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Enter values and click "Calculate" to see result</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Select the calculation type (percent of value, increase, or decrease)</li>
          <li>Enter your values</li>
          <li>Click "Calculate" for instant results</li>
          <li>Use for shopping discounts, statistics, growth rates, and more</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
