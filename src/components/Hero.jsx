import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, LayoutGrid, Code2, Target, Sparkles, Check } from 'lucide-react';

export default function Hero({ onExploreWorks, onBookConsultation }) {
  const canvasRef = useRef(null);

  const handleConsultationClick = (e) => {
    e.preventDefault();
    if (onBookConsultation) {
      onBookConsultation();
      return;
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPos = contactEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    const starCount = 65;
    let animationFrameId;

    function resizeCanvas() {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        createStars();
      }
    }

    function createStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.015 + 0.005,
          color: Math.random() > 0.3 ? '#ffffff' : '#fbbf24'
        });
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.speed;
        if (star.alpha > 0.95 || star.alpha < 0.2) {
          star.speed = -star.speed;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="hero" className="hero-section dark-theme">
      <canvas ref={canvasRef} id="starfield" className="hero-canvas"></canvas>
      <div className="hero-glow glow-gold"></div>
      <div className="hero-glow glow-blue"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">⚡ Bespoke Digital Engineering Collective</span>
          </div>

          <h1 className="hero-headline">
            Helping Businesses <br />
            <span className="text-gradient-gold">Grow Online</span>
          </h1>

          <p className="hero-subline">
            We design professional websites, run effective digital ad campaigns, and create strong branding that helps businesses attract and connect with more customers.
          </p>

          <div className="hero-cta-group">
            <a
              href="#contact"
              className="btn btn-primary btn-lg glow-btn"
              onClick={handleConsultationClick}
              aria-label="Book Free Consultation"
            >
              <span>Book Free Consultation</span>
              <ArrowUpRight className="icon-md" />
            </a>
            <a
              href="/work"
              className="btn btn-secondary btn-lg"
              onClick={(e) => {
                if (onExploreWorks) {
                  e.preventDefault();
                  onExploreWorks();
                }
              }}
            >
              <LayoutGrid className="icon-md" />
              <span>Explore Sample Work</span>
            </a>
          </div>

          <div className="hero-metrics">
            <div className="metric-item">
              <span className="metric-value">24/7</span>
              <span className="metric-label">We Build While You Sleep</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value">&lt; 1.0s</span>
              <span className="metric-label">Lightning Page Speed</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-item">
              <span className="metric-value">Direct</span>
              <span className="metric-label">Talk to Builders, Not Middlemen</span>
            </div>
          </div>
        </div>

        {/* Hero Mascot Card */}
        <div className="hero-visual">
          <div className="hero-card-frame">
            <div className="hero-card-header">
              <div className="window-title">nightowls.studio</div>
              <div className="status-indicator">
                <span className="pulse-core"></span>
                <span className="status-label">Active</span>
              </div>
            </div>

            <div className="hero-card-body">
              <div className="owl-emblem-wrap">
                <img src="/assets/logo/night owls logo.png" alt="Night Owls Studio Emblem" className="hero-owl-image" />
              </div>
              <div className="live-activity-box">
                <div className="activity-row">
                  <div className="activity-icon"><Code2 size={18} /></div>
                  <div className="activity-info">
                    <span className="activity-title">Website &amp; Web App Development</span>
                    <span className="activity-status">Modern, fast, and responsive websites and web applications built for businesses.</span>
                  </div>
                  <span className="activity-check"><Check size={16} /></span>
                </div>

                <div className="activity-row">
                  <div className="activity-icon"><Target size={18} /></div>
                  <div className="activity-info">
                    <span className="activity-title">Digital Marketing &amp; Lead Generation</span>
                    <span className="activity-status">SEO, Meta Ads, and marketing strategies that help businesses reach the right audience and generate enquiries.</span>
                  </div>
                  <span className="activity-check"><Check size={16} /></span>
                </div>

                <div className="activity-row">
                  <div className="activity-icon"><Sparkles size={18} /></div>
                  <div className="activity-info">
                    <span className="activity-title">Creative Design &amp; Content</span>
                    <span className="activity-status">Social media content, branding, and video editing that help businesses build a stronger online presence.</span>
                  </div>
                  <span className="activity-check"><Check size={16} /></span>
                </div>
              </div>
            </div>

            <div className="hero-card-footer">
              <span className="motto-code">&lt;/&gt; IDEAS. WEBSITES. MARKETING. GROWTH.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
