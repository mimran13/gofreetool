import { Metadata } from "next";

const siteConfig = {
  name: "gofreetool.com",
  description: "Free Daily-Use Tools — No Signup Required",
  url: "https://gofreetool.com",
  ogImage: "https://gofreetool.com/og-image.png",
  twitter: "@gofreetool",
};

export function generateMetadata(
  title: string,
  description: string,
  keywords: string[] = [],
  path: string = "/"
): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, "free tools", "no signup", "online tools"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "GoFreeTool",
      type: "website",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitter,
      title: fullTitle,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitter,
    },
    metadataBase: new URL(siteConfig.url),
  };
}

export const homepageMetadata: Metadata = generateMetadata(
  "Free Daily-Use Tools & Calculators",
  "Simple, free calculators and utilities for everyday life. EMI calculator, BMI calculator, word counter, and more. No signup required.",
  [
    "free tools",
    "calculators",
    "online tools",
    "emi calculator",
    "bmi calculator",
    "word counter",
  ],
  "/"
);

export const privacyMetadata: Metadata = generateMetadata(
  "Privacy Policy",
  "Privacy policy for gofreetool.com. We respect your privacy and do not collect personal data.",
  ["privacy policy", "data protection"],
  "/privacy-policy"
);

export const cookieMetadata: Metadata = generateMetadata(
  "Cookie Policy",
  "Cookie policy for gofreetool.com. Learn about the cookies we use.",
  ["cookie policy"],
  "/cookie-policy"
);

export const aboutMetadata: Metadata = generateMetadata(
  "About Us",
  "Learn about gofreetool.com - a collection of free, easy-to-use tools for everyday tasks.",
  ["about us"],
  "/about"
);
