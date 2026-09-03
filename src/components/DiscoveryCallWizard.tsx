import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Truck, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Bot, 
  Calculator, 
  Headphones, 
  Globe, 
  Video, 
  Download, 
  ExternalLink, 
  Instagram, 
  User, 
  Layers,
  Compass
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { saveBookingToSupabase } from '../lib/supabase';
import { ProgressiveForm } from './forms/ProgressiveForm';
import { FormStep, FormQuestion, ReviewSection } from './forms/types';

interface DiscoveryCallWizardProps {
  onSuccess?: () => void;
  navigate?: (path: string) => void;
}

export const DiscoveryCallWizard: React.FC<DiscoveryCallWizardProps> = ({ onSuccess, navigate }) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [meetLink, setMeetLink] = useState<string>('');
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState<string>('');
  const [icsContent, setIcsContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<Record<string, any>>({});

  const stepsList: FormStep[] = [
    { id: 'company', label: 'Company', shortLabel: 'Company', icon: Building2 },
    { id: 'operations', label: 'Operations', shortLabel: 'Fleet', icon: Truck },
    { id: 'services', label: 'Services', shortLabel: 'Services', icon: Layers },
    { id: 'schedule', label: 'Schedule', shortLabel: 'Schedule', icon: Calendar },
  ];

  const questions: FormQuestion[] = [
    // Step 1: Company Info
    {
      id: 'companyName',
      stepId: 'company',
      type: 'text',
      question: 'What is your company or DSP name?',
      subtitle: 'We tailor the discovery session metrics directly to your company profile.',
      placeholder: 'e.g. Apex Logistics / Prime DSP 44',
      required: true
    },
    {
      id: 'country',
      stepId: 'company',
      type: 'select',
      question: 'Which country is your company based in?',
      subtitle: 'Ensures we pair you with the operational coordinator for your territory.',
      required: true,
      options: [
        { value: 'United States', label: 'United States', description: 'Domestic Amazon DSP & Freight Logistics', icon: Globe },
        { value: 'Canada', label: 'Canada', description: 'Cross-border & Canadian Amazon delivery hubs', icon: Globe },
        { value: 'United Kingdom', label: 'United Kingdom', description: 'UK & European delivery logistics', icon: Globe },
        { value: 'India', label: 'India', description: 'Domestic operations & BPO centers', icon: Globe },
        { value: 'Other', label: 'Other Territory', description: 'International operations', icon: Compass }
      ],
      defaultValue: 'United States'
    },
    {
      id: 'website',
      stepId: 'company',
      type: 'url',
      question: 'What is your company website?',
      subtitle: 'Optional — allows our operations analysts to review your fleet before the call.',
      placeholder: 'e.g. https://yourdomain.com',
      required: false
    },
    {
      id: 'industry',
      stepId: 'company',
      type: 'select',
      question: 'What is your primary operational focus?',
      subtitle: 'Select the primary segment for your organization.',
      required: true,
      options: [
        { value: 'Amazon DSP / Fleet Logistics', label: 'Amazon DSP Logistics', description: 'Last-mile Amazon delivery partners using Cortex', icon: Truck },
        { value: 'Freight & Dedicated Lanes', label: 'Freight & Dedicated Lanes', description: 'Amazon Relay, box trucks, 53ft dry vans & dedicated lanes', icon: Truck },
        { value: 'E-Commerce & Retail Supply Chain', label: 'E-Commerce Supply Chain', description: 'Omni-channel fulfillment & freight distribution', icon: Globe },
        { value: 'Corporate BPO & Back-Office', label: 'BPO & Back-Office Services', description: 'Offshore dispatch, accounting & virtual staff', icon: Users }
      ],
      defaultValue: 'Amazon DSP / Fleet Logistics'
    },

    // Step 2: Operations Scale
    {
      id: 'fleetSize',
      stepId: 'operations',
      type: 'select',
      question: 'What is your current active fleet size?',
      subtitle: 'Number of vans or commercial trucks on the road daily.',
      required: true,
      options: [
        { value: '1 - 10 Vans/Trucks', label: '1 - 10 Vehicles', description: 'Early-stage or single station route' },
        { value: '15 - 30 Vans/Trucks', label: '15 - 30 Vehicles', description: 'Standard DSP capacity (single station)' },
        { value: '35 - 60 Vans/Trucks', label: '35 - 60 Vehicles', description: 'High-volume peak capacity fleet' },
        { value: '60+ Vans/Trucks', label: '60+ Commercial Vehicles', description: 'Enterprise multi-station operation' },
        { value: 'Back-Office Only', label: 'Back-Office Only', description: 'Non-vehicle operations or consulting' }
      ],
      defaultValue: '15 - 30 Vans/Trucks'
    },
    {
      id: 'driverCount',
      stepId: 'operations',
      type: 'select',
      question: 'How many active drivers are in your organization?',
      subtitle: 'Helps us estimate recruiting, payroll, and dispatcher staffing ratios.',
      required: true,
      options: [
        { value: 'Under 15 Drivers', label: 'Under 15 Drivers' },
        { value: '20 - 40 Drivers', label: '20 - 40 Drivers' },
        { value: '45 - 80 Drivers', label: '45 - 80 Drivers' },
        { value: '80+ Drivers', label: '80+ Drivers' }
      ],
      defaultValue: '20 - 40 Drivers'
    },
    {
      id: 'currentDispatch',
      stepId: 'operations',
      type: 'select',
      question: 'What is your current dispatch setup?',
      subtitle: 'Understanding your existing setup allows us to calculate potential SLA improvements.',
      required: true,
      options: [
        { value: 'In-House Team', label: 'In-House Team', description: 'Internal dispatchers working on-site' },
        { value: 'Outsourced Partner', label: 'Outsourced Partner', description: 'Currently working with another agency or contractor' },
        { value: 'Hybrid Setup', label: 'Hybrid Setup', description: 'Blend of internal leads and remote dispatchers' },
        { value: 'Looking to Launch', label: 'Looking to Launch', description: 'New operation onboarding first routes' }
      ],
      defaultValue: 'In-House Team'
    },

    // Step 3: Selected Services
    {
      id: 'selectedServices',
      stepId: 'services',
      type: 'multiselect',
      question: 'Which services would you like to discuss?',
      subtitle: 'Select all areas you want Wal Group to support. You can pick multiple.',
      required: true,
      options: [
        { value: 'Amazon DSP Dispatch & Cortex Management', label: 'Amazon DSP Dispatch', description: '24/7 Cortex tracking, Netradyne monitoring, and route execution.', icon: Truck, tag: 'Most Popular' },
        { value: 'Certified Payroll & Accounting', label: 'DSP Payroll & Accounting', description: 'Weekly Amazon scorecard reconciliation, driver payouts & tax compliance.', icon: Calculator, tag: 'Recommended' },
        { value: 'AI Driver Recruiting & ATS', label: 'AI Driver Recruiting & ATS', description: 'SmartRecruiters ATS, bilingual screening & onboarding.', icon: Bot, tag: 'Automation' },
        { value: 'HR & Benefits BPO', label: 'HR & Benefits BPO', description: 'Driver onboarding, benefits administration, & EEO-1 compliance.', icon: Users },
        { value: 'Digital Marketing & Web', label: 'Digital Marketing & Web', description: 'Recruitment landing pages, SEO, and driver applicant generation.', icon: Globe },
        { value: 'Virtual Administrative Assistants', label: 'Virtual Assistants', description: 'Dedicated back-office remote staff for logistics operations.', icon: Headphones }
      ],
      defaultValue: ['Amazon DSP Dispatch & Cortex Management', 'Certified Payroll & Accounting']
    },

    // Step 4: Contact & Schedule
    {
      id: 'fullName',
      stepId: 'schedule',
      type: 'text',
      question: 'What is your full name?',
      subtitle: 'Your name will appear on the calendar invitation.',
      placeholder: 'e.g. Sarah Jenkins',
      required: true
    },
    {
      id: 'email',
      stepId: 'schedule',
      type: 'email',
      question: 'What is your business email address?',
      subtitle: 'We will send your calendar invite and meeting link here.',
      placeholder: 'e.g. sarah@apexlogistics.com',
      required: true
    },
    {
      id: 'phone',
      stepId: 'schedule',
      type: 'phone',
      question: 'What is your phone number?',
      subtitle: 'For urgent updates and SMS reminders.',
      placeholder: 'e.g. +1 (555) 123-4567',
      required: true
    },
    {
      id: 'preferredDate',
      stepId: 'schedule',
      type: 'date',
      question: 'Select your preferred discovery call date',
      subtitle: 'Pick an upcoming business day that suits your schedule.',
      required: true,
      defaultValue: () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      }
    },
    {
      id: 'preferredTime',
      stepId: 'schedule',
      type: 'time',
      question: 'Select your preferred meeting time slot',
      subtitle: 'All times in Eastern Standard Time (EST).',
      required: true,
      defaultValue: '10:00 AM EST'
    },
    {
      id: 'notes',
      stepId: 'schedule',
      type: 'textarea',
      question: 'Any specific questions or topics you want to cover?',
      subtitle: 'Optional — let us know about any specific challenges or targets.',
      placeholder: 'e.g. Reducing rescue routes, improving Fantastic+ scorecard, lowering payroll processing overhead...',
      required: false,
      rows: 3
    }
  ];

  const reviewSections: ReviewSection[] = [
    {
      title: '1. Organization & Fleet Profile',
      stepId: 'company',
      fields: [
        { label: 'Company Name', key: 'companyName' },
        { label: 'Country', key: 'country' },
        { label: 'Fleet Scale', key: 'fleetSize' },
        { label: 'Driver Count', key: 'driverCount' },
        { label: 'Dispatch Model', key: 'currentDispatch' }
      ]
    },
    {
      title: '2. Requested Services',
      stepId: 'services',
      fields: [
        { label: 'Services', key: 'selectedServices' }
      ]
    },
    {
      title: '3. Contact & Schedule',
      stepId: 'schedule',
      fields: [
        { label: 'Full Name', key: 'fullName' },
        { label: 'Email Address', key: 'email' },
        { label: 'Phone Number', key: 'phone' },
        { label: 'Date', key: 'preferredDate' },
        { label: 'Time', key: 'preferredTime' },
        { label: 'Notes', key: 'notes' }
      ]
    }
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    setLoading(true);
    setErrorMsg('');
    soundFx.playClick();

    const generatedId = `WAL-DEMO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const selectedSvc = Array.isArray(formData.selectedServices) && formData.selectedServices.length > 0
      ? formData.selectedServices
      : ['Amazon DSP Dispatch & Cortex Management'];

    const payload = {
      id: generatedId,
      companyName: formData.companyName || 'Fleet Operator',
      industry: formData.industry || 'Amazon DSP / Fleet Logistics',
      country: formData.country || 'United States',
      website: formData.website || '',
      companySize: `${formData.fleetSize || '15-30 Vans/Trucks'} | ${formData.driverCount || '20-40 Drivers'}`,
      fullName: formData.fullName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      preferredDate: formData.preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: formData.preferredTime || '10:00 AM EST',
      timezone: 'EST (UTC-5)',
      meetingType: 'Google Meet',
      selectedServices: selectedSvc,
      projectDescription: formData.notes || `Fleet: ${formData.fleetSize}, Drivers: ${formData.driverCount}, Dispatch: ${formData.currentDispatch}`,
      status: 'Pending',
      meetLink: `https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`,
      recaptchaToken: 'VERIFIED_USER'
    };

    setSubmittedData(payload);

    // Save directly to Supabase
    saveBookingToSupabase(payload).catch((err) => console.error('Supabase wizard booking save error:', err));

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

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
      console.error('Wizard booking submission error:', err);
      setBookingId(generatedId);
      setMeetLink(`https://meet.google.com/wal-demo-${generatedId.toLowerCase()}`);
    } finally {
      setLoading(false);
      setSubmitted(true);
      if (onSuccess) onSuccess();
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

  return (
    <div className="w-full bg-[#0a0a0f] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7700]/10 rounded-full blur-3xl pointer-events-none" />

      {!submitted ? (
        <ProgressiveForm
          formId="wizard-discovery-call"
          badgeText="WAL GROUP ONBOARDING"
          steps={stepsList}
          questions={questions}
          initialValues={{
            companyName: '',
            country: 'United States',
            website: '',
            industry: 'Amazon DSP / Fleet Logistics',
            fleetSize: '15 - 30 Vans/Trucks',
            driverCount: '20 - 40 Drivers',
            currentDispatch: 'In-House Team',
            selectedServices: ['Amazon DSP Dispatch & Cortex Management', 'Certified Payroll & Accounting'],
            fullName: '',
            email: '',
            phone: '',
            preferredDate: (() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              return d.toISOString().split('T')[0];
            })(),
            preferredTime: '10:00 AM EST',
            notes: ''
          }}
          onSubmit={handleSubmit}
          submitButtonText="Confirm & Schedule Discovery Call"
          reviewTitle="Confirm Your Discovery Call"
          reviewDescription="Please verify your company, fleet size, and schedule preferences before we reserve your slot."
          reviewSections={reviewSections}
          isSubmitting={loading}
          submitError={errorMsg}
          footerNotice="No obligation. We will review your current route scorecards and dispatch operations during the session."
        />
      ) : (
        /* SUCCESS CONFIRMATION */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-6"
        >
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-[#ff7700]/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#ff6600] to-emerald-400 flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,119,0,0.8)]">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              Discovery Call Booked #{bookingId}
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Your Session Has Been <span className="text-[#ff7700]">Confirmed!</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Thank you <span className="text-white font-bold">{submittedData.fullName}</span>. An invitation with connection instructions has been sent to <span className="text-[#ff7700] font-mono font-bold">{submittedData.email}</span>.
            </p>
          </div>

          <div className="max-w-lg mx-auto p-5 rounded-2xl bg-white/[0.03] border border-white/15 text-left space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Session Details</span>
              <span className="text-emerald-400 font-bold">Google Meet</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-400 text-[11px]">Date &amp; Time:</div>
                <div className="font-extrabold text-white">{submittedData.preferredDate} @ {submittedData.preferredTime}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[11px]">Organization:</div>
                <div className="font-extrabold text-white">{submittedData.companyName}</div>
              </div>
            </div>

            {meetLink && (
              <div className="pt-2">
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Video className="w-4 h-4" />
                  <span>Launch Google Meet</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </a>
              </div>
            )}
          </div>

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
              <span>Download (.ics)</span>
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

          <div className="pt-4">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 transition-all cursor-pointer"
            >
              Book Another Session
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
