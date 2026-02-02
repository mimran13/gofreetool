"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { calculateWaterIntake, formatNumber } from "@/lib/utils";

export default function WaterIntakeCalculator() {
  const tool = getToolBySlug("water-intake-calculator");
  const [weight, setWeight] = useState<string>("70");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const [activity, setActivity] = useState<"sedentary" | "moderate" | "active">("moderate");
  const [result, setResult] = useState<{ liters: number; cups: number; bottles: number } | null>(null);

  if (!tool) return <div>Tool not found</div>;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    let weightKg = parseFloat(weight);
    
    if (unit === "lbs") {
      weightKg = weightKg * 0.453592;
    }

    if (weightKg > 0) {
      const liters = calculateWaterIntake(weightKg, activity);
      const cups = liters * 4.227;
      const bottles = liters / 0.5;

      setResult({ liters, cups, bottles });
    }
  };

  const handleReset = () => {
    setWeight("70");
    setUnit("kg");
    setActivity("moderate");
    setResult(null);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Water Intake</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Weight
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="10"
                  step="0.5"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "kg" | "lbs")}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Activity Level
              </label>
              <div className="space-y-2">
                {["sedentary", "moderate", "active"].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={level}
                      checked={activity === level}
                      onChange={(e) => setActivity(e.target.value as any)}
                    />
                    <span>
                      {level === "sedentary" && "Sedentary (office work, minimal exercise)"}
                      {level === "moderate" && "Moderate (light exercise, active job)"}
                      {level === "active" && "Active (sports, intense exercise)"}
                    </span>
                  </label>
                ))}
              </div>
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
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">Daily Water Intake</p>
                <p className="text-4xl font-bold text-blue-600">
                  {formatNumber(result.liters, 1)} L
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium mb-1">Cups (8 oz)</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {formatNumber(result.cups, 0)}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium mb-1">500ml Bottles</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(result.bottles, 1)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                <p><strong>Tip:</strong> Drink water throughout the day. Increase intake if exercising or in hot weather.</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Enter your weight and activity level</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Enter your body weight (kg or lbs)</li>
          <li>Select your activity level</li>
          <li>Click "Calculate" to see your daily water recommendation</li>
          <li>The result shows liters, cups, and number of 500ml bottles</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
