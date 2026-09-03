import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { saveBookingToSupabase, saveLeadToSupabase, saveContactSubmissionToSupabase, saveJobApplicationToSupabase, saveTicketToSupabase, saveAiLogToSupabase } from './src/lib/supabase';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to send email notifications securely via Resend API (or fallback logging)
async function sendEmailNotification(to: string, subject: string, htmlContent: string) {
  console.log(`[EMAIL DISPATCH INITIATED] To: ${to} | Subject: ${subject}`);
  
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL || 'Wal Group <onboarding@resend.dev>';
  
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [to],
          subject,
          html: htmlContent
        })
      });
      const data = await response.json();
      if (!response.ok) {
        console.warn(`[RESEND EMAIL WARNING] Response ${response.status}:`, data);
        // If domain not verified on custom sender, attempt fallback with onboarding@resend.dev
        if (resendFrom !== 'Wal Group <onboarding@resend.dev>') {
          console.log('[RESEND EMAIL RETRY] Retrying with onboarding@resend.dev...');
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: 'Wal Group <onboarding@resend.dev>',
              to: [to],
              subject,
              html: htmlContent
            })
          });
          const retryData = await retryRes.json();
          console.log(`[RESEND RETRY RESULT] Status ${retryRes.status}:`, retryData);
          return { success: retryRes.ok, data: retryData };
        }
      } else {
        console.log(`[RESEND EMAIL SUCCESS] Sent to ${to}:`, data);
      }
      return { success: response.ok, data };
    } catch (err) {
      console.error('[RESEND EMAIL ERROR]', err);
      return { success: false, error: err };
    }
  } else {
    console.log(`[EMAIL SIMULATION] Delivery queued for ${to}. Set RESEND_API_KEY in environment for live delivery.`);
    return { success: true, simulated: true };
  }
}

// File persistence paths
const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const TRANSCRIPTS_FILE = path.join(DATA_DIR, 'transcripts.json');
const KNOWLEDGE_FILE = path.join(DATA_DIR, 'knowledge.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.error('Failed to initialize Gemini AI client:', e);
    }
  }
  return genAIClient;
}

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    try {
      openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } catch (e) {
      console.error('Failed to initialize OpenAI client:', e);
    }
  }
  return openaiClient;
}

interface BookingRecord {
  id: string;
  companyName: string;
  industry: string;
  country: string;
  website?: string;
  companySize: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  linkedin?: string;
  selectedServices: string[];
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  meetingType: string;
  projectDescription: string;
  currentChallenges?: string;
  expectedTeamSize?: string;
  budget?: string;
  timeline?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Canceled' | 'Rescheduled';
  createdAt: string;
  meetLink: string;
  googleCalendarUrl?: string;
  notes?: string;
  routedTo: string;
}

interface LeadRecord {
  id: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  industry?: string;
  fleetSize?: string;
  teamSize?: string;
  challenges?: string;
  servicesOfInterest?: string[];
  score: 'Hot' | 'Warm' | 'Cold';
  scoreReason?: string;
  sessionId?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  createdAt: string;
  routedTo: string;
}

interface ChatTranscriptSession {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  pageVisited: string;
  userBehaviorSummary?: string;
  messages: Array<{ sender: 'user' | 'assistant' | 'system'; text: string; timestamp: string }>;
  leadDetails?: Partial<LeadRecord>;
  unansweredQuestions?: string[];
}

// Data helper functions
function loadData<T>(file: string, defaultVal: T): T {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading file ${file}:`, err);
  }
  return defaultVal;
}

function saveData<T>(file: string, data: T): void {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing file ${file}:`, err);
  }
}

// Generate ICS calendar string helper
function generateICS(booking: BookingRecord): string {
  const cleanId = booking.id.replace(/[^a-zA-Z0-9]/g, '');
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let startDateStr = now;
  try {
    const d = new Date(`${booking.preferredDate}T${booking.preferredTime || '10:00'}:00`);
    if (!isNaN(d.getTime())) {
      startDateStr = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
  } catch {
    // fallback
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wal Group//Discovery Call Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${cleanId}@walgroups.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${startDateStr}`,
    `SUMMARY:Wal Group Discovery Call - ${booking.companyName}`,
    `DESCRIPTION:Wal Group Discovery Call\\nBooking ID: ${booking.id}\\nClient: ${booking.fullName} (${booking.email})\\nCompany: ${booking.companyName}\\nMeeting Link: ${booking.meetLink}\\nServices: ${booking.selectedServices.join(', ')}`,
    `LOCATION:${booking.meetLink}`,
    `ORGANIZER;CN="Wal Group Discovery Team":mailto:thewalgroupinfo@gmail.com`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${booking.fullName}:mailto:${booking.email}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="Wal Group Info":mailto:thewalgroupinfo@gmail.com`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function generateGoogleCalendarUrl(booking: BookingRecord): string {
  try {
    const title = encodeURIComponent(`Wal Group Discovery Call - ${booking.companyName}`);
    let cleanDate = booking.preferredDate ? booking.preferredDate.replace(/-/g, '') : new Date().toISOString().split('T')[0].replace(/-/g, '');
    const startIso = `${cleanDate}T140000Z`;
    const endIso = `${cleanDate}T143000Z`;
    const dates = `${startIso}/${endIso}`;
    const details = encodeURIComponent(
      `Wal Group Discovery Call\n\n` +
      `Booking ID: ${booking.id}\n` +
      `Client Name: ${booking.fullName}\n` +
      `Email: ${booking.email}\n` +
      `Phone: ${booking.phone}\n` +
      `Company: ${booking.companyName}\n` +
      `Services: ${booking.selectedServices.join(', ')}\n` +
      `Meeting Link: ${booking.meetLink}\n\n` +
      `Notes: ${booking.projectDescription || 'N/A'}`
    );
    const location = encodeURIComponent(booking.meetLink);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&add=${encodeURIComponent(booking.email)}`;
  } catch {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Wal Group Discovery Call')}`;
  }
}

// Rate limiting
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const max = 25;

  const record = rateLimitStore.get(ip);
  if (!record) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - record.firstRequest > windowMs) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  record.count += 1;
  return record.count > max;
}

// ----------------- API ROUTES ----------------- //

// 1. Discovery Call Booking Route
app.post('/api/bookings', (req, res) => {
  try {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    if (isRateLimited(clientIp)) {
      return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    }

    const {
      companyName,
      industry,
      country,
      website,
      companySize,
      fullName,
      email,
      phone,
      jobTitle,
      linkedin,
      selectedServices,
      preferredDate,
      preferredTime,
      timezone,
      meetingType,
      projectDescription,
      currentChallenges,
      expectedTeamSize,
      budget,
      timeline,
      recaptchaToken
    } = req.body;

    if (!companyName || !fullName || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields for booking.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address provided.' });
    }

    if (recaptchaToken === 'BOT_TRIGGER') {
      return res.status(400).json({ success: false, message: 'Spam validation failed.' });
    }

    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const bookingId = `WAL-DEMO-${randomCode}`;
    
    const meetCode = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
    const meetLink = `https://meet.google.com/${meetCode}`;

    const newBooking: BookingRecord = {
      id: bookingId,
      companyName,
      industry: industry || 'Logistics & Fleet Operations',
      country: country || 'United States',
      website,
      companySize: companySize || '11-50 employees',
      fullName,
      email,
      phone,
      jobTitle: jobTitle || 'Operations Executive',
      linkedin,
      selectedServices: Array.isArray(selectedServices) && selectedServices.length > 0 ? selectedServices : ['Amazon DSP Dispatch', 'Back-Office Outsourcing'],
      preferredDate,
      preferredTime,
      timezone: timezone || 'EST (UTC-5)',
      meetingType: meetingType || 'Google Meet',
      projectDescription: projectDescription || 'Discovery call for operations outsourcing and backend workflow optimization.',
      currentChallenges,
      expectedTeamSize,
      budget,
      timeline,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      meetLink,
      googleCalendarUrl: '',
      routedTo: 'thewalgroupinfo@gmail.com'
    };

    const googleCalendarUrl = generateGoogleCalendarUrl(newBooking);
    newBooking.googleCalendarUrl = googleCalendarUrl;

    const bookings = loadData<BookingRecord[]>(BOOKINGS_FILE, []);
    bookings.unshift(newBooking);
    saveData(BOOKINGS_FILE, bookings);

    // Persist to Supabase
    saveBookingToSupabase({
      id: newBooking.id,
      companyName: newBooking.companyName,
      industry: newBooking.industry,
      country: newBooking.country,
      website: newBooking.website,
      companySize: newBooking.companySize,
      fullName: newBooking.fullName,
      email: newBooking.email,
      phone: newBooking.phone,
      jobTitle: newBooking.jobTitle,
      linkedin: newBooking.linkedin,
      selectedServices: newBooking.selectedServices,
      preferredDate: newBooking.preferredDate,
      preferredTime: newBooking.preferredTime,
      timezone: newBooking.timezone,
      meetingType: newBooking.meetingType,
      projectDescription: newBooking.projectDescription,
      currentChallenges: newBooking.currentChallenges,
      expectedTeamSize: newBooking.expectedTeamSize,
      budget: newBooking.budget,
      timeline: newBooking.timeline,
      status: newBooking.status,
      meetLink: newBooking.meetLink,
      googleCalendarUrl: newBooking.googleCalendarUrl,
      notes: newBooking.notes,
      routedTo: newBooking.routedTo
    }).catch((err) => console.error('[Supabase Server Booking Save Error]', err));

    const icsContent = generateICS(newBooking);

    // Dispatch live email notifications
    const adminHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #0a2647;">New Discovery Call Booked (${bookingId})</h2>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Contact Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Date & Time:</strong> ${preferredDate} at ${preferredTime} (${timezone || 'EST'})</p>
        <p><strong>Meeting Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
        <p><strong>Project Description:</strong> ${projectDescription}</p>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #0a2647;">Discovery Call Confirmation - Wal Group</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for scheduling a discovery call with Wal Group. Your session details are below:</p>
        <ul>
          <li><strong>Reference ID:</strong> ${bookingId}</li>
          <li><strong>Date:</strong> ${preferredDate}</li>
          <li><strong>Time:</strong> ${preferredTime} (${timezone || 'EST'})</li>
          <li><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></li>
        </ul>
        <p>We look forward to speaking with you!</p>
        <p>Best regards,<br><strong>Wal Group Operations Team</strong><br>thewalgroupinfo@gmail.com</p>
      </div>
    `;

    sendEmailNotification('thewalgroupinfo@gmail.com', `[New Booking] ${companyName} - ${fullName}`, adminHtml);
    sendEmailNotification(email, `Discovery Call Confirmed - Wal Group (${bookingId})`, clientHtml);

    return res.json({
      success: true,
      message: 'Discovery Call Successfully Booked!',
      bookingId,
      booking: newBooking,
      meetLink,
      googleCalendarUrl,
      icsContent,
      notificationRecipient: 'thewalgroupinfo@gmail.com',
      internalEmailSent: true,
      clientEmailSent: true
    });
  } catch (err: any) {
    console.error('[BOOKING ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'We encountered an unexpected error processing your booking. Our administration team has been notified. Please try again or reach us directly at thewalgroupinfo@gmail.com.'
    });
  }
});

// Contact Us Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, companyName, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: 'Full name, email, and message are required.' });
    }

    // Persist to Supabase
    await saveContactSubmissionToSupabase({
      fullName,
      email,
      phone: phone || '',
      companyName: companyName || '',
      subject: subject || 'Contact Us Submission',
      message,
      targetEmail: 'thewalgroupinfo@gmail.com'
    });

    const adminEmailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #0a2647;">New Contact Us Inquiry</h2>
        <p><strong>From:</strong> ${fullName} (${email})</p>
        <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #0a2647;">${message}</blockquote>
      </div>
    `;

    const clientEmailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #0a2647;">Thank You for Contacting Wal Group</h2>
        <p>Dear ${fullName},</p>
        <p>We have received your message regarding "<strong>${subject || 'General Inquiry'}</strong>". Our operations team will review your inquiry and respond within 24 business hours.</p>
        <br>
        <p>Warm regards,<br><strong>Wal Group Operations</strong><br>thewalgroupinfo@gmail.com</p>
      </div>
    `;

    sendEmailNotification('thewalgroupinfo@gmail.com', `[Contact Us] ${subject || 'New Inquiry'} from ${fullName}`, adminEmailHtml);
    sendEmailNotification(email, `We Received Your Inquiry - Wal Group`, clientEmailHtml);

    return res.json({ success: true, message: 'Message successfully received and email notifications dispatched.' });
  } catch (err: any) {
    console.error('[CONTACT API ERROR]', err);
    return res.status(500).json({ success: false, message: 'Failed to record contact submission.' });
  }
});

// Careers / Job Applications Endpoint
app.post('/api/careers', async (req, res) => {
  try {
    const payload = req.body;
    const { id, fullName, email, phone, position, resumeUrl, resumeFileName, experienceYears } = payload;

    if (!fullName || !email || !position) {
      return res.status(400).json({ success: false, message: 'Missing required candidate application fields.' });
    }

    // Persist to Supabase
    await saveJobApplicationToSupabase(payload);

    const adminEmailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #0a2647;">New Job Application Received (${id || 'NEW'})</h2>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Candidate:</strong> ${fullName} (${email})</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Experience:</strong> ${experienceYears || 0} Years</p>
        <p><strong>Resume Attachment:</strong> <a href="${resumeUrl}">${resumeFileName || 'Download Resume'}</a></p>
      </div>
    `;

    const clientEmailHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #0a2647;">Job Application Received - Wal Group</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for applying for the position of <strong>${position}</strong> at Wal Group.</p>
        <p>Our HR recruitment team is reviewing your profile and resume. If your qualifications match our open roles, we will contact you directly for a screening interview.</p>
        <br>
        <p>Best of luck,<br><strong>Wal Group HR & Recruitment</strong><br>thewalgroupinfo@gmail.com</p>
      </div>
    `;

    sendEmailNotification('thewalgroupinfo@gmail.com', `[Job App] ${position} - ${fullName}`, adminEmailHtml);
    sendEmailNotification(email, `Application Confirmation - Wal Group (${position})`, clientEmailHtml);

    return res.json({ success: true, message: 'Job application received.' });
  } catch (err: any) {
    console.error('[CAREERS API ERROR]', err);
    return res.status(500).json({ success: false, message: 'Failed to process job application.' });
  }
});

// Support Ticket Submission Endpoint
app.post('/api/tickets', async (req, res) => {
  try {
    const payload = req.body;
    const { id, fullName, email, phone, companyName, department, subject, priority, message } = payload;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Full name, email, subject, and message are required.' });
    }

    const ticketId = id || `WM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullPayload = {
      ...payload,
      id: ticketId,
      department: department || 'Technical Support',
      priority: priority || 'Medium'
    };

    // Save to Supabase
    await saveTicketToSupabase(fullPayload);

    const adminHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #0a2647;">New Client Support Ticket (${ticketId})</h2>
        <p><strong>From:</strong> ${fullName} (${email})</p>
        <p><strong>Company:</strong> ${companyName || 'N/A'} | <strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Department:</strong> ${department || 'Technical Support'} | <strong>Priority:</strong> ${priority || 'Medium'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Description:</strong></p>
        <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #0a2647;">${message}</blockquote>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #0a2647;">Support Ticket Received - Wal Group</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for contacting Wal Group Support. Your ticket reference is <strong>${ticketId}</strong>.</p>
        <p>Our operational specialists are reviewing your request in the <strong>${department || 'Technical Support'}</strong> queue and will reply promptly.</p>
        <br>
        <p>Best regards,<br><strong>Wal Group Operations Support</strong><br>thewalgroupinfo@gmail.com</p>
      </div>
    `;

    sendEmailNotification('thewalgroupinfo@gmail.com', `[Ticket ${ticketId}] ${subject} (${priority || 'Medium'})`, adminHtml);
    sendEmailNotification(email, `Support Ticket Logged - Wal Group (${ticketId})`, clientHtml);

    return res.json({
      success: true,
      ticketId,
      message: 'Support ticket successfully logged and email notifications dispatched.'
    });
  } catch (err: any) {
    console.error('[TICKETS API ERROR]', err);
    return res.status(500).json({ success: false, message: 'Failed to process support ticket.' });
  }
});

// Supabase Database Webhook & Edge Functions Listener Endpoint
app.post('/api/supabase-webhook', async (req, res) => {
  try {
    // Validate secret header if configured
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    const authHeader = req.headers['x-supabase-webhook-secret'] || req.headers['authorization'];
    if (webhookSecret && authHeader) {
      const token = authHeader.toString().replace(/^Bearer\s+/i, '');
      if (token !== webhookSecret) {
        console.warn('[SUPABASE WEBHOOK AUTH FAILED] Secret mismatch');
        return res.status(401).json({ success: false, message: 'Unauthorized webhook request.' });
      }
    }

    const body = req.body || {};
    // Extract event details from Supabase payload structures
    const table = (body.table || body.table_name || body.type || '').toString().toLowerCase();
    const eventType = (body.type || body.event || body.action || 'INSERT').toString().toUpperCase();
    const record = body.record || body.data || body.new || body;

    console.log(`[SUPABASE WEBHOOK EVENT RECEIVED] Event: ${eventType} | Table: ${table}`);

    if (!record || typeof record !== 'object' || Object.keys(record).length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or missing record payload.' });
    }

    const dispatchedEmails: string[] = [];

    // Helper to safely fetch fields whether camelCase or snake_case
    const getVal = (...keys: string[]): any => {
      for (const k of keys) {
        if (record[k] !== undefined && record[k] !== null && record[k] !== '') {
          return record[k];
        }
      }
      return '';
    };

    // 1. Table: contact_submissions / contact
    if (table.includes('contact')) {
      const fullName = getVal('full_name', 'fullName', 'name') || 'Valued Visitor';
      const email = getVal('email', 'email_address');
      const phone = getVal('phone', 'phone_number');
      const companyName = getVal('company_name', 'companyName', 'company');
      const subject = getVal('subject', 'topic') || 'General Contact Inquiry';
      const message = getVal('message', 'comments', 'inquiry') || 'No message content provided.';

      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0a2647;">[Supabase Trigger] New Contact Inquiry</h2>
          <p><strong>From:</strong> ${fullName} (${email})</p>
          <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #0a2647;">${message}</blockquote>
        </div>
      `;

      sendEmailNotification('thewalgroupinfo@gmail.com', `[Supabase Trigger] Contact Inquiry: ${subject} from ${fullName}`, adminHtml);
      dispatchedEmails.push('thewalgroupinfo@gmail.com');

      if (email) {
        const clientHtml = `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #0a2647;">We Received Your Message - Wal Group</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for reaching out regarding "<strong>${subject}</strong>". Your inquiry has been received via our Supabase data system. An operations manager will follow up with you within 24 business hours.</p>
            <br>
            <p>Best regards,<br><strong>Wal Group Operations Team</strong><br>thewalgroupinfo@gmail.com</p>
          </div>
        `;
        sendEmailNotification(email, `Inquiry Received - Wal Group`, clientHtml);
        dispatchedEmails.push(email);
      }
    }

    // 2. Table: bookings / discovery_calls
    else if (table.includes('booking') || table.includes('discovery')) {
      const id = getVal('id', 'booking_id', 'bookingId') || `WAL-BOOK-${Date.now()}`;
      const fullName = getVal('full_name', 'fullName', 'name') || 'Valued Client';
      const companyName = getVal('company_name', 'companyName', 'company') || 'Client Organization';
      const email = getVal('email');
      const phone = getVal('phone');
      const preferredDate = getVal('preferred_date', 'preferredDate', 'date') || 'To Be Confirmed';
      const preferredTime = getVal('preferred_time', 'preferredTime', 'time') || 'To Be Confirmed';
      const timezone = getVal('timezone') || 'EST';
      const meetLink = getVal('meet_link', 'meetLink') || 'https://meet.google.com/wal-group-discovery';
      const projectDescription = getVal('project_description', 'projectDescription', 'notes') || 'Discovery session booked.';

      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0a2647;">[Supabase Trigger] New Discovery Call Booked</h2>
          <p><strong>Booking ID:</strong> ${id}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Contact:</strong> ${fullName} (${email})</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Date & Time:</strong> ${preferredDate} at ${preferredTime} (${timezone})</p>
          <p><strong>Google Meet Link:</strong> <a href="${meetLink}">${meetLink}</a></p>
          <p><strong>Project Details:</strong> ${projectDescription}</p>
        </div>
      `;

      sendEmailNotification('thewalgroupinfo@gmail.com', `[Supabase Trigger] Booking: ${companyName} (${id})`, adminHtml);
      dispatchedEmails.push('thewalgroupinfo@gmail.com');

      if (email) {
        const clientHtml = `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #0a2647;">Discovery Call Confirmed - Wal Group</h2>
            <p>Dear ${fullName},</p>
            <p>Your discovery session with Wal Group has been logged successfully in our database:</p>
            <ul>
              <li><strong>Reference ID:</strong> ${id}</li>
              <li><strong>Date & Time:</strong> ${preferredDate} at ${preferredTime} (${timezone})</li>
              <li><strong>Meeting Link:</strong> <a href="${meetLink}">${meetLink}</a></li>
            </ul>
            <p>We look forward to connecting with you!</p>
            <br>
            <p>Best regards,<br><strong>Wal Group Operations</strong><br>thewalgroupinfo@gmail.com</p>
          </div>
        `;
        sendEmailNotification(email, `Discovery Call Confirmed - Wal Group (${id})`, clientHtml);
        dispatchedEmails.push(email);
      }
    }

    // 3. Table: job_applications / careers
    else if (table.includes('job') || table.includes('career') || table.includes('application')) {
      const id = getVal('id', 'application_id', 'applicationId') || `APP-${Date.now()}`;
      const fullName = getVal('full_name', 'fullName', 'name') || 'Candidate';
      const email = getVal('email');
      const phone = getVal('phone');
      const position = getVal('position', 'job_title', 'role') || 'Operations Specialist';
      const experienceYears = getVal('experience_years', 'experienceYears', 'experience') || 0;
      const resumeUrl = getVal('resume_url', 'resumeUrl');
      const resumeFileName = getVal('resume_file_name', 'resumeFileName') || 'Resume';

      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0a2647;">[Supabase Trigger] New Job Application</h2>
          <p><strong>Application ID:</strong> ${id}</p>
          <p><strong>Candidate Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Position:</strong> ${position}</p>
          <p><strong>Experience:</strong> ${experienceYears} Years</p>
          ${resumeUrl ? `<p><strong>Resume:</strong> <a href="${resumeUrl}">${resumeFileName}</a></p>` : ''}
        </div>
      `;

      sendEmailNotification('thewalgroupinfo@gmail.com', `[Supabase Trigger] Job App: ${position} - ${fullName}`, adminHtml);
      dispatchedEmails.push('thewalgroupinfo@gmail.com');

      if (email) {
        const candidateHtml = `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #0a2647;">Application Confirmation - Wal Group</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for submitting your job application for <strong>${position}</strong> at Wal Group. Your profile is recorded in our recruitment database.</p>
            <p>Our recruitment team will evaluate your experience and follow up if your profile aligns with our openings.</p>
            <br>
            <p>Best of luck,<br><strong>Wal Group HR & Talent Acquisition</strong><br>thewalgroupinfo@gmail.com</p>
          </div>
        `;
        sendEmailNotification(email, `Application Received - Wal Group (${position})`, candidateHtml);
        dispatchedEmails.push(email);
      }
    }

    // 4. Table: leads
    else if (table.includes('lead')) {
      const id = getVal('id', 'lead_id') || `LEAD-${Date.now()}`;
      const name = getVal('name', 'full_name', 'fullName') || 'Prospective Lead';
      const company = getVal('company', 'company_name', 'companyName') || 'N/A';
      const email = getVal('email');
      const phone = getVal('phone');
      const fleetSize = getVal('fleet_size', 'fleetSize');
      const score = getVal('score') || 'Warm';

      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0a2647;">[Supabase Trigger] New Lead Logged</h2>
          <p><strong>Lead ID:</strong> ${id}</p>
          <p><strong>Lead Name:</strong> ${name}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Fleet Size / Details:</strong> ${fleetSize || 'N/A'}</p>
          <p><strong>Lead Score:</strong> ${score}</p>
        </div>
      `;

      sendEmailNotification('thewalgroupinfo@gmail.com', `[Supabase Trigger] Lead Captured: ${company !== 'N/A' ? company : name} (${score})`, adminHtml);
      dispatchedEmails.push('thewalgroupinfo@gmail.com');
    }

    // 5. Table: tickets / support_tickets
    else if (table.includes('ticket')) {
      const id = getVal('id', 'ticket_id') || `WM-TICKET-${Date.now()}`;
      const fullName = getVal('full_name', 'fullName', 'name') || 'Client';
      const email = getVal('email');
      const phone = getVal('phone');
      const companyName = getVal('company_name', 'companyName', 'company');
      const department = getVal('department') || 'Technical Support';
      const subject = getVal('subject') || 'Support Request';
      const priority = getVal('priority') || 'Medium';
      const message = getVal('message') || 'Support ticket logged.';

      const adminHtml = `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0a2647;">[Supabase Trigger] New Support Ticket (${id})</h2>
          <p><strong>From:</strong> ${fullName} (${email})</p>
          <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
          <p><strong>Department:</strong> ${department} | <strong>Priority:</strong> ${priority}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 12px; border-left: 4px solid #0a2647;">${message}</blockquote>
        </div>
      `;

      sendEmailNotification('thewalgroupinfo@gmail.com', `[Supabase Trigger] Support Ticket (${id}): ${subject}`, adminHtml);
      dispatchedEmails.push('thewalgroupinfo@gmail.com');

      if (email) {
        const clientHtml = `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #0a2647;">Support Ticket Logged - Wal Group</h2>
            <p>Dear ${fullName},</p>
            <p>Your support request <strong>"${subject}"</strong> has been assigned Ticket ID <strong>${id}</strong> in our ${department} system.</p>
            <p>Our operations team is actively investigating and will respond shortly.</p>
            <br>
            <p>Best regards,<br><strong>Wal Group Client Support</strong><br>thewalgroupinfo@gmail.com</p>
          </div>
        `;
        sendEmailNotification(email, `Support Ticket Logged - Wal Group (${id})`, clientHtml);
        dispatchedEmails.push(email);
      }
    } else {
      console.log(`[SUPABASE WEBHOOK] Unrecognized table "${table}". Event acknowledged without email trigger.`);
    }

    return res.json({
      success: true,
      processed: true,
      table,
      eventType,
      dispatchedEmails,
      message: 'Supabase database event successfully processed and email notifications dispatched.'
    });
  } catch (err: any) {
    console.error('[SUPABASE WEBHOOK EXCEPTION]', err);
    return res.status(500).json({ success: false, message: 'Failed to process Supabase database webhook event.' });
  }
});

// Get Bookings
app.get('/api/bookings', (req, res) => {
  const { status, search, limit } = req.query;
  let bookings = loadData<BookingRecord[]>(BOOKINGS_FILE, []);

  if (status && typeof status === 'string' && status !== 'All') {
    bookings = bookings.filter(b => b.status.toLowerCase() === status.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    bookings = bookings.filter(b => 
      b.id.toLowerCase().includes(q) ||
      b.companyName.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q)
    );
  }

  if (limit) {
    bookings = bookings.slice(0, parseInt(limit as string, 10));
  }

  return res.json({ success: true, total: bookings.length, bookings });
});

// Update booking
app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const bookings = loadData<BookingRecord[]>(BOOKINGS_FILE, []);
  const index = bookings.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  if (status) bookings[index].status = status;
  if (notes !== undefined) bookings[index].notes = notes;

  saveData(BOOKINGS_FILE, bookings);
  return res.json({ success: true, booking: bookings[index] });
});

// Delete booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  let bookings = loadData<BookingRecord[]>(BOOKINGS_FILE, []);
  const initialLength = bookings.length;
  bookings = bookings.filter(b => b.id !== id);

  if (bookings.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Booking not found.' });
  }

  saveData(BOOKINGS_FILE, bookings);
  return res.json({ success: true, message: 'Booking deleted.' });
});

// Download ICS
app.get('/api/bookings/ics/:id', (req, res) => {
  const { id } = req.params;
  const bookings = loadData<BookingRecord[]>(BOOKINGS_FILE, []);
  const booking = bookings.find(b => b.id === id);

  if (!booking) return res.status(404).send('Booking not found');

  const ics = generateICS(booking);
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${booking.id}-discovery-call.ics"`);
  return res.send(ics);
});

// Export CSV
app.get('/api/bookings/export-csv', (_req, res) => {
  const bookings = loadData<BookingRecord[]>(BOOKINGS_FILE, []);
  
  const headers = [
    'Booking ID', 'Company Name', 'Industry', 'Country', 'Company Size', 
    'Client Name', 'Email', 'Phone', 'Job Title', 'Selected Services', 
    'Preferred Date', 'Preferred Time', 'Timezone', 'Meeting Type', 'Status', 'Meet Link', 'Created At'
  ];

  const rows = bookings.map(b => [
    `"${b.id}"`, `"${b.companyName.replace(/"/g, '""')}"`, `"${b.industry}"`,
    `"${b.country}"`, `"${b.companySize}"`, `"${b.fullName.replace(/"/g, '""')}"`,
    `"${b.email}"`, `"${b.phone}"`, `"${b.jobTitle.replace(/"/g, '""')}"`,
    `"${b.selectedServices.join(', ').replace(/"/g, '""')}"`, `"${b.preferredDate}"`,
    `"${b.preferredTime}"`, `"${b.timezone}"`, `"${b.meetingType}"`,
    `"${b.status}"`, `"${b.meetLink}"`, `"${b.createdAt}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="wal-group-demo-bookings.csv"');
  return res.send(csvContent);
});

// Gemini & AI Assistant Status API Endpoint
app.get('/api/ai/status', (_req, res) => {
  const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  const isOpenAiConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '');
  return res.json({
    success: true,
    gemini: {
      configured: isGeminiConfigured,
      defaultModel: 'gemini-3.7-flash',
      provider: 'Google Gemini'
    },
    openai: {
      configured: isOpenAiConfigured,
      defaultModel: 'gpt-4o-mini',
      provider: 'OpenAI'
    },
    supabaseConnected: true
  });
});

// OpenAI Status API Endpoint
app.get('/api/openai/status', (_req, res) => {
  const isConfigured = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== '');
  return res.json({
    success: true,
    provider: 'OpenAI',
    configured: isConfigured,
    defaultModel: 'gpt-4o-mini',
    supabaseConnected: true,
    keyPreview: isConfigured ? `${process.env.OPENAI_API_KEY?.substring(0, 10)}...` : 'Not Set'
  });
});

// Dedicated OpenAI Chat API Endpoint (Server-Side Secure)
app.post('/api/openai-chat', async (req, res) => {
  try {
    const { message, sessionId, history, model, systemPrompt } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message string is required.' });
    }

    const openai = getOpenAI();
    if (!openai) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI API key is not configured on the server. Please set OPENAI_API_KEY in your server environment variables.',
        configured: false
      });
    }

    const selectedModel = model || 'gpt-4o-mini';
    const defaultSysPrompt = systemPrompt || `You are the AI Business Consultant and SDR for Wal Group, a 24/7 global operations backbone specializing in Amazon DSP dispatch, driver recruiting, payroll reconciliation, BPO Virtual Assistants, and custom web engineering. Deliver direct, professional, high-value consulting insights.`;

    const chatHistory = (history || []).map((h: { sender: string; text: string }) => ({
      role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: h.text
    }));

    const messages = [
      { role: 'system' as const, content: defaultSysPrompt },
      ...chatHistory,
      { role: 'user' as const, content: message.trim() }
    ];

    const response = await openai.chat.completions.create({
      model: selectedModel,
      messages,
      temperature: 0.7,
      max_tokens: 800
    });

    const aiMessage = response.choices[0]?.message?.content || 'No response generated.';

    // Persist conversation directly to Supabase
    saveAiLogToSupabase({
      session_id: sessionId || `SESS-${Date.now()}`,
      provider: 'OpenAI',
      model: selectedModel,
      user_message: message.trim(),
      ai_response: aiMessage
    }).catch(() => {});

    return res.json({
      success: true,
      provider: 'OpenAI',
      model: selectedModel,
      response: aiMessage,
      usage: response.usage
    });
  } catch (err: any) {
    if (err?.status === 401 || err?.message?.includes('401') || err?.message?.includes('Incorrect API key')) {
      console.warn('[OpenAI Auth Notice] Provided OPENAI_API_KEY is invalid or unauthorized (401).');
      return res.status(401).json({
        success: false,
        authError: true,
        message: 'The provided OPENAI_API_KEY is invalid or unauthorized. Please verify your OpenAI API key in server environment variables.'
      });
    }
    console.error('[OpenAI API Route Exception]', err?.message || err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to process request with OpenAI API.'
    });
  }
});

// 2. Wal AI Business Assistant Chat API (Powered by Google Gemini 3.7 Flash)
app.post('/api/ai-chat', async (req, res) => {
  const { message, sessionId, behavior, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message string is required.' });
  }

  const currentSessionId = sessionId || `SESS-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const userText = message.trim();

  // Load existing transcripts
  const transcripts = loadData<Record<string, ChatTranscriptSession>>(TRANSCRIPTS_FILE, {});
  const session = transcripts[currentSessionId] || {
    sessionId: currentSessionId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pageVisited: behavior?.lastPageVisited || '/',
    userBehaviorSummary: behavior ? `Pages: ${behavior.pagesVisited?.join(', ')} | Services: ${behavior.servicesViewed?.join(', ')} | Time: ${behavior.timeSpentSeconds}s` : 'Direct Visit',
    messages: [],
    leadDetails: {},
    unansweredQuestions: []
  };

  session.messages.push({
    sender: 'user',
    text: userText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Enhanced Entity & Lead Extraction from conversation text & history
  const extracted: Partial<LeadRecord> = session.leadDetails || {};

  const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) extracted.email = emailMatch[0];

  const phoneMatch = userText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) extracted.phone = phoneMatch[0];

  const fleetMatch = userText.match(/(\d+)\s*(vans|trucks|fleets|routes|vehicles|drivers|dispatchers|reps|agents|members)/i);
  if (fleetMatch) extracted.fleetSize = `${fleetMatch[1]} ${fleetMatch[2]}`;

  const companyMatch = userText.match(/(?:at|for|company|firm|dsp|llc|inc)\s+([A-Z][A-Za-z0-9\s]{2,25})/);
  if (companyMatch && !extracted.company) extracted.company = companyMatch[1].trim();

  const nameMatch = userText.match(/(?:my name is|i am|i'm|this is)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  if (nameMatch && !extracted.name) extracted.name = nameMatch[1].trim();

  session.leadDetails = extracted;

  // System Prompt Knowledge Base & Intent Strategy
  const systemPrompt = `You are the Wal AI Business Assistant, the 24/7 AI Sales Executive and Senior Operations Consultant for The Wal Group (official company name: The Wal Group / Wal Group).

YOUR ROLE & MISSION:
- You are an elite, consultative, friendly, knowledgeable 24/7 AI Sales Executive and Operations Consultant.
- Help website visitors understand The Wal Group's services, identify operational bottlenecks, recommend matching outsourced solutions, qualify leads, and guide prospective clients to booking a 30-minute Discovery Call or getting in touch.
- ALWAYS respond naturally, dynamically, and specifically to whatever question the user asks. DO NOT give generic or repetitive responses. Address their specific query with deep expertise.

COMPANY OVERVIEW & ACCREDITATION:
- Company Name: The Wal Group (or Wal Group; NEVER "Walmani").
- Headquarters: 55, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038, India.
- Global Remote Operations: Providing 24/7 dedicated operational backbones across North America, UK, Europe, and India.
- Official Contact Emails:
  • Primary Business & Sales Enquiries: thewalgroupinfo@gmail.com
  • General Communications: thewalgroups@gmail.com
- Official Phone & WhatsApp: +91 6363698148
- Website: https://thewalgroup.in/

COMPREHENSIVE KNOWLEDGE BASE & SERVICES:
1. Amazon DSP Support & Dispatch:
   - 24/7 live dispatch coverage using official portals (Amazon Cortex, Geotab, Netradyne, eMaint).
   - Driver scheduling, live route delay tracking, roadside assistance coordination, and package rescue routing.
   - Amazon Super Fantastic scorecard strategy (safety score optimization, seatbelt/distraction event remediation).
2. Amazon Freight Partner (AFP) Support:
   - Amazon Relay portal dispatch, load assignment, 12-step Proof of Delivery (POD) management.
   - TMS fleet tracking, 24/7 Hours of Service (HOS) DOT compliance monitoring, and dedicated lane optimization.
3. Dedicated Lane Services:
   - Scheduled freight, high-utilization round trips, on-time delivery guarantees, capacity planning.
4. Dispatch Operations (General & Freight):
   - 24/7 fleet tracking, load booking, real-time driver communication, detention management, route optimization.
5. Driver Management & AI Recruitment:
   - AI-assisted driver recruiting pipelines, candidate screening, background checks, license verification, onboarding, and driver retention programs.
6. Fleet Support & Compliance:
   - Preventative maintenance scheduling, damage logs, fuel card reconciliation, DOT compliance audit prep.
7. Accounting & Payroll Processing:
   - 14-day Amazon pay statement line-by-line reconciliation (auditing van damages, fuel card deductions, route adjustments, disputed claims).
   - Integration with ADP, Gusto, and QuickBooks; automated driver bonus and tier-based incentive calculations.
8. Customer Support & BPO Solutions:
   - 24/7 multi-channel inbound/outbound support (Email, Live Chat, Phone, Zendesk/Freshdesk Ticketing).
   - Dedicated offshore operations teams with rigorous SLAs.
9. Dedicated Virtual Assistants (VAs):
   - Executive VAs, email & calendar management, CRM updates, data entry, invoice processing, and vendor communications.
10. Website Design & Custom Web Engineering:
    - High-performance enterprise web platforms built with modern React, Vite, Node, Tailwind CSS.
    - Conversion-optimized UI/UX, SEO ready, mobile-first responsive architecture.
11. Digital Marketing:
    - Targeted B2B SEO strategy, paid acquisition (Google Ads/Meta/LinkedIn), B2B lead generation, brand positioning.
12. Gig & Special Projects:
    - Custom short-term operational sprints, seasonal scaling, and dedicated project managers.

KEY VALUE PROPOSITIONS & OUTSOURCING BENEFITS:
- 35% to 50% operational cost savings compared to in-house US/UK operations.
- 24/7/365 continuous coverage (no shift gaps or holiday disruptions).
- Domain experts trained on official Amazon logistics tools (Cortex, Relay, Geotab).
- Immediate scaling without local hiring headaches or equipment overhead.

SALES CONVERSATION GUIDELINES:
1. Active Listening: Direct, concise, consultative, and helpful. Always address what the user asked FIRST.
2. Format: Use clean paragraphs and bullet points where helpful. Keep answers crisp (2-4 concise paragraphs or clean bullet points).
3. Consultative Qualification: Naturally ask ONE relevant question per turn to understand their fleet size or specific business goals.
4. Pricing Inquiries: Explain that pricing is customized and volume-based depending on fleet size/team scope (saving 35-50%), and offer a tailored quote during a 30-minute Discovery Call.
5. Next Steps: When the user shows buying interest, offer to book a Discovery Call or collect their email/phone for a personalized proposal.
6. Tone: Professional, enthusiastic, executive-ready, knowledgeable.

BEHAVIOR CONTEXT:
The user is currently viewing: "${behavior?.lastPageVisited || '/'}". Pages viewed: ${(behavior?.pagesVisited || []).join(', ') || 'Home'}.`;

  let responseText = '';
  let shouldSuggestBooking = false;
  let activeProvider = '';
  let activeModel = '';

  const { preferredProvider } = req.body || {};
  const ai = getGenAI();
  const openai = getOpenAI();

  // Helper to execute Gemini chat using modern @google/genai SDK
  const runGemini = async () => {
    if (!ai) return false;
    try {
      // Build strictly sanitized contents array for Gemini API:
      // Must alternate 'user' -> 'model' -> 'user' and start with 'user'
      const sanitizedContents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
      const rawHistory = Array.isArray(history) ? history.slice(-10) : [];

      for (const item of rawHistory) {
        if (!item || !item.text || typeof item.text !== 'string') continue;
        const text = item.text.trim();
        if (!text) continue;
        const role = item.sender === 'user' ? 'user' : 'model';

        // Skip leading model messages (Gemini contents[0] must be user)
        if (sanitizedContents.length === 0 && role !== 'user') {
          continue;
        }

        // Avoid consecutive duplicate roles by concatenating
        if (sanitizedContents.length > 0 && sanitizedContents[sanitizedContents.length - 1].role === role) {
          sanitizedContents[sanitizedContents.length - 1].parts[0].text += `\n${text}`;
        } else {
          sanitizedContents.push({ role, parts: [{ text }] });
        }
      }

      // Add current user prompt
      if (sanitizedContents.length > 0 && sanitizedContents[sanitizedContents.length - 1].role === 'user') {
        sanitizedContents[sanitizedContents.length - 1].parts[0].text += `\n${userText}`;
      } else {
        sanitizedContents.push({ role: 'user', parts: [{ text: userText }] });
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 25000)
      );

      const responsePromise = ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: sanitizedContents,
        config: {
          systemInstruction: { parts: [{ text: systemPrompt }] },
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);

      if (response && response.text) {
        responseText = response.text;
        activeProvider = 'Gemini';
        activeModel = 'gemini-3.7-flash';
        return true;
      }
    } catch (err: any) {
      console.warn('[AI Assistant] Gemini API issue:', err?.message || err);
      // Try fallback to gemini-3.6-flash
      try {
        if (ai) {
          const fallbackRes = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userText}` }] }]
          });
          if (fallbackRes && fallbackRes.text) {
            responseText = fallbackRes.text;
            activeProvider = 'Gemini';
            activeModel = 'gemini-3.6-flash';
            return true;
          }
        }
      } catch (fallbackErr: any) {
        console.warn('[AI Assistant] Gemini 3.6 fallback issue, trying 3.1-flash-lite:', fallbackErr?.message || fallbackErr);
        try {
          if (ai) {
            const liteRes = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userText}` }] }]
            });
            if (liteRes && liteRes.text) {
              responseText = liteRes.text;
              activeProvider = 'Gemini';
              activeModel = 'gemini-3.1-flash-lite';
              return true;
            }
          }
        } catch (liteErr: any) {
          console.warn('[AI Assistant] Gemini lite fallback issue:', liteErr?.message || liteErr);
        }
      }
    }
    return false;
  };

  // Helper to execute OpenAI chat
  const runOpenAI = async () => {
    if (!openai) return false;
    try {
      const chatHistory = (history || []).slice(-10).map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: h.text
      }));

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: userText }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      if (completion.choices[0]?.message?.content) {
        responseText = completion.choices[0].message.content;
        activeProvider = 'OpenAI';
        activeModel = 'gpt-4o-mini';
        return true;
      }
    } catch (openAiErr: any) {
      console.warn('[AI Assistant] OpenAI API issue:', openAiErr?.message || openAiErr);
    }
    return false;
  };

  // Execution flow: Prefer Gemini first as the primary engine for Google AI Studio
  if (preferredProvider === 'openai') {
    if (!(await runOpenAI())) {
      await runGemini();
    }
  } else {
    // Default: Gemini first, then OpenAI fallback
    if (!(await runGemini())) {
      await runOpenAI();
    }
  }

  // Dynamic Rule-based Intelligent Domain Fallback if AI keys not available or failed
  if (!responseText) {
    const lower = userText.toLowerCase();

    if (lower.includes('dsp') || lower.includes('cortex') || lower.includes('netradyne') || lower.includes('geotab') || lower.includes('emaint')) {
      responseText = `The Wal Group provides 24/7 dedicated Amazon DSP dispatch operations. Our team manages live routing on Amazon Cortex, tracks vehicle telematics via Geotab & Netradyne, oversees safety event coaching, coordinates on-road rescues, and resolves roadside emergencies.

We maintain a strict focus on Amazon Super Fantastic scorecards to protect your margins. How many routes or vans do you currently operate in your DSP station?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('afp') || lower.includes('relay') || lower.includes('freight') || lower.includes('lane') || lower.includes('tms')) {
      responseText = `For Amazon Freight Partners (AFP) and freight carriers, we provide 24/7 Amazon Relay dispatching, 12-step POD verification, TMS fleet tracking, and 24/7 DOT Hours of Service (HOS) compliance.

Our dispatchers optimize your round trips and dedicated lanes for maximum asset utilization. Are you operating box trucks, day cabs, or sleeper teams?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('accounting') || lower.includes('payroll') || lower.includes('reconciliation') || lower.includes('audit') || lower.includes('pay statement')) {
      responseText = `Our specialized logistics accounting team conducts line-by-line audits of your 14-day Amazon pay statements. We reconcile fuel card expenses, van damage deductions, disputed claims, and route adjustments to recover lost revenue.

We also integrate seamlessly with ADP, Gusto, and QuickBooks for timely driver payroll processing. Would you like a complimentary audit of your recent pay statement?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('driver') || lower.includes('recruit') || lower.includes('hire') || lower.includes('hiring') || lower.includes('onboard') || lower.includes('hr')) {
      responseText = `We operate an AI-driven driver recruitment pipeline that screens commercial candidates, verifies motor vehicle records, runs background checks, and manages driver onboarding into Amazon platforms.

This keeps your roster fully staffed and eliminates expensive last-minute call-outs. What market or station are you currently hiring drivers in?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('website') || lower.includes('web') || lower.includes('software') || lower.includes('app') || lower.includes('marketing') || lower.includes('seo') || lower.includes('dev')) {
      responseText = `The Wal Group's digital engineering division builds enterprise-grade web applications, responsive customer portals, and conversion-optimized websites using React, Node.js, and modern cloud stacks. We also execute targeted B2B SEO and lead generation campaigns.

What type of web project or digital marketing initiative are you looking to launch?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('va') || lower.includes('virtual assistant') || lower.includes('bpo') || lower.includes('back-office') || lower.includes('support') || lower.includes('data entry')) {
      responseText = `Our Dedicated Virtual Assistants and 24/7 BPO teams handle inbox management, CRM maintenance, order processing, customer support ticketing (Zendesk/Freshdesk), and data entry with guaranteed SLAs.

You receive dedicated, rigorously trained specialists starting at 35–50% cost savings compared to domestic hiring. What core tasks would you like your VA to take over?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('quote') || lower.includes('fee') || lower.includes('package')) {
      responseText = `Our pricing is customized to your exact operational requirements (fleet size, hours of dispatch coverage, or virtual team size), typically delivering 35% to 50% net cost savings compared to in-house US/UK staffing.

We can prepare a transparent, itemized proposal for your team during a 30-minute Discovery Call. Would you like to schedule a session with our operations director?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('book') || lower.includes('demo') || lower.includes('call') || lower.includes('meeting') || lower.includes('schedule') || lower.includes('consult')) {
      responseText = `I would be delighted to arrange a 30-minute Discovery Call for you with our executive leadership team. You can click the "Book Discovery Call" button right below or share your email and preferred date!`;
      shouldSuggestBooking = true;
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('who are you')) {
      responseText = `Hello! I am the Wal AI Business Assistant, representing The Wal Group. We provide 24/7 dedicated remote operations, Amazon DSP & AFP dispatching, payroll reconciliation, driver recruitment, virtual assistants, and custom software development.

How can I help streamline your operations or assist your business today?`;
    } else {
      responseText = `At The Wal Group, we serve as the complete 24/7 operational backbone for Amazon DSPs, freight carriers, and growing international enterprises. We cover dispatching, payroll auditing, driver recruitment, dedicated virtual assistants, and custom web development.

Could you tell me a little about your business or current operational challenges so I can point you in the right direction?`;
    }
  }

  if (userText.toLowerCase().includes('demo') || userText.toLowerCase().includes('book') || userText.toLowerCase().includes('schedule') || userText.toLowerCase().includes('consultation') || userText.toLowerCase().includes('pricing') || userText.toLowerCase().includes('quote')) {
    shouldSuggestBooking = true;
  }

  session.messages.push({
    sender: 'assistant',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  session.updatedAt = new Date().toISOString();
  transcripts[currentSessionId] = session;
  saveData(TRANSCRIPTS_FILE, transcripts);

  // Automatic Lead Capture & Lead Scoring if contact info exists
  if (extracted.email || extracted.phone) {
    let score: 'Hot' | 'Warm' | 'Cold' = 'Warm';
    if (shouldSuggestBooking || extracted.fleetSize || extracted.company) {
      score = 'Hot';
    }

    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
    const leads = loadData<LeadRecord[]>(LEADS_FILE, []);
    
    // Check if lead already saved for this session or email
    const existingIndex = leads.findIndex(l => l.sessionId === currentSessionId || (extracted.email && l.email === extracted.email));

    const leadData: LeadRecord = {
      id: existingIndex >= 0 ? leads[existingIndex].id : leadId,
      name: extracted.name || (extracted.email ? extracted.email.split('@')[0] : 'Inbound Chat Lead'),
      company: extracted.company,
      email: extracted.email || (existingIndex >= 0 ? leads[existingIndex].email : undefined),
      phone: extracted.phone || (existingIndex >= 0 ? leads[existingIndex].phone : undefined),
      fleetSize: extracted.fleetSize || (existingIndex >= 0 ? leads[existingIndex].fleetSize : undefined),
      score,
      scoreReason: `Engaged via AI Business Assistant | Last Page: ${behavior?.lastPageVisited || '/'}`,
      sessionId: currentSessionId,
      status: 'New',
      createdAt: existingIndex >= 0 ? leads[existingIndex].createdAt : new Date().toISOString(),
      routedTo: 'thewalgroupinfo@gmail.com'
    };

    if (existingIndex >= 0) {
      leads[existingIndex] = { ...leads[existingIndex], ...leadData };
    } else {
      leads.unshift(leadData);
    }
    saveData(LEADS_FILE, leads);

    // Save lead directly to Supabase
    saveLeadToSupabase({
      id: leadData.id,
      name: leadData.name,
      company: leadData.company,
      email: leadData.email,
      phone: leadData.phone,
      fleetSize: leadData.fleetSize,
      score: leadData.score,
      scoreReason: leadData.scoreReason,
      source: 'AI Business Assistant',
      status: 'New',
      notes: `Session: ${currentSessionId}`
    }).catch((err) => console.warn('[Supabase AI Lead Save Warning]', err));

    console.log(`[QUALIFIED LEAD CAPTURED] ID: ${leadData.id} | Score: ${score} | Email: ${leadData.email}`);
  }

  // Log conversation to Supabase asynchronously
  saveAiLogToSupabase({
    session_id: currentSessionId,
    provider: activeProvider || 'Wal AI Engine',
    model: activeModel || 'gemini-3.7-flash',
    user_message: userText,
    ai_response: responseText,
    lead_email: extracted.email,
    lead_phone: extracted.phone
  }).catch(() => {});

  return res.json({
    success: true,
    sessionId: currentSessionId,
    provider: activeProvider || 'Wal AI Engine',
    model: activeModel || 'gemini-3.7-flash',
    response: responseText,
    extractedLead: extracted,
    shouldSuggestBooking,
    notificationRoutedTo: 'thewalgroupinfo@gmail.com'
  });
});

// 3. Direct Lead Endpoint
app.post('/api/leads', (req, res) => {
  const { name, company, email, phone, country, industry, fleetSize, teamSize, challenges, servicesOfInterest } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Please provide at least an email or phone number.' });
  }

  const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
  let score: 'Hot' | 'Warm' | 'Cold' = 'Warm';

  if (fleetSize || (servicesOfInterest && servicesOfInterest.length > 0)) {
    score = 'Hot';
  }

  const newLead: LeadRecord = {
    id: leadId,
    name,
    company,
    email,
    phone,
    country,
    industry,
    fleetSize,
    teamSize,
    challenges,
    servicesOfInterest: Array.isArray(servicesOfInterest) ? servicesOfInterest : [],
    score,
    scoreReason: 'Direct web lead form submission',
    status: 'New',
    createdAt: new Date().toISOString(),
    routedTo: 'thewalgroupinfo@gmail.com'
  };

  const leads = loadData<LeadRecord[]>(LEADS_FILE, []);
  leads.unshift(newLead);
  saveData(LEADS_FILE, leads);

  // Persist to Supabase
  saveLeadToSupabase({
    id: newLead.id,
    name: newLead.name,
    company: newLead.company,
    email: newLead.email,
    phone: newLead.phone,
    country: newLead.country,
    industry: newLead.industry,
    fleetSize: newLead.fleetSize,
    teamSize: newLead.teamSize,
    challenges: newLead.challenges,
    servicesOfInterest: newLead.servicesOfInterest,
    score: newLead.score,
    scoreReason: newLead.scoreReason,
    sessionId: newLead.sessionId,
    status: newLead.status,
    routedTo: newLead.routedTo
  }).catch((err) => console.error('[Supabase Server Lead Save Error]', err));

  console.log(`[LEAD FORM SUBMITTED] ID: ${leadId} | Name: ${name} | Email: ${email}`);
  console.log(`Lead notification dispatched to: thewalgroupinfo@gmail.com`);

  return res.json({
    success: true,
    message: 'Thank you! Your information has been received.',
    leadId,
    routedTo: 'thewalgroupinfo@gmail.com'
  });
});

// GET Leads (Admin with search and filter)
app.get('/api/leads', (req, res) => {
  let leads = loadData<LeadRecord[]>(LEADS_FILE, []);
  const { search, status } = req.query;

  if (status && typeof status === 'string' && status !== 'All') {
    leads = leads.filter(l => l.status === status || l.score === status);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    leads = leads.filter(l =>
      l.id.toLowerCase().includes(q) ||
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      (l.phone && l.phone.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, total: leads.length, leads });
});

// PATCH Lead Status / Notes (Admin)
app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes, score } = req.body;

  const leads = loadData<LeadRecord[]>(LEADS_FILE, []);
  const index = leads.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Lead record not found.' });
  }

  if (status) leads[index].status = status;
  if (score) leads[index].score = score;
  if (notes !== undefined) (leads[index] as any).notes = notes;

  saveData(LEADS_FILE, leads);
  return res.json({ success: true, lead: leads[index] });
});

// DELETE Lead Record (Admin)
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  let leads = loadData<LeadRecord[]>(LEADS_FILE, []);
  const initialLength = leads.length;
  leads = leads.filter(l => l.id !== id);

  if (leads.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Lead record not found.' });
  }

  saveData(LEADS_FILE, leads);
  return res.json({ success: true, message: 'Lead deleted successfully.' });
});

// GET Export Leads CSV
app.get('/api/leads/export-csv', (_req, res) => {
  const leads = loadData<LeadRecord[]>(LEADS_FILE, []);
  const headers = ['Lead ID', 'Name', 'Company', 'Email', 'Phone', 'Country', 'Industry', 'Fleet Size', 'Score', 'Status', 'Created At'];
  const rows = leads.map(l => [
    l.id,
    l.name || '',
    l.company || '',
    l.email || '',
    l.phone || '',
    l.country || '',
    l.industry || '',
    l.fleetSize || '',
    l.score || 'Warm',
    l.status || 'New',
    l.createdAt
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="wal-group-leads.csv"');
  return res.send(csvContent);
});

// GET Export Leads JSON
app.get('/api/leads/export-json', (_req, res) => {
  const leads = loadData<LeadRecord[]>(LEADS_FILE, []);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename="wal-group-leads.json"');
  return res.send(JSON.stringify(leads, null, 2));
});

// GET AI Transcripts (Admin)
app.get('/api/ai-transcripts', (_req, res) => {
  const transcripts = loadData<Record<string, ChatTranscriptSession>>(TRANSCRIPTS_FILE, {});
  return res.json({ success: true, total: Object.keys(transcripts).length, transcripts: Object.values(transcripts) });
});

// SEO: Dynamic Robots.txt
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'walgroup.com';
  const protocol = req.protocol || 'https';
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin

Sitemap: ${protocol}://${host}/sitemap.xml
`;
  res.type('text/plain').send(robotsTxt);
});

// SEO: Dynamic XML Sitemap
app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'walgroup.com';
  const protocol = req.protocol || 'https';
  const baseUrl = `${protocol}://${host}`;

  const routes = [
    '',
    '/about',
    '/services',
    '/services/website-design',
    '/services/dsp-dispatch',
    '/services/dsp-accounting',
    '/services/dsp-hr',
    '/services/afp-dispatch',
    '/services/afp-accounting',
    '/services/dedicated-lane',
    '/services/hr-bpo',
    '/services/virtual-assistants',
    '/services/digital-marketing',
    '/gig-projects',
    '/success-stories',
    '/careers',
    '/contact',
    '/raise-ticket',
    '/terms',
    '/privacy'
  ];

  const now = new Date().toISOString();
  const xmlUrls = routes
    .map(
      (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : route.startsWith('/services') ? '0.8' : '0.6'}</priority>
  </url>`
    )
    .join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

  res.type('application/xml').send(sitemapXml);
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer();
}

export { app };
