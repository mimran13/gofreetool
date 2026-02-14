'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface DieType {
  sides: number;
  name: string;
}

const diceTypes: DieType[] = [
  { sides: 4, name: 'D4' },
  { sides: 6, name: 'D6' },
  { sides: 8, name: 'D8' },
  { sides: 10, name: 'D10' },
  { sides: 12, name: 'D12' },
  { sides: 20, name: 'D20' },
  { sides: 100, name: 'D100' },
];

interface RollResult {
  dice: number[];
  total: number;
  dieType: DieType;
  timestamp: Date;
}

export default function DiceRoller() {
  const tool = getToolBySlug('dice-roller');
  const [selectedDie, setSelectedDie] = useState(diceTypes[1]); // D6
  const [numDice, setNumDice] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<RollResult[]>([]);

  const roll = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);
    setResults([]);

    setTimeout(() => {
      const newResults = Array.from({ length: numDice }, () =>
        Math.floor(Math.random() * selectedDie.sides) + 1
      );
      setResults(newResults);
      setHistory(prev => [{
        dice: newResults,
        total: newResults.reduce((a, b) => a + b, 0),
        dieType: selectedDie,
        timestamp: new Date(),
      }, ...prev.slice(0, 9)]);
      setIsRolling(false);
    }, 500);
  }, [isRolling, numDice, selectedDie]);

  const total = results.reduce((a, b) => a + b, 0);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Roll <strong>virtual dice</strong> for board games, RPGs, and random decisions.
          Support for D4, D6, D8, D10, D12, D20, and D100. Roll multiple dice at once.
          <strong> True random</strong> results every time.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Dice Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Dice Type
          </label>
          <div className="flex flex-wrap gap-2">
            {diceTypes.map((die) => (
              <button
                key={die.sides}
                onClick={() => setSelectedDie(die)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDie.sides === die.sides
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {die.name}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Dice */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Dice: {numDice}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={numDice}
              onChange={(e) => setNumDice(Number(e.target.value))}
              className="flex-1"
            />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumDice(n)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    numDice === n
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roll Button */}
        <button
          onClick={roll}
          disabled={isRolling}
          className="w-full py-4 text-xl font-medium bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-xl transition-colors mb-6"
        >
          {isRolling ? 'Rolling...' : `Roll ${numDice}${selectedDie.name}`}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {results.map((value, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white border-2 border-teal-500"
                >
                  {value}
                </div>
              ))}
            </div>
            {results.length > 1 && (
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400">Total: </span>
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-400">{total}</span>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Roll History</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((roll, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {roll.dice.length}{roll.dieType.name}: [{roll.dice.join(', ')}]
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">= {roll.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Dice Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700 dark:text-gray-300">
          <div><strong>D4:</strong> Tetrahedron (1-4)</div>
          <div><strong>D6:</strong> Standard cube (1-6)</div>
          <div><strong>D8:</strong> Octahedron (1-8)</div>
          <div><strong>D10:</strong> Pentagonal (1-10)</div>
          <div><strong>D12:</strong> Dodecahedron (1-12)</div>
          <div><strong>D20:</strong> Icosahedron (1-20)</div>
          <div><strong>D100:</strong> Percentile (1-100)</div>
        </div>
      </section>
    </ToolLayout>
  );
}
