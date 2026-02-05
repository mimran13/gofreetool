'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type TimerPhase = 'work' | 'short-break' | 'long-break';
type TimerState = 'idle' | 'running' | 'paused';

const DEFAULT_DURATIONS = {
  work: 25,
  'short-break': 5,
  'long-break': 15,
};

const PHASE_LABELS: Record<TimerPhase, string> = {
  work: 'Focus',
  'short-break': 'Short Break',
  'long-break': 'Long Break',
};

const PHASE_COLORS: Record<TimerPhase, { bg: string; text: string; ring: string }> = {
  work: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', ring: 'stroke-red-500' },
  'short-break': { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', ring: 'stroke-green-500' },
  'long-break': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', ring: 'stroke-blue-500' },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PomodoroTimer() {
  const tool = getToolBySlug('pomodoro-timer');

  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [phase, setPhase] = useState<TimerPhase>('work');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.work * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [autoStart, setAutoStart] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play notification sound
  const playSound = useCallback(() => {
    try {
      const ctx = audioContextRef.current || new AudioContext();
      audioContextRef.current = ctx;

      // Play a pleasant two-tone chime
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523, 0, 0.3);      // C5
      playTone(659, 0.15, 0.3);   // E5
      playTone(784, 0.3, 0.5);    // G5
    } catch {
      // Audio not available
    }
  }, []);

  // Handle timer completion
  const handlePhaseComplete = useCallback(() => {
    playSound();

    if (phase === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      setTotalFocusMinutes((prev) => prev + durations.work);

      // Every 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        setPhase('long-break');
        setSecondsLeft(durations['long-break'] * 60);
      } else {
        setPhase('short-break');
        setSecondsLeft(durations['short-break'] * 60);
      }
    } else {
      // Break is over, back to work
      setPhase('work');
      setSecondsLeft(durations.work * 60);
    }

    if (!autoStart) {
      setTimerState('idle');
    }
  }, [phase, completedPomodoros, durations, autoStart, playSound]);

  // Timer tick
  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            handlePhaseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, handlePhaseComplete]);

  // Update document title with timer
  useEffect(() => {
    if (timerState === 'running' || timerState === 'paused') {
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      document.title = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} - ${PHASE_LABELS[phase]} | Pomodoro Timer`;
    } else {
      document.title = 'Pomodoro Timer - Free Online | gofreetool.com';
    }

    return () => {
      document.title = 'Pomodoro Timer - Free Online | gofreetool.com';
    };
  }, [secondsLeft, timerState, phase]);

  // Controls
  const startTimer = useCallback(() => setTimerState('running'), []);
  const pauseTimer = useCallback(() => setTimerState('paused'), []);
  const resumeTimer = useCallback(() => setTimerState('running'), []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState('idle');
    setSecondsLeft(durations[phase] * 60);
  }, [phase, durations]);

  const switchPhase = useCallback(
    (newPhase: TimerPhase) => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimerState('idle');
      setPhase(newPhase);
      setSecondsLeft(durations[newPhase] * 60);
    },
    [durations]
  );

  const resetAll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState('idle');
    setPhase('work');
    setSecondsLeft(durations.work * 60);
    setCompletedPomodoros(0);
    setTotalFocusMinutes(0);
  }, [durations]);

  // Update duration
  const updateDuration = useCallback(
    (p: TimerPhase, mins: number) => {
      const clamped = Math.max(1, Math.min(120, mins));
      setDurations((prev) => ({ ...prev, [p]: clamped }));
      if (p === phase && timerState === 'idle') {
        setSecondsLeft(clamped * 60);
      }
    },
    [phase, timerState]
  );

  // Format time
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = durations[phase] * 60;
  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;

  // SVG circle params
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const colors = PHASE_COLORS[phase];

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: (tool.faq || []).map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Boost your productivity with the <strong>Pomodoro Technique</strong>. Work in focused
          25-minute intervals followed by short breaks. After 4 pomodoros, take a longer break.
          Customize durations, track your sessions, and stay focused with audio notifications.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className={`rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors ${colors.bg}`}>
        {/* Phase Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/80 dark:bg-gray-800/80 rounded-lg p-1 shadow-sm">
            {(['work', 'short-break', 'long-break'] as const).map((p) => (
              <button
                key={p}
                onClick={() => switchPhase(p)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  phase === p
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {PHASE_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <svg width="280" height="280" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                fill="none"
                strokeWidth="8"
                strokeLinecap="round"
                className={colors.ring}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-6xl font-bold font-mono ${colors.text}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {PHASE_LABELS[phase]}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-6">
          {timerState === 'idle' && (
            <button
              onClick={startTimer}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Start
            </button>
          )}
          {timerState === 'running' && (
            <button
              onClick={pauseTimer}
              className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Pause
            </button>
          )}
          {timerState === 'paused' && (
            <>
              <button
                onClick={resumeTimer}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-lg"
              >
                Resume
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
              >
                Reset
              </button>
            </>
          )}
          {timerState === 'running' && (
            <button
              onClick={resetTimer}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedPomodoros}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pomodoros</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalFocusMinutes}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Focus Minutes</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{4 - (completedPomodoros % 4)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Until Long Break</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {(['work', 'short-break', 'long-break'] as const).map((p) => (
            <div key={p}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {PHASE_LABELS[p]} (min)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={durations[p]}
                onChange={(e) => updateDuration(p, Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            Auto-start next phase
          </label>
          <button
            onClick={resetAll}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Reset All Stats
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Works Offline</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              This Pomodoro timer runs entirely in your browser. No data is sent to any server, no
              account required. Your session stats are stored only in your browser&apos;s memory.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Pomodoro Timer
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Click Start</strong> to begin a 25-minute focus session (customizable in settings).
          </li>
          <li>
            <strong>Work on your task</strong> with full focus until the timer rings.
          </li>
          <li>
            <strong>Take a short break</strong> (5 minutes) when the timer completes.
          </li>
          <li>
            <strong>Repeat the cycle</strong> — after 4 pomodoros, the timer suggests a longer 15-minute break.
          </li>
          <li>
            <strong>Track progress</strong> — see your completed pomodoros and total focus time.
          </li>
        </ol>
      </section>

      {/* What is the Pomodoro Technique */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What is the Pomodoro Technique?
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The <strong>Pomodoro Technique</strong> is a time management method developed by Francesco
            Cirillo in the late 1980s. Named after the tomato-shaped kitchen timer he used as a
            student, this technique breaks work into intervals (traditionally 25 minutes) separated
            by short breaks.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            The core idea is that frequent breaks improve mental agility and that the time pressure
            of a ticking timer helps maintain focus. The technique has become one of the most popular
            productivity methods worldwide, used by students, developers, writers, and professionals.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Benefits of the Pomodoro Technique
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🎯', title: 'Better Focus', desc: 'Short, timed intervals help maintain deep concentration' },
            { icon: '⚡', title: 'Reduced Burnout', desc: 'Regular breaks prevent mental fatigue and exhaustion' },
            { icon: '📈', title: 'Track Progress', desc: 'Count pomodoros to measure and improve productivity' },
            { icon: '🧠', title: 'Fight Procrastination', desc: 'Starting a 25-minute timer feels more achievable than a vague task' },
            { icon: '⏰', title: 'Time Awareness', desc: 'Learn how long tasks actually take vs your estimates' },
            { icon: '🔄', title: 'Sustainable Pace', desc: 'Work-rest cycles keep you productive throughout the day' },
          ].map((benefit) => (
            <div key={benefit.title} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-2xl">{benefit.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to calculate time differences? Try our{' '}
          <Link href="/tools/date-difference-calculator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Date Difference Calculator
          </Link>. For tracking workdays, use our{' '}
          <Link href="/tools/workdays-calculator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Workdays Calculator
          </Link>. For random decisions, try our{' '}
          <Link href="/tools/decision-wheel" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Decision Wheel
          </Link>.
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why 25 minutes?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Francesco Cirillo found that 25 minutes is long enough to make meaningful progress on a
              task but short enough to maintain intense focus. However, some people prefer different
              intervals — you can customize the duration in the settings to find what works best for you.
              Common variations include 50/10 and 90/20 splits.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What should I do during breaks?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Step away from your work. Good break activities include stretching, walking, getting
              water, looking out a window, or doing light exercises. Avoid checking email or social
              media during short breaks — save those for long breaks. The goal is to rest your mind.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What if I finish my task before the timer ends?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              If you finish early, use the remaining time for &quot;overlearning&quot; — review your
              work, plan the next task, or study related topics. The principle is to use the full
              pomodoro for focused work rather than context-switching.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does the timer work if I switch tabs?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, the timer continues running even when you switch to a different tab or window. The
              remaining time is shown in the page title so you can track it from your tab bar.
              You&apos;ll hear an audio chime when the timer completes.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
