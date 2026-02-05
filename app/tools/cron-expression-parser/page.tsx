'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout, { ToolContent, ToolInterface } from '@/components/ToolLayout';

// ============================================================================
// TYPES
// ============================================================================

interface ParsedFields {
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
  raw: string[];
}

interface ParseResult {
  success: boolean;
  fields?: ParsedFields;
  error?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const DAY_MAP: Record<string, number> = {
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6,
};

const MONTH_MAP: Record<string, number> = {
  JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
  JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12,
};

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily midnight', value: '0 0 * * *' },
  { label: 'Every Monday', value: '0 9 * * 1' },
  { label: 'Weekdays 9am', value: '0 9 * * 1-5' },
];

// ============================================================================
// CRON PARSER FUNCTIONS
// ============================================================================

/**
 * Replace day-of-week and month name aliases with their numeric equivalents.
 */
function replaceAliases(field: string, aliasMap: Record<string, number>): string {
  let result = field.toUpperCase();
  for (const [name, num] of Object.entries(aliasMap)) {
    result = result.replace(new RegExp(name, 'g'), String(num));
  }
  return result;
}

// Parse a single cron field (e.g. "1-5", "* /10", "1,3,5") into an array of
// matching integer values. Returns null if the field is invalid.
function parseCronField(field: string, min: number, max: number): number[] | null {
  const values = new Set<number>();

  // Split on comma to handle lists like "1,3,5" or "1-3,7-9"
  const parts = field.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed === '') return null;

    // Check for step: "*/5", "1-10/2", or "5/3"
    const stepParts = trimmed.split('/');
    if (stepParts.length > 2) return null;

    let rangeStr = stepParts[0];
    const stepStr = stepParts[1];
    let step = 1;

    if (stepStr !== undefined) {
      step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) return null;
    }

    // Determine the range
    let rangeStart: number;
    let rangeEnd: number;

    if (rangeStr === '*') {
      rangeStart = min;
      rangeEnd = max;
    } else if (rangeStr.includes('-')) {
      const rangeParts = rangeStr.split('-');
      if (rangeParts.length !== 2) return null;
      rangeStart = parseInt(rangeParts[0], 10);
      rangeEnd = parseInt(rangeParts[1], 10);
      if (isNaN(rangeStart) || isNaN(rangeEnd)) return null;
      if (rangeStart < min || rangeEnd > max || rangeStart > rangeEnd) return null;
    } else {
      // Single value, possibly with a step
      const val = parseInt(rangeStr, 10);
      if (isNaN(val)) return null;
      if (val < min || val > max) return null;

      if (stepStr !== undefined) {
        // e.g. "5/3" means starting at 5, every 3rd value
        rangeStart = val;
        rangeEnd = max;
      } else {
        values.add(val);
        continue;
      }
    }

    // Generate values from range with step
    for (let i = rangeStart; i <= rangeEnd; i += step) {
      values.add(i);
    }
  }

  if (values.size === 0) return null;

  const sorted = Array.from(values).sort((a, b) => a - b);

  // Final validation: all values must be within [min, max]
  for (const v of sorted) {
    if (v < min || v > max) return null;
  }

  return sorted;
}

/**
 * Parse a full 5-field cron expression. Returns parsed fields or an error.
 */
function parseCronExpression(expr: string): ParseResult {
  const trimmed = expr.trim();
  if (!trimmed) {
    return { success: false, error: 'Cron expression cannot be empty.' };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    return {
      success: false,
      error: `Expected 5 fields (minute hour day-of-month month day-of-week), but got ${parts.length}. Example: "0 9 * * 1-5"`,
    };
  }

  // Replace aliases for month and day-of-week fields
  const monthField = replaceAliases(parts[3], MONTH_MAP);
  const dowField = replaceAliases(parts[4], DAY_MAP);

  const minute = parseCronField(parts[0], 0, 59);
  if (!minute) {
    return { success: false, error: `Invalid minute field "${parts[0]}". Must be 0-59 or a valid pattern like */5, 1-30, or 0,15,30,45.` };
  }

  const hour = parseCronField(parts[1], 0, 23);
  if (!hour) {
    return { success: false, error: `Invalid hour field "${parts[1]}". Must be 0-23 or a valid pattern like */2, 9-17, or 0,6,12,18.` };
  }

  const dayOfMonth = parseCronField(parts[2], 1, 31);
  if (!dayOfMonth) {
    return { success: false, error: `Invalid day-of-month field "${parts[2]}". Must be 1-31 or a valid pattern like */2, 1-15, or 1,15.` };
  }

  const month = parseCronField(monthField, 1, 12);
  if (!month) {
    return { success: false, error: `Invalid month field "${parts[3]}". Must be 1-12 (or JAN-DEC) or a valid pattern like */3, 1-6, or 1,4,7,10.` };
  }

  const dayOfWeek = parseCronField(dowField, 0, 6);
  if (!dayOfWeek) {
    return { success: false, error: `Invalid day-of-week field "${parts[4]}". Must be 0-6 (0=Sunday, or SUN-SAT) or a valid pattern like 1-5, 0,6, or */2.` };
  }

  return {
    success: true,
    fields: {
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
      raw: parts,
    },
  };
}

// ============================================================================
// HUMAN-READABLE EXPLANATION
// ============================================================================

function isAll(arr: number[], min: number, max: number): boolean {
  return arr.length === max - min + 1;
}

function isConsecutiveRange(arr: number[]): boolean {
  if (arr.length < 2) return false;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + 1) return false;
  }
  return true;
}

function detectStep(arr: number[], min: number, max: number): number | null {
  if (arr.length < 2) return null;
  const step = arr[1] - arr[0];
  if (step <= 1) return null;
  // Check if all values follow this step from min
  if (arr[0] !== min) return null;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1] + step) return null;
  }
  // Also verify it covers the expected count
  const expected = Math.floor((max - min) / step) + 1;
  if (arr.length !== expected) return null;
  return step;
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function cronToHumanReadable(fields: ParsedFields): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;

  const allMinutes = isAll(minute, 0, 59);
  const allHours = isAll(hour, 0, 23);
  const allDom = isAll(dayOfMonth, 1, 31);
  const allMonths = isAll(month, 1, 12);
  const allDow = isAll(dayOfWeek, 0, 6);

  const minuteStep = detectStep(minute, 0, 59);
  const hourStep = detectStep(hour, 0, 23);

  // Every minute: * * * * *
  if (allMinutes && allHours && allDom && allMonths && allDow) {
    return 'Every minute';
  }

  // Every N minutes: */N * * * *
  if (minuteStep && allHours && allDom && allMonths && allDow) {
    return `Every ${minuteStep} minutes`;
  }

  // Every hour at minute M: M * * * *
  if (minute.length === 1 && allHours && allDom && allMonths && allDow) {
    return `Every hour, at minute ${minute[0]}`;
  }

  // Every N hours: 0 */N * * *
  if (minute.length === 1 && hourStep && allDom && allMonths && allDow) {
    return `Every ${hourStep} hours, at minute ${minute[0]}`;
  }

  // Build a more complex description
  const descParts: string[] = [];

  // Time portion
  if (minute.length === 1 && hour.length === 1) {
    descParts.push(`At ${pad2(hour[0])}:${pad2(minute[0])}`);
  } else if (minute.length === 1 && !allHours) {
    if (isConsecutiveRange(hour)) {
      descParts.push(`At minute ${minute[0]}, between ${pad2(hour[0])}:00 and ${pad2(hour[hour.length - 1])}:59`);
    } else {
      descParts.push(`At minute ${minute[0]}, at hours ${hour.join(', ')}`);
    }
  } else if (minuteStep && !allHours) {
    descParts.push(`Every ${minuteStep} minutes`);
    if (hour.length === 1) {
      descParts.push(`during hour ${hour[0]}`);
    } else if (isConsecutiveRange(hour)) {
      descParts.push(`between ${pad2(hour[0])}:00 and ${pad2(hour[hour.length - 1])}:59`);
    }
  } else if (allMinutes && hour.length === 1) {
    descParts.push(`Every minute, during hour ${hour[0]}`);
  } else if (allMinutes && !allHours) {
    if (isConsecutiveRange(hour)) {
      descParts.push(`Every minute, between ${pad2(hour[0])}:00 and ${pad2(hour[hour.length - 1])}:59`);
    } else {
      descParts.push(`Every minute, at hours ${hour.join(', ')}`);
    }
  } else if (!allMinutes && allHours) {
    if (minuteStep) {
      descParts.push(`Every ${minuteStep} minutes`);
    } else {
      descParts.push(`At minutes ${minute.join(', ')}, every hour`);
    }
  } else if (allMinutes && allHours) {
    descParts.push('Every minute');
  } else {
    // Mixed
    descParts.push(`At minutes ${minute.join(', ')} past hours ${hour.join(', ')}`);
  }

  // Day-of-week portion
  if (!allDow) {
    if (dayOfWeek.length === 1) {
      descParts.push(`${DAY_NAMES[dayOfWeek[0]]}`);
    } else if (isConsecutiveRange(dayOfWeek)) {
      descParts.push(`${DAY_NAMES[dayOfWeek[0]]} through ${DAY_NAMES[dayOfWeek[dayOfWeek.length - 1]]}`);
    } else {
      descParts.push(`on ${dayOfWeek.map((d) => DAY_NAMES[d]).join(', ')}`);
    }
  }

  // Day-of-month portion
  if (!allDom) {
    if (dayOfMonth.length === 1) {
      descParts.push(`on day ${dayOfMonth[0]} of the month`);
    } else if (isConsecutiveRange(dayOfMonth)) {
      descParts.push(`on days ${dayOfMonth[0]}-${dayOfMonth[dayOfMonth.length - 1]} of the month`);
    } else {
      descParts.push(`on days ${dayOfMonth.join(', ')} of the month`);
    }
  }

  // Month portion
  if (!allMonths) {
    if (month.length === 1) {
      descParts.push(`in ${MONTH_NAMES[month[0] - 1]}`);
    } else if (isConsecutiveRange(month)) {
      descParts.push(`${MONTH_NAMES[month[0] - 1]} through ${MONTH_NAMES[month[month.length - 1] - 1]}`);
    } else {
      descParts.push(`in ${month.map((m) => MONTH_NAMES[m - 1]).join(', ')}`);
    }
  }

  // Join the description with commas and fix punctuation
  let result = descParts[0];
  for (let i = 1; i < descParts.length; i++) {
    const part = descParts[i];
    // If it starts with a day name (e.g. "Monday"), add comma before
    if (DAY_NAMES.some((d) => part.startsWith(d))) {
      result += `, ${part}`;
    } else if (part.startsWith('on ') || part.startsWith('in ') || part.startsWith('during ') || part.startsWith('between ')) {
      result += `, ${part}`;
    } else {
      result += `, ${part}`;
    }
  }

  return result;
}

// ============================================================================
// NEXT EXECUTION TIMES COMPUTATION
// ============================================================================

function getNextExecutions(fields: ParsedFields, count: number = 5): Date[] {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = fields;

  // Pre-build lookup sets for O(1) checks
  const minuteSet = new Set(minute);
  const hourSet = new Set(hour);
  const domSet = new Set(dayOfMonth);
  const monthSet = new Set(month);
  const dowSet = new Set(dayOfWeek);

  const results: Date[] = [];
  const now = new Date();

  // Start from the next whole minute
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  // Safety limit: search at most 2 years into the future
  const maxDate = new Date(now.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);

  while (results.length < count && current <= maxDate) {
    const cMonth = current.getMonth() + 1; // 1-12
    const cDom = current.getDate();
    const cDow = current.getDay(); // 0-6
    const cHour = current.getHours();
    const cMinute = current.getMinutes();

    // Check month
    if (!monthSet.has(cMonth)) {
      // Skip to next matching month
      const nextMonth = findNextValue(month, cMonth);
      if (nextMonth !== null && nextMonth > cMonth) {
        current.setMonth(nextMonth - 1, 1);
        current.setHours(0, 0, 0, 0);
      } else {
        // Wrap to next year
        current.setFullYear(current.getFullYear() + 1);
        current.setMonth(month[0] - 1, 1);
        current.setHours(0, 0, 0, 0);
      }
      continue;
    }

    // Check day-of-month and day-of-week (both must match)
    if (!domSet.has(cDom) || !dowSet.has(cDow)) {
      // Skip to next day
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    // Check hour
    if (!hourSet.has(cHour)) {
      const nextHour = findNextValue(hour, cHour);
      if (nextHour !== null && nextHour > cHour) {
        current.setHours(nextHour, 0, 0, 0);
        // Reset minute to first matching minute
        current.setMinutes(minute[0]);
      } else {
        // Wrap to next day
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
      }
      continue;
    }

    // Check minute
    if (!minuteSet.has(cMinute)) {
      const nextMinute = findNextValue(minute, cMinute);
      if (nextMinute !== null && nextMinute > cMinute) {
        current.setMinutes(nextMinute, 0, 0);
      } else {
        // Wrap to next hour
        current.setHours(current.getHours() + 1, 0, 0, 0);
      }
      continue;
    }

    // All fields match - record this time
    results.push(new Date(current));

    // Advance to next minute
    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}

/**
 * Find the next value in a sorted array that is greater than the given value.
 * Returns null if no such value exists.
 */
function findNextValue(sortedArr: number[], current: number): number | null {
  for (const val of sortedArr) {
    if (val > current) return val;
  }
  return null;
}

// ============================================================================
// FIELD DISPLAY HELPERS
// ============================================================================

function expandFieldDisplay(values: number[], min: number, max: number, names?: string[], offset?: number): string {
  if (isAll(values, min, max)) {
    return names ? `Every value (${names[0 + (offset ?? 0)]} - ${names[names.length - 1]})` : `Every value (${min}-${max})`;
  }

  const step = detectStep(values, min, max);
  if (step) {
    if (names) {
      const mapped = values.map((v) => names[v - (offset ?? 0)]);
      if (mapped.length > 8) {
        return `Every ${step}${offset ? 'th' : ''} (${mapped.slice(0, 6).join(', ')}, ...)`;
      }
      return mapped.join(', ');
    }
    if (values.length > 12) {
      return `${values.slice(0, 8).join(', ')}, ... (every ${step})`;
    }
  }

  if (names) {
    return values.map((v) => names[v - (offset ?? 0)]).join(', ');
  }

  if (values.length > 15) {
    return `${values.slice(0, 10).join(', ')}, ... (${values.length} values)`;
  }

  return values.join(', ');
}

function getTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'Local';
  }
}

function formatExecutionTime(date: Date): string {
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CronExpressionParser() {
  const tool = getToolBySlug('cron-expression-parser');

  const [expression, setExpression] = useState('');
  const [copied, setCopied] = useState(false);

  const parseResult = useMemo(() => {
    if (!expression.trim()) return null;
    return parseCronExpression(expression);
  }, [expression]);

  const explanation = useMemo(() => {
    if (!parseResult?.success || !parseResult.fields) return '';
    return cronToHumanReadable(parseResult.fields);
  }, [parseResult]);

  const nextExecutions = useMemo(() => {
    if (!parseResult?.success || !parseResult.fields) return [];
    return getNextExecutions(parseResult.fields, 5);
  }, [parseResult]);

  const timezone = useMemo(() => getTimezone(), []);

  const handlePreset = useCallback((value: string) => {
    setExpression(value);
    setCopied(false);
  }, []);

  const handleCopyExplanation = useCallback(async () => {
    if (!explanation) return;
    const textToCopy = `${expression} - ${explanation}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [explanation, expression]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* 1. Introduction */}
      <ToolContent className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Parse and explain <strong>cron expressions</strong> in plain English. Enter any standard 5-field cron expression
          (minute, hour, day-of-month, month, day-of-week) to get a human-readable explanation and the next
          scheduled execution times in your browser&apos;s timezone. Use quick presets for common schedules or type
          your own. <strong>100% client-side processing</strong> means your expressions never leave your browser.
        </p>
      </ToolContent>

      {/* 2. Main Tool Interface */}
      <ToolInterface className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {/* Input Section */}
          <div className="mb-4">
            <label
              htmlFor="cron-input"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Cron Expression
            </label>
            <input
              id="cron-input"
              type="text"
              value={expression}
              onChange={(e) => {
                setExpression(e.target.value);
                setCopied(false);
              }}
              placeholder="e.g. */5 * * * *  or  0 9 * * 1-5"
              className="w-full px-5 py-4 font-mono text-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
              spellCheck={false}
              autoComplete="off"
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Format: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">minute hour day-of-month month day-of-week</code>
            </p>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePreset(preset.value)}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {parseResult && !parseResult.success && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-4">
              <div className="flex items-start gap-2">
                <span className="text-red-500 text-lg mt-0.5">!</span>
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    Invalid Cron Expression
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {parseResult.error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Area */}
          {parseResult?.success && parseResult.fields && (
            <div className="space-y-5">
              {/* Human-Readable Explanation */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wide mb-1">
                      Explanation
                    </h3>
                    <p className="text-lg font-medium text-teal-900 dark:text-teal-200">
                      {explanation}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyExplanation}
                    className="flex-shrink-0 px-3 py-1.5 text-xs bg-teal-100 dark:bg-teal-800 hover:bg-teal-200 dark:hover:bg-teal-700 text-teal-700 dark:text-teal-300 rounded-lg transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy Explanation'}
                  </button>
                </div>
              </div>

              {/* Field Breakdown Table */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Field Breakdown
                </h3>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                  <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900">
                        <th className="text-left p-3 text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          Field
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          Expression
                        </th>
                        <th className="text-left p-3 text-xs font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          Expanded Values
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="p-3 font-medium">Minute</td>
                        <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{parseResult.fields.raw[0]}</td>
                        <td className="p-3">{expandFieldDisplay(parseResult.fields.minute, 0, 59)}</td>
                      </tr>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                        <td className="p-3 font-medium">Hour</td>
                        <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{parseResult.fields.raw[1]}</td>
                        <td className="p-3">{expandFieldDisplay(parseResult.fields.hour, 0, 23)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Day (Month)</td>
                        <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{parseResult.fields.raw[2]}</td>
                        <td className="p-3">{expandFieldDisplay(parseResult.fields.dayOfMonth, 1, 31)}</td>
                      </tr>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                        <td className="p-3 font-medium">Month</td>
                        <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{parseResult.fields.raw[3]}</td>
                        <td className="p-3">{expandFieldDisplay(parseResult.fields.month, 1, 12, MONTH_NAMES, 1)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Day (Week)</td>
                        <td className="p-3 font-mono text-teal-600 dark:text-teal-400">{parseResult.fields.raw[4]}</td>
                        <td className="p-3">{expandFieldDisplay(parseResult.fields.dayOfWeek, 0, 6, DAY_NAMES, 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Next 5 Execution Times */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Next 5 Execution Times
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                    Timezone: {timezone}
                  </span>
                </div>
                {nextExecutions.length > 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <ol className="divide-y divide-gray-200 dark:divide-gray-700">
                      {nextExecutions.map((date, idx) => (
                        <li key={idx} className="flex items-center gap-3 px-4 py-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-mono text-gray-800 dark:text-gray-200">
                            {formatExecutionTime(date)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No executions found within the next 2 years for this expression.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </ToolInterface>

      {/* 3. Privacy Notice */}
      <ToolContent className="mb-12">
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">&#x1f512;</span>
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
              <p className="text-sm text-green-700 dark:text-green-400">
                All cron parsing and execution time calculations happen directly in your browser.
                Your expressions are never sent to any server. This tool works completely offline.
              </p>
            </div>
          </div>
        </div>
      </ToolContent>

      {/* 4. How to Use */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Cron Expression Parser
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Enter a cron expression</strong> in the input field using the standard 5-field format:
            minute, hour, day-of-month, month, day-of-week.
          </li>
          <li>
            <strong>Or click a preset</strong> to quickly load a common schedule like &quot;Every 5 minutes&quot;
            or &quot;Weekdays at 9am&quot;.
          </li>
          <li>
            <strong>Read the explanation</strong> shown in the teal box. It translates your cron expression
            into plain English so you can verify it does what you expect.
          </li>
          <li>
            <strong>Check the field breakdown</strong> table to see exactly which values each field matches.
          </li>
          <li>
            <strong>Review next execution times</strong> to see the upcoming 5 dates and times when
            the schedule would fire in your local timezone.
          </li>
          <li>
            <strong>Copy the explanation</strong> using the copy button to paste into documentation,
            comments, or commit messages.
          </li>
        </ol>
      </ToolContent>

      {/* 5. Cron Syntax Reference */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Cron Syntax Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Field</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Allowed Values</th>
                <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Special Characters</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Minute</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">0-59</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">* , - /</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Hour</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">0-23</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">* , - /</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Day of Month</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">1-31</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">* , - /</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Month</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">1-12 or JAN-DEC</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">* , - /</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium">Day of Week</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">0-6 or SUN-SAT</td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono">* , - /</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-teal-600 dark:text-teal-400">*</code> &mdash; matches all values in the field</p>
          <p><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-teal-600 dark:text-teal-400">,</code> &mdash; separates multiple values (e.g. <code>1,3,5</code>)</p>
          <p><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-teal-600 dark:text-teal-400">-</code> &mdash; defines a range (e.g. <code>1-5</code> means 1, 2, 3, 4, 5)</p>
          <p><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-teal-600 dark:text-teal-400">/</code> &mdash; defines a step (e.g. <code>*/5</code> means every 5th value)</p>
        </div>
      </ToolContent>

      {/* 6. Features */}
      <ToolContent className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Plain English Explanation',
              desc: 'Instantly converts cron syntax into a human-readable description you can understand at a glance.',
            },
            {
              title: 'Next Execution Times',
              desc: 'Computes the next 5 scheduled times using your browser timezone so you know exactly when jobs fire.',
            },
            {
              title: 'Field Breakdown Table',
              desc: 'Shows each cron field expanded to its matching values, making complex expressions transparent.',
            },
            {
              title: 'Quick Presets',
              desc: 'Common schedules like "every 5 minutes" or "weekdays at 9am" are one click away.',
            },
            {
              title: 'Validation & Error Hints',
              desc: 'Clear error messages tell you exactly which field is wrong and what values are expected.',
            },
            {
              title: 'No External Libraries',
              desc: 'Custom-built parser with zero dependencies. Lightweight, fast, and works completely offline.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </ToolContent>

      {/* 7. Related Tools */}
      <ToolContent className="mb-12">
        <div className="p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
          <p className="text-sm text-teal-700 dark:text-teal-400">
            Working with regular expressions? Try our{' '}
            <Link
              href="/tools/regex-tester"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              Regex Tester
            </Link>
            . Need to format API responses? Use our{' '}
            <Link
              href="/tools/json-formatter-viewer"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON Formatter & Viewer
            </Link>
            . Converting config files? Check out our{' '}
            <Link
              href="/tools/json-yaml-converter"
              className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
            >
              JSON-YAML Converter
            </Link>
            .
          </p>
        </div>
      </ToolContent>

      {/* 8. FAQ */}
      <ToolContent className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is a cron expression?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A cron expression is a string of five space-separated fields that defines a recurring schedule.
              The fields represent: minute (0-59), hour (0-23), day of month (1-31), month (1-12 or JAN-DEC),
              and day of week (0-6 or SUN-SAT, where 0 is Sunday). For example, <code>0 9 * * 1-5</code> means
              &quot;at 9:00 AM, Monday through Friday.&quot;
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How does cron scheduling work?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Cron is a time-based job scheduler found in Unix and Unix-like operating systems (Linux, macOS).
              The cron daemon runs in the background and checks the crontab (cron table) every minute. When the
              current time matches an entry&apos;s schedule, the associated command is executed. It&apos;s commonly
              used for automated backups, log rotation, sending reports, and running maintenance scripts.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What timezone are the execution times shown in?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              The execution times are calculated and displayed in your browser&apos;s local timezone, which is
              detected automatically. The timezone name is shown above the execution times list. Note that
              actual cron jobs on a server run in the server&apos;s configured timezone, which may differ from
              your browser&apos;s timezone.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What special characters can I use?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Four special characters are supported: <code>*</code> (wildcard - matches all values),
              <code>/</code> (step - e.g. <code>*/5</code> means every 5th value),
              <code>-</code> (range - e.g. <code>1-5</code> means 1 through 5), and
              <code>,</code> (list - e.g. <code>1,3,5</code> means values 1, 3, and 5).
              You can combine these: <code>1-10/2</code> means every 2nd value from 1 to 10.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Does this support 6-field or 7-field cron expressions?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">&#x25BC;</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Currently, this tool supports the standard 5-field cron format used by most Unix/Linux crontab
              implementations. Extended formats with a seconds field (6 fields) or a year field (7 fields),
              as used by some frameworks like Quartz or Spring, are not supported at this time. If you have
              a 6-field expression, try removing the first field (seconds) to use it here.
            </p>
          </details>
        </div>
      </ToolContent>
    </ToolLayout>
  );
}
