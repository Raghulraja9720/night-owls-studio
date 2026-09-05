import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Palette,
  Code2,
  Smartphone,
  Rocket,
  TrendingUp,
  Search,
  Zap,
  Wrench,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const servicesData = [
  {
    id: 'web-dev',
    category: 'development',
    number: '01',
    title: 'Website Development',
    subtitle: 'Modern, Responsive & High-Performance',
    desc: 'Bespoke digital flagships built with clean React architectures, engineered to load instantly, command authority, and turn visitors into qualified clients.',
    icon: Globe,
    colorClass: 'icon-blue',
    featured: false,
    ctaText: 'Build Your Website',
    tags: ['React & Next.js', 'Sub-Second Speed', 'SEO Ready', 'Lead Routing']
  },
  {
    id: 'ui-ux',
    category: 'design',
    number: '02',
    title: 'UI/UX Design',
    subtitle: 'Clean & Intuitive Interfaces',
    desc: 'Human-centric Figma prototypes, wireframes, and design systems crafted for effortless usability, brand prestige, and frictionless navigation journeys.',
    icon: Palette,
    colorClass: 'icon-cyan',
    featured: false,
    ctaText: 'Design Interface',
    tags: ['Figma Mockups', 'Design Systems', 'User Journeys', 'Prototypes']
  },
  {
    id: 'web-app',
    category: 'development',
    number: '03',
    title: 'Web Application Development',
    subtitle: 'Custom Business Web Platforms',
    desc: 'Scalable web applications tailored to your exact operational workflows, featuring client portals, authenticated dashboards, and secure API integrations.',
    icon: Code2,
    colorClass: 'icon-indigo',
    featured: false,
    ctaText: 'Develop Web App',
    tags: ['Custom Workflows', 'Client Portals', 'Cloud Databases', 'REST APIs']
  },
  {
    id: 'mobile-dev',
    category: 'development',
    number: '04',
    title: 'Mobile-Friendly Development',
    subtitle: 'Optimized For Every Screen Size',
    desc: 'Touch-optimized web experiences engineered for mobile ergonomics, adaptive asset compression, and silky 60fps scrolling across iOS and Android.',
    icon: Smartphone,
    colorClass: 'icon-emerald',
    featured: false,
    ctaText: 'Optimize Mobile',
    tags: ['iOS & Android', 'Thumb Ergonomics', 'Adaptive Assets', '60fps Motion']
  },
  {
    id: 'landing-pages',
    category: 'design',
    number: '05',
    title: 'Landing Pages',
    subtitle: 'High-Impact Conversion Funnels',
    desc: 'Conversion-focused landing pages engineered for product launches, ad campaigns, and event signups — mathematically structured to maximize ROI.',
    icon: Rocket,
    colorClass: 'icon-gold',
    featured: false,
    ctaText: 'Launch Landing Page',
    tags: ['Conversion Story', 'Sub-100ms Load', 'Direct WhatsApp', 'A/B Tested']
  },
  {
    id: 'meta-ads',
    category: 'marketing',
    number: '06',
    title: 'Meta Ads Management',
    subtitle: 'Facebook & Instagram Campaigns',
    desc: 'Data-driven paid advertising campaigns crafted to scale audience reach, capture high-intent inbound leads, and continuously optimize ROAS.',
    icon: TrendingUp,
    colorClass: 'icon-amber',
    featured: false,
    ctaText: 'Launch Ad Campaign',
    tags: ['Laser Targeting', 'Ad Creatives', 'Meta Pixel / CAPI', 'ROAS Scaling']
  },
  {
    id: 'seo-opt',
    category: 'marketing',
    number: '07',
    title: 'SEO Optimization',
    subtitle: 'Technical & On-Page Search Visibility',
    desc: 'Comprehensive search optimization ensuring your digital presence ranks prominently on Google search for high-value organic client inquiries.',
    icon: Search,
    colorClass: 'icon-purple',
    featured: false,
    ctaText: 'Improve Rankings',
    tags: ['Schema Markup', 'On-Page SEO', 'Keyword Research', 'Google Console']
  },
  {
    id: 'site-opt',
    category: 'support',
    number: '08',
    title: 'Website Optimization',
    subtitle: 'Speed, Accessibility & UX Polish',
    desc: 'Deep performance tuning to slash bounce rates, compress media, achieve 90+ Google Lighthouse scores, and ensure accessible web compliance.',
    icon: Zap,
    colorClass: 'icon-rose',
    featured: false,
    ctaText: 'Speed Up Website',
    tags: ['90+ Lighthouse', 'Asset Minification', 'WCAG AA Access', 'Core Web Vitals']
  },
  {
    id: 'site-maint',
    category: 'support',
    number: '09',
    title: 'Website Maintenance',
    subtitle: '24/7 Updates, Fixes & Tech Support',
    desc: 'Proactive updates, security patches, regular backups, and rapid troubleshooting so your website remains 100% operational and protected around the clock.',
    icon: Wrench,
    colorClass: 'icon-teal',
    featured: false,
    ctaText: 'Get Ongoing Support',
    tags: ['Uptime Monitoring', 'Security Patches', 'Cloud Backups', 'Quick Fixes']
  }
];

function ServiceCard({ svc, isActive, onCardClick, onSelect }) {
  const IconComponent = svc.icon;
  return (
    <div
      className={`service-card marquee-card is-visible ${isActive ? 'card-active' : ''}`}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      aria-current={isActive ? 'true' : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onCardClick();
        }
      }}
    >
      {/* Card Top: Icon & Number */}
      <div className="service-card-top">
        <div className={`service-icon-box ${svc.colorClass}`}>
          <IconComponent size={22} />
        </div>
        <span className="service-number-badge">{svc.number}</span>
      </div>

      {/* Card Header: Title & Subtitle */}
      <div className="service-card-header">
        <h3 className="service-card-title">{svc.title}</h3>
        <span className="service-card-subtitle">{svc.subtitle}</span>
      </div>

      {/* Description */}
      <p className="service-card-desc">{svc.desc}</p>

      {/* Capability Tags / Deliverables Chips */}
      <div className="service-tags-wrap">
        {svc.tags.map((tag, tIdx) => (
          <span key={tIdx} className="service-tag-chip">
            {tag}
          </span>
        ))}
      </div>

      {/* Interactive Action Button */}
      <div className="service-card-bottom">
        <button
          type="button"
          className="service-cta-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(svc.title);
          }}
        >
          <span>{svc.ctaText}</span>
          <ArrowRight size={15} className="service-cta-arrow" />
        </button>
      </div>
    </div>
  );
}

export default function Services({ onSelectService }) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const trackWrapperRef = useRef(null);
  const isPausedRef = useRef(false);
  const pauseTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const pauseAutoScroll = (resumeDelay = 3000) => {
    isPausedRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, resumeDelay);
  };

  const smoothScrollTo = (targetX, duration = 350, onComplete) => {
    const container = trackWrapperRef.current;
    if (!container) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    const startX = container.scrollLeft;
    const distance = targetX - startX;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollLeft = startX + distance * easeOutCubic(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        container.scrollLeft = targetX;
        animFrameRef.current = null;
        if (onComplete) onComplete();
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  };

  const handleNext = () => {
    isPausedRef.current = true;
    const container = trackWrapperRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.marquee-card');
    if (!cards.length) return;

    const cardStep = cards[1] ? (cards[1].offsetLeft - cards[0].offsetLeft) : 320;
    smoothScrollTo(container.scrollLeft + cardStep, 350, () => {
      isPausedRef.current = false;
    });
  };

  const handlePrev = () => {
    isPausedRef.current = true;
    const container = trackWrapperRef.current;
    if (!container) return;
    const cards = container.querySelectorAll('.marquee-card');
    if (!cards.length) return;

    const cardStep = cards[1] ? (cards[1].offsetLeft - cards[0].offsetLeft) : 320;
    smoothScrollTo(container.scrollLeft - cardStep, 350, () => {
      isPausedRef.current = false;
    });
  };

  const handleTouchStart = (e) => {
    // When touched: pause immediately
    isPausedRef.current = true;
    hasDraggedRef.current = false;
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const handleTouchMove = (e) => {
    isPausedRef.current = true;
    if (e.touches && e.touches[0]) {
      const diffX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
      const diffY = Math.abs(e.touches[0].clientY - touchStartYRef.current);
      if (diffX > 8 || diffY > 8) {
        hasDraggedRef.current = true;
      }
    }
  };

  const handleTouchEnd = () => {
    // When touch is released: immediately resume running continuously
    isPausedRef.current = false;
  };

  const handleCardClick = (serviceTitle) => {
    if (hasDraggedRef.current) return;
    handleServiceClick(serviceTitle);
  };

  const handleScroll = () => {
    const container = trackWrapperRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll('.marquee-card');
    if (!cards.length) return;

    let closestIdx = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    const activeModulo = closestIdx % servicesData.length;
    if (activeModulo !== activeIndex) {
      setActiveIndex(activeModulo);
    }

    // Seamless infinite wrap normalization during touch scroll
    if (cards.length >= servicesData.length * 2) {
      const singleSetWidth = cards[servicesData.length].offsetLeft - cards[0].offsetLeft;
      if (singleSetWidth > 0) {
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        } else if (container.scrollLeft < singleSetWidth * 0.4) {
          container.scrollLeft += singleSetWidth;
        }
      }
    }
  };

  // Section visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initial positioning on mount at Set 2
  useEffect(() => {
    const container = trackWrapperRef.current;
    if (!container) return;

    const setInitialPos = () => {
      const cards = container.querySelectorAll('.marquee-card');
      if (cards.length >= servicesData.length * 2) {
        const singleSetWidth = cards[servicesData.length].offsetLeft - cards[0].offsetLeft;
        if (singleSetWidth > 0) {
          // Center the first card of Set 2
          const targetCard = cards[servicesData.length];
          const initialCenter = targetCard.offsetLeft - (container.clientWidth - targetCard.offsetWidth) / 2;
          container.scrollLeft = initialCenter > 0 ? initialCenter : singleSetWidth;
        }
      }
    };

    const timer = setTimeout(setInitialPos, 60);
    return () => clearTimeout(timer);
  }, []);

  // Continuous auto-drift on BOTH mobile and desktop
  useEffect(() => {
    const container = trackWrapperRef.current;
    if (!container) return;

    let animId;
    let lastTime = performance.now();

    const loop = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPausedRef.current && animFrameRef.current === null && container) {
        // Continuous reading speed: 18px/sec on mobile, 22px/sec on desktop
        const isMobile = window.innerWidth <= 768;
        const speed = isMobile ? 18 : 22;
        container.scrollLeft += (speed * delta) / 1000;

        const cards = container.querySelectorAll('.marquee-card');
        if (cards.length >= servicesData.length * 2) {
          const singleSetWidth = cards[servicesData.length].offsetLeft - cards[0].offsetLeft;
          if (singleSetWidth > 0) {
            if (container.scrollLeft >= singleSetWidth * 2) {
              container.scrollLeft -= singleSetWidth;
            } else if (container.scrollLeft < singleSetWidth * 0.4) {
              container.scrollLeft += singleSetWidth;
            }
          }
        }
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleServiceClick = (serviceTitle) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
  };

  const currentDisplayNum = String(activeIndex + 1).padStart(2, '0');
  const totalDisplayNum = String(servicesData.length).padStart(2, '0');

  return (
    <section id="services" ref={sectionRef} className="section light-theme bg-light">
      <div className="container">
        {/* Section Header with Top-Right Next/Prev Controls */}
        <div className="services-header-wrapper">
          <div className="text-center section-header">
            <div className="section-badge">Freelancing Services</div>
            <h2 className="section-title">
              Professional Digital Services for <br />
              <span className="highlight-text">Businesses, Startups &amp; Individuals</span>
            </h2>
            <p className="section-description">
              We provide professional digital services engineered to help your business grow online with modern websites, effective digital marketing, and performance-focused solutions.
            </p>
          </div>

          {/* Carousel Navigation with Live Counter */}
          <div className="services-carousel-nav" aria-label="Services carousel navigation">
            <button
              type="button"
              className="carousel-arrow-btn prev-btn"
              onClick={handlePrev}
              aria-label="Previous service"
              title="Previous Service"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="carousel-counter-badge" aria-live="polite">
              <span className="counter-current">{currentDisplayNum}</span>
              <span className="counter-sep">/</span>
              <span className="counter-total">{totalDisplayNum}</span>
            </div>
            <button
              type="button"
              className="carousel-arrow-btn next-btn"
              onClick={handleNext}
              aria-label="Next service"
              title="Next Service"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Interactive Carousel Track */}
        <div
          ref={trackWrapperRef}
          className="services-marquee-wrapper"
          onMouseEnter={() => { isPausedRef.current = true; }}
          onMouseLeave={() => { isPausedRef.current = false; }}
          onPointerDown={() => { isPausedRef.current = true; }}
          onPointerUp={() => { isPausedRef.current = false; }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onScroll={handleScroll}
        >
          <div className="services-marquee-track">
            {/* Set 1 */}
            {servicesData.map((svc, i) => (
              <ServiceCard
                key={`s1-${svc.id}`}
                svc={svc}
                isActive={activeIndex === i}
                onCardClick={() => handleCardClick(svc.title)}
                onSelect={() => handleServiceClick(svc.title)}
              />
            ))}
            {/* Set 2: Exact Clone for Infinite Seamless Continuity */}
            {servicesData.map((svc, i) => (
              <ServiceCard
                key={`s2-${svc.id}`}
                svc={svc}
                isActive={activeIndex === i}
                onCardClick={() => handleCardClick(svc.title)}
                onSelect={() => handleServiceClick(svc.title)}
              />
            ))}
            {/* Set 3: Buffer for Reverse/Forward Wrap */}
            {servicesData.map((svc, i) => (
              <ServiceCard
                key={`s3-${svc.id}`}
                svc={svc}
                isActive={activeIndex === i}
                onCardClick={() => handleCardClick(svc.title)}
                onSelect={() => handleServiceClick(svc.title)}
              />
            ))}
          </div>
        </div>

        {/* Mission Banner */}
        <div
          className={`services-mission-banner ${isVisible ? 'is-visible' : ''}`}
          style={{ '--delay': '450ms' }}
        >
          <div className="mission-content">
            <span className="mission-tag">Our Mission</span>
            <h3 className="mission-title">Ready to Accelerate Your Online Presence?</h3>
            <p className="mission-desc">
              Our goal is to help businesses grow online with modern websites, effective digital marketing, and performance-focused solutions.
            </p>
          </div>
          <a
            href="#contact"
            className="btn btn-primary mission-cta"
            onClick={() => handleServiceClick('Website Development')}
          >
            <span>Get Started Today</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
