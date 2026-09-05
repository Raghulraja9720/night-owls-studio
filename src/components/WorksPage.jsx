import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Portfolio from './Portfolio';

export default function WorksPage({ onSelectProject, onRequestProject, onBackHome, onBackToProcess }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleBack = onBackToProcess || onBackHome;

  return (
    <div className="works-page">
      {/* Works Page Header */}
      <section className="works-page-hero dark-theme">
        <div className="container">
          <div className="works-breadcrumb">
            <button
              type="button"
              className="breadcrumb-back-btn"
              onClick={handleBack}
              aria-label="Back to Process"
            >
              <ArrowLeft size={18} />
              <span>Back to Process</span>
            </button>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Our Works</span>
          </div>

          <div className="works-hero-content text-center">
            <div className="section-badge badge-dark">
              <Sparkles size={13} style={{ marginRight: '6px' }} />
              <span>Client Works &amp; Case Studies</span>
            </div>

            <h1 className="works-page-headline">
              Engineered Digital Flagships &amp; <br />
              <span className="text-gradient-gold">High-Conversion Web Systems</span>
            </h1>

            <p className="hero-subline max-w-2xl mx-auto">
              Explore our portfolio of custom-architected websites, web applications, and landing pages designed to load instantly, command authority, and turn visitors into paying clients.
            </p>

            {/* Quick Benchmark Pills */}
            <div className="works-benchmarks-strip">
              <div className="benchmark-pill">
                <Zap size={14} className="text-gold" />
                <span>Sub-Second First Paint</span>
              </div>
              <div className="benchmark-pill">
                <ShieldCheck size={14} className="text-gold" />
                <span>Zero-Bloat React Architecture</span>
              </div>
              <div className="benchmark-pill">
                <Sparkles size={14} className="text-gold" />
                <span>Bespoke Design Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Grid & Filter Tabs */}
      <Portfolio
        onSelectProject={onSelectProject}
        onRequestProject={onRequestProject}
        isStandalonePage={true}
      />

      {/* Works Page Bottom CTA */}
      <section className="works-bottom-cta dark-theme">
        <div className="container">
          <div className="works-cta-card">
            <div className="works-cta-text">
              <span className="section-badge badge-dark">Let's Build Together</span>
              <h2 className="works-cta-title">Need A High-Performing Website For Your Business?</h2>
              <p className="works-cta-desc">
                We analyze your requirements and architect a modern, responsive website tailored to your exact commercial goals within 24 hours.
              </p>
            </div>

            <div className="works-cta-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg glow-btn"
                onClick={() => onRequestProject('Website Development')}
              >
                <span>Book Free Consultation</span>
                <ArrowRight size={18} />
              </button>

              <a
                href="https://wa.me/918531807705?text=Hello%20Night%20Owls%20Studio,%20I%20saw%20your%20works%20and%20want%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
