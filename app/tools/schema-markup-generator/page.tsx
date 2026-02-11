'use client';

import { useState, useCallback } from 'react';
import { getToolBySlug } from '@/lib/tools';
import ToolLayout from '@/components/ToolLayout';
import Link from 'next/link';

type SchemaType = 'Article' | 'Product' | 'FAQ' | 'Organization' | 'LocalBusiness' | 'Person' | 'Event' | 'Recipe' | 'WebSite' | 'BreadcrumbList';

interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

const schemaTypes: { value: SchemaType; label: string; icon: string }[] = [
  { value: 'Article', label: 'Article', icon: '📰' },
  { value: 'Product', label: 'Product', icon: '🛍️' },
  { value: 'FAQ', label: 'FAQ Page', icon: '❓' },
  { value: 'Organization', label: 'Organization', icon: '🏢' },
  { value: 'LocalBusiness', label: 'Local Business', icon: '📍' },
  { value: 'Person', label: 'Person', icon: '👤' },
  { value: 'Event', label: 'Event', icon: '📅' },
  { value: 'Recipe', label: 'Recipe', icon: '🍳' },
  { value: 'WebSite', label: 'Website', icon: '🌐' },
  { value: 'BreadcrumbList', label: 'Breadcrumbs', icon: '🔗' },
];

export default function SchemaMarkupGenerator() {
  const tool = getToolBySlug('schema-markup-generator');
  const [schemaType, setSchemaType] = useState<SchemaType>('Article');
  const [copied, setCopied] = useState(false);

  // Article fields
  const [articleHeadline, setArticleHeadline] = useState('');
  const [articleDescription, setArticleDescription] = useState('');
  const [articleImage, setArticleImage] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articlePublisher, setArticlePublisher] = useState('');
  const [articlePublisherLogo, setArticlePublisherLogo] = useState('');
  const [articleDatePublished, setArticleDatePublished] = useState('');
  const [articleDateModified, setArticleDateModified] = useState('');

  // Product fields
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productSku, setProductSku] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCurrency, setProductCurrency] = useState('USD');
  const [productAvailability, setProductAvailability] = useState('InStock');
  const [productRating, setProductRating] = useState('');
  const [productReviewCount, setProductReviewCount] = useState('');

  // FAQ fields
  const [faqItems, setFaqItems] = useState<FAQItem[]>([{ question: '', answer: '' }]);

  // Organization fields
  const [orgName, setOrgName] = useState('');
  const [orgUrl, setOrgUrl] = useState('');
  const [orgLogo, setOrgLogo] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgCity, setOrgCity] = useState('');
  const [orgState, setOrgState] = useState('');
  const [orgZip, setOrgZip] = useState('');
  const [orgCountry, setOrgCountry] = useState('');

  // Local Business specific
  const [businessType, setBusinessType] = useState('LocalBusiness');
  const [businessPriceRange, setBusinessPriceRange] = useState('');
  const [businessOpeningHours, setBusinessOpeningHours] = useState('');

  // Person fields
  const [personName, setPersonName] = useState('');
  const [personJobTitle, setPersonJobTitle] = useState('');
  const [personUrl, setPersonUrl] = useState('');
  const [personImage, setPersonImage] = useState('');
  const [personEmail, setPersonEmail] = useState('');
  const [personSameAs, setPersonSameAs] = useState('');

  // Event fields
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [eventPerformer, setEventPerformer] = useState('');
  const [eventOfferPrice, setEventOfferPrice] = useState('');
  const [eventOfferCurrency, setEventOfferCurrency] = useState('USD');

  // Recipe fields
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [recipeAuthor, setRecipeAuthor] = useState('');
  const [recipePrepTime, setRecipePrepTime] = useState('');
  const [recipeCookTime, setRecipeCookTime] = useState('');
  const [recipeYield, setRecipeYield] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');

  // Website fields
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [siteSearchUrl, setSiteSearchUrl] = useState('');

  // Breadcrumb fields
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: 'Home', url: '' }]);

  const generateSchema = useCallback((): object | null => {
    switch (schemaType) {
      case 'Article':
        if (!articleHeadline) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: articleHeadline,
          ...(articleDescription && { description: articleDescription }),
          ...(articleImage && { image: articleImage }),
          ...(articleAuthor && { author: { '@type': 'Person', name: articleAuthor } }),
          ...(articlePublisher && {
            publisher: {
              '@type': 'Organization',
              name: articlePublisher,
              ...(articlePublisherLogo && { logo: { '@type': 'ImageObject', url: articlePublisherLogo } }),
            },
          }),
          ...(articleDatePublished && { datePublished: articleDatePublished }),
          ...(articleDateModified && { dateModified: articleDateModified }),
        };

      case 'Product':
        if (!productName) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productName,
          ...(productDescription && { description: productDescription }),
          ...(productImage && { image: productImage }),
          ...(productBrand && { brand: { '@type': 'Brand', name: productBrand } }),
          ...(productSku && { sku: productSku }),
          ...(productPrice && {
            offers: {
              '@type': 'Offer',
              price: productPrice,
              priceCurrency: productCurrency,
              availability: `https://schema.org/${productAvailability}`,
            },
          }),
          ...(productRating && productReviewCount && {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: productRating,
              reviewCount: productReviewCount,
            },
          }),
        };

      case 'FAQ':
        const validFaqs = faqItems.filter(f => f.question && f.answer);
        if (validFaqs.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: validFaqs.map(faq => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };

      case 'Organization':
        if (!orgName) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: orgName,
          ...(orgUrl && { url: orgUrl }),
          ...(orgLogo && { logo: orgLogo }),
          ...(orgDescription && { description: orgDescription }),
          ...(orgPhone && { telephone: orgPhone }),
          ...(orgEmail && { email: orgEmail }),
          ...((orgAddress || orgCity) && {
            address: {
              '@type': 'PostalAddress',
              ...(orgAddress && { streetAddress: orgAddress }),
              ...(orgCity && { addressLocality: orgCity }),
              ...(orgState && { addressRegion: orgState }),
              ...(orgZip && { postalCode: orgZip }),
              ...(orgCountry && { addressCountry: orgCountry }),
            },
          }),
        };

      case 'LocalBusiness':
        if (!orgName) return null;
        return {
          '@context': 'https://schema.org',
          '@type': businessType,
          name: orgName,
          ...(orgUrl && { url: orgUrl }),
          ...(orgLogo && { image: orgLogo }),
          ...(orgDescription && { description: orgDescription }),
          ...(orgPhone && { telephone: orgPhone }),
          ...(orgEmail && { email: orgEmail }),
          ...(businessPriceRange && { priceRange: businessPriceRange }),
          ...(businessOpeningHours && { openingHours: businessOpeningHours }),
          ...((orgAddress || orgCity) && {
            address: {
              '@type': 'PostalAddress',
              ...(orgAddress && { streetAddress: orgAddress }),
              ...(orgCity && { addressLocality: orgCity }),
              ...(orgState && { addressRegion: orgState }),
              ...(orgZip && { postalCode: orgZip }),
              ...(orgCountry && { addressCountry: orgCountry }),
            },
          }),
        };

      case 'Person':
        if (!personName) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: personName,
          ...(personJobTitle && { jobTitle: personJobTitle }),
          ...(personUrl && { url: personUrl }),
          ...(personImage && { image: personImage }),
          ...(personEmail && { email: personEmail }),
          ...(personSameAs && { sameAs: personSameAs.split(',').map(s => s.trim()) }),
        };

      case 'Event':
        if (!eventName || !eventStartDate) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: eventName,
          startDate: eventStartDate,
          ...(eventEndDate && { endDate: eventEndDate }),
          ...(eventDescription && { description: eventDescription }),
          ...(eventLocation && {
            location: {
              '@type': 'Place',
              name: eventLocation,
            },
          }),
          ...(eventUrl && { url: eventUrl }),
          ...(eventImage && { image: eventImage }),
          ...(eventPerformer && {
            performer: {
              '@type': 'Person',
              name: eventPerformer,
            },
          }),
          ...(eventOfferPrice && {
            offers: {
              '@type': 'Offer',
              price: eventOfferPrice,
              priceCurrency: eventOfferCurrency,
            },
          }),
        };

      case 'Recipe':
        if (!recipeName) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'Recipe',
          name: recipeName,
          ...(recipeDescription && { description: recipeDescription }),
          ...(recipeImage && { image: recipeImage }),
          ...(recipeAuthor && { author: { '@type': 'Person', name: recipeAuthor } }),
          ...(recipePrepTime && { prepTime: `PT${recipePrepTime}M` }),
          ...(recipeCookTime && { cookTime: `PT${recipeCookTime}M` }),
          ...(recipeYield && { recipeYield: recipeYield }),
          ...(recipeIngredients && { recipeIngredient: recipeIngredients.split('\n').filter(i => i.trim()) }),
          ...(recipeInstructions && {
            recipeInstructions: recipeInstructions.split('\n').filter(i => i.trim()).map(step => ({
              '@type': 'HowToStep',
              text: step,
            })),
          }),
        };

      case 'WebSite':
        if (!siteName || !siteUrl) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteName,
          url: siteUrl,
          ...(siteSearchUrl && {
            potentialAction: {
              '@type': 'SearchAction',
              target: `${siteSearchUrl}{search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        };

      case 'BreadcrumbList':
        const validBreadcrumbs = breadcrumbs.filter(b => b.name && b.url);
        if (validBreadcrumbs.length === 0) return null;
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: validBreadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })),
        };

      default:
        return null;
    }
  }, [
    schemaType, articleHeadline, articleDescription, articleImage, articleAuthor,
    articlePublisher, articlePublisherLogo, articleDatePublished, articleDateModified,
    productName, productDescription, productImage, productBrand, productSku,
    productPrice, productCurrency, productAvailability, productRating, productReviewCount,
    faqItems, orgName, orgUrl, orgLogo, orgDescription, orgPhone, orgEmail,
    orgAddress, orgCity, orgState, orgZip, orgCountry, businessType, businessPriceRange,
    businessOpeningHours, personName, personJobTitle, personUrl, personImage, personEmail,
    personSameAs, eventName, eventDescription, eventStartDate, eventEndDate, eventLocation,
    eventUrl, eventImage, eventPerformer, eventOfferPrice, eventOfferCurrency,
    recipeName, recipeDescription, recipeImage, recipeAuthor, recipePrepTime, recipeCookTime,
    recipeYield, recipeIngredients, recipeInstructions, siteName, siteUrl, siteSearchUrl, breadcrumbs,
  ]);

  const schema = generateSchema();
  const output = schema
    ? `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`
    : '<!-- Fill in the required fields to generate schema markup -->';

  const handleCopy = useCallback(async () => {
    if (!schema) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output, schema]);

  const addFaqItem = useCallback(() => {
    setFaqItems(prev => [...prev, { question: '', answer: '' }]);
  }, []);

  const updateFaqItem = useCallback((index: number, field: 'question' | 'answer', value: string) => {
    setFaqItems(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }, []);

  const removeFaqItem = useCallback((index: number) => {
    setFaqItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addBreadcrumb = useCallback(() => {
    setBreadcrumbs(prev => [...prev, { name: '', url: '' }]);
  }, []);

  const updateBreadcrumb = useCallback((index: number, field: 'name' | 'url', value: string) => {
    setBreadcrumbs(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }, []);

  const removeBreadcrumb = useCallback((index: number) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index));
  }, []);

  if (!tool) return <div>Tool not found</div>;

  return (
    <ToolLayout tool={tool}>
      {/* Introduction */}
      <section className="mb-8">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Generate <strong>JSON-LD structured data</strong> markup for rich snippets in search results.
          Choose from Article, Product, FAQ, Organization, Local Business, and more schema types.
          Copy the generated code and add it to your webpage&apos;s {"<head>"} section.
          <strong> All processing happens in your browser</strong> — your data is never sent to any server.
        </p>
      </section>

      {/* Main Tool */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        {/* Schema Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Schema Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {schemaTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setSchemaType(type.value)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  schemaType === type.value
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fields Based on Schema Type */}
        <div className="space-y-4 mb-8">
          {/* Article Fields */}
          {schemaType === 'Article' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={articleHeadline}
                  onChange={(e) => setArticleHeadline(e.target.value)}
                  placeholder="Article Title"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={articleDescription}
                  onChange={(e) => setArticleDescription(e.target.value)}
                  placeholder="Brief description of the article"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={articleAuthor}
                    onChange={(e) => setArticleAuthor(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={articleImage}
                    onChange={(e) => setArticleImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher Name</label>
                  <input
                    type="text"
                    value={articlePublisher}
                    onChange={(e) => setArticlePublisher(e.target.value)}
                    placeholder="Company Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher Logo URL</label>
                  <input
                    type="url"
                    value={articlePublisherLogo}
                    onChange={(e) => setArticlePublisherLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Published</label>
                  <input
                    type="date"
                    value={articleDatePublished}
                    onChange={(e) => setArticleDatePublished(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Modified</label>
                  <input
                    type="date"
                    value={articleDateModified}
                    onChange={(e) => setArticleDateModified(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Product Fields */}
          {schemaType === 'Product' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Product description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productBrand}
                    onChange={(e) => setProductBrand(e.target.value)}
                    placeholder="Brand Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
                  <input
                    type="text"
                    value={productSku}
                    onChange={(e) => setProductSku(e.target.value)}
                    placeholder="SKU-12345"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="https://example.com/product.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="29.99"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <select
                    value={productCurrency}
                    onChange={(e) => setProductCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                  <select
                    value={productAvailability}
                    onChange={(e) => setProductAvailability(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="InStock">In Stock</option>
                    <option value="OutOfStock">Out of Stock</option>
                    <option value="PreOrder">Pre-Order</option>
                    <option value="LimitedAvailability">Limited</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={productRating}
                    onChange={(e) => setProductRating(e.target.value)}
                    placeholder="4.5"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Review Count</label>
                  <input
                    type="number"
                    value={productReviewCount}
                    onChange={(e) => setProductReviewCount(e.target.value)}
                    placeholder="125"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* FAQ Fields */}
          {schemaType === 'FAQ' && (
            <>
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      {faqItems.length > 1 && (
                        <button
                          onClick={() => removeFaqItem(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                      placeholder="Enter your question"
                      className="w-full px-4 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                      placeholder="Enter the answer"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addFaqItem}
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700"
              >
                + Add Question
              </button>
            </>
          )}

          {/* Organization/LocalBusiness Fields */}
          {(schemaType === 'Organization' || schemaType === 'LocalBusiness') && (
            <>
              {schemaType === 'LocalBusiness' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="LocalBusiness">Local Business</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Store">Store</option>
                    <option value="MedicalBusiness">Medical Business</option>
                    <option value="LegalService">Legal Service</option>
                    <option value="FinancialService">Financial Service</option>
                    <option value="RealEstateAgent">Real Estate Agent</option>
                    <option value="AutoDealer">Auto Dealer</option>
                    <option value="BeautySalon">Beauty Salon</option>
                    <option value="Dentist">Dentist</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={orgUrl}
                    onChange={(e) => setOrgUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
                  <input
                    type="url"
                    value={orgLogo}
                    onChange={(e) => setOrgLogo(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    placeholder="+1-555-555-5555"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              {schemaType === 'LocalBusiness' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                    <select
                      value={businessPriceRange}
                      onChange={(e) => setBusinessPriceRange(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select...</option>
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Expensive)</option>
                      <option value="$$$$">$$$$ (Luxury)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={businessOpeningHours}
                      onChange={(e) => setBusinessOpeningHours(e.target.value)}
                      placeholder="Mo-Fr 09:00-17:00"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={orgCity}
                    onChange={(e) => setOrgCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={orgState}
                    onChange={(e) => setOrgState(e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={orgZip}
                    onChange={(e) => setOrgZip(e.target.value)}
                    placeholder="12345"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                  <input
                    type="text"
                    value={orgCountry}
                    onChange={(e) => setOrgCountry(e.target.value)}
                    placeholder="US"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Person Fields */}
          {schemaType === 'Person' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={personJobTitle}
                    onChange={(e) => setPersonJobTitle(e.target.value)}
                    placeholder="Software Engineer"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={personEmail}
                    onChange={(e) => setPersonEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={personUrl}
                    onChange={(e) => setPersonUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={personImage}
                    onChange={(e) => setPersonImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Social Profiles (comma-separated URLs)</label>
                <input
                  type="text"
                  value={personSameAs}
                  onChange={(e) => setPersonSameAs(e.target.value)}
                  placeholder="https://linkedin.com/in/name, https://twitter.com/name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </>
          )}

          {/* Event Fields */}
          {schemaType === 'Event' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Event Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Event description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location Name</label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Venue Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event URL</label>
                  <input
                    type="url"
                    value={eventUrl}
                    onChange={(e) => setEventUrl(e.target.value)}
                    placeholder="https://example.com/event"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={eventImage}
                    onChange={(e) => setEventImage(e.target.value)}
                    placeholder="https://example.com/event.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Performer</label>
                  <input
                    type="text"
                    value={eventPerformer}
                    onChange={(e) => setEventPerformer(e.target.value)}
                    placeholder="Performer Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={eventOfferPrice}
                    onChange={(e) => setEventOfferPrice(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                  <select
                    value={eventOfferCurrency}
                    onChange={(e) => setEventOfferCurrency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Recipe Fields */}
          {schemaType === 'Recipe' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recipe Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Recipe Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={recipeDescription}
                  onChange={(e) => setRecipeDescription(e.target.value)}
                  placeholder="Recipe description"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={recipeAuthor}
                    onChange={(e) => setRecipeAuthor(e.target.value)}
                    placeholder="Chef Name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={recipeImage}
                    onChange={(e) => setRecipeImage(e.target.value)}
                    placeholder="https://example.com/recipe.jpg"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prep Time (minutes)</label>
                  <input
                    type="number"
                    value={recipePrepTime}
                    onChange={(e) => setRecipePrepTime(e.target.value)}
                    placeholder="15"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cook Time (minutes)</label>
                  <input
                    type="number"
                    value={recipeCookTime}
                    onChange={(e) => setRecipeCookTime(e.target.value)}
                    placeholder="30"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yield</label>
                  <input
                    type="text"
                    value={recipeYield}
                    onChange={(e) => setRecipeYield(e.target.value)}
                    placeholder="4 servings"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingredients (one per line)</label>
                <textarea
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instructions (one step per line)</label>
                <textarea
                  value={recipeInstructions}
                  onChange={(e) => setRecipeInstructions(e.target.value)}
                  placeholder="Preheat oven to 350F.&#10;Mix dry ingredients.&#10;Add wet ingredients."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                />
              </div>
            </>
          )}

          {/* WebSite Fields */}
          {schemaType === 'WebSite' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Your Site Name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Site URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search URL Template (for sitelinks searchbox)
                </label>
                <input
                  type="text"
                  value={siteSearchUrl}
                  onChange={(e) => setSiteSearchUrl(e.target.value)}
                  placeholder="https://example.com/search?q="
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty if you don&apos;t have a site search</p>
              </div>
            </>
          )}

          {/* Breadcrumb Fields */}
          {schemaType === 'BreadcrumbList' && (
            <>
              <div className="space-y-2">
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={crumb.name}
                      onChange={(e) => updateBreadcrumb(index, 'name', e.target.value)}
                      placeholder="Page Name"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="url"
                      value={crumb.url}
                      onChange={(e) => updateBreadcrumb(index, 'url', e.target.value)}
                      placeholder="https://example.com/page"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                    />
                    {breadcrumbs.length > 1 && (
                      <button
                        onClick={() => removeBreadcrumb(index)}
                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addBreadcrumb}
                className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700"
              >
                + Add Breadcrumb
              </button>
            </>
          )}
        </div>

        {/* Generated Output */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">💻</span> Generated Schema Markup
            </h3>
            <button
              onClick={handleCopy}
              disabled={!schema}
              className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>

          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap max-h-96">
            {output}
          </pre>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mb-12 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-green-600 text-xl">🔒</span>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">Your Data Stays Private</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              All schema generation happens in your browser. Your business data, product info, and
              content details are never sent to any server.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use Schema Markup
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
          <li><strong>Select a schema type</strong> that matches your content.</li>
          <li><strong>Fill in the required fields</strong> (marked with *).</li>
          <li><strong>Add optional fields</strong> for richer data.</li>
          <li><strong>Copy the generated code</strong> using the button above.</li>
          <li><strong>Paste it in your HTML</strong> inside the {"<head>"} section or before {"</body>"}.</li>
          <li><strong>Test with Google&apos;s tool</strong> at search.google.com/test/rich-results.</li>
        </ol>
      </section>

      {/* Related Tools */}
      <section className="mb-12 p-6 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
        <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Related SEO Tools</h3>
        <p className="text-sm text-teal-700 dark:text-teal-400">
          Generate meta tags with our{' '}
          <Link href="/tools/meta-tag-generator" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Meta Tag Generator
          </Link>{' '}
          or preview social shares with our{' '}
          <Link href="/tools/open-graph-preview" className="font-medium underline hover:text-teal-900 dark:hover:text-teal-200">
            Open Graph Preview
          </Link>.
        </p>
      </section>
    </ToolLayout>
  );
}
