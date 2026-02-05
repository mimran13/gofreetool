'use client';

import { useState } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';
import { trackToolCalculate, trackCopyClick } from '@/lib/analytics';

export default function DecisionWheel() {
  const tool = getToolBySlug('decision-wheel');
  if (!tool) return <div>Tool not found</div>;
  const [items, setItems] = useState('Person 1\nPerson 2\nPerson 3');
  const [result, setResult] = useState<{ choice: string; index: number } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [animationDuration, setAnimationDuration] = useState(4.5);

  const handleSpin = () => {
    const itemList = items
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (itemList.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    const randomIndex = Math.floor(Math.random() * itemList.length);
    // Random spin duration between 3-5 seconds for the main spin
    const mainSpinDuration = 3 + Math.random() * 2;
    const slowDownDuration = 1.5; // Additional slow down time
    const totalDuration = mainSpinDuration + slowDownDuration;
    const rotations = 12 + Math.random() * 4; // 12-16 rotations
    
    // Calculate the final rotation to land on the selected item
    const segmentAngle = 360 / itemList.length;
    // Rotate so the pointer (at top, 0°) points to the START of the selected segment
    const segmentStart = randomIndex * segmentAngle;
    const targetRotation = rotations * 360 + (360 - segmentStart) % 360;
    
    setAnimationDuration(totalDuration);
    setWheelRotation(targetRotation);

    setTimeout(() => {
      setResult({ choice: itemList[randomIndex], index: randomIndex });
      setIsSpinning(false);
      trackToolCalculate('decision-wheel');
    }, totalDuration * 1000);
  };

  const handleReset = () => {
    setItems('Person 1\nPerson 2\nPerson 3');
    setResult(null);
    setIsSpinning(false);
    setWheelRotation(0);
    setAnimationDuration(4.5);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.choice);
      trackCopyClick('decision-wheel');
    }
  };

  const itemList = items
    .split('\n')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const getColor = (index: number) => {
    const colors = [
      'from-red-400 to-red-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600',
      'from-cyan-400 to-cyan-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <ToolLayout tool={tool}>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .wheel-spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Input */}
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Names (one per line)
              </label>
              <textarea
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="Person 1&#10;Person 2&#10;Person 3"
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 my-6 text-center">
              {itemList.length > 0 ? `${itemList.length} people on the wheel` : 'Add at least 2 people'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSpin}
                disabled={isSpinning || itemList.length < 2}
                className="flex-1 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition transform active:scale-95"
              >
                {isSpinning ? 'Spinning...' : 'Spin Wheel'}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right Side: Animated Wheel */}
          <div className="flex flex-col items-center justify-center">
            {/* Arrow Pointer */}
            <div className="mb-8 relative z-10">
              <div className="w-0 h-0 border-l-12 border-r-12 border-t-16 border-l-transparent border-r-transparent border-t-yellow-500 drop-shadow-lg"></div>
            </div>

            {/* Wheel Container */}
            <div className="relative w-96 h-96 rounded-full shadow-2xl overflow-hidden border-8 border-gray-800 dark:border-gray-600">
              <svg
                viewBox="0 0 400 400"
                className={`w-full h-full ${isSpinning ? 'wheel-spinning' : ''}`}
                style={{
                  transform: isSpinning ? 'none' : `rotate(${wheelRotation}deg)`,
                  transitionDuration: !isSpinning ? `${animationDuration}s` : '0s',
                  transitionTimingFunction: !isSpinning ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'linear',
                  transitionProperty: 'transform',
                }}
              >
              {itemList.map((item, index) => {
                const angle = (360 / itemList.length) * index;
                const nextAngle = (360 / itemList.length) * (index + 1);
                const midAngle = (angle + nextAngle) / 2;
                
                const x1 = 200 + 200 * Math.cos((angle - 90) * Math.PI / 180);
                const y1 = 200 + 200 * Math.sin((angle - 90) * Math.PI / 180);
                const x2 = 200 + 200 * Math.cos((nextAngle - 90) * Math.PI / 180);
                const y2 = 200 + 200 * Math.sin((nextAngle - 90) * Math.PI / 180);
                
                const textX = 200 + 120 * Math.cos((midAngle - 90) * Math.PI / 180);
                const textY = 200 + 120 * Math.sin((midAngle - 90) * Math.PI / 180);
                
                const colorClass = getColor(index);
                const [startColor, endColor] = colorClass.split(' to-');
                
                return (
                  <g key={index}>
                    {/* Segment */}
                    <path
                      d={`M 200 200 L ${x1} ${y1} A 200 200 0 ${nextAngle - angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
                      fill={`url(#gradient${index})`}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={['#f87171', '#3b82f6', '#4ade80', '#a855f7', '#ec4899', '#facc15', '#6366f1', '#06b6d4'][index % 8]} />
                        <stop offset="100%" stopColor={['#dc2626', '#1d4ed8', '#15803d', '#7e22ce', '#be185d', '#ca8a04', '#4f46e5', '#0369a1'][index % 8]} />
                      </linearGradient>
                    </defs>
                    
                    {/* Text */}
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="18"
                      fontWeight="bold"
                      style={{
                        transform: `rotate(${midAngle}deg)`,
                        transformOrigin: `${textX}px ${textY}px`,
                      }}
                    >
                      {item.length > 15 ? item.substring(0, 12) + '...' : item}
                    </text>
                  </g>
                );
              })}
              
              {/* Center Circle */}
              <circle cx="200" cy="200" r="30" fill="#fbbf24" stroke="white" strokeWidth="3" />
              <text
                x="200"
                y="205"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                SPIN
              </text>
            </svg>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="animate-slideIn mt-8">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg p-8 border-2 border-indigo-200 dark:border-indigo-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">🎉 The Wheel Selected...</p>
            <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 break-words">
              {result.choice}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCopy}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
              >
                Copy Name
              </button>
              <button
                onClick={handleSpin}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                Spin Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter names of people one per line (at least 2)</li>
            <li>Click "Spin Wheel" to start the animation</li>
            <li>Watch the colorful wheel spin and slow down</li>
            <li>See who the arrow points to at the top</li>
            <li>Use the result to make fair decisions</li>
          </ol>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use Cases</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Picking who goes first in games</li>
            <li>Selecting team members fairly</li>
            <li>Choosing who presents in class or meetings</li>
            <li>Deciding who picks the movie or restaurant</li>
            <li>Random selection for prizes or awards</li>
            <li>Party games and icebreakers</li>
          </ul>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Tip:</strong> This tool is great for fair, unbiased decision making. The more options you add, the more interesting your wheel becomes!
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
