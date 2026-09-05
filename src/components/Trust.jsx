import React from 'react';
import { Repeat, Unlock, UserCheck, Quote } from 'lucide-react';

export default function Trust() {
  return (
    <section id="guarantee" className="section dark-theme trust-section">
      <div className="container">
        <div className="text-center section-header">
          <div className="section-badge badge-dark">Zero-Risk Guarantee</div>
          <h2 className="section-title text-white">Why Trust A Dedicated Engineering Collective?</h2>
          <p className="hero-subline max-w-2xl mx-auto">
            Traditional agencies relegate clients to junior account reps. With Night Owls Studio, you collaborate directly with the senior specialists engineering your platform.
          </p>
        </div>

        <div className="trust-cards-grid">
          <div className="trust-card">
            <div className="trust-icon-box"><Repeat size={24} /></div>
            <h3 className="trust-card-title">Revisions Until Flawless</h3>
            <p className="trust-card-text">
              We iterate and refine until your digital property satisfies your exact visual polish, speed benchmark, and conversion goals.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box"><Unlock size={24} /></div>
            <h3 className="trust-card-title">No Long-Term Lock-Ins</h3>
            <p className="trust-card-text">
              We earn your ongoing partnership every month through clean performance and measurable inquiries, never rigid lock-in contracts.
            </p>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box"><UserCheck size={24} /></div>
            <h3 className="trust-card-title">Direct Partner Access</h3>
            <p className="trust-card-text">
              No junior call queues. Connect directly with the technical partners building your platform via phone, WhatsApp, or video conference.
            </p>
          </div>
        </div>

        {/* Pull Quote */}
        <div className="pull-quote-wrapper">
          <div className="pull-quote-box">
            <div className="pull-quote-icon"><Quote size={28} /></div>
            <p className="pull-quote-text">
              "We don't just build websites — we engineer digital flagships that command authority and generate compound growth while you sleep."
            </p>
            <span className="pull-quote-sub">The Night Owls Studio Engineering Standard</span>
          </div>
        </div>
      </div>
    </section>
  );
}
