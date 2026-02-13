'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface Lap {
  id: number;
  time: number;
  diff: number;
}

export default function Stopwatch() {
  const tool = getToolBySlug('stopwatch');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  }, []);

  const lap = useCallback(() => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    setLaps([
      { id: laps.length + 1, time: time, diff: time - lastLapTime },
      ...laps,
    ]);
  }, [time, laps]);

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          A simple <strong>online stopwatch</strong> with lap timing capability.
          Start, stop, and record lap times with millisecond precision.
          <strong> Works entirely in your browser</strong> — no app download needed.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="text-center mb-8">
          <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white mb-8">
            {formatTime(time)}
          </div>

          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <button
                onClick={start}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl font-semibold rounded-full transition-colors"
              >
                {time === 0 ? 'Start' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={stop}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-semibold rounded-full transition-colors"
              >
                Stop
              </button>
            )}

            {isRunning && (
              <button
                onClick={lap}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-full transition-colors"
              >
                Lap
              </button>
            )}

            {!isRunning && time > 0 && (
              <button
                onClick={reset}
                className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-xl font-semibold rounded-full transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {laps.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Lap Times</h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-2">Lap</th>
                    <th className="text-right py-2">Lap Time</th>
                    <th className="text-right py-2">Total Time</th>
                  </tr>
                </thead>
                <tbody>
                  {laps.map((l) => (
                    <tr key={l.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 font-medium text-gray-900 dark:text-white">#{l.id}</td>
                      <td className="py-2 text-right font-mono text-teal-600 dark:text-teal-400">
                        {formatTime(l.diff)}
                      </td>
                      <td className="py-2 text-right font-mono text-gray-600 dark:text-gray-400">
                        {formatTime(l.time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Click <strong>Start</strong> to begin timing</li>
          <li>Click <strong>Lap</strong> to record split times</li>
          <li>Click <strong>Stop</strong> to pause the timer</li>
          <li>Click <strong>Resume</strong> to continue</li>
          <li>Click <strong>Reset</strong> to clear everything</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
