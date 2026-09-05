import React, { useState } from 'react';
import {
  Eye,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Box,
  Layers,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

const projects = [
  {
    id: 'sai-indirabala',
    category: 'custom-furniture',
    domain: 'sai-indirabala-furniture.vercel.app',
    liveUrl: 'https://sai-indirabala-furniture.vercel.app/',
    badge: 'CUSTOM FURNITURE • 3D INTERIOR SHOWCASE',
    tags: ['Custom Furniture', '3D Interior Showcase', 'Digital Experience'],
    deliverables: [
      'Responsive Business Website',
      '3D Visualization Showcase',
      'Project Gallery',
      'Customer Reviews',
      'WhatsApp Integration',
      'SEO Optimization'
    ],
    highlights: [
      {
        title: '3D VISUALIZATION',
        desc: 'See furniture designs before production'
      },
      {
        title: 'PROJECT SHOWCASE',
        desc: '3D concepts → Built reality'
      },
      {
        title: 'LEAD GENERATION',
        desc: 'Direct consultation & WhatsApp enquiries'
      }
    ],
    name: 'Sai Indirabala Furniture — Digital Experience',
    client: 'Sai Indirabala Furniture & Interiors (Madurai)',
    summary: 'A premium digital presence created for a Madurai-based furniture and interior business, showcasing custom furniture, 3D visualization, completed projects, and real customer feedback.',
    outcome: 'A professional online showroom that presents their craftsmanship, builds customer confidence, and turns website visitors into direct enquiries.',
    image: '/assets/images/sai-indirabala.png',
    metric: '3D Visualization Showcase',
    service: 'Website Development'
  }
];

const categoryCounts = {
  all: projects.length,
  furniture: projects.filter((p) => p.category === 'custom-furniture').length
};

export default function Portfolio({ onSelectProject, onRequestProject, isStandalonePage = false }) {
  const [filter, setFilter] = useState('all');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const handleInquire = (e, serviceName) => {
    e.stopPropagation();
    if (onRequestProject) {
      onRequestProject(serviceName);
    }
  };

  return (
    <section id="work" className={`section light-theme bg-light ${isStandalonePage ? 'portfolio-standalone' : ''}`}>
      <div className="container">
        {/* Section Header (omitted if standalone page, as WorksPage has its own hero) */}
        {!isStandalonePage && (
          <div className="text-center section-header">
            <div className="section-badge">
              <Sparkles size={13} style={{ marginRight: '5px' }} />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="section-title">
              What We Can Build For Your Business
            </h2>
            <p className="section-description">
              Explore our featured digital showcase engineered with immersive 3D presentation, direct customer conversion paths, and high performance.
            </p>
          </div>
        )}

        {/* Filter Tabs with Counts */}
        <div className="portfolio-filter-tabs" role="tablist" aria-label="Portfolio categories">
          <button
            role="tab"
            aria-selected={filter === 'all'}
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <span>All Works</span>
            <span className="filter-count-chip">{categoryCounts.all}</span>
          </button>
          <button
            role="tab"
            aria-selected={filter === 'custom-furniture'}
            className={`filter-tab ${filter === 'custom-furniture' ? 'active' : ''}`}
            onClick={() => setFilter('custom-furniture')}
          >
            <span>Custom Furniture &amp; 3D Interiors</span>
            <span className="filter-count-chip">{categoryCounts.furniture}</span>
          </button>
        </div>

        {/* Projects Grid / Flagship Showcase */}
        <div className={`projects-grid ${filteredProjects.length === 1 ? 'single-flagship-grid' : ''}`}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card flagship-showcase-card"
              role="button"
              tabIndex={0}
              aria-label={`View ${project.name} case study`}
              onClick={() => onSelectProject(project.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject(project.id);
                }
              }}
            >
              {/* Browser Window Chrome Frame Header */}
              <div className="project-mockup-header">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mockup-url-bar mockup-url-link"
                  onClick={(e) => e.stopPropagation()}
                  title="Open live website in new tab"
                >
                  <Lock size={10} className="mockup-lock" />
                  <span className="mockup-domain">{project.domain}</span>
                  <ExternalLink size={9} className="mockup-ext-icon" />
                </a>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mockup-status mockup-live-badge-link"
                  onClick={(e) => e.stopPropagation()}
                  title="Open live website in new tab"
                >
                  <span className="live-pulse"></span>
                  <span className="mockup-status-label">Live Site ↗</span>
                </a>
              </div>

              {/* Visual Showcase Box */}
              <div className="project-image-box">
                <img
                  src={project.image}
                  alt={project.name}
                  className="project-img flagship-img"
                  loading="lazy"
                  decoding="async"
                  width="1024"
                  height="521"
                />

                {/* Interactive Glassmorphic Hover Overlay */}
                <div className="project-hover-overlay">
                  <div className="overlay-actions-wrap">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="overlay-action-btn primary live-url-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={15} />
                      <span>Visit Live Website</span>
                    </a>
                    <button
                      type="button"
                      className="overlay-action-btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project.id);
                      }}
                      title="Read complete case study & technical architecture"
                    >
                      <Eye size={15} />
                      <span>View Case Study</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Content & Information Architecture */}
              <div className="project-content">
                {/* Badge and Tag Row */}
                <div className="project-tag-wrap">
                  <span className="case-study-badge">{project.badge}</span>
                </div>

                {/* Project Title with Arrow Affordance */}
                <div className="project-title-row">
                  <h3 className="project-name">{project.name}</h3>
                  <div className="project-title-arrow-box">
                    <ArrowUpRight size={16} className="project-title-arrow" />
                  </div>
                </div>

                {/* Client Subtitle */}
                <span className="project-client-name">
                  Crafted for {project.client}
                </span>

                {/* Summary Description */}
                <p className="project-summary">{project.summary}</p>

                {/* General Scope / Highlight Pills */}
                <div className="project-general-pills">
                  <span className="gen-pill">3D Visualization</span>
                  <span className="gen-pill">Custom Furniture</span>
                  <span className="gen-pill">WhatsApp Enquiries</span>
                  <span className="gen-pill">SEO Optimized</span>
                </div>

                {/* Card Bottom Access Strip */}
                <div className="project-bottom">
                  <button
                    type="button"
                    className="project-cta-btn secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProject(project.id);
                    }}
                  >
                    <Eye size={14} />
                    <span>View Case Study</span>
                  </button>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-visit-live"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Visit Live Website</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
