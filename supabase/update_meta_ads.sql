-- Migration: Add Meta Ads Videos table

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

ALTER TABLE meta_ads_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published meta ads" ON meta_ads_videos FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Admins can manage meta ads" ON meta_ads_videos FOR ALL USING (auth.role() = 'authenticated');
