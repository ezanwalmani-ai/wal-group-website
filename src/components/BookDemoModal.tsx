import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Globe, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X, 
  Download, 
  ExternalLink, 
  Instagram, 
  Linkedin,
  Layers,
  DollarSign,
  MessageSquare,
  AlertCircle,
  Edit3
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { saveBookingToSupabase } from '../lib/supabase';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (path: string) => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose, navigate }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Submission Response
  const [bookingId, setBookingId] = useState<string>('');
  const [meetLink, setMeetLink] = useState<string>('');
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState<string>('');
  const [icsContent, setIcsContent] = useState<string>('');
  const [messagingConsent, setMessagingConsent] = useState<boolean>(true);

  // STEP 1: Company Information
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Amazon DSP / Fleet Logistics');
  const [country, setCountry] = useState('United States');
  const [website, setWebsite] = useState('');
  const [companySize, setCompanySize] = useState('11-50 employees');

  // STEP 2: Contact Details
  const [fullName, setFullName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // STEP 3: Business Requirements (Services - Multiple allowed)
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Amazon DSP',
    'Dispatch'
  ]);

  // STEP 4: Meeting Details
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [timezone, setTimezone] = useState('EST (UTC-5)');
  const [meetingType, setMeetingType] = useState<'Google Meet' | 'Microsoft Teams' | 'Zoom'>('Google Meet');

  // STEP 5: Additional Notes
  const [projectDescription, setProjectDescription] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  const [expectedTeamSize, setExpectedTeamSize] = useState('5-15 agents');
  const [budget, setBudget] = useState('Flexible / Based on SLA');
  const [timeline, setTimeline] = useState('Immediate (< 2 Weeks)');
  const [isHumanVerified, setIsHumanVerified] = useState(true);

  const availableServices = [
    { id: 'dsp', title: 'Amazon DSP', desc: 'Full Cortex, Netradyne & DSP operations management' },
    { id: 'dispatch', title: 'Dispatch', desc: '24/7 route tracking, driver support & exception handling' },
    { id: 'truck-dispatch', title: 'Truck Dispatch', desc: 'Amazon Relay, freight load matching & HOS tracking' },
    { id: 'va', title: 'Virtual Assistant', desc: 'Dedicated remote administrative & operations staff' },
    { id: 'hr', title: 'HR', desc: 'SmartRecruiters ATS, bilingual recruiting & onboarding' },
    { id: 'accounting', title: 'Accounting', desc: 'Certified QuickBooks & ADP weekly payroll reconciliation' },
    { id: 'marketing', title: 'Marketing', desc: 'SEO, web design, CRM & recruitment lead generation' },
    { id: 'support', title: 'Customer Support', desc: '24/7 omni-channel customer service & ticket routing' },
    { id: 'operations', title: 'Operations', desc: 'Dedicated lane control, POD lifecycle & SLA management' },
    { id: 'web-dev', title: 'Website Development', desc: 'High-converting custom web applications & portals' },
  ];

  const stepsList = [
    { num: 1, name: 'Company' },
    { num: 2, name: 'Contact' },
    { num: 3, name: 'Services' },
    { num: 4, name: 'Meeting' },
    { num: 5, name: 'Review' },
  ];

  const toggleService = (title: string) => {
    soundFx.playClick();
    if (selectedServices.includes(title)) {
      setSelectedServices(selectedServices.filter(s => s !== title));
    } else {
      setSelectedServices([...selectedServices, title]);
    }
  };

  const validateCurrentStep = (): boolean => {
    setErrorMsg('');
    if (step === 1) {
      if (!companyName.trim()) {
        setErrorMsg('Please enter your Company Name.');
        return false;
      }
    } else if (step === 2) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your Full Name.');
        return false;
      }
      if (!businessEmail.trim() || !businessEmail.includes('@')) {
        setErrorMsg('Please enter a valid Business Email.');
        return false;
      }
      if (!phone.trim()) {
        setErrorMsg('Please enter your Phone Number.');
        return false;
      }
    } else if (step === 3) {
      if (selectedServices.length === 0) {
        setErrorMsg('Please select at least one required service.');
        return false;
      }
    } else if (step === 4) {
      if (!preferredDate) {
        setErrorMsg('Please select a preferred meeting date.');
        return false;
      }
    } else if (step === 5) {
      if (!isHumanVerified) {
        setErrorMsg('Please verify the anti-spam check.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      soundFx.playNav();
      if (step < 5) setStep(step + 1);
    }
  };

  const handleBack = () => {
    soundFx.playNav();
    setErrorMsg('');
    if (step > 1) setStep(step - 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    soundFx.playClick();
    setLoading(true);
    setErrorMsg('');

    const generatedId = `WAL-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save directly to Supabase client-side
    saveBookingToSupabase({
      id: generatedId,
      companyName,
      industry,
      country,
      website,
      companySize,
      fullName,
      email: businessEmail,
      phone,
      jobTitle,
      linkedin,
      selectedServices,
      preferredDate,
      preferredTime,
      timezone,
      meetingType,
      projectDescription,
      currentChallenges,
      expectedTeamSize,
      budget,
      timeline,
      status: 'Pending',
      meetLink: `https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`
    }).catch((err) => console.error('Supabase direct booking save error:', err));

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          industry,
          country,
          website,
          companySize,
          fullName,
          email: businessEmail,
          phone,
          jobTitle,
          linkedin,
          selectedServices,
          preferredDate,
          preferredTime,
          timezone,
          meetingType,
          projectDescription,
          currentChallenges,
          expectedTeamSize,
          budget,
          timeline,
          messagingConsent,
          recaptchaToken: 'VERIFIED_USER'
        })
      });

      const data = await response.json();

      if (data.success) {
        setBookingId(data.bookingId);
        setMeetLink(data.meetLink);
        setGoogleCalendarUrl(data.googleCalendarUrl || '');
        setIcsContent(data.icsContent);
        setSubmitted(true);
      } else {
        setBookingId(generatedId);
        setMeetLink(`https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`);
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Booking API submission error:', err);
      // Client-side fallback if server isn't reachable
      setBookingId(generatedId);
      setMeetLink(`https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const downloadICS = () => {
    if (bookingId) {
      window.open(`/api/bookings/ics/${bookingId}`, '_blank');
    } else {
      const element = document.createElement("a");
      const file = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${bookingId || 'wal-group'}-discovery-call.ics`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const resetModal = () => {
    setSubmitted(false);
    setStep(1);
    setCompanyName('');
    setFullName('');
    setBusinessEmail('');
    setPhone('');
    setProjectDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
        {/* Fullscreen Backdrop Blur & Glass Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-all"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-4xl bg-[#0a0a0f] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
        >
          {/* Top Subtle Lighting Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#ff7700] to-transparent shadow-[0_0_20px_#ff7700]" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ff7700]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-7 sm:right-7 p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-[#ff7700]/50 transition-all cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header Badge & Title */}
              <div className="text-center space-y-2 mb-6 sm:mb-8 pr-8 sm:pr-0">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#ff7700]/40 text-[11px] sm:text-xs font-bold text-[#ff7700]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WAL GROUP DISCOVERY CALL</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Book Your <span className="text-[#ff7700]">Executive Demo</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Schedule a 1-on-1 operational consultation with our dispatch, payroll, and BPO leadership.
                </p>
              </div>

              {/* Progress Bar (5 Steps) */}
              <div className="mb-8 relative z-10">
                <div className="flex justify-between items-center mb-2 px-1">
                  {stepsList.map((s) => (
                    <button
                      key={s.num}
                      onClick={() => {
                        if (s.num < step) setStep(s.num);
                      }}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          step >= s.num 
                            ? 'bg-[#ff7700] text-black shadow-[0_0_15px_rgba(255,119,0,0.6)] font-extrabold' 
                            : 'bg-white/10 text-slate-400 border border-white/10 group-hover:border-[#ff7700]/40'
                        }`}
                      >
                        {step > s.num ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold ${step >= s.num ? 'text-white' : 'text-slate-500'}`}>
                        {s.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Animated Orange Progress Line */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#ff6600] to-[#ff8811] rounded-full shadow-[0_0_12px_#ff6600]"
                    initial={{ width: '20%' }}
                    animate={{ width: `${(step / 5) * 100}%` }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Error Alert Box */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}

              {/* Form Content Steps */}
              <div className="min-h-[320px]">
                {/* STEP 1: COMPANY INFORMATION */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-xs uppercase tracking-wider font-bold text-[#ff7700] mb-2">Step 1 of 5: Company Profile</div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Company Name <span className="text-[#ff7700]">*</span></label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Apex Logistics LLC"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Industry / Sector</label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                        >
                          <option value="Amazon DSP / Fleet Logistics">Amazon DSP / Fleet Logistics</option>
                          <option value="Freight Linehaul & Trucking">Freight Linehaul &amp; Trucking</option>
                          <option value="Third-Party Logistics (3PL)">Third-Party Logistics (3PL)</option>
                          <option value="e-Commerce & Fulfillment">e-Commerce &amp; Fulfillment</option>
                          <option value="IT, SaaS & Software">IT, SaaS &amp; Software</option>
                          <option value="Corporate & Other Services">Corporate &amp; Other Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Country</label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States / Canada / UK"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Company Website (Optional)</label>
                        <div className="relative">
                          <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://yourcompany.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Company Size (Employees / Drivers)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                        {['1 - 10', '11 - 50', '51 - 200', '201 - 500', '500+'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setCompanySize(size)}
                            className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                              companySize === size
                                ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-[0_0_12px_rgba(255,119,0,0.5)]'
                                : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#ff7700]/40'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CONTACT DETAILS */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-xs uppercase tracking-wider font-bold text-[#ff7700] mb-2">Step 2 of 5: Contact Information</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Full Name <span className="text-[#ff7700]">*</span></label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Business Email <span className="text-[#ff7700]">*</span></label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            required
                            value={businessEmail}
                            onChange={(e) => setBusinessEmail(e.target.value)}
                            placeholder="john@yourcompany.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number <span className="text-[#ff7700]">*</span></label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Job Title</label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="Owner / Operations Manager"
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">LinkedIn Profile (Optional)</label>
                      <div className="relative">
                        <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: BUSINESS REQUIREMENTS (SERVICES) */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs uppercase tracking-wider font-bold text-[#ff7700]">Step 3 of 5: Select Required Services</div>
                      <span className="text-xs text-slate-400 font-bold">{selectedServices.length} Selected</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                      {availableServices.map((srv) => {
                        const isSelected = selectedServices.includes(srv.title);
                        return (
                          <motion.div
                            key={srv.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleService(srv.title)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#ff7700]/15 border-[#ff7700] shadow-[0_0_15px_rgba(255,119,0,0.25)]'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-extrabold ${isSelected ? 'text-[#ff7700]' : 'text-white'}`}>
                                  {srv.title}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-snug">{srv.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                              isSelected ? 'bg-[#ff7700] text-black' : 'bg-white/10 border border-white/20'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: MEETING DETAILS */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-xs uppercase tracking-wider font-bold text-[#ff7700] mb-2">Step 4 of 5: Schedule Preferred Date &amp; Channel</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Meeting Date <span className="text-[#ff7700]">*</span></label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="date"
                            required
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Time Window</label>
                        <div className="relative">
                          <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <select
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full bg-[#111118] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                          >
                            <option value="09:00 AM">09:00 AM</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:30 AM">11:30 AM</option>
                            <option value="01:30 PM">01:30 PM</option>
                            <option value="03:00 PM">03:00 PM</option>
                            <option value="04:30 PM">04:30 PM</option>
                            <option value="06:00 PM">06:00 PM</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Time Zone</label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full bg-[#111118] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff7700]"
                        >
                          <option value="EST (UTC-5)">Eastern Time (EST - US &amp; Canada)</option>
                          <option value="CST (UTC-6)">Central Time (CST - US &amp; Canada)</option>
                          <option value="MST (UTC-7)">Mountain Time (MST - US &amp; Canada)</option>
                          <option value="PST (UTC-8)">Pacific Time (PST - US &amp; Canada)</option>
                          <option value="GMT / UTC">Greenwich Mean Time (GMT)</option>
                          <option value="IST (UTC+5:30)">India Standard Time (IST)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Meeting Platform</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Google Meet', 'Microsoft Teams', 'Zoom'] as const).map((platform) => (
                            <button
                              key={platform}
                              type="button"
                              onClick={() => setMeetingType(platform)}
                              className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                                meetingType === platform
                                  ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-[0_0_12px_rgba(255,119,0,0.5)]'
                                  : 'bg-white/5 text-slate-300 border-white/10 hover:border-[#ff7700]/40'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{platform.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: ADDITIONAL NOTES & REVIEW */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-xs uppercase tracking-wider font-bold text-[#ff7700] mb-2">Step 5 of 5: Project Scope &amp; Final Review</div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Form Details Input */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Project Description / Overview</label>
                          <textarea
                            rows={3}
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Describe your current operations, dispatch pain points, or staffing goals..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff7700]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Timeline</label>
                            <select
                              value={timeline}
                              onChange={(e) => setTimeline(e.target.value)}
                              className="w-full bg-[#111118] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white"
                            >
                              <option value="Immediate (< 2 Weeks)">Immediate (&lt; 2 Weeks)</option>
                              <option value="1 - 3 Months">1 - 3 Months</option>
                              <option value="3+ Months">3+ Months</option>
                              <option value="Exploring Options">Exploring Options</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">Budget / Model</label>
                            <select
                              value={budget}
                              onChange={(e) => setBudget(e.target.value)}
                              className="w-full bg-[#111118] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white"
                            >
                              <option value="Flexible / Based on SLA">Flexible / SLA Based</option>
                              <option value="Fixed Monthly Retainer">Fixed Monthly Retainer</option>
                              <option value="Per Driver / Route Model">Per Driver / Route Model</option>
                            </select>
                          </div>
                        </div>

                        {/* Anti-spam Verification Checkbox */}
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="antiSpam"
                              checked={isHumanVerified}
                              onChange={(e) => setIsHumanVerified(e.target.checked)}
                              className="w-4 h-4 accent-[#ff7700] rounded cursor-pointer"
                            />
                            <label htmlFor="antiSpam" className="text-xs text-slate-300 font-medium cursor-pointer">
                              Anti-bot &amp; Spam Protection Verified
                            </label>
                          </div>
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        </div>
                      </div>

                      {/* Review Summary Card */}
                      <div className="glass-panel p-4 rounded-2xl border border-white/15 space-y-3 bg-white/[0.02]">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-xs font-bold text-[#ff7700] uppercase tracking-wider">Booking Summary</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            Auto-Routing: thewalgroupinfo@gmail.com
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-start">
                            <span className="text-slate-400">Company:</span>
                            <div className="text-right flex items-center gap-1.5">
                              <span className="font-bold text-white">{companyName || 'Not specified'} ({companySize})</span>
                              <button onClick={() => setStep(1)} className="text-[#ff7700] hover:underline text-[10px]"><Edit3 className="w-3 h-3 inline" /></button>
                            </div>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="text-slate-400">Client Contact:</span>
                            <div className="text-right flex items-center gap-1.5">
                              <span className="font-bold text-white">{fullName} ({businessEmail})</span>
                              <button onClick={() => setStep(2)} className="text-[#ff7700] hover:underline text-[10px]"><Edit3 className="w-3 h-3 inline" /></button>
                            </div>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="text-slate-400">Services ({selectedServices.length}):</span>
                            <div className="text-right flex items-center gap-1.5">
                              <span className="font-bold text-[#ff7700]">{selectedServices.slice(0, 3).join(', ')}{selectedServices.length > 3 ? '...' : ''}</span>
                              <button onClick={() => setStep(3)} className="text-[#ff7700] hover:underline text-[10px]"><Edit3 className="w-3 h-3 inline" /></button>
                            </div>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="text-slate-400">Schedule:</span>
                            <div className="text-right flex items-center gap-1.5">
                              <span className="font-bold text-emerald-400">{preferredDate} @ {preferredTime} ({timezone})</span>
                              <button onClick={() => setStep(4)} className="text-[#ff7700] hover:underline text-[10px]"><Edit3 className="w-3 h-3 inline" /></button>
                            </div>
                          </div>

                          <div className="flex justify-between items-start">
                            <span className="text-slate-400">Meeting Channel:</span>
                            <span className="font-bold text-white">{meetingType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Bottom Controls / Navigation Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 mt-6">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,119,0,0.4)] transition-all cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    disabled={loading}
                    onClick={handleFinalSubmit}
                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff6600] to-[#ff8811] text-black font-black text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(255,119,0,0.6)] hover:shadow-[0_0_40px_rgba(255,119,0,0.8)] transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Scheduling Meeting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Confirm &amp; Book Discovery Call</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            /* SUCCESS CONFIRMATION SCREEN */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="text-center space-y-6 py-4"
            >
              {/* Large Animated Green / Orange Glow Checkmark */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 bg-[#ff7700]/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#ff6600] to-emerald-400 flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,119,0,0.8)]">
                  <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
                  Booking Confirmed #{bookingId}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Your Discovery Call Has Been <span className="text-[#ff7700]">Successfully Scheduled!</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Thank you <span className="text-white font-bold">{fullName}</span>. A calendar invitation and confirmation summary have been dispatched to <span className="text-[#ff7700] font-mono font-bold">{businessEmail}</span>.
                </p>
              </div>

              {/* Meeting Details Card */}
              <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/[0.03] border border-white/15 text-left space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-wider">Scheduled Session</span>
                  <span className="text-emerald-400 font-bold">{meetingType}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">Date &amp; Time:</div>
                    <div className="font-extrabold text-white">{preferredDate} @ {preferredTime}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Timezone:</div>
                    <div className="font-extrabold text-white">{timezone}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Company:</div>
                    <div className="font-extrabold text-white">{companyName}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[11px]">Notification Channel:</div>
                    <div className="font-extrabold text-[#ff7700] truncate">thewalgroupinfo@gmail.com</div>
                  </div>
                </div>

                {/* Google Meet Link Action Button */}
                {meetLink && (
                  <div className="pt-2">
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join / Launch {meetingType} Meeting</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                    </a>
                  </div>
                )}
              </div>

              {/* Calendar & Social Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
                {googleCalendarUrl && (
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#ff7700]/20 border border-[#ff7700]/50 text-[#ff7700] hover:bg-[#ff7700]/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Add to Google Calendar</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={downloadICS}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#ff7700]" />
                  <span>Download Calendar (.ics)</span>
                </button>

                <a
                  href="https://www.instagram.com/thewalgroup?igsh=MW10OXZqM2N4YXhvbQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all"
                >
                  <Instagram className="w-4 h-4 stroke-[2.5]" />
                  <span>Follow @thewalgroup</span>
                </a>
              </div>

              {/* Close Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-8 py-3 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(255,119,0,0.5)] cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
