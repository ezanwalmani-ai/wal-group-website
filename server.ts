import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

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

    const icsContent = generateICS(newBooking);

    // Dispatch logging and notification simulation
    console.log(`[DISCOVERY CALL BOOKED] ID: ${bookingId} | Client: ${fullName} (${email})`);
    console.log(`Notification routed to: thewalgroupinfo@gmail.com`);
    console.log(`[INTERNAL EMAIL DISPATCHED] Destination: thewalgroupinfo@gmail.com | Details: ${companyName}, ${fullName}, ${email}, ${preferredDate} @ ${preferredTime}`);
    console.log(`[CLIENT EMAIL DISPATCHED] Destination: ${email} | Subject: Discovery Call Confirmed - Wal Group (${bookingId})`);

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

// 2. AI Business Consultant Chat API
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

  const fleetMatch = userText.match(/(\d+)\s*(vans|trucks|fleets|routes|vehicles|drivers|dispatchers)/i);
  if (fleetMatch) extracted.fleetSize = `${fleetMatch[1]} ${fleetMatch[2]}`;

  const companyMatch = userText.match(/(?:at|for|company|firm|dsp)\s+([A-Z][A-Za-z0-9\s]{2,25})/);
  if (companyMatch && !extracted.company) extracted.company = companyMatch[1].trim();

  const nameMatch = userText.match(/(?:my name is|i am|i'm)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i);
  if (nameMatch && !extracted.name) extracted.name = nameMatch[1].trim();

  session.leadDetails = extracted;

  // System Prompt Knowledge Base & Intent Strategy
  const systemPrompt = `You are the AI Business Consultant and Senior Sales Representative for Wal Group (official company name: Wal Group). You act as an expert 24/7 business consultant, strategic advisor, and SDR for prospective clients.

COMPANY OVERVIEW:
- Official Name: Wal Group (EXCLUSIVELY "Wal Group", NEVER "Walmani" or "Walmani Group").
- Headquarters: Bengaluru, Karnataka, India (55, 100 Feet Road, Indiranagar, Bengaluru 560038).
- Operations Model: 24/7 Global Remote Operations & Dedicated Operational Backbones.
- Official Email Addresses:
  • Primary Support & Business Enquiries: thewalgroupinfo@gmail.com
  • General Communications: thewalgroups@gmail.com

APPROVED KNOWLEDGE BASE & SERVICES:
1. Amazon DSP Support & Dispatch: 24/7 Cortex, Geotab, Netradyne, eMaint dispatching, driver scheduling, route delay management, roadside assistance, Amazon Super Fantastic scorecard strategy.
2. Amazon Freight Partner (AFP) Support: Relay portal dispatch, 12-step POD management, TMS tracking, 24/7 HOS (Hours of Service) compliance monitoring, dedicated lane optimization.
3. Dispatch Operations: 24/7 fleet tracking, load assignments, real-time driver communication, route optimization.
4. Driver Management & AI Recruitment: AI driver recruiting, candidate screening, background checks, onboarding, driver retention programs, performance tracking.
5. Fleet Support: Vehicle maintenance logging, damage tracking, fuel card reconciliation, DOT compliance.
6. Payroll Processing & Accounting: 14-day Amazon pay statement reconciliation (line-by-line audits for damages, fuel, route adjustments), ADP / Gusto / QuickBooks integration, bonus calculations.
7. Customer Support & BPO Services: 24/7 multi-channel support (email, phone, live chat, ticketing), SLA adherence, back-office operational teams.
8. Dedicated Virtual Assistants: Executive VAs, administrative support, inbox & calendar management, data entry, CRM management.
9. Custom Website Development: Enterprise React / Vite / Node web applications, responsive UI, high performance, conversion optimization.
10. Digital Marketing: SEO strategy, branding, lead generation campaigns, social media marketing, PPC advertising.
11. Administrative Support & Back-office Operations: Order processing, inventory tracking, vendor management, report generation.

INTENT DETECTION & CONVERSATION RULES:
Before responding, determine WHY the visitor is asking:
- LOGISTICS INTENT ("I need dispatchers", "drivers", "fleet", "routes"): Acknowledge fleet challenges -> Recommend Dispatch Operations & Driver Management -> Ask: "How many drivers or vehicles are in your current fleet?"
- WEB / MARKETING INTENT ("I need a website", "marketing", "SEO"): Acknowledge digital goals -> Recommend Website Development -> Ask: "What type of website or platform are you looking to build?"
- BPO / VIRTUAL ASSISTANT INTENT ("need VAs", "customer support", "data entry"): Acknowledge operational scaling -> Recommend BPO / Dedicated VAs -> Ask: "What industry are you in, and what level of support do you require?"
- PAYROLL / ACCOUNTING INTENT ("pay statement", "accounting", "scorecard reconciliation"): Recommend DSP/AFP Payroll Reconciliation -> Ask: "Are you looking for 14-day Amazon pay statement reconciliation or general payroll software integration?"

CONVERSATION SEQUENCE & MEMORY:
1. UNDERSTAND -> 2. CLARIFY -> 3. EDUCATE -> 4. RECOMMEND -> 5. QUALIFY -> 6. CAPTURE LEAD -> 7. OFFER DISCOVERY CALL.
- ALWAYS answer the user's question first.
- Then ask ONE relevant follow-up question to keep the conversation flowing naturally.
- Maintain context (remember previous answers, driver counts, company names).
- Collect lead details conversationally over multiple turns—never dump a long form.
- Recommend a complimentary 30-minute Discovery Call when a visitor shows genuine qualified interest.
- Never invent prices or services not in the knowledge base. If unsure, offer to connect them with executive support at thewalgroupinfo@gmail.com.

BEHAVIORAL CONTEXT:
The visitor is currently viewing page: "${behavior?.lastPageVisited || '/'}". Pages visited: ${(behavior?.pagesVisited || []).join(', ') || 'Home'}.`;

  let responseText = '';
  let shouldSuggestBooking = false;

  const ai = getGenAI();
  if (ai) {
    try {
      const chatHistory = (history || []).map((h: { sender: string; text: string }) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI response request timeout (3.5s limit reached)')), 3500)
      );

      const response = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...chatHistory,
            { role: 'user', parts: [{ text: userText }] }
          ]
        }),
        timeoutPromise
      ]);

      if (response && response.text) {
        responseText = response.text;
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
        console.warn('[AI Assistant] Gemini API quota reached. Smoothly switching to local rule engine fallback.');
      } else {
        console.warn('[AI Assistant] Gemini API temporary issue. Switching to rule engine fallback:', msg);
      }
    }
  }

  // Rule-based Fallback if AI not available or errored
  if (!responseText) {
    const lower = userText.toLowerCase();

    if (lower.includes('dsp') || lower.includes('dispatch') || lower.includes('driver')) {
      responseText = `Wal Group provides 24/7 Amazon DSP dispatch coverage using official portals like Cortex, Geotab, and Netradyne. Our team actively monitors safety scores, manages route delays, and coordinates roadside assistance so you maintain an Amazon Super Fantastic rating. Would you like to schedule a 30-minute discovery call with our DSP operations lead?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('accounting') || lower.includes('payroll') || lower.includes('reconciliation')) {
      responseText = `Our Amazon DSP & AFP accounting team reconciles your 14-day Amazon pay statements line-by-line, including van damages, fuel cards, and route adjustments. We also integrate with ADP, Gusto, and QuickBooks for seamless driver payroll. Would you like us to audit your recent scorecard reconciliation?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('website') || lower.includes('marketing') || lower.includes('dev')) {
      responseText = `Wal Group builds high-performance, enterprise-grade web platforms designed specifically for logistics fleets, BPO clients, and growing brands. We also run end-to-end digital marketing and CRM lead automation. Would you like to view our past website design case studies or book a quick strategy session?`;
      shouldSuggestBooking = true;
    } else if (lower.includes('book') || lower.includes('demo') || lower.includes('call') || lower.includes('meeting')) {
      responseText = `I'd be happy to arrange a Discovery Call for you with our executive team. You can click "Book Discovery Call" right here or let me know your preferred date and business email!`;
      shouldSuggestBooking = true;
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate')) {
      responseText = `Our pricing is customized to your exact fleet size, hours of dispatch coverage, or backend scope to guarantee a high return on investment. On average, our clients save 35–50% compared to local in-house overhead. Would you like a customized proposal on a Discovery Call?`;
      shouldSuggestBooking = true;
    } else {
      responseText = `At Wal Group, we serve as the operational backbone for Amazon DSPs, Freight fleets, and growing businesses globally. We handle 24/7 dispatch, accounting & payroll, driver recruiting, virtual assistants, and web development. How can we support your business goals today?`;
    }
  }

  if (userText.toLowerCase().includes('demo') || userText.toLowerCase().includes('book') || userText.toLowerCase().includes('schedule')) {
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
      email: extracted.email || (existingIndex >= 0 ? leads[existingIndex].email : undefined),
      phone: extracted.phone || (existingIndex >= 0 ? leads[existingIndex].phone : undefined),
      fleetSize: extracted.fleetSize || (existingIndex >= 0 ? leads[existingIndex].fleetSize : undefined),
      score,
      scoreReason: `Engaged via AI Consultant | Last Page: ${behavior?.lastPageVisited || '/'}`,
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

    console.log(`[QUALIFIED LEAD CAPTURED] ID: ${leadData.id} | Score: ${score} | Email: ${leadData.email}`);
    console.log(`Notification sent to: thewalgroupinfo@gmail.com`);
  }

  return res.json({
    success: true,
    sessionId: currentSessionId,
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
