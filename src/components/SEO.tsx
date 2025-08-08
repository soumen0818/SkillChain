import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
}

export default function SEO({ title, description, canonical, structuredData }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', description);

    // Canonical link
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || window.location.href);

    // Structured data (JSON-LD)
    const existing = document.getElementById('seo-structured-data');
    if (existing) existing.remove();

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'seo-structured-data';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, structuredData]);

  return null;
}
