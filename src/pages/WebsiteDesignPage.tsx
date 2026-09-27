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

interface Props {
  navigate: (path: string) => void;
}

interface PortfolioItem {
  id: string;
  title: string;
  industry: string;
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
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [brochurePage, setBrochurePage] = useState(1);
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
      id: 'abhijobs',
      title: 'ABHI JOBS',
      industry: 'Jobs & Career Platform',
      description: 'Skills-first career platform designed to connect talent with meaningful opportunities. Features candidate search, skills classification, applicant workflow, and employer talent acquisition.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://abhijobs.netlify.app',
      image: '/images/portfolio/abhijobs.webp',
      tags: ['Job Search Portal', 'Candidate Workflow', 'Employer Hub', 'Responsive UI']
    },
    {
      id: 'ml-worldwide',
      title: 'M&L WORLDWIDE LOGISTICS',
      industry: 'Transportation & Logistics',
      description: 'Integrated supply chain platform featuring domestic freight brokerage, single drive-away vehicle movements, PRO/BOL tracking lookup, interactive quote request, and fleet capabilities.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://m-l-worldwide-logistics.netlify.app',
      image: '/images/portfolio/ml-worldwide.webp',
      tags: ['Freight Brokerage', 'Live Tracking Bar', 'Quote Request', 'Fleet Showcase']
    },
    {
      id: 'alpine-medical',
      title: 'ALPINE MEDICAL SERVICES',
      industry: 'Healthcare',
      description: 'Regulated medical waste management platform across Arizona. Features statewide manifest tracking, compliance dossier access, sharps & biohazard services, and emergency dispatch contact.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://alpine-medical-services.netlify.app',
      image: '/images/portfolio/alpine-medical.webp',
      tags: ['Medical Waste Logistics', 'Compliance Dossier', 'Statewide Coverage', 'Direct Dispatch']
    },
    {
      id: 'southdekalb',
      title: 'SOUTH DEKALB TOWING',
      industry: 'Towing & Roadside Services',
      description: 'High-conversion emergency towing and vehicle transport platform serving Lithonia & South DeKalb. Features 24/7 click-to-call, request-a-tow booking, storage yard details, and Google Maps directions.',
      label: 'DEMO / CONCEPT WEBSITE',
      url: 'https://southdekalb.netlify.app',
      image: '/images/portfolio/southdekalb.webp',
      tags: ['24/7 Roadside Dispatch', 'Click-to-Call', 'Instant Tow Booking', 'Local Map Integration']
    },
    {
      id: 'wal-groups',
      title: 'WAL GROUPS',
      industry: 'Logistics Operations & Backend Outsourcing',
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

            {/* Right Column: Layered Multi-Device Composition */}
            <div className="lg:col-span-5 relative">
              {/* Browser Mockup Wrapper */}
              <div className="relative rounded-2xl bg-[#091524] border border-white/15 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
                {/* Browser bar */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <div className="bg-white/10 px-3 py-0.5 rounded text-[11px] text-slate-300 font-mono tracking-tight flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>yourbusiness.com</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    RESPONSIVE
                  </div>
                </div>

                {/* Layered Website Preview Graphic */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-[#0c1829]">
                  <img 
                    src="/images/portfolio/ml-worldwide.webp" 
                    alt="Transportation & Logistics Website Design Preview"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  
                  {/* Floating Mobile Preview Overlay */}
                  <div className="absolute -bottom-3 -right-3 w-36 sm:w-44 rounded-xl bg-[#06101c] p-1.5 shadow-2xl border border-white/20 hidden sm:block">
                    <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-1" />
                    <div className="rounded-lg overflow-hidden aspect-[9/16] bg-slate-900">
                      <img 
                        src="/images/portfolio/southdekalb.webp" 
                        alt="Mobile Responsive Towing Website"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtitle tag */}
                <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Custom Built · Tailored to Your Sector</span>
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
          10–17. FEATURED WEBSITE WORK (Portfolio with Exact Screenshots & Verified URLs)
          ========================================================================= */}
      <section id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f4f7fb] scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
                PORTFOLIO SHOWCASE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
                Websites We've Designed
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Explore website concepts created by WAL GROUPS across different industries and business models.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#041e42]/5 border border-[#041e42]/10 text-xs font-bold text-[#041e42]">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6600]" />
                <span>Responsive &amp; Live Systems</span>
              </span>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {portfolioItems.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Browser Frame */}
                <div className="bg-[#0b1626] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs font-mono text-slate-300">
                      {item.url?.replace('https://', '') || 'preview'}
                    </span>
                  </div>

                  {/* Clean unboxed label per zero-pill discipline */}
                  <span className="text-[11px] font-bold text-[#ff8533] uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>

                {/* Screenshot Visual */}
                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden border-b border-slate-100">
                  <img 
                    src={item.image} 
                    alt={`${item.title} - ${item.industry} Website Preview`}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 bg-[#041e42]/90 hover:bg-[#ff6600] text-white hover:text-black text-xs font-bold px-3 py-2 rounded-lg backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <span>View Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-[#041e42] tracking-tight">{item.title}</h3>
                      <span className="text-xs font-semibold text-slate-500">{item.industry}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Feature tags */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-500">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="inline-flex items-center gap-1">
                        <span>{tag}</span>
                        {i < item.tags.length - 1 && <span className="text-slate-300">·</span>}
                      </span>
                    ))}
                  </div>

                  {/* CTA row */}
                  {item.url && (
                    <div className="pt-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#041e42] hover:text-[#ff6600] transition-colors"
                      >
                        <span>View Live Demo</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* 17. DEMO DISCLAIMER */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 text-center max-w-4xl mx-auto shadow-sm">
            <span className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider block mb-1">
              DEMO / CONCEPT DISCLAIMER
            </span>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              These websites are design and development examples created to demonstrate website capabilities. They are not presented as paid client projects unless explicitly identified as such.
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================================
          18–22. WEBSITE PACKAGES (Pricing, Inclusions, and Direct PDF Downloads)
          ========================================================================= */}
      <section id="packages" className="py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto space-y-14">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff6600]">
              TRANSPARENT PRICING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#041e42] tracking-tight">
              Choose the Website Built for Your Business
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              From a professional business presence to a fully custom digital system, choose the level of functionality that fits your requirements.
            </p>
          </div>

          {/* 4 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  pkg.badge 
                    ? 'bg-[#041e42] text-white shadow-2xl ring-2 ring-[#ff6600] md:-translate-y-2' 
                    : 'bg-[#f8fafc] text-[#041e42] border border-slate-200 hover:shadow-lg'
                }`}
              >
                {/* Badge if Most Popular */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff6600] text-black text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {pkg.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className={`text-xl font-bold ${pkg.badge ? 'text-white' : 'text-[#041e42]'}`}>
                      {pkg.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className={`text-4xl font-extrabold tracking-tight ${pkg.badge ? 'text-[#ff8533]' : 'text-[#ff6600]'}`}>
                        {pkg.price}
                      </span>
                      {pkg.period && (
                        <span className={`text-xs ${pkg.badge ? 'text-slate-300' : 'text-slate-500'}`}>
                          {pkg.period}
                        </span>
                      )}
                    </div>
                    <p className={`mt-3 text-xs leading-relaxed ${pkg.badge ? 'text-slate-300' : 'text-slate-600'}`}>
                      {pkg.description}
                    </p>
                  </div>

                  {/* Delivery & Revisions metadata */}
                  <div className={`p-3 rounded-xl space-y-1.5 text-xs ${pkg.badge ? 'bg-white/10' : 'bg-white border border-slate-200'}`}>
                    <div className="flex justify-between">
                      <span className="font-semibold">Pages:</span>
                      <span className="font-bold">{pkg.pages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Revisions:</span>
                      <span className="font-bold">{pkg.revisions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Turnaround:</span>
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
                        <li key={i} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.badge ? 'text-[#ff8533]' : 'text-[#ff6600]'}`} />
                          <span className={pkg.badge ? 'text-slate-200' : 'text-slate-700'}>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Buttons: View Package & Download Brochure */}
                <div className="pt-6 mt-6 border-t border-slate-200/50 space-y-2.5">
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      pkg.badge 
                        ? 'bg-[#ff6600] hover:bg-[#e65c00] text-black shadow-md' 
                        : 'bg-[#041e42] hover:bg-[#062c60] text-white'
                    }`}
                  >
                    <span>View Package Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={pkg.pdfUrl}
                    download={pkg.pdfFilename}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      pkg.badge 
                        ? 'border-white/20 text-slate-200 hover:bg-white/10' 
                        : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Package PDF</span>
                  </a>

                  <div className={`text-[10px] text-center ${pkg.badge ? 'text-slate-400' : 'text-slate-500'}`}>
                    {pkg.renewal}
                  </div>
                </div>

              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-500 max-w-2xl mx-auto">
            All prices in USD. Simple 50% deposit before start and 50% on final approval via PayPal invoice. Custom projects scoped individually.
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
                      onClick={() => setIsBrochureModalOpen(true)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-[#ff8533]" />
                      <span>View Brochure</span>
                    </button>

                    <a
                      href="/brochures/wal-groups-website-services-brochure-2026.pdf"
                      download="wal-groups-website-services-brochure-2026.pdf"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff6600] hover:bg-[#e65c00] text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg"
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
                  onClick={() => setIsBrochureModalOpen(true)}
                  className="bg-[#ff6600] hover:bg-[#e65c00] text-black font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Brochure (Interactive)</span>
                </button>

                <a
                  href="/brochures/wal-groups-website-services-brochure-2026.pdf"
                  download="wal-groups-website-services-brochure-2026.pdf"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm px-6 py-3 rounded-xl transition-all flex items-center gap-2"
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

                <a
                  href={pkg.pdfUrl}
                  download={pkg.pdfFilename}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#041e42] text-[#041e42] hover:text-white border border-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Package Brochure →</span>
                </a>
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
                  onClick={openBookDemo}
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
          MODAL: PACKAGE DETAILS MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative text-[#041e42] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider">
                    PACKAGE DETAILS
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <h3 className="text-2xl font-bold">{selectedPackage.name}</h3>
                    <span className="text-2xl font-extrabold text-[#ff6600]">{selectedPackage.price}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {selectedPackage.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-center border border-slate-200">
                  <div>
                    <div className="font-semibold text-slate-500">Pages</div>
                    <div className="font-bold text-[#041e42] mt-0.5">{selectedPackage.pages}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-500">Revisions</div>
                    <div className="font-bold text-[#041e42] mt-0.5">{selectedPackage.revisions}</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-500">Timeline</div>
                    <div className="font-bold text-[#041e42] mt-0.5">{selectedPackage.delivery}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#041e42]">
                    Complete Deliverables &amp; Inclusions:
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {selectedPackage.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#ff6600] shrink-0 mt-0.5" />
                        <span className="text-slate-700">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold">Renewal Information: </span>
                  {selectedPackage.renewal}. Domain registration renewed separately at standard registrar rates.
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <a
                    href={selectedPackage.pdfUrl}
                    download={selectedPackage.pdfFilename}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#041e42] hover:bg-[#062c60] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Package PDF</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedPackage(null);
                      openBookDemo();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#ff6600] hover:bg-[#e65c00] text-black text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Start This Package</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: INTERACTIVE BROCHURE VIEWER (18 Pages from Master PDF)
          ========================================================================= */}
      <AnimatePresence>
        {isBrochureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b1626] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-white/20 overflow-hidden text-white"
            >
              {/* Header */}
              <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#041e42]">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#ff8533]" />
                  <span className="text-xs sm:text-sm font-bold">
                    WAL GROUPS — Website Services Brochure (2026)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/brochures/wal-groups-website-services-brochure-2026.pdf"
                    download="wal-groups-website-services-brochure-2026.pdf"
                    className="hidden sm:flex items-center gap-1.5 text-xs text-[#ff8533] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                  <button
                    onClick={() => setIsBrochureModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030e1c] flex items-center justify-center">
                <div className="max-w-2xl w-full bg-white text-[#041e42] rounded-xl p-8 sm:p-12 shadow-2xl min-h-[500px] flex flex-col justify-between border border-slate-300">
                  
                  {/* Page-Specific Content Representation */}
                  {brochurePage === 1 && (
                    <div className="space-y-6 text-center py-6">
                      <div className="w-12 h-12 rounded-xl bg-[#041e42] text-[#ff6600] flex items-center justify-center font-bold text-xl mx-auto">
                        W
                      </div>
                      <span className="text-xs font-bold tracking-widest text-[#ff6600] uppercase block">
                        WAL GROUPS BUSINESS SERVICES · BROCHURE 2026
                      </span>
                      <h3 className="text-3xl sm:text-4xl font-black text-[#041e42] leading-tight">
                        Professional websites built for businesses that move.
                      </h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto">
                        Websites that make your business look credible, explain what you do, and make it easy for customers to get in touch.
                      </p>
                      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 font-semibold max-w-sm mx-auto border border-slate-200">
                        USA · Canada · UK · Australia · Worldwide
                      </div>
                    </div>
                  )}

                  {brochurePage === 2 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-[#ff6600]">01 — WHO WE ARE</span>
                      <h3 className="text-2xl font-bold">Your website is often the first impression. Make it count.</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Wal Groups is a business services company providing professional website development and digital solutions for businesses in the USA, Canada, the UK, Australia and worldwide.
                      </p>
                      <div className="p-4 bg-[#041e42] text-white rounded-xl text-xs space-y-1">
                        <div className="font-bold text-[#ff8533]">OUR FOCUS:</div>
                        <div>We build professional websites that make your business look credible, help you stand out from competitors, and make it easier for potential customers to contact you.</div>
                      </div>
                    </div>
                  )}

                  {brochurePage >= 3 && brochurePage <= 6 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-[#ff6600]">SECTION 02 — ARCHITECTURE &amp; SECTORS</span>
                      <h3 className="text-2xl font-bold">
                        {brochurePage === 3 ? 'What We Build' : brochurePage === 4 ? 'Why Wal Groups?' : brochurePage === 5 ? 'Industries We Serve' : 'Transportation Specialization'}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Custom website development tailored to your business requirements — designed, built, tested and launched for you with complete domain ownership.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">✓ Credibility from first visit</div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">✓ Mobile responsiveness</div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">✓ Clear service breakdown</div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">✓ Contact visibility on all screens</div>
                      </div>
                    </div>
                  )}

                  {brochurePage >= 7 && brochurePage <= 9 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-[#ff6600]">SECTION 06 — PACKAGES &amp; COMPARISON</span>
                      <h3 className="text-2xl font-bold">Clear packages. Straightforward pricing.</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="font-bold text-[#041e42]">Starter Website ($399)</div>
                          <div className="text-slate-600">Up to 5 pages · 3–5 days · 1 revision round</div>
                        </div>
                        <div className="p-3 bg-[#041e42] text-white rounded-xl space-y-1">
                          <div className="font-bold text-[#ff8533]">Business Website ($699)</div>
                          <div className="text-slate-300">Up to 8 pages · 5–7 days · 3 revisions</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="font-bold text-[#041e42]">Growth Website ($999)</div>
                          <div className="text-slate-600">Up to 12 pages · 7–10 days · Unlimited revs</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="font-bold text-[#041e42]">Custom Website ($1,499+)</div>
                          <div className="text-slate-600">Custom scope · 10–15+ days · Portals &amp; CRM</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {brochurePage >= 10 && brochurePage <= 18 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-[#ff6600]">SECTION {brochurePage} — POLICIES &amp; LAUNCH</span>
                      <h3 className="text-2xl font-bold">
                        {brochurePage === 10 ? "What's Included & SEO" :
                         brochurePage === 11 ? 'Lead Generation Design' :
                         brochurePage === 12 ? '8-Step Website Process' :
                         brochurePage === 13 ? 'Domain, Hosting & Ownership' :
                         brochurePage === 14 ? 'Maintenance & Support ($199/yr)' :
                         brochurePage === 15 ? 'Selected Portfolio Works' :
                         brochurePage === 16 ? 'Existing Website Review (12 Points)' :
                         brochurePage === 17 ? 'Frequently Asked Questions' :
                         'Ready to Build Your Website?'}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {brochurePage === 13 
                          ? 'Once the project is fully paid, you retain full ownership of your domain and content. We never lock you in.'
                          : brochurePage === 14
                          ? '30 days free post-launch support included with every website. Optional annual maintenance available at $199/year.'
                          : brochurePage === 17
                          ? 'Common questions answered with complete clarity. Packages start at $399 with no hidden hosting surprise.'
                          : 'Explore our complete brochure or download the PDF file directly to keep on file.'}
                      </p>
                    </div>
                  )}

                  {/* Brochure Page Footer */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>thewalgroup.in · WAL GROUPS 2026</span>
                    <span className="font-bold font-mono">Page {brochurePage} of 18</span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="p-4 bg-[#041e42] border-t border-white/10 flex items-center justify-between">
                <button
                  disabled={brochurePage <= 1}
                  onClick={() => setBrochurePage(p => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  ← Previous Page
                </button>

                <div className="flex items-center gap-1">
                  {[1, 2, 7, 8, 9, 12, 13, 15, 17, 18].map(p => (
                    <button
                      key={p}
                      onClick={() => setBrochurePage(p)}
                      className={`w-7 h-7 rounded text-[11px] font-bold transition-all ${
                        brochurePage === p 
                          ? 'bg-[#ff6600] text-black font-extrabold' 
                          : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  disabled={brochurePage >= 18}
                  onClick={() => setBrochurePage(p => Math.min(18, p + 1))}
                  className="px-4 py-2 rounded-lg bg-[#ff6600] hover:bg-[#e65c00] text-black disabled:opacity-30 text-xs font-bold transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  Next Page →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
