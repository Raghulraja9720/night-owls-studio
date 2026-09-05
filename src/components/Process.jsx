import React from 'react';
import { Search, Compass, Rocket, BarChart2, CheckCircle2, ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';

const processSteps = [
  {
    num: '01',
    title: 'Discovery & Scope',
    desc: 'We map your commercial goals, audience psychology, and technical performance targets into a clear architectural blueprint.',
    deliverable: 'Fixed Roadmap & Scope',
    icon: Search,
    colorClass: 'step-amber'
  },
  {
    num: '02',
    title: 'Design Systems',
    desc: 'We design the user journey, spatial typography, and high-fidelity interface prototypes with your direct review.',
    deliverable: 'Prototype Sign-Off',
    icon: Compass,
    colorClass: 'step-cyan'
  },
  {
    num: '03',
    title: 'Engineering & Edge',
    desc: 'We develop with clean modular code, optimize media payloads, and test responsiveness rigorously across all viewports.',
    deliverable: 'Sub-Second First Paint',
    icon: Rocket,
    colorClass: 'step-indigo'
  },
  {
    num: '04',
    title: 'Launch & Scale',
    desc: 'We handle domain setup, analytics verification, and conversion tracking, tuning continuously for peak ROI.',
    deliverable: 'Live Production Handoff',
    icon: BarChart2,
    colorClass: 'step-emerald'
  }
];

export default function Process({ onExploreWorks }) {
  return (
    <section id="process" className="section light-theme bg-white">
      <div className="container">
        <div className="text-center section-header">
          <div className="section-badge">How We Work</div>
          <h2 className="section-title">A Clear 4-Step Agile Delivery Cadence</h2>
          <p className="section-description">
            Zero ambiguity or missed deadlines. We execute through a battle-tested roadmap from initial architecture to live edge deployment.
          </p>
        </div>

        <div className="process-grid">
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === processSteps.length - 1;

            return (
              <div key={step.num} className={`process-step-card ${step.colorClass}`}>
                <div className="step-card-header">
                  <div className="step-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <span className="step-num-badge">{step.num}</span>
                </div>

                <div className="step-card-content">
                  <h4 className="step-heading">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>

                <div className="step-deliverable-wrap">
                  <div className="step-deliverable-pill">
                    <CheckCircle2 size={13} className="deliverable-icon" />
                    <span>{step.deliverable}</span>
                  </div>
                </div>

                {!isLast && (
                  <div className="step-connector-arrow" aria-hidden="true">
                    <ArrowRight size={13} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Explore Our Works Banner / Button under the process */}
        <div className="process-works-banner">
          <div className="process-works-content">
            <div className="process-works-tag">
              <Sparkles size={13} />
              <span>Proven In Action</span>
            </div>
            <h3 className="process-works-title">See This 4-Step Process in Live Production</h3>
            <p className="process-works-desc">
              From institutional corporate portals to luxury commerce flagships, explore the fast, responsive websites and web applications we've engineered.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg glow-btn process-works-btn"
            onClick={onExploreWorks}
            aria-label="Explore Our Works"
          >
            <LayoutGrid size={18} />
            <span>Explore Our Works</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
