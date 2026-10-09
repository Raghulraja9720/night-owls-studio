-- Supabase Schema for Night Owls Studio CMS

-- 1. Create Projects Table
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  full_description text,
  category text,
  year text,
  status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  technologies text[] DEFAULT '{}',
  cover_image text,
  images text[] DEFAULT '{}',
  live_url text,
  github_url text,
  challenge text,
  solution text,
  results text,
  seo_title text,
  seo_description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Services Table
CREATE TABLE services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  full_description text,
  icon text,
  features text[] DEFAULT '{}',
  status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Team Members Table
CREATE TABLE team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  department text,
  bio text,
  image_url text,
  skills text[] DEFAULT '{}',
  linkedin_url text,
  status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Inquiries Table
CREATE TABLE inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  message text,
  status text DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'CLOSED')),
  internal_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Activity Logs Table
CREATE TABLE activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) setup
-- Enable RLS for all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- Projects: Public can read published projects. Admins can do everything.
CREATE POLICY "Public can view published projects" ON projects FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Services: Public can read published services. Admins can do everything.
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Team: Public can read published team members. Admins can do everything.
CREATE POLICY "Public can view published team members" ON team_members FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage team members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries: Public can insert. Admins can manage.
CREATE POLICY "Public can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Activity logs: Admins only
CREATE POLICY "Admins can view and create activity logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');
