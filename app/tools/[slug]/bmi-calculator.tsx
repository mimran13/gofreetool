"use client";

import { useState } from "react";
import { generateMetadata } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { calculateBMI, formatNumber } from "@/lib/utils";

export default function BMICalculator() {
  const tool = getToolBySlug("bmi-calculator");
  const [height, setHeight] = useState<string>("170");
  const [weight, setWeight] = useState<string>("70");
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    categoryColor: string;
  } | null>(null);

  if (!tool) {
    return <div>Tool not found</div>;
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {
      const bmiResult = calculateBMI(h, w);
      setResult(bmiResult);
    }
  };

  const handleReset = () => {
    setHeight("170");
    setWeight("70");
    setResult(null);
  };

  return (
    <ToolLayout
      tool={tool}
      disclaimer="This tool is for informational purposes only and not medical advice. Consult a healthcare professional for personalized guidance."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Enter Your Measurements
          </h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="50"
                max="300"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                placeholder="Enter height in cm"
              />
              <input
                type="range"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="50"
                max="300"
                step="1"
                className="w-full mt-2 accent-teal-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="10"
                max="300"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                placeholder="Enter weight in kg"
              />
              <input
                type="range"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="10"
                max="300"
                step="0.1"
                className="w-full mt-2 accent-teal-600"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Calculate BMI
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
              <div
                className={`${
                  result.categoryColor === "text-blue-600"
                    ? "from-blue-50 to-cyan-50 border-blue-200"
                    : result.categoryColor === "text-green-600"
                      ? "from-green-50 to-emerald-50 border-green-200"
                      : result.categoryColor === "text-yellow-600"
                        ? "from-yellow-50 to-orange-50 border-yellow-200"
                        : "from-red-50 to-pink-50 border-red-200"
                } bg-gradient-to-br border-2 rounded-xl p-6`}
              >
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Your BMI
                </p>
                <p className={`text-4xl font-bold ${result.categoryColor}`}>
                  {formatNumber(result.bmi, 1)}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Category
                </p>
                <p className={`text-3xl font-bold ${result.categoryColor}`}>
                  {result.category}
                </p>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">BMI Chart</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Underweight:</span>
                    <span className="text-blue-600 font-semibold">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Normal Weight:</span>
                    <span className="text-green-600 font-semibold">
                      18.5 - 24.9
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overweight:</span>
                    <span className="text-yellow-600 font-semibold">
                      25 - 29.9
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Obese:</span>
                    <span className="text-red-600 font-semibold">≥ 30</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">
                Enter your height and weight, then click "Calculate BMI" to see
                your result
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How to Use Section */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Enter your height in centimeters</li>
          <li>Enter your weight in kilograms</li>
          <li>Click "Calculate BMI" to get your result</li>
          <li>Your BMI category will appear instantly</li>
          <li>Use the sliders to adjust values and see how they affect your BMI</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
