import { describe, it, expect } from 'vitest';
import { saveWebsiteProjectRequestToSupabase } from '../src/lib/supabase';

describe('Website Project Requests Simulation & Validation', () => {
  const packages = [
    { name: 'Starter Website Package', price: '$399' },
    { name: 'Business Website Package', price: '$699' },
    { name: 'Growth Website Package', price: '$999' },
    { name: 'Custom Website Package', price: 'Starting at $1,499+' }
  ];

  packages.forEach(pkg => {
    it(`should successfully process and save ${pkg.name} (${pkg.price})`, async () => {
      const testId = `VITEST-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

      const res = await saveWebsiteProjectRequestToSupabase({
        id: testId,
        package_name: pkg.name,
        package_price: pkg.price,
        full_name: 'Test Client',
        business_name: 'Test Carrier Logistics LLC',
        email: 'test.client@example-logistics.com',
        phone: '+1 555-0100',
        country: 'United States',
        city_state: 'Atlanta, GA',
        industry: 'Freight & Fleet Management',
        business_description: 'Full truckload refrigerated and dry van carrier with regional delivery.',
        website_goals: ['Generate New Business Leads', 'Establish Professional Digital Presence'],
        required_pages: ['Home', 'Services', 'Contact'],
        has_existing_website: false,
        has_logo: 'Yes',
        has_content: 'Yes',
        design_style: 'Clean & Professional',
        project_timeline: '1-2 weeks',
        confirmation_accepted: true,
        status: 'New'
      });

      expect(res.success).toBe(true);
      expect(res.projectId).toBeDefined();
      expect(typeof res.projectId).toBe('string');
    });
  });

  describe('Validation Guards for Incomplete Data', () => {
    function validateForm(data: any) {
      const errors: string[] = [];
      if (!data.fullName || !data.fullName.trim()) errors.push('fullName required');
      if (!data.companyName || !data.companyName.trim()) errors.push('companyName required');
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('valid email required');
      if (!data.phone || data.phone.replace(/\D/g, '').length < 7) errors.push('phone required');
      if (!data.country || !data.country.trim()) errors.push('country required');
      if (!data.industry || !data.industry.trim()) errors.push('industry required');
      if (!data.aboutBusiness || data.aboutBusiness.trim().length < 15) errors.push('aboutBusiness required');
      if (!Array.isArray(data.goals) || data.goals.length === 0) errors.push('goals required');
      if (!data.confirmationAccepted) errors.push('confirmationAccepted required');
      return errors;
    }

    it('should catch missing Full Name', () => {
      const errors = validateForm({
        fullName: '',
        companyName: 'Acme',
        email: 'a@b.com',
        phone: '5551234567',
        country: 'US',
        industry: 'Logistics',
        aboutBusiness: 'We provide logistics services for heavy freight across the Midwest.',
        goals: ['Leads'],
        confirmationAccepted: true
      });
      expect(errors).toContain('fullName required');
    });

    it('should catch missing Company Name', () => {
      const errors = validateForm({
        fullName: 'John',
        companyName: '   ',
        email: 'a@b.com',
        phone: '5551234567',
        country: 'US',
        industry: 'Logistics',
        aboutBusiness: 'We provide logistics services for heavy freight across the Midwest.',
        goals: ['Leads'],
        confirmationAccepted: true
      });
      expect(errors).toContain('companyName required');
    });

    it('should catch invalid Email address', () => {
      const errors = validateForm({
        fullName: 'John',
        companyName: 'Acme',
        email: 'invalid-email',
        phone: '5551234567',
        country: 'US',
        industry: 'Logistics',
        aboutBusiness: 'We provide logistics services for heavy freight across the Midwest.',
        goals: ['Leads'],
        confirmationAccepted: true
      });
      expect(errors).toContain('valid email required');
    });

    it('should catch too short or missing Phone Number', () => {
      const errors = validateForm({
        fullName: 'John',
        companyName: 'Acme',
        email: 'a@b.com',
        phone: '123',
        country: 'US',
        industry: 'Logistics',
        aboutBusiness: 'We provide logistics services for heavy freight across the Midwest.',
        goals: ['Leads'],
        confirmationAccepted: true
      });
      expect(errors).toContain('phone required');
    });

    it('should catch empty website goals selection', () => {
      const errors = validateForm({
        fullName: 'John',
        companyName: 'Acme',
        email: 'a@b.com',
        phone: '5551234567',
        country: 'US',
        industry: 'Logistics',
        aboutBusiness: 'We provide logistics services for heavy freight across the Midwest.',
        goals: [],
        confirmationAccepted: true
      });
      expect(errors).toContain('goals required');
    });

    it('should catch unconfirmed accuracy agreement', () => {
      const errors = validateForm({
        fullName: 'John',
        companyName: 'Acme',
        email: 'a@b.com',
        phone: '5551234567',
        country: 'US',
        industry: 'Logistics',
        aboutBusiness: 'We provide logistics services for heavy freight across the Midwest.',
        goals: ['Leads'],
        confirmationAccepted: false
      });
      expect(errors).toContain('confirmationAccepted required');
    });
  });
});
