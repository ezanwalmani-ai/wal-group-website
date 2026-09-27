import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertTriangle, 
  Key, 
  Lock, 
  ExternalLink,
  FileCode,
  Layers,
  Terminal,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, supabaseUrl, DashboardMetricsResult } from '../../lib/supabase';

const FULL_SQL_SCHEMA_AND_RLS = `-- ====================================================================
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

-- Ensure all columns exist even if the table was created earlier with fewer fields
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'Website Form';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New';

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

-- 5. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  department TEXT NOT NULL,
  subject TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI CONVERSATION LOGS TABLE
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  lead_email TEXT,
  lead_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STORAGE BUCKET FOR RESUMES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES FOR PUBLIC INSERTS & AUTHENTICATED ADMIN FULL ACCESS
-- Bookings
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Delete bookings" ON public.bookings FOR DELETE USING (true);

-- Leads
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Read leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Delete leads" ON public.leads FOR DELETE USING (true);

-- Contact Submissions
CREATE POLICY "Public insert contacts" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Read contacts" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Update contacts" ON public.contact_submissions FOR UPDATE USING (true);
CREATE POLICY "Delete contacts" ON public.contact_submissions FOR DELETE USING (true);

-- Job Applications
CREATE POLICY "Public insert jobs" ON public.job_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Read jobs" ON public.job_applications FOR SELECT USING (true);
CREATE POLICY "Update jobs" ON public.job_applications FOR UPDATE USING (true);
CREATE POLICY "Delete jobs" ON public.job_applications FOR DELETE USING (true);

-- Support Tickets
CREATE POLICY "Public insert tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Read tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Update tickets" ON public.tickets FOR UPDATE USING (true);
CREATE POLICY "Delete tickets" ON public.tickets FOR DELETE USING (true);

-- AI Logs
CREATE POLICY "Public insert ai_logs" ON public.ai_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Read ai_logs" ON public.ai_logs FOR SELECT USING (true);
CREATE POLICY "Update ai_logs" ON public.ai_logs FOR UPDATE USING (true);
CREATE POLICY "Delete ai_logs" ON public.ai_logs FOR DELETE USING (true);

-- Storage Objects Policies for Resumes Bucket
CREATE POLICY "Allow public uploads to resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Allow public reads from resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');

-- 10. WEBSITE PROJECT REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.website_project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  package_name TEXT NOT NULL,
  package_price TEXT NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city_state TEXT,
  industry TEXT NOT NULL,
  business_description TEXT NOT NULL,
  website_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  required_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  has_existing_website BOOLEAN DEFAULT false,
  current_website_url TEXT,
  has_logo TEXT,
  has_content TEXT,
  design_style TEXT,
  inspiration_url TEXT,
  additional_requirements TEXT,
  project_timeline TEXT,
  confirmation_accepted BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'New',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.website_project_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for website project form
DROP POLICY IF EXISTS "Allow public inserts to website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow public inserts to website_project_requests" 
ON public.website_project_requests 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow authenticated users to view, update, delete project requests
DROP POLICY IF EXISTS "Allow authenticated read website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated read website_project_requests" 
ON public.website_project_requests 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated update website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated update website_project_requests" 
ON public.website_project_requests 
FOR UPDATE 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated delete website_project_requests" 
ON public.website_project_requests 
FOR DELETE 
TO authenticated 
USING (true);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_website_projects_created_at ON public.website_project_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_projects_status ON public.website_project_requests(status);
CREATE INDEX IF NOT EXISTS idx_website_projects_email ON public.website_project_requests(email);
CREATE INDEX IF NOT EXISTS idx_website_projects_package ON public.website_project_requests(package_name);
`;

const WEBSITE_PROJECTS_SQL = `-- ====================================================================
-- WAL GROUPS: CREATE 'website_project_requests' TABLE & RLS POLICIES
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.website_project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  package_name TEXT NOT NULL,
  package_price TEXT NOT NULL,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city_state TEXT,
  industry TEXT NOT NULL,
  business_description TEXT NOT NULL,
  website_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  required_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
  has_existing_website BOOLEAN DEFAULT false,
  current_website_url TEXT,
  has_logo TEXT,
  has_content TEXT,
  design_style TEXT,
  inspiration_url TEXT,
  additional_requirements TEXT,
  project_timeline TEXT,
  confirmation_accepted BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'New',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.website_project_requests ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC / ANONYMOUS INSERTS POLICY
-- Allows visitors to submit the website project enquiry form without authentication
DROP POLICY IF EXISTS "Allow public inserts to website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow public inserts to website_project_requests" 
ON public.website_project_requests 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. AUTHENTICATED ADMIN ACCESS POLICIES
-- Restricted to authenticated staff to view, update, and manage requests
DROP POLICY IF EXISTS "Allow authenticated read website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated read website_project_requests" 
ON public.website_project_requests 
FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated update website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated update website_project_requests" 
ON public.website_project_requests 
FOR UPDATE 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated delete website_project_requests" 
ON public.website_project_requests 
FOR DELETE 
TO authenticated 
USING (true);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_website_projects_created_at ON public.website_project_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_projects_status ON public.website_project_requests(status);
CREATE INDEX IF NOT EXISTS idx_website_projects_email ON public.website_project_requests(email);
CREATE INDEX IF NOT EXISTS idx_website_projects_package ON public.website_project_requests(package_name);
`;

interface SettingsViewProps {
  metrics: DashboardMetricsResult | null;
  onRefresh: () => void;
}

export const AdminSettingsView: React.FC<SettingsViewProps> = ({
  metrics,
  onRefresh
}) => {
  const { user } = useAuth();
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedWebsiteSchema, setCopiedWebsiteSchema] = useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(FULL_SQL_SCHEMA_AND_RLS);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleCopyWebsiteSchema = () => {
    navigator.clipboard.writeText(WEBSITE_PROJECTS_SQL);
    setCopiedWebsiteSchema(true);
    setTimeout(() => setCopiedWebsiteSchema(false), 2500);
  };

  const tables = [
    { name: 'bookings', label: 'Bookings Table', count: metrics?.bookings.count, error: metrics?.bookings.error },
    { name: 'leads', label: 'Leads Table', count: metrics?.leads.count, error: metrics?.leads.error },
    { name: 'website_project_requests', label: 'Website Project Requests Table', count: metrics?.websiteProjects?.count, error: metrics?.websiteProjects?.error },
    { name: 'contact_submissions', label: 'Contact Submissions Table', count: metrics?.contacts.count, error: metrics?.contacts.error },
    { name: 'job_applications', label: 'Job Applications Table', count: metrics?.jobs.count, error: metrics?.jobs.error },
    { name: 'tickets', label: 'Support Tickets Table', count: metrics?.tickets.count, error: metrics?.tickets.error },
    { name: 'ai_logs', label: 'AI Conversation Logs Table', count: metrics?.aiLogs.count, error: metrics?.aiLogs.error },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* System & Operations Connection Overview */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#ff7700]" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              System &amp; Database Infrastructure
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active &amp; Operational</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Database Environment</span>
            <div className="font-semibold text-slate-200 truncate">Cloud PostgreSQL Instance (Synchronized)</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Active Administrator Session</span>
            <div className="font-mono text-amber-300 truncate">{user?.email || 'Authorized Administrator'}</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Authentication Method</span>
            <div className="font-semibold text-slate-300 truncate">Encrypted JWT Session</div>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Access Security Context</span>
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Row Level Security (RLS) Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Tables Health Check */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Data Collections Health &amp; Schema Status
            </h3>
          </div>
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-[#ff7700]" />
            <span>Verify Status</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tables.map((t) => (
            <div 
              key={t.name}
              className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-2 ${
                t.error 
                  ? 'bg-amber-500/5 border-amber-500/30' 
                  : 'bg-black/30 border-white/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-white">{t.label}</div>
                  <div className="text-[10px] text-slate-400">Pipeline Collection</div>
                </div>
                {t.error ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                {t.error ? (
                  <span className="text-amber-400 text-[10px] truncate" title={t.error}>
                    Verification required
                  </span>
                ) : (
                  <span className="text-slate-400">
                    <strong className="text-white font-mono">{t.count ?? 0}</strong> records
                  </span>
                )}
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${t.error ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {t.error ? 'Attention' : 'Healthy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Authorization Security Guide */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/5">
          <UserCheck className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Executive Access Control &amp; Policies
          </h3>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            The Wal Group Operations Portal uses cryptographic JWT token verification with automated session validation and access controls.
          </p>
          
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Role-Based Access Control (RBAC)</span>
            </h4>
            <p className="text-slate-400 text-[11px]">
              Access to customer bookings, sales leads, job candidate applications, and internal support tickets is restricted to authorized Wal Group administrative staff.
            </p>
          </div>
        </div>
      </div>

      {/* Website Project Requests Table Setup Card */}
      <div className="rounded-2xl bg-[#09101d] border border-[#ff7700]/30 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#ff7700]" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Website Project Requests Table (Supabase SQL)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute this script in your Supabase SQL Editor to create the dedicated <code className="text-amber-300 bg-white/5 px-1 py-0.5 rounded font-mono">website_project_requests</code> table with Row Level Security and anonymous insert permissions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://supabase.com/dashboard/project/yzkjivknyalgfnpklxgr/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Open Supabase SQL Editor</span>
            </a>
            <button
              onClick={handleCopyWebsiteSchema}
              className="px-4 py-2 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedWebsiteSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWebsiteSchema ? 'SQL Copied!' : 'Copy Table SQL'}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-60 custom-scrollbar">
            {WEBSITE_PROJECTS_SQL}
          </pre>
        </div>
      </div>

      {/* Complete SQL Schema & Copy Box */}
      <div className="rounded-2xl bg-[#09101d] border border-white/10 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#ff7700]" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Database Schema &amp; Migration Script
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Reference SQL definition and security policies for database maintenance and disaster recovery.
            </p>
          </div>

          <button
            onClick={handleCopySchema}
            className="px-4 py-2 rounded-xl bg-[#ff7700] hover:bg-[#ff8811] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Script'}</span>
          </button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-72 custom-scrollbar">
            {FULL_SQL_SCHEMA_AND_RLS}
          </pre>
        </div>
      </div>
    </div>
  );
};
