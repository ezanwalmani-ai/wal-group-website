import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';

async function generateAllBrochures() {
  const outputDir = path.join(process.cwd(), 'public', 'brochures');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const primaryOrange = rgb(1, 0.4, 0); // #ff6600
  const darkNavy = rgb(0.02, 0.12, 0.26); // #041e42
  const textDark = rgb(0.1, 0.15, 0.2);
  const textMuted = rgb(0.4, 0.45, 0.5);

  // =========================================================================
  // 1. MASTER WEBSITE SERVICES BROCHURE (2026) — 18 PAGES
  // =========================================================================
  const masterDoc = await PDFDocument.create();
  const helvetica = await masterDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await masterDoc.embedFont(StandardFonts.HelveticaBold);

  const addMasterPage = (title: string, subtitle: string, items: { heading: string; body: string }[], footerPage: number) => {
    const page = masterDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    page.drawText('WAL GROUPS', { x: 50, y: height - 45, size: 14, font: helveticaBold, color: darkNavy });
    page.drawText('WEBSITE SERVICES BROCHURE — 2026', { x: width - 250, y: height - 45, size: 9, font: helvetica, color: textMuted });
    page.drawLine({ start: { x: 50, y: height - 55 }, end: { x: width - 50, y: height - 55 }, thickness: 1, color: rgb(0.85, 0.88, 0.92) });

    page.drawText(title, { x: 50, y: height - 90, size: 22, font: helveticaBold, color: darkNavy });
    if (subtitle) {
      page.drawText(subtitle, { x: 50, y: height - 112, size: 11, font: helvetica, color: primaryOrange });
    }

    let yOffset = height - 145;
    for (const item of items) {
      if (yOffset < 90) break;
      page.drawText(item.heading, { x: 50, y: yOffset, size: 12, font: helveticaBold, color: darkNavy });
      yOffset -= 16;
      
      const lines = item.body.split('\n');
      for (const line of lines) {
        page.drawText(line, { x: 50, y: yOffset, size: 9.5, font: helvetica, color: textDark });
        yOffset -= 14;
      }
      yOffset -= 10;
    }

    page.drawLine({ start: { x: 50, y: 45 }, end: { x: width - 50, y: 45 }, thickness: 0.8, color: rgb(0.85, 0.88, 0.92) });
    page.drawText('thewalgroup.in  |  USA · Canada · UK · Australia · Worldwide', { x: 50, y: 32, size: 8.5, font: helvetica, color: textMuted });
    page.drawText(`Page ${footerPage} of 18`, { x: width - 110, y: 32, size: 8.5, font: helvetica, color: textMuted });
  };

  // Page 1: Cover
  const coverPage = masterDoc.addPage([595.28, 841.89]);
  const { width: cW, height: cH } = coverPage.getSize();
  coverPage.drawRectangle({ x: 0, y: 0, width: cW, height: cH, color: rgb(0.02, 0.04, 0.08) });
  coverPage.drawText('WAL GROUPS', { x: 50, y: cH - 60, size: 18, font: helveticaBold, color: rgb(1, 1, 1) });
  coverPage.drawText('WEBSITE SERVICES BROCHURE — 2026', { x: cW - 250, y: cH - 60, size: 9, font: helvetica, color: rgb(0.7, 0.75, 0.8) });
  
  coverPage.drawText('PROFESSIONAL BUSINESS WEBSITE DEVELOPMENT', { x: 50, y: cH - 130, size: 10, font: helveticaBold, color: primaryOrange });
  coverPage.drawText('Professional websites built for', { x: 50, y: cH - 170, size: 28, font: helveticaBold, color: rgb(1, 1, 1) });
  coverPage.drawText('businesses that move.', { x: 50, y: cH - 205, size: 28, font: helveticaBold, color: primaryOrange });
  coverPage.drawText('Websites that make your business look credible, explain what you do,', { x: 50, y: cH - 250, size: 12, font: helvetica, color: rgb(0.8, 0.85, 0.9) });
  coverPage.drawText('and make it easy for customers to get in touch.', { x: 50, y: cH - 268, size: 12, font: helvetica, color: rgb(0.8, 0.85, 0.9) });

  coverPage.drawRectangle({ x: 50, y: 140, width: cW - 100, height: 210, color: rgb(0.06, 0.1, 0.18) });
  coverPage.drawText('INCLUDED PACKAGE TIERS & SPECIFICATIONS', { x: 70, y: 325, size: 11, font: helveticaBold, color: primaryOrange });
  coverPage.drawText('• Starter Website ($399) — Get your business online professionally (Up to 5 pages)', { x: 70, y: 295, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Business Website ($699) — Most Popular: stronger presence & lead capture (Up to 8 pages)', { x: 70, y: 268, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Growth Website ($999) — Conversion-focused, advanced SEO & custom features (Up to 12 pages)', { x: 70, y: 241, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Custom Website ($1,499+) — Digital systems, client portals, workflows & integrations', { x: 70, y: 214, size: 10, font: helvetica, color: rgb(1, 1, 1) });
  coverPage.drawText('• Transportation & Logistics Specialist Architecture Built-In', { x: 70, y: 187, size: 10, font: helvetica, color: primaryOrange });
  coverPage.drawText('• 100% Client Ownership, Transparent Renewals, 30 Days Free Support', { x: 70, y: 160, size: 9.5, font: helvetica, color: rgb(0.8, 0.85, 0.9) });

  coverPage.drawText('THEWALGROUP.IN  |  USA · CANADA · UK · AUSTRALIA · WORLDWIDE', { x: 50, y: 50, size: 9, font: helvetica, color: rgb(0.7, 0.75, 0.8) });

  // Pages 2-18
  addMasterPage('01 — WHO WE ARE', 'Your website is often the first impression of your business. Make it count.', [
    { heading: 'Who We Are', body: 'Wal Groups is a business services company providing professional website development\nand digital solutions for businesses in the USA, Canada, the UK, Australia and worldwide.\n\nBefore a customer calls, requests a quote or sends an email, they usually look you up.\nWhat they find shapes whether they trust you — and whether they reach out at all.' },
    { heading: 'Our Focus', body: 'We build websites that present your business clearly and professionally, so the people looking\nfor your services can understand what you do and contact you without friction.\n\nWe have particular experience with trucking, transportation and logistics businesses —\nand we build for companies across many other industries too.' },
    { heading: '01 Look Professional', body: 'A credible, well-designed presence that reflects the quality of your work.' },
    { heading: '02 Explain What You Do', body: 'Clear services, service areas and information customers actually look for.' },
    { heading: '03 Make It Easy to Contact You', body: 'Calls, forms, email and WhatsApp — visible on every page, on every device.' }
  ], 2);

  addMasterPage('02 — WHAT WE BUILD', 'Professional Business Website Development tailored to your business requirements.', [
    { heading: 'Credibility', body: 'Look established and trustworthy from the very first visit.' },
    { heading: 'Professional Presentation', body: 'Clean design and structure that reflects the quality of your work.' },
    { heading: 'Mobile Experience', body: 'Built to work smoothly on phones, tablets and desktops.' },
    { heading: 'Clear Services', body: 'Customers quickly understand what you offer and where.' },
    { heading: 'Contact Opportunities', body: 'Call, email, form and WhatsApp options that are easy to find.' },
    { heading: 'Conversion-Focused Structure', body: 'Pages that guide visitors toward making an enquiry.' }
  ], 3);

  addMasterPage('03 — WHY WAL GROUPS?', 'Professional quality without unnecessary complexity or inflated pricing.', [
    { heading: '01 Industry Understanding', body: 'We understand trucking, transportation, logistics, Amazon DSP/AFP operations and small-fleet businesses.' },
    { heading: '02 Custom Website Design', body: 'Every site is designed around your business, services, fleet, target customers and goals.' },
    { heading: '03 Transparent Pricing', body: 'Clear packages with straightforward pricing and no unnecessary complexity.' },
    { heading: '04 Complete Website Setup', body: 'Design, development, responsive setup, domain configuration, hosting coordination and launch support.' },
    { heading: '05 Lead-Focused Design', body: 'Clear calls-to-action, contact forms, phone buttons and enquiry options.' },
    { heading: '06 Direct Communication & Full Ownership', body: 'Direct team access with no middle layers. You retain full ownership and control.' }
  ], 4);

  addMasterPage('04 — INDUSTRIES WE SERVE', 'Built for businesses across industries — with particular experience in transportation.', [
    { heading: 'Primary Specialization: Transportation & Logistics', body: '• Trucking & Transportation fleets\n• Logistics & Freight Forwarding companies\n• Towing & Roadside Services\n• Amazon DSP & Delivery Businesses' },
    { heading: 'Construction & Property', body: 'General contractors, commercial builders, real estate, and property services.' },
    { heading: 'Automotive', body: 'Auto repair, fleet maintenance shops, mobile detailing and commercial body shops.' },
    { heading: 'Healthcare & Medical Services', body: 'Clinics, diagnostic centers, medical waste transport, and wellness providers.' },
    { heading: 'Home & Local Services', body: 'Plumbing, electrical, HVAC contractors, landscaping, and local service trades.' }
  ], 5);

  addMasterPage('05 — TRANSPORTATION SPECIALIZATION', 'Websites structured around how transportation businesses actually operate.', [
    { heading: 'Trucking & Fleet Businesses', body: 'Owner-operators, small & mid-size fleets, regional carriers, and dedicated lane operators.' },
    { heading: 'Amazon Transportation Partners', body: 'Amazon DSPs, Amazon AFPs, and delivery/last-mile operations.' },
    { heading: 'Freight Logistics & Operations', body: '3PL companies, logistics brokers, independent dispatchers, and fleet managers.' },
    { heading: 'Sections We Build for Transportation', body: '• Services & Freight Types (Dry Van, Reefer, Flatbed, Dedicated Lanes)\n• Fleet & Equipment specifications\n• Service Areas & Regional Lanes\n• Driver Recruitment & online applications\n• Quote Requests & Load Capacity\n• Safety, DOT compliance & insurance credentials\n• Click-to-call direct dispatch lines' }
  ], 6);

  addMasterPage('06 — WEBSITE PACKAGES (1 OF 2)', 'Clear packages. Straightforward pricing. All prices in USD.', [
    { heading: 'STARTER WEBSITE — $399', body: 'Get your business online professionally.\n• Up to 5 pages (Home, About, Services, Contact + Fleet/Equipment)\n• 1 revision round | 3–5 business days turnaround\n• Custom business-focused responsive design\n• Contact form, click-to-call & email contact\n• WhatsApp, Google Maps & social media integration\n• Basic SEO, XML sitemap & Google-friendly setup\n• SSL, 1-year domain & first-year hosting included\n• 30 days post-launch technical support\n• Renewal from year two: $79/yr hosting' },
    { heading: 'BUSINESS WEBSITE — $699 (MOST POPULAR)', body: 'Build a stronger online presence and generate more enquiries.\n• Up to 8 pages | 3 revision rounds | 5–7 business days turnaround\n• Everything in Starter, plus:\n• Enhanced SEO & basic keyword research\n• Google Analytics & Google Search Console setup\n• Conversion-focused contact sections & multiple lead forms\n• Testimonials / Reviews & FAQ sections\n• Enhanced speed optimization & enquiry tracking\n• Renewal from year two: $99/yr hosting' }
  ], 7);

  addMasterPage('06 — WEBSITE PACKAGES (2 OF 2)', 'Built for established businesses ready for a larger online presence.', [
    { heading: 'GROWTH WEBSITE — $999', body: 'Build a larger, conversion-focused website with advanced functionality.\n• Up to 12 pages | Unlimited revisions during development | 7–10 business days\n• Everything in Business, plus:\n• Advanced custom design & multiple landing pages\n• Advanced SEO & stronger local SEO setup with schema markup\n• Blog / News setup & booking or quote systems where appropriate\n• Advanced analytics & conversion funnel tracking\n• Renewal from year two: $129/yr hosting' },
    { heading: 'CUSTOM WEBSITE — Starting from $1,499+', body: 'A website and digital system built around your specific business requirements.\n• Custom scope | Unlimited revisions within agreed scope | 10–15+ business days\n• Fully custom design, customer portals, membership/login systems\n• E-commerce, custom forms & operational workflows\n• Advanced CRM, API integrations & custom dashboards\n• Renewal from year two: $149+/yr hosting' }
  ], 8);

  addMasterPage('07 — AT A GLANCE (PACKAGE COMPARISON)', 'Compare deliverables, timelines, revisions and payment terms.', [
    { heading: 'Package Comparison Summary', body: '• Starter ($399): Best for owner-operators & small businesses | Up to 5 pages | 3-5 days\n• Business ($699): Best for growing companies needing leads | Up to 8 pages | 5-7 days\n• Growth ($999): Best for established brands needing SEO | Up to 12 pages | 7-10 days\n• Custom ($1,499+): Best for complex business requirements | Custom pages | 10-15+ days' },
    { heading: 'Revision Structure', body: 'Starter: 1 consolidated round | Business: 3 consolidated rounds\nGrowth: Unlimited during development | Custom: Unlimited within agreed scope' },
    { heading: 'Simple, Two-Part Payment', body: '50% at project start — before development begins.\n50% on completion — after approval, before launch / handover.\nPayments currently accepted via secure PayPal invoice.' }
  ], 9);

  addMasterPage('08 — WHAT\'S INCLUDED & SEO', 'Everything needed to launch — handled for you.', [
    { heading: 'Complete Technical Deliverables Included', body: '• Custom layout design tailored to your brand\n• Phone, tablet & desktop responsiveness\n• Contact forms, click-to-call, email & WhatsApp integration\n• 1-year domain registration & first-year hosting included\n• SSL certificate (HTTPS secure connection)\n• Testing, domain connection & go-live launch\n• 30 days post-launch technical support' },
    { heading: 'SEO Built Into Your Website by Package', body: '• Starter: Basic SEO setup, meta titles/descriptions, alt text, XML sitemap\n• Business: Enhanced SEO, keyword research, Search Console submission, internal linking\n• Growth: Advanced SEO, schema markup, local SEO optimization, Google Business Profile guidance' }
  ], 10);

  addMasterPage('09 — LEAD-GENERATION FEATURES', 'Designed to turn website visitors into enquiries.', [
    { heading: 'Starter Lead Features', body: 'Contact page, click-to-call, email button, clear CTA buttons, and basic contact form.' },
    { heading: 'Business Lead Features', body: 'Prominent quote/enquiry forms, WhatsApp direct link, multiple CTA sections, service-specific enquiry buttons, and instant lead notification to your email.' },
    { heading: 'Growth Lead Features', body: 'Advanced multi-step quote forms, multiple lead capture points, service/location-specific CTAs, booking request forms, and third-party CRM lead routing.' }
  ], 11);

  addMasterPage('10 — THE WEBSITE PROCESS', 'Eight clear steps. One point of contact.', [
    { heading: '01 Discover & 02 Plan', body: 'Understand your business, audience, requirements, and map user conversion journeys.' },
    { heading: '03 Design & 04 Build', body: 'Create the visual direction, clean layouts and build responsive templates.' },
    { heading: '05 Review & 06 Test', body: 'Review live staged site, check responsiveness, links, forms and speed.' },
    { heading: '07 Launch & 08 Support', body: 'Connect domain, publish site live, and deliver 30 days post-launch support.' }
  ], 12);

  addMasterPage('11 — DOMAIN, HOSTING & OWNERSHIP', 'Transparent from year one onward.', [
    { heading: 'First Year — Included', body: '1-year domain registration, first-year hosting, SSL certificate, and launch setup are all included.' },
    { heading: 'Hosting Renewal (After Year One)', body: 'Starter: $79/yr  ·  Business: $99/yr  ·  Growth: $129/yr  ·  Custom: $149+/yr\nDomain renewal is separate and charged based on registrar pricing.' },
    { heading: 'Your Website. Your Business.', body: 'Once fully paid, we provide appropriate access to the completed website and assets. You retain full ownership of your domain and content. We never lock you in.' }
  ], 13);

  addMasterPage('12 — MAINTENANCE & SUPPORT', 'After launch, we\'re still here.', [
    { heading: '30 Days Free Post-Launch Support', body: 'Included with every website: basic technical support, bug fixes, and launch troubleshooting.' },
    { heading: 'Optional Website Maintenance — $199 / Year', body: '• Website text and image updates\n• Security checks, backups & SSL monitoring\n• Uptime monitoring & troubleshooting\n• Business-hours updates and existing content refreshes' },
    { heading: 'Why Not Build It Yourself?', body: 'Platforms make DIY possible, but we handle the structure, design, responsive testing, forms, domain connection and launch so you can stay focused on running your business.' }
  ], 14);

  addMasterPage('13 — SELECTED PORTFOLIO CONCEPTS', 'Design and development examples created to demonstrate website capabilities.', [
    { heading: 'ABHI JOBS (Demo / Concept)', body: 'Industry: Jobs & Career Platform | Live Demo: https://abhijobs.netlify.app\nCandidate search, skills discovery, job categorization, and employer portal.' },
    { heading: 'M&L Worldwide Logistics (Demo / Concept)', body: 'Industry: Transportation & Logistics | Live Demo: https://m-l-worldwide-logistics.netlify.app\nFreight tracking, quote request forms, international forwarding & fleet showcase.' },
    { heading: 'Alpine Medical Services (Demo / Concept)', body: 'Industry: Healthcare Waste Management | Live Demo: https://alpine-medical-services.netlify.app\nStatewide manifest tracking, compliance dossier, and emergency service dispatch.' },
    { heading: 'South DeKalb Towing & Transport (Demo / Concept)', body: 'Industry: Towing & Roadside Services | Live Demo: https://southdekalb.netlify.app\nEmergency click-to-call, request a tow booking, GPS directions, and fleet overview.' },
    { heading: 'Wal Groups (Our Own Site)', body: 'Live URL: https://thewalgroup.in\nOperations backbone, 24/7 DSP/AFP dispatch, BPO solutions and client portals.' }
  ], 15);

  addMasterPage('14 — WEBSITE REVIEW & REDESIGN', 'Already have a website? Let\'s review it.', [
    { heading: '12 Practical Areas We Review', body: '01 Mobile experience  ·  02 Website design  ·  03 Navigation\n04 Contact visibility  ·  05 Calls-to-action  ·  06 Quote / enquiry process\n07 Services presentation  ·  08 Fleet/equipment presentation  ·  09 Trust & credibility\n10 Website speed  ·  11 Content clarity  ·  12 Local search fundamentals' },
    { heading: 'Objective Recommendations', body: 'Send us your current website. We will provide objective recommendations on whether improving or rebuilding is more practical and cost-effective.' }
  ], 16);

  addMasterPage('15 — FREQUENTLY ASKED QUESTIONS', 'Common questions, straight answers.', [
    { heading: 'How much does a website cost & how long does it take?', body: 'Packages start at $399 up to $1,499+. Timelines range from 3-5 days for Starter, 5-7 days for Business, 7-10 days for Growth, and 10-15+ days for Custom projects.' },
    { heading: 'Are hosting and domain included?', body: 'Yes. First-year hosting and 1-year domain registration are included with standard packages.' },
    { heading: 'Can I use my existing domain & will I own the site?', body: 'Yes. We assist with connecting existing domains. Once fully paid, you retain full ownership of your site and domain. We never lock you into Wal Groups.' },
    { heading: 'Do you guarantee Google rankings?', body: 'No. We provide solid SEO foundations (meta tags, sitemaps, speed, schema), but legitimate providers cannot guarantee specific rankings.' }
  ], 17);

  addMasterPage('16 — READY TO BUILD YOUR WEBSITE?', 'Tell us about your business and we\'ll help determine the right solution.', [
    { heading: 'WAL GROUPS', body: 'Professional websites built for businesses that move.\nServing: USA · Canada · UK · Australia · Worldwide' },
    { heading: 'Contact Information', body: '• Website: thewalgroup.in\n• Email: thewalgroups@gmail.com\n• Phone / WhatsApp: +91-636-369-8148\n\nTransparent pricing. No hidden fees. Structured delivery.' }
  ], 18);

  const masterBytes = await masterDoc.save();
  fs.writeFileSync(path.join(outputDir, 'wal-groups-website-services-brochure-2026.pdf'), masterBytes);
  console.log('✓ Saved master brochure (18 pages)');

  // Helper for generating complete 10-page package brochures
  const generate10PagePackage = async (
    pkgName: string, 
    price: string, 
    filename: string, 
    pagesData: { title: string; subtitle: string; content: { h: string; b: string }[] }[]
  ) => {
    const doc = await PDFDocument.create();
    const h = await doc.embedFont(StandardFonts.Helvetica);
    const hB = await doc.embedFont(StandardFonts.HelveticaBold);

    // Page 1: Cover
    const p1 = doc.addPage([595.28, 841.89]);
    p1.drawRectangle({ x: 0, y: 0, width: 595.28, height: 841.89, color: rgb(0.02, 0.04, 0.08) });
    p1.drawText('WAL GROUPS', { x: 50, y: 760, size: 16, font: hB, color: rgb(1, 1, 1) });
    p1.drawText(`${pkgName.toUpperCase()} BROCHURE`, { x: 330, y: 760, size: 10, font: h, color: rgb(0.7, 0.75, 0.8) });
    p1.drawText('WEBSITE PACKAGE', { x: 50, y: 680, size: 11, font: hB, color: primaryOrange });
    p1.drawText(pkgName, { x: 50, y: 635, size: 32, font: hB, color: rgb(1, 1, 1) });
    p1.drawText(price, { x: 50, y: 580, size: 36, font: hB, color: primaryOrange });
    p1.drawText('Professional websites built for businesses that move.', { x: 50, y: 510, size: 13, font: h, color: rgb(0.85, 0.9, 0.95) });
    
    // Cover highlights box
    p1.drawRectangle({ x: 50, y: 160, width: 495.28, height: 280, color: rgb(0.06, 0.1, 0.18) });
    p1.drawText('PACKAGE HIGHLIGHTS & DELIVERABLES', { x: 70, y: 405, size: 11, font: hB, color: primaryOrange });
    
    const page1Items = pagesData[0]?.content || [];
    let cY = 375;
    for (const item of page1Items) {
      p1.drawText(`• ${item.h}: ${item.b}`, { x: 70, y: cY, size: 9.5, font: h, color: rgb(1, 1, 1) });
      cY -= 20;
    }

    p1.drawText('thewalgroup.in  |  thewalgroups@gmail.com  |  +91-636-369-8148', { x: 50, y: 60, size: 9, font: h, color: rgb(0.7, 0.75, 0.8) });

    // Pages 2 to 10
    for (let pIdx = 1; pIdx < pagesData.length; pIdx++) {
      const pageNum = pIdx + 1;
      const pData = pagesData[pIdx];
      const page = doc.addPage([595.28, 841.89]);
      const { width, height } = page.getSize();

      page.drawText('WAL GROUPS', { x: 50, y: height - 45, size: 13, font: hB, color: darkNavy });
      page.drawText(`${pkgName.toUpperCase()} — ${price}`, { x: width - 220, y: height - 45, size: 9, font: h, color: textMuted });
      page.drawLine({ start: { x: 50, y: height - 55 }, end: { x: width - 50, y: height - 55 }, thickness: 1, color: rgb(0.85, 0.88, 0.92) });

      page.drawText(pData.title, { x: 50, y: height - 90, size: 20, font: hB, color: darkNavy });
      if (pData.subtitle) {
        page.drawText(pData.subtitle, { x: 50, y: height - 110, size: 10.5, font: h, color: primaryOrange });
      }

      let yPos = height - 140;
      for (const section of pData.content) {
        if (yPos < 90) break;
        page.drawText(section.h, { x: 50, y: yPos, size: 11.5, font: hB, color: darkNavy });
        yPos -= 16;
        const lines = section.b.split('\n');
        for (const line of lines) {
          page.drawText(line, { x: 50, y: yPos, size: 9.5, font: h, color: textDark });
          yPos -= 14;
        }
        yPos -= 10;
      }

      page.drawLine({ start: { x: 50, y: 45 }, end: { x: width - 50, y: 45 }, thickness: 0.8, color: rgb(0.85, 0.88, 0.92) });
      page.drawText('thewalgroup.in  |  USA · Canada · UK · Australia · Worldwide', { x: 50, y: 32, size: 8.5, font: h, color: textMuted });
      page.drawText(`Page ${pageNum} / 10`, { x: width - 100, y: 32, size: 8.5, font: h, color: textMuted });
    }

    const bytes = await doc.save();
    fs.writeFileSync(path.join(outputDir, filename), bytes);
    console.log(`✓ Saved ${filename} (10 pages)`);
  };

  // 2. STARTER WEBSITE (10 Pages)
  await generate10PagePackage('Starter Website', '$399', 'wal-groups-starter-website-brochure.pdf', [
    {
      title: 'STARTER WEBSITE — $399',
      subtitle: 'Get your business online professionally.',
      content: [
        { h: 'Up to 5 Pages', b: 'Home, About, Services, Contact + Fleet/Equipment' },
        { h: 'Custom Design', b: 'Business-focused layout, responsive for phone, tablet & desktop' },
        { h: 'Lead Capture', b: 'Contact form, click-to-call, email and WhatsApp integration' },
        { h: 'Turnaround', b: '3–5 business days delivery from receipt of materials' },
        { h: 'Revisions', b: '1 consolidated revision round during development' },
        { h: 'Foundations', b: 'Basic SEO, meta tags, XML sitemap, SSL & 1-year domain/hosting' },
        { h: 'Support', b: '30 days free post-launch support included' }
      ]
    },
    {
      title: 'WHAT\'S INCLUDED',
      subtitle: 'Everything you need to launch professionally without unnecessary complexity.',
      content: [
        { h: 'Custom Business-Focused Design', b: 'Engineered specifically for your brand, target customers, and operational focus.' },
        { h: 'Mobile, Tablet & Desktop Responsive', b: 'Works effortlessly across every modern device and viewport.' },
        { h: 'Contact & Enquiry Features', b: 'Visible phone, email, contact forms and WhatsApp buttons on every page.' },
        { h: 'Google Maps Integration', b: 'Interactive location maps so customers easily find your physical facility or service area.' },
        { h: 'Social Media Integration', b: 'Direct connectivity to your LinkedIn, Facebook, Instagram or business profiles.' },
        { h: 'SSL Security Certificate', b: 'Full HTTPS encryption included from day one for visitor trust and search ranking.' },
        { h: '1-Year Domain & First-Year Hosting Included', b: 'We coordinate domain registration and host your site on high-speed servers.' }
      ]
    },
    {
      title: 'THE CORE WEBSITE STRUCTURE',
      subtitle: 'A clear five-page structure that customers expect to find when they look you up.',
      content: [
        { h: '01 Home Page', b: 'Your first impression: who you are, what you offer, and why clients should choose you.' },
        { h: '02 About Page', b: 'Your story, team, company background, and credibility proof.' },
        { h: '03 Services Page', b: 'The core services you offer, clearly explained with transparent details.' },
        { h: '04 Fleet / Equipment Page', b: 'Where applicable — showcase your physical vehicles, machinery, or tools.' },
        { h: '05 Contact Page', b: 'Phone, WhatsApp, email, interactive Google map, and simple enquiry form.' }
      ]
    },
    {
      title: 'GETTING IN TOUCH',
      subtitle: 'Turn website visitors into enquiries.',
      content: [
        { h: 'Frictionless Contact Routing', b: 'The website is structured to make it easier for potential customers to take the next step — call, message or send an enquiry.' },
        { h: 'Click-to-Call Buttons', b: 'One-touch dialing for smartphone users seeking fast quotes or immediate service.' },
        { h: 'WhatsApp Connectivity', b: 'Direct chat integration for real-time messaging with your dispatch or sales team.' },
        { h: 'Notice on Expectations', b: 'We do not guarantee leads or customers. We build the clean structure that makes it simple for people to reach you.' }
      ]
    },
    {
      title: 'PRESENTATION',
      subtitle: 'Make your business look established.',
      content: [
        { h: 'Consistent Visual Branding', b: 'Your website presents your business the way customers expect to see it — clear, professional and consistent across every page.' },
        { h: 'Company Information & Service Areas', b: 'Detailed regions, cities, and operational boundaries so prospects know you can serve them.' },
        { h: 'Credibility from the First Visit', b: 'Clean typography and structured white space that elevates your market reputation.' }
      ]
    },
    {
      title: 'FOUNDATIONS',
      subtitle: 'Built with the right technical foundations.',
      content: [
        { h: 'Search-Ready Architecture', b: 'SEO-friendly page structure, clean URLs, and fast loading speeds.' },
        { h: 'Meta Titles & Descriptions', b: 'Accurately labeled pages so Google search results display professional snippets.' },
        { h: 'Image Optimization & Alt Text', b: 'Compressed images with descriptive accessibility labels for search indexing.' },
        { h: 'XML Sitemap & Google Indexing', b: 'Structured sitemap generated and formatted for search engine crawler discovery.' }
      ]
    },
    {
      title: 'SETUP & LAUNCH',
      subtitle: 'From setup to launch — handled for you.',
      content: [
        { h: 'Domain & DNS Configuration', b: 'We connect your domain records accurately to ensure zero downtime.' },
        { h: 'Comprehensive Quality Assurance', b: 'Forms, links, mobile layout, and browser compatibility tested before go-live.' },
        { h: 'Social Sharing (Open Graph)', b: 'When your link is shared on WhatsApp, LinkedIn or iMessage, a clean preview card appears.' }
      ]
    },
    {
      title: 'SIMPLE, STRAIGHTFORWARD PROCESS',
      subtitle: 'Four steps from first message to a live website.',
      content: [
        { h: '01 Share Your Details', b: 'Logo, images, content, services, and business information.' },
        { h: '02 Design & Build', b: 'Your pages are custom designed and coded around your business.' },
        { h: '03 Review & Revise', b: 'You send one consolidated round of requested adjustments.' },
        { h: '04 Launch', b: 'Domain connection, SSL activation, and launch support. Delivery in 3–5 business days.' }
      ]
    },
    {
      title: 'OWNERSHIP & SUPPORT',
      subtitle: 'Your business. Your website.',
      content: [
        { h: '100% Client Ownership', b: 'Clear, simple terms — no complicated legal language. The website and domain belong to your business.' },
        { h: '30 Days Post-Launch Support', b: 'Included free technical support for adjustments and post-launch stability.' },
        { h: 'Optional Maintenance ($199/yr)', b: 'Available for routine updates, text edits, security monitoring and backups.' }
      ]
    },
    {
      title: 'READY TO PUT YOUR BUSINESS ONLINE?',
      subtitle: 'Starter Website — $399',
      content: [
        { h: 'Simple Two-Part Payment', b: '50% at project start before build begins, and 50% on approval before final launch.' },
        { h: 'Contact WAL GROUPS', b: 'Phone / WhatsApp: +91-636-369-8148\nEmail: thewalgroups@gmail.com\nWebsite: thewalgroup.in' },
        { h: 'Our Guarantee of Transparency', b: 'No hidden setup fees. No recurring lock-ins. Pure professional craftsmanship.' }
      ]
    }
  ]);

  // 3. BUSINESS WEBSITE (10 Pages)
  await generate10PagePackage('Business Website', '$699', 'wal-groups-business-website-brochure.pdf', [
    {
      title: 'BUSINESS WEBSITE — $699',
      subtitle: 'MOST POPULAR — The flagship choice for growing businesses.',
      content: [
        { h: 'Up to 8 Pages', b: 'Services, Fleet, Coverage, Testimonials, FAQ & more' },
        { h: 'Lead-Generation Ready', b: 'Multiple quote forms, WhatsApp, service-specific CTAs' },
        { h: 'Stronger SEO Foundations', b: 'Enhanced keyword research, Search Console & indexing' },
        { h: 'Turnaround', b: '5–7 business days delivery from receipt of materials' },
        { h: 'Revisions', b: '3 consolidated revision rounds during development' },
        { h: 'Hosting Renewal', b: '$99/year hosting renewal after year one' }
      ]
    },
    {
      title: 'BUILT FOR BUSINESSES READY TO GROW',
      subtitle: 'More room, more structure and more ways for customers to get in touch.',
      content: [
        { h: 'Who It Is For', b: 'Growing businesses, trucking fleets, logistics companies, towing operators, and service firms needing a stronger digital presence.' },
        { h: 'Capacity: Up to 8 Pages', b: 'Enough room to present your services, coverage, fleet and credibility properly — without the site feeling thin or crowded.' }
      ]
    },
    {
      title: 'EVERYTHING YOU NEED — PLUS MORE',
      subtitle: 'Starter foundation + Business upgrade built in.',
      content: [
        { h: 'Complete Starter Foundation', b: 'Professional design, responsive mobile UI, SSL, domain, hosting, and contact features.' },
        { h: 'Business Upgrade Features', b: 'Up to 8 pages, multiple lead capture forms, Google Analytics, Search Console, and customer review sections.' }
      ]
    },
    {
      title: 'PAGE STRUCTURE & DEPTH',
      subtitle: 'Organized sections that address every buying decision.',
      content: [
        { h: '01 Services', b: 'In-depth page-by-page breakdowns of your key service offerings.' },
        { h: '02 Fleet & Equipment', b: 'Showcase trucks, trailers, technology, and equipment capacity.' },
        { h: '03 Service Areas & Lanes', b: 'Regional routes, lanes, cities, and coverage boundaries.' },
        { h: '04 About Us & 05 Testimonials', b: 'Company background, credentials, and genuine customer feedback.' },
        { h: '06 FAQ & 07 Contact', b: 'Clear answers to common questions and dedicated multi-channel contact forms.' }
      ]
    },
    {
      title: 'MAKE IT EASIER TO CONTACT YOU',
      subtitle: 'Conversion-focused lead generation design.',
      content: [
        { h: 'Multiple Contact & Quote Forms', b: 'Placed where visitors naturally look on service and landing pages.' },
        { h: 'Instant Email Lead Notifications', b: 'Every submission is delivered directly to your company inbox.' },
        { h: 'Basic Enquiry Tracking', b: 'Track where visitors arrive from and how they initiate contact.' }
      ]
    },
    {
      title: 'STRONGER SEO FOUNDATIONS',
      subtitle: 'Structured, indexed and readable for search engines.',
      content: [
        { h: 'Enhanced SEO Setup', b: 'Keyword-focused page content, meta tags, and internal link architecture.' },
        { h: 'Google Search Console Verification', b: 'Sitemap submission and indexing request directly with Google.' },
        { h: 'Basic Local SEO Optimization', b: 'Configured to help nearby customers and commercial clients discover you.' }
      ]
    },
    {
      title: 'GIVE CUSTOMERS MORE REASONS TO TRUST YOU',
      subtitle: 'Presented like the established business you already are.',
      content: [
        { h: 'Testimonials & Reviews Showcase', b: 'Display customer recommendations and verified ratings prominently.' },
        { h: 'Structured FAQ Section', b: 'Save time by answering recurring pricing, timeline, and service questions.' },
        { h: 'Safety & Compliance Badges', b: 'Display DOT numbers, insurance verification, and industry certifications.' }
      ]
    },
    {
      title: 'UNDERSTAND HOW YOUR WEBSITE PERFORMS',
      subtitle: 'Measurement you can act on.',
      content: [
        { h: 'Google Analytics Setup', b: 'See visitor numbers, geographic traffic sources, and popular pages.' },
        { h: 'Speed & Core Web Vitals', b: 'Optimized asset delivery ensuring low bounce rates and fast loading.' }
      ]
    },
    {
      title: 'BUILT EFFICIENTLY. REVIEWED WITH YOU.',
      subtitle: 'Structured delivery with 3 revision rounds.',
      content: [
        { h: '5–7 Business Days Delivery', b: 'Fast, structured build cycle once content and materials are received.' },
        { h: '3 Revision Rounds', b: 'Consolidated rounds of feedback applied cleanly into the build.' }
      ]
    },
    {
      title: 'READY TO BUILD A STRONGER ONLINE PRESENCE?',
      subtitle: 'Business Website — $699',
      content: [
        { h: 'Transparent Terms', b: '50% project start / 50% upon completion. Hosting renewal $99/yr from year two.' },
        { h: 'Contact WAL GROUPS', b: 'Phone / WhatsApp: +91-636-369-8148\nEmail: thewalgroups@gmail.com\nWebsite: thewalgroup.in' }
      ]
    }
  ]);

  // 4. GROWTH WEBSITE (10 Pages)
  await generate10PagePackage('Growth Website', '$999', 'wal-groups-growth-website-brochure.pdf', [
    {
      title: 'GROWTH WEBSITE — $999',
      subtitle: 'Built for businesses ready for a larger, conversion-focused online presence.',
      content: [
        { h: 'Up to 12 Pages', b: 'Expanded industry pages, landing pages, blog/news setup' },
        { h: 'Advanced SEO & Schema', b: 'Detailed keyword research, local SEO and structured schema' },
        { h: 'Advanced Lead Capture', b: 'Multi-step quote requests, booking systems where appropriate' },
        { h: 'Revisions', b: 'Unlimited revisions during development within agreed project scope' },
        { h: 'Timeline', b: '7–10 business days delivery window' },
        { h: 'Hosting Renewal', b: '$129/year hosting renewal from year two' }
      ]
    },
    {
      title: 'FOR ESTABLISHED BUSINESSES',
      subtitle: 'A website sized for the business you have today — and the one you are building.',
      content: [
        { h: 'Target Audience', b: 'Established trucking companies, logistics firms, growing fleets, multi-service companies and operations requiring deeper content hierarchy.' },
        { h: 'Capacity: Up to 12 Pages', b: 'Plenty of space for dedicated lane descriptions, service breakdowns, safety records, and recruitment portals.' }
      ]
    },
    {
      title: 'MORE THAN JUST MORE PAGES',
      subtitle: 'Advanced custom design and conversion-focused layouts.',
      content: [
        { h: 'Industry-Specific Page Structures', b: 'Every page is planned around how your sector transacts business.' },
        { h: 'Multiple Dedicated Landing Pages', b: 'Drive specific campaign traffic to focused service or regional pages.' }
      ]
    },
    {
      title: 'CREATE MORE OPPORTUNITIES TO START A CONVERSATION',
      subtitle: 'Advanced lead-generation features.',
      content: [
        { h: 'Advanced Enquiry & Quote Forms', b: 'Capture freight origin, destination, cargo weight, and scheduling details.' },
        { h: 'Booking / Scheduling Systems', b: 'Enable qualified prospects to schedule discovery calls or consultations directly.' },
        { h: 'Lead Routing Setup', b: 'Route submissions to specific departments or team members based on selected service.' }
      ]
    },
    {
      title: 'STRONGER SEARCH FOUNDATIONS',
      subtitle: 'Built to be found — and understood.',
      content: [
        { h: 'Detailed Keyword Research', b: 'Identify high-intent search terms used by commercial buyers in your market.' },
        { h: 'Schema Markup & Local SEO', b: 'Structured data markup for organizations, local business, services and FAQs.' },
        { h: 'Google Business Profile Guidance', b: 'Recommendations for aligning your website with your Google Maps profile.' }
      ]
    },
    {
      title: 'UNDERSTAND WHAT YOUR WEBSITE IS DOING',
      subtitle: 'Analytics & conversion tracking.',
      content: [
        { h: 'Full Funnel Measurement', b: 'Google Analytics 4 event tracking for form submissions, phone clicks and downloads.' },
        { h: 'Performance Monitoring', b: 'Ongoing Core Web Vitals checks and mobile speed optimization.' }
      ]
    },
    {
      title: 'TELL YOUR COMPLETE BUSINESS STORY',
      subtitle: 'Content & business presence in your own words.',
      content: [
        { h: 'Comprehensive Architecture', b: 'Services, Fleet, Lanes, Industries, About, Testimonials, FAQ, Blog/News, and Landing Pages.' },
        { h: 'Clear Content Organization', b: 'We help turn your raw documents and notes into clean, persuasive sections.' }
      ]
    },
    {
      title: 'BUILT AROUND HOW YOUR BUSINESS WORKS',
      subtitle: 'Advanced functionality selected according to business requirements.',
      content: [
        { h: 'Quote Systems', b: 'Structured intake for priced or scoped freight and services.' },
        { h: 'Blog / News Architecture', b: 'Easy publishing framework for company updates and industry insights.' }
      ]
    },
    {
      title: 'CLEAR TIMELINES, CLEAR EXPECTATIONS',
      subtitle: '7–10 business days · Unlimited revisions during development.',
      content: [
        { h: 'Unlimited Revisions', b: 'We refine the website with you until it is right — feedback goes directly into the build.' },
        { h: 'Scope Agreed Up Front', b: 'Before development starts, we confirm all pages, sections, and technical scope.' }
      ]
    },
    {
      title: 'READY TO BUILD A BIGGER ONLINE PRESENCE?',
      subtitle: 'Growth Website — $999',
      content: [
        { h: 'Two-Part Payment', b: '50% project start / 50% upon completion. Hosting renewal $129/yr after year one.' },
        { h: 'Contact WAL GROUPS', b: 'Phone / WhatsApp: +91-636-369-8148\nEmail: thewalgroups@gmail.com\nWebsite: thewalgroup.in' }
      ]
    }
  ]);

  // 5. CUSTOM WEBSITE (10 Pages)
  await generate10PagePackage('Custom Website', '$1,499+', 'wal-groups-custom-website-brochure.pdf', [
    {
      title: 'CUSTOM WEBSITE — $1,499+',
      subtitle: 'A website and digital system built around your specific business requirements.',
      content: [
        { h: 'Custom Scope', b: 'Unlimited in scope, built around what your operation actually needs' },
        { h: 'Business Systems', b: 'Customer portals, membership/login areas, and custom databases' },
        { h: 'Integrations', b: 'CRM integrations, API connectivity, and custom workflow automations' },
        { h: 'E-commerce & Bookings', b: 'Custom booking engines, product catalogs and payment workflows' },
        { h: 'Timeline', b: 'Typically 10–15+ business days depending on functional complexity' },
        { h: 'Hosting Renewal', b: '$149+/year hosting renewal from year two' }
      ]
    },
    {
      title: 'WHEN CUSTOM MAKES SENSE',
      subtitle: 'When your business needs more than a standard website.',
      content: [
        { h: 'Specific Operational Needs', b: 'Larger websites, complex multi-tier services, multiple geographic branches, custom workflows, customer portals, custom dashboards, and API integrations.' }
      ]
    },
    {
      title: 'DESIGNED AROUND YOUR REQUIREMENTS',
      subtitle: 'Nothing is forced into a fixed template.',
      content: [
        { h: 'Fully Custom Design', b: 'Built to your brand, not an off-the-shelf theme.' },
        { h: 'Custom Workflows & Forms', b: 'Fields and intake logic mapped directly to how your team already works.' },
        { h: 'Advanced Navigation', b: 'Clear paths through complex multi-division corporate structures.' }
      ]
    },
    {
      title: 'MORE THAN A WEBSITE — BUSINESS SYSTEMS',
      subtitle: 'Where your operation needs it, the website can sit on top of real business systems.',
      content: [
        { h: 'Customer Portals', b: 'Secure client-facing areas for manifests, invoices, or project tracking.' },
        { h: 'Membership / Login Systems', b: 'Gated access for drivers, clients, partners or employees.' },
        { h: 'Custom Databases & Dashboards', b: 'Your key operational metrics and data structured in one unified view.' }
      ]
    },
    {
      title: 'CONNECT THE TOOLS YOUR BUSINESS USES',
      subtitle: 'Your website should speak to the rest of your operation — not sit apart from it.',
      content: [
        { h: 'CRM Integrations', b: 'Enquiries routed directly into your sales pipeline (HubSpot, Salesforce, etc.).' },
        { h: 'API Integrations', b: 'Systems exchanging data directly with external logistics, ERP, or TMS tools.' },
        { h: 'Custom Data Workflows', b: 'Automated notification and distribution of lead information.' }
      ]
    },
    {
      title: 'SELL, BOOK OR QUOTE ONLINE',
      subtitle: 'Commerce, configured to your application.',
      content: [
        { h: 'E-commerce & Catalogues', b: 'Clean product and parts inventories with secure online checkout.' },
        { h: 'Complex Booking Workflows', b: 'Availability calendars, dispatch scheduling, and deposit collection.' }
      ]
    },
    {
      title: 'BUILT FOR LONG-TERM GROWTH',
      subtitle: 'Measurement you can act on — set up properly from day one.',
      content: [
        { h: 'Advanced Technical SEO', b: 'Custom schema, multi-location architecture, and technical audit.' },
        { h: 'Conversion Tracking', b: 'Custom conversion funnels and analytics dashboards.' }
      ]
    },
    {
      title: 'BUILD AROUND HOW YOUR BUSINESS OPERATES',
      subtitle: 'The site is designed around your process — not the other way around.',
      content: [
        { h: 'Custom Business Automation', b: 'Input captured -> Routed to the right person -> Stored in database -> Team follows up.' }
      ]
    },
    {
      title: 'YOUR REQUIREMENTS. OUR BUILD.',
      subtitle: 'A structured eight-step consultative development process.',
      content: [
        { h: 'Consultative Scoping', b: 'We confirm all pages, user stories, workflows and data requirements before writing a single line of code.' },
        { h: '10–15+ Business Days', b: 'Delivery timelines depend on scope and are agreed transparently upfront.' }
      ]
    },
    {
      title: 'HAVE A SPECIFIC REQUIREMENT?',
      subtitle: 'Custom Website — $1,499+ Starting from',
      content: [
        { h: 'Tell Us What You Need', b: 'We will help scope, quote and architect the right digital solution.' },
        { h: 'Contact WAL GROUPS', b: 'Phone / WhatsApp: +91-636-369-8148\nEmail: thewalgroups@gmail.com\nWebsite: thewalgroup.in' }
      ]
    }
  ]);

  // Generate crisp WebP and JPG cover preview asset for the Master Brochure
  const coverSvg = `
  <svg width="600" height="850" viewBox="0 0 600 850" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="850" fill="#040b14" />
    <rect x="0" y="0" width="600" height="8" fill="#ff6600" />
    
    <!-- Top Branding -->
    <rect x="40" y="40" width="28" height="28" rx="6" fill="#ff6600" />
    <text x="54" y="60" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#000000" text-anchor="middle">W</text>
    <text x="80" y="54" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#ffffff" letter-spacing="1">WAL GROUPS</text>
    <text x="80" y="68" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#94a3b8" letter-spacing="1.5">BUSINESS SERVICES</text>
    <text x="560" y="58" font-family="system-ui, sans-serif" font-weight="700" font-size="9" fill="#94a3b8" text-anchor="end" letter-spacing="1">WEBSITE SERVICES BROCHURE — 2026</text>

    <!-- Eyebrow -->
    <text x="40" y="140" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#ff6600" letter-spacing="2">PROFESSIONAL BUSINESS WEBSITE DEVELOPMENT</text>

    <!-- Headline -->
    <text x="40" y="195" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#ffffff" letter-spacing="-1">Professional</text>
    <text x="40" y="240" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#ffffff" letter-spacing="-1">websites built for</text>
    <text x="40" y="285" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#ff6600" letter-spacing="-1">businesses that</text>
    <text x="40" y="330" font-family="system-ui, sans-serif" font-weight="900" font-size="38" fill="#ff6600" letter-spacing="-1">move.</text>

    <!-- Subhead -->
    <text x="40" y="380" font-family="system-ui, sans-serif" font-size="14" fill="#cbd5e1">Websites that make your business look credible, explain what</text>
    <text x="40" y="402" font-family="system-ui, sans-serif" font-size="14" fill="#cbd5e1">you do, and make it easy for customers to get in touch.</text>

    <!-- Graphic Mockup Container -->
    <rect x="40" y="440" width="520" height="260" rx="12" fill="#081422" stroke="#1e293b" stroke-width="1.5" />
    <rect x="40" y="440" width="520" height="32" rx="12" fill="#0f1d30" />
    <circle cx="60" cy="456" r="3.5" fill="#ef4444" />
    <circle cx="72" cy="456" r="3.5" fill="#f59e0b" />
    <circle cx="84" cy="456" r="3.5" fill="#10b981" />
    <text x="105" y="460" font-family="monospace" font-size="10" fill="#94a3b8">yourbusiness.com</text>

    <text x="60" y="510" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#ffffff">YOUR FREIGHT CO.</text>
    <text x="60" y="530" font-family="system-ui, sans-serif" font-size="10" fill="#ff6600" font-weight="700">DRY VAN · REEFER · DEDICATED LANES</text>
    <text x="60" y="565" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#ffffff">Reliable freight, delivered</text>
    <text x="60" y="592" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#ffffff">on schedule.</text>

    <rect x="60" y="620" width="110" height="34" rx="6" fill="#ff6600" />
    <text x="115" y="642" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#000000" text-anchor="middle">Get a Quote</text>

    <rect x="180" y="620" width="110" height="34" rx="6" fill="#16263a" stroke="#334155" />
    <text x="235" y="642" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">Call Dispatch</text>

    <!-- Mobile mockup on right -->
    <rect x="390" y="490" width="150" height="195" rx="10" fill="#020812" stroke="#334155" stroke-width="1.5" />
    <rect x="400" y="510" width="130" height="22" rx="4" fill="#ff6600" />
    <text x="465" y="525" font-family="system-ui, sans-serif" font-weight="800" font-size="9" fill="#000000" text-anchor="middle">Tap to Call</text>
    <text x="405" y="555" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#ffffff">Full Truckload</text>
    <text x="405" y="570" font-family="system-ui, sans-serif" font-size="8.5" fill="#94a3b8">Regional &amp; long-haul</text>
    <text x="405" y="600" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#ffffff">Our Fleet</text>
    <text x="405" y="615" font-family="system-ui, sans-serif" font-size="8.5" fill="#94a3b8">Late-model equipment</text>

    <!-- Footer -->
    <text x="40" y="745" font-family="system-ui, sans-serif" font-weight="800" font-size="13" fill="#ff6600">Build Your Website →</text>
    <text x="560" y="745" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#ffffff" text-anchor="end">THEWALGROUP.IN</text>
    <text x="560" y="765" font-family="system-ui, sans-serif" font-weight="600" font-size="9" fill="#94a3b8" text-anchor="end">USA · CANADA · UK · AUSTRALIA · WORLDWIDE</text>
  </svg>`;

  const coverBuf = Buffer.from(coverSvg);
  await sharp(coverBuf).webp({ quality: 95 }).toFile(path.join(outputDir, 'master-brochure-cover.webp'));
  await sharp(coverBuf).jpeg({ quality: 95 }).toFile(path.join(outputDir, 'master-brochure-cover.jpg'));
  console.log('✓ Created master-brochure-cover.webp and .jpg');
}

generateAllBrochures().catch(console.error);
