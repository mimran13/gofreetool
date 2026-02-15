export default function HomepageSchema() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GoFreeTool",
    alternateName: "gofreetool.com",
    url: "https://gofreetool.com",
    description: "Free online tools and calculators for everyday life. No signup required.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://gofreetool.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GoFreeTool",
    url: "https://gofreetool.com",
    logo: "https://gofreetool.com/icons/icon-512.png",
    description: "Free online tools and calculators. No signup, no ads, 100% private.",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://gofreetool.com/about",
    },
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Free Online Tools & Calculators",
    description: "Browse 120+ free online tools including calculators, converters, generators, and more.",
    url: "https://gofreetool.com",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Calculators",
          url: "https://gofreetool.com/category/calculators",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Developer Tools",
          url: "https://gofreetool.com/category/developer-tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Text Tools",
          url: "https://gofreetool.com/category/writing-text",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Converters",
          url: "https://gofreetool.com/category/unit-converters",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </>
  );
}
