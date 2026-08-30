import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { AnimatedIcon } from './AnimatedIcon';
import { soundFx } from '../utils/audio';
import { useBooking } from '../context/BookingContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Monitor, 
  Headphones, 
  Calculator, 
  Users, 
  Truck, 
  MapPin, 
  Globe, 
  BarChart3, 
  Bot,
  Volume2,
  VolumeX,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { openBookDemo } = useBooking();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [dspDropdown, setDspDropdown] = useState(false);
  const [afpDropdown, setAfpDropdown] = useState(false);
  const [bpoDropdown, setBpoDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    soundFx.playNav();
    navigate(path);
    setMobileMenuOpen(false);
    setServicesDropdown(false);
    setDspDropdown(false);
    setAfpDropdown(false);
    setBpoDropdown(false);
  };

  const toggleSound = () => {
    const newMuted = soundFx.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundFx.playClick();
    }
  };

  const isLinkActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  const servicesList = [
    { title: 'Website Design & Development', path: '/website-design-development', icon: Monitor, desc: 'Responsive, modern web portals & e-commerce' },
    { title: 'DSP Dispatch Support', path: '/dsp-dispatch-support', icon: Headphones, desc: '24×7×365 Cortex & Netradyne dispatch' },
    { title: 'DSP Accounting & Payroll', path: '/dsp-accounting-payroll', icon: Calculator, desc: 'QBO & ADP certified weekly payroll & bookkeeping' },
    { title: 'DSP HR & Recruitment', path: '/dsp-hr-recruitment', icon: Users, desc: 'SmartRecruiters & bilingual AI voicebot hiring' },
    { title: 'AFP Dispatch Support', path: '/afp-dispatch-support', icon: Truck, desc: 'Amazon Relay shift oversight & HOS monitoring' },
    { title: 'AFP Accounting & TMS', path: '/afp-accounting-tms', icon: BarChart3, desc: 'Load profitability, IFTA filing & factoring' },
    { title: 'Dedicated Lane Services', path: '/dedicated-lane-services', icon: MapPin, desc: '12-step POD lifecycle & end-to-end shift control' },
    { title: 'HR BPO Services', path: '/hr-bpo-services', icon: Users, desc: 'Payroll, benefits, compliance & HRIS operations' },
    { title: 'Virtual Assistants', path: '/virtual-assistants', icon: Bot, desc: 'Remote admin, customer service & data back-office' },
    { title: 'Digital Marketing Operations', path: '/digital-marketing', icon: Globe, desc: 'SEO, social, email, CRM & outcome-based growth' },
  ];

  const dspList = [
    { title: 'DSP Dispatch Support', path: '/dsp-dispatch-support' },
    { title: 'DSP Accounting & Payroll', path: '/dsp-accounting-payroll' },
    { title: 'DSP HR & Recruitment', path: '/dsp-hr-recruitment' },
  ];

  const afpList = [
    { title: 'AFP Dispatch Support', path: '/afp-dispatch-support' },
    { title: 'AFP Accounting & TMS', path: '/afp-accounting-tms' },
    { title: 'Dedicated Lane Services', path: '/dedicated-lane-services' },
  ];

  const bpoList = [
    { title: 'HR BPO Services', path: '/hr-bpo-services' },
    { title: 'Virtual Assistants', path: '/virtual-assistants' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      {/* Main Navigation Bar */}
      <motion.nav 
        animate={{
          py: isScrolled ? 10 : 16,
          backgroundColor: 'rgba(8, 8, 8, 0.95)',
          backdropFilter: 'blur(12px)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`border-b text-white shadow-2xl transition-all ${
          isScrolled ? 'py-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' : 'py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer">
            <Logo onClick={() => handleNavClick('/')} />
          </div>

          {/* Desktop Navigation Links - Exact Match to Screenshot */}
          <div className="hidden xl:flex items-center gap-2.5 text-sm font-semibold">
            <button
              onClick={() => handleNavClick('/')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                isLinkActive('/') && currentPath === '/'
                  ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                  : 'text-white hover:text-[#ff6600] hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('/about')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                isLinkActive('/about')
                  ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                  : 'text-white hover:text-[#ff6600] hover:bg-white/5'
              }`}
            >
              About Us
            </button>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdown(true)}
              onMouseLeave={() => setServicesDropdown(false)}
            >
              <button
                onClick={() => handleNavClick('/services')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg transition-all ${
                  isLinkActive('/services') || servicesList.some(s => currentPath === s.path)
                    ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                    : 'text-white hover:text-[#ff6600] hover:bg-white/5'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-[#ff6600]' : 'text-slate-400'}`} />
              </button>

              {/* Services Dropdown Panel */}
              <AnimatePresence>
                {servicesDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-0 w-[580px] mt-1 bg-[#121212]/98 border border-[#ff6600]/30 rounded-xl shadow-2xl p-4 grid grid-cols-2 gap-2 z-50 backdrop-blur-2xl"
                  >
                    <div className="col-span-2 pb-2 mb-2 border-b border-white/10 flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ff6600]">Our Operations Suite</span>
                      <button 
                        onClick={() => handleNavClick('/services')}
                        className="text-xs text-[#ff6600] hover:underline"
                      >
                        View All Services &rarr;
                      </button>
                    </div>
                    {servicesList.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavClick(item.path)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg text-left transition-all ${
                            currentPath === item.path
                              ? 'bg-white/10 border border-[#ff6600]/40 text-[#ff6600]'
                              : 'hover:bg-white/5 text-slate-300 hover:text-white'
                          }`}
                        >
                          <AnimatedIcon animation="rotate" className="p-2 rounded-md bg-[#1a1a1a] text-[#ff6600] shrink-0 border border-white/5">
                            <IconComponent className="w-4 h-4" />
                          </AnimatedIcon>
                          <div>
                            <div className="font-semibold text-xs text-white leading-tight">{item.title}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DSP Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDspDropdown(true)}
              onMouseLeave={() => setDspDropdown(false)}
            >
              <button
                onClick={() => handleNavClick('/dsp-dispatch-support')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg transition-all ${
                  dspList.some(s => currentPath === s.path)
                    ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                    : 'text-white hover:text-[#ff6600] hover:bg-white/5'
                }`}
              >
                <span>DSP Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dspDropdown ? 'rotate-180 text-[#ff6600]' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence>
                {dspDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-0 w-64 mt-1 bg-[#121212]/98 border border-[#ff6600]/30 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  >
                    {dspList.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          currentPath === item.path
                            ? 'bg-white/10 text-[#ff6600]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AFP Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setAfpDropdown(true)}
              onMouseLeave={() => setAfpDropdown(false)}
            >
              <button
                onClick={() => handleNavClick('/afp-dispatch-support')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg transition-all ${
                  afpList.some(s => currentPath === s.path)
                    ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                    : 'text-white hover:text-[#ff6600] hover:bg-white/5'
                }`}
              >
                <span>AFP Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${afpDropdown ? 'rotate-180 text-[#ff6600]' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence>
                {afpDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-0 w-64 mt-1 bg-[#121212]/98 border border-[#ff6600]/30 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  >
                    {afpList.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          currentPath === item.path
                            ? 'bg-white/10 text-[#ff6600]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BPO Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setBpoDropdown(true)}
              onMouseLeave={() => setBpoDropdown(false)}
            >
              <button
                onClick={() => handleNavClick('/hr-bpo-services')}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-lg transition-all ${
                  bpoList.some(s => currentPath === s.path) || currentPath === '/hr-bpo-services'
                    ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                    : 'text-white hover:text-[#ff6600] hover:bg-white/5'
                }`}
              >
                <span>BPO Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${bpoDropdown ? 'rotate-180 text-[#ff6600]' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence>
                {bpoDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute top-full left-0 w-60 mt-1 bg-[#121212]/98 border border-[#ff6600]/30 rounded-xl shadow-2xl p-2 z-50 backdrop-blur-2xl"
                  >
                    {bpoList.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          currentPath === item.path
                            ? 'bg-white/10 text-[#ff6600]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavClick('/digital-marketing')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                isLinkActive('/digital-marketing')
                  ? 'bg-[#181818] text-[#ff6600] font-bold border border-white/5'
                  : 'text-white hover:text-[#ff6600] hover:bg-white/5'
              }`}
            >
              Digital Marketing
            </button>
          </div>

          {/* Action CTA Button - Talk To Us, Theme Switcher & Audio Toggle */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Switcher Toggle (Light / Dark) */}
            <button
              onClick={() => {
                soundFx.playClick();
                toggleTheme();
              }}
              title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle theme mode"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-[#ff6600] hover:border-[#ff6600]/40 transition-all cursor-pointer flex items-center justify-center group"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#ffb700] group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Subtle Audio Micro-sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Unmute interface micro-sounds" : "Mute interface micro-sounds"}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-[#ff6600] hover:border-[#ff6600]/40 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#ff6600]" />}
            </button>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              onClick={() => {
                soundFx.playClick();
                openBookDemo();
              }}
              className="relative overflow-hidden bg-gradient-to-r from-[#e65c00] via-[#ff7700] to-[#ff8512] text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-[14px] transition-all shadow-[0_4px_16px_rgba(255,119,0,0.22)] hover:shadow-[0_6px_22px_rgba(255,119,0,0.38)] cursor-pointer group flex items-center gap-2 border border-white/25"
            >
              {/* Subtle glass light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              <Sparkles className="w-4 h-4 text-slate-950 shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span className="tracking-tight">Book a Demo</span>
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-[#0a0a0a] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 overflow-hidden"
            >
              <button
                onClick={() => handleNavClick('/')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentPath === '/' ? 'bg-white/10 text-[#ff6600]' : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('/about')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  currentPath === '/about' ? 'bg-white/10 text-[#ff6600]' : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                About Us
              </button>

              <div className="border-t border-white/10 pt-2 my-2">
                <div className="px-3 text-xs font-bold text-[#ff6600] uppercase tracking-wider mb-1">
                  Core Services & Solutions
                </div>
                {servicesList.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-xs font-medium flex items-center justify-between ${
                      currentPath === item.path ? 'bg-white/10 text-[#ff6600] font-bold' : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/10 pt-2 my-2 space-y-1">
                <button
                  onClick={() => handleNavClick('/gig-projects')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    currentPath === '/gig-projects' ? 'bg-white/10 text-[#ff6600]' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Gig Projects
                </button>
                <button
                  onClick={() => handleNavClick('/success-stories')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    currentPath === '/success-stories' ? 'bg-white/10 text-[#ff6600]' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Success Stories
                </button>
                <button
                  onClick={() => handleNavClick('/careers')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    currentPath === '/careers' ? 'bg-white/10 text-[#ff6600]' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Careers
                </button>
                <button
                  onClick={() => handleNavClick('/raise-ticket')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    currentPath === '/raise-ticket' ? 'bg-white/10 text-[#ff6600]' : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  Client Support Portal
                </button>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between px-3">
                  <span className="text-xs font-semibold text-slate-300">Theme Mode:</span>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      toggleTheme();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-slate-200 hover:text-[#ff6600] transition-all"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-[#ffb700]" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundFx.playClick();
                    setMobileMenuOpen(false);
                    openBookDemo();
                  }}
                  className="w-full text-center mt-3 bg-gradient-to-r from-[#ff6600] to-[#ff8811] text-black font-extrabold text-sm py-2.5 rounded-lg shadow-[0_0_20px_rgba(255,102,0,0.5)] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Book a Demo</span>
                </button>

                {/* Mobile Social & Contact Badges */}
                <div className="pt-3 border-t border-white/10 mt-3 space-y-2 text-xs">
                  <a
                    href="https://www.instagram.com/thewalgroups/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-white/[0.04] to-white/[0.01] border border-white/10 text-slate-300 hover:text-white hover:border-[#ff7700]/50 transition-all group"
                  >
                    <div className="w-5 h-5 rounded bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shrink-0">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span>Instagram: <span className="text-white font-bold group-hover:text-[#ff7700] transition-colors">@thewalgroups</span></span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

