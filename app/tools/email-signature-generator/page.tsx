'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';

export default function EmailSignatureGenerator() {
  const tool = getToolBySlug('email-signature-generator');
  const [name, setName] = useState('John Smith');
  const [title, setTitle] = useState('Software Developer');
  const [company, setCompany] = useState('Tech Company');
  const [email, setEmail] = useState('john@company.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [website, setWebsite] = useState('www.company.com');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [copied, setCopied] = useState(false);

  const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tr>
    <td style="padding-right: 15px; border-right: 3px solid ${primaryColor};">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 18px; font-weight: bold; color: ${primaryColor};">${name}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; color: #666666; padding-top: 2px;">${title}</td>
        </tr>
        <tr>
          <td style="font-size: 13px; font-weight: bold; color: #333333; padding-top: 2px;">${company}</td>
        </tr>
      </table>
    </td>
    <td style="padding-left: 15px;">
      <table cellpadding="0" cellspacing="0" border="0">
        ${email ? `<tr><td style="font-size: 13px; padding: 2px 0;"><a href="mailto:${email}" style="color: #333333; text-decoration: none;">${email}</a></td></tr>` : ''}
        ${phone ? `<tr><td style="font-size: 13px; padding: 2px 0; color: #333333;">${phone}</td></tr>` : ''}
        ${website ? `<tr><td style="font-size: 13px; padding: 2px 0;"><a href="https://${website}" style="color: ${primaryColor}; text-decoration: none;">${website}</a></td></tr>` : ''}
        ${linkedin || twitter ? `
        <tr>
          <td style="padding-top: 5px;">
            ${linkedin ? `<a href="https://linkedin.com/in/${linkedin}" style="color: #0077b5; text-decoration: none; margin-right: 10px;">LinkedIn</a>` : ''}
            ${twitter ? `<a href="https://twitter.com/${twitter}" style="color: #1da1f2; text-decoration: none;">Twitter</a>` : ''}
          </td>
        </tr>` : ''}
      </table>
    </td>
  </tr>
</table>`.trim();

  const copyHtml = useCallback(async () => {
    await navigator.clipboard.writeText(signatureHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [signatureHtml]);

  const copyRichText = useCallback(async () => {
    try {
      const blob = new Blob([signatureHtml], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({ 'text/html': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback to HTML copy
      copyHtml();
    }
  }, [signatureHtml, copyHtml]);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Create a <strong>professional HTML email signature</strong> for Gmail, Outlook, and other
          email clients. Customize your contact info, colors, and social links.
          <strong> Copy and paste</strong> directly into your email settings.
        </p>
      </section>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Your Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.yoursite.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn Username</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="johndoe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Twitter Handle</label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="johndoe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
            <div className="p-6 bg-white rounded-lg border border-gray-200 mb-4">
              <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyRichText}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
              >
                {copied ? 'Copied!' : 'Copy Signature'}
              </button>
              <button
                onClick={copyHtml}
                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium"
              >
                Copy HTML
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">How to Add Your Signature</h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• <strong>Gmail:</strong> Settings → See all settings → Signature → Paste</li>
          <li>• <strong>Outlook:</strong> Settings → Mail → Compose and reply → Email signature</li>
          <li>• <strong>Apple Mail:</strong> Preferences → Signatures → Create new → Paste</li>
        </ul>
      </div>
    </ToolLayout>
  );
}
