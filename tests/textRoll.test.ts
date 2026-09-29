import { describe, it, expect } from 'vitest';
import { TextRoll } from '../src/components/core/text-roll';
import { TextRoll as TextRollRoot } from '../components/core/text-roll';
import fs from 'fs';
import path from 'path';

describe('TextRoll Component & WAL GROUPS Headline Integration', () => {
  it('should export TextRoll component properly from src/components/core/text-roll', () => {
    expect(TextRoll).toBeDefined();
    expect(typeof TextRoll).toBe('function');
  });

  it('should export TextRoll component properly from root components/core/text-roll', () => {
    expect(TextRollRoot).toBeDefined();
    expect(typeof TextRollRoot).toBe('function');
    expect(TextRollRoot).toBe(TextRoll);
  });

  const pagesToVerify = [
    {
      file: 'HomePage.tsx',
      headline: 'We Run the Backend. So You Can Run the Business.'
    },
    {
      file: 'AboutPage.tsx',
      headline: 'Relationships First. Business Follows.'
    },
    {
      file: 'ServicesOverviewPage.tsx',
      headline: 'Comprehensive Operational Solutions'
    },
    {
      file: 'WebsiteDesignPage.tsx',
      headline: 'Professional websites built around your business.'
    },
    {
      file: 'DspDispatchPage.tsx',
      headline: 'DSP Dispatch Support Services'
    },
    {
      file: 'DspAccountingPage.tsx',
      headline: 'DSP Accounting &amp; Payroll Services'
    },
    {
      file: 'DspHrPage.tsx',
      headline: 'DSP HR &amp; Recruitment Services'
    },
    {
      file: 'AfpDispatchPage.tsx',
      headline: 'AFP Dispatch Support Services'
    },
    {
      file: 'AfpAccountingPage.tsx',
      headline: 'AFP Accounting &amp; TMS Management'
    },
    {
      file: 'DedicatedLanePage.tsx',
      headline: 'Dedicated Lane Services'
    },
    {
      file: 'HrBpoPage.tsx',
      headline: 'HR BPO Services'
    },
    {
      file: 'VirtualAssistantsPage.tsx',
      headline: 'Virtual Assistants'
    },
    {
      file: 'DigitalMarketingPage.tsx',
      headline: 'Content-Driven Digital Marketing'
    },
    {
      file: 'GigProjectsPage.tsx',
      headline: 'Gig Projects for DSPs &amp; Trucking Companies'
    },
    {
      file: 'SuccessStoriesPage.tsx',
      headline: 'Client Success Stories'
    },
    {
      file: 'CareersPage.tsx',
      headline: 'Build Your Career with Wal Group'
    },
    {
      file: 'ContactPage.tsx',
      headline: 'Contact Us'
    },
    {
      file: 'RaiseTicketPage.tsx',
      headline: 'Welcome to the Support Center'
    },
    {
      file: 'TermsPage.tsx',
      headline: 'Terms &amp; Conditions'
    },
    {
      file: 'PrivacyPage.tsx',
      headline: 'Privacy Policy'
    }
  ];

  pagesToVerify.forEach(({ file, headline }) => {
    it(`should verify ${file} imports and uses TextRoll for headline "${headline}"`, () => {
      const code = fs.readFileSync(path.resolve(__dirname, `../src/pages/${file}`), 'utf-8');
      
      // Verify import
      expect(code).toMatch(/import\s+{.*TextRoll.*}\s+from\s+['"]@\/components\/core\/text-roll['"]/);
      
      // Verify usage with headline text
      expect(code).toContain(headline);
      expect(code).toContain('<TextRoll');
      
      // Verify no placeholder text
      expect(code).not.toContain('motion-primitives');
    });
  });

  it('should verify AdminLoginPage uses TextRoll for Administrator Login headline', () => {
    const code = fs.readFileSync(path.resolve(__dirname, '../src/pages/admin/AdminLoginPage.tsx'), 'utf-8');
    expect(code).toMatch(/import\s+{.*TextRoll.*}\s+from\s+['"]@\/components\/core\/text-roll['"]/);
    expect(code).toContain('Administrator Login');
    expect(code).toContain('<TextRoll');
  });
});
