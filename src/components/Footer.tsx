import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { EMAIL_DETAILS, EmailLink } from './EmailLink';
import { InstagramLink, INSTAGRAM_URL } from './InstagramLink';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Ticket, 
  ArrowUpRight,
  Instagram,
  Lock
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#000000] text-slate-100 border-t border-white/10 pt-16 pb-12 font-sans relative overflow-hidden">
      {/* Decorative gradient overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff7700]/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1 - About Wal Group (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              className="inline-block cursor-pointer drop-shadow-[0_0_15px_rgba(255,119,0,0.3)] transition-all"
            >
              <Logo onClick={() => handleNavClick('/')} />
            </motion.div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-4">
              Backend operations &amp; outsourcing for Amazon DSPs, Amazon Freight Partners, and trucking businesses. We combine operational expertise with technology to help logistics companies scale — with lower cost and full compliance.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-3">Connect With Us</span>
              <div className="flex items-center gap-3">
                {/* LinkedIn */}
                <motion.a
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.linkedin.com/company/wal-groups/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-black hover:bg-[#ff7700] hover:border-[#ff7700] transition-all shadow-sm"
                  title="Wal Group on LinkedIn"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  whileHover={{ y: -3, scale: 1.08, shadow: "0 0 20px rgba(255, 119, 0, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent transition-all shadow-sm relative group overflow-hidden"
                  title="Wal Group on Instagram (@thewalgroups)"
                  aria-label="Instagram"
                >
                  {/* Subtle glass reflection sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                  <Instagram className="w-5 h-5 stroke-[2]" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Column 2 - Complete Services List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#ff7700]">Complete Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <button onClick={() => handleNavClick('/website-design-development')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>Website Design &amp; Dev</span>
              </button>
              <button onClick={() => handleNavClick('/dsp-dispatch-support')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>DSP Dispatch Support</span>
              </button>
              <button onClick={() => handleNavClick('/dsp-accounting-payroll')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>DSP Accounting &amp; Payroll</span>
              </button>
              <button onClick={() => handleNavClick('/dsp-hr-recruitment')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>DSP HR &amp; Recruitment</span>
              </button>
              <button onClick={() => handleNavClick('/afp-dispatch-support')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>AFP Dispatch Support</span>
              </button>
              <button onClick={() => handleNavClick('/afp-accounting-tms')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>AFP Accounting &amp; TMS</span>
              </button>
              <button onClick={() => handleNavClick('/dedicated-lane-services')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>Dedicated Lane Services</span>
              </button>
              <button onClick={() => handleNavClick('/hr-bpo-services')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>HR BPO Services</span>
              </button>
              <button onClick={() => handleNavClick('/virtual-assistants')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>Virtual Assistants</span>
              </button>
              <button onClick={() => handleNavClick('/digital-marketing')} className="text-left text-slate-300 hover:text-[#ff7700] transition-colors py-1 flex items-center gap-1.5 group">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff7700] group-hover:scale-125 transition-transform"></span>
                <span>Digital Marketing Ops</span>
              </button>
            </div>
          </div>

          {/* Column 3 - Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#ff7700]">Quick Links</h3>
            <ul className="space-y-1.5 text-xs">
              <li><button onClick={() => handleNavClick('/')} className="text-slate-300 hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => handleNavClick('/about')} className="text-slate-300 hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => handleNavClick('/services')} className="text-slate-300 hover:text-white transition-colors">Services Overview</button></li>
              <li><button onClick={() => handleNavClick('/gig-projects')} className="text-slate-300 hover:text-white transition-colors">Gig Projects</button></li>
              <li><button onClick={() => handleNavClick('/success-stories')} className="text-slate-300 hover:text-white transition-colors">Success Stories</button></li>
              <li><button onClick={() => handleNavClick('/careers')} className="text-slate-300 hover:text-white transition-colors">Careers</button></li>
              <li><button onClick={() => handleNavClick('/contact')} className="text-slate-300 hover:text-white transition-colors">Contact</button></li>
              <li>
                <button onClick={() => handleNavClick('/raise-ticket')} className="text-[#ff7700] hover:text-[#ff9933] font-semibold transition-colors flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Raise a Ticket</span>
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button onClick={() => handleNavClick('/terms-and-conditions')} className="text-slate-400 hover:text-slate-200 transition-colors">Terms &amp; Conditions</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/privacy-policy')} className="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/admin')} className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px]">
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Information */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#ff7700]">Contact Us</h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ff7700] shrink-0 mt-0.5" />
                <span>
                  55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#ff7700] shrink-0" />
                <a href="tel:6363698148" className="hover:text-[#ff7700] transition-colors font-medium">
                  +91 6363698148
                </a>
              </div>
            </div>

            {/* Official Email Routing & Social Links */}
            <div className="pt-1 space-y-2">
              <EmailLink email="thewalgroupinfo@gmail.com" variant="inline" />
              <EmailLink email="thewalgroups@gmail.com" variant="inline" />
              <InstagramLink variant="inline" />
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick('/raise-ticket')}
                className="w-full bg-white/5 hover:bg-white/10 text-[#ff7700] border border-[#ff7700]/30 hover:border-[#ff7700]/60 font-semibold text-xs py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,119,0,0.1)]"
              >
                <Ticket className="w-4 h-4 text-[#ff7700]" />
                <span>Submit Support Ticket</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </motion.button>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar with animated fade divider */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4"
        >
          <div>
            &copy; {new Date().getFullYear()} Wal Group. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Bengaluru, KA • Serving DSPs across US &amp; Global Operations</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

