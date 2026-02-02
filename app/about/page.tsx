import { Metadata } from "next";
import { aboutMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = aboutMetadata;

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎯 Our Mission
              </h2>
              <p className="leading-relaxed">
                At gofreetool.com, we believe essential tools should be free and
                accessible to everyone. Our mission is to provide simple, fast, and
                reliable calculators and utilities that help people in their
                everyday lives—no signup, no ads, no nonsense.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💡 Why We Started
              </h2>
              <p className="leading-relaxed">
                We got tired of finding tools that were cluttered with ads,
                required signups, or sold data. We decided to build something
                different: tools that are simple, private, and honest.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✨ What Makes Us Different
              </h2>
              <ul className="space-y-3 ml-4">
                <li className="flex gap-3">
                  <span>✅</span>
                  <span>
                    <strong>Completely Free</strong> — No hidden costs, no premium
                    features
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✅</span>
                  <span>
                    <strong>No Account Required</strong> — Use instantly without
                    registration
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✅</span>
                  <span>
                    <strong>No Ads (Yet)</strong> — Pure, distraction-free tools
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✅</span>
                  <span>
                    <strong>Privacy First</strong> — Everything is calculated in your
                    browser. We never collect your data.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✅</span>
                  <span>
                    <strong>Works Offline</strong> — Use tools even without internet
                    after loading
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Our Tools
              </h2>
              <p className="leading-relaxed mb-4">
                Currently, we offer calculators in three categories:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/category/calculators" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <h3 className="font-bold text-gray-900">🧮 Calculators</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    EMI, loan, and financial calculators
                  </p>
                </Link>
                <Link href="/category/health" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <h3 className="font-bold text-gray-900">❤️ Health</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    BMI and health-related calculators
                  </p>
                </Link>
                <Link href="/category/writing" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <h3 className="font-bold text-gray-900">✍️ Writing</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Word counter and text analysis tools
                  </p>
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🛣️ Roadmap
              </h2>
              <p className="leading-relaxed mb-4">
                We're constantly working on new tools:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex gap-2">
                  <span>📌</span>
                  <span>Unit converters (temperature, distance, weight, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <span>📌</span>
                  <span>CGPA & GPA calculators</span>
                </li>
                <li className="flex gap-2">
                  <span>📌</span>
                  <span>Age calculator</span>
                </li>
                <li className="flex gap-2">
                  <span>📌</span>
                  <span>Password generator</span>
                </li>
                <li className="flex gap-2">
                  <span>📌</span>
                  <span>JSON & code formatters</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🤝 Get in Touch
              </h2>
              <p className="leading-relaxed mb-4">
                Have feedback? Found a bug? Want to suggest a new tool?
              </p>
              <p>
                Reach out to us at:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  support@gofreetool.com
                </span>
              </p>
            </section>

            <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🙏 Thank You
              </h2>
              <p className="leading-relaxed">
                Thank you for using gofreetool.com. We're grateful for your trust
                and support. Please share this with anyone who might find our tools
                helpful!
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
