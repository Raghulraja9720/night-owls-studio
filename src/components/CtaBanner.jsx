import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';

export default function CtaBanner({ onBookConsultation }) {
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

  return (
    <section id="cta-banner" className="cta-banner-section dark-theme">
      <div className="container">
        <div className="cta-banner-card">
          <h2 className="cta-headline">Let's Build Something That Actually Converts.</h2>
          <p className="cta-subline">
            No technical confusion. No bloated agency overhead. Just an ultra-fast digital presence engineered for real customer inquiries.
          </p>
          <div className="cta-btn-group">
            <a
              href="#contact"
              className="btn btn-primary btn-lg glow-btn"
              onClick={handleConsultationClick}
              aria-label="Book Free Consultation"
            >
              <span>Book Free Consultation</span>
              <ArrowRight size={18} />
            </a>
            <a href="tel:8531807705" className="btn btn-secondary btn-lg">
              <Phone size={18} />
              <span>Call Us Directly</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
