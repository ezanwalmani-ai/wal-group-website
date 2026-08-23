import React, { useState } from 'react';
import { JobApplication } from '../types';
import { EmailLink } from '../components/EmailLink';
import { Users, CheckCircle2, Upload, Send, ArrowLeft, Briefcase, FileText, Globe, Mail, Loader2, AlertCircle } from 'lucide-react';
import { saveJobApplicationToSupabase, uploadResumeToSupabaseStorage } from '../lib/supabase';

interface Props {
  navigate: (path: string) => void;
}

export const CareersPage: React.FC<Props> = ({ navigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [position, setPosition] = useState('Dispatch Support Specialist');
  const [experienceYears, setExperienceYears] = useState('3');
  const [currentCompany, setCurrentCompany] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('Immediately available');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [submittedApp, setSubmittedApp] = useState<JobApplication | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    if (!fullName || !email || !phone || !position || !expectedSalary) return;

    setFileError('');
    setSubmitError('');
    setUploading(true);

    let resumeUrl = '';
    let resumeFileName = resumeFile ? resumeFile.name : 'Resume.pdf';

    // 1. Handle resume file upload if provided
    if (resumeFile) {
      const uploadRes = await uploadResumeToSupabaseStorage(resumeFile);
      if (!uploadRes.success) {
        setFileError(uploadRes.error || 'Failed to upload resume file.');
        setUploading(false);
        return;
      }
      resumeUrl = uploadRes.url || '';
    }

    const appId = `WM-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowISO = new Date().toISOString();

    const app: JobApplication = {
      id: appId,
      fullName,
      email,
      phone,
      location,
      linkedinUrl,
      position,
      experienceYears: parseInt(experienceYears) || 0,
      currentCompany,
      noticePeriod,
      expectedSalary,
      resumeFileName,
      coverLetter,
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
    <div className="font-sans text-slate-800 bg-white">
      {/* Hero */}
      <section className="bg-[#0A2647] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            Join Our Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Build Your Career with Wal Group</h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Remote-first culture, continuous learning, and direct exposure to US logistics and corporate clients.
          </p>
        </div>
      </section>

      {/* Main Content & Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Back to Home Button */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#2271B1] hover:text-[#1B5A8C]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <span className="text-xs text-slate-500 font-semibold">Remote Positions Available Across India</span>
          </div>

          {/* Culture Overview */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold text-[#0A2647]">Why Work With Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-[#0A2647] text-sm">Remote-First Flexibility</div>
                <div className="mt-1">Work from anywhere in India with flexible scheduling and supportive leadership.</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-[#0A2647] text-sm">US Client Exposure</div>
                <div className="mt-1">Gain hands-on expertise with Amazon DSP, AFP, and international BPO operations.</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-[#0A2647] text-sm">Career Growth</div>
                <div className="mt-1">Regular performance reviews, skill certification support, and leadership mobility.</div>
              </div>
            </div>

            {/* General Recruitment Email Banner */}
            <div className="pt-2">
              <EmailLink email="thewalgroup@gmail.com" label="General Enquiries, Careers & Recruitment" />
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-extrabold text-[#0A2647]">Job Application Form</h3>
              <p className="text-xs text-slate-500 mt-1">Please complete all required fields (*). Our HR team reviews applications within 5-7 business days.</p>
            </div>

            {submittedApp ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-2xl font-bold text-emerald-900">Application Submitted Successfully!</h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Thank you, {submittedApp.fullName}. Your application for {submittedApp.position} has been received.
                </p>
                <div className="bg-white p-4 rounded-lg border border-emerald-200 inline-block text-left text-xs space-y-1">
                  <div><strong>Reference ID:</strong> {submittedApp.id}</div>
                  <div><strong>Position:</strong> {submittedApp.position}</div>
                  <div><strong>Applied Date:</strong> {submittedApp.appliedAt}</div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-[#0A2647] text-white text-xs font-bold py-2.5 px-6 rounded-lg"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2.5 font-medium">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                
                {/* Section 1 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#0A2647] uppercase tracking-wider border-b border-slate-100 pb-2">1. Personal Information</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Current Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                    />
                  </div>
                </div>

                {/* Section 2 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#0A2647] uppercase tracking-wider border-b border-slate-100 pb-2">2. Professional Details</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Position Applying For <span className="text-red-500">*</span></label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1] bg-white"
                      >
                        <option value="Dispatch Support Specialist">Dispatch Support Specialist</option>
                        <option value="Accounting & Payroll Specialist">Accounting &amp; Payroll Specialist</option>
                        <option value="HR Recruitment Specialist">HR Recruitment Specialist</option>
                        <option value="Digital Marketing Specialist">Digital Marketing Specialist</option>
                        <option value="Website Developer">Website Developer</option>
                        <option value="Virtual Assistant">Virtual Assistant</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Notice Period <span className="text-red-500">*</span></label>
                      <select
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1] bg-white"
                      >
                        <option value="Immediately available">Immediately available</option>
                        <option value="15 days">15 days</option>
                        <option value="30 days">30 days</option>
                        <option value="45 days">45 days</option>
                        <option value="60 days">60 days</option>
                        <option value="90 days">90 days</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expected Salary (Per Annum) <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(e.target.value)}
                        placeholder="e.g. ₹ 6,00,000 PA"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#0A2647] uppercase tracking-wider border-b border-slate-100 pb-2">3. Resume Upload</h4>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attach Resume (PDF, DOC, DOCX up to 10MB) <span className="text-red-500">*</span></label>
                  
                  {fileError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center text-center transition-colors">
                    <Upload className="w-8 h-8 text-[#2271B1] mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      {resumeFile ? resumeFile.name : 'Click or Drag File to Upload Resume'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">Accepted formats: PDF, DOC, DOCX (Max 10 MB)</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setResumeFile(e.target.files[0]);
                          setFileError('');
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Cover Letter / Why Join Us?</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us about yourself, your career goals, and why you are interested in joining Wal Group..."
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2271B1]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-[#0A2647] hover:bg-[#051A30] text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                      <span>Uploading Resume & Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
