import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare, 
  Globe, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Layout, 
  Palette, 
  Clock, 
  ChevronDown, 
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  FileCheck,
  Lock
} from 'lucide-react';

export interface WebsitePackageInfo {
  id: string;
  name: string;
  price: string;
  delivery?: string;
  pages?: string;
  badge?: string;
}

export const WEBSITE_PACKAGES_LIST: WebsitePackageInfo[] = [
  {
    id: 'starter',
    name: 'Starter Website',
    price: '$399',
    delivery: '3–5 business days',
    pages: 'Up to 5 pages'
  },
  {
    id: 'business',
    name: 'Business Website',
    price: '$699',
    delivery: '5–7 business days',
    pages: 'Up to 8 pages',
    badge: 'MOST POPULAR'
  },
  {
    id: 'growth',
    name: 'Growth Website',
    price: '$999',
    delivery: '7–10 business days',
    pages: 'Up to 12 pages'
  },
  {
    id: 'custom',
    name: 'Custom Website',
    price: 'Starting at $1,499+',
    delivery: '10–15+ business days',
    pages: 'Custom scope'
  }
];

export interface WebsiteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: WebsitePackageInfo | null;
  onPackageChange?: (pkg: WebsitePackageInfo) => void;
  onChangePackageClick?: () => void;
}

const INDUSTRIES = [
  'Transportation & Logistics',
  'Trucking / Freight',
  'Towing & Automotive',
  'Construction',
  'Real Estate & Property',
  'Food & Hospitality',
  'Home & Local Services',
  'Professional & Business Services',
  'Healthcare / Medical',
  'E-commerce',
  'Other'
];

const WEBSITE_GOALS = [
  'Build credibility',
  'Generate enquiries',
  'Generate quote requests',
  'Get more calls',
  'Get more WhatsApp enquiries',
  'Showcase services',
  'Showcase projects / portfolio',
  'Provide information',
  'Sell products online',
  'Support multiple locations',
  'Other'
];

const WEBSITE_PAGES = [
  'Home',
  'About',
  'Services',
  'Contact',
  'FAQ',
  'Gallery',
  'Projects / Portfolio',
  'Reviews / Testimonials',
  'Blog / News',
  'Careers',
  'Locations / Service Areas',
  'Other'
];

const DESIGN_STYLES = [
  'Clean & Professional',
  'Modern & Premium',
  'Corporate',
  'Bold & Creative',
  'Simple & Minimal',
  'Not Sure — Recommend a Direction'
];

const TIMELINE_OPTIONS = [
  'As soon as possible',
  'Within 1–2 weeks',
  'Within 1 month',
  'Flexible'
];

/**
 * Standardize package selection strictly to required WAL GROUPS tiers:
 * Starter → $399
 * Business → $699
 * Growth → $999
 * Custom → Starting at $1,499+
 */
const resolveExactPackage = (pkg?: WebsitePackageInfo | null): WebsitePackageInfo => {
  const id = (pkg?.id || '').toLowerCase();
  const name = (pkg?.name || '').toLowerCase();

  if (id === 'starter' || name.includes('starter')) {
    return {
      id: 'starter',
      name: 'Starter Website',
      price: '$399',
      delivery: '3–5 business days',
      pages: 'Up to 5 pages'
    };
  }
  if (id === 'business' || name.includes('business')) {
    return {
      id: 'business',
      name: 'Business Website',
      price: '$699',
      delivery: '5–7 business days',
      pages: 'Up to 8 pages',
      badge: 'MOST POPULAR'
    };
  }
  if (id === 'growth' || name.includes('growth')) {
    return {
      id: 'growth',
      name: 'Growth Website',
      price: '$999',
      delivery: '7–10 business days',
      pages: 'Up to 15 pages'
    };
  }
  if (id === 'custom' || name.includes('custom')) {
    return {
      id: 'custom',
      name: 'Custom Website',
      price: 'Starting at $1,499+',
      delivery: '10–15+ business days',
      pages: 'Custom scope'
    };
  }
  return {
    id: 'business',
    name: 'Business Website',
    price: '$699',
    delivery: '5–7 business days',
    pages: 'Up to 8 pages',
    badge: 'MOST POPULAR'
  };
};

export const WebsiteProjectModal: React.FC<WebsiteProjectModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  onPackageChange,
  onChangePackageClick
}) => {
  // Current active package inside form (strictly locked to CTA selection)
  const [activePkg, setActivePkg] = useState<WebsitePackageInfo>(() => {
    return resolveExactPackage(selectedPackage);
  });

  // Sync package and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActivePkg(resolveExactPackage(selectedPackage));
      setIsSuccess(false);
      setSubmitError(null);
      setErrors({});
    }
  }, [selectedPackage, isOpen]);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [cityState, setCityState] = useState('');

  const [industry, setIndustry] = useState('');
  const [aboutBusiness, setAboutBusiness] = useState('');

  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Build credibility', 'Generate enquiries']);
  const [selectedPages, setSelectedPages] = useState<string[]>(['Home', 'About', 'Services', 'Contact']);

  const [hasWebsite, setHasWebsite] = useState<'Yes' | 'No'>('No');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasLogo, setHasLogo] = useState<'Yes' | 'No'>('Yes');
  const [hasContent, setHasContent] = useState<'Yes' | 'Some' | 'No'>('Some');

  const [designStyle, setDesignStyle] = useState('Modern & Premium');
  const [inspiration, setInspiration] = useState('');
  const [specificRequirements, setSpecificRequirements] = useState('');

  const [timeline, setTimeline] = useState('Within 1–2 weeks');
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false);

  // UI / Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    projectId: string;
    packageName: string;
    packagePrice: string;
    businessName: string;
    email: string;
    phone: string;
  } | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Format displayed price accurately
  const getDisplayPrice = (pkg: WebsitePackageInfo) => {
    if (pkg.id === 'custom' || pkg.name.toLowerCase().includes('custom')) {
      return pkg.price.includes('Starting at') ? pkg.price : `Starting at ${pkg.price}`;
    }
    return pkg.price;
  };

  const getContinueButtonLabel = () => {
    const id = (activePkg.id || '').toLowerCase();
    const name = (activePkg.name || '').toLowerCase();
    if (id === 'starter' || name.includes('starter')) {
      return 'Continue With Starter — $399';
    }
    if (id === 'business' || name.includes('business')) {
      return 'Continue With Business — $699';
    }
    if (id === 'growth' || name.includes('growth')) {
      return 'Continue With Growth — $999';
    }
    if (id === 'custom' || name.includes('custom')) {
      return 'Continue With Custom — Starting at $1,499+';
    }
    return `Continue With ${activePkg.name} — ${getDisplayPrice(activePkg)}`;
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
    if (errors.goals) {
      setErrors(prev => ({ ...prev, goals: '' }));
    }
  };

  const togglePage = (page: string) => {
    setSelectedPages(prev => 
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!companyName.trim()) {
      newErrors.companyName = 'Business or company name is required';
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone or WhatsApp number is required';
    } else if (cleanPhone.length < 7) {
      newErrors.phone = 'Please enter a valid phone number (minimum 7 digits)';
    }

    if (!country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!industry) {
      newErrors.industry = 'Please select your industry';
    }

    if (!aboutBusiness.trim()) {
      newErrors.aboutBusiness = 'Please tell us briefly about your business';
    } else if (aboutBusiness.trim().length < 15) {
      newErrors.aboutBusiness = 'Please provide a little more detail (at least 15 characters)';
    }

    if (selectedGoals.length === 0) {
      newErrors.goals = 'Please select at least one goal for your website';
    }

    if (hasWebsite === 'Yes' && websiteUrl.trim()) {
      const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
      if (!urlPattern.test(websiteUrl.trim())) {
        newErrors.websiteUrl = 'Please enter a valid website URL (e.g. yourcompany.com)';
      }
    }

    if (!confirmedAccuracy) {
      newErrors.confirmedAccuracy = 'Please confirm that the information provided is accurate';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);

    if (!validate()) {
      // Smooth scroll to top of form to show validation message
      const modalBody = document.getElementById('website-project-form-container');
      if (modalBody) {
        modalBody.scrollTo({ top: 120, behavior: 'smooth' });
      }
      return;
    }

    setIsSubmitting(true);

    const payload = {
      packageName: activePkg.name,
      packagePrice: activePkg.price,
      fullName: fullName.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      country: country.trim(),
      cityState: cityState.trim(),
      industry,
      aboutBusiness: aboutBusiness.trim(),
      goals: selectedGoals,
      pages: selectedPages,
      hasWebsite,
      websiteUrl: hasWebsite === 'Yes' ? websiteUrl.trim() : '',
      hasLogo,
      hasContent,
      designStyle,
      inspiration: inspiration.trim(),
      specificRequirements: specificRequirements.trim(),
      timeline,
      confirmationAccepted: Boolean(confirmedAccuracy)
    };

    try {
      const response = await fetch('/api/website-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedData({
          projectId: result.projectId || `WAL-WEB-${Date.now().toString(36).toUpperCase()}`,
          packageName: activePkg.name,
          packagePrice: activePkg.price,
          businessName: companyName.trim(),
          email: email.trim(),
          phone: phone.trim()
        });
        setIsSuccess(true);
      } else {
        // Strict database error handling: do NOT show fake success message
        setSubmitError("We couldn't submit your request. Please check your information and try again.");
      }
    } catch (err: any) {
      console.error('Project form submission error:', err);
      setSubmitError("We couldn't submit your request. Please check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-heading"
    >
      {/* Fullscreen Backdrop Blur & Tint */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={handleResetAndClose}
        aria-hidden="true"
      />

      {/* Flex container that centers the modal card */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6 relative">
        <div 
          id="website-project-form-container"
          className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#f8fafc] text-slate-800 rounded-2xl sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] border border-slate-200 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sticky Header Bar */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-200/90 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#041e42] text-[#ff8533] flex items-center justify-center font-bold text-sm shadow-xs">
                W
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#ff6600] uppercase tracking-wider block leading-none">
                  WAL GROUPS · WEB SERVICES
                </span>
                <span className="text-sm font-extrabold text-[#041e42]">
                  Website Project Enquiry
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close project form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-5 sm:p-8 space-y-8 overflow-y-auto flex-1">
          
          {isSuccess && submittedData ? (
            /* =========================================================================
                11. AFTER SUBMISSION — CONFIRMATION STATE
               ========================================================================= */
            <div className="py-6 sm:py-10 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-[#ff6600] uppercase tracking-wider">
                  Submission Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#041e42] tracking-tight">
                  Project Request Received
                </h3>
                <p className="text-base font-semibold text-slate-700">
                  Thank you for contacting WAL GROUPS.
                </p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  We’ve received your website project requirements. Our team will review the information provided and contact you using the details you submitted.
                </p>
              </div>

              {/* Submission Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-left space-y-3">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Package:</span>
                  <span className="font-bold text-[#041e42]">
                    {submittedData.packageName} <span className="text-[#ff6600]">({submittedData.packagePrice})</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Business:</span>
                  <span className="font-bold text-[#041e42]">{submittedData.businessName}</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Request ID:</span>
                  <span className="font-mono font-bold text-[#041e42] bg-slate-100 px-2.5 py-0.5 rounded">
                    {submittedData.projectId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleResetAndClose}
                  className="py-3 px-6 rounded-xl bg-[#041e42] hover:bg-[#062c60] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Back to WAL GROUPS</span>
                </button>

                <a
                  href={`https://wa.me/916363698148?text=Hello%20WAL%20GROUPS%20Team%2C%20I%20just%20submitted%20my%20website%20project%20request%20(${submittedData.projectId})%20for%20the%20${encodeURIComponent(submittedData.packageName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-black" />
                  <span>WhatsApp WAL GROUPS</span>
                </a>
              </div>
            </div>
          ) : (
            /* =========================================================================
                THE WEBSITE PROJECT FORM
               ========================================================================= */
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              
              {/* Form Title & Supporting Text */}
              <div className="text-center sm:text-left space-y-1.5 pb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff6600]">
                  WAL GROUPS · WEB SERVICES
                </span>
                <h2 id="form-heading" className="text-2xl sm:text-3xl font-black text-[#041e42] tracking-tight">
                  Let’s Build Your Website
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
                  Tell us a little about your business and what you need from your website.
                </p>
              </div>

              {/* Global Error Banner if any */}
              {submitError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">Submission error</div>
                    <div>{submitError}</div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  SECTION 01 — SELECTED PLAN (Locked to Selected Package)
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Selected Plan
                    </span>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-[#041e42]">
                        {activePkg.name}
                      </h3>
                      {activePkg.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff6600] text-black">
                          {activePkg.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-[#ff6600]">
                        {activePkg.price}
                      </span>
                    </div>

                    <div 
                      className="py-1.5 px-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 select-none"
                      title="Package is locked to your selection"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Plan Locked</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Scope: {activePkg.pages || 'Full package inclusions'} · Timeline: {activePkg.delivery || 'Standard turnaround'}</span>
                  <span className="text-slate-400 text-[10px]">Close dialog to select another tier</span>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 02 — YOUR INFORMATION
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Section 02
                  </span>
                  <h3 className="text-base font-bold text-[#041e42] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#ff6600]" />
                    <span>Your Information</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="e.g. John Miller"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.fullName 
                          ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                          : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-red-500 block">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Business / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        if (errors.companyName) setErrors(prev => ({ ...prev, companyName: '' }));
                      }}
                      placeholder="e.g. Apex Freight Logistics"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.companyName 
                          ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                          : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                      }`}
                    />
                    {errors.companyName && (
                      <span className="text-[11px] text-red-500 block">{errors.companyName}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="name@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.email 
                          ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                          : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-500 block">{errors.email}</span>
                    )}
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Phone / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.phone 
                          ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                          : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-500 block">{errors.phone}</span>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
                      }}
                      placeholder="e.g. United States, Canada, United Kingdom"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.country 
                          ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                          : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                      }`}
                    />
                    {errors.country && (
                      <span className="text-[11px] text-red-500 block">{errors.country}</span>
                    )}
                  </div>

                  {/* City / State */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      City / State
                    </label>
                    <input
                      type="text"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      placeholder="e.g. Dallas, TX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm transition-all focus:outline-none focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20"
                    />
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 03 — ABOUT YOUR BUSINESS
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Section 03
                  </span>
                  <h3 className="text-base font-bold text-[#041e42] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#ff6600]" />
                    <span>About Your Business</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Industry Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={industry}
                        onChange={(e) => {
                          setIndustry(e.target.value);
                          if (errors.industry) setErrors(prev => ({ ...prev, industry: '' }));
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm appearance-none bg-white transition-all focus:outline-none focus:ring-2 pr-10 ${
                          errors.industry 
                            ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                            : 'border-slate-300 focus:border-[#041e42] focus:ring-[#041e42]/20'
                        }`}
                      >
                        <option value="">Select your industry...</option>
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.industry && (
                      <span className="text-[11px] text-red-500 block">{errors.industry}</span>
                    )}
                  </div>

                  {/* Business Description */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Business Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={aboutBusiness}
                      onChange={(e) => {
                        setAboutBusiness(e.target.value);
                        if (errors.aboutBusiness) setErrors(prev => ({ ...prev, aboutBusiness: '' }));
                      }}
                      placeholder="Tell us what your business does, who you serve, and what you would like your website to communicate."
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 leading-relaxed ${
                        errors.aboutBusiness 
                          ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                          : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                      }`}
                    />
                    {errors.aboutBusiness && (
                      <span className="text-[11px] text-red-500 block">{errors.aboutBusiness}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 04 — WEBSITE REQUIREMENTS
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Section 04
                  </span>
                  <h3 className="text-base font-bold text-[#041e42] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#ff6600]" />
                    <span>Website Requirements</span>
                  </h3>
                </div>

                {/* What do you want your website to achieve? */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    What do you want your website to achieve? <span className="text-red-500">*</span> (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {WEBSITE_GOALS.map((goal) => {
                      const isChecked = selectedGoals.includes(goal);
                      return (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => toggleGoal(goal)}
                          className={`py-2 px-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                            isChecked
                              ? 'border-[#ff6600] bg-[#ff6600]/10 text-[#041e42] font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-[#ff6600] border-[#ff6600] text-black' : 'border-slate-400 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{goal}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.goals && (
                    <span className="text-[11px] text-red-500 block">{errors.goals}</span>
                  )}
                </div>

                {/* What pages do you need? */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 block">
                    What pages do you need? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {WEBSITE_PAGES.map((pg) => {
                      const isChecked = selectedPages.includes(pg);
                      return (
                        <button
                          key={pg}
                          type="button"
                          onClick={() => togglePage(pg)}
                          className={`py-2 px-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                            isChecked
                              ? 'border-[#041e42] bg-[#041e42]/5 text-[#041e42] font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                            isChecked ? 'bg-[#041e42] border-[#041e42] text-white' : 'border-slate-400 bg-white'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="truncate">{pg}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 05 — EXISTING WEBSITE
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Section 05
                  </span>
                  <h3 className="text-base font-bold text-[#041e42] flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-[#ff6600]" />
                    <span>Existing Website</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Do you currently have a website? */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Do you currently have a website?
                    </label>
                    <div className="flex gap-3">
                      {(['Yes', 'No'] as const).map((opt) => (
                        <label
                          key={opt}
                          className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                            hasWebsite === opt
                              ? 'border-[#ff6600] bg-[#ff6600]/10 text-[#041e42]'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasWebsite"
                            value={opt}
                            checked={hasWebsite === opt}
                            onChange={() => setHasWebsite(opt)}
                            className="sr-only"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* If Yes: Reveal Current Website URL */}
                  {hasWebsite === 'Yes' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1 pt-1"
                    >
                      <label className="text-xs font-bold text-slate-700 block">
                        Current Website URL
                      </label>
                      <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => {
                          setWebsiteUrl(e.target.value);
                          if (errors.websiteUrl) setErrors(prev => ({ ...prev, websiteUrl: '' }));
                        }}
                        placeholder="https://example.com"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.websiteUrl 
                            ? 'border-red-400 bg-red-50/40 focus:ring-red-300' 
                            : 'border-slate-300 bg-white focus:border-[#041e42] focus:ring-[#041e42]/20'
                        }`}
                      />
                      {errors.websiteUrl && (
                        <span className="text-[11px] text-red-500 block">{errors.websiteUrl}</span>
                      )}
                    </motion.div>
                  )}

                  {/* Do you already have a business logo? */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 block">
                      Do you have a logo?
                    </label>
                    <div className="flex gap-3">
                      {(['Yes', 'No'] as const).map((opt) => (
                        <label
                          key={opt}
                          className={`flex-1 py-2 px-4 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                            hasLogo === opt
                              ? 'border-[#ff6600] bg-[#ff6600]/10 text-[#041e42]'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasLogo"
                            value={opt}
                            checked={hasLogo === opt}
                            onChange={() => setHasLogo(opt)}
                            className="sr-only"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Do you already have photos, videos or written content? */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 block">
                      Do you have photos/content?
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {(['Yes', 'Some', 'No'] as const).map((opt) => (
                        <label
                          key={opt}
                          className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                            hasContent === opt
                              ? 'border-[#ff6600] bg-[#ff6600]/10 text-[#041e42]'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasContent"
                            value={opt}
                            checked={hasContent === opt}
                            onChange={() => setHasContent(opt)}
                            className="sr-only"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 06 — DESIGN
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Section 06
                  </span>
                  <h3 className="text-base font-bold text-[#041e42] flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-[#ff6600]" />
                    <span>Design</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Preferred Website Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Preferred Website Style
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DESIGN_STYLES.map((style) => (
                        <label
                          key={style}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2 ${
                            designStyle === style
                              ? 'border-[#041e42] bg-[#041e42]/5 text-[#041e42] font-bold ring-1 ring-[#041e42]'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="designStyle"
                            value={style}
                            checked={designStyle === style}
                            onChange={() => setDesignStyle(style)}
                            className="sr-only"
                          />
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            designStyle === style ? 'border-[#041e42] bg-[#041e42]' : 'border-slate-400 bg-white'
                          }`}>
                            {designStyle === style && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Website inspiration */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 block">
                      Website Inspiration (Optional)
                    </label>
                    <input
                      type="text"
                      value={inspiration}
                      onChange={(e) => setInspiration(e.target.value)}
                      placeholder="Paste links to websites you like, if you have any."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm transition-all focus:outline-none focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20"
                    />
                  </div>

                  {/* Additional Requirements */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Additional Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specificRequirements}
                      onChange={(e) => setSpecificRequirements(e.target.value)}
                      placeholder="Special features, specific integrations, custom forms, or other details..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm transition-all focus:outline-none focus:border-[#041e42] focus:ring-2 focus:ring-[#041e42]/20"
                    />
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 07 — TIMELINE
                  ========================================================================= */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Section 07
                  </span>
                  <h3 className="text-base font-bold text-[#041e42] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#ff6600]" />
                    <span>Timeline</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">
                    When would you like to get started?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIMELINE_OPTIONS.map((timeOpt) => (
                      <label
                        key={timeOpt}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 text-center ${
                          timeline === timeOpt
                            ? 'border-[#ff6600] bg-[#ff6600]/10 text-[#041e42]'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="timeline"
                          value={timeOpt}
                          checked={timeline === timeOpt}
                          onChange={() => setTimeline(timeOpt)}
                          className="sr-only"
                        />
                        <span>{timeOpt}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1">
                    Note: Production schedules depend on package scope and prompt asset provision. WAL GROUPS coordinates project milestones upon onboarding.
                  </p>
                </div>
              </div>

              {/* =========================================================================
                  SECTION 08 — CONFIRMATION & SUBMIT
                  ========================================================================= */}
              <div className="bg-slate-100/80 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedAccuracy}
                    onChange={(e) => {
                      setConfirmedAccuracy(e.target.checked);
                      if (errors.confirmedAccuracy) {
                        setErrors(prev => ({ ...prev, confirmedAccuracy: '' }));
                      }
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-[#ff6600] focus:ring-[#ff6600] border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                    I confirm that the information provided is accurate and I would like WAL GROUPS to review my website project requirements. <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.confirmedAccuracy && (
                  <span className="text-[11px] text-red-500 block">{errors.confirmedAccuracy}</span>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#ff6600] hover:bg-[#e65c00] active:scale-[0.99] text-black font-extrabold text-sm sm:text-base transition-all shadow-[0_4px_20px_rgba(255,102,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,102,0,0.45)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Request</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>No spam guarantee</span>
                  </span>
                  <span>·</span>
                  <span>100% Client Ownership</span>
                  <span>·</span>
                  <span>Review response within 24h</span>
                </div>
              </div>

            </form>
          )}

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
