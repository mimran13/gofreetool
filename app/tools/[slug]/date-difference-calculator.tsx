"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { calculateDateDifference, formatNumber } from "@/lib/utils";

export default function DateDifferenceCalculator() {
  const tool = getToolBySlug("date-difference-calculator");
  const [date1, setDate1] = useState<string>("");
  const [date2, setDate2] = useState<string>("");
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
  } | null>(null);

  if (!tool) return <div>Tool not found</div>;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date1 || !date2) {
      alert("Please select both dates");
      return;
    }

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const diff = calculateDateDifference(d1, d2);
    setResult(diff);
  };

  const handleReset = () => {
    setDate1("");
    setDate2("");
    setResult(null);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Days Between Dates
          </h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
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
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Days</p>
                <p className="text-4xl font-bold text-indigo-600">
                  {result.days}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium mb-1">Weeks</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.weeks}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium mb-1">Months</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {result.months}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-xs font-medium mb-1">Approximate Years</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(result.years, 1)}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Select two dates to calculate the difference</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Select your start date</li>
          <li>Select your end date</li>
          <li>Click "Calculate" to see the difference</li>
          <li>View results in days, weeks, months, and years</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
