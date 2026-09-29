import { describe, it, expect } from 'vitest';
import { CALENDLY_GOOGLE_MEET_URL, CALENDLY_ZOOM_URL } from '../src/components/BookDemoModal';
import request from 'supertest';
import { app } from '../server';

describe('Calendly Demo Call Booking Integration', () => {
  it('should have exact Google Meet Calendly booking URL', () => {
    expect(CALENDLY_GOOGLE_MEET_URL).toBe('https://calendly.com/thewalgroups/wal-groups-demo-call-1');
  });

  it('should have exact Zoom Calendly booking URL', () => {
    expect(CALENDLY_ZOOM_URL).toBe('https://calendly.com/thewalgroups/wal-groups-demo-call');
  });

  it('must verify links are not swapped or confused', () => {
    expect(CALENDLY_GOOGLE_MEET_URL).toContain('wal-groups-demo-call-1');
    expect(CALENDLY_ZOOM_URL).toContain('wal-groups-demo-call');
    expect(CALENDLY_GOOGLE_MEET_URL).not.toBe(CALENDLY_ZOOM_URL);
  });

  it('should construct pre-filled query parameters for customer name and email', () => {
    const fullName = 'Marcus Vance';
    const email = 'marcus@apexlogistics.com';

    const googleMeetUrl = new URL(CALENDLY_GOOGLE_MEET_URL);
    googleMeetUrl.searchParams.set('name', fullName);
    googleMeetUrl.searchParams.set('email', email);

    expect(googleMeetUrl.toString()).toContain('name=Marcus+Vance');
    expect(googleMeetUrl.toString()).toContain('email=marcus%40apexlogistics.com');

    const zoomUrl = new URL(CALENDLY_ZOOM_URL);
    zoomUrl.searchParams.set('name', fullName);
    zoomUrl.searchParams.set('email', email);

    expect(zoomUrl.toString()).toContain('name=Marcus+Vance');
    expect(zoomUrl.toString()).toContain('email=marcus%40apexlogistics.com');
  });

  it('should submit a demo booking with Zoom meeting type and verify persistence', async () => {
    const payload = {
      companyName: 'Prime Logistics Hub',
      fullName: 'Elena Rostova',
      email: 'elena@primelogisticshub.com',
      phone: '+1 555-888-9999',
      preferredDate: '2026-09-01',
      preferredTime: '11:00 AM EST',
      meetingType: 'Zoom',
      meetLink: CALENDLY_ZOOM_URL,
      selectedServices: ['Amazon DSP Dispatch']
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.booking.meetingType).toBe('Zoom');
    expect(res.body.booking.companyName).toBe('Prime Logistics Hub');
  });

  it('should submit a demo booking with Google Meet meeting type and verify persistence', async () => {
    const payload = {
      companyName: 'Skyline Fleet Co',
      fullName: 'David Sterling',
      email: 'david@skylinefleet.com',
      phone: '+1 555-777-6666',
      preferredDate: '2026-09-02',
      preferredTime: '02:00 PM EST',
      meetingType: 'Google Meet',
      meetLink: CALENDLY_GOOGLE_MEET_URL,
      selectedServices: ['DSP Accounting & Payroll']
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.booking.meetingType).toBe('Google Meet');
    expect(res.body.booking.companyName).toBe('Skyline Fleet Co');
  });

  it('should support the step-by-step wizard payload: Name, Email, Industry, Platform', async () => {
    const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const wizardPayload = {
      fullName: 'Marcus Vance',
      email: 'marcus@apexlogistics.com',
      industry: 'Amazon DSP (Last-Mile Delivery)',
      companyName: "Marcus Vance's Organization",
      phone: '+1 555-010-0000',
      preferredDate: tomorrowDate,
      preferredTime: '10:00 AM EST',
      timezone: 'EST (UTC-5)',
      meetingType: 'Google Meet',
      selectedServices: ['Amazon DSP (Last-Mile Delivery)'],
      meetLink: `${CALENDLY_GOOGLE_MEET_URL}?name=Marcus+Vance&email=marcus%40apexlogistics.com`
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(wizardPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.booking.fullName).toBe('Marcus Vance');
    expect(res.body.booking.email).toBe('marcus@apexlogistics.com');
    expect(res.body.booking.industry).toBe('Amazon DSP (Last-Mile Delivery)');
    expect(res.body.booking.meetingType).toBe('Google Meet');
  });
});
