-- Seed Projects
INSERT INTO projects (title, slug, category, live_url, short_description, full_description, technologies, cover_image, status, featured, display_order)
VALUES 
('Sai Indirabala Furniture — Digital Experience', 'sai-indirabala', 'custom-furniture', 'https://www.saiindirabala.in/', 'CUSTOM FURNITURE • 3D INTERIOR SHOWCASE', 'A premium digital presence created for a Madurai-based furniture and interior business, showcasing custom furniture, 3D visualization, completed projects, and real customer feedback.', ARRAY['Custom Furniture', '3D Interior Showcase', 'Digital Experience'], '/assets/images/sai-indirabala.png', 'PUBLISHED', true, 1);

-- Seed Services
INSERT INTO services (title, slug, short_description, full_description, icon, features, status, display_order)
VALUES 
('Website Development', 'website-development', 'Modern, Responsive & High-Performance', 'Bespoke digital flagships built with clean React architectures, engineered to load instantly, command authority, and turn visitors into qualified clients.', 'Globe', ARRAY['React & Next.js', 'Sub-Second Speed', 'SEO Ready', 'Lead Routing'], 'PUBLISHED', 1),
('UI/UX Design', 'ui-ux-design', 'Clean & Intuitive Interfaces', 'Human-centric Figma prototypes, wireframes, and design systems crafted for effortless usability, brand prestige, and frictionless navigation journeys.', 'Palette', ARRAY['Figma Mockups', 'Design Systems', 'User Journeys', 'Prototypes'], 'PUBLISHED', 2),
('Web Application Development', 'web-app-development', 'Custom Business Web Platforms', 'Scalable web applications tailored to your exact operational workflows, featuring client portals, authenticated dashboards, and secure API integrations.', 'Code2', ARRAY['Custom Workflows', 'Client Portals', 'Cloud Databases', 'REST APIs'], 'PUBLISHED', 3),
('Mobile-Friendly Development', 'mobile-dev', 'Optimized For Every Screen Size', 'Touch-optimized web experiences engineered for mobile ergonomics, adaptive asset compression, and silky 60fps scrolling across iOS and Android.', 'Smartphone', ARRAY['iOS & Android', 'Thumb Ergonomics', 'Adaptive Assets', '60fps Motion'], 'PUBLISHED', 4),
('Landing Pages', 'landing-pages', 'High-Impact Conversion Funnels', 'Conversion-focused landing pages engineered for product launches, ad campaigns, and event signups — mathematically structured to maximize ROI.', 'Rocket', ARRAY['Conversion Story', 'Sub-100ms Load', 'Direct WhatsApp', 'A/B Tested'], 'PUBLISHED', 5),
('Meta Ads Management', 'meta-ads', 'Facebook & Instagram Campaigns', 'Data-driven paid advertising campaigns crafted to scale audience reach, capture high-intent inbound leads, and continuously optimize ROAS.', 'TrendingUp', ARRAY['Laser Targeting', 'Ad Creatives', 'Meta Pixel / CAPI', 'ROAS Scaling'], 'PUBLISHED', 6),
('SEO Optimization', 'seo-opt', 'Technical & On-Page Search Visibility', 'Comprehensive search optimization ensuring your digital presence ranks prominently on Google search for high-value organic client inquiries.', 'Search', ARRAY['Schema Markup', 'On-Page SEO', 'Keyword Research', 'Google Console'], 'PUBLISHED', 7),
('Website Optimization', 'site-opt', 'Speed, Accessibility & UX Polish', 'Deep performance tuning to slash bounce rates, compress media, achieve 90+ Google Lighthouse scores, and ensure accessible web compliance.', 'Zap', ARRAY['90+ Lighthouse', 'Asset Minification', 'WCAG AA Access', 'Core Web Vitals'], 'PUBLISHED', 8),
('Website Maintenance', 'site-maint', '24/7 Updates, Fixes & Tech Support', 'Proactive updates, security patches, regular backups, and rapid troubleshooting so your website remains 100% operational and protected around the clock.', 'Wrench', ARRAY['Uptime Monitoring', 'Security Patches', 'Cloud Backups', 'Quick Fixes'], 'PUBLISHED', 9);

-- Seed Team Members
INSERT INTO team_members (name, role, department, bio, image_url, status, display_order)
VALUES 
('Sivamanikandan P', 'Team Leader & Web/App Developer', 'Web & App Development', 'Leads the team and builds modern websites and web applications that are fast, responsive, and reliable.', '/assets/images/sivamanikandan.jpg', 'PUBLISHED', 1),
('Rithanya RS', 'Meta Ads Specialist', 'Meta Ads & Growth', 'Creates and manages Meta ad campaigns that help businesses reach the right audience and generate more leads.', '/assets/images/rithanya.jpg', 'PUBLISHED', 2),
('Raghul Raja V', 'SEO Specialist', 'SEO & Organic Growth', 'Optimizes websites to improve Google rankings, increase organic traffic, and help businesses get found online.', '/assets/images/raghulraja.jpg', 'PUBLISHED', 3),
('Shivaranjani K', 'Social Media Manager', 'Social Media Management', 'Manages social media content and strategies to build brand awareness, engage audiences, and grow online presence.', '/assets/images/shivaranjani.jpg', 'PUBLISHED', 4),
('Sarathy', 'Video Editor & Motion Designer', 'Video & Motion Design', 'Creates engaging videos, reels, and promotional content that help brands attract attention and communicate their message effectively.', '/assets/images/sarathy-v2.jpg', 'PUBLISHED', 5);
