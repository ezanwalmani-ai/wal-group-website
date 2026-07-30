import React from 'react';

interface Props {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<Props> = () => {
  return (
    <div className="font-sans text-slate-800 bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-[#2271B1] uppercase tracking-wider block mb-1">Data Governance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A2647]">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-2">Effective Date: July 24, 2026 | Wal Group</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">1. Introduction</h2>
            <p>At Wal Group, we prioritize protecting personal data and corporate telemetry. This policy explains how we collect, store, and process data for clients, job applicants, and website visitors.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">2. Information We Collect</h2>
            <p><strong>Personal Data:</strong> Names, business emails, phone numbers, corporate addresses.<br />
            <strong>Applicant Data:</strong> Resumes, employment histories, certifications, salary expectations.<br />
            <strong>Support Telemetry:</strong> Support tickets, timecard exception records, and operational inquiries.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">3. How We Collect Information</h2>
            <p>We collect information directly submitted via contact forms, job applications, support ticket filings, and through automated web analytics cookies.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">4. How We Use Information</h2>
            <p>Information is used exclusively to deliver dispatch support, process payroll, facilitate driver recruitment via AI voicebots, process job applications, and fulfill support tickets.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">5. Information Sharing</h2>
            <p>We do not sell personal data. Data is shared with client-authorized integrations (e.g. ADP, SmartRecruiters, QuickBooks) strictly for operational fulfillment.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">6. Data Security</h2>
            <p>We implement AES-256 encryption for data at rest and TLS 1.3 for data in transit, alongside strict role-based access control (RBAC) across all support shifts.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">7. Data Retention</h2>
            <p>Driver and candidate files are retained in compliance with Amazon requirements or applicable local labor statutory periods.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">8. Your Rights</h2>
            <p>You have the right to request access to your personal data, request correction of inaccuracies, or request deletion of job application data.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">9. Cookies and Tracking</h2>
            <p>Our site uses essential cookies to manage routing, form sessions, and security verification.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">10. Children's Privacy</h2>
            <p>Our website and services are intended exclusively for commercial entities and individuals aged 18 and older.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">11. International Data Transfers</h2>
            <p>Information processed by our teams in India adheres to strict EU-US Privacy Shield and GDPR-aligned data processor standards.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">12. Changes to Privacy Policy</h2>
            <p>Any updates to this policy will be published on this page with an updated effective date.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">13. Contact Information</h2>
            <p>For privacy and data governance inquiries, contact <a href="mailto:thewalgroupinfo@gmail.com" className="text-[#2271B1] underline font-medium">thewalgroupinfo@gmail.com</a> or <a href="mailto:thewalgroup@gmail.com" className="text-[#2271B1] underline font-medium">thewalgroup@gmail.com</a> or write to: 55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038, India.</p>
          </section>

        </div>

      </div>
    </div>
  );
};
