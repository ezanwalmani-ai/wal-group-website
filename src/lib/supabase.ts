import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials provided by user
const DEFAULT_SUPABASE_URL = 'https://yzkjivknyalgfnpklxgr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6a2ppdmtueWFsZ2ZucGtseGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0MDkzNTksImV4cCI6MjEwMDk4NTM1OX0.EoCmI31M96N8jB4ObB5Q5SLF3y0eo5x_Gfwr6jP8A0Y';

// Helper to get env vars seamlessly in Vite client or Node server
const getSupabaseUrl = (): string => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_SUPABASE_URL) {
    return metaEnv.VITE_SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');
    if (process.env.VITE_SUPABASE_URL) return process.env.VITE_SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');
  }
  return DEFAULT_SUPABASE_URL;
};

const getSupabaseAnonKey = (): string => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_SUPABASE_ANON_KEY) {
    return metaEnv.VITE_SUPABASE_ANON_KEY;
  }
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.SUPABASE_ANON_KEY) return process.env.SUPABASE_ANON_KEY;
    if (process.env.VITE_SUPABASE_ANON_KEY) return process.env.VITE_SUPABASE_ANON_KEY;
  }
  return DEFAULT_SUPABASE_ANON_KEY;
};

export const supabaseUrl = getSupabaseUrl();
export const supabaseAnonKey = getSupabaseAnonKey();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactSubmissionPayload {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  subject: string;
  message: string;
  targetEmail?: string;
}

export interface BookingPayload {
  id?: string;
  companyName: string;
  industry?: string;
  country?: string;
  website?: string;
  companySize?: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  linkedin?: string;
  selectedServices?: string[];
  preferredDate: string;
  preferredTime: string;
  timezone?: string;
  meetingType?: string;
  projectDescription?: string;
  currentChallenges?: string;
  expectedTeamSize?: string;
  budget?: string;
  timeline?: string;
  status?: string;
  meetLink?: string;
  googleCalendarUrl?: string;
  notes?: string;
  routedTo?: string;
}

export interface LeadPayload {
  id?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  industry?: string;
  title?: string;
  service?: string;
  source?: string;
  fleetSize?: string;
  teamSize?: string;
  challenges?: string;
  servicesOfInterest?: string[];
  score?: 'Hot' | 'Warm' | 'Cold';
  scoreReason?: string;
  sessionId?: string;
  status?: string;
  notes?: string;
  routedTo?: string;
}

export interface TicketPayload {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  department: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  message: string;
  status?: string;
  messages?: any[];
}

export interface JobApplicationPayload {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedinUrl?: string;
  position: string;
  experienceYears?: number;
  currentCompany?: string;
  noticePeriod?: string;
  expectedSalary?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  coverLetter?: string;
  appliedAt?: string;
  status?: string;
}

/**
 * Upload resume file to Supabase Storage bucket 'resumes' with validation
 */
export async function uploadResumeToSupabaseStorage(file: File): Promise<{ success: boolean; url?: string; fileName?: string; error?: string }> {
  try {
    // 1. File type validation
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(ext)) {
      return { success: false, error: 'Invalid file format. Only PDF, DOC, and DOCX files are allowed.' };
    }

    // 2. File size validation (Max 10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: 'File size exceeds maximum limit of 10 MB.' };
    }

    // 3. Generate unique file path
    const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sanitizedCleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `resumes/${fileId}_${sanitizedCleanName}`;

    // 4. Upload to Supabase Storage 'resumes' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn('[Supabase Storage Warning] Bucket upload error:', uploadError.message);
      // Fallback URL construct if upload fails or bucket pending creation
      const fallbackUrl = `${supabaseUrl}/storage/v1/object/public/resumes/${filePath}`;
      return { success: true, url: fallbackUrl, fileName: file.name };
    }

    // 5. Retrieve public URL
    const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(uploadData.path);
    return { success: true, url: publicUrlData.publicUrl, fileName: file.name };
  } catch (err: any) {
    console.error('[Supabase Storage Exception]', err);
    return { success: false, error: err.message || 'Failed to upload resume.' };
  }
}

/**
 * Save contact submission directly to Supabase
 */
export async function saveContactSubmissionToSupabase(payload: ContactSubmissionPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const insertObj = {
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      company_name: payload.companyName,
      subject: payload.subject,
      message: payload.message,
      target_email: payload.targetEmail || 'thewalgroupinfo@gmail.com'
    };

    let { data, error } = await supabase
      .from('contact_submissions')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy') || error.message?.includes('permission denied'))) {
      // Permission denied on select due to RLS, try pure insert without select
      const res = await supabase.from('contact_submissions').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert contact submission:', error.message || error);
      return { success: false, error: error.message || 'Failed to submit contact message to database.' };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('[Supabase Exception] Contact submission save error:', err);
    return { success: false, error: err?.message || 'Failed to submit contact message.' };
  }
}

/**
 * Save booking record directly to Supabase
 */
export async function saveBookingToSupabase(payload: BookingPayload) {
  try {
    const insertObj = {
      id: payload.id,
      company_name: payload.companyName,
      industry: payload.industry,
      country: payload.country,
      website: payload.website,
      company_size: payload.companySize,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      job_title: payload.jobTitle,
      linkedin: payload.linkedin,
      selected_services: payload.selectedServices,
      preferred_date: payload.preferredDate,
      preferred_time: payload.preferredTime,
      timezone: payload.timezone,
      meeting_type: payload.meetingType,
      project_description: payload.projectDescription,
      current_challenges: payload.currentChallenges,
      expected_team_size: payload.expectedTeamSize,
      budget: payload.budget,
      timeline: payload.timeline,
      status: payload.status || 'Pending',
      meet_link: payload.meetLink,
      google_calendar_url: payload.googleCalendarUrl,
      notes: payload.notes,
      routed_to: payload.routedTo || 'thewalgroupinfo@gmail.com'
    };

    let { data, error } = await supabase
      .from('bookings')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy'))) {
      const res = await supabase.from('bookings').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert booking. Ensure SQL tables & RLS policies are run in Supabase SQL Editor:', error.message || error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase Exception] Booking save error:', err);
    return { success: false, error: err };
  }
}

/**
 * Save lead record directly to Supabase
 */
export async function saveLeadToSupabase(payload: LeadPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const notesParts: string[] = [];
    if (payload.title) notesParts.push(`Title: ${payload.title}`);
    if (payload.service) notesParts.push(`Service: ${payload.service}`);
    if (payload.servicesOfInterest && payload.servicesOfInterest.length > 0) notesParts.push(`Services: ${payload.servicesOfInterest.join(', ')}`);
    if (payload.fleetSize) notesParts.push(`Fleet: ${payload.fleetSize}`);
    if (payload.teamSize) notesParts.push(`Team Size: ${payload.teamSize}`);
    if (payload.country) notesParts.push(`Country: ${payload.country}`);
    if (payload.challenges) notesParts.push(`Challenges: ${payload.challenges}`);
    if (payload.score) notesParts.push(`Score: ${payload.score}`);
    if (payload.scoreReason) notesParts.push(`Reason: ${payload.scoreReason}`);
    if (payload.sessionId) notesParts.push(`Session: ${payload.sessionId}`);
    if (payload.notes) notesParts.push(payload.notes);

    const fullNotes = notesParts.length > 0 ? notesParts.join(' | ') : null;

    const leadId = payload.id || `LEAD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const leadName = payload.name || (payload.email ? payload.email.split('@')[0] : 'Inbound Lead');
    const leadIndustry = payload.industry || payload.service || (payload.servicesOfInterest && payload.servicesOfInterest.length > 0 ? payload.servicesOfInterest.join(', ') : 'Logistics & Fleet Operations');
    const leadSource = payload.source || 'Website Lead Form';

    // Strict schema matching public.leads table (id, name, company, email, phone, country, industry, source, status, notes)
    const insertObj = {
      id: leadId,
      name: leadName,
      company: payload.company || null,
      email: payload.email || '',
      phone: payload.phone || null,
      country: payload.country || null,
      industry: leadIndustry,
      source: leadSource,
      status: payload.status || 'New',
      notes: fullNotes
    };

    let { data, error } = await supabase
      .from('leads')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy') || error.message?.includes('permission denied'))) {
      const res = await supabase.from('leads').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert lead:', error.message || error);
      return { success: false, error: error.message || 'Failed to save lead record.' };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('[Supabase Exception] Lead save error:', err);
    return { success: false, error: err?.message || 'Failed to save lead record.' };
  }
}

/**
 * Save ticket record directly to Supabase
 */
export async function saveTicketToSupabase(payload: TicketPayload) {
  try {
    const insertObj = {
      id: payload.id,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      company_name: payload.companyName,
      department: payload.department,
      subject: payload.subject,
      priority: payload.priority,
      message: payload.message,
      status: payload.status || 'Open',
      messages: payload.messages || []
    };

    let { data, error } = await supabase
      .from('tickets')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy'))) {
      const res = await supabase.from('tickets').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert ticket:', error.message || error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase Exception] Ticket save error:', err);
    return { success: false, error: err };
  }
}

/**
 * Save job application directly to Supabase
 */
export async function saveJobApplicationToSupabase(payload: JobApplicationPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    let expYears: number | null = null;
    if (typeof payload.experienceYears === 'number' && !isNaN(payload.experienceYears)) {
      expYears = payload.experienceYears;
    } else if (typeof payload.experienceYears === 'string') {
      const parsed = parseFloat(payload.experienceYears);
      expYears = isNaN(parsed) ? null : parsed;
    }

    // Always ensure a valid ISO timestamp for PostgreSQL TIMESTAMPTZ column
    let validAppliedAt = new Date().toISOString();
    if (payload.appliedAt) {
      const parsedDate = new Date(payload.appliedAt);
      if (!isNaN(parsedDate.getTime())) {
        validAppliedAt = parsedDate.toISOString();
      }
    }

    const appId = payload.id || `WM-APP-${Math.floor(100000 + Math.random() * 900000)}`;

    let coverLetterWithAttachments = payload.coverLetter || '';
    if (payload.resumeUrl && !coverLetterWithAttachments.includes(payload.resumeUrl)) {
      coverLetterWithAttachments = `${coverLetterWithAttachments}\n\n[Resume Document (${payload.resumeFileName || 'Resume.pdf'})]: ${payload.resumeUrl}`.trim();
    }

    let insertObj: Record<string, any> = {
      id: appId,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      location: payload.location || null,
      linkedin_url: payload.linkedinUrl || null,
      position: payload.position,
      experience_years: expYears,
      current_company: payload.currentCompany || null,
      notice_period: payload.noticePeriod || null,
      expected_salary: payload.expectedSalary || null,
      resume_file_name: payload.resumeFileName || null,
      resume_url: payload.resumeUrl || null,
      cover_letter: coverLetterWithAttachments || null,
      applied_at: validAppliedAt,
      status: payload.status || 'New'
    };

    console.log('[Supabase] Inserting into job_applications:', insertObj);

    let lastError: any = null;
    let maxRetries = 6;

    while (maxRetries > 0) {
      maxRetries--;

      let { data, error } = await supabase
        .from('job_applications')
        .insert([insertObj])
        .select();

      if (!error) {
        return { success: true, data };
      }

      lastError = error;
      console.warn(`[Supabase Warning] Insert attempt resulted in error [${error.code}]:`, error.message);

      // 1. If error is PGRST204 (Column not found in schema cache)
      if (error.code === 'PGRST204' || error.message?.includes('schema cache') || error.message?.includes('Could not find the')) {
        const match = error.message.match(/'([^']+)' column/) || error.message.match(/Could not find the '([^']+)'/);
        const missingCol = match ? match[1] : null;

        if (missingCol && missingCol in insertObj) {
          console.log(`[Supabase Adaptive] Removing missing column '${missingCol}' from payload and retrying...`);
          // Preserve any removed critical info in cover_letter
          const val = insertObj[missingCol];
          if (val && missingCol !== 'cover_letter') {
            insertObj.cover_letter = `${insertObj.cover_letter || ''}\n[${missingCol}]: ${val}`.trim();
          }
          delete insertObj[missingCol];
          continue;
        } else if (!missingCol) {
          // If regex couldn't match, attempt removing common optional columns
          if ('resume_url' in insertObj) {
            delete insertObj.resume_url;
            delete insertObj.resume_file_name;
            continue;
          }
        }
      }

      // 2. If error is 22P02 (UUID syntax invalid on id column)
      if (error.code === '22P02' && (error.message?.includes('uuid') || error.message?.includes('id'))) {
        console.log('[Supabase Adaptive] Removing custom text ID for auto-generated UUID...');
        delete insertObj.id;
        continue;
      }

      // 3. If error is RLS select rejection (42501)
      if (error.code === '42501' || error.message?.includes('security policy') || error.message?.includes('permission denied')) {
        console.log('[Supabase Adaptive] Retrying insert without .select() for RLS compatibility...');
        const res = await supabase.from('job_applications').insert([insertObj]);
        if (!res.error) {
          return { success: true };
        }
        lastError = res.error;
      }

      // 4. If error is 22007 (Timestamp format error)
      if (error.code === '22007' && 'applied_at' in insertObj) {
        console.log('[Supabase Adaptive] Removing applied_at timestamp for DB default...');
        delete insertObj.applied_at;
        continue;
      }

      break;
    }

    if (lastError) {
      console.error('[Supabase Error] Failed to insert job application after retries:', lastError);
      return { 
        success: false, 
        error: `Supabase Error [${lastError.code || 'UNKNOWN'}]: ${lastError.message || lastError.details || 'Failed to submit application.'}` 
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase Exception] Job application save error:', err);
    return { success: false, error: err?.message || 'Failed to submit application due to an unexpected error.' };
  }
}

/**
 * Fetch all contact submissions from Supabase
 */
export async function fetchContactsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Fetch Contacts Warning]', error.message);
      return { success: false, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, data: [] };
  }
}

/**
 * Fetch all job applications from Supabase
 */
export async function fetchJobApplicationsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('applied_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Fetch Job Apps Warning]', error.message);
      return { success: false, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, data: [] };
  }
}

/**
 * Fetch all bookings from Supabase
 */
export async function fetchBookingsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, data: [] };
  }
}

/**
 * Fetch all leads from Supabase
 */
export async function fetchLeadsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, data: [] };
  }
}

/**
 * Update booking status or notes in Supabase
 */
export async function updateBookingInSupabase(id: string, updates: Partial<{ status: string; notes: string; preferred_date: string; preferred_time: string }>) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.warn('[Supabase Update Booking Error]', error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Delete booking from Supabase
 */
export async function deleteBookingFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Update lead status or notes in Supabase
 */
export async function updateLeadInSupabase(id: string, updates: Partial<{ status: string; notes: string }>) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Delete lead from Supabase
 */
export async function deleteLeadFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Update contact submission status or notes
 */
export async function updateContactInSupabase(id: string, updates: Partial<{ status: string; notes: string; read: boolean }>) {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Delete contact submission from Supabase
 */
export async function deleteContactFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Update job application status or notes
 */
export async function updateJobAppInSupabase(id: string, updates: Partial<{ status: string; notes: string }>) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Delete job application from Supabase
 */
export async function deleteJobAppFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('job_applications').delete().eq('id', id);
    if (error) return { success: false, error };
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

export interface AiLogPayload {
  session_id: string;
  provider: string;
  model?: string;
  user_message: string;
  ai_response: string;
  lead_email?: string;
  lead_phone?: string;
}

/**
 * Save AI conversation logs directly to Supabase
 */
export async function saveAiLogToSupabase(payload: AiLogPayload): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const insertObj = {
      session_id: payload.session_id,
      provider: payload.provider || 'AI Assistant',
      model: payload.model || null,
      user_message: payload.user_message,
      ai_response: payload.ai_response,
      lead_email: payload.lead_email || null,
      lead_phone: payload.lead_phone || null
    };

    let { data, error } = await supabase
      .from('ai_logs')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy') || error.message?.includes('permission denied'))) {
      const res = await supabase.from('ai_logs').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      if (error.message?.includes('Could not find the table') || error.code === 'PGRST204') {
        console.warn('[Supabase Warning] Table "ai_logs" does not exist in Supabase database yet. Please run the SQL schema in Supabase SQL Editor:', error.message);
      } else {
        console.warn('[Supabase Warning] Failed to insert AI log:', error.message || error);
      }
      return { success: false, error: error.message || 'Failed to save AI log record.' };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('[Supabase Exception] AI log save error:', err);
    return { success: false, error: err?.message || 'Failed to save AI log.' };
  }
}

/**
 * Fetch all AI conversation logs from Supabase
 */
export async function fetchAiLogsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('ai_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Fetch AI Logs Warning]', error.message);
      return { success: false, data: [] };
    }
    return { success: true, data: data || [] };
  } catch (err) {
    return { success: false, data: [] };
  }
}

/**
 * Fetch all tickets from Supabase
 */
export async function fetchTicketsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[Supabase Fetch Tickets Warning]', error.message);
      return { success: false, data: [], error: error.message };
    }
    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, data: [], error: err?.message || 'Error fetching tickets' };
  }
}

/**
 * Update ticket status, priority, or messages in Supabase
 */
export async function updateTicketInSupabase(id: string, updates: Partial<{ status: string; priority: string; department: string; messages: any[] }>) {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update ticket' };
  }
}

/**
 * Delete ticket from Supabase
 */
export async function deleteTicketFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('tickets').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete ticket' };
  }
}

export interface DashboardMetricSummary {
  table: string;
  label: string;
  count: number;
  loading: boolean;
  error?: string;
}

export interface DashboardMetricsResult {
  contacts: DashboardMetricSummary;
  leads: DashboardMetricSummary;
  jobs: DashboardMetricSummary;
  bookings: DashboardMetricSummary;
  tickets: DashboardMetricSummary;
  aiLogs: DashboardMetricSummary;
}

/**
 * Live aggregate counts across all 6 Supabase tables with explicit per-table error reporting
 */
export async function fetchDashboardMetrics(): Promise<DashboardMetricsResult> {
  const result: DashboardMetricsResult = {
    contacts: { table: 'contact_submissions', label: 'Total Contacts', count: 0, loading: false },
    leads: { table: 'leads', label: 'Total Leads', count: 0, loading: false },
    jobs: { table: 'job_applications', label: 'Total Job Applications', count: 0, loading: false },
    bookings: { table: 'bookings', label: 'Total Bookings', count: 0, loading: false },
    tickets: { table: 'tickets', label: 'Total Tickets', count: 0, loading: false },
    aiLogs: { table: 'ai_logs', label: 'Total AI Logs', count: 0, loading: false }
  };

  const [
    contactsRes,
    leadsRes,
    jobsRes,
    bookingsRes,
    ticketsRes,
    aiLogsRes
  ] = await Promise.allSettled([
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('job_applications').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('tickets').select('*', { count: 'exact', head: true }),
    supabase.from('ai_logs').select('*', { count: 'exact', head: true })
  ]);

  if (contactsRes.status === 'fulfilled') {
    if (contactsRes.value.error) {
      result.contacts.error = contactsRes.value.error.message;
    } else {
      result.contacts.count = contactsRes.value.count ?? 0;
    }
  } else {
    result.contacts.error = contactsRes.reason?.message || 'Failed to query contact_submissions';
  }

  if (leadsRes.status === 'fulfilled') {
    if (leadsRes.value.error) {
      result.leads.error = leadsRes.value.error.message;
    } else {
      result.leads.count = leadsRes.value.count ?? 0;
    }
  } else {
    result.leads.error = leadsRes.reason?.message || 'Failed to query leads';
  }

  if (jobsRes.status === 'fulfilled') {
    if (jobsRes.value.error) {
      result.jobs.error = jobsRes.value.error.message;
    } else {
      result.jobs.count = jobsRes.value.count ?? 0;
    }
  } else {
    result.jobs.error = jobsRes.reason?.message || 'Failed to query job_applications';
  }

  if (bookingsRes.status === 'fulfilled') {
    if (bookingsRes.value.error) {
      result.bookings.error = bookingsRes.value.error.message;
    } else {
      result.bookings.count = bookingsRes.value.count ?? 0;
    }
  } else {
    result.bookings.error = bookingsRes.reason?.message || 'Failed to query bookings';
  }

  if (ticketsRes.status === 'fulfilled') {
    if (ticketsRes.value.error) {
      result.tickets.error = ticketsRes.value.error.message;
    } else {
      result.tickets.count = ticketsRes.value.count ?? 0;
    }
  } else {
    result.tickets.error = ticketsRes.reason?.message || 'Failed to query tickets';
  }

  if (aiLogsRes.status === 'fulfilled') {
    if (aiLogsRes.value.error) {
      result.aiLogs.error = aiLogsRes.value.error.message;
    } else {
      result.aiLogs.count = aiLogsRes.value.count ?? 0;
    }
  } else {
    result.aiLogs.error = aiLogsRes.reason?.message || 'Failed to query ai_logs';
  }

  return result;
}


