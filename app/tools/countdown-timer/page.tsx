'use client';

import { useState, useEffect, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function CountdownTimer() {
  const tool = getToolBySlug('countdown-timer');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('00:00');
  const [eventName, setEventName] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const countdown = useMemo(() => {
    if (!targetDate) return null;

    const target = new Date(`${targetDate}T${targetTime}`);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  }, [targetDate, targetTime, now]);

  const setQuickDate = (daysFromNow: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    setTargetDate(date.toISOString().split('T')[0]);
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create a <strong>countdown timer</strong> to any date or event. See days, hours,
          minutes, and seconds until birthdays, holidays, deadlines, or any special occasion.
          <strong> All processing happens in your browser</strong> — works offline too.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Event Name (optional)
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., My Birthday"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time
            </label>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-gray-500">Quick set:</span>
          <button onClick={() => setQuickDate(7)} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            1 Week
          </button>
          <button onClick={() => setQuickDate(30)} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            1 Month
          </button>
          <button onClick={() => setQuickDate(90)} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            3 Months
          </button>
          <button onClick={() => setQuickDate(365)} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            1 Year
          </button>
        </div>

        {countdown ? (
          <div>
            {eventName && (
              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                {countdown.isPast ? `${eventName} has passed!` : `Countdown to ${eventName}`}
              </h3>
            )}

            {countdown.isPast ? (
              <div className="text-center text-4xl">🎉</div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hours' },
                  { value: countdown.minutes, label: 'Minutes' },
                  { value: countdown.seconds, label: 'Seconds' },
                ].map(({ value, label }) => (
                  <div key={label} className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
                    <div className="text-4xl md:text-6xl font-bold text-teal-600 dark:text-teal-400">
                      {value.toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{label}</div>
                  </div>
                ))}
              </div>
            )}

            {!countdown.isPast && (
              <div className="mt-6 text-center text-gray-500">
                Target: {new Date(`${targetDate}T${targetTime}`).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            Select a date to start the countdown
          </div>
        )}
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Optionally enter an event name</li>
          <li>Select your target date</li>
          <li>Optionally set a specific time</li>
          <li>Watch the countdown in real-time</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
