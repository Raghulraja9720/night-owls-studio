-- =====================================================================
-- NIGHT OWLS STUDIO CMS: COMPLETE DATABASE RESET & SETUP (ALL-IN-ONE)
-- =====================================================================
-- How to use in your NEW Supabase Project:
-- 1. Create your new project in Supabase (https://supabase.com/dashboard)
-- 2. Go to "SQL Editor" in the left sidebar.
-- 3. Click "+ New query", paste this ENTIRE file, and click "Run".
-- 4. Copy your new Project URL & Anon Key into your local .env file.
-- =====================================================================

-- STEP 1: DROP OLD TABLES IF ANY EXIST (PREVENTS CONFLICTS)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS internal_messages CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS meta_ads_videos CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- STEP 2: CREATE TABLES FROM SCRATCH

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

-- STEP 3: ENABLE ROW LEVEL SECURITY (RLS) & POLICIES

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


-- STEP 4: SEED INITIAL DATA (ALL PRESERVED NIGHT OWLS STUDIO CONTENT)

-- 1. Site Settings
INSERT INTO site_settings (
  id, 
  studio_name, 
  contact_email, 
  phone, 
  whatsapp, 
  instagram, 
  facebook, 
  linkedin, 
  seo_title, 
  seo_description
) VALUES (
  1,
  'Night Owls Studio',
  'contact.nightowls.team@gmail.com',
  '+91 85318 07705',
  '918531807705',
  'https://www.instagram.com/night_owls_studios/',
  '',
  '',
  'Night Owls Studio | Digital Engineering',
  'We provide professional digital services engineered to help your business grow online with modern websites, effective digital marketing, and performance-focused solutions.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Projects
INSERT INTO projects (title, slug, category, live_url, short_description, full_description, technologies, cover_image, status, featured, display_order)
VALUES 
('Sai Indirabala Furniture — Digital Experience', 'sai-indirabala', 'custom-furniture', 'https://www.saiindirabala.in/', 'CUSTOM FURNITURE • 3D INTERIOR SHOWCASE', 'A premium digital presence created for a Madurai-based furniture and interior business, showcasing custom furniture, 3D visualization, completed projects, and real customer feedback.', ARRAY['Custom Furniture', '3D Interior Showcase', 'Digital Experience'], '/assets/images/sai-indirabala.png', 'PUBLISHED', true, 1)
ON CONFLICT (slug) DO NOTHING;

-- 3. Services
INSERT INTO services (title, slug, short_description, full_description, icon, cta_text, features, status, display_order)
VALUES 
  ('Web Development', 'web-development', 'RESPONSIVE & BUSINESS WEBSITES', 'High-performance, custom-built websites designed to reflect your brand and convert visitors into customers.', 'Globe', 'Build Your Website', ARRAY['Modern responsive websites', 'Business websites', 'Custom web solutions'], 'PUBLISHED', 1),
  ('UI/UX Design', 'ui-ux-design', 'CLEAN & INTUITIVE INTERFACES', 'Human-centric interface design and seamless user journeys that make navigating your website an absolute pleasure.', 'Palette', 'Design Interface', ARRAY['Website interface design', 'User experience', 'Responsive layouts', 'Modern visual design'], 'PUBLISHED', 2),
  ('E-Commerce Development', 'ecommerce-development', 'HIGH-CONVERSION ONLINE STORES', 'Robust e-commerce platforms engineered for frictionless shopping, secure payments, and maximum sales.', 'ShoppingCart', 'Start Selling Online', ARRAY['Online stores', 'Product/catalog systems', 'Shopping functionality', 'Payment integration'], 'PUBLISHED', 3),
  ('Custom Web Applications', 'custom-web-apps', 'BUSINESS-SPECIFIC PLATFORMS', 'Scalable web applications tailored to your exact operational workflows, featuring authenticated dashboards and custom logic.', 'Code2', 'Develop Web App', ARRAY['Business-specific applications', 'Dashboards', 'Management systems', 'Custom functionality'], 'PUBLISHED', 4),
  ('Frontend Development', 'frontend-development', 'REACT & MODERN FRONTENDS', 'Silky-smooth, highly interactive frontend experiences built with industry-leading frameworks like React and modern CSS.', 'Monitor', 'Hire Frontend Dev', ARRAY['React', 'HTML/CSS', 'JavaScript', 'Responsive interfaces'], 'PUBLISHED', 5),
  ('Backend / API Development', 'backend-api-development', 'SCALABLE BACKEND SYSTEMS', 'Secure database architecture, robust REST APIs, and powerful business logic to drive your digital product.', 'Database', 'Build Your Backend', ARRAY['Backend systems', 'REST APIs', 'Database integration', 'Authentication and business logic'], 'PUBLISHED', 6),
  ('Digital Marketing & Meta Ads', 'digital-marketing-meta-ads', 'FACEBOOK & INSTAGRAM CAMPAIGNS', 'Data-driven paid advertising campaigns crafted to scale audience reach, capture high-intent leads, and maximize ROI.', 'TrendingUp', 'Launch Ad Campaign', ARRAY['Meta/Facebook Ads', 'Instagram Ads', 'Lead generation', 'Digital marketing campaigns'], 'PUBLISHED', 7)
ON CONFLICT (slug) DO NOTHING;

-- 4. Team Members
INSERT INTO team_members (name, role, department, bio, image_url, icon, status, display_order)
VALUES 
('Sivamanikandan P', 'Team Leader & Web/App Developer', 'Web & App Development', 'Leads the team and builds modern websites and web applications that are fast, responsive, and reliable.', '/assets/images/sivamanikandan.jpg', 'Crown', 'PUBLISHED', 1),
('Rithanya RS', 'Meta Ads Specialist', 'Meta Ads & Growth', 'Creates and manages Meta ad campaigns that help businesses reach the right audience and generate more leads.', '/assets/images/rithanya.jpg', 'Target', 'PUBLISHED', 2),
('Raghul Raja V', 'SEO Specialist', 'SEO & Organic Growth', 'Optimizes websites to improve Google rankings, increase organic traffic, and help businesses get found online.', '/assets/images/raghulraja.jpg', 'Search', 'PUBLISHED', 3),
('Shivaranjani K', 'Social Media Manager', 'Social Media Management', 'Manages social media content and strategies to build brand awareness, engage audiences, and grow online presence.', '/assets/images/shivaranjani.jpg', 'Share2', 'PUBLISHED', 4),
('Sarathy', 'Video Editor & Motion Designer', 'Video & Motion Design', 'Creates engaging videos, reels, and promotional content that help brands attract attention and communicate their message effectively.', '/assets/images/sarathy-v2.jpg', 'Film', 'PUBLISHED', 5)
ON CONFLICT (id) DO NOTHING;

-- STEP 5: SETUP STORAGE BUCKET FOR MEDIA
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to Media'
  ) THEN
    CREATE POLICY "Public Access to Media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can manage media storage'
  ) THEN
    CREATE POLICY "Admins can manage media storage" ON storage.objects FOR ALL USING (bucket_id = 'media' AND auth.role() = 'authenticated');
  END IF;
END $$;

-- STEP 6: CREATE ADMIN ACCOUNT (DEFAULT CREDENTIALS)
-- Email: admin@nightowls.com
-- Password: AdminPassword123!
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  admin_email text := 'admin@nightowls.com';       -- You can change this email
  admin_password text := 'AdminPassword123!';     -- You can change this password
BEGIN
  -- Delete old/default user if exists (ensures clean reset)
  DELETE FROM auth.identities WHERE identity_data->>'email' = admin_email;
  DELETE FROM auth.users WHERE email = admin_email;

  -- Create fresh admin in auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Night Owls Admin"}'::jsonb,
    now(),
    now(),
    ''
  );

  -- Create identity in auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', admin_email),
    'email',
    admin_email,
    now(),
    now(),
    now()
  );
END $$;
