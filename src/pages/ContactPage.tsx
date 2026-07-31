import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MotionSection } from '../components/MotionSection';
import { AnimatedHeading } from '../components/AnimatedHeading';
import { DiscoveryCallWizard } from '../components/DiscoveryCallWizard';
import { InteractiveOfficeLocations } from '../components/InteractiveOfficeLocations';
import { SectionDivider } from '../components/SectionDivider';
import { EmailLink } from '../components/EmailLink';
import { InstagramLink } from '../components/InstagramLink';
import { MapPin, Mail, Phone, Send, CheckCircle2, Calendar, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { saveContactSubmissionToSupabase } from '../lib/supabase';

interface Props {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'message'>('wizard');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [subject, setSubject] = useState('Sales Question');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Intelligent Routing Logic
  const getRoutedEmail = (subj: string): 'thewalgroupinfo@gmail.com' | 'thewalgroups@gmail.com' => {
    switch (subj) {
      case 'Careers Question':
      case 'Partnership Opportunity':
      case 'Media & Press':
      case 'General Inquiry':
        return 'thewalgroups@gmail.com';
      case 'Sales Question':
      case 'Support Request':
      case 'Existing Client Support':
      default:
        return 'thewalgroupinfo@gmail.com';
    }
  };

  const targetEmail = getRoutedEmail(subject);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !companyName || !message) return;

    setIsSubmitting(true);

    try {
      // Save directly to Supabase
      await saveContactSubmissionToSupabase({
        fullName,
        email,
        phone,
        companyName,
        subject,
        message,
        targetEmail
      });

      // Dispatch to backend API to trigger email notifications
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          companyName,
          subject,
          message
        })
      }).catch((err) => console.error('Error triggering email API:', err));

      // Also record as business lead for admin tracking
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          company: companyName,
          challenges: message,
          servicesOfInterest: [subject]
        })
      }).catch(() => {});
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="font-sans text-slate-100 bg-[#0a0a0a]">
      {/* Hero */}
      <section className="bg-[#050505] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,102,0,0.12),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-white/5 text-[#ff6600] border border-[#ff6600]/30 text-xs font-bold uppercase tracking-wider">
            Get In Touch &amp; Consult
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            <AnimatedHeading text="Contact Us" highlightWord="Contact" />
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Schedule a Discovery Call or Send a Message to Our Operational Leadership Team.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 mt-6 gap-2">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'wizard'
                  ? 'bg-gradient-to-r from-[#ff8800] to-[#ff5500] text-black shadow-[0_0_20px_rgba(255,102,0,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Discovery Call Wizard</span>
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'message'
                  ? 'bg-gradient-to-r from-[#ff8800] to-[#ff5500] text-black shadow-[0_0_20px_rgba(255,102,0,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Direct Message Form</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <MotionSection className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'wizard' ? (
            <DiscoveryCallWizard navigate={navigate} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Contact Form (7 cols) */}
              <div className="lg:col-span-7 glass-panel p-8 sm:p-10 shadow-2xl space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Send Us a Direct Message</h2>
                  <p className="text-xs text-slate-400 mt-1">Our team typically responds within 2 business hours.</p>
                </div>

                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-950/40 border border-emerald-500/30 p-8 rounded-xl text-center space-y-3"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                    <h3 className="text-xl font-bold text-white">Message Sent &amp; Routed Successfully!</h3>
                    <p className="text-xs text-slate-300">
                      Thank you for reaching out to Wal Group. Your inquiry for <span className="text-[#ff7700] font-bold">{subject}</span> has been routed to <span className="text-white font-mono font-bold underline">{targetEmail}</span>. A member of our executive team will respond to {email} shortly.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSubmitted(false);
                        setMessage('');
                      }}
                      className="mt-4 bg-[#ff6600] text-black font-bold text-xs py-2.5 px-5 rounded-lg shadow-md cursor-pointer"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Full Name <span className="text-[#ff6600]">*</span></label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-lg outline-none focus:border-[#ff6600] text-white placeholder-slate-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Email Address <span className="text-[#ff6600]">*</span></label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-lg outline-none focus:border-[#ff6600] text-white placeholder-slate-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number <span className="text-[#ff6600]">*</span></label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-lg outline-none focus:border-[#ff6600] text-white placeholder-slate-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Company Name <span className="text-[#ff6600]">*</span></label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Your DSP / Company"
                          className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-lg outline-none focus:border-[#ff6600] text-white placeholder-slate-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Enquiry Category / Subject <span className="text-[#ff6600]">*</span></label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-lg outline-none focus:border-[#ff6600] text-white transition-colors"
                      >
                        <option value="Sales Question" className="bg-[#111] text-white">Sales &amp; Discovery Question</option>
                        <option value="Support Request" className="bg-[#111] text-white">Support Request &amp; Ticket</option>
                        <option value="Existing Client Support" className="bg-[#111] text-white">Existing Client Account Support</option>
                        <option value="Partnership Opportunity" className="bg-[#111] text-white">Partnership &amp; Vendor Inquiry</option>
                        <option value="Careers Question" className="bg-[#111] text-white">Careers &amp; Recruitment</option>
                        <option value="Media & Press" className="bg-[#111] text-white">Media &amp; Press Requests</option>
                        <option value="General Inquiry" className="bg-[#111] text-white">General Inquiry</option>
                      </select>

                      {/* Intelligent Routing Notice */}
                      <div className="mt-2 p-2.5 rounded-lg bg-white/[0.03] border border-[#ff7700]/30 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <ShieldCheck className="w-4 h-4 text-[#ff7700] shrink-0" />
                          <span>Routing Recipient:</span>
                          <span className="font-mono font-bold text-white">{targetEmail}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                          Auto-Routed
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Message <span className="text-[#ff6600]">*</span></label>
                      <textarea
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we help your operation?"
                        className="w-full px-3.5 py-2.5 text-sm bg-black/40 border border-white/10 rounded-lg outline-none focus:border-[#ff6600] text-white placeholder-slate-500 transition-colors"
                      ></textarea>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#ff6600] hover:bg-[#ff8800] disabled:opacity-50 text-black font-extrabold text-sm py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,102,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 text-black animate-spin" />
                          <span>Saving to Database...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-black" />
                          <span>Send Direct Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>

              {/* Contact Details (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel text-white p-8 space-y-6">
                  <h3 className="text-2xl font-extrabold text-white">Bengaluru Headquarters (India)</h3>
                  
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#ff6600] shrink-0 mt-1" />
                      <div>
                        <div className="font-bold text-white mb-0.5">Corporate Address</div>
                        <div>55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038, India</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#ff6600] shrink-0" />
                      <div>
                        <div className="font-bold text-white mb-0.5">Direct Line</div>
                        <a href="tel:6363698148" className="text-[#ff6600] hover:underline font-bold">
                          +91 6363698148
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Official Emails & Social Channels */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff7700] px-1">Official Contact Channels</h4>
                  <EmailLink email="thewalgroupinfo@gmail.com" />
                  <EmailLink email="thewalgroups@gmail.com" />
                  <InstagramLink variant="card" />
                </div>
              </div>

            </div>
          )}
        </div>
      </MotionSection>

      <SectionDivider />

      {/* INTERACTIVE OFFICE LOCATIONS MAP */}
      <InteractiveOfficeLocations />

    </div>
  );
};

