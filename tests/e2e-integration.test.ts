import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('End-to-End Integration Tests: Wal Group Critical User Flows', () => {

  describe('1. Discovery Call Booking Flow (/api/bookings)', () => {
    it('should successfully book a discovery call with valid details', async () => {
      const bookingPayload = {
        companyName: 'Apex Express Logistics',
        industry: 'Amazon DSP / Fleet Logistics',
        country: 'United States',
        website: 'https://apexexpress.com',
        companySize: '11-50 employees',
        fullName: 'Johnathan Miller',
        email: 'jmiller@apexexpress.com',
        phone: '+1 555-234-5678',
        jobTitle: 'Fleet Director',
        linkedin: 'https://linkedin.com/in/jmiller-apex',
        selectedServices: ['Amazon DSP Dispatch', 'DSP Accounting & Payroll', 'AI Driver Recruitment'],
        preferredDate: '2026-08-15',
        preferredTime: '10:00 AM',
        timezone: 'EST (UTC-5)',
        meetingType: 'Google Meet',
        projectDescription: 'Need 24/7 dispatch coverage for 35 DSP vans and bi-weekly scorecard payroll reconciliation.',
        currentChallenges: 'Driver turnover and route delay tracking',
        expectedTeamSize: '3-5 dedicated dispatchers',
        budget: '$3,000 - $5,000 / month',
        timeline: 'Immediate (1-2 weeks)'
      };

      const res = await request(app)
        .post('/api/bookings')
        .send(bookingPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Discovery Call Successfully Booked');
      expect(res.body.bookingId).toMatch(/^WAL-DEMO-[A-Z0-9]+$/);
      expect(res.body.meetLink).toMatch(/^https:\/\/meet\.google\.com\/[a-z0-9-]+$/);
      expect(res.body.icsContent).toContain('BEGIN:VCALENDAR');
      expect(res.body.icsContent).toContain('Apex Express Logistics');
      expect(res.body.notificationRecipient).toBe('thewalgroupinfo@gmail.com');

      const booking = res.body.booking;
      expect(booking.companyName).toBe('Apex Express Logistics');
      expect(booking.fullName).toBe('Johnathan Miller');
      expect(booking.email).toBe('jmiller@apexexpress.com');
      expect(booking.status).toBe('Pending');
    });

    it('should reject booking if required fields are missing', async () => {
      const incompletePayload = {
        fullName: 'Jane Doe',
        email: 'jane@example.com'
        // Missing companyName, phone, preferredDate, preferredTime
      };

      const res = await request(app)
        .post('/api/bookings')
        .send(incompletePayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Missing required fields');
    });

    it('should reject booking if email format is invalid', async () => {
      const invalidEmailPayload = {
        companyName: 'Test Fleet',
        fullName: 'Jane Doe',
        email: 'not-an-email',
        phone: '+1 555-111-2222',
        preferredDate: '2026-08-15',
        preferredTime: '02:00 PM'
      };

      const res = await request(app)
        .post('/api/bookings')
        .send(invalidEmailPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid email address');
    });

    it('should trigger bot spam protection when recaptcha token is BOT_TRIGGER', async () => {
      const botPayload = {
        companyName: 'Spam Bot Co',
        fullName: 'Bot User',
        email: 'bot@spam.com',
        phone: '+1 555-999-9999',
        preferredDate: '2026-08-15',
        preferredTime: '10:00 AM',
        recaptchaToken: 'BOT_TRIGGER'
      };

      const res = await request(app)
        .post('/api/bookings')
        .send(botPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Spam validation failed');
    });

    it('should fetch, filter, update, export, and manage created bookings', async () => {
      // 1. Create a booking
      const bookingPayload = {
        companyName: 'Omni Freight Partners',
        fullName: 'Sarah Jenkins',
        email: 'sjenkins@omnifreight.com',
        phone: '+1 555-444-3333',
        preferredDate: '2026-09-01',
        preferredTime: '11:30 AM'
      };

      const createRes = await request(app)
        .post('/api/bookings')
        .send(bookingPayload);

      const bookingId = createRes.body.bookingId;
      expect(bookingId).toBeDefined();

      // 2. Fetch all bookings
      const getRes = await request(app).get('/api/bookings');
      expect(getRes.status).toBe(200);
      expect(getRes.body.success).toBe(true);
      expect(getRes.body.bookings.some((b: any) => b.id === bookingId)).toBe(true);

      // 3. Search for booking
      const searchRes = await request(app).get(`/api/bookings?search=Omni`);
      expect(searchRes.body.bookings.some((b: any) => b.companyName === 'Omni Freight Partners')).toBe(true);

      // 4. Update booking status
      const patchRes = await request(app)
        .patch(`/api/bookings/${bookingId}`)
        .send({ status: 'Completed', notes: 'Discovery call held, proposal sent.' });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.booking.status).toBe('Completed');
      expect(patchRes.body.booking.notes).toBe('Discovery call held, proposal sent.');

      // 5. Download ICS
      const icsRes = await request(app).get(`/api/bookings/ics/${bookingId}`);
      expect(icsRes.status).toBe(200);
      expect(icsRes.headers['content-type']).toContain('text/calendar');

      // 6. Export CSV
      const csvRes = await request(app).get('/api/bookings/export-csv');
      expect(csvRes.status).toBe(200);
      expect(csvRes.headers['content-type']).toContain('text/csv');
      expect(csvRes.text).toContain('Booking ID,Company Name');
      expect(csvRes.text).toContain('Omni Freight Partners');
    });
  });

  describe('2. AI Assistant Conversation & Lead Scoring Flow (/api/ai-chat)', () => {
    let testSessionId: string;

    it('should initialize chat conversation and return informative AI response', async () => {
      const chatPayload = {
        message: 'Hello, what services does Wal Group offer for Amazon DSPs?',
        behavior: {
          lastPageVisited: '/services/dsp-dispatch',
          pagesVisited: ['/', '/services/dsp-dispatch'],
          servicesViewed: ['Amazon DSP Dispatch'],
          timeSpentSeconds: 120
        }
      };

      const res = await request(app)
        .post('/api/ai-chat')
        .send(chatPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.sessionId).toBeDefined();
      expect(res.body.response).toBeDefined();
      expect(typeof res.body.response).toBe('string');
      expect(res.body.notificationRoutedTo).toBe('thewalgroupinfo@gmail.com');

      testSessionId = res.body.sessionId;
    }, 10000);

    it('should extract lead contact details and calculate lead score automatically', async () => {
      const chatPayloadWithLead = {
        sessionId: testSessionId,
        message: 'We manage 30 vans in Dallas. You can reach me at robert@dallasdispatch.com or +1 214-555-0199 to discuss booking a demo.',
        behavior: {
          lastPageVisited: '/contact',
          pagesVisited: ['/', '/services/dsp-dispatch', '/contact']
        }
      };

      const res = await request(app)
        .post('/api/ai-chat')
        .send(chatPayloadWithLead);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.extractedLead.email).toBe('robert@dallasdispatch.com');
      expect(res.body.extractedLead.phone).toContain('214-555-0199');
      expect(res.body.extractedLead.fleetSize).toContain('30 vans');
      expect(res.body.shouldSuggestBooking).toBe(true);

      // Verify the lead is persisted in the backend database
      const leadsRes = await request(app).get('/api/leads');
      expect(leadsRes.status).toBe(200);
      const matchedLead = leadsRes.body.leads.find((l: any) => l.email === 'robert@dallasdispatch.com');
      expect(matchedLead).toBeDefined();
      expect(matchedLead.score).toBe('Hot');

      // Verify transcript is saved in backend
      const transcriptRes = await request(app).get('/api/ai-transcripts');
      expect(transcriptRes.status).toBe(200);
      expect(transcriptRes.body.transcripts.some((t: any) => t.sessionId === testSessionId)).toBe(true);
    }, 10000);

    it('should return error if message is empty', async () => {
      const res = await request(app)
        .post('/api/ai-chat')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Message string is required');
    });
  });

  describe('3. Direct Lead Form Submission Flow (/api/leads)', () => {
    it('should record direct web lead form submission with high score for fleet operators', async () => {
      const leadPayload = {
        name: 'Carlos Rodriguez',
        company: 'Lone Star Logistics LLC',
        email: 'crodriguez@lonestarlogistics.com',
        phone: '+1 713-555-8899',
        country: 'United States',
        industry: 'Logistics',
        fleetSize: '45 vans',
        teamSize: '60 drivers',
        challenges: 'Payroll reconciliation and late night dispatch coverage',
        servicesOfInterest: ['Amazon DSP Dispatch', 'DSP Accounting & Payroll']
      };

      const res = await request(app)
        .post('/api/leads')
        .send(leadPayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Your information has been received');
      expect(res.body.leadId).toBeDefined();
      expect(res.body.routedTo).toBe('thewalgroupinfo@gmail.com');

      // Verify persistence and lead scoring
      const leadsRes = await request(app).get('/api/leads');
      const savedLead = leadsRes.body.leads.find((l: any) => l.id === res.body.leadId);
      expect(savedLead).toBeDefined();
      expect(savedLead.name).toBe('Carlos Rodriguez');
      expect(savedLead.score).toBe('Hot');
    });

    it('should require email or phone for lead submission', async () => {
      const invalidPayload = {
        name: 'Anonymous Visitor',
        company: 'Unknown Co'
      };

      const res = await request(app)
        .post('/api/leads')
        .send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('at least an email or phone number');
    });
  });

  describe('4. SEO & Metadata Endpoints (/robots.txt, /sitemap.xml)', () => {
    it('should return valid robots.txt pointing to sitemap.xml', async () => {
      const res = await request(app).get('/robots.txt');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/plain');
      expect(res.text).toContain('User-agent: *');
      expect(res.text).toContain('Sitemap:');
      expect(res.text).toContain('/sitemap.xml');
    });

    it('should generate complete XML sitemap with all Wal Group site routes', async () => {
      const res = await request(app).get('/sitemap.xml');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/xml');
      expect(res.text).toContain('<urlset');
      expect(res.text).toContain('/services/dsp-dispatch');
      expect(res.text).toContain('/about');
      expect(res.text).toContain('/contact');
    });
  });

});
