-- ====================================================================
-- WAL GROUP SUPABASE PRODUCTION DATABASE SCHEMA & RLS POLICIES
-- ====================================================================

-- 1. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  country TEXT,
  website TEXT,
  company_size TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  job_title TEXT,
  linkedin TEXT,
  selected_services JSONB,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  timezone TEXT,
  meeting_type TEXT DEFAULT 'Google Meet',
  project_description TEXT,
  current_challenges TEXT,
  expected_team_size TEXT,
  budget TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'New',
  meet_link TEXT,
  google_calendar_url TEXT,
  notes TEXT,
  routed_to TEXT DEFAULT 'thewalgroupinfo@gmail.com',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS TABLE
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  title TEXT,
  service TEXT,
  source TEXT DEFAULT 'Website Form',
  status TEXT DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONTACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  notes TEXT,
  target_email TEXT DEFAULT 'thewalgroupinfo@gmail.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. JOB APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.job_applications (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  linkedin_url TEXT,
  position TEXT NOT NULL,
  experience_years NUMERIC,
  current_company TEXT,
  notice_period TEXT,
  expected_salary TEXT,
  resume_file_name TEXT,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STORAGE BUCKET FOR RESUMES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES (ALLOW PUBLIC INSERTS & ADMIN ALL OPERATIONS)
-- Bookings Policies
CREATE POLICY "Allow public inserts to bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read bookings for authenticated & anon" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow delete bookings" ON public.bookings FOR DELETE USING (true);

-- Leads Policies
CREATE POLICY "Allow public inserts to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow delete leads" ON public.leads FOR DELETE USING (true);

-- Contact Submissions Policies
CREATE POLICY "Allow public inserts to contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read contact_submissions" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow update contact_submissions" ON public.contact_submissions FOR UPDATE USING (true);
CREATE POLICY "Allow delete contact_submissions" ON public.contact_submissions FOR DELETE USING (true);

-- Job Applications Policies
CREATE POLICY "Allow public inserts to job_applications" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read job_applications" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Allow update job_applications" ON public.job_applications FOR UPDATE USING (true);
CREATE POLICY "Allow delete job_applications" ON public.job_applications FOR DELETE USING (true);

-- Storage Objects Policies for Resumes Bucket
CREATE POLICY "Allow public uploads to resumes bucket" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow public reads from resumes bucket" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resumes');

-- INDEXES FOR FAST SEARCH & FILTER PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_apps_applied_at ON public.job_applications(applied_at DESC);
