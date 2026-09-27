import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateAllBrochures() {
  const outputDir = path.join(process.cwd(), 'public', 'brochures');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. MASTER WEBSITE SERVICES BROCHURE (2026)
  const masterDoc = await PDFDocument.create();
  const helvetica = await masterDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await masterDoc.embedFont(StandardFonts.HelveticaBold);

  const primaryOrange = rgb(1, 0.4, 0); // #ff6600
  const darkNavy = rgb(0.02, 0.12, 0.26); // #041e42
  const textDark = rgb(0.1, 0.15, 0.2);
  const textMuted = rgb(0.4, 0.45, 0.5);

  // Helper for adding standard master brochure pages
  const addMasterPage = (title: string, subtitle: string, items: { heading: string; body: string }[], footerPage: number) => {
    const page = masterDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    // Top branding bar
    page.drawText('WAL GROUPS', { x: 50, y: height - 50, size: 14, font: helveticaBold, color: darkNavy });
    page.drawText('WEBSITE SERVICES BROCHURE — 2026', { x: width - 250, y: height - 50, size: 9, font: helvetica, color: textMuted });
    page.drawLine({ start: { x: 50, y: height - 60 }, end: { x: width - 50, y: height - 60 }, thickness: 1, color: rgb(0.85, 0.88, 0.92) });

    // Section header
    page.drawText(title, { x: 50, y: height - 100, size: 24, font: helveticaBold, color: darkNavy });
    if (subtitle) {
      page.drawText(subtitle, { x: 50, y: height - 125, size: 12, font: helvetica, color: primaryOrange });
    }

    let yOffset = height - 160;
    for (const item of items) {
      if (yOffset < 100) break;
      page.drawText(item.heading, { x: 50, y: yOffset, size: 13, font: helveticaBold, color: darkNavy });
      yOffset -= 18;
      
      const lines = item.body.split('\n');
      for (const line of lines) {
        page.drawText(line, { x: 50, y: yOffset, size: 10, font: helvetica, color: textDark });
        yOffset -= 15;
      }
      yOffset -= 12;
    }

    // Footer
    page.drawLine({ start: { x: 50, y: 50 }, end: { x: width - 50, y: 50 }, thickness: 0.8, color: rgb(0.85, 0.88, 0.92) });
    page.drawText('thewalgroup.in  |  USA · Canada · UK · Australia · Worldwide', { x: 50, y: 35, size: 9, font: helvetica, color: textMuted });
    page.drawText(`Page ${footerPage} of 18`, { x: width - 110, y: 35, size: 9, font: helvetica, color: textMuted });
  };

  // Page 1: Cover
  const coverPage = masterDoc.addPage([595.28, 841.89]);
  const { width: cW, height: cH } = coverPage.getSize();
  coverPage.drawRectangle({ x: 0, y: 0, width: cW, height: cH, color: rgb(0.02, 0.05, 0.1) });
  coverPage.drawText('WAL GROUPS', { x: 60, y: cH - 80, size: 20, font: helveticaBold, color: rgb(1, 1, 1) });
  coverPage.drawText('WEBSITE SERVICES BROCHURE — 2026', { x: cW - 260, y: cH - 80, size: 10, font: helvetica, color: rgb(0.7, 0.75, 0.8) });
  coverPage.drawText('PROFESSIONAL BUSINESS WEBSITE DEVELOPMENT', { x: 60, y: cH - 160, size: 11, font: helveticaBold, color: primaryOrange });
  coverPage.drawText('Professional websites built for', { x: 60, y: cH - 210, size: 30, font: helveticaBold, color: rgb(1, 1, 1) });
  coverPage.drawText('businesses that move.', { x: 60, y: cH - 250, size: 30, font: helveticaBold, color: primaryOrange });
  coverPage.drawText('Websites that make your business look credible, explain what you do,', { x: 60, y: cH - 300, size: 13, font: helvetica, color: rgb(0.8, 0.85, 0.9) });
  coverPage.drawText('and make it easy for customers to get in touch.', { x: 60, y: cH - 320, size: 13, font: helvetica, color: rgb(0.8, 0.85, 0.9) });
  
  // Highlight box
  coverPage.drawRectangle({ x: 60, y: 150, width: cW - 120, height: 180, color: rgb(0.06, 0.12, 0.22) });
  coverPage.drawText('PACKAGES INCLUDED:', { x: 80, y: 295, size: 11, font: helveticaBold, color: primaryOrange });
  coverPage.drawText('• Starter Website ($399) — Get your business online professionally', { x: 80, y: 270, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Business Website ($699) — Build a stronger online presence & leads (Most Popular)', { x: 80, y: 245, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Growth Website ($999) — Larger, conversion-focused website with advanced SEO', { x: 80, y: 220, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Custom Website ($1,499+) — Digital systems, portals, workflows & integrations', { x: 80, y: 195, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Transportation & Logistics Specialist Architecture Built-In', { x: 80, y: 170, size: 10, font: helvetica, color: primaryOrange });

  coverPage.drawText('thewalgroup.in  |  USA · Canada · UK · Australia · Worldwide', { x: 60, y: 60, size: 10, font: helvetica, color: rgb(0.7, 0.75, 0.8) });

  // Page 2: Who We Are
  addMasterPage('Your website is often the first impression.', 'Make it count.', [
    { heading: 'Who We Are', body: 'Wal Groups is a business services company providing professional website development\nand digital solutions for businesses in the USA, Canada, the UK, Australia and worldwide.\n\nBefore a customer calls, requests a quote or sends an email, they usually look you up.\nWhat they find shapes whether they trust you — and whether they reach out at all.' },
    { heading: 'Our Focus', body: 'We build websites that present your business clearly and professionally, so the people looking\nfor your services can understand what you do and contact you without friction.\n\nWe have particular experience with trucking, transportation and logistics businesses —\nand we build for companies across many other industries too.' },
    { heading: '01 Look Professional', body: 'A credible, well-designed presence that reflects the quality of your work.' },
    { heading: '02 Explain What You Do', body: 'Clear services, service areas and information customers actually look for.' },
    { heading: '03 Make It Easy to Contact You', body: 'Calls, forms, email and WhatsApp visible on every page, on every device.' }
  ], 2);

  // Page 3: What We Build
  addMasterPage('Professional Business Website Development', 'Tailored to your business requirements — designed, built, tested and launched.', [
    { heading: 'Credibility', body: 'Look established and trustworthy from the very first visit.' },
    { heading: 'Professional Presentation', body: 'Clean design and structure that reflects the quality of your work.' },
    { heading: 'Mobile Experience', body: 'Built to work smoothly on phones, tablets and desktops.' },
    { heading: 'Clear Services', body: 'Customers quickly understand what you offer and where.' },
    { heading: 'Contact Opportunities', body: 'Call, email, form and WhatsApp options that are easy to find.' },
    { heading: 'Conversion-Focused Structure', body: 'Pages that guide visitors toward making an enquiry.' }
  ], 3);

  // Page 4: Why Wal Groups
  addMasterPage('Why Wal Groups?', 'Professional quality without unnecessary complexity or inflated pricing.', [
    { heading: '01 Industry Understanding', body: 'We understand trucking, transportation, logistics, Amazon DSP/AFP operations & small fleets.' },
    { heading: '02 Custom Website Design', body: 'Every site is designed around your business, services, fleet, target customers and goals.' },
    { heading: '03 Transparent Pricing', body: 'Clear packages with straightforward pricing and no unnecessary complexity.' },
    { heading: '04 Complete Website Setup', body: 'Design, development, responsive setup, domain configuration, hosting coordination & testing.' },
    { heading: '05 Lead-Focused Design', body: 'Clear calls-to-action, contact forms, phone buttons and enquiry options.' },
    { heading: '06 Direct Communication & Ownership', body: 'Direct team access and full client ownership upon completion according to agreed project terms.' }
  ], 4);

  // Page 5: Industries We Serve
  addMasterPage('Built for Businesses Across Industries', 'With particular experience in transportation and logistics.', [
    { heading: 'Primary Specialization: Transportation & Logistics', body: '• Trucking & Transportation\n• Logistics & Freight Forwarding\n• Towing & Roadside Services\n• Amazon DSP & Delivery Businesses' },
    { heading: 'Construction & Property', body: 'General contractors, commercial builders, real estate firms, facility management and property services.' },
    { heading: 'Automotive & Commercial Services', body: 'Auto repair, fleet maintenance shops, mobile detailing and commercial body shops.' },
    { heading: 'Healthcare & Medical Services', body: 'Clinics, specialized medical transport, regulated medical waste services, and diagnostic practices.' },
    { heading: 'Home & Local Services', body: 'Plumbing, electrical, HVAC contractors, landscaping, and residential cleaning operations.' }
  ], 5);

  // Page 6: Transportation Specialization
  addMasterPage('Transportation & Logistics Specialization', 'Websites structured around how transportation businesses actually operate.', [
    { heading: 'Trucking & Fleet Businesses', body: 'Owner-operators, small & mid-size fleets, regional haulers, and dedicated lane carriers.' },
    { heading: 'Amazon Transportation Partners', body: 'Amazon Delivery Service Partners (DSPs), Amazon Freight Partners (AFPs), and last-mile operations.' },
    { heading: 'Freight Logistics & Dispatch', body: '3PL companies, independent dispatchers, freight brokers, and intermodal logistics firms.' },
    { heading: 'Sections We Build for Transportation', body: '• Services & Freight Types (Dry Van, Reefer, Flatbed, Dedicated Lanes)\n• Fleet & Equipment Specifications\n• Service Areas & Regional Coverage Lanes\n• Driver Recruitment & Application Forms\n• Instant Freight Quote Requests\n• Safety, DOT Compliance & Insurance Credentials\n• 24/7 Click-to-Call Dispatch Controls' }
  ], 6);

  // Page 7: Starter & Business Packages
  addMasterPage('Website Packages — Starter ($399) & Business ($699)', 'Clear packages. Straightforward pricing. All prices in USD.', [
    { heading: 'STARTER WEBSITE — $399 (One-time project fee)', body: 'Get your business online professionally.\n• Up to 5 pages (Home, About, Services, Contact, Fleet/Equipment)\n• 1 revision round | 3–5 business days turnaround\n• Custom business-focused responsive design\n• Contact form, click-to-call, WhatsApp & Google Maps\n• Basic SEO, XML sitemap & Google-friendly structure\n• SSL certificate, 1-year domain & first-year hosting included\n• 30 days post-launch technical support' },
    { heading: 'BUSINESS WEBSITE — $699 (MOST POPULAR)', body: 'Build a stronger online presence and generate more enquiries.\n• Up to 8 pages | 3 revision rounds | 5–7 business days turnaround\n• Everything in Starter, plus:\n• Enhanced SEO & basic keyword research\n• Google Analytics & Google Search Console setup\n• Conversion-focused contact sections & multiple lead capture forms\n• Testimonials / Reviews & FAQ sections\n• Enhanced speed optimization & website enquiry tracking' }
  ], 7);

  // Page 8: Growth & Custom Packages
  addMasterPage('Website Packages — Growth ($999) & Custom ($1,499+)', 'For established businesses ready for advanced systems.', [
    { heading: 'GROWTH WEBSITE — $999', body: 'Build a larger, conversion-focused website with advanced functionality.\n• Up to 12 pages | Unlimited revisions during development | 7–10 business days\n• Everything in Business, plus:\n• Advanced custom design & multiple landing pages\n• Advanced SEO & stronger local SEO setup with schema markup\n• Blog / News setup & booking or quote systems where appropriate\n• Advanced analytics, conversion tracking & performance optimization' },
    { heading: 'CUSTOM WEBSITE — Starting from $1,499+', body: 'A website and digital system built around your specific business requirements.\n• Custom scope | Unlimited in scope | 10–15+ business days\n• Fully custom design, customer portals, membership/login systems\n• E-commerce, custom forms & operational workflows\n• Advanced CRM, API integrations & custom dashboards' }
  ], 8);

  // Page 9: Compare Packages
  addMasterPage('Package Comparison At A Glance', 'Simple, transparent deliverables and structured two-part payment.', [
    { heading: 'Comparison Overview', body: '• Starter ($399): Best for owner-operators & small businesses | Up to 5 pages | 3-5 days\n• Business ($699): Best for growing companies needing leads | Up to 8 pages | 5-7 days\n• Growth ($999): Best for established brands needing SEO | Up to 12 pages | 7-10 days\n• Custom ($1,499+): Best for complex business requirements | Custom pages | 10-15+ days' },
    { heading: 'Revision Structure', body: 'Starter: 1 consolidated round | Business: 3 consolidated rounds\nGrowth: Unlimited during development | Custom: Unlimited within agreed scope' },
    { heading: 'Payment Terms', body: '50% at project start before development begins.\n50% on completion after approval, before final launch / handover.\nPayments accepted via secure PayPal invoice.' }
  ], 9);

  // Page 10: What's Included & SEO
  addMasterPage('Everything Needed to Launch — Handled for You', 'Comprehensive technical foundations and SEO by package.', [
    { heading: 'Standard Inclusions Across All Packages', body: '• Custom layout design tailored to your brand\n• Phone, tablet & desktop responsiveness\n• Contact forms, click-to-call, email & WhatsApp integration\n• 1-year domain registration & first-year hosting included\n• SSL certificate (HTTPS secure connection)\n• Testing, domain connection & go-live launch\n• 30 days post-launch technical support' },
    { heading: 'SEO Built Into Your Website', body: '• Starter: Basic SEO setup, meta titles/descriptions, alt text, XML sitemap\n• Business: Enhanced SEO, keyword research, Search Console submission, internal linking\n• Growth: Advanced SEO, schema markup, local SEO optimization, Google Business Profile guidance' }
  ], 10);

  // Page 11: Lead Generation Features
  addMasterPage('Designed to Turn Website Visitors into Enquiries', 'Functionality and conversion design that makes it simple for customers to contact you.', [
    { heading: 'Starter Lead Features', body: 'Contact page, click-to-call, email button, clear CTA buttons, and basic contact form.' },
    { heading: 'Business Lead Features', body: 'Prominent quote/enquiry forms, WhatsApp direct link, multiple CTA sections, service-specific enquiry buttons, and instant lead notification to your email.' },
    { heading: 'Growth Lead Features', body: 'Advanced multi-step quote forms, multiple lead capture points, service/location-specific CTAs, booking request forms, and third-party CRM lead routing.' }
  ], 11);

  // Page 12: Process
  addMasterPage('Eight Clear Steps. One Point of Contact.', 'From first idea to official launch.', [
    { heading: '01 Discover', body: 'Understand your business, services, customers and requirements.' },
    { heading: '02 Plan', body: 'Structure the website, pages, content and user journey.' },
    { heading: '03 Design', body: 'Create the visual direction and business-focused layout.' },
    { heading: '04 Build', body: 'Develop the agreed website and interactive functionality.' },
    { heading: '05 Review', body: 'You review the website and share structured feedback.' },
    { heading: '06 Test', body: 'Check responsiveness, links, forms, contact functionality and performance.' },
    { heading: '07 Launch', body: 'Connect domain, complete launch requirements and go live.' },
    { heading: '08 Support', body: 'Post-launch 30 days support and optional maintenance.' }
  ], 12);

  // Page 13: Domain, Hosting & Ownership
  addMasterPage('Domain, Hosting & Ownership', 'Transparent from year one onward.', [
    { heading: 'First Year Included', body: '1-year domain registration, first-year hosting, SSL certificate, and launch setup are all included.' },
    { heading: 'Hosting Renewal (After Year One)', body: '• Starter: $79/year\n• Business: $99/year\n• Growth: $129/year\n• Custom: $149+/year\nDomain renewal is separate and charged based on registrar pricing.' },
    { heading: 'Your Website. Your Business.', body: 'Once fully paid, we provide appropriate access to the completed website and assets. You retain full ownership of your domain and content. We never lock you in.' }
  ], 13);

  // Page 14: Maintenance & Support
  addMasterPage('Maintenance & Post-Launch Support', 'After launch, we are still here.', [
    { heading: '30 Days Free Support', body: 'Included with every website: basic technical support, fixes, and launch troubleshooting.' },
    { heading: 'Optional Website Maintenance — $199/year', body: '• Website text and image updates\n• Security checks, backups & SSL monitoring\n• Uptime monitoring & troubleshooting\n• Business-hours updates and existing content refreshes' },
    { heading: 'Why Not Build It Yourself?', body: 'Platforms make DIY possible, but we handle the structure, design, responsive testing, forms, domain connection and launch so you can focus on running your business.' }
  ], 14);

  // Page 15: Selected Work
  addMasterPage('Selected Portfolio Concepts', 'Design and development examples created to demonstrate website capabilities.', [
    { heading: 'ABHI JOBS (Demo / Concept)', body: 'Industry: Jobs & Career Platform\nLive Demo: https://abhijobs.netlify.app\nClean candidate search, skills discovery, job categorization, and employer portal.' },
    { heading: 'M&L Worldwide Logistics (Demo / Concept)', body: 'Industry: Transportation & Logistics\nLive Demo: https://m-l-worldwide-logistics.netlify.app\nFreight tracking, quote request forms, international forwarding & fleet showcase.' },
    { heading: 'Alpine Medical Services (Demo / Concept)', body: 'Industry: Healthcare Waste Management\nLive Demo: https://alpine-medical-services.netlify.app\nStatewide manifest tracking, compliance dossier, and emergency service dispatch.' },
    { heading: 'South DeKalb Towing & Transport (Demo / Concept)', body: 'Industry: Towing & Roadside Services\nLive Demo: https://southdekalb.netlify.app\nEmergency click-to-call, request a tow booking, GPS directions, and fleet overview.' },
    { heading: 'Wal Groups (Our Own Site)', body: 'Live URL: https://thewalgroup.in\nOperations backbone, 24/7 DSP/AFP dispatch, BPO solutions and client portals.' }
  ], 15);

  // Page 16: Website Review & Redesign
  addMasterPage('Already Have a Website? Let\'s Review It.', 'Practical opportunities to improve your existing online presence without an unnecessary rebuild.', [
    { heading: '12 Key Areas We Review', body: '01 Mobile experience & responsiveness\n02 Visual website design & modern aesthetic\n03 Site navigation & user journeys\n04 Contact visibility & reachability\n05 Clear calls-to-action & conversion hooks\n06 Quote / enquiry submission workflow\n07 Services presentation & clarity\n08 Fleet & equipment presentation\n09 Trust, credibility & verification proof\n10 Website loading speed & Core Web Vitals\n11 Content clarity & messaging\n12 Local search fundamentals & Google presence' },
    { heading: 'Actionable Recommendations', body: 'Send us your current website URL. We will provide objective recommendations on whether a simple optimization or a complete redesign is more practical.' }
  ], 16);

  // Page 17: FAQ
  addMasterPage('Common Questions, Straight Answers', 'Verbatim answers to key questions from prospective business clients.', [
    { heading: 'How much does a website cost & how long does it take?', body: 'Packages start at $399 up to $1,499+. Timelines range from 3-5 days for Starter, 5-7 days for Business, 7-10 days for Growth, and 10-15+ days for Custom projects.' },
    { heading: 'Are hosting and domain included?', body: 'Yes! First-year hosting and 1-year domain registration are included with standard packages.' },
    { heading: 'Can I use my existing domain?', body: 'Yes. We assist with connecting your existing domain to the new website.' },
    { heading: 'Will I own my website & am I locked into Wal Groups?', body: 'Yes. Once fully paid, you retain full ownership of your site and domain. We believe in earning your business, never locking you in.' },
    { heading: 'Do you guarantee Google rankings?', body: 'No. We provide solid SEO foundations (meta tags, sitemaps, speed, schema), but legitimate providers cannot guarantee specific rankings.' }
  ], 17);

  // Page 18: Final CTA
  addMasterPage('Ready to Build Your Website?', 'Tell us about your business and we will help you determine the right solution.', [
    { heading: 'WAL GROUPS', body: 'Professional websites built for businesses that move.\nServing: USA · Canada · UK · Australia · Worldwide' },
    { heading: 'Contact Information', body: '• Website: thewalgroup.in\n• Email: thewalgroups@gmail.com\n• Phone / WhatsApp: +91-636-369-8148\n\nTransparent pricing. No hidden fees. Structured delivery.' }
  ], 18);

  const masterPdfBytes = await masterDoc.save();
  fs.writeFileSync(path.join(outputDir, 'wal-groups-website-services-brochure-2026.pdf'), masterPdfBytes);
  console.log('✓ Created wal-groups-website-services-brochure-2026.pdf');

  // Helper function for individual package brochures (10 pages each)
  const createPackageBrochure = async (name: string, price: string, filename: string, specificDetails: string[]) => {
    const doc = await PDFDocument.create();
    const h = await doc.embedFont(StandardFonts.Helvetica);
    const hB = await doc.embedFont(StandardFonts.HelveticaBold);

    // Page 1: Cover
    const p1 = doc.addPage([595.28, 841.89]);
    p1.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(0.02, 0.05, 0.1) });
    p1.drawText('WAL GROUPS', { x: 50, y: 760, size: 16, font: hB, color: rgb(1, 1, 1) });
    p1.drawText(`${name.toUpperCase()} BROCHURE`, { x: 350, y: 760, size: 11, font: h, color: rgb(0.7, 0.75, 0.8) });
    p1.drawText('WEBSITE PACKAGE', { x: 50, y: 680, size: 12, font: hB, color: primaryOrange });
    p1.drawText(name, { x: 50, y: 630, size: 34, font: hB, color: rgb(1, 1, 1) });
    p1.drawText(price, { x: 50, y: 570, size: 38, font: hB, color: primaryOrange });
    p1.drawText('Professional websites built for businesses that move.', { x: 50, y: 500, size: 14, font: h, color: rgb(0.85, 0.9, 0.95) });
    
    // Details box
    p1.drawRectangle({ x: 50, y: 150, width: 495.28, height: 300, color: rgb(0.06, 0.12, 0.22) });
    p1.drawText('PACKAGE HIGHLIGHTS & DELIVERABLES', { x: 70, y: 410, size: 12, font: hB, color: primaryOrange });
    let y = 380;
    for (const d of specificDetails) {
      p1.drawText(`• ${d}`, { x: 70, y, size: 10, font: h, color: rgb(1, 1, 1) });
      y -= 22;
    }
    p1.drawText('thewalgroup.in  |  thewalgroups@gmail.com  |  +91-636-369-8148', { x: 50, y: 60, size: 9, font: h, color: rgb(0.7, 0.75, 0.8) });

    // Page 2: What's Included
    const p2 = doc.addPage([595.28, 841.89]);
    p2.drawText('WAL GROUPS', { x: 50, y: 790, size: 14, font: hB, color: darkNavy });
    p2.drawText(`${name} — Detailed Inclusions`, { x: 50, y: 740, size: 22, font: hB, color: darkNavy });
    p2.drawText('Everything you need to launch your business online professionally.', { x: 50, y: 715, size: 11, font: h, color: textMuted });
    p2.drawLine({ start: { x: 50, y: 700 }, end: { x: 545, y: 700 }, thickness: 1, color: rgb(0.85, 0.88, 0.92) });

    let p2Y = 660;
    const generalInclusions = [
      { t: 'Custom Business Design', d: 'Engineered specifically for your industry, fleet, and services.' },
      { t: 'Mobile, Tablet & Desktop Responsive', d: 'Pixel-perfect display on every screen size and operating system.' },
      { t: 'Contact & Lead Capture Forms', d: 'Direct phone, email, and WhatsApp connectivity.' },
      { t: 'Domain & Hosting Included', d: '1-year domain registration and first-year high-speed hosting included.' },
      { t: 'SSL Security Certificate', d: 'HTTPS encrypted connection for visitor trust and Google compliance.' },
      { t: 'Testing, Quality Assurance & Launch', d: 'Full browser compatibility testing, form validation, and go-live deployment.' },
      { t: '30 Days Post-Launch Technical Support', d: 'Direct technical assistance for adjustments and post-launch stability.' }
    ];
    for (const item of generalInclusions) {
      p2.drawText(item.t, { x: 50, y: p2Y, size: 12, font: hB, color: darkNavy });
      p2.drawText(item.d, { x: 50, y: p2Y - 16, size: 10, font: h, color: textDark });
      p2Y -= 45;
    }
    p2.drawText('thewalgroup.in  |  USA · Canada · UK · Australia · Worldwide', { x: 50, y: 40, size: 9, font: h, color: textMuted });

    const pdfBytes = await doc.save();
    fs.writeFileSync(path.join(outputDir, filename), pdfBytes);
    console.log(`✓ Created ${filename}`);
  };

  // 2. STARTER WEBSITE BROCHURE ($399)
  await createPackageBrochure('Starter Website', '$399', 'wal-groups-starter-website-brochure.pdf', [
    'Up to 5 Pages: Home, About, Services, Contact, Fleet/Equipment',
    'Custom business-focused responsive design',
    '1 consolidated revision round during development',
    '3 to 5 business days typical delivery turnaround',
    'Contact form, click-to-call, WhatsApp & Google Maps integration',
    'Basic SEO, meta titles & descriptions, XML sitemap',
    '1-year domain registration & first-year hosting included',
    '30 days free post-launch technical support',
    'Hosting renewal after year one: $79/year',
    '50% deposit / 50% upon completion via PayPal'
  ]);

  // 3. BUSINESS WEBSITE BROCHURE ($699)
  await createPackageBrochure('Business Website', '$699', 'wal-groups-business-website-brochure.pdf', [
    'MOST POPULAR — Flagship tier for growing companies',
    'Up to 8 Pages: Services, Fleet, Coverage, Testimonials, FAQ & more',
    '3 consolidated revision rounds during development',
    '5 to 7 business days typical delivery turnaround',
    'Everything in Starter, plus Enhanced SEO & keyword research',
    'Google Analytics & Google Search Console verified setup',
    'Conversion-focused contact sections & multiple lead capture forms',
    'Basic website enquiry tracking & lead email dispatch',
    'Hosting renewal after year one: $99/year',
    '50% deposit / 50% upon completion via PayPal'
  ]);

  // 4. GROWTH WEBSITE BROCHURE ($999)
  await createPackageBrochure('Growth Website', '$999', 'wal-groups-growth-website-brochure.pdf', [
    'Up to 12 Pages: Expanded industry pages, landing pages & blog/news',
    'Unlimited revisions during development within agreed project scope',
    '7 to 10 business days typical delivery turnaround',
    'Everything in Business, plus Advanced SEO & local SEO schema',
    'Advanced lead-generation functionality & multi-step quote forms',
    'Booking or quote scheduling functionality where appropriate',
    'Advanced analytics, conversion tracking & performance optimization',
    'Google Business Profile optimization guidance',
    'Hosting renewal after year one: $129/year',
    '50% deposit / 50% upon completion via PayPal'
  ]);

  // 5. CUSTOM WEBSITE BROCHURE ($1,499+)
  await createPackageBrochure('Custom Website', '$1,499+', 'wal-groups-custom-website-brochure.pdf', [
    'Starting from $1,499+ (Scoped to specific business requirements)',
    'Custom scope & pages | Unlimited revisions within agreed scope',
    '10 to 15+ business days typical delivery turnaround',
    'Fully custom design & bespoke web application architecture',
    'Customer portals, membership/login systems & custom dashboards',
    'E-commerce, catalog systems & payment workflows',
    'Advanced CRM & third-party API integrations',
    'Custom databases & business automation workflows',
    'Hosting renewal after year one: $149+/year',
    '50% deposit / 50% upon completion via PayPal'
  ]);
}

generateAllBrochures().catch(console.error);
