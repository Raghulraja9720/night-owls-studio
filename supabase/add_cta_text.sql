-- 1. Add the column
ALTER TABLE services ADD COLUMN cta_text text;

-- 2. Update existing rows to restore their original CTA text
UPDATE services SET cta_text = 'Build Your Website' WHERE slug = 'website-development';
UPDATE services SET cta_text = 'Design Interface' WHERE slug = 'ui-ux-design';
UPDATE services SET cta_text = 'Develop Web App' WHERE slug = 'web-app-development';
UPDATE services SET cta_text = 'Optimize Mobile' WHERE slug = 'mobile-dev';
UPDATE services SET cta_text = 'Launch Landing Page' WHERE slug = 'landing-pages';
UPDATE services SET cta_text = 'Launch Ad Campaign' WHERE slug = 'meta-ads';
UPDATE services SET cta_text = 'Improve Rankings' WHERE slug = 'seo-opt';
UPDATE services SET cta_text = 'Speed Up Website' WHERE slug = 'site-opt';
UPDATE services SET cta_text = 'Get Ongoing Support' WHERE slug = 'site-maint';
