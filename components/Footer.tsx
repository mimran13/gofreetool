import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">gofreetool</h3>
            <p className="text-sm text-gray-400">
              Free daily-use tools and calculators for everyone. No signup required.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tools/emi-calculator"
                  className="hover:text-teal-400 transition-colors"
                >
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/bmi-calculator"
                  className="hover:text-teal-400 transition-colors"
                >
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/word-counter"
                  className="hover:text-teal-400 transition-colors"
                >
                  Word Counter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/calculators"
                  className="hover:text-teal-400 transition-colors"
                >
                  Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/category/health"
                  className="hover:text-teal-400 transition-colors"
                >
                  Health
                </Link>
              </li>
              <li>
                <Link
                  href="/category/writing"
                  className="hover:text-teal-400 transition-colors"
                >
                  Writing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-teal-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie-policy"
                  className="hover:text-teal-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-teal-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {currentYear} gofreetool.com. All rights reserved. Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
