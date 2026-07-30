import React, { useEffect } from 'react';

interface JsonLdHeadProps {
  currentPath: string;
}

export const JsonLdHead: React.FC<JsonLdHeadProps> = ({ currentPath }) => {
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://walgroup.com';
    const canonicalUrl = `${origin}${currentPath}`;

    // 1. Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'Wal Group',
      alternateName: [
        'Wal Group Operations',
        'Wal Group Logistics & BPO Outsourcing',
        'Wal Group Amazon DSP & AFP Support'
      ],
      url: origin,
      logo: `${origin}/logo.png`,
      email: 'thewalgroupinfo@gmail.com',
      telephone: '+91-80-4567-8900',
      description: 'Wal Group is a premier business operations and outsourcing company providing 24/7 dispatching, Amazon DSP & AFP support, BPO virtual assistants, and web development services globally.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '55, 100 Feet Road, Indiranagar',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560038',
        addressCountry: 'IN'
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'thewalgroupinfo@gmail.com',
          availableLanguage: ['English']
        },
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: 'thewalgroupinfo@gmail.com',
          availableLanguage: ['English']
        }
      ],
      sameAs: [
        'https://www.linkedin.com/company/walgroup',
        'https://www.facebook.com/walgroup'
      ]
    };

    // 2. ProfessionalService Schema
    const professionalServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${origin}/#professionalservice`,
      name: 'Wal Group - Logistics & BPO Services',
      url: origin,
      image: `${origin}/og-image.jpg`,
      telephone: '+91-80-4567-8900',
      email: 'thewalgroupinfo@gmail.com',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '55, 100 Feet Road, Indiranagar',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560038',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '12.9784',
        longitude: '77.6408'
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ],
        opens: '00:00',
        closes: '23:59'
      },
      areaServed: ['United States', 'Canada', 'India', 'Worldwide'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Wal Group Logistics & BPO Operations Services Catalog',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Amazon DSP 24/7 Dispatch Support',
              description: 'Cortex, Geotab, Netradyne, eMaint dispatching and real-time driver tracking.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Amazon Freight Partner (AFP) Support',
              description: 'Relay portal dispatching, 12-step POD management, dedicated lane optimization, 24/7 HOS monitoring.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Amazon DSP Pay Statement Accounting & Payroll',
              description: '14-day pay statement line-by-line reconciliation, damage audits, ADP & Gusto integration.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Driver Recruitment & HR Onboarding',
              description: 'High-volume driver recruitment, background screening, candidate funnel management.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'BPO & Dedicated Virtual Assistants',
              description: '24/7 remote administrative support, customer care, data entry, and back-office operations.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Website Design & Web Development',
              description: 'Custom React enterprise web application development, conversion optimization, and SEO.'
            }
          }
        ]
      }
    };

    // 3. Page-Specific WebPage or Service Schema
    let pageSpecificSchema: Record<string, any> | null = null;

    if (currentPath.includes('dsp') || currentPath.includes('afp') || currentPath.includes('bpo') || currentPath.includes('virtual-assistants') || currentPath.includes('website-design') || currentPath.includes('marketing')) {
      pageSpecificSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${canonicalUrl}/#service`,
        url: canonicalUrl,
        name: document.title,
        provider: {
          '@type': 'Organization',
          name: 'Wal Group',
          url: origin
        },
        areaServed: 'Worldwide',
        serviceType: currentPath.includes('dsp') ? 'Amazon DSP Support' : currentPath.includes('afp') ? 'Amazon Freight Partner Support' : 'BPO & Web Services'
      };
    } else {
      pageSpecificSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${canonicalUrl}/#webpage`,
        url: canonicalUrl,
        name: document.title,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Wal Group',
          url: origin
        }
      };
    }

    // Helper to inject script tag
    const injectJsonLd = (id: string, data: object) => {
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(data);
    };

    injectJsonLd('json-ld-organization', organizationSchema);
    injectJsonLd('json-ld-[#professionalservice]', professionalServiceSchema);
    if (pageSpecificSchema) {
      injectJsonLd('json-ld-page-schema', pageSpecificSchema);
    }
  }, [currentPath]);

  return null;
};
