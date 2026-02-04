'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

// ============================================================================
// JWT DECODING HELPERS
// ============================================================================

interface DecodedJWT {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
}

interface DecodeResult {
  success: boolean;
  decoded?: DecodedJWT;
  error?: string;
  warnings?: string[];
}

/**
 * Base64URL decode (JWT uses base64url, not standard base64)
 */
function base64UrlDecode(str: string): string {
  // Replace base64url characters with base64 characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const padding = base64.length % 4;
  if (padding) {
    base64 += '='.repeat(4 - padding);
  }

  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    // Fallback for non-UTF8 content
    return atob(base64);
  }
}

/**
 * Decode a JWT token
 */
function decodeJWT(token: string): DecodeResult {
  const trimmed = token.trim();

  if (!trimmed) {
    return { success: false, error: 'Please enter a JWT token to decode' };
  }

  // Remove "Bearer " prefix if present
  const cleanToken = trimmed.replace(/^Bearer\s+/i, '');

  const parts = cleanToken.split('.');

  if (parts.length !== 3) {
    return {
      success: false,
      error: `Invalid JWT format. Expected 3 parts (header.payload.signature), got ${parts.length} part${parts.length === 1 ? '' : 's'}.`,
    };
  }

  const [headerB64, payloadB64, signature] = parts;
  const warnings: string[] = [];

  // Decode header
  let header: Record<string, unknown> | null = null;
  try {
    const headerJson = base64UrlDecode(headerB64);
    header = JSON.parse(headerJson);
  } catch (e) {
    return {
      success: false,
      error: `Failed to decode header: ${e instanceof Error ? e.message : 'Invalid base64 or JSON'}`,
    };
  }

  // Decode payload
  let payload: Record<string, unknown> | null = null;
  try {
    const payloadJson = base64UrlDecode(payloadB64);
    payload = JSON.parse(payloadJson);
  } catch (e) {
    return {
      success: false,
      error: `Failed to decode payload: ${e instanceof Error ? e.message : 'Invalid base64 or JSON'}`,
    };
  }

  // Check for common issues
  if (payload) {
    const now = Math.floor(Date.now() / 1000);

    if (typeof payload.exp === 'number' && payload.exp < now) {
      warnings.push(`Token expired on ${new Date(payload.exp * 1000).toLocaleString()}`);
    }

    if (typeof payload.nbf === 'number' && payload.nbf > now) {
      warnings.push(`Token not valid until ${new Date(payload.nbf * 1000).toLocaleString()}`);
    }
  }

  return {
    success: true,
    decoded: { header, payload, signature },
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Format a timestamp claim for display
 */
function formatTimestamp(value: unknown): string | null {
  if (typeof value !== 'number') return null;

  try {
    const date = new Date(value * 1000);
    return date.toLocaleString();
  } catch {
    return null;
  }
}

// ============================================================================
// SYNTAX HIGHLIGHTED JSON COMPONENT
// ============================================================================

interface SyntaxHighlightedJsonProps {
  json: string;
  title: string;
}

function SyntaxHighlightedJson({ json, title }: SyntaxHighlightedJsonProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    return json
      .replace(/"([^"]+)":/g, '<span class="text-red-600 dark:text-red-400">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-green-600 dark:text-green-400">"$1"</span>')
      .replace(/: (-?\d+\.?\d*)/g, ': <span class="text-blue-600 dark:text-blue-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-purple-600 dark:text-purple-400">$1</span>')
      .replace(/: (null)/g, ': <span class="text-gray-500 dark:text-gray-400">$1</span>');
  }, [json]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = json;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [json]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        className="font-mono text-sm leading-relaxed bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 overflow-auto whitespace-pre"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

// ============================================================================
// CLAIMS TABLE COMPONENT
// ============================================================================

interface ClaimsTableProps {
  payload: Record<string, unknown>;
}

const KNOWN_CLAIMS: Record<string, string> = {
  iss: 'Issuer',
  sub: 'Subject',
  aud: 'Audience',
  exp: 'Expiration Time',
  nbf: 'Not Before',
  iat: 'Issued At',
  jti: 'JWT ID',
  name: 'Full Name',
  email: 'Email',
  email_verified: 'Email Verified',
  picture: 'Picture URL',
  given_name: 'Given Name',
  family_name: 'Family Name',
  locale: 'Locale',
  scope: 'Scope',
  azp: 'Authorized Party',
  at_hash: 'Access Token Hash',
  nonce: 'Nonce',
  auth_time: 'Authentication Time',
  acr: 'Auth Context Class',
  amr: 'Auth Methods',
  roles: 'Roles',
  permissions: 'Permissions',
};

function ClaimsTable({ payload }: ClaimsTableProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback(async (key: string, value: unknown) => {
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  }, []);

  const entries = Object.entries(payload);
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Claims</h3>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Claim
              </th>
              <th className="text-left p-3 font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Value
              </th>
              <th className="w-16 p-3 border-b border-gray-200 dark:border-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {entries.map(([key, value]) => {
              const displayValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
              const timestamp = ['exp', 'nbf', 'iat', 'auth_time'].includes(key) ? formatTimestamp(value) : null;

              return (
                <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-3 text-gray-800 dark:text-gray-200">
                    <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {key}
                    </code>
                    {KNOWN_CLAIMS[key] && (
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {KNOWN_CLAIMS[key]}
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-mono text-xs text-gray-800 dark:text-gray-200 break-all">
                    {displayValue}
                    {timestamp && (
                      <span className="block text-xs text-teal-600 dark:text-teal-400 mt-0.5 font-sans">
                        {timestamp}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleCopy(key, value)}
                      className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                      {copiedKey === key ? '✓' : 'Copy'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function JWTDecoder() {
  const tool = getToolBySlug('jwt-decoder');

  // State
  const [input, setInput] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Decode JWT
  const result = useMemo(() => decodeJWT(input), [input]);

  // Format JSON for display
  const headerJson = useMemo(() => {
    if (result.decoded?.header) {
      return JSON.stringify(result.decoded.header, null, 2);
    }
    return '';
  }, [result.decoded?.header]);

  const payloadJson = useMemo(() => {
    if (result.decoded?.payload) {
      return JSON.stringify(result.decoded.payload, null, 2);
    }
    return '';
  }, [result.decoded?.payload]);

  // Handle copy all
  const handleCopyAll = useCallback(async () => {
    if (!result.decoded) return;

    const fullOutput = JSON.stringify({
      header: result.decoded.header,
      payload: result.decoded.payload,
    }, null, 2);

    try {
      await navigator.clipboard.writeText(fullOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullOutput;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  }, [result.decoded]);

  // Handle clear
  const handleClear = useCallback(() => {
    setInput('');
  }, []);

  // Load sample JWT
  const handleLoadSample = useCallback(() => {
    // This is a sample JWT for demonstration (not a real secret)
    const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE3MzU2ODk2MDAsInJvbGVzIjpbImFkbWluIiwidXNlciJdLCJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tIiwiYXVkIjoiaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    setInput(sampleJwt);
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction Section */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Decode and inspect <strong>JSON Web Tokens (JWT)</strong> instantly with our free decoder.
          Paste any JWT to view the header and payload with pretty-printed JSON and syntax highlighting.
          See all claims including <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">iss</code>,
          <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">sub</code>,
          <code className="px-1 bg-gray-100 dark:bg-gray-800 rounded">exp</code>, and custom claims.
          This tool <strong>does not verify signatures</strong> - it&apos;s designed for debugging and inspection only.
          <strong> 100% client-side processing</strong> means your tokens never leave your browser.
        </p>
      </section>

      {/* Main Tool Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="jwt-input"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                JWT Token
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline"
              >
                Load Sample
              </button>
            </div>

            <textarea
              id="jwt-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIs...)"
              className={`w-full h-[65vh] px-5 py-4 font-mono text-sm leading-relaxed border-2 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none transition-colors ${
                input && !result.success
                  ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10'
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900'
              } dark:text-white`}
              spellCheck={false}
            />

            {/* Error message */}
            {input && !result.success && (
              <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  {result.error}
                </p>
              </div>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                {result.warnings.map((warning, i) => (
                  <p key={i} className="text-sm text-amber-700 dark:text-amber-400">
                    ⚠️ {warning}
                  </p>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-3">
              <button
                onClick={handleClear}
                disabled={!input}
                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleCopyAll}
                disabled={!result.success}
                className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {copySuccess ? 'Copied!' : 'Copy All JSON'}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Decoded Token
              </span>
              {result.decoded && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Algorithm: {String(result.decoded.header?.alg || 'unknown')}
                </span>
              )}
            </div>

            {/* Output display */}
            {result.success && result.decoded ? (
              <div className="h-[65vh] overflow-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                <SyntaxHighlightedJson json={headerJson} title="Header" />
                <SyntaxHighlightedJson json={payloadJson} title="Payload" />

                {/* Signature info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Signature</h3>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <code className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all">
                      {result.decoded.signature}
                    </code>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Signature is not verified. Use a backend service to verify token authenticity.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[65vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="text-center px-4">
                  <span className="text-4xl mb-4 block">🔓</span>
                  <p className="text-gray-500 dark:text-gray-400">
                    {input ? 'Fix the errors to see decoded token' : 'Enter a JWT token to decode'}
                  </p>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="mt-3 min-h-[40px] flex items-center text-xs text-gray-500 dark:text-gray-400">
              {result.decoded?.payload && (
                <span>{Object.keys(result.decoded.payload).length} claims in payload</span>
              )}
            </div>
          </div>
        </div>

        {/* Claims Table - Full Width */}
        {result.success && result.decoded?.payload && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <ClaimsTable payload={result.decoded.payload} />
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">100% Client-Side Processing</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All JWT decoding happens directly in your browser. Your tokens are never sent to any server,
              stored, or logged. This tool works completely offline after the page loads.
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="mb-12 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-amber-600 text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Decode Only - No Signature Verification</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This tool only decodes and displays JWT contents. It does <strong>not verify the signature</strong>.
              Anyone can create a JWT with any payload. Always verify tokens server-side before trusting their contents.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use the JWT Decoder
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Paste your JWT</strong> into the input textarea. The token should have three parts
            separated by dots (header.payload.signature).
          </li>
          <li>
            <strong>View the decoded header</strong> showing the algorithm (alg) and token type (typ).
          </li>
          <li>
            <strong>Inspect the payload</strong> with all claims. Timestamps like exp, iat, and nbf
            are automatically converted to readable dates.
          </li>
          <li>
            <strong>Copy individual values</strong> from the claims table, or copy all decoded JSON at once.
          </li>
          <li>
            <strong>Check warnings</strong> for expired tokens or tokens not yet valid.
          </li>
        </ol>
      </section>

      {/* JWT Structure Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          JWT Structure Explained
        </h2>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            A JSON Web Token consists of three Base64URL-encoded parts separated by dots:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Part</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Contains</th>
                  <th className="text-left p-3 border border-gray-200 dark:border-gray-700">Example Content</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium text-red-600 dark:text-red-400">Header</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Algorithm & token type</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">{`{"alg": "HS256", "typ": "JWT"}`}</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium text-purple-600 dark:text-purple-400">Payload</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Claims (user data, expiration, etc.)</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">{`{"sub": "123", "name": "John"}`}</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-medium text-teal-600 dark:text-teal-400">Signature</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700">Cryptographic signature</td>
                  <td className="p-3 border border-gray-200 dark:border-gray-700 font-mono text-xs">HMACSHA256(header + payload, secret)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Common Claims Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Common JWT Claims
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { claim: 'iss', name: 'Issuer', desc: 'Who issued the token (e.g., auth server URL)' },
            { claim: 'sub', name: 'Subject', desc: 'Who the token is about (e.g., user ID)' },
            { claim: 'aud', name: 'Audience', desc: 'Intended recipient (e.g., API URL)' },
            { claim: 'exp', name: 'Expiration', desc: 'When the token expires (Unix timestamp)' },
            { claim: 'nbf', name: 'Not Before', desc: 'Token not valid before this time' },
            { claim: 'iat', name: 'Issued At', desc: 'When the token was issued' },
          ].map((item) => (
            <div key={item.claim} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <code className="text-teal-600 dark:text-teal-400 font-mono text-sm font-bold">{item.claim}</code>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Need to format JSON data? Try our{' '}
          <Link
            href="/tools/json-formatter-viewer"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            JSON Formatter & Viewer
          </Link>
          . Working with Base64 encoding? Use our{' '}
          <Link
            href="/tools/base64-encoder-decoder"
            className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200"
          >
            Base64 Encoder/Decoder
          </Link>
          .
        </p>
      </section>

      {/* FAQ Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What is a JWT and how does it work?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              A JSON Web Token (JWT) is a compact, URL-safe way to represent claims between two parties.
              It&apos;s commonly used for authentication - after logging in, a server issues a JWT that the
              client stores and sends with subsequent requests. The token contains encoded JSON data
              (claims) and a cryptographic signature to verify its authenticity.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Why doesn&apos;t this tool verify signatures?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Signature verification requires the secret key (for HMAC) or public key (for RSA/ECDSA),
              which should never be exposed to client-side code. This tool is designed for debugging
              and inspection only. In production, always verify JWT signatures on your backend server
              using the appropriate keys.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Is it safe to paste my JWT here?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes, this tool runs entirely in your browser. Your JWT is never sent to any server.
              However, be cautious about sharing JWTs in general - they often contain sensitive
              information and can be used to impersonate users if not expired. For testing, consider
              using expired tokens or tokens from development environments.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              What do the timestamp claims mean?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              JWT timestamps are Unix timestamps (seconds since Jan 1, 1970). <code>exp</code> is when
              the token expires and should no longer be accepted. <code>iat</code> is when it was issued.
              <code>nbf</code> (not before) means the token shouldn&apos;t be accepted before this time.
              This tool automatically converts these to human-readable dates.
            </p>
          </details>

          <details className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 cursor-pointer group">
            <summary className="font-semibold text-gray-900 dark:text-white flex items-center justify-between">
              Can anyone read the contents of a JWT?
              <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Yes! JWTs are encoded, not encrypted. Anyone with the token can decode and read its contents.
              The signature only ensures the token hasn&apos;t been tampered with - it doesn&apos;t hide the data.
              Never put sensitive information like passwords in a JWT. If you need encrypted tokens,
              consider JWE (JSON Web Encryption) instead.
            </p>
          </details>
        </div>
      </section>
    </ToolLayout>
  );
}
