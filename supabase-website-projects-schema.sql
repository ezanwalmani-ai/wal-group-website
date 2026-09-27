-- ====================================================================
-- WAL GROUPS: WEBSITE PROJECT REQUESTS TABLE & RLS POLICIES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
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

-- 1. PUBLIC INSERT POLICY
-- Allows visitors on the website to submit project requests without authentication
DROP POLICY IF EXISTS "Allow public inserts to website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow public inserts to website_project_requests" 
ON public.website_project_requests 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 2. RESTRICTED SELECT POLICY
-- Visitors CANNOT read other submissions. Only authenticated admins can read requests.
DROP POLICY IF EXISTS "Allow authenticated read website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated read website_project_requests" 
ON public.website_project_requests 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. RESTRICTED UPDATE POLICY
-- Only authenticated admins can update status or details.
DROP POLICY IF EXISTS "Allow authenticated update website_project_requests" ON public.website_project_requests;
CREATE POLICY "Allow authenticated update website_project_requests" 
ON public.website_project_requests 
FOR UPDATE 
TO authenticated 
USING (true);

-- 4. RESTRICTED DELETE POLICY
-- Only authenticated admins can delete requests.
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
