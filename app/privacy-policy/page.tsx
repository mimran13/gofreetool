import { Metadata } from "next";
import { privacyMetadata } from "@/lib/seo";

export const metadata: Metadata = privacyMetadata;

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📋 Overview
              </h2>
              <p>
                At gofreetool.com, we are committed to protecting your privacy.
                This Privacy Policy explains how we handle your data when you use
                our website and tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🚫 No Personal Data Collection
              </h2>
              <p>
                We <strong>do not collect</strong> any personal information such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Names or email addresses</li>
                <li>Phone numbers or addresses</li>
                <li>Payment information</li>
                <li>User accounts or logins</li>
                <li>IP addresses or device information</li>
              </ul>
              <p className="mt-4">
                You can use all our tools completely anonymously, with no signup
                required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                💾 How Your Data Is Processed
              </h2>
              <p>
                All calculations and text processing happen <strong>entirely in your browser</strong>. This means:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Your loan amounts, personal measurements, and text data never
                  leave your device
                </li>
                <li>We never store, log, or transmit any calculation inputs</li>
                <li>
                  You can use our tools completely offline after the page loads
                </li>
                <li>Your data is not sent to any server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🍪 Cookies
              </h2>
              <p>
                We currently only use <strong>essential cookies</strong> to store your cookie consent preference. No tracking or analytics cookies are used at this time.
              </p>
              <p className="mt-4">
                <strong>What we might use in the future:</strong> We may add analytics
                cookies in the future to understand how users interact with our
                tools. We will always ask for your consent first.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🔒 Security
              </h2>
              <p>
                Since we don't collect or store any personal data, there's
                nothing to compromise. Your data remains on your device and is
                protected by your own computer's security measures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📧 Contact
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please reach out to us at:
              </p>
              <p className="font-mono bg-gray-100 p-3 rounded inline-block">
                support@gofreetool.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📅 Last Updated
              </h2>
              <p>This Privacy Policy was last updated on February 2, 2026.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
