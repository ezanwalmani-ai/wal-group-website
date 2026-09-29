import React from 'react';
import { TextRoll } from '@/components/core/text-roll';

interface Props {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<Props> = () => {
  return (
    <div className="font-sans text-slate-800 bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-bold text-[#2271B1] uppercase tracking-wider block mb-1">Legal Agreements</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A2647]">
            <TextRoll className="text-3xl sm:text-4xl font-extrabold text-[#0A2647] dark:text-white">
              Terms &amp; Conditions
            </TextRoll>
          </h1>
          <p className="text-xs text-slate-500 mt-2">Effective Date: July 24, 2026 | Wal Group</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">1. Introduction and Acceptance</h2>
            <p>Welcome to Wal Group. By accessing our website or engaging our backend operations, outsourcing, dispatch, accounting, or digital marketing services, you enter into a binding legal agreement with Wal Group. If you do not accept these terms, you must refrain from using our services.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">2. Definitions</h2>
            <p><strong>"Company", "We", "Us"</strong> refers to Wal Group.<br />
            <strong>"Client", "You"</strong> refers to the business, Amazon DSP, Amazon Freight Partner, or individual entering into service agreements with us.<br />
            <strong>"Services"</strong> refers to dispatch support, accounting &amp; payroll, recruitment, BPO, website design, or digital marketing provided by Wal Group.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">3. Services Description</h2>
            <p>Wal Group provides specialized operational and outsourcing support to Amazon DSPs, Amazon Freight Partners, and corporate entities. Detailed scope, deliverables, service level agreements (SLAs), and fees are governed by individual Master Service Agreements (MSAs) or Statement of Work (SOW) contracts.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">4. User Obligations</h2>
            <p>Clients are required to provide accurate operational data, software authorization keys (where appropriate for Netradyne, Cortex, Relay, or SmartRecruiters), and maintain compliance with local labor and logistics laws.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">5. Intellectual Property Rights</h2>
            <p>All proprietary workflows, AI voicebot conversation scripts, software templates, and website designs developed by Wal Group remain our intellectual property until full contractual settlement.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">6. Payment Terms</h2>
            <p>Service fees are billed on weekly or monthly schedules as outlined in your SOW. Payment terms are strictly net-15 unless otherwise agreed upon in writing.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">7. Confidentiality</h2>
            <p>Both parties agree to protect all non-public proprietary information, driver records, financial ledgers, and Amazon scorecard metrics with strict confidentiality standards.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">8. Limitation of Liability</h2>
            <p>Wal Group shall not be held liable for indirect, incidental, or consequential damages arising from driver roadside incidents, third-party platform downtime (e.g. Amazon portal outages), or carrier contract terminations beyond our direct operational control.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">9. Indemnification</h2>
            <p>The client agrees to defend and indemnify Wal Group against third-party claims resulting from client breach of regulatory mandates or safety guidelines.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">10. Termination</h2>
            <p>Either party may terminate standard operational engagements with 30 days written notice unless specific gig project terms state otherwise.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">11. Governing Law</h2>
            <p>These terms are governed by the laws of Karnataka, India, with exclusive jurisdiction in Bengaluru courts for legal proceedings.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">12. Changes to Terms</h2>
            <p>We reserve the right to modify these terms. Continued use of our platform constitutes acceptance of updated terms.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#0A2647]">13. Contact Information</h2>
            <p>For legal and contractual inquiries, contact <a href="mailto:thewalgroupinfo@gmail.com" className="text-[#2271B1] underline font-medium">thewalgroupinfo@gmail.com</a> or <a href="mailto:thewalgroup@gmail.com" className="text-[#2271B1] underline font-medium">thewalgroup@gmail.com</a> or write to our Corporate Headquarters: 55, 100 Feet Road, HAL 2nd Stage, Indiranagar 12th Main, Bengaluru, Karnataka 560038, India.</p>
          </section>

        </div>

      </div>
    </div>
  );
};
