'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  triggered: boolean;
}

export default function AlarmClock() {
  const tool = getToolBySlug('alarm-clock');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [newAlarmLabel, setNewAlarmLabel] = useState('');
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check alarms
  useEffect(() => {
    const currentTimeStr = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    alarms.forEach((alarm) => {
      if (alarm.enabled && !alarm.triggered && alarm.time === currentTimeStr) {
        setRingingAlarm(alarm);
        setAlarms(prev => prev.map(a =>
          a.id === alarm.id ? { ...a, triggered: true } : a
        ));
        // Play sound using Web Audio API beep
        playAlarmSound();
      }
    });
  }, [currentTime, alarms]);

  const playAlarmSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const playBeep = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };
      // Play 3 beeps
      playBeep();
      setTimeout(playBeep, 600);
      setTimeout(playBeep, 1200);
    } catch {
      console.log('Audio not supported');
    }
  }, []);

  const addAlarm = useCallback(() => {
    if (!newAlarmTime) return;
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newAlarmTime,
      label: newAlarmLabel || `Alarm ${alarms.length + 1}`,
      enabled: true,
      triggered: false,
    };
    setAlarms([...alarms, newAlarm]);
    setNewAlarmLabel('');
  }, [newAlarmTime, newAlarmLabel, alarms]);

  const toggleAlarm = useCallback((id: string) => {
    setAlarms(alarms.map(a =>
      a.id === id ? { ...a, enabled: !a.enabled, triggered: false } : a
    ));
  }, [alarms]);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  }, [alarms]);

  const dismissAlarm = useCallback(() => {
    setRingingAlarm(null);
  }, []);

  const snoozeAlarm = useCallback(() => {
    if (!ringingAlarm) return;
    const snoozeTime = new Date(currentTime.getTime() + 5 * 60 * 1000);
    const snoozeTimeStr = snoozeTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    setAlarms(prev => [...prev, {
      id: Date.now().toString(),
      time: snoozeTimeStr,
      label: `${ringingAlarm.label} (Snoozed)`,
      enabled: true,
      triggered: false,
    }]);
    setRingingAlarm(null);
  }, [ringingAlarm, currentTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Set <strong>online alarms</strong> with custom labels and snooze support.
          Works in your browser with no app required. Keep this tab open for alarms to ring.
          <strong> All data stays in your browser.</strong>
        </p>
      </section>

      {/* Ringing Alarm Modal */}
      {ringingAlarm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 text-center animate-pulse">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {ringingAlarm.label}
            </h2>
            <p className="text-4xl font-mono text-teal-600 dark:text-teal-400 mb-6">
              {ringingAlarm.time}
            </p>
            <div className="flex gap-3">
              <button
                onClick={snoozeAlarm}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Snooze 5m
              </button>
              <button
                onClick={dismissAlarm}
                className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Current Time Display */}
        <div className="text-center mb-8">
          <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-white mb-2">
            {formatTime(currentTime)}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Add Alarm Form */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <input
            type="time"
            value={newAlarmTime}
            onChange={(e) => setNewAlarmTime(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="text"
            value={newAlarmLabel}
            onChange={(e) => setNewAlarmLabel(e.target.value)}
            placeholder="Alarm label (optional)"
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={addAlarm}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            Add Alarm
          </button>
        </div>

        {/* Alarms List */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Your Alarms ({alarms.filter(a => a.enabled).length} active)
          </h3>
          {alarms.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No alarms set. Add one above!
            </p>
          ) : (
            <div className="space-y-2">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    alarm.enabled
                      ? 'bg-teal-50 dark:bg-teal-900/20'
                      : 'bg-gray-50 dark:bg-gray-900 opacity-60'
                  }`}
                >
                  <button
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      alarm.enabled ? 'bg-teal-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        alarm.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <div className="flex-1">
                    <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
                      {alarm.time}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {alarm.label}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlarm(alarm.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-12 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Important Note</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>• Keep this browser tab open for alarms to work</li>
          <li>• Make sure your device volume is on</li>
          <li>• Alarms won't ring if your computer is asleep</li>
          <li>• Snooze adds 5 minutes to the alarm</li>
        </ul>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Set the time using the time picker</li>
          <li>Add an optional label for your alarm</li>
          <li>Click "Add Alarm" to create it</li>
          <li>Toggle alarms on/off with the switch</li>
          <li>When the alarm rings, dismiss or snooze</li>
        </ol>
      </section>
    </ToolLayout>
  );
}
