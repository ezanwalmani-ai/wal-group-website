import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { EMAIL_DETAILS, EmailLink } from './EmailLink';
import { InstagramLink, INSTAGRAM_URL } from './InstagramLink';
import { SocialConnectButtons } from './SocialConnectButtons';
import { WhatsAppLink } from './WhatsAppLink';
import { useBehavior } from '../context/BehaviorContext';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Ticket, 
  ArrowUpRight,
  Instagram,
  Lock,
  MessageCircle,
  Activity
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { trackContactClick, trackCtaClick, behavior } = useBehavior();

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
              <SocialConnectButtons source="footer_social_icons" />
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
              <li className="pt-2 border-t border-white/10">
                <button onClick={() => handleNavClick('/terms-and-conditions')} className="text-slate-400 hover:text-slate-200 transition-colors">Terms &amp; Conditions</button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/privacy-policy')} className="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</button>
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
                <a 
                  href="tel:6363698148" 
                  onClick={() => trackContactClick('phone', { source: 'footer_contact_info', target: '+91 6363698148', label: 'Office Phone' })}
                  className="hover:text-[#ff7700] transition-colors font-medium"
                >
                  +91 6363698148
                </a>
              </div>
            </div>

            {/* Official Email Routing & Social Links */}
            <div className="pt-1 space-y-2">
              <EmailLink email="thewalgroupinfo@gmail.com" variant="inline" source="footer_contact_column" />
              <EmailLink email="thewalgroups@gmail.com" variant="inline" source="footer_contact_column" />
              <WhatsAppLink variant="inline" source="footer_contact_column" />
              <InstagramLink variant="inline" source="footer_contact_column" />
            </div>

            {/* Live Contact Preference Monitor (BehaviorProvider State) */}
            {behavior.contactPreferences && (behavior.contactPreferences.totalContactClicks > 0) && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-[#ff7700]/20 flex flex-col gap-1.5 text-[11px]"
              >
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span className="flex items-center gap-1.5 text-[#ff7700]">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>Contact Preference:</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white">
                    {behavior.contactPreferences.preferredMethod === 'whatsapp' ? '🟢 WhatsApp Preferred' :
                     behavior.contactPreferences.preferredMethod === 'email' ? '🟠 Email Preferred' :
                     `${behavior.contactPreferences.preferredMethod} Preferred`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>WhatsApp: {behavior.contactPreferences.whatsappClicks} clicks</span>
                  <span>Email: {behavior.contactPreferences.emailClicks} clicks</span>
                </div>
              </motion.div>
            )}

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  trackCtaClick('Footer Submit Support Ticket');
                  handleNavClick('/raise-ticket');
                }}
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
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} Wal Group. All rights reserved.</span>
            <button
              onClick={() => handleNavClick('/admin')}
              className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded hover:bg-white/5 opacity-60 hover:opacity-100"
              title="Staff Access"
              aria-label="Staff Access"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Bengaluru, KA • Serving DSPs across US &amp; Global Operations</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

