'use client';

import { useState, useMemo } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

const timezones = [
  { id: 'UTC', name: 'UTC', offset: 0 },
  { id: 'America/New_York', name: 'New York (EST/EDT)', offset: -5 },
  { id: 'America/Chicago', name: 'Chicago (CST/CDT)', offset: -6 },
  { id: 'America/Denver', name: 'Denver (MST/MDT)', offset: -7 },
  { id: 'America/Los_Angeles', name: 'Los Angeles (PST/PDT)', offset: -8 },
  { id: 'America/Toronto', name: 'Toronto (EST/EDT)', offset: -5 },
  { id: 'America/Sao_Paulo', name: 'São Paulo (BRT)', offset: -3 },
  { id: 'Europe/London', name: 'London (GMT/BST)', offset: 0 },
  { id: 'Europe/Paris', name: 'Paris (CET/CEST)', offset: 1 },
  { id: 'Europe/Berlin', name: 'Berlin (CET/CEST)', offset: 1 },
  { id: 'Europe/Moscow', name: 'Moscow (MSK)', offset: 3 },
  { id: 'Asia/Dubai', name: 'Dubai (GST)', offset: 4 },
  { id: 'Asia/Kolkata', name: 'India (IST)', offset: 5.5 },
  { id: 'Asia/Bangkok', name: 'Bangkok (ICT)', offset: 7 },
  { id: 'Asia/Singapore', name: 'Singapore (SGT)', offset: 8 },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong (HKT)', offset: 8 },
  { id: 'Asia/Shanghai', name: 'Shanghai (CST)', offset: 8 },
  { id: 'Asia/Tokyo', name: 'Tokyo (JST)', offset: 9 },
  { id: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)', offset: 10 },
  { id: 'Pacific/Auckland', name: 'Auckland (NZST/NZDT)', offset: 12 },
];

export default function TimezoneConverter() {
  const tool = getToolBySlug('timezone-converter');
  const [fromTz, setFromTz] = useState('America/New_York');
  const [toTz, setToTz] = useState('Europe/London');
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);

  const result = useMemo(() => {
    const fromOffset = timezones.find(tz => tz.id === fromTz)?.offset || 0;
    const toOffset = timezones.find(tz => tz.id === toTz)?.offset || 0;
    const diff = toOffset - fromOffset;

    let newHours = hours + diff;
    let dayDiff = 0;

    if (newHours >= 24) {
      newHours -= 24;
      dayDiff = 1;
    } else if (newHours < 0) {
      newHours += 24;
      dayDiff = -1;
    }

    return {
      hours: Math.floor(newHours),
      minutes: minutes + (newHours % 1) * 60,
      dayDiff,
    };
  }, [fromTz, toTz, hours, minutes]);

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  };

  const format24 = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const setCurrentTime = () => {
    const now = new Date();
    setHours(now.getHours());
    setMinutes(now.getMinutes());
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Convert time between different <strong>time zones</strong> worldwide. Perfect for
          scheduling international meetings, calls, and tracking global events.
          <strong> All calculations happen in your browser</strong> — fast and private.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Time Zone
            </label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              {timezones.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Time Zone
            </label>
            <select
              value={toTz}
              onChange={(e) => setToTz(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            >
              {timezones.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-20 px-3 py-3 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-2xl text-gray-400">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-20 px-3 py-3 text-center text-xl border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={setCurrentTime}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm"
            >
              Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {timezones.find(tz => tz.id === fromTz)?.name}
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatTime(hours, minutes)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {format24(hours, minutes)}
            </div>
          </div>

          <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {timezones.find(tz => tz.id === toTz)?.name}
            </div>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
              {formatTime(result.hours, result.minutes)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {format24(result.hours, Math.floor(result.minutes))}
              {result.dayDiff !== 0 && (
                <span className="ml-2 text-orange-500">
                  ({result.dayDiff > 0 ? '+1 day' : '-1 day'})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Quick Reference</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• EST (New York) to GMT (London): +5 hours</li>
          <li>• PST (Los Angeles) to EST (New York): +3 hours</li>
          <li>• GMT to IST (India): +5.5 hours</li>
          <li>• EST to JST (Tokyo): +14 hours</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Select your source time zone</li>
          <li>Select the destination time zone</li>
          <li>Enter the time you want to convert</li>
          <li>See the converted time instantly</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
