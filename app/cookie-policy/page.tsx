import { Metadata } from "next";
import { cookieMetadata } from "@/lib/seo";

export const metadata: Metadata = cookieMetadata;

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Cookie Policy
          </h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🍪 What Are Cookies?
              </h2>
              <p>
                Cookies are small text files stored on your device when you visit
                a website. They help websites remember information about your visit
                and improve your experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🔍 How We Use Cookies
              </h2>
              <p>
                <strong>Currently:</strong> We only use essential cookies to store
                your cookie consent preference. This helps us remember your choice
                so we don't show the banner every time you visit.
              </p>
              <p className="mt-4">
                <strong>In the future:</strong> We may add:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Analytics Cookies</strong> - to understand how you use our
                  tools (page views, clicks, etc.)
                </li>
                <li>
                  <strong>Advertising Cookies</strong> - to show you relevant ads
                </li>
              </ul>
              <p className="mt-4">
                We will always ask for your permission before using any new cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                ✅ Our Cookie Promise
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No tracking cookies without your consent</li>
                <li>No personal data collected via cookies</li>
                <li>You can always change your cookie preferences</li>
                <li>Cookies expire after 1 year</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                🚫 Cookie Opt-Out
              </h2>
              <p>
                You can control cookies through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The cookie consent banner on this website</li>
                <li>Your browser settings (most browsers allow you to disable cookies)</li>
                <li>Third-party cookie management tools</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> Disabling essential cookies may affect the
                functionality of our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📝 Cookie Details
              </h2>
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-3 text-left">
                      Cookie Name
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Purpose
                    </th>
                    <th className="border border-gray-300 p-3 text-left">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">
                      cookie-consent
                    </td>
                    <td className="border border-gray-300 p-3">
                      Stores your cookie preference
                    </td>
                    <td className="border border-gray-300 p-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📧 Contact
              </h2>
              <p>
                Questions about our cookie policy? Reach out to us at:
              </p>
              <p className="font-mono bg-gray-100 p-3 rounded inline-block">
                support@gofreetool.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                📅 Last Updated
              </h2>
              <p>This Cookie Policy was last updated on February 2, 2026.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
