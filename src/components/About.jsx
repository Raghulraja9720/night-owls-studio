import React from 'react';
import { Clock4, MessageSquareHeart, ShieldCheck, Briefcase, Sparkles, Armchair, Laptop, ShoppingBag } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="section light-theme bg-white">
      <div className="container">
        <div className="text-center section-header">
          <div className="section-badge">About Night Owls Studio</div>
          <h2 className="section-title">A Focused Engineering Collective Built for Real-World Impact</h2>
          <p className="section-description">
            We partner with ambitious founders and business leaders to engineer authoritative digital flagships that marry aesthetic prestige with uncompromised technical performance.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon-box"><Clock4 size={24} /></div>
            <h3 className="about-card-title">We Build While You Sleep</h3>
            <p className="about-card-text">
              You steer your business operations. Our agile collective architects, tests, and deploys your digital properties so you wake up to live milestones and inbound inquiries.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon-box"><MessageSquareHeart size={24} /></div>
            <h3 className="about-card-title">Zero Bloat, Zero Jargon</h3>
            <p className="about-card-text">
              No cumbersome agency layers or vanity buzzwords. You get clean architecture, direct technical communication, and transparent weekly sprint outcomes.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon-box"><ShieldCheck size={24} /></div>
            <h3 className="about-card-title">High-Touch Strategic Partnership</h3>
            <p className="about-card-text">
              We limit active client engagements to deliver obsessive craftsmanship, sub-second load times, and direct partner access across WhatsApp and call.
            </p>
          </div>
        </div>

        {/* Industries We Support */}
        <div className="industries-strip">
          <span className="industries-label">Industries We Specialize In:</span>
          <div className="industries-tags">
            <span className="ind-pill"><Briefcase size={14} /> Enterprise &amp; Advisory</span>
            <span className="ind-pill"><Sparkles size={14} /> Luxury &amp; Artisanal Brands</span>
            <span className="ind-pill"><Armchair size={14} /> Architecture &amp; Living</span>
            <span className="ind-pill"><Laptop size={14} /> FinTech &amp; High-Growth Startups</span>
            <span className="ind-pill"><ShoppingBag size={14} /> Modern Digital Commerce</span>
          </div>
        </div>
      </div>
    </section>
  );
}
