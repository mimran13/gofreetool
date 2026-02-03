'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// CHARACTER SETS
// ============================================================================

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

// ============================================================================
// PASSWORD GENERATION (using crypto.getRandomValues)
// ============================================================================

/**
 * Generate a cryptographically secure random integer between 0 and max (exclusive)
 */
function secureRandomInt(max: number): number {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  return randomBuffer[0] % max;
}

/**
 * Shuffle array using Fisher-Yates with crypto.getRandomValues
 */
function secureShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

/**
 * Generate a secure password with given options
 */
function generatePassword(options: PasswordOptions): { password: string; error?: string } {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  // Build character pool
  let charPool = '';
  const requiredChars: string[] = [];

  if (uppercase) {
    charPool += CHAR_SETS.uppercase;
    // Ensure at least one uppercase
    requiredChars.push(CHAR_SETS.uppercase[secureRandomInt(CHAR_SETS.uppercase.length)]);
  }
  if (lowercase) {
    charPool += CHAR_SETS.lowercase;
    // Ensure at least one lowercase
    requiredChars.push(CHAR_SETS.lowercase[secureRandomInt(CHAR_SETS.lowercase.length)]);
  }
  if (numbers) {
    charPool += CHAR_SETS.numbers;
    // Ensure at least one number
    requiredChars.push(CHAR_SETS.numbers[secureRandomInt(CHAR_SETS.numbers.length)]);
  }
  if (symbols) {
    charPool += CHAR_SETS.symbols;
    // Ensure at least one symbol
    requiredChars.push(CHAR_SETS.symbols[secureRandomInt(CHAR_SETS.symbols.length)]);
  }

  if (charPool.length === 0) {
    return { password: '', error: 'Please select at least one character type' };
  }

  if (length < requiredChars.length) {
    return { password: '', error: `Password length must be at least ${requiredChars.length} to include all selected character types` };
  }

  // Generate remaining random characters
  const remainingLength = length - requiredChars.length;
  const randomChars: string[] = [];

  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = secureRandomInt(charPool.length);
    randomChars.push(charPool[randomIndex]);
  }

  // Combine required and random characters, then shuffle
  const allChars = secureShuffle([...requiredChars, ...randomChars]);

  return { password: allChars.join('') };
}

// ============================================================================
// PASSWORD STRENGTH CALCULATION
// ============================================================================

interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  bgColor: string;
  feedback: string[];
}

function calculateStrength(password: string, options: PasswordOptions): StrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'None',
      color: 'text-gray-400',
      bgColor: 'bg-gray-200',
      feedback: [],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (password.length >= 20) score += 1;

  // Character variety scoring
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
  score += varietyCount;

  // Penalties
  if (password.length < 8) {
    score = Math.max(0, score - 2);
    feedback.push('Password is too short');
  }

  if (varietyCount < 2) {
    score = Math.max(0, score - 1);
    feedback.push('Add more character variety');
  }

  // Check for common patterns (simple check)
  if (/^[a-z]+$|^[A-Z]+$|^[0-9]+$/.test(password)) {
    score = Math.max(0, score - 2);
    feedback.push('Avoid using only one character type');
  }

  // Normalize score to 0-4
  const normalizedScore = Math.min(4, Math.floor(score / 2));

  // Map score to labels
  const strengthMap: Record<number, Omit<StrengthResult, 'score' | 'feedback'>> = {
    0: { label: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-500' },
    1: { label: 'Weak', color: 'text-orange-600', bgColor: 'bg-orange-500' },
    2: { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
    3: { label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' },
    4: { label: 'Very Strong', color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
  };

  // Add positive feedback
  if (normalizedScore >= 3 && feedback.length === 0) {
    feedback.push('Great password strength!');
  }

  return {
    score: normalizedScore,
    ...strengthMap[normalizedScore],
    feedback,
  };
}

// ============================================================================
// PASSWORD DISPLAY COMPONENT
// ============================================================================

interface PasswordDisplayProps {
  password: string;
  onCopy: () => void;
  copied: boolean;
}

function PasswordDisplay({ password, onCopy, copied }: PasswordDisplayProps) {
  // Color-code character types for visual feedback
  const coloredPassword = password.split('').map((char, index) => {
    let className = 'text-gray-800 dark:text-gray-200';

    if (/[A-Z]/.test(char)) {
      className = 'text-blue-600 dark:text-blue-400';
    } else if (/[a-z]/.test(char)) {
      className = 'text-gray-700 dark:text-gray-300';
    } else if (/[0-9]/.test(char)) {
      className = 'text-green-600 dark:text-green-400';
    } else {
      className = 'text-purple-600 dark:text-purple-400';
    }

    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  });

  return (
    <div className="relative">
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex-1 font-mono text-lg tracking-wider break-all select-all min-h-[28px]">
          {password ? coloredPassword : (
            <span className="text-gray-400">Click &quot;Generate&quot; to create a password</span>
          )}
        </div>
        <button
          onClick={onCopy}
          disabled={!password}
          className="flex-shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          aria-label="Copy password"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Color legend */}
      {password && (
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span><span className="text-blue-600 dark:text-blue-400 font-mono">A</span> = Uppercase</span>
          <span><span className="text-gray-700 dark:text-gray-300 font-mono">a</span> = Lowercase</span>
          <span><span className="text-green-600 dark:text-green-400 font-mono">1</span> = Number</span>
          <span><span className="text-purple-600 dark:text-purple-400 font-mono">@</span> = Symbol</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STRENGTH METER COMPONENT
// ============================================================================

interface StrengthMeterProps {
  strength: StrengthResult;
}

function StrengthMeter({ strength }: StrengthMeterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password Strength
        </span>
        <span className={`text-sm font-semibold ${strength.color}`}>
          {strength.label}
        </span>
      </div>

      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-2 flex-1 rounded-full transition-colors ${
              level <= strength.score ? strength.bgColor : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-gray-500 dark:text-gray-400">
          {strength.feedback.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PasswordGenerator() {
  // Get tool metadata
  const tool = getToolBySlug('password-generator');

  // Password options
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);

  // Generated password
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Password strength
  const strength = calculateStrength(password, { length, uppercase, lowercase, numbers, symbols });

  // Generate password
  const handleGenerate = useCallback(() => {
    const result = generatePassword({ length, uppercase, lowercase, numbers, symbols });
    if (result.error) {
      setError(result.error);
      setPassword('');
    } else {
      setPassword(result.password);
      setError('');
    }
    setCopied(false);
  }, [length, uppercase, lowercase, numbers, symbols]);

  // Auto-generate on initial load
  useEffect(() => {
    handleGenerate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  // Clear password
  const handleClear = useCallback(() => {
    setPassword('');
    setError('');
    setCopied(false);
  }, []);

  // Calculate entropy for display
  const charPoolSize =
    (uppercase ? 26 : 0) +
    (lowercase ? 26 : 0) +
    (numbers ? 10 : 0) +
    (symbols ? 28 : 0);
  const entropy = charPoolSize > 0 ? Math.floor(length * Math.log2(charPoolSize)) : 0;

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section - SEO optimized */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Our free <strong>Password Generator</strong> creates cryptographically secure passwords
          using your browser&apos;s built-in <code>crypto.getRandomValues()</code> API—the same
          technology used by security professionals. Unlike weak random generators, this tool produces
          truly unpredictable passwords that protect your accounts from brute-force attacks, dictionary
          attacks, and credential stuffing. Customize your password with adjustable length (8-64
          characters) and character options including uppercase, lowercase, numbers, and symbols.
          The real-time strength indicator helps you understand your password&apos;s security level.
          <strong> Your passwords are never stored, transmitted, or logged</strong>—all generation
          happens entirely in your browser for complete privacy.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Password Display */}
        <div className="mb-6">
          <PasswordDisplay password={password} onCopy={handleCopy} copied={copied} />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Strength Meter */}
        {password && (
          <div className="mb-6">
            <StrengthMeter strength={strength} />
          </div>
        )}

        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password-length"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password Length
            </label>
            <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 tabular-nums">
              {length} characters
            </span>
          </div>
          <input
            id="password-length"
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>8</span>
            <span>16</span>
            <span>32</span>
            <span>48</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Character Types
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-mono text-blue-600 dark:text-blue-400">ABC</span> Uppercase
              </span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-mono">abc</span> Lowercase
              </span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
              <input
                type="checkbox"
                checked={numbers}
                onChange={(e) => setNumbers(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-mono text-green-600 dark:text-green-400">123</span> Numbers
              </span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-teal-500 transition-colors">
              <input
                type="checkbox"
                checked={symbols}
                onChange={(e) => setSymbols(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-mono text-purple-600 dark:text-purple-400">@#$</span> Symbols
              </span>
            </label>
          </div>
        </div>

        {/* Entropy Display */}
        {password && (
          <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Password Entropy
              </span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                ~{entropy} bits
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Higher entropy means more possible combinations. 128+ bits is considered very secure.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Generate Password
          </button>
          <button
            onClick={handleClear}
            disabled={!password}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Passwords Stay Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All password generation happens directly in your browser using the secure
              <code className="mx-1 px-1 bg-green-100 dark:bg-green-900/50 rounded">crypto.getRandomValues()</code>
              API. No passwords are ever transmitted to any server, stored in any database, or logged
              anywhere. Once you leave this page, your generated passwords exist only if you saved them.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the Password Generator
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Set your password length</strong> using the slider (8-64 characters). Longer
            passwords are exponentially more secure.
          </li>
          <li>
            <strong>Choose character types</strong> by toggling the checkboxes. Using all four types
            (uppercase, lowercase, numbers, symbols) creates the strongest passwords.
          </li>
          <li>
            <strong>Click &quot;Generate Password&quot;</strong> to create a new secure password.
            A password is automatically generated when you first load the page.
          </li>
          <li>
            <strong>Check the strength meter</strong> to ensure your password is strong enough for
            your needs. Aim for &quot;Strong&quot; or &quot;Very Strong&quot;.
          </li>
          <li>
            <strong>Copy your password</strong> using the Copy button and store it in a password
            manager (recommended) or a secure location.
          </li>
        </ol>
      </section>

      {/* Password Strength Explanation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Understanding Password Strength
        </h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Password strength depends on two main factors: <strong>length</strong> and
            <strong> character variety</strong>. Each additional character exponentially increases
            the number of possible combinations an attacker must try.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Strength</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Characteristics</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-red-600 font-semibold">Very Weak</span>
                  </td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">&lt;8 chars, single type</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Never use</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-orange-600 font-semibold">Weak</span>
                  </td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">8-11 chars, 2 types</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Low-value accounts</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-yellow-600 font-semibold">Fair</span>
                  </td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">12-15 chars, 3 types</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">General accounts</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-green-600 font-semibold">Strong</span>
                  </td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">16-19 chars, all types</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Important accounts</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">
                    <span className="text-emerald-600 font-semibold">Very Strong</span>
                  </td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">20+ chars, all types</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Critical accounts, master passwords</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Security Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to hash passwords for storage? Use our{' '}
          <Link
            href="/tools/hash-generator"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Hash Generator
          </Link>{' '}
          for MD5, SHA-1, and SHA-256 hashing. Need unique identifiers? Try our{' '}
          <Link
            href="/tools/uuid-generator"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            UUID Generator
          </Link>{' '}
          to create cryptographically secure UUIDs.
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
              How secure are the passwords generated by this tool?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Very secure. This tool uses <code>crypto.getRandomValues()</code>, a Web Crypto API
              that provides cryptographically strong random values. This is the same level of
              randomness used by security professionals and is suitable for generating passwords,
              encryption keys, and other security-sensitive data. Each generated password has true
              randomness—there are no predictable patterns.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is password entropy and why does it matter?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Entropy measures the unpredictability of a password in bits. It&apos;s calculated as
              log₂(possible characters) × password length. Higher entropy means more possible
              combinations an attacker must try. A password with 128 bits of entropy would require
              2¹²⁸ guesses in a brute-force attack—more than all the atoms in the observable universe.
              Aim for at least 60 bits for general use and 128+ bits for critical accounts.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Should I use special symbols in my password?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, when possible. Including symbols increases your character pool from 62 (letters
              + numbers) to 90+ characters, significantly increasing entropy. However, some systems
              restrict which symbols are allowed. If a site rejects your password, try regenerating
              with only letters and numbers, or manually remove problematic symbols. Common safe
              symbols include: ! @ # $ % & * - _ +
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              How should I store my generated passwords?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <strong>Use a password manager</strong>—this is the most secure and convenient option.
              Popular choices include Bitwarden (free, open-source), 1Password, and Dashlane. Password
              managers encrypt your passwords with a master password and can auto-fill them on websites.
              Never store passwords in plain text files, browser notes, or unencrypted documents.
              If you must write them down, store the paper in a secure location like a safe.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why is this better than using a memorable password?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Human-created &quot;memorable&quot; passwords follow predictable patterns that attackers
              know well: common words, letter-to-number substitutions (a→@, e→3), keyboard patterns,
              and personal information. These patterns drastically reduce the actual number of guesses
              needed. A randomly generated 16-character password is vastly more secure than a 20-character
              password based on modified words. Use random passwords with a password manager for
              maximum security.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
