"use client";

import { useState } from "react";
import { getToolBySlug } from "@/lib/tools";
import ToolLayout from "@/components/ToolLayout";
import { calculateDiscount, calculateDiscountAmount, formatNumber } from "@/lib/utils";

export default function DiscountCalculator() {
  const tool = getToolBySlug("discount-calculator");
  const [originalPrice, setOriginalPrice] = useState<string>("100");
  const [discount, setDiscount] = useState<string>("20");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    savings: string;
  } | null>(null);

  if (!tool) return <div>Tool not found</div>;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(originalPrice);
    const discValue = parseFloat(discount);

    if (price > 0 && discValue >= 0) {
      let discountAmount = 0;
      let finalPrice = price;

      if (discountType === "percent") {
        if (discValue > 100) return;
        discountAmount = calculateDiscountAmount(price, discValue);
        finalPrice = calculateDiscount(price, discValue);
      } else {
        discountAmount = Math.min(discValue, price);
        finalPrice = Math.max(0, price - discValue);
      }

      const savings = ((discountAmount / price) * 100).toFixed(1);
      setResult({ discountAmount, finalPrice, savings });
    }
  };

  const handleReset = () => {
    setOriginalPrice("100");
    setDiscount("20");
    setDiscountType("percent");
    setResult(null);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Calculate Discount</h2>
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Discount Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="percent"
                    checked={discountType === "percent"}
                    onChange={() => setDiscountType("percent")}
                  />
                  <span>Percentage (%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="fixed"
                    checked={discountType === "fixed"}
                    onChange={() => setDiscountType("fixed")}
                  />
                  <span>Fixed Amount ($)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount {discountType === "percent" ? "(%)" : "($)"}
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="0"
                step="0.01"
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <p className="text-gray-600 text-sm font-medium mb-2">Final Price</p>
                <p className="text-4xl font-bold text-green-600">
                  $ {formatNumber(result.finalPrice, 2)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium mb-1">You Save</p>
                  <p className="text-2xl font-bold text-red-600">
                    $ {formatNumber(result.discountAmount, 2)}
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-xs font-medium mb-1">Savings %</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {result.savings}%
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="text-gray-600">Enter values to calculate your savings</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">How to Use</h3>
        <ol className="space-y-2 text-gray-700 text-sm list-decimal list-inside">
          <li>Enter the original price</li>
          <li>Choose discount type (percentage or fixed amount)</li>
          <li>Enter the discount value</li>
          <li>Click "Calculate" to see your final price and savings</li>
        </ol>
      </div>
    </ToolLayout>
  );
}
