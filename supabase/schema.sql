-- =========================================================
-- Supabase Schema for Night Owls Studio CMS (Complete)
-- =========================================================

-- 1. Projects Table
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

-- 2. Services Table
CREATE TABLE services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  full_description text,
  icon text,
  cta_text text,
  features text[] DEFAULT '{}',
  status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Team Members Table
CREATE TABLE team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  department text,
  bio text,
  image_url text,
  icon text,
  skills text[] DEFAULT '{}',
  status text DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Meta Ads Videos Table
CREATE TABLE meta_ads_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  business_name text,
  platform text,
  video_path text NOT NULL,
  poster_path text,
  status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Client Inquiries Table (Website Contact Form)
CREATE TABLE inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  service text,
  message text,
  status text DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'CLOSED', 'ARCHIVED')),
  internal_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Internal Messages Table (Team Communication)
CREATE TABLE internal_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_email text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  status text DEFAULT 'UNREAD' CHECK (status IN ('READ', 'UNREAD', 'ARCHIVED')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. System Activity Logs Table
CREATE TABLE activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Site Settings Table
CREATE TABLE site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  studio_name text DEFAULT 'Night Owls Studio',
  contact_email text DEFAULT 'contact.nightowls.team@gmail.com',
  phone text DEFAULT '+91 85318 07705',
  whatsapp text DEFAULT '918531807705',
  instagram text DEFAULT 'https://www.instagram.com/night_owls_studios/',
  facebook text DEFAULT '',
  linkedin text DEFAULT '',
  seo_title text DEFAULT 'Night Owls Studio | Digital Engineering',
  seo_description text DEFAULT 'We provide professional digital services engineered to help your business grow online with modern websites, effective digital marketing, and performance-focused solutions.',
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT site_settings_single_row CHECK (id = 1)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published projects" ON projects FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Team Members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published team members" ON team_members FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage team members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- Meta Ads Videos
ALTER TABLE meta_ads_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published meta ads" ON meta_ads_videos FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage meta ads" ON meta_ads_videos FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries (Public can submit; Admins manage)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage inquiries" ON inquiries FOR ALL USING (auth.role() = 'authenticated');

-- Internal Messages
ALTER TABLE internal_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage internal messages" ON internal_messages FOR ALL USING (auth.role() = 'authenticated');

-- Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage activity logs" ON activity_logs FOR ALL USING (auth.role() = 'authenticated');

-- Site Settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
