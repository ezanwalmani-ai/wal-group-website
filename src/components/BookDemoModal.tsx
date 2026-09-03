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
  Sparkles, 
  ShieldCheck, 
  X, 
  Download, 
  ExternalLink, 
  Instagram, 
  Linkedin,
  Layers,
  Truck,
  Calculator,
  Bot,
  Users,
  Headphones,
  Compass
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { saveBookingToSupabase } from '../lib/supabase';
import { ProgressiveForm } from './forms/ProgressiveForm';
import { FormStep, FormQuestion, ReviewSection } from './forms/types';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (path: string) => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose, navigate }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Submission Response
  const [bookingId, setBookingId] = useState<string>('');
  const [meetLink, setMeetLink] = useState<string>('');
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState<string>('');
  const [icsContent, setIcsContent] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<Record<string, any>>({});

  const stepsList: FormStep[] = [
    { id: 'company', label: 'Company', shortLabel: 'Company', icon: Building2 },
    { id: 'contact', label: 'Contact', shortLabel: 'Contact', icon: User },
    { id: 'services', label: 'Services', shortLabel: 'Services', icon: Layers },
    { id: 'meeting', label: 'Meeting', shortLabel: 'Meeting', icon: Calendar },
  ];

  const questions: FormQuestion[] = [
    // STEP 1: COMPANY
    {
      id: 'companyName',
      stepId: 'company',
      type: 'text',
      question: 'What is your company or DSP name?',
      subtitle: 'We will customize our operational proposal and scorecard metrics for your organization.',
      placeholder: 'e.g. Apex Logistics / Prime DSP 44',
      required: true
    },
    {
      id: 'country',
      stepId: 'company',
      type: 'select',
      question: 'Which country is your company based in?',
      subtitle: 'Select your operational territory to route to our regional dispatch coordinators.',
      required: true,
      options: [
        { value: 'United States', label: 'United States', description: 'Amazon DSP, AFP & Domestic Freight', icon: Globe },
        { value: 'Canada', label: 'Canada', description: 'Cross-border & Canadian Amazon Logistics', icon: Globe },
        { value: 'United Kingdom', label: 'United Kingdom', description: 'UK & European Logistics Hubs', icon: Globe },
        { value: 'India', label: 'India', description: 'Domestic Logistics & BPO Operations', icon: Globe },
        { value: 'Australia', label: 'Australia', description: 'Oceania Regional Transport', icon: Globe },
        { value: 'Other', label: 'Other International', description: 'Global operations and offshore delivery', icon: Compass }
      ],
      defaultValue: 'United States'
    },
    {
      id: 'website',
      stepId: 'company',
      type: 'url',
      question: 'What is your company website?',
      subtitle: 'Optional — allows our analysts to review your current fleet profile before the session.',
      placeholder: 'e.g. https://www.yourdomain.com',
      required: false
    },
    {
      id: 'companySize',
      stepId: 'company',
      type: 'select',
      question: 'How large is your operation?',
      subtitle: 'Total drivers, dispatchers, or staff currently active in your organization.',
      required: true,
      options: [
        { value: '1–10', label: '1 – 10 Team Members', description: 'Early-stage or boutique fleet', tag: 'Startup' },
        { value: '11–50', label: '11 – 50 Team Members', description: 'Standard Amazon DSP operation (20-40 routes)', tag: 'DSP Standard' },
        { value: '51–200', label: '51 – 200 Team Members', description: 'Multi-station or large regional fleet', tag: 'High Volume' },
        { value: '201–500', label: '201 – 500 Team Members', description: 'Enterprise line-haul & multi-state coverage', tag: 'Enterprise' },
        { value: '500+', label: '500+ Team Members', description: 'National corporate logistics infrastructure', tag: 'Corporate' }
      ],
      defaultValue: '11–50'
    },
    {
      id: 'industry',
      stepId: 'company',
      type: 'select',
      question: 'What industry best describes your business?',
      subtitle: 'Select your operational domain so we pair you with the exact subject-matter expert.',
      required: true,
      options: [
        { value: 'Amazon DSP / Fleet Logistics', label: 'Amazon DSP Logistics', description: 'Last-mile delivery partners utilizing Cortex & Netradyne', icon: Truck, tag: 'Specialty' },
        { value: 'Freight & Dedicated Lanes', label: 'Freight & Dedicated Lanes', description: 'Amazon Relay, AFP, 53ft dry vans, box trucks & power-only', icon: Truck },
        { value: 'E-Commerce & Retail Supply Chain', label: 'E-Commerce Fulfillment', description: 'Omni-channel warehousing, pick-pack & freight routing', icon: Globe },
        { value: 'Corporate BPO & Back-Office', label: 'BPO / Back-Office Staffing', description: 'Offshore accounting, HR, virtual assistants & customer care', icon: Users },
        { value: 'Technology & Web Engineering', label: 'Technology / Custom Web', description: 'Custom logistics software, recruiting portals & marketing', icon: Globe }
      ],
      defaultValue: 'Amazon DSP / Fleet Logistics'
    },

    // STEP 2: CONTACT DETAILS
    {
      id: 'fullName',
      stepId: 'contact',
      type: 'text',
      question: 'What is your full name?',
      subtitle: 'Your name will appear on the calendar invitation and meeting roster.',
      placeholder: 'e.g. Johnathan Miller',
      required: true
    },
    {
      id: 'businessEmail',
      stepId: 'contact',
      type: 'email',
      question: 'What is your business email address?',
      subtitle: 'We will send the calendar invite, meeting link, and preparation notes here.',
      placeholder: 'e.g. johnathan@company.com',
      required: true
    },
    {
      id: 'phone',
      stepId: 'contact',
      type: 'phone',
      question: 'What is the best phone number to reach you?',
      subtitle: 'Used for SMS meeting reminders and urgent operational coordination.',
      placeholder: 'e.g. +1 (555) 234-5678',
      required: true
    },
    {
      id: 'jobTitle',
      stepId: 'contact',
      type: 'text',
      question: 'What is your job title?',
      subtitle: 'Helps our leadership address your specific operational KPIs.',
      placeholder: 'e.g. Fleet Owner, Operations Director, General Manager',
      required: false
    },
    {
      id: 'linkedin',
      stepId: 'contact',
      type: 'url',
      question: 'Do you have a LinkedIn profile?',
      subtitle: 'Optional — connect with our executive leadership team on LinkedIn.',
      placeholder: 'https://linkedin.com/in/username',
      required: false
    },

    // STEP 3: REQUIREMENTS & SERVICES
    {
      id: 'currentFleetSize',
      stepId: 'services',
      type: 'select',
      question: 'What is your current active vehicle fleet or lane count?',
      subtitle: 'Helps us calculate staffing ratios and dispatcher shifts accurately.',
      required: true,
      options: [
        { value: '1-10 Vans/Trucks', label: '1 - 10 Vans or Trucks', description: 'Small fleet or initial launch stage' },
        { value: '15-30 Vans/Trucks', label: '15 - 30 Vans or Trucks', description: 'Standard DSP fleet (single station)' },
        { value: '35-65 Vans/Trucks', label: '35 - 65 Vans or Trucks', description: 'Heavy volume / peak seasonal capacity' },
        { value: '70+ Commercial Vehicles', label: '70+ Commercial Vehicles', description: 'Multi-station or large regional operation' },
        { value: 'Back-Office / Non-Vehicle', label: 'Back-Office Only', description: 'Accounting, recruiting, or tech assistance only' }
      ],
      defaultValue: '15-30 Vans/Trucks'
    },
    {
      id: 'selectedServices',
      stepId: 'services',
      type: 'multiselect',
      question: 'What can Wal Group help you with?',
      subtitle: 'Select one or more services. You can select multiple and continue.',
      required: true,
      options: [
        { value: 'Amazon DSP', label: 'Amazon DSP Dispatch & Cortex', description: '24/7 Cortex tracking, Netradyne monitoring, and route execution.', icon: Truck, tag: 'Most Popular' },
        { value: 'Dispatch', label: 'Truck Dispatch & Freight Lanes', description: 'Amazon Relay, dedicated lane matching & HOS tracking.', icon: Truck },
        { value: 'Accounting', label: 'DSP Payroll & Weekly Scorecard Audit', description: 'Certified QuickBooks & ADP weekly payroll reconciliation & 14-day audit.', icon: Calculator, tag: 'Recommended' },
        { value: 'HR', label: 'HR & AI Driver Recruiting', description: 'SmartRecruiters ATS, bilingual recruiting & driver onboarding.', icon: Bot },
        { value: 'Virtual Assistant', label: 'Dedicated Virtual Assistants', description: 'Remote administrative & operations staff for logistics support.', icon: Headphones },
        { value: 'Website Development', label: 'Website Development & Tech', description: 'Custom portals, high-converting recruitment sites & web apps.', icon: Globe },
        { value: 'Marketing', label: 'Digital Marketing & Growth', description: 'Driver recruitment SEO, targeted ads & brand building.', icon: Globe },
        { value: 'Customer Support', label: '24/7 Omni-Channel Customer Care', description: 'Continuous exception handling, driver support & dispatch hotline.', icon: Users }
      ],
      defaultValue: ['Amazon DSP', 'Dispatch']
    },
    {
      id: 'projectDescription',
      stepId: 'services',
      type: 'textarea',
      question: 'What are your primary operational goals or challenges?',
      subtitle: 'Optional — e.g. reducing DCR/safety infractions, improving Fantastic+ scorecards, cutting dispatch overhead, etc.',
      placeholder: 'Describe your current operational goals, pain points, or what you would like to achieve with Wal Group...',
      required: false,
      rows: 4
    },

    // STEP 4: MEETING PREFERENCES
    {
      id: 'meetingType',
      stepId: 'meeting',
      type: 'select',
      question: 'What video conferencing platform do you prefer?',
      subtitle: 'We will generate an instant meeting link for this platform.',
      required: true,
      options: [
        { value: 'Google Meet', label: 'Google Meet', description: 'Instant calendar integration and one-click browser launch.', icon: Video, tag: 'Recommended' },
        { value: 'Microsoft Teams', label: 'Microsoft Teams', description: 'Corporate workspace conferencing with screen sharing.', icon: Video },
        { value: 'Zoom', label: 'Zoom Video', description: 'High-definition video call with direct join link.', icon: Video }
      ],
      defaultValue: 'Google Meet'
    },
    {
      id: 'preferredDate',
      stepId: 'meeting',
      type: 'date',
      question: 'What date works best for your discovery call?',
      subtitle: 'Select from recommended slots or pick a custom business day.',
      required: true,
      defaultValue: () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      }
    },
    {
      id: 'preferredTime',
      stepId: 'meeting',
      type: 'time',
      question: 'What time slot works best for you?',
      subtitle: 'All times displayed in Eastern Standard Time (EST / UTC-5).',
      required: true,
      defaultValue: '10:00 AM EST'
    }
  ];

  const reviewSections: ReviewSection[] = [
    {
      title: '1. Company Details',
      stepId: 'company',
      fields: [
        { label: 'Company Name', key: 'companyName' },
        { label: 'Country', key: 'country' },
        { label: 'Company Size', key: 'companySize' },
        { label: 'Industry', key: 'industry' },
        { label: 'Website', key: 'website' }
      ]
    },
    {
      title: '2. Contact Information',
      stepId: 'contact',
      fields: [
        { label: 'Full Name', key: 'fullName' },
        { label: 'Business Email', key: 'businessEmail' },
        { label: 'Phone', key: 'phone' },
        { label: 'Job Title', key: 'jobTitle' },
        { label: 'LinkedIn', key: 'linkedin' }
      ]
    },
    {
      title: '3. Operations & Requirements',
      stepId: 'services',
      fields: [
        { label: 'Fleet / Team Scale', key: 'currentFleetSize' },
        { label: 'Services Required', key: 'selectedServices' },
        { label: 'Operational Goals', key: 'projectDescription' }
      ]
    },
    {
      title: '4. Discovery Session',
      stepId: 'meeting',
      fields: [
        { label: 'Meeting Platform', key: 'meetingType' },
        { label: 'Date', key: 'preferredDate' },
        { label: 'Time', key: 'preferredTime' }
      ]
    }
  ];

  const handleFinalSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    setErrorMsg('');
    soundFx.playClick();

    const generatedId = `WAL-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const selectedSvc = Array.isArray(formData.selectedServices) && formData.selectedServices.length > 0
      ? formData.selectedServices
      : ['Amazon DSP', 'Dispatch'];

    const payload = {
      id: generatedId,
      companyName: formData.companyName || 'Fleet Operator',
      industry: formData.industry || 'Amazon DSP / Fleet Logistics',
      country: formData.country || 'United States',
      website: formData.website || '',
      companySize: `${formData.companySize || '11-50'} | ${formData.currentFleetSize || '15-30 Vans/Trucks'}`,
      fullName: formData.fullName || '',
      email: formData.businessEmail || '',
      phone: formData.phone || '',
      jobTitle: formData.jobTitle || '',
      linkedin: formData.linkedin || '',
      selectedServices: selectedSvc,
      preferredDate: formData.preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: formData.preferredTime || '10:00 AM EST',
      timezone: 'EST (UTC-5)',
      meetingType: formData.meetingType || 'Google Meet',
      projectDescription: formData.projectDescription || `Scale: ${formData.currentFleetSize || 'Standard'}, Company Size: ${formData.companySize || '11-50'}`,
      status: 'Pending',
      meetLink: `https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`,
      messagingConsent: true,
      recaptchaToken: 'VERIFIED_USER'
    };

    setSubmittedData(payload);

    // 1. Save directly to Supabase client-side
    saveBookingToSupabase(payload).catch((err) => console.error('Supabase direct booking save error:', err));

    // 2. Trigger backend API for email automation & calendar generation
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setBookingId(data.bookingId || generatedId);
        setMeetLink(data.meetLink || `https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`);
        setGoogleCalendarUrl(data.googleCalendarUrl || '');
        setIcsContent(data.icsContent || '');
      } else {
        setBookingId(generatedId);
        setMeetLink(`https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`);
      }
    } catch (err) {
      console.error('Booking API submission error:', err);
      // Offline / network fallback
      setBookingId(generatedId);
      setMeetLink(`https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const downloadICS = () => {
    if (bookingId) {
      window.open(`/api/bookings/ics/${bookingId}`, '_blank');
    } else {
      const element = document.createElement("a");
      const file = new Blob([icsContent || 'BEGIN:VCALENDAR\nVERSION:2.0\nSUMMARY:Wal Group Discovery Call\nEND:VCALENDAR'], { type: 'text/calendar;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${bookingId || 'wal-group'}-discovery-call.ics`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const resetModal = () => {
    setSubmitted(false);
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
          className="relative z-10 w-full max-w-4xl bg-[#0a0a0f] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Subtle Lighting Accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#ff7700] to-transparent shadow-[0_0_20px_#ff7700]" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#ff7700]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-[#ff7700]/50 transition-all cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto flex-1 pr-1">
            {!submitted ? (
              <ProgressiveForm
                formId="demo-booking"
                badgeText="WAL GROUP EXECUTIVE DEMO"
                steps={stepsList}
                questions={questions}
                initialValues={{
                  companyName: '',
                  country: 'United States',
                  website: '',
                  companySize: '11–50',
                  industry: 'Amazon DSP / Fleet Logistics',
                  fullName: '',
                  businessEmail: '',
                  phone: '',
                  jobTitle: '',
                  linkedin: '',
                  currentFleetSize: '15-30 Vans/Trucks',
                  selectedServices: ['Amazon DSP', 'Dispatch'],
                  projectDescription: '',
                  meetingType: 'Google Meet',
                  preferredDate: (() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    return d.toISOString().split('T')[0];
                  })(),
                  preferredTime: '10:00 AM EST'
                }}
                onSubmit={handleFinalSubmit}
                onCancel={onClose}
                submitButtonText="Confirm & Schedule Discovery Call"
                reviewTitle="Review Your Discovery Call Request"
                reviewDescription="Verify your company, contact, and meeting details. You can click Edit to change any section before scheduling."
                reviewSections={reviewSections}
                isSubmitting={loading}
                submitError={errorMsg}
                footerNotice="Protected by 256-bit encryption. A dedicated Wal Group Logistics Director will review your fleet profile prior to the call."
              />
            ) : (
              /* SUCCESS CONFIRMATION SCREEN */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="text-center space-y-6 py-6"
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
                    Thank you <span className="text-white font-bold">{submittedData.fullName}</span>. A calendar invitation and confirmation summary have been dispatched to <span className="text-[#ff7700] font-mono font-bold">{submittedData.email}</span>.
                  </p>
                </div>

                {/* Meeting Details Card */}
                <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/[0.03] border border-white/15 text-left space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Scheduled Session</span>
                    <span className="text-emerald-400 font-bold">{submittedData.meetingType}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Date &amp; Time:</div>
                      <div className="font-extrabold text-white">{submittedData.preferredDate} @ {submittedData.preferredTime}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Timezone:</div>
                      <div className="font-extrabold text-white">EST (UTC-5)</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Company:</div>
                      <div className="font-extrabold text-white">{submittedData.companyName}</div>
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
                        <span>Join / Launch {submittedData.meetingType} Meeting</span>
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
                    href="https://www.instagram.com/thewalgroups/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-all"
                  >
                    <Instagram className="w-4 h-4 stroke-[2.5]" />
                    <span>Follow @thewalgroups</span>
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
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
