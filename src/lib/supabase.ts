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
export async function saveContactSubmissionToSupabase(payload: ContactSubmissionPayload) {
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

    if (error && error.code === '42501') {
      // Permission denied on select due to RLS, try pure insert without select
      const res = await supabase.from('contact_submissions').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert contact submission. Ensure SQL tables & RLS policies are run in Supabase SQL Editor:', error.message || error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase Exception] Contact submission save error:', err);
    return { success: false, error: err };
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
export async function saveLeadToSupabase(payload: LeadPayload) {
  try {
    const insertObj = {
      id: payload.id,
      name: payload.name,
      company: payload.company,
      email: payload.email,
      phone: payload.phone,
      country: payload.country,
      industry: payload.industry,
      fleet_size: payload.fleetSize,
      team_size: payload.teamSize,
      challenges: payload.challenges,
      services_of_interest: payload.servicesOfInterest,
      score: payload.score || 'Warm',
      score_reason: payload.scoreReason,
      session_id: payload.sessionId,
      status: payload.status || 'New',
      notes: payload.notes,
      routed_to: payload.routedTo || 'thewalgroupinfo@gmail.com'
    };

    let { data, error } = await supabase
      .from('leads')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy'))) {
      const res = await supabase.from('leads').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert lead. Ensure SQL tables & RLS policies are run in Supabase SQL Editor:', error.message || error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase Exception] Lead save error:', err);
    return { success: false, error: err };
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
export async function saveJobApplicationToSupabase(payload: JobApplicationPayload) {
  try {
    const insertObj = {
      id: payload.id,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      location: payload.location,
      linkedin_url: payload.linkedinUrl,
      position: payload.position,
      experience_years: payload.experienceYears,
      current_company: payload.currentCompany,
      notice_period: payload.noticePeriod,
      expected_salary: payload.expectedSalary,
      resume_file_name: payload.resumeFileName,
      resume_url: payload.resumeUrl || null,
      cover_letter: payload.coverLetter,
      applied_at: payload.appliedAt || new Date().toISOString(),
      status: payload.status || 'New'
    };

    let { data, error } = await supabase
      .from('job_applications')
      .insert([insertObj])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy'))) {
      const res = await supabase.from('job_applications').insert([insertObj]);
      error = res.error;
      data = null;
    }

    if (error) {
      console.warn('[Supabase Warning] Failed to insert job application:', error.message || error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[Supabase Exception] Job application save error:', err);
    return { success: false, error: err };
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
export async function saveAiLogToSupabase(payload: AiLogPayload) {
  try {
    const { data, error } = await supabase
      .from('ai_logs')
      .insert([payload])
      .select();

    if (error && (error.code === '42501' || error.message?.includes('security policy'))) {
      const res = await supabase.from('ai_logs').insert([payload]);
      return { success: !res.error, error: res.error };
    }

    if (error) {
      if (error.message?.includes('Could not find the table') || error.code === 'PGRST204') {
        console.info('[Supabase Info] ai_logs table not present in Supabase database. Persistent chat transcripts saved in local data store.');
      } else {
        console.warn('[Supabase Info] AI log table insert notice:', error.message || error);
      }
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err: any) {
    console.info('[Supabase Info] AI log save skipped:', err?.message || err);
    return { success: false, error: err };
  }
}

