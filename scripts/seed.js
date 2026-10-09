import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase variables in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const initialProjects = [
  {
    title: 'Sai Indirabala Furniture — Digital Experience',
    slug: 'sai-indirabala',
    category: 'custom-furniture',
    live_url: 'https://www.saiindirabala.in/',
    short_description: 'CUSTOM FURNITURE • 3D INTERIOR SHOWCASE',
    full_description: 'A premium digital presence created for a Madurai-based furniture and interior business, showcasing custom furniture, 3D visualization, completed projects, and real customer feedback.',
    technologies: ['Custom Furniture', '3D Interior Showcase', 'Digital Experience'],
    cover_image: '/assets/images/sai-indirabala.png',
    status: 'PUBLISHED',
    featured: true,
    display_order: 1
  }
];

const initialServices = [
  {
    title: 'Website Development',
    short_description: 'Modern, Responsive & High-Performance',
    full_description: 'Bespoke digital flagships built with clean React architectures, engineered to load instantly, command authority, and turn visitors into qualified clients.',
    icon: 'Globe',
    features: ['React & Next.js', 'Sub-Second Speed', 'SEO Ready', 'Lead Routing'],
    status: 'PUBLISHED',
    display_order: 1
  },
  {
    title: 'UI/UX Design',
    short_description: 'Clean & Intuitive Interfaces',
    full_description: 'Human-centric Figma prototypes, wireframes, and design systems crafted for effortless usability, brand prestige, and frictionless navigation journeys.',
    icon: 'Palette',
    features: ['Figma Mockups', 'Design Systems', 'User Journeys', 'Prototypes'],
    status: 'PUBLISHED',
    display_order: 2
  },
  {
    title: 'Web Application Development',
    short_description: 'Custom Business Web Platforms',
    full_description: 'Scalable web applications tailored to your exact operational workflows, featuring client portals, authenticated dashboards, and secure API integrations.',
    icon: 'Code2',
    features: ['Custom Workflows', 'Client Portals', 'Cloud Databases', 'REST APIs'],
    status: 'PUBLISHED',
    display_order: 3
  },
  {
    title: 'Mobile-Friendly Development',
    short_description: 'Optimized For Every Screen Size',
    full_description: 'Touch-optimized web experiences engineered for mobile ergonomics, adaptive asset compression, and silky 60fps scrolling across iOS and Android.',
    icon: 'Smartphone',
    features: ['iOS & Android', 'Thumb Ergonomics', 'Adaptive Assets', '60fps Motion'],
    status: 'PUBLISHED',
    display_order: 4
  },
  {
    title: 'Landing Pages',
    short_description: 'High-Impact Conversion Funnels',
    full_description: 'Conversion-focused landing pages engineered for product launches, ad campaigns, and event signups — mathematically structured to maximize ROI.',
    icon: 'Rocket',
    features: ['Conversion Story', 'Sub-100ms Load', 'Direct WhatsApp', 'A/B Tested'],
    status: 'PUBLISHED',
    display_order: 5
  },
  {
    title: 'Meta Ads Management',
    short_description: 'Facebook & Instagram Campaigns',
    full_description: 'Data-driven paid advertising campaigns crafted to scale audience reach, capture high-intent inbound leads, and continuously optimize ROAS.',
    icon: 'TrendingUp',
    features: ['Laser Targeting', 'Ad Creatives', 'Meta Pixel / CAPI', 'ROAS Scaling'],
    status: 'PUBLISHED',
    display_order: 6
  },
  {
    title: 'SEO Optimization',
    short_description: 'Technical & On-Page Search Visibility',
    full_description: 'Comprehensive search optimization ensuring your digital presence ranks prominently on Google search for high-value organic client inquiries.',
    icon: 'Search',
    features: ['Schema Markup', 'On-Page SEO', 'Keyword Research', 'Google Console'],
    status: 'PUBLISHED',
    display_order: 7
  },
  {
    title: 'Website Optimization',
    short_description: 'Speed, Accessibility & UX Polish',
    full_description: 'Deep performance tuning to slash bounce rates, compress media, achieve 90+ Google Lighthouse scores, and ensure accessible web compliance.',
    icon: 'Zap',
    features: ['90+ Lighthouse', 'Asset Minification', 'WCAG AA Access', 'Core Web Vitals'],
    status: 'PUBLISHED',
    display_order: 8
  },
  {
    title: 'Website Maintenance',
    short_description: '24/7 Updates, Fixes & Tech Support',
    full_description: 'Proactive updates, security patches, regular backups, and rapid troubleshooting so your website remains 100% operational and protected around the clock.',
    icon: 'Wrench',
    features: ['Uptime Monitoring', 'Security Patches', 'Cloud Backups', 'Quick Fixes'],
    status: 'PUBLISHED',
    display_order: 9
  }
];

const initialMembers = [
  {
    name: 'Sivamanikandan P',
    role: 'Team Leader & Web/App Developer',
    bio: 'Leads the team and builds modern websites and web applications that are fast, responsive, and reliable.',
    image: '/assets/images/sivamanikandan.jpg',
    status: 'PUBLISHED',
    display_order: 1
  },
  {
    name: 'Rithanya RS',
    role: 'Meta Ads Specialist',
    bio: 'Creates and manages Meta ad campaigns that help businesses reach the right audience and generate more leads.',
    image: '/assets/images/rithanya.jpg',
    status: 'PUBLISHED',
    display_order: 2
  },
  {
    name: 'Raghul Raja V',
    role: 'SEO Specialist',
    bio: 'Optimizes websites to improve Google rankings, increase organic traffic, and help businesses get found online.',
    image: '/assets/images/raghulraja.jpg',
    status: 'PUBLISHED',
    display_order: 3
  },
  {
    name: 'Shivaranjani K',
    role: 'Social Media Manager',
    bio: 'Manages social media content and strategies to build brand awareness, engage audiences, and grow online presence.',
    image: '/assets/images/shivaranjani.jpg',
    status: 'PUBLISHED',
    display_order: 4
  },
  {
    name: 'Sarathy',
    role: 'Video Editor & Motion Designer',
    bio: 'Creates engaging videos, reels, and promotional content that help brands attract attention and communicate their message effectively.',
    image: '/assets/images/sarathy-v2.jpg',
    status: 'PUBLISHED',
    display_order: 5
  }
];

async function seed() {
  console.log('Seeding projects...');
  const { error: pError } = await supabase.from('projects').insert(initialProjects);
  if (pError) console.error(pError);
  else console.log('Projects seeded.');

  console.log('Seeding services...');
  const { error: sError } = await supabase.from('services').insert(initialServices);
  if (sError) console.error(sError);
  else console.log('Services seeded.');

  console.log('Seeding team...');
  const { error: tError } = await supabase.from('team').insert(initialMembers);
  if (tError) console.error(tError);
  else console.log('Team seeded.');

  console.log('Seed complete!');
}

seed();
