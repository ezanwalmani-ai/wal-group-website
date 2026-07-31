import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { AmbientBackground } from './components/AmbientBackground';
import { MouseSpotlight } from './components/MouseSpotlight';
import { CursorRipple } from './components/CursorRipple';
import { FloatingQuickActionMenu } from './components/FloatingQuickActionMenu';
import { BookingProvider, useBooking } from './context/BookingContext';
import { BehaviorProvider, useBehavior } from './context/BehaviorContext';
import { ThemeProvider } from './context/ThemeContext';
import { BookDemoModal } from './components/BookDemoModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { JsonLdHead } from './components/JsonLdHead';

// Code-split pages for instant initial bundle loading
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesOverviewPage = lazy(() => import('./pages/ServicesOverviewPage').then(m => ({ default: m.ServicesOverviewPage })));

const WebsiteDesignPage = lazy(() => import('./pages/WebsiteDesignPage').then(m => ({ default: m.WebsiteDesignPage })));
const DspDispatchPage = lazy(() => import('./pages/DspDispatchPage').then(m => ({ default: m.DspDispatchPage })));
const DspAccountingPage = lazy(() => import('./pages/DspAccountingPage').then(m => ({ default: m.DspAccountingPage })));
const DspHrPage = lazy(() => import('./pages/DspHrPage').then(m => ({ default: m.DspHrPage })));
const AfpDispatchPage = lazy(() => import('./pages/AfpDispatchPage').then(m => ({ default: m.AfpDispatchPage })));
const AfpAccountingPage = lazy(() => import('./pages/AfpAccountingPage').then(m => ({ default: m.AfpAccountingPage })));
const DedicatedLanePage = lazy(() => import('./pages/DedicatedLanePage').then(m => ({ default: m.DedicatedLanePage })));
const HrBpoPage = lazy(() => import('./pages/HrBpoPage').then(m => ({ default: m.HrBpoPage })));
const VirtualAssistantsPage = lazy(() => import('./pages/VirtualAssistantsPage').then(m => ({ default: m.VirtualAssistantsPage })));
const DigitalMarketingPage = lazy(() => import('./pages/DigitalMarketingPage').then(m => ({ default: m.DigitalMarketingPage })));

const GigProjectsPage = lazy(() => import('./pages/GigProjectsPage').then(m => ({ default: m.GigProjectsPage })));
const SuccessStoriesPage = lazy(() => import('./pages/SuccessStoriesPage').then(m => ({ default: m.SuccessStoriesPage })));
const CareersPage = lazy(() => import('./pages/CareersPage').then(m => ({ default: m.CareersPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const RaiseTicketPage = lazy(() => import('./pages/RaiseTicketPage').then(m => ({ default: m.RaiseTicketPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#ff7700] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Loading Page...</span>
    </div>
  </div>
);

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const { isBookDemoOpen, closeBookDemo, isAdminOpen, closeAdmin } = useBooking();
  const { trackPageView } = useBehavior();

  useEffect(() => {
    trackPageView(currentPath);
  }, [currentPath, trackPageView]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic meta title update per route
  useEffect(() => {
    let title = 'Wal Group - Operational Backbone & Backend Outsourcing';
    switch (currentPath) {
      case '/':
        title = 'Wal Group | We Run the Backend So You Can Run the Business';
        break;
      case '/about':
        title = 'About Us | Wal Group - Relationships First, Business Follows';
        break;
      case '/services':
        title = 'Services Overview | Wal Group Logistics & BPO Solutions';
        break;
      case '/website-design-development':
        title = 'Website Design & Development Services | Wal Group';
        break;
      case '/dsp-dispatch-support':
        title = '24x7 Amazon DSP Dispatch Support Services | Wal Group';
        break;
      case '/dsp-accounting-payroll':
        title = 'Amazon DSP Accounting & Payroll Services | Wal Group';
        break;
      case '/dsp-hr-recruitment':
        title = 'Amazon DSP HR & AI Recruitment Services | Wal Group';
        break;
      case '/afp-dispatch-support':
        title = 'Amazon AFP Freight Dispatch Support | Wal Group';
        break;
      case '/afp-accounting-tms':
        title = 'AFP Accounting & TMS Management | Wal Group';
        break;
      case '/dedicated-lane-services':
        title = 'Dedicated Lane Services & 12-Step POD | Wal Group';
        break;
      case '/hr-bpo-services':
      case '/bpo-services':
        title = 'HR BPO Outsourcing Services | Wal Group';
        break;
      case '/virtual-assistants':
        title = 'Dedicated Remote Virtual Assistants | Wal Group';
        break;
      case '/digital-marketing':
        title = 'Digital Marketing Operations | Wal Group';
        break;
      case '/gig-projects':
        title = 'Gig Projects for DSPs & Freight Fleets | Wal Group';
        break;
      case '/success-stories':
        title = 'Client Success Stories & Turnarounds | Wal Group';
        break;
      case '/careers':
        title = 'Careers | Join Wal Group Remote Team';
        break;
      case '/contact':
        title = 'Contact Us | Wal Group Operations';
        break;
      case '/raise-ticket':
        title = 'Support Center - Raise a Ticket | Wal Group';
        break;
      case '/terms-and-conditions':
        title = 'Terms & Conditions | Wal Group';
        break;
      case '/privacy-policy':
        title = 'Privacy Policy | Wal Group';
        break;
      default:
        title = 'Wal Group | Backend Operations & Outsourcing';
        break;
    }
    document.title = title;
  }, [currentPath]);

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/services':
        return <ServicesOverviewPage navigate={navigate} />;
      case '/website-design-development':
        return <WebsiteDesignPage navigate={navigate} />;
      case '/dsp-dispatch-support':
        return <DspDispatchPage navigate={navigate} />;
      case '/dsp-accounting-payroll':
        return <DspAccountingPage navigate={navigate} />;
      case '/dsp-hr-recruitment':
        return <DspHrPage navigate={navigate} />;
      case '/afp-dispatch-support':
        return <AfpDispatchPage navigate={navigate} />;
      case '/afp-accounting-tms':
        return <AfpAccountingPage navigate={navigate} />;
      case '/dedicated-lane-services':
        return <DedicatedLanePage navigate={navigate} />;
      case '/hr-bpo-services':
      case '/bpo-services':
        return <HrBpoPage navigate={navigate} />;
      case '/virtual-assistants':
        return <VirtualAssistantsPage navigate={navigate} />;
      case '/digital-marketing':
        return <DigitalMarketingPage navigate={navigate} />;
      case '/gig-projects':
        return <GigProjectsPage navigate={navigate} />;
      case '/success-stories':
        return <SuccessStoriesPage navigate={navigate} />;
      case '/careers':
        return <CareersPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/raise-ticket':
        return <RaiseTicketPage navigate={navigate} />;
      case '/terms-and-conditions':
        return <TermsPage navigate={navigate} />;
      case '/privacy-policy':
        return <PrivacyPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-slate-100 selection:bg-[#ff7700] selection:text-black font-sans overflow-x-hidden">
      {/* Dynamic JSON-LD Structured Data Injection */}
      <JsonLdHead currentPath={currentPath} />

      {/* 3px Scroll Progress Bar */}
      <ScrollProgress />

      {/* Subtle Ambient Mesh Lighting Background, Mouse Spotlight & Cursor Ripple */}
      <AmbientBackground />
      <MouseSpotlight />
      <CursorRipple />

      <Header currentPath={currentPath} navigate={navigate} />

      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 16, scale: 0.985, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, scale: 0.99, filter: 'blur(4px)' }}
            transition={{
              duration: 0.45,
              ease: [0.16, 1, 0.3, 1], // Apple VisionOS & Linear spring ease
            }}
          >
            <Suspense fallback={<PageFallback />}>
              {renderPage()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer navigate={navigate} />

      {/* Floating Quick Action Glass Menu */}
      <FloatingQuickActionMenu navigate={navigate} />

      {/* Fullscreen Discovery Call Demo Booking Modal */}
      <BookDemoModal
        isOpen={isBookDemoOpen}
        onClose={closeBookDemo}
        navigate={navigate}
      />

      {/* Admin Demo Management Dashboard */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={closeAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BehaviorProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </BehaviorProvider>
    </ThemeProvider>
  );
}

