"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { calculateAge } from "@/lib/utils";

export default function AgeCalculator() {
  const tool = getToolBySlug("age-calculator");
  const [birthDate, setBirthDate] = useState<string>("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
  } | null>(null);

  if (!tool) return <div>Tool not found</div>;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth >= today) {
      alert("Birth date must be in the past");
      return;
    }

    const age = calculateAge(birth);
    setResult(age);
  };

  const handleReset = () => {
    setBirthDate("");
    setResult(null);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Calculate Your Age</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Calculate Age
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">Your Age</p>
                <div className="space-y-2">
                  <p className="text-4xl font-bold text-purple-600">
                    {result.years} <span className="text-lg">years</span>
                  </p>
                  <p className="text-lg text-pink-600 font-semibold">
                    {result.months} months, {result.days} days
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">Years</p>
                  <p className="text-2xl font-bold text-purple-600">{result.years}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">Months</p>
                  <p className="text-2xl font-bold text-pink-600">{result.months}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">Days</p>
                  <p className="text-2xl font-bold text-rose-600">{result.days}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Select your birth date to calculate your exact age</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Select your birth date using the date picker</li>
          <li>Click "Calculate Age"</li>
          <li>See your exact age in years, months, and days</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
