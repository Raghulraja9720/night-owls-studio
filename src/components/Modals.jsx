import React, { useEffect } from 'react';
import { X, ArrowRight, Lock, CheckCircle2, Zap, TrendingUp, Sparkles, ExternalLink } from 'lucide-react';

const projectsData = {
  'sai-indirabala': {
    title: 'Sai Indirabala Furniture — Digital Experience',
    category: 'CUSTOM FURNITURE • 3D INTERIOR SHOWCASE',
    domain: 'sai-indirabala-furniture.vercel.app',
    liveUrl: 'https://sai-indirabala-furniture.vercel.app/',
    service: 'Website Development',
    image: '/assets/images/sai-indirabala.png',
    description: 'A premium digital presence created for a Madurai-based furniture and interior business, showcasing custom furniture, 3D visualization, completed projects, and real customer feedback.',
    deliverables: [
      'Responsive Business Website',
      '3D Visualization Showcase',
      'Project Gallery',
      'Customer Reviews',
      'WhatsApp Integration',
      'SEO Optimization'
    ],
    stats: [
      { value: '3D VISUALIZATION', desc: 'See furniture designs before production', highlight: true },
      { value: 'PROJECT SHOWCASE', desc: '3D concepts → Built reality', highlight: false },
      { value: 'LEAD GENERATION', desc: 'Direct consultation & WhatsApp enquiries', highlight: false }
    ],
    results: 'A professional online showroom that presents their craftsmanship, builds customer confidence, and turns website visitors into direct enquiries.'
  }
};

export function ProjectModal({ projectId, onClose, onRequestProject }) {
  const data = projectsData[projectId];

  useEffect(() => {
    if (projectId) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [projectId, onClose]);

  if (!projectId || !data) return null;

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog modal-dialog-lg" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close Case Study">
          <X size={18} />
        </button>

        <div className="modal-body">
          {/* Modal Browser Mockup Header */}
          <div className="modal-mockup-frame">
            <div className="project-mockup-header">
              <a
                href={data.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mockup-url-bar mockup-url-link"
                title="Open live website in new tab"
              >
                <Lock size={10} className="mockup-lock" />
                <span className="mockup-domain">{data.domain}</span>
                <ExternalLink size={9} className="mockup-ext-icon" />
              </a>
              <a
                href={data.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mockup-status mockup-live-badge-link"
                title="Open live website in new tab"
              >
                <span className="live-pulse"></span>
                <span className="mockup-status-label">Live Site ↗</span>
              </a>
            </div>
            <img src={data.image} alt={data.title} className="modal-project-img" />
          </div>

          <div className="modal-content-wrap">
            <span className="modal-project-subtitle">{data.category}</span>
            <h3 className="modal-project-title">{data.title}</h3>
            <p className="modal-project-desc">{data.description}</p>

            {/* Performance Stat Highlights */}
            {data.stats && (
              <div className="modal-stats-strip">
                {data.stats.map((stat, sIdx) => (
                  <div key={sIdx} className={`modal-stat-box ${stat.highlight ? 'highlight' : ''}`}>
                    <span className="modal-stat-val">{stat.value}</span>
                    <span className="modal-stat-desc">{stat.desc || stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Deliverables Breakdown */}
            <div className="modal-details-grid">
              <div className="modal-detail-item">
                <span className="modal-detail-label">Deliverables &amp; Scope</span>
                <div className="modal-deliverables-list">
                  {data.deliverables.map((item, idx) => (
                    <span key={idx} className="modal-deliverable-chip">
                      <CheckCircle2 size={13} className="deliverable-check" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="modal-detail-item">
                <span className="modal-detail-label">Project Outcome</span>
                <span className="modal-detail-val">{data.results}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-actions-group">
              {data.liveUrl && (
                <a
                  href={data.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-live-site glow-btn-green"
                >
                  <ExternalLink size={16} />
                  <span>Visit Live Website</span>
                </a>
              )}
              <a
                href="#contact"
                className="btn btn-primary glow-btn modal-action-primary"
                onClick={() => {
                  onClose();
                  if (onRequestProject) onRequestProject(data.service || 'Website Development');
                }}
              >
                <span>Request Similar Project</span>
                <ArrowRight size={16} />
              </a>
              <button className="btn btn-outline modal-action-secondary" onClick={onClose}>
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PolicyModal({ policyType, onClose }) {
  useEffect(() => {
    if (policyType) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [policyType, onClose]);

  if (!policyType) return null;

  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog">
        <button className="modal-close modal-close-light" onClick={onClose} aria-label="Close Dialog">
          <X size={20} />
        </button>
        <div className="modal-body modal-policy-body">
          {policyType === 'privacy' ? (
            <>
              <h3 className="modal-project-title">Privacy Policy</h3>
              <p className="modal-project-desc">
                At <strong>Night Owls Studio</strong>, we respect your privacy. We only collect the personal contact details you explicitly provide (such as your name, email, phone number, and business details) when reaching out for service inquiries.
              </p>
              <p className="modal-project-desc">
                We never sell, rent, or share your contact information with third-party marketers. Your details are solely used by our core team to respond to your project requirements, coordinate deliverables, and provide client support.
              </p>
              <button className="btn btn-primary" onClick={onClose}>
                Got It
              </button>
            </>
          ) : (
            <>
              <h3 className="modal-project-title">Terms &amp; Conditions</h3>
              <p className="modal-project-desc">
                <strong>Our Philosophy:</strong> We believe in transparent partnerships without complex legal jargon or hidden traps.
              </p>
              <p className="modal-project-desc">
                - <strong>Quotes &amp; Deliverables:</strong> All project scopes, timelines, and costs are agreed upon before work begins.<br />
                - <strong>Founder Guarantee:</strong> We provide dedicated revisions until you are completely satisfied with the agreed scope.<br />
                - <strong>Ownership:</strong> You retain full ownership of your domain, website assets, and ad accounts upon project completion.
              </p>
              <button className="btn btn-primary" onClick={onClose}>
                I Understand
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
