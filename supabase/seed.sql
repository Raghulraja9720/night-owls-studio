-- =========================================================
-- Supabase Seed Data for Night Owls Studio
-- =========================================================

-- 1. Seed Site Settings (Initial row with id = 1)
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

-- 2. Seed Projects
INSERT INTO projects (title, slug, category, live_url, short_description, full_description, technologies, cover_image, status, featured, display_order)
VALUES 
('Sai Indirabala Furniture — Digital Experience', 'sai-indirabala', 'custom-furniture', 'https://www.saiindirabala.in/', 'CUSTOM FURNITURE • 3D INTERIOR SHOWCASE', 'A premium digital presence created for a Madurai-based furniture and interior business, showcasing custom furniture, 3D visualization, completed projects, and real customer feedback.', ARRAY['Custom Furniture', '3D Interior Showcase', 'Digital Experience'], '/assets/images/sai-indirabala.png', 'PUBLISHED', true, 1)
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Services
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

-- 4. Seed Team Members
INSERT INTO team_members (name, role, department, bio, image_url, icon, status, display_order)
VALUES 
('Sivamanikandan P', 'Team Leader & Web/App Developer', 'Web & App Development', 'Leads the team and builds modern websites and web applications that are fast, responsive, and reliable.', '/assets/images/sivamanikandan.jpg', 'Crown', 'PUBLISHED', 1),
('Rithanya RS', 'Meta Ads Specialist', 'Meta Ads & Growth', 'Creates and manages Meta ad campaigns that help businesses reach the right audience and generate more leads.', '/assets/images/rithanya.jpg', 'Target', 'PUBLISHED', 2),
('Raghul Raja V', 'SEO Specialist', 'SEO & Organic Growth', 'Optimizes websites to improve Google rankings, increase organic traffic, and help businesses get found online.', '/assets/images/raghulraja.jpg', 'Search', 'PUBLISHED', 3),
('Shivaranjani K', 'Social Media Manager', 'Social Media Management', 'Manages social media content and strategies to build brand awareness, engage audiences, and grow online presence.', '/assets/images/shivaranjani.jpg', 'Share2', 'PUBLISHED', 4),
('Sarathy', 'Video Editor & Motion Designer', 'Video & Motion Design', 'Creates engaging videos, reels, and promotional content that help brands attract attention and communicate their message effectively.', '/assets/images/sarathy-v2.jpg', 'Film', 'PUBLISHED', 5);
