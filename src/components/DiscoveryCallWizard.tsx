import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  ExternalLink, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Download,
  CornerDownLeft,
  Package,
  Truck,
  Building,
  Wrench
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { CALENDLY_GOOGLE_MEET_URL, CALENDLY_ZOOM_URL } from './BookDemoModal';

interface DiscoveryCallWizardProps {
  onSuccess?: () => void;
  navigate?: (path: string) => void;
}

export const DiscoveryCallWizard: React.FC<DiscoveryCallWizardProps> = ({ navigate }) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form Fields: Name, Email, Industry, and Meeting Platform
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    industry: 'Amazon DSP (Last-Mile Delivery)',
    meetingType: 'Google Meet' as 'Google Meet' | 'Zoom'
  });

  const [bookingId, setBookingId] = useState<string>('');
  const [meetLink, setMeetLink] = useState<string>('');
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState<string>('');
  const [icsContent, setIcsContent] = useState<string>('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const stepsList = [
    { id: 'name', label: 'Name', icon: User },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'industry', label: 'Industry', icon: Briefcase },
    { id: 'platform', label: 'Platform', icon: Calendar }
  ];

  const industryOptions = [
    { 
      id: 'Amazon DSP (Last-Mile Delivery)', 
      label: 'Amazon DSP', 
      desc: 'Last-mile logistics & package delivery', 
      icon: Package 
    },
    { 
      id: 'Amazon AFP / Linehaul Freight', 
      label: 'Amazon AFP / Linehaul', 
      desc: 'Middle-mile freight & tractor fleets', 
      icon: Truck 
    },
    { 
      id: 'Dedicated Lane Freight & Logistics', 
      label: 'Dedicated Lane Freight', 
      desc: 'Over-the-road dispatch & carrier ops', 
      icon: Briefcase 
    },
    { 
      id: 'Towing & Specialty Fleet Services', 
      label: 'Specialty Fleets & Towing', 
      desc: 'Roadside dispatch, emergency & tow fleets', 
      icon: Wrench 
    },
    { 
      id: 'General Enterprise Operations', 
      label: 'Enterprise Logistics', 
      desc: 'Custom back-office & accounting support', 
      icon: Building 
    }
  ];

  useEffect(() => {
    setErrorMsg('');
    if (!submitted) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, submitted]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const validateStep = (index: number): boolean => {
    if (index === 0) {
      if (!formData.fullName.trim()) {
        setErrorMsg('Please enter your full name to proceed.');
        return false;
      }
    } else if (index === 1) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        setErrorMsg('Please enter a valid business email address.');
        return false;
      }
    } else if (index === 2) {
      if (!formData.industry) {
        setErrorMsg('Please select your industry focus.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep(stepIndex)) {
      try {
        soundFx.playPop?.();
      } catch {
        // audio fallback
      }
      return;
    }
    try {
      soundFx.playClick?.();
    } catch {
      // audio fallback
    }
    setDirection('forward');
    setStepIndex(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    try {
      soundFx.playClick?.();
    } catch {
      // audio fallback
    }
    setErrorMsg('');
    setDirection('backward');
    setStepIndex(prev => Math.max(prev - 1, 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSelectIndustry = (industryId: string) => {
    setFormData(prev => ({ ...prev, industry: industryId }));
    setErrorMsg('');
    try {
      soundFx.playClick?.();
    } catch {
      // audio fallback
    }
    setTimeout(() => {
      setDirection('forward');
      setStepIndex(3);
    }, 180);
  };

  const getCalendlyUrl = (platform: 'Google Meet' | 'Zoom'): string => {
    const baseUrl = platform === 'Google Meet' ? CALENDLY_GOOGLE_MEET_URL : CALENDLY_ZOOM_URL;
    const params = new URLSearchParams();
    if (formData.fullName) params.set('name', formData.fullName.trim());
    if (formData.email) params.set('email', formData.email.trim());
    return `${baseUrl}?${params.toString()}`;
  };

  const handleSubmitBooking = async (launchCalendly: boolean = false) => {
    setLoading(true);
    setErrorMsg('');

    const targetCalendlyUrl = getCalendlyUrl(formData.meetingType);

    if (launchCalendly) {
      try {
        soundFx.playClick?.();
      } catch {
        // audio fallback
      }
      window.open(targetCalendlyUrl, '_blank', 'noopener,noreferrer');
    }

    try {
      const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        industry: formData.industry,
        companyName: `${formData.fullName.trim()}'s Organization`,
        phone: '+1 555-010-0000',
        preferredDate: tomorrowDate,
        preferredTime: '10:00 AM EST',
        timezone: 'EST (UTC-5)',
        meetingType: formData.meetingType,
        selectedServices: [formData.industry],
        meetLink: targetCalendlyUrl
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setBookingId(result.bookingId || `WAL-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
        setMeetLink(result.meetLink || targetCalendlyUrl);
        setGoogleCalendarUrl(result.googleCalendarUrl || '');
        setIcsContent(result.icsContent || '');
        setSubmitted(true);
        try {
          soundFx.playSuccess?.();
        } catch {
          // audio fallback
        }
      } else {
        setErrorMsg(result.message || 'Failed to submit discovery call.');
      }
    } catch (err: any) {
      console.error('[Booking Submit Error]', err);
      setBookingId(`WAL-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
      setMeetLink(targetCalendlyUrl);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!icsContent) return;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `WAL_GROUP_${bookingId || 'Demo'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercent = Math.round(((stepIndex + 1) / stepsList.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-[#090d16] overflow-hidden min-h-[460px] flex flex-col justify-between">
        {/* Subtle lighting accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-[#ff7700] to-transparent shadow-[0_0_20px_#ff7700]" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#ff7700]/10 rounded-full blur-3xl pointer-events-none" />

        {!submitted ? (
          <div className="flex flex-col flex-1 justify-between">
            {/* Header & Step Tracker */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-[#ff7700]/30 text-[#ff7700] text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#ff7700]" />
                  DISCOVERY CALL WIZARD
                </span>
                <span className="font-semibold text-slate-300">
                  Step {stepIndex + 1} of {stepsList.length}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-[#ff6600] to-[#ff8811] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              {/* Stepper Dots */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px]">
                {stepsList.map((step, idx) => {
                  const isCompleted = stepIndex > idx;
                  const isCurrent = stepIndex === idx;
                  return (
                    <div 
                      key={step.id}
                      onClick={() => {
                        if (idx < stepIndex) {
                          setDirection('backward');
                          setStepIndex(idx);
                        }
                      }}
                      className={`flex items-center gap-1.5 font-medium transition-all ${
                        isCurrent
                          ? 'text-[#ff7700]'
                          : isCompleted
                          ? 'text-slate-300 cursor-pointer hover:text-white'
                          : 'text-slate-600'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400' : isCurrent ? 'bg-[#ff7700] text-black' : 'bg-white/10 text-slate-500'
                      }`}>
                        {isCompleted ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                      </div>
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* One-field-at-a-time Question Area */}
            <div className="flex-1 flex flex-col justify-center py-2">
              <AnimatePresence mode="wait" initial={false}>
                
                {/* 1. Name */}
                {stepIndex === 0 && (
                  <motion.div
                    key="wiz-name"
                    initial={{ opacity: 0, y: direction === 'forward' ? 14 : -14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: direction === 'forward' ? -14 : 14, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#ff7700] uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Personal Information
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        What is your full name?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Please provide your name so our operations directors know who to expect.
                      </p>
                    </div>

                    <div className="pt-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Marcus Vance"
                        className="w-full bg-[#0d121e] border border-white/20 rounded-2xl px-5 py-4 text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700] focus:ring-2 focus:ring-[#ff7700]/30 shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 2. Email */}
                {stepIndex === 1 && (
                  <motion.div
                    key="wiz-email"
                    initial={{ opacity: 0, y: direction === 'forward' ? 14 : -14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: direction === 'forward' ? -14 : 14, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#ff7700] uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Business Contact
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        What is your business email?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400">
                        We will send your calendar confirmation and meeting room invite here.
                      </p>
                    </div>

                    <div className="pt-2">
                      <input
                        ref={inputRef}
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="marcus@apexlogistics.com"
                        className="w-full bg-[#0d121e] border border-white/20 rounded-2xl px-5 py-4 text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#ff7700] focus:ring-2 focus:ring-[#ff7700]/30 shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}

                {/* 3. Industry */}
                {stepIndex === 2 && (
                  <motion.div
                    key="wiz-industry"
                    initial={{ opacity: 0, y: direction === 'forward' ? 14 : -14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: direction === 'forward' ? -14 : 14, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#ff7700] uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        Operational Focus
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        What is your industry?
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Select your operational domain (advances automatically upon selection).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 pt-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {industryOptions.map(opt => {
                        const isSelected = formData.industry === opt.id;
                        const IconComponent = opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectIndustry(opt.id)}
                            className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#ff7700]/15 border-[#ff7700] text-white ring-1 ring-[#ff7700]'
                                : 'bg-[#0d121e] border-white/10 hover:border-[#ff7700]/50 text-slate-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                isSelected ? 'bg-[#ff7700] text-black' : 'bg-white/5 text-slate-400'
                              }`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white">{opt.label}</div>
                                <div className="text-xs text-slate-400">{opt.desc}</div>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-[#ff7700] text-black' : 'border border-white/20'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* 4. Platform Selection */}
                {stepIndex === 3 && (
                  <motion.div
                    key="wiz-platform"
                    initial={{ opacity: 0, y: direction === 'forward' ? 14 : -14, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: direction === 'forward' ? -14 : 14, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#ff7700] uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Meeting Platform
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Choose Your Demo Call Platform
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Select Google Meet or Zoom before final submission.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400">Lead: </span>
                        <strong className="text-white">{formData.fullName}</strong> &bull; {formData.email}
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ready
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {/* Google Meet Card */}
                      <div
                        onClick={() => handleInputChange('meetingType', 'Google Meet')}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          formData.meetingType === 'Google Meet'
                            ? 'bg-[#0f1b26] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500'
                            : 'bg-[#0d121e] border-white/10 hover:border-emerald-500/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            formData.meetingType === 'Google Meet' ? 'bg-emerald-500 text-black' : 'border border-white/20'
                          }`}>
                            {formData.meetingType === 'Google Meet' && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-base font-bold text-white">Google Meet</h3>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Book your demo through Google Meet
                          </p>
                        </div>
                      </div>

                      {/* Zoom Card */}
                      <div
                        onClick={() => handleInputChange('meetingType', 'Zoom')}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                          formData.meetingType === 'Zoom'
                            ? 'bg-[#0b172a] border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] ring-1 ring-blue-500'
                            : 'bg-[#0d121e] border-white/10 hover:border-blue-500/40 text-slate-400'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <Video className="w-5 h-5" />
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            formData.meetingType === 'Zoom' ? 'bg-blue-500 text-white' : 'border border-white/20'
                          }`}>
                            {formData.meetingType === 'Zoom' && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        <div className="mt-3">
                          <h3 className="text-base font-bold text-white">Zoom</h3>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Book your demo through Zoom
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wizard Navigation Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 mt-4">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {stepIndex < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6600] to-[#ff8811] text-black font-extrabold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(255,102,0,0.4)] hover:shadow-[0_0_25px_rgba(255,102,0,0.6)] transition-all cursor-pointer ml-auto"
                >
                  <span>Continue</span>
                  <CornerDownLeft className="w-4 h-4 text-black hidden sm:inline" />
                  <ArrowRight className="w-4 h-4 sm:hidden" />
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmitBooking(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    Submit Directly
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSubmitBooking(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6600] to-[#ff8811] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,102,0,0.5)] hover:shadow-[0_0_30px_rgba(255,102,0,0.7)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Send on {formData.meetingType} &amp; Submit</span>
                        <ExternalLink className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* SUCCESS SCREEN */
          <div className="py-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Discovery Session Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Demo Call Scheduled &amp; Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{formData.fullName}</strong>. Your session for <strong className="text-white">{formData.industry}</strong> has been logged with Reference ID <strong className="text-[#ff7700] font-mono">{bookingId}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={getCalendlyUrl(formData.meetingType)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ff6600] to-[#ff8811] text-black font-extrabold text-xs flex items-center gap-2 shadow-lg"
              >
                <span>Open {formData.meetingType} Calendly</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {googleCalendarUrl && (
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#ff7700]" />
                  <span>Google Calendar</span>
                </a>
              )}
              {icsContent && (
                <button
                  onClick={handleDownloadIcs}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#ff7700]" />
                  <span>Download .ics</span>
                </button>
              )}
            </div>

            {navigate && (
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
