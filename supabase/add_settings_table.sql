-- 1. Create the settings table
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
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Restrict to a single row
ALTER TABLE site_settings ADD CONSTRAINT site_settings_single_row CHECK (id = 1);

-- 3. Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- 5. Insert initial row
INSERT INTO site_settings (id) VALUES (1);
