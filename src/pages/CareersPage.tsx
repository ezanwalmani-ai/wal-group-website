import React, { useState, useRef } from 'react';
import { JobApplication } from '../types';
import { EmailLink } from '../components/EmailLink';
import { TextRoll } from '@/components/core/text-roll';
import { 
  CheckCircle2, 
  Upload, 
  ArrowLeft, 
  Briefcase, 
  FileText, 
  AlertCircle,
  Loader2,
  User,
  X
} from 'lucide-react';
import { saveJobApplicationToSupabase, uploadResumeToSupabaseStorage } from '../lib/supabase';

interface Props {
  navigate: (path: string) => void;
}

export const CareersPage: React.FC<Props> = ({ navigate }) => {
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    position: 'Dispatch Support Specialist',
    experienceYears: '3',
    currentCompany: '',
    noticePeriod: 'Immediately available',
    expectedSalary: '',
    coverLetter: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('Resume file size must be less than 10MB.');
        return;
      }
      setSelectedFile(file);
      setSubmitError('');
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.expectedSalary.trim()) {
      setSubmitError('Please complete all required fields.');
      return;
    }

    if (!selectedFile) {
      setSubmitError('Please attach your resume file (PDF, DOC, DOCX up to 10MB).');
      return;
    }

    setSubmitError('');
    setUploading(true);

    let resumeUrl = '';
    const resumeFileName = selectedFile.name;

    // 1. Handle resume file upload
    try {
      const uploadRes = await uploadResumeToSupabaseStorage(selectedFile);
      if (!uploadRes.success) {
        setSubmitError(uploadRes.error || 'Failed to upload resume file.');
        setUploading(false);
        return;
      }
      resumeUrl = uploadRes.url || '';
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setSubmitError('Failed to upload resume. Please try again.');
      setUploading(false);
      return;
    }

    const appId = `WM-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowISO = new Date().toISOString();

    const app: JobApplication = {
      id: appId,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      linkedinUrl: formData.linkedinUrl,
      position: formData.position,
      experienceYears: parseInt(formData.experienceYears) || 0,
      currentCompany: formData.currentCompany,
      noticePeriod: formData.noticePeriod,
      expectedSalary: formData.expectedSalary,
      resumeFileName,
      coverLetter: formData.coverLetter,
      appliedAt: nowISO,
      status: 'New'
    };

    try {
      // 2. Save directly to Supabase job_applications table
      const res = await saveJobApplicationToSupabase({
        ...app,
        resumeUrl
      });

      if (!res.success) {
        setSubmitError(res.error || 'Failed to submit job application to database. Please check your connection and try again.');
        setUploading(false);
        return;
      }

      // Save to local storage for quick user review
      const existing = JSON.parse(localStorage.getItem('wal_groups_careers') || localStorage.getItem('walmani_careers') || '[]');
      existing.unshift(app);
      localStorage.setItem('wal_groups_careers', JSON.stringify(existing));

      // Trigger backend server route for email notifications
      fetch('/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...app,
          resumeUrl
        })
      }).catch((err) => console.error('Server email trigger error:', err));

      setSubmittedApp(app);
    } catch (err: any) {
      console.error('Supabase career app save error:', err);
      setSubmitError(err?.message || 'An unexpected error occurred while saving your application.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="font-sans text-slate-100 bg-[#0a0a0a]">
      {/* Hero */}
      <section className="bg-[#050505] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,119,0,0.12),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-[#ff7700]/10 text-[#ff7700] border border-[#ff7700]/30 text-xs font-bold uppercase tracking-wider">
            Join Our Operational Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            <TextRoll className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Build Your Career with Wal Group
            </TextRoll>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Remote-first culture, competitive compensation, continuous learning, and direct exposure to US logistics and corporate clients.
          </p>
        </div>
      </section>

      {/* Main Content & Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Back to Home Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7700] hover:text-[#ff9900] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-xs text-slate-400 font-semibold">Remote &amp; Hybrid Positions Available</span>
          </div>

          {/* Culture Overview */}
          <div className="bg-[#0a0a0f] p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-white">Why Work With Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                <div className="font-bold text-[#ff7700] text-sm">Remote-First Flexibility</div>
                <div className="mt-1 text-slate-400">Work from anywhere with flexible scheduling, high-speed equipment allowance, and supportive leadership.</div>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                <div className="font-bold text-[#ff7700] text-sm">US Client Exposure</div>
                <div className="mt-1 text-slate-400">Gain hands-on expertise with Amazon DSP, Amazon Relay, QuickBooks, ADP, and enterprise BPO systems.</div>
              </div>
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10">
                <div className="font-bold text-[#ff7700] text-sm">Rapid Career Growth</div>
                <div className="mt-1 text-slate-400">Quarterly performance reviews, skill certification stipends, and fast-track leadership promotions.</div>
              </div>
            </div>

            {/* Recruitment Email */}
            <div className="pt-2">
              <EmailLink email="thewalgroups@gmail.com" label="Direct HR &amp; Careers Desk" />
            </div>
          </div>

          {/* Standard Application Form */}
          <div className="bg-[#0a0a0f] p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8">
            {!submittedApp ? (
              <form onSubmit={handleApplicationSubmit} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#ff7700]" />
                    Job Application Form
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out your profile details below. Our recruitment team reviews candidate applications within 5–7 business days.
                  </p>
                </div>

                {submitError && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Section 1: Personal Details */}
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-[#ff7700]" />
                    1. Applicant Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Full Name <span className="text-[#ff7700]">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Priya Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Email Address <span className="text-[#ff7700]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. priya.sharma@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Direct Phone Number <span className="text-[#ff7700]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Current Location / City
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bengaluru, Karnataka"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    />
                  </div>
                </div>

                {/* Section 2: Position & Experience */}
                <div className="space-y-4 border-b border-white/10 pb-6">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#ff7700]" />
                    2. Position &amp; Professional Experience
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Target Position <span className="text-[#ff7700]">*</span>
                      </label>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      >
                        <option value="Dispatch Support Specialist">Dispatch Support Specialist</option>
                        <option value="Accounting & Payroll Specialist">Accounting &amp; Payroll Specialist</option>
                        <option value="HR Recruitment Specialist">HR Recruitment Specialist</option>
                        <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                        <option value="Website Developer">Website Developer</option>
                        <option value="Virtual Assistant">Virtual Assistant</option>
                        <option value="Team Lead">Operations Team Lead</option>
                        <option value="Operations Manager">Operations Manager</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Relevant Experience <span className="text-[#ff7700]">*</span>
                      </label>
                      <select
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      >
                        <option value="1">0 – 1 Years (Entry Level / Fresh Graduate)</option>
                        <option value="3">2 – 3 Years (Associate / Experienced)</option>
                        <option value="5">4 – 6 Years (Mid-Senior / Specialist)</option>
                        <option value="8">7+ Years (Senior Lead / Managerial)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Current Company / Employer
                      </label>
                      <input
                        type="text"
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="e.g. Amazon / Genpact / Freelance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Notice Period <span className="text-[#ff7700]">*</span>
                      </label>
                      <select
                        name="noticePeriod"
                        value={formData.noticePeriod}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#141414] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                      >
                        <option value="Immediately available">Immediately Available</option>
                        <option value="15 days">15 Days Notice</option>
                        <option value="30 days">30 Days Notice</option>
                        <option value="45 days">45 Days Notice</option>
                        <option value="60+ days">60+ Days Notice</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Expected Annual Compensation (CTC) <span className="text-[#ff7700]">*</span>
                    </label>
                    <input
                      type="text"
                      name="expectedSalary"
                      required
                      value={formData.expectedSalary}
                      onChange={handleChange}
                      placeholder="e.g. ₹ 6,00,000 PA / $35,000 USD"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors"
                    />
                  </div>
                </div>

                {/* Section 3: Resume & Notes */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ff7700]" />
                    3. Resume &amp; Candidate Notes
                  </h4>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Upload Resume / CV (PDF, DOC, DOCX up to 10MB) <span className="text-[#ff7700]">*</span>
                    </label>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-[#ff7700]/50 text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-5 h-5 text-[#ff7700]" />
                          <div>
                            <span className="font-bold text-white block">{selectedFile.name}</span>
                            <span className="text-slate-400 text-[11px]">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-[#ff7700] rounded-xl p-6 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
                      >
                        <Upload className="w-8 h-8 text-[#ff7700] mx-auto mb-2" />
                        <p className="text-xs font-bold text-white">Click to browse or drag and drop your resume here</p>
                        <p className="text-[11px] text-slate-500 mt-1">Accepted: PDF, DOC, DOCX (Max 10MB)</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Cover Letter or Note to Hiring Manager
                    </label>
                    <textarea
                      name="coverLetter"
                      rows={4}
                      value={formData.coverLetter}
                      onChange={handleChange}
                      placeholder="Highlight relevant logistics software experience, certifications, or night-shift availability..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ff7700] transition-colors resize-y"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#ff8800] to-[#ff5500] hover:from-[#ff9911] hover:to-[#ff6611] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,119,0,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Application &amp; Uploading Resume...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Submit Job Application</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2.5">
                    Wal Group is an Equal Opportunity Employer. All candidate information is encrypted and treated with strict confidentiality.
                  </p>
                </div>
              </form>
            ) : (
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h4 className="text-2xl font-bold text-white">Application Submitted Successfully!</h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <span className="text-white font-bold">{submittedApp.fullName}</span>. Your application for <span className="text-[#ff7700] font-bold">{submittedApp.position}</span> has been dispatched to our recruitment directors.
                </p>
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 inline-block text-left text-xs space-y-1.5">
                  <div><strong className="text-slate-400">Reference ID:</strong> <span className="text-[#ff7700] font-mono font-bold">{submittedApp.id}</span></div>
                  <div><strong className="text-slate-400">Position:</strong> <span className="text-white">{submittedApp.position}</span></div>
                  <div><strong className="text-slate-400">Applicant:</strong> <span className="text-white">{submittedApp.fullName} ({submittedApp.email})</span></div>
                </div>
                <div className="pt-3">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-[#ff7700] hover:bg-[#ff8800] text-black text-xs font-extrabold py-3 px-6 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
