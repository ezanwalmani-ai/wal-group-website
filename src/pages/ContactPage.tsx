import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MotionSection } from '../components/MotionSection';
import { TextRoll } from '@/components/core/text-roll';
import { DiscoveryCallWizard } from '../components/DiscoveryCallWizard';
import { InteractiveOfficeLocations } from '../components/InteractiveOfficeLocations';
import { SectionDivider } from '../components/SectionDivider';
import { EmailLink } from '../components/EmailLink';
import { InstagramLink } from '../components/InstagramLink';
import { SocialConnectButtons } from '../components/SocialConnectButtons';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  Loader2,
  Building2,
  User,
  MessageSquare
} from 'lucide-react';
import { saveContactSubmissionToSupabase, saveLeadToSupabase } from '../lib/supabase';

interface Props {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<Props> = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState<'wizard' | 'message'>('wizard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [lastSubmittedSubject, setLastSubmittedSubject] = useState('');
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('');
  const [lastTargetEmail, setLastTargetEmail] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    subject: 'Sales Question',
    message: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);

    const targetEmail = getRoutedEmail(formData.subject || 'Sales Question');
    setLastSubmittedSubject(formData.subject || 'Sales Question');
    setLastSubmittedEmail(formData.email || '');
    setLastTargetEmail(targetEmail);

    try {
      // 1. Save directly to Supabase contact_submissions table
      const res = await saveContactSubmissionToSupabase({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        subject: formData.subject,
        message: formData.message,
        targetEmail
      });

      if (!res.success) {
        setSubmitError(res.error || 'Failed to submit message to the database. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // 2. Register lead in leads table for CRM tracking
      saveLeadToSupabase({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.companyName,
        service: formData.subject,
        source: 'Contact Page Direct Message',
        challenges: formData.message,
        status: 'New'
      }).catch((leadErr) => console.warn('CRM lead tracking note:', leadErr));

      // 3. Dispatch to backend API to trigger email notifications
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          subject: formData.subject,
          message: formData.message
        })
      }).catch((err) => console.error('Error triggering email API:', err));

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setSubmitError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <TextRoll className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Contact Us
            </TextRoll>
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
              <span>Direct Message Flow</span>
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
              
              {/* Direct Message Form (7 cols) */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 shadow-2xl rounded-3xl border border-white/10">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-white/10 pb-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#ff7700]" />
                        Direct Message to Leadership
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        Send a message directly to our operational desks. We typically respond within 2 business hours.
                      </p>
                    </div>

                    {submitError && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#ff7700]" />
                          Full Name <span className="text-[#ff7700]">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. John Doe"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#ff7700]" />
                          Business Email <span className="text-[#ff7700]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="e.g. john@company.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[#ff7700]" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="e.g. +1 (555) 000-0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#ff7700]" />
                          Company / DSP Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="e.g. Apex Express / FastLine DSP"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Subject Category <span className="text-[#ff7700]">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      >
                        <option value="Sales Question">Sales &amp; Discovery Question</option>
                        <option value="Support Request">Support Request &amp; Operational Assistance</option>
                        <option value="Existing Client Support">Existing Client Account &amp; Billing</option>
                        <option value="Partnership Opportunity">Partnership &amp; Vendor Inquiry</option>
                        <option value="Careers Question">Careers &amp; Recruitment Inquiry</option>
                        <option value="General Inquiry">General Corporate Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Message <span className="text-[#ff7700]">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please describe how we can assist your operation, station locations, or specific questions..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors resize-y"
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ff8800] to-[#ff5500] hover:from-[#ff9911] hover:to-[#ff6611] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,119,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Direct Message</span>
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-slate-500 text-center mt-2">
                        Your inquiry will be encrypted and instantly routed to the dedicated operational queue.
                      </p>
                    </div>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-950/40 border border-emerald-500/30 p-8 rounded-2xl text-center space-y-4"
                  >
                    <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                    <h3 className="text-2xl font-bold text-white">Message Sent &amp; Routed Successfully!</h3>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Thank you for reaching out to Wal Group. Your inquiry for <span className="text-[#ff7700] font-bold">{lastSubmittedSubject}</span> has been routed to <span className="text-white font-mono font-bold underline">{lastTargetEmail}</span>. A member of our executive team will respond to {lastSubmittedEmail} within 2 business hours.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          companyName: '',
                          subject: 'Sales Question',
                          message: ''
                        });
                      }}
                      className="mt-4 bg-[#ff6600] text-black font-bold text-xs py-3 px-6 rounded-xl shadow-lg cursor-pointer"
                    >
                      Send Another Message
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Sidebar Info (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-6 sm:p-8 space-y-6 rounded-3xl border border-white/10">
                  <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Corporate Headquarters</h3>
                  <div className="space-y-4 text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#ff6600]/10 text-[#ff6600] mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">United States Office</p>
                        <p className="text-xs text-slate-400">1309 Coffeen Avenue STE 1200, Sheridan, Wyoming 82801</p>
                        <p className="text-[10px] text-slate-500 mt-1">Mon - Fri: 8:00 AM - 6:00 PM MST</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#ff6600]/10 text-[#ff6600] mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white">India Operations Center</p>
                        <p className="text-xs text-slate-400">Marathahalli - Sarjapur Outer Ring Rd, Bellandur, Bengaluru, Karnataka 560103</p>
                        <p className="text-[10px] text-slate-500 mt-1">24/7/365 Continuous Logistics Dispatch Hub</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 sm:p-8 space-y-4 rounded-3xl border border-white/10">
                  <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Direct Dispatch Inquiries</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-[#ff6600]" />
                        <span className="text-slate-300">General Operations:</span>
                      </div>
                      <EmailLink email="thewalgroupinfo@gmail.com" />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-[#ff6600]" />
                        <span className="text-slate-300">Corporate &amp; Hiring:</span>
                      </div>
                      <EmailLink email="thewalgroups@gmail.com" />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-[#ff6600]" />
                        <span className="text-slate-300">US Hotline:</span>
                      </div>
                      <a href="tel:+13072183204" className="text-white font-mono font-bold hover:text-[#ff6600]">
                        +1 (307) 218-3204
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="glass-panel p-6 border border-white/10 text-center space-y-3 rounded-3xl">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stay Connected</p>
                  <div className="flex items-center justify-center">
                    <SocialConnectButtons />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </MotionSection>

      <SectionDivider />

      {/* Interactive Global Locations */}
      <InteractiveOfficeLocations />
    </div>
  );
};
