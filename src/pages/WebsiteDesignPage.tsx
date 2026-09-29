import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Monitor, 
  Laptop, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Download, 
  Eye, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Globe, 
  Truck, 
  Building2, 
  Wrench, 
  Utensils, 
  Home as HomeIcon, 
  Briefcase, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Mail, 
  X, 
  Send, 
  HelpCircle,
  Lock,
  Search,
  BarChart,
  RefreshCw,
  FileCheck,
  Zap,
  Check,
  ArrowUpRight
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { PdfViewerModal } from '../components/PdfViewerModal';
import { WebsiteProjectModal, WebsitePackageInfo } from '../components/WebsiteProjectModal';
import { getOptimizedImageUrl, getResponsiveSrcSet } from '../lib/imageOptimizer';

interface Props {
  navigate: (path: string) => void;
}

interface PortfolioItem {
  id: string;
  title: string;
  sectorTag: string;
  industry: string;
  headline: string;
  deliberateRelationship: string;
  description: string;
  label: string;
  url?: string;
  image: string;
  tags: string[];
}

interface PackageItem {
  id: string;
  name: string;
  price: string;
  period?: string;
  badge?: string;
  description: string;
  pages: string;
  revisions: string;
  delivery: string;
  renewal: string;
  highlights: string[];
  pdfUrl: string;
  pdfFilename: string;
}

export const WebsiteDesignPage: React.FC<Props> = ({ navigate }) => {
  const { openBookDemo } = useBooking();

  // State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [heroActiveSector, setHeroActiveSector] = useState<string>('ml-worldwide');
  
  // PDF Viewer Modal State: tracks active PDF URL and modal visibility
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [activePdfUrl, setActivePdfUrl] = useState<string>('/brochures/wal-groups-website-services-brochure-2026.pdf');
  const [activePdfTitle, setActivePdfTitle] = useState<string>('Website Services Brochure');
  const [activePdfSubtitle, setActivePdfSubtitle] = useState<string>('Official Master PDF — 2026 Edition');
  const [activePdfFilename, setActivePdfFilename] = useState<string>('wal-groups-website-services-brochure-2026.pdf');

  // Universal Website Project Form State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [projectModalPackage, setProjectModalPackage] = useState<WebsitePackageInfo | null>(null);

  const openProjectForm = (pkg?: PackageItem | WebsitePackageInfo) => {
    if (pkg) {
      setProjectModalPackage({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price.includes('$1,499') ? 'Starting at $1,499+' : pkg.price,
        delivery: (pkg as any).delivery,
        pages: (pkg as any).pages,
        badge: (pkg as any).badge
      });
    } else {
      setProjectModalPackage({
        id: 'business',
        name: 'Business Website',
        price: '$699',
        delivery: '5–7 business days',
        pages: 'Up to 8 pages',
        badge: 'MOST POPULAR'
      });
    }
    setIsProjectModalOpen(true);
  };

  const openPdfModal = (
    url = '/brochures/wal-groups-website-services-brochure-2026.pdf',
    title = 'Website Services Brochure',
    subtitle = 'Official Master PDF — 2026 Edition',
    downloadFilename = 'wal-groups-website-services-brochure-2026.pdf'
  ) => {
    setActivePdfUrl(url);
    setActivePdfTitle(title);
    setActivePdfSubtitle(subtitle);
    setActivePdfFilename(downloadFilename);
    setIsPdfModalOpen(true);
  };

  // Alias for backward compatibility across all call sites
  const openPdfViewer = openPdfModal;
  const closePdfModal = () => setIsPdfModalOpen(false);

  const [reviewFormState, setReviewFormState] = useState({
    url: '',
    fullName: '',
    email: '',
    phone: '',
    notes: '',
    status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
    message: ''
  });

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Portfolio items strictly from prompt & uploaded screenshots
  const portfolioItems: PortfolioItem[] = [
    {
      id: 'ml-worldwide',
      title: 'M&L WORLDWIDE LOGISTICS',
      sectorTag: 'TRANSPORTATION & SUPPLY CHAIN',
      industry: 'Freight Brokerage & Fleet Operations',
      headline: 'High-Velocity Freight Booking & Live Shipment Tracking',
      deliberateRelationship: 'Transportation companies lose contracts when shippers cannot verify fleet equipment or track loads in real time. We engineered this platform around real-time PRO/BOL tracking lookup, interactive lane freight quotes, specialized drive-away vehicle capabilities, and rapid driver qualification.',
      description: 'Integrated supply chain platform featuring domestic freight brokerage, single drive-away vehicle movements, PRO/BOL tracking lookup, interactive quote request, and fleet capabilities.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://m-l-worldwide-logistics.netlify.app',
      image: '/images/portfolio/ml-worldwide.webp',
      tags: ['Freight Brokerage', 'Live Tracking Bar', 'Quote Request', 'Fleet Showcase']
    },
    {
      id: 'southdekalb',
      title: 'SOUTH DEKALB TOWING',
      sectorTag: 'TOWING & EMERGENCY ROADSIDE',
      industry: 'Emergency Roadside & Vehicle Transport',
      headline: 'Urgent High-Intent Mobile Conversion & Instant Dispatch',
      deliberateRelationship: 'Motorists stranded on highways search for roadside assistance under intense stress directly on smartphones. The interface prioritizes immediate one-tap 24/7 emergency dispatch calls, live GPS directions to the vehicle storage yard, impound checklist transparency, and fast online tow requests.',
      description: 'High-conversion emergency towing and vehicle transport platform serving Lithonia & South DeKalb. Features 24/7 click-to-call, request-a-tow booking, storage yard details, and Google Maps directions.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://southdekalb.netlify.app',
      image: '/images/portfolio/southdekalb.webp',
      tags: ['24/7 Roadside Dispatch', 'Click-to-Call', 'Instant Tow Booking', 'Local Map Integration']
    },
    {
      id: 'alpine-medical',
      title: 'ALPINE MEDICAL SERVICES',
      sectorTag: 'HEALTHCARE & REGULATED SERVICES',
      industry: 'Regulated Medical Waste & Biohazard Logistics',
      headline: 'Trust-First Regulatory Compliance & Statewide Manifest Tracking',
      deliberateRelationship: 'Hospitals, medical practices, and laboratories require strict adherence to state health and federal EPA/OSHA regulations. This platform establishes immediate legal authority with an interactive Arizona coverage directory, downloadable compliance certificates, sharps disposal protocols, and emergency biohazard dispatch.',
      description: 'Regulated medical waste management platform across Arizona. Features statewide manifest tracking, compliance dossier access, sharps & biohazard services, and emergency dispatch contact.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://alpine-medical-services.netlify.app',
      image: '/images/portfolio/alpine-medical.webp',
      tags: ['Medical Waste Logistics', 'Compliance Dossier', 'Statewide Coverage', 'Direct Dispatch']
    },
    {
      id: 'abhijobs',
      title: 'ABHI JOBS',
      sectorTag: 'STAFFING & TALENT PLATFORMS',
      industry: 'Skills-First Careers & Recruitment Portal',
      headline: 'Dual-Faceted Candidate Search & Employer Talent Sourcing',
      deliberateRelationship: 'Recruitment and staffing firms must seamlessly engage two distinct audiences: jobseekers looking for verified roles and corporate employers hiring talent. We architected a dual-audience portal featuring live keyword role filtering, fast candidate application workflows, employer hiring packages, and talent request intake.',
      description: 'Skills-first career platform designed to connect talent with meaningful opportunities. Features candidate search, skills classification, applicant workflow, and employer talent acquisition.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://abhijobs.netlify.app',
      image: '/images/portfolio/abhijobs.webp',
      tags: ['Job Search Portal', 'Candidate Workflow', 'Employer Hub', 'Responsive UI']
    },
    {
      id: 'wal-groups',
      title: 'WAL GROUPS',
      sectorTag: 'ENTERPRISE OPERATIONS & FLEET BACKBONE',
      industry: 'Logistics Operations & Backend Outsourcing',
      headline: 'Mission-Critical Operations Control Center & Executive Portal',
      deliberateRelationship: 'Amazon DSPs, AFPs, and commercial trucking fleets operate 24/7 and require seamless operational coordination. Our own platform showcases live dispatch monitoring systems, automated route reconciliation, payroll audit infrastructure, and client executive workspace logins.',
      description: 'Complete digital operational backbone for Amazon DSPs, AFPs, and trucking businesses. Combines 24/7 dispatch monitoring, automated reconciliation, and executive client portals.',
      label: 'OUR OWN SITE',
      url: 'https://thewalgroup.in',
      image: '/images/portfolio/wal-groups.webp',
      tags: ['Live Control Center', '24/7 Operations Hub', 'Client Portal', 'Logistics Ecosystem']
    }
  ];

  // Packages strictly from Master Brochure
  const packages: PackageItem[] = [
    {
      id: 'starter',
      name: 'Starter Website',
      price: '$399',
      period: 'one-time project fee',
      description: 'Get your business online professionally. For owner-operators, small businesses and anyone needing a professional essential website.',
      pages: 'Up to 5 pages',
      revisions: '1 revision round',
      delivery: '3–5 business days',
      renewal: 'Hosting renewal from year two: $79/yr',
      highlights: [
        'Custom business-focused responsive design',
        'Home, About, Services, Contact + Fleet/Equipment where applicable',
        'Contact form, click-to-call & email contact',
        'WhatsApp, Google Maps & social media integration',
        'Professional navigation and site structure',
        'Basic SEO & Google-friendly setup',
        'Basic speed optimization & security setup',
        'Social sharing / Open Graph setup',
        'SSL certificate, 1-year domain & first-year hosting included',
        'Website launch, testing & 30 days post-launch support'
      ],
      pdfUrl: '/brochures/wal-groups-starter-website-brochure.pdf',
      pdfFilename: 'wal-groups-starter-website-brochure.pdf'
    },
    {
      id: 'business',
      name: 'Business Website',
      price: '$699',
      period: 'one-time project fee',
      badge: 'MOST POPULAR',
      description: 'Build a stronger online presence and generate more enquiries. For growing businesses that need more pages, stronger presentation and better enquiry functionality.',
      pages: 'Up to 8 pages',
      revisions: '3 revision rounds',
      delivery: '5–7 business days',
      renewal: 'Hosting renewal from year two: $99/yr',
      highlights: [
        'EVERYTHING IN STARTER, PLUS:',
        'Enhanced SEO & basic keyword research',
        'Google Analytics & Google Search Console setup',
        'Conversion-focused contact sections',
        'Multiple contact / lead capture forms',
        'Testimonials / Customer Reviews section',
        'Structured FAQ section',
        'Enhanced speed & Core Web Vitals optimization',
        'Basic website enquiry tracking & email alerts',
        'More advanced design sections & business integrations'
      ],
      pdfUrl: '/brochures/wal-groups-business-website-brochure.pdf',
      pdfFilename: 'wal-groups-business-website-brochure.pdf'
    },
    {
      id: 'growth',
      name: 'Growth Website',
      price: '$999',
      period: 'one-time project fee',
      description: 'Build a larger, conversion-focused website with advanced functionality. For established businesses requiring stronger design, SEO, content structure and advanced functionality.',
      pages: 'Up to 12 pages',
      revisions: 'Unlimited revisions during development*',
      delivery: '7–10 business days',
      renewal: 'Hosting renewal from year two: $129/yr',
      highlights: [
        'EVERYTHING IN BUSINESS, PLUS:',
        'Advanced custom design & multiple landing pages',
        'Advanced SEO & stronger local SEO setup with schema markup',
        'Advanced lead-generation & multi-step quote forms',
        'Blog / News architecture setup',
        'Booking or quote functionality where appropriate',
        'Advanced analytics & conversion funnel tracking',
        'Speed and performance optimization',
        'Google Business Profile guidance & technical review',
        'Advanced business integrations as required'
      ],
      pdfUrl: '/brochures/wal-groups-growth-website-brochure.pdf',
      pdfFilename: 'wal-groups-growth-website-brochure.pdf'
    },
    {
      id: 'custom',
      name: 'Custom Website',
      price: '$1,499+',
      period: 'starting from',
      description: 'A website and digital system built around your specific business requirements. For businesses requiring custom functionality, integrations, larger websites or specialized workflows.',
      pages: 'Custom scope',
      revisions: 'Unlimited within agreed scope',
      delivery: '10–15+ business days',
      renewal: 'Hosting renewal from year two: $149+/yr',
      highlights: [
        'Fully custom design & bespoke digital system',
        'Larger & multi-location website architecture',
        'Interactive booking & advanced quote systems',
        'Custom forms, workflows & client data intake',
        'E-commerce systems & payment workflows where required',
        'Customer portals & membership / login systems',
        'Advanced CRM & API integrations',
        'Custom dashboards & operational databases',
        'Advanced SEO, analytics & ongoing maintenance options',
        'Final pricing confirmed based on project requirements'
      ],
      pdfUrl: '/brochures/wal-groups-custom-website-brochure.pdf',
      pdfFilename: 'wal-groups-custom-website-brochure.pdf'
    }
  ];

  // Capabilities grid from Section 25
  const capabilities = [
    { title: 'Services & Solutions', desc: 'Clear breakdown of your capabilities, freight types, and client offerings.' },
    { title: 'Fleet & Equipment', desc: 'Present tractors, trailers, vans, medical trucks, or specialized machinery.' },
    { title: 'Service Areas & Lanes', desc: 'Dedicated lanes, regional coverage maps, and geographic availability.' },
    { title: 'Quote Requests', desc: 'Structured quote request forms that collect origin, destination, and freight type.' },
    { title: 'Enquiry Forms', desc: 'Frictionless forms placed where customers naturally look.' },
    { title: 'Online Booking', desc: 'Scheduling systems for discovery calls, tow dispatches, or consultations.' },
    { title: 'Testimonials & Reviews', desc: 'Build immediate trust with customer ratings, certifications, and proof.' },
    { title: 'FAQ / Knowledge', desc: 'Answer common questions upfront to filter serious business enquiries.' },
    { title: 'Blog & News', desc: 'Publish company updates, industry announcements, and SEO content.' },
    { title: 'WhatsApp & Direct Call', desc: 'Instant communication buttons visible on every page on mobile and desktop.' },
    { title: 'Multiple Locations', desc: 'Dedicated branches, service terminals, depots, and local contact hubs.' },
    { title: 'Customer Portals', desc: 'Secure client-facing areas for accounts, documents, and private updates.' },
    { title: 'Custom Workflows', desc: 'Data collection and intake tailored to how your internal dispatchers operate.' },
    { title: 'E-commerce & Payments', desc: 'Product/service catalogs with integrated card or PayPal checkout workflows.' },
    { title: 'Business Integrations', desc: 'Connect form submissions directly to CRM, email notifications, or spreadsheets.' }
  ];

  // Process steps from Section 28 / Master Brochure
  const processSteps = [
    { step: '01', title: 'Discover', desc: 'Understand your business, services, target audience and website requirements.' },
    { step: '02', title: 'Plan', desc: 'Structure the website, pages, content organization and user conversion journey.' },
    { step: '03', title: 'Design', desc: 'Create the visual direction, clean layouts and business-focused experience.' },
    { step: '04', title: 'Build', desc: 'Develop the agreed website, responsive templates and interactive functionality.' },
    { step: '05', title: 'Review', desc: 'You review the live staged website and share structured feedback.' },
    { step: '06', title: 'Test', desc: 'Check responsiveness across devices, forms, contact links, speed and security.' },
    { step: '07', title: 'Launch', desc: 'Connect the domain, complete launch setup, and publish the website live.' },
    { step: '08', title: 'Support', desc: 'Provide 30 days post-launch technical support and ongoing maintenance.' }
  ];

  // 12 Website Review Checklist Points
  const reviewChecklist = [
    { number: '01', title: 'Mobile Experience', desc: 'Ensuring buttons, fonts, and forms work effortlessly on smartphones.' },
    { number: '02', title: 'Website Design', desc: 'Modern, credible aesthetic that matches your real-world capability.' },
    { number: '03', title: 'Navigation Structure', desc: 'Clear, intuitive menus so visitors find services in seconds.' },
    { number: '04', title: 'Contact Visibility', desc: 'Phone, email, and WhatsApp accessible on every screen.' },
    { number: '05', title: 'Calls-to-Action', desc: 'Distinct, compelling next steps that drive visitor conversion.' },
    { number: '06', title: 'Quote / Enquiry Process', desc: 'Simple forms that capture lead details without overwhelming visitors.' },
    { number: '07', title: 'Services Presentation', desc: 'Clear explanations of what you do, who you serve, and why trust you.' },
    { number: '08', title: 'Fleet / Equipment Showcase', desc: 'Highlighting physical assets and operational capacity where relevant.' },
    { number: '09', title: 'Trust & Credibility', desc: 'Certifications, compliance info, reviews, and professional proof.' },
    { number: '10', title: 'Website Speed', desc: 'Fast load times and clean technical foundations for low bounce rates.' },
    { number: '11', title: 'Content Clarity', desc: 'Plain-language messaging that speaks directly to prospective clients.' },
    { number: '12', title: 'Local Search Fundamentals', desc: 'Meta tags, Google Search Console indexing, and local SEO structure.' }
  ];

  // 15 Verbatim FAQs from Brochure
  const faqs = [
    {
      q: 'How much does a website cost?',
      a: 'Website packages start at $399 for the Starter package, with options for growing businesses ($699 for Business, $999 for Growth) and custom digital requirements ($1,499+ for Custom).'
    },
    {
      q: 'How long does a website take?',
      a: 'From 3–5 business days for Starter to 5–7 days for Business, 7–10 days for Growth, and 10–15+ business days for Custom projects, depending on requirements and how quickly content and approvals are provided.'
    },
    {
      q: 'Do you provide hosting?',
      a: 'Yes. First-year hosting is included with all standard website packages. After year one, hosting renewal is transparent ($79/yr for Starter, $99/yr for Business, $129/yr for Growth, and $149+/yr for Custom).'
    },
    {
      q: 'Is a domain included?',
      a: 'Yes. A 1-year domain registration is included with all standard packages. After the first year, domain renewal is separate and charged based on the domain extension and registrar pricing.'
    },
    {
      q: 'Can I use my existing domain?',
      a: 'Yes. We can assist with connecting your existing domain to your new website without any issue.'
    },
    {
      q: 'Will I own my website?',
      a: 'Yes. Once the project is fully paid, we provide the appropriate access to the completed website and business assets according to the agreed project terms. The domain is registered for your business and remains under your ownership and control.'
    },
    {
      q: 'Do you provide SEO?',
      a: 'Yes. SEO setup varies by package, from basic search-friendly fundamentals (meta titles, descriptions, sitemaps, alt tags) in Starter, to enhanced keyword research and Search Console setup in Business, and advanced schema and local SEO in Growth.'
    },
    {
      q: 'Do you guarantee Google rankings?',
      a: 'No. We do not guarantee Google rankings, traffic, leads or customers. We build solid, clean SEO foundations, but search results depend on competitive factors outside anyone\'s control.'
    },
    {
      q: 'Can you redesign my existing website?',
      a: 'Yes. We review your existing site and determine whether improving specific sections or rebuilding is more practical and cost-effective.'
    },
    {
      q: 'Can you help with website content?',
      a: 'Yes. Don\'t have everything professionally written? Send us your existing information, brochures, documents, photos, or rough notes — we will help organize them into a clean, professional website structure.'
    },
    {
      q: 'Do you provide support after launch?',
      a: 'Yes. 30 days of free post-launch technical support is included with every website, followed by an optional annual maintenance plan ($199/year) for ongoing content updates, security checks, and backups.'
    },
    {
      q: 'Can you add booking or quote forms?',
      a: 'Yes. Contact and quote forms are supported across all packages, with multi-step quote systems and appointment booking functionality available in Business, Growth, and Custom tiers.'
    },
    {
      q: 'Can you build e-commerce or customer portals?',
      a: 'Yes, through the Custom package where appropriate for products, online payments, or private client account areas.'
    },
    {
      q: 'Am I locked into Wal Groups?',
      a: 'No. Our goal is to build your online presence and provide you with full ownership and control — not lock you into Wal Groups.'
    },
    {
      q: 'What are the payment terms?',
      a: 'We use a simple, two-part payment structure: 50% at project start before development begins, and 50% on completion after approval, before final launch/handover. Payments are currently accepted via secure PayPal invoice.'
    }
  ];

  // Handle Review Request Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewFormState.url || !reviewFormState.email) {
      setReviewFormState(prev => ({ ...prev, status: 'error', message: 'Please provide both your website URL and contact email.' }));
      return;
    }

    setReviewFormState(prev => ({ ...prev, status: 'submitting', message: '' }));

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewFormState.fullName || 'Website Review Request',
          email: reviewFormState.email,
          phone: reviewFormState.phone,
          service: 'Website Design & Development',
          servicesOfInterest: ['Existing Website Review & Audit'],
          source: 'Website Review Request Form',
          notes: `Existing Website URL: ${reviewFormState.url} | Additional Notes: ${reviewFormState.notes || 'No extra notes provided'}`
        })
      });

      if (res.ok) {
        setReviewFormState({
          url: '',
          fullName: '',
          email: '',
          phone: '',
          notes: '',
          status: 'success',
          message: 'Thank you! We have received your review request and will inspect your website and reply with objective feedback shortly.'
        });
      } else {
        throw new Error('Failed to submit review request');
      }
    } catch (err) {
      setReviewFormState(prev => ({
        ...prev,
        status: 'error',
        message: 'Could not send review request. Please try again or reach out directly on WhatsApp.'
      }));
    }
  };

  return (
    <div className="font-sans text-[#163a63] bg-white selection:bg-[#ff7700] selection:text-white">
      {/* =========================================================================
          4. HERO SECTION (Editorial, Commercial, High Credibility)
          ========================================================================= */}
      <section className="relative bg-[#041e42] text-white pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff6600]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#0073a8]/20 rounded-full blur-3xl" />
        </div>

        {/* Subtle Grid pattern representing structured layout craftsmanship */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#ff8533] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#ff7700] animate-pulse" />
                <span>WEBSITE DESIGN &amp; DEVELOPMENT</span>
              </div>

              {/* H1 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Professional websites built around your business.
              </h1>

              {/* Supporting Copy */}
              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                We design and develop professional, responsive websites that help businesses present their services clearly, build credibility and make it easier for customers to get in touch.
              </p>

              {/* Coverage Line */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300">
                <Globe className="w-4 h-4 text-[#ff7700] shrink-0" />
                <span>USA · Canada · UK · Australia · Worldwide</span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('packages')}
                  className="bg-[#ff6600] hover:bg-[#e65c00] text-black font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,102,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,102,0,0.5)] cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Website Packages</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-4 h-4 text-[#ff8533]" />
                  <span>View Our Work</span>
                </button>
              </div>

              {/* Fast credibility indicators */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">3–5 Days</div>
                  <div className="text-slate-400 mt-0.5">Fast Starter Delivery</div>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">100% Owned</div>
                  <div className="text-slate-400 mt-0.5">Your Domain &amp; Site</div>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">30 Days</div>
                  <div className="text-slate-400 mt-0.5">Free Launch Support</div>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Editorial Device Presentation */}
            <div className="lg:col-span-5 relative">
              {/* Browser Mockup Wrapper */}
              <div className="relative rounded-2xl bg-[#091524] border border-white/15 p-3 shadow-2xl backdrop-blur-xl">
                {/* Browser bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="bg-white/10 px-3 py-0.5 rounded text-[11px] text-slate-300 font-mono tracking-tight flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>
                      {heroActiveSector === 'southdekalb' 
                        ? 'southdekalb.netlify.app' 
                        : heroActiveSector === 'alpine-medical'
                        ? 'alpine-medical-services.netlify.app'
                        : heroActiveSector === 'abhijobs'
                        ? 'abhijobs.netlify.app'
                        : heroActiveSector === 'wal-groups'
                        ? 'thewalgroup.in'
                        : 'm-l-worldwide-logistics.netlify.app'}
                    </span>
                  </div>
                  <a
                    href={
                      heroActiveSector === 'southdekalb' 
                        ? 'https://southdekalb.netlify.app' 
                        : heroActiveSector === 'alpine-medical'
                        ? 'https://alpine-medical-services.netlify.app'
                        : heroActiveSector === 'abhijobs'
                        ? 'https://abhijobs.netlify.app'
                        : heroActiveSector === 'wal-groups'
                        ? 'https://thewalgroup.in'
                        : 'https://m-l-worldwide-logistics.netlify.app'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#ff8533] hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Website Preview Graphic — Strictly Preserves 16:9 Aspect Ratio with Dynamic WebP */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/9] bg-[#0c1829] border border-white/10 shadow-inner">
                  {(() => {
                    const heroImgSrc = 
                      heroActiveSector === 'southdekalb' 
                        ? '/images/portfolio/southdekalb.webp' 
                        : heroActiveSector === 'alpine-medical'
                        ? '/images/portfolio/alpine-medical.webp'
                        : heroActiveSector === 'abhijobs'
                        ? '/images/portfolio/abhijobs.webp'
                        : heroActiveSector === 'wal-groups'
                        ? '/images/portfolio/wal-groups.webp'
                        : '/images/portfolio/ml-worldwide.webp';
                    return (
                      <picture className="w-full h-full block">
                        <source
                          type="image/webp"
                          srcSet={getResponsiveSrcSet(heroImgSrc, [400, 800, 1200], 80, 'webp')}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 800px"
                        />
                        <img 
                          src={getOptimizedImageUrl(heroImgSrc, 800, 80, 'webp')} 
                          alt="Custom Built Website Tailored to Your Sector Preview"
                          className="w-full h-full object-cover object-top transition-all duration-300"
                          loading="lazy"
                          decoding="async"
                          width={1200}
                          height={675}
                        />
                      </picture>
                    );
                  })()}
                </div>

                {/* Sector Switcher Chips */}
                <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
                  <span className="text-slate-400 font-medium shrink-0 hidden sm:inline">Preview:</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {[
                      { id: 'ml-worldwide', label: 'Logistics' },
                      { id: 'southdekalb', label: 'Towing' },
                      { id: 'alpine-medical', label: 'Healthcare' },
                      { id: 'abhijobs', label: 'Staffing' },
                      { id: 'wal-groups', label: 'Enterprise' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setHeroActiveSector(tab.id)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                          heroActiveSector === tab.id 
                            ? 'bg-[#ff6600] text-black font-extrabold shadow-sm' 
                            : 'bg-white/5 hover:bg-white/15 text-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle tag */}
                <div className="mt-2.5 px-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-200">Custom Built · Tailored to Your Sector</span>
                  <span className="text-[#ff8533] font-semibold">100% Mobile Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          9. WHY YOUR BUSINESS NEEDS A PROFESSIONAL WEBSITE
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              FIRST IMPRESSIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight leading-snug">
              Your website is often the first impression of your business. Make it count.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Before a customer calls, requests a quote or sends an email, they look you up. What they find determines whether they reach out or move on to a competitor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-[#f8fafc] hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#ff6600]/40 transition-all hover:shadow-xl group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-white flex items-center justify-center font-bold text-lg group-hover:bg-[#ff6600] group-hover:text-black transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Build Credibility</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Present your business professionally and give potential customers a clear place to understand who you are and what you offer.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#f8fafc] hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#ff6600]/40 transition-all hover:shadow-xl group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-white flex items-center justify-center font-bold text-lg group-hover:bg-[#ff6600] group-hover:text-black transition-colors">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Explain Your Services</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organize your services, capabilities, locations and business information clearly so prospects quickly understand your scope.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#f8fafc] hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#ff6600]/40 transition-all hover:shadow-xl group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-white flex items-center justify-center font-bold text-lg group-hover:bg-[#ff6600] group-hover:text-black transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Make Contact Easy</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Use contact forms, click-to-call, WhatsApp, enquiry and quote options where appropriate on every page and device.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#f8fafc] hover:bg-white p-7 rounded-2xl border border-slate-200/80 hover:border-[#ff6600]/40 transition-all hover:shadow-xl group space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-white flex items-center justify-center font-bold text-lg group-hover:bg-[#ff6600] group-hover:text-black transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Stand Out Online</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create a website that reflects your business instead of relying on a generic template or outdated social media page.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          10–17. CUSTOM BUILT · TAILORED TO YOUR SECTOR (Premium Editorial Presentation)
          ========================================================================= */}
      <section id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7fb] scroll-mt-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
                CUSTOM BUILT · TAILORED TO YOUR SECTOR
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#041e42] tracking-tight leading-tight">
                Websites Engineered for Specific Business Requirements
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                We don't force generic templates onto unique industries. Every sector has distinct workflows, compliance requirements, and customer conversion paths. Here is how WAL GROUPS builds websites around the operational reality of each sector.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#041e42] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>5 Verified Sector Architecture Demos</span>
              </span>
            </div>
          </div>

          {/* Premium Editorial Showcase: Balanced Text + Image Composition */}
          <div className="space-y-16 lg:space-y-20">
            {portfolioItems.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden p-6 sm:p-8 lg:p-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Visual Column: Preserves Natural 16:9 Proportions with Crisp Device Chrome */}
                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md bg-[#0a1424]">
                        {/* Browser Chrome Header */}
                        <div className="bg-[#0b1626] px-4 py-3 border-b border-slate-800 flex items-center justify-between select-none">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                            </div>
                            <div className="ml-2 px-2.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[11px] flex items-center gap-1.5">
                              <Lock className="w-3 h-3 text-emerald-400" />
                              <span className="truncate max-w-[200px] sm:max-w-xs">
                                {item.url?.replace('https://', '') || 'demo.walgroup.in'}
                              </span>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold text-[#ff8533] uppercase tracking-wider hidden sm:inline">
                            {item.label}
                          </span>
                        </div>

                        {/* Screenshot Image: 16:9 Aspect Ratio Maintained, Dynamic WebP & Resized */}
                        <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden group">
                          <picture className="w-full h-full block">
                            <source
                              type="image/webp"
                              srcSet={getResponsiveSrcSet(item.image, [400, 800, 1200], 80, 'webp')}
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 650px"
                            />
                            <img 
                              src={getOptimizedImageUrl(item.image, 800, 80, 'webp')} 
                              alt={`${item.title} — ${item.industry} Custom Built Website Preview`}
                              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                              loading="lazy"
                              decoding="async"
                              width={1200}
                              height={675}
                            />
                          </picture>

                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-3 right-3 bg-[#041e42]/90 hover:bg-[#ff6600] text-white hover:text-black text-xs font-bold px-3.5 py-2 rounded-lg backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg"
                            >
                              <span>View Live Website</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Editorial Text Column: Deliberate Relationship with the Sector */}
                    <div className={`lg:col-span-5 space-y-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold tracking-wider text-[#ff6600] uppercase">
                            {item.sectorTag}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-semibold text-slate-500">
                            {item.industry}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#041e42] tracking-tight">
                          {item.title}
                        </h3>

                        <h4 className="text-sm sm:text-base font-bold text-slate-700">
                          {item.headline}
                        </h4>
                      </div>

                      {/* Deliberate Sector Relationship Copy */}
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.deliberateRelationship}
                      </p>

                      {/* Built-In Architecture Highlights */}
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#041e42] block">
                          Tailored Capabilities Built In:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {item.tags.map((tag, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6600] shrink-0" />
                              <span>{tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Links */}
                      {item.url && (
                        <div className="pt-3 flex items-center gap-4">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#ff6600] hover:text-[#e65c00] transition-colors"
                          >
                            <span>Open Live Website Demo</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* DEMO / CONCEPT DISCLAIMER */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center max-w-4xl mx-auto shadow-sm">
            <span className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider block mb-1">
              DEMO / CONCEPT DISCLAIMER
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              These websites are custom design and development examples created to demonstrate website architecture across distinct sectors. They are not presented as paid client projects unless explicitly identified as such.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          18–22. WEBSITE PACKAGES (Pricing, Inclusions, and Direct PDF Downloads)
          ========================================================================= */}
      <section id="packages" className="py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#041e42] tracking-tight">
              Choose the Website Built for Your Business
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Straightforward pricing with zero hidden fees. From essential business sites to custom enterprise platforms, choose the level of functionality that fits your operations.
            </p>
          </div>

          {/* 4 Pricing Cards with High Readability */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.badge 
                    ? 'bg-[#041e42] text-white shadow-2xl ring-2 ring-[#ff6600] md:-translate-y-2' 
                    : 'bg-[#f8fafc] text-[#041e42] border border-slate-200/90 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                {/* Popular Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff6600] text-black text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    {pkg.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-extrabold tracking-tight ${pkg.badge ? 'text-white' : 'text-[#041e42]'}`}>
                      {pkg.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className={`text-4xl font-black tracking-tight ${pkg.badge ? 'text-[#ff8533]' : 'text-[#ff6600]'}`}>
                        {pkg.price}
                      </span>
                      {pkg.period && (
                        <span className={`text-xs font-medium ${pkg.badge ? 'text-slate-300' : 'text-slate-500'}`}>
                          {pkg.period}
                        </span>
                      )}
                    </div>
                    <p className={`mt-3 text-xs leading-relaxed font-normal ${pkg.badge ? 'text-slate-300' : 'text-slate-600'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  {/* Delivery & Revisions metadata */}
                  <div className={`p-3.5 rounded-xl space-y-2 text-xs ${pkg.badge ? 'bg-white/10' : 'bg-white border border-slate-200/80 shadow-xs'}`}>
                    <div className="flex justify-between items-center">
                      <span className={pkg.badge ? 'text-slate-300 font-medium' : 'text-slate-500 font-medium'}>Pages:</span>
                      <span className="font-bold">{pkg.pages}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={pkg.badge ? 'text-slate-300 font-medium' : 'text-slate-500 font-medium'}>Revisions:</span>
                      <span className="font-bold">{pkg.revisions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={pkg.badge ? 'text-slate-300 font-medium' : 'text-slate-500 font-medium'}>Timeline:</span>
                      <span className="font-bold">{pkg.delivery}</span>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-2.5">
                    <span className={`text-xs font-bold uppercase tracking-wider block ${pkg.badge ? 'text-[#ff8533]' : 'text-[#041e42]'}`}>
                      Key Inclusions
                    </span>
                    <ul className="space-y-2 text-xs">
                      {pkg.highlights.slice(0, 7).map((hl, i) => (
                        <li key={i} className="flex items-start gap-2 leading-snug">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.badge ? 'text-[#ff8533]' : 'text-[#ff6600]'}`} />
                          <span className={pkg.badge ? 'text-slate-200' : 'text-slate-700'}>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions: Primary Select Plan & Secondary Brochure Links */}
                <div className="pt-6 mt-6 border-t border-slate-200/50 space-y-2.5">
                  <button
                    onClick={() => openProjectForm(pkg)}
                    className={`w-full py-3.5 px-5 rounded-xl text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                      pkg.badge 
                        ? 'bg-[#ff6600] hover:bg-[#e65c00] text-black shadow-[0_4px_20px_rgba(255,102,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,102,0,0.45)]' 
                        : 'bg-[#041e42] hover:bg-[#062c60] text-white hover:shadow-lg'
                    }`}
                  >
                    <span>Select Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => openPdfViewer(pkg.pdfUrl, `${pkg.name} Brochure`, 'Package Specifications & Inclusions', pkg.pdfFilename)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        pkg.badge 
                          ? 'border-white/20 text-slate-200 hover:bg-white/10' 
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      title={`View ${pkg.name} Brochure PDF`}
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ff8533]" />
                      <span>View Brochure</span>
                    </button>

                    <a
                      href={`${pkg.pdfUrl}?download=1`}
                      download={pkg.pdfFilename}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        pkg.badge 
                          ? 'border-white/20 text-slate-200 hover:bg-white/10' 
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Download PDF directly"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </a>
                  </div>

                  <div className={`text-[11px] text-center pt-1 font-medium ${pkg.badge ? 'text-slate-300' : 'text-slate-500'}`}>
                    {pkg.renewal}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Transparent Deposit & Ownership Policy Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl bg-[#041e42] text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff8533] font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>50% Deposit / 50% On Approval</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Simple 50% deposit before start and 50% only upon final approval via PayPal invoice. You never pay the final balance until satisfied.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff8533] font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Client Ownership</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You retain complete ownership of your domain, website code, and creative assets. No vendor lock-in or licensing fees ever.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#ff8533] font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>30 Days Free Post-Launch Support</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every website includes 30 days of free post-launch support and bug fixes to ensure smooth deployment and peace of mind.
              </p>
            </div>
          </div>

          {/* Side-by-Side Detailed Features Comparison Table */}
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[#041e42]">
                Detailed Package Comparison
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Compare scope, deliverables, and technical inclusions side by side to choose the perfect package.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#0b1626] text-white border-b border-slate-800">
                    <th className="py-4 px-4 sm:px-6 font-bold text-slate-200">Specification</th>
                    <th className="py-4 px-3 sm:px-4 font-bold text-center">Starter ($399)</th>
                    <th className="py-4 px-3 sm:px-4 font-bold text-center text-[#ff8533] bg-[#041e42]">Business ($699)</th>
                    <th className="py-4 px-3 sm:px-4 font-bold text-center">Growth ($999)</th>
                    <th className="py-4 px-3 sm:px-4 font-bold text-center">Custom ($1,499+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Page Scope</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Up to 5 Pages</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">Up to 8 Pages</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Up to 12 Pages</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold">Custom Scope</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Turnaround Timeline</td>
                    <td className="py-3 px-3 sm:px-4 text-center">3–5 Days</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">5–7 Days</td>
                    <td className="py-3 px-3 sm:px-4 text-center">7–10 Days</td>
                    <td className="py-3 px-3 sm:px-4 text-center">10–15+ Days</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Revision Rounds</td>
                    <td className="py-3 px-3 sm:px-4 text-center">1 Round</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">3 Rounds</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Unlimited</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Unlimited</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">1-Year Domain Registration</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold bg-[#041e42]/5">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">1-Year Fast SSD Cloud Hosting</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold bg-[#041e42]/5">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Annual Hosting Renewal (Yr 2+)</td>
                    <td className="py-3 px-3 sm:px-4 text-center">$79/year</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">$99/year</td>
                    <td className="py-3 px-3 sm:px-4 text-center">$129/year</td>
                    <td className="py-3 px-3 sm:px-4 text-center">$149+/year</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Mobile &amp; Tablet Optimization</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">100% Responsive</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold bg-[#041e42]/5">100% Responsive</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">100% Responsive</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">100% Responsive</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Inquiry &amp; Quote Forms</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Standard Contact</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">Dynamic Service Forms</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Multi-Step Inquiries</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold">Custom Client Portal</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Google Maps &amp; WhatsApp</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold bg-[#041e42]/5">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">Included</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">On-Page SEO Optimization</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Basic Google Setup</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">On-Page Keyword SEO</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Multi-Page Deep SEO</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold">Full Enterprise SEO</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Analytics &amp; Search Console</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Setup Included</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">Setup &amp; Verified</td>
                    <td className="py-3 px-3 sm:px-4 text-center">Goals &amp; Conversion Tracking</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold">Custom Funnel Metrics</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Free Post-Launch Support</td>
                    <td className="py-3 px-3 sm:px-4 text-center">30 Days</td>
                    <td className="py-3 px-3 sm:px-4 text-center font-bold bg-[#041e42]/5 text-[#041e42]">30 Days</td>
                    <td className="py-3 px-3 sm:px-4 text-center">30 Days</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">60 Days Extended</td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 sm:px-6 font-semibold text-[#041e42]">Domain &amp; Code Ownership</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">100% Yours</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold bg-[#041e42]/5">100% Yours</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">100% Yours</td>
                    <td className="py-3 px-3 sm:px-4 text-center text-emerald-600 font-bold">100% Yours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          23–24. FEATURED WEBSITE SERVICES BROCHURE (Master PDF Presentation)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#041e42] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Document Cover Presentation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                {/* Background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6600] to-[#0073a8] rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500" />
                
                {/* Document Card */}
                <div className="relative bg-[#0c1829] rounded-2xl border border-white/20 p-6 shadow-2xl space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-[#ff8533]">OFFICIAL MASTER PDF</span>
                    <span className="text-[11px] font-mono text-slate-400">18 PAGES · 2026 EDITION</span>
                  </div>

                  <div className="aspect-[3/4] bg-[#07101c] rounded-xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-lg bg-[#ff6600] flex items-center justify-center font-bold text-black text-sm">
                        W
                      </div>
                      <div className="text-[11px] uppercase tracking-widest text-[#ff8533] font-bold">
                        WAL GROUPS BUSINESS SERVICES
                      </div>
                      <div className="text-2xl font-black text-white leading-tight">
                        Website Services Brochure
                      </div>
                      <div className="text-xs text-slate-300">
                        Professional websites built for businesses that move.
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[10px] text-slate-300 space-y-1">
                      <div>• Complete Package Specifications</div>
                      <div>• Detailed SEO &amp; Technical Inclusions</div>
                      <div>• 8-Step Timeline &amp; Ownership Terms</div>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => openPdfViewer('/brochures/wal-groups-website-services-brochure-2026.pdf', 'Website Services Brochure', 'Official Master PDF — 2026 Edition', 'wal-groups-website-services-brochure-2026.pdf')}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#ff8533]" />
                      <span>View Brochure</span>
                    </button>

                    <a
                      href="/brochures/wal-groups-website-services-brochure-2026.pdf?download=1"
                      download="wal-groups-website-services-brochure-2026.pdf"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff6600] hover:bg-[#e65c00] text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Brochure Information */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff8533]">
                DOCUMENTATION &amp; SPECIFICATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore Our Website Services
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Want the complete picture? Explore our Website Services Brochure for packages, features, process, support, ownership, FAQs and more.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>Website packages &amp; pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>Features &amp; functionality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>8-step website process</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>Domain &amp; hosting transparency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>SEO &amp; analytics setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>Ownership &amp; support terms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>Annual maintenance options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>Comprehensive FAQs</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => openPdfViewer('/brochures/wal-groups-website-services-brochure-2026.pdf', 'Website Services Brochure', 'Official Master PDF — 2026 Edition', 'wal-groups-website-services-brochure-2026.pdf')}
                  className="bg-[#ff6600] hover:bg-[#e65c00] text-black font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Brochure (Interactive)</span>
                </button>

                <a
                  href="/brochures/wal-groups-website-services-brochure-2026.pdf?download=1"
                  download="wal-groups-website-services-brochure-2026.pdf"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#ff8533]" />
                  <span>Download Master PDF</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          25. WHAT YOUR WEBSITE CAN INCLUDE (Capabilities Grid)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              FUNCTIONALITY &amp; MODULES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              More Than Just a Website
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Your website can be structured around the way your business actually operates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {capabilities.map((cap, i) => (
              <div 
                key={i}
                className="p-5 rounded-xl bg-[#f8fafc] border border-slate-200/80 hover:border-[#ff6600]/30 hover:bg-white transition-all space-y-2 hover:shadow-md"
              >
                <div className="w-7 h-7 rounded-lg bg-[#041e42]/10 text-[#041e42] flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <h3 className="text-sm font-bold text-[#041e42]">{cap.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
            Available functionality depends on the selected package and project requirements.
          </div>

        </div>
      </section>

      {/* =========================================================================
          26. INDUSTRIES WE SERVE
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f4f7fb]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              EXPERIENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Built for Different Businesses
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              We understand the specific requirements, service presentation, and buyer behaviors of diverse industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Industry 1: Transportation */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#ff6600]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Transportation &amp; Logistics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trucking, freight, logistics, towing, delivery, Amazon DSPs/AFPs and related businesses with lane and fleet requirements.
              </p>
            </div>

            {/* Industry 2: Construction */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#ff6600]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Construction &amp; Property</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Commercial contractors, residential builders, real estate firms, civil engineering, and specialized property maintenance.
              </p>
            </div>

            {/* Industry 3: Automotive */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#ff6600]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Automotive Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Auto repair shops, commercial fleet maintenance facilities, collision centers, parts distributors, and detailing operations.
              </p>
            </div>

            {/* Industry 4: Food & Hospitality */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#ff6600]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Food &amp; Hospitality</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Restaurants, cafes, bakeries, commercial catering businesses, and food distribution suppliers needing menu and contact clarity.
              </p>
            </div>

            {/* Industry 5: Home & Local */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#ff6600]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Home &amp; Local Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plumbing, electrical, HVAC contractors, landscaping operations, cleaning companies, and localized residential trades.
              </p>
            </div>

            {/* Industry 6: Professional */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-[#ff6600]/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#041e42]">Professional &amp; Business Services</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consulting, healthcare &amp; medical services, accounting, recruitment agencies, legal practices, and corporate business solutions.
              </p>
            </div>

          </div>

          <div className="p-6 rounded-2xl bg-[#041e42] text-white text-center">
            <p className="text-sm sm:text-base font-semibold">
              Don't see your industry? If your business serves customers, we can build a website around it.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          27. TRANSPORTATION & LOGISTICS SPECIALIZATION (Deep Domain Architecture)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              CORE COMPETENCY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Built With Transportation Businesses in Mind
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              We structure transportation websites around the reality of how trucking companies, fleets, and freight operations actually win business and recruit drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Group 1 */}
            <div className="p-7 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-[#041e42] pb-2 border-b border-slate-200">
                Trucking &amp; Fleet Businesses
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Owner-Operators</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Small &amp; Mid-Size Fleets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Trucking &amp; Hauling Companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Freight Companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Dedicated Lane Carriers</span>
                </li>
              </ul>
            </div>

            {/* Group 2 */}
            <div className="p-7 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-[#041e42] pb-2 border-b border-slate-200">
                Amazon Transportation
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Amazon Delivery Service Partners (DSPs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Amazon Freight Partners (AFPs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Last-Mile &amp; Parcel Delivery Fleets</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Local Van Fleets &amp; Couriers</span>
                </li>
              </ul>
            </div>

            {/* Group 3 */}
            <div className="p-7 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-[#041e42] pb-2 border-b border-slate-200">
                Logistics &amp; Operations
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Third-Party Logistics (3PLs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Logistics &amp; Forwarding Companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Freight Brokers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#ff6600]" />
                  <span>Independent Dispatch Operations</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Section capabilities bar */}
          <div className="p-6 rounded-2xl bg-[#041e42]/5 border border-[#041e42]/10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#041e42] block">
              SECTIONS A TRANSPORTATION WEBSITE CAN INCLUDE:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Services & freight types',
                'Fleet & equipment specs',
                'Service areas & dedicated lanes',
                'Driver careers & application form',
                'Instant freight quote requests',
                'Safety & compliance info',
                '24/7 click-to-call dispatch'
              ].map((item, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-[#041e42]">
                  {item}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Categories above describe the types of businesses our website structures are suited for. They are not a list of current clients.
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          28. WEBSITE DEVELOPMENT PROCESS (8 Clear Steps)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              STRUCTURED EXECUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Eight Clear Steps. One Point of Contact.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              A transparent, streamlined process that gets you online without delays or guesswork.
            </p>
          </div>

          {/* 8 Step Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div 
                key={step.step}
                className="p-6 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-3 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="text-2xl font-black text-[#ff6600] font-mono">
                  {step.step}
                </div>
                <h3 className="text-base font-bold text-[#041e42]">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* What We Need From You Box */}
          <div className="bg-[#f8fafc] p-8 rounded-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff6600]">
                WHAT WE NEED FROM YOU
              </span>
              <h3 className="text-xl font-bold text-[#041e42]">A few essentials to get started.</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Don't have everything professionally prepared? That's okay. Send us your existing information, brochures, documents, photos or rough notes — we'll help organize it into a professional website structure.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Business name</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Company logo</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Services list</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Contact details</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Address / areas</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Team or fleet photos</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Existing website (if redesign)</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Social media links</div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium">✓ Other relevant notes</div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          29. ALREADY HAVE A WEBSITE? LET'S REVIEW IT. (Conversion Section)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7fb] border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              WEBSITE REVIEW &amp; REDESIGN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Already Have a Website? Let's Review It.
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Not every business needs a complete rebuild. We can review your existing website and identify practical opportunities to improve its design, mobile experience, navigation, contact visibility, calls-to-action and overall presentation.
            </p>
          </div>

          {/* 12 Review Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviewChecklist.map((item) => (
              <div 
                key={item.number}
                className="p-5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-sm hover:border-[#ff6600]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#ff6600] font-mono">{item.number}</span>
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-[#041e42]">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Call to action panel */}
          <div className="bg-[#ff6600] p-8 sm:p-10 rounded-2xl text-black flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black tracking-tight">
                Send us your current website and we'll identify practical areas that could be improved.
              </h3>
              <p className="text-sm font-medium text-black/80">
                We'll give recommendations only after actually reviewing your site. Improving or rebuilding — we'll tell you which is more practical.
              </p>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="shrink-0 bg-[#041e42] hover:bg-[#062c60] text-white font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Request a Website Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          30. PACKAGE BROCHURES RESOURCE SECTION (Download the 4 Specific PDFs)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              DOWNLOADABLE ASSETS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Want the Details?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Download the individual package brochure to explore the features and inclusions of each website option.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-200 hover:border-[#ff6600]/40 transition-all flex flex-col justify-between space-y-4 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#041e42] text-[#ff8533] flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#041e42]">{pkg.name}</h3>
                  <div className="text-2xl font-extrabold text-[#ff6600]">{pkg.price}</div>
                  <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openPdfModal(pkg.pdfUrl, `${pkg.name} Brochure`, 'Package Specifications & Inclusions', pkg.pdfFilename)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#041e42] hover:bg-[#062c60] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#ff8533]" />
                    <span>View Brochure</span>
                  </button>

                  <a
                    href={`${pkg.pdfUrl}?download=1`}
                    download={pkg.pdfFilename}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#041e42] border border-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Download original PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          31. ACCESSIBLE FAQ (Answers directly from Master Brochure)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7fb]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              CLEAR ANSWERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Common questions, straight answers.
            </h2>
            <p className="text-slate-600 text-base">
              Everything you need to know about pricing, process, ownership and deliverables.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-sm sm:text-base text-[#041e42] flex items-center justify-between gap-4 hover:text-[#ff6600] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#ff6600]' : 'text-slate-400'}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          32. FINAL CTA SECTION (Commercial Closer with Complete Contact Details)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#041e42] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff8533]">
                LET'S GET STARTED
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Ready to build a better online presence?
              </h2>
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Tell us about your business and what you need your website to do. We'll help you determine the right website package for your requirements.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => openProjectForm(packages[1])}
                  className="bg-[#ff6600] hover:bg-[#e65c00] text-black font-extrabold text-sm sm:text-base px-7 py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,102,0,0.35)] cursor-pointer flex items-center gap-2"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>

                <a
                  href="https://wa.me/916363698148?text=Hello%20Wal%20Groups%20Team%2C%20I%20am%20interested%20in%20a%20website%20design%20and%20development%20package."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>WhatsApp WAL GROUPS</span>
                </a>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Request a Website Review
                </button>
              </div>
            </div>

            {/* Direct Contact Details Card */}
            <div className="lg:col-span-4 bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 space-y-4 backdrop-blur-md">
              <div className="text-lg font-bold text-white">WAL GROUPS</div>
              <div className="text-xs text-[#ff8533] font-semibold">
                Professional websites built for businesses that move.
              </div>
              <div className="text-xs text-slate-300">
                USA · Canada · UK · Australia · Worldwide
              </div>

              <div className="space-y-3 pt-3 border-t border-white/10 text-xs text-slate-200">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <a href="tel:+916363698148" className="hover:text-white transition-colors">
                    +91-636-369-8148
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <a href="mailto:thewalgroups@gmail.com" className="hover:text-white transition-colors">
                    thewalgroups@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#ff8533] shrink-0" />
                  <span>thewalgroup.in</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          MODAL: REQUEST A WEBSITE REVIEW
          ========================================================================= */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-[#041e42]"
            >
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider">
                  EXISTING WEBSITE AUDIT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold">Request a Website Review</h3>
                <p className="text-xs text-slate-600">
                  Send us your current website URL. We will review mobile responsiveness, navigation, conversion visibility, and content clarity.
                </p>
              </div>

              {reviewFormState.status === 'success' ? (
                <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900">Review Request Received</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {reviewFormState.message}
                  </p>
                  <button
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      setReviewFormState(prev => ({ ...prev, status: 'idle' }));
                    }}
                    className="mt-3 px-5 py-2 bg-[#041e42] text-white font-bold text-xs rounded-xl"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewFormState.status === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                      {reviewFormState.message}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Website URL *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. www.mycompanytrucking.com"
                      value={reviewFormState.url}
                      onChange={(e) => setReviewFormState(prev => ({ ...prev, url: e.target.value }))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={reviewFormState.fullName}
                        onChange={(e) => setReviewFormState(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        value={reviewFormState.email}
                        onChange={(e) => setReviewFormState(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={reviewFormState.phone}
                      onChange={(e) => setReviewFormState(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Specific Concerns or Goals
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Website looks outdated on mobile, not getting quote requests, need driver recruitment section..."
                      value={reviewFormState.notes}
                      onChange={(e) => setReviewFormState(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#ff6600]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewFormState.status === 'submitting'}
                    className="w-full py-3 bg-[#ff6600] hover:bg-[#e65c00] text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {reviewFormState.status === 'submitting' ? (
                      <span>Analyzing &amp; Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Review Request</span>
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-center text-slate-500">
                    No spam. We provide objective feedback without pressuring you into a rebuild.
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: IN-PAGE PDF VIEWER (Renders the Exact Original PDF Document)
          ========================================================================= */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={closePdfModal}
        pdfUrl={activePdfUrl}
        title={activePdfTitle}
        subtitle={activePdfSubtitle}
        downloadFilename={activePdfFilename}
      />

      {/* =========================================================================
          MODAL: UNIVERSAL WEBSITE PROJECT FORM
          ========================================================================= */}
      <WebsiteProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          scrollToSection('packages');
        }}
        selectedPackage={projectModalPackage}
        onPackageChange={(pkg) => setProjectModalPackage(pkg)}
        onChangePackageClick={() => {
          setIsProjectModalOpen(false);
          scrollToSection('packages');
        }}
      />

    </div>
  );
};
