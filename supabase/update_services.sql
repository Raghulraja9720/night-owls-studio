-- 1. Remove all existing services
DELETE FROM services;

-- 2. Insert the new updated services
INSERT INTO services (title, slug, short_description, full_description, icon, cta_text, features, status, display_order)
VALUES 
(
  'Web Development', 
  'web-development', 
  'RESPONSIVE & BUSINESS WEBSITES', 
  'High-performance, custom-built websites designed to reflect your brand and convert visitors into customers.', 
  'Globe', 
  'Build Your Website', 
  ARRAY['Modern responsive websites', 'Business websites', 'Custom web solutions'], 
  'PUBLISHED', 
  1
),
(
  'UI/UX Design', 
  'ui-ux-design', 
  'CLEAN & INTUITIVE INTERFACES', 
  'Human-centric interface design and seamless user journeys that make navigating your website an absolute pleasure.', 
  'Palette', 
  'Design Interface', 
  ARRAY['Website interface design', 'User experience', 'Responsive layouts', 'Modern visual design'], 
  'PUBLISHED', 
  2
),
(
  'E-Commerce Development', 
  'ecommerce-development', 
  'HIGH-CONVERSION ONLINE STORES', 
  'Robust e-commerce platforms engineered for frictionless shopping, secure payments, and maximum sales.', 
  'ShoppingCart', 
  'Start Selling Online', 
  ARRAY['Online stores', 'Product/catalog systems', 'Shopping functionality', 'Payment integration'], 
  'PUBLISHED', 
  3
),
(
  'Custom Web Applications', 
  'custom-web-apps', 
  'BUSINESS-SPECIFIC PLATFORMS', 
  'Scalable web applications tailored to your exact operational workflows, featuring authenticated dashboards and custom logic.', 
  'Code2', 
  'Develop Web App', 
  ARRAY['Business-specific applications', 'Dashboards', 'Management systems', 'Custom functionality'], 
  'PUBLISHED', 
  4
),
(
  'Frontend Development', 
  'frontend-development', 
  'REACT & MODERN FRONTENDS', 
  'Silky-smooth, highly interactive frontend experiences built with industry-leading frameworks like React and modern CSS.', 
  'Monitor', 
  'Hire Frontend Dev', 
  ARRAY['React', 'HTML/CSS', 'JavaScript', 'Responsive interfaces'], 
  'PUBLISHED', 
  5
),
(
  'Backend / API Development', 
  'backend-api-development', 
  'SCALABLE BACKEND SYSTEMS', 
  'Secure database architecture, robust REST APIs, and powerful business logic to drive your digital product.', 
  'Database', 
  'Build Your Backend', 
  ARRAY['Backend systems', 'REST APIs', 'Database integration', 'Authentication and business logic'], 
  'PUBLISHED', 
  6
),
(
  'Digital Marketing & Meta Ads', 
  'digital-marketing-meta-ads', 
  'FACEBOOK & INSTAGRAM CAMPAIGNS', 
  'Data-driven paid advertising campaigns crafted to scale audience reach, capture high-intent leads, and maximize ROI.', 
  'TrendingUp', 
  'Launch Ad Campaign', 
  ARRAY['Meta/Facebook Ads', 'Instagram Ads', 'Lead generation', 'Digital marketing campaigns'], 
  'PUBLISHED', 
  7
);
