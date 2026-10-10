import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Sparkles,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Eye,
  X,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DEFAULT_PROJECT_PLACEHOLDER } from '../lib/imageUrlUtils';

export default function CaseStudyPage({ onRequestProject, onNavigate }) {
  const { slug: paramSlug } = useParams();
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : location.pathname;
  const pathParts = currentPath.split('/').filter(Boolean);
  const slugFromPath = (pathParts[0] === 'work' || pathParts[0] === 'case-study') && pathParts[1] ? pathParts[1] : '';
  const slug = paramSlug || slugFromPath;

  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!slug) {
        setError('No project identifier provided');
        setLoading(false);
        return;
      }

      // Check for preview param and admin session
      const currentSearch = typeof window !== 'undefined' ? window.location.search : '';
      const urlParams = new URLSearchParams(currentSearch);
      const wantsPreview = urlParams.get('preview') === 'true';
      
      let validPreview = false;
      if (wantsPreview) {
        const { data: { session } } = await supabase.auth.getSession();
        validPreview = !!session;
        setIsPreview(validPreview);
      } else {
        setIsPreview(false);
      }

      // 1. Try querying by slug first (case-insensitive)
      let query = supabase.from('projects').select('*').ilike('slug', slug);
      if (!validPreview) {
        query = query.eq('status', 'PUBLISHED');
      }
      let { data, error: dbError } = await query.maybeSingle();

      // 2. If not found by slug, and slug looks like a UUID or ID, try by id
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
      if (!data && isUUID) {
        let idQuery = supabase.from('projects').select('*').eq('id', slug);
        if (!validPreview) {
          idQuery = idQuery.eq('status', 'PUBLISHED');
        }
        const idResult = await idQuery.maybeSingle();
        data = idResult.data;
        if (idResult.error) dbError = idResult.error;
      }

      // 3. Fallback for legacy URLs
      if (!data && slug) {
        const legacyMap = {
          'aruna': '7498c8fa-4750-458e-8c90-b9d819893223',
          'padma-tours': 'ab874d0e-1846-4edf-9879-6231f6a66fdc',
          'padma': 'ab874d0e-1846-4edf-9879-6231f6a66fdc',
          'sai': '2521d6a6-c6fc-41f5-b3ed-6d8f6b8bd207'
        };
        const mappedId = legacyMap[slug.toLowerCase()];
        if (mappedId) {
          let fallbackQuery = supabase.from('projects').select('*').eq('id', mappedId);
          if (!validPreview) fallbackQuery = fallbackQuery.eq('status', 'PUBLISHED');
          const fbResult = await fallbackQuery.maybeSingle();
          data = fbResult.data;
          if (fbResult.error && !dbError) dbError = fbResult.error;
        }
      }

      if (dbError) throw dbError;

      if (!data) {
        setError('Project not found or is not currently published.');
        setProject(null);
      } else {
        setProject(data);
        if (data.seo_title) {
          document.title = `${data.seo_title} | Night Owls Studio`;
        } else if (data.title) {
          document.title = `${data.title} — Case Study | Night Owls Studio`;
        }
      }
    } catch (err) {
      console.error('Error fetching case study:', err);
      setError('Unable to load case study data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWork = () => {
    let categoryMap = {
      'custom-furniture': 'website',
      'e-commerce': 'website',
      'landing-page': 'website',
      'metaAds': 'metaAds',
      'meta-ads': 'metaAds'
    };
    
    let section = project?.category ? (categoryMap[project.category] || 'website') : '';
    
    if (onNavigate) {
      onNavigate('work', section);
    } else {
      navigate(section ? `/work#${section}` : '/work');
    }
  };

  const handleRequestSimilar = () => {
    const serviceName = project?.category || 'Website Development';
    if (onRequestProject) {
      onRequestProject(serviceName);
    } else if (onNavigate) {
      onNavigate('home', 'contact');
    } else {
      navigate('/#contact');
    }
  };

  // Close image lightbox on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedGalleryImg(null);
    };
    if (selectedGalleryImg) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedGalleryImg]);

  // Loading State
  if (loading) {
    return (
      <div className="case-study-page dark-theme" style={{ minHeight: '80vh', paddingTop: '120px', paddingBottom: '80px' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Skeleton Breadcrumbs */}
          <div style={{ height: '20px', width: '240px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '2rem' }} className="skeleton-pulse" />
          
          {/* Skeleton Header */}
          <div style={{ height: '48px', width: '70%', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', marginBottom: '1.25rem' }} className="skeleton-pulse" />
          <div style={{ height: '24px', width: '50%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '2.5rem' }} className="skeleton-pulse" />
          
          {/* Skeleton Cover Frame */}
          <div style={{ width: '100%', aspectRatio: '16/9', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', marginBottom: '3rem' }} className="skeleton-pulse" />
          
          {/* Skeleton Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div style={{ height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} className="skeleton-pulse" />
            <div style={{ height: '120px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} className="skeleton-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Not Found / Error State
  if (error || !project) {
    return (
      <div className="case-study-page dark-theme" style={{ minHeight: '80vh', paddingTop: '140px', paddingBottom: '100px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '0 1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <AlertCircle size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', color: 'white', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Case Study Not Found
          </h1>
          <p style={{ color: 'var(--text-muted, #94a3b8)', lineHeight: 1.6, fontSize: '1.05rem', marginBottom: '2rem' }}>
            {error || 'The requested project could not be found or may currently be in draft.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleBackToWork}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              <ArrowLeft size={18} />
              <span>Back to All Works</span>
            </button>
            <button
              onClick={fetchProject}
              className="btn btn-secondary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const liveDomain = project.live_url ? (() => {
    try {
      return new URL(project.live_url).hostname.replace(/^www\./, '');
    } catch {
      return project.live_url;
    }
  })() : null;

  const coverImageSrc = project.cover_image || DEFAULT_PROJECT_PLACEHOLDER;
  const galleryImages = Array.isArray(project.images) ? project.images.filter(Boolean) : [];

  return (
    <div className="case-study-page dark-theme" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px', background: 'var(--color-bg, #050a16)' }}>
      {/* Draft Preview Indicator Banner */}
      {isPreview && (
        <div style={{
          position: 'sticky', top: '72px', zIndex: 40,
          background: 'linear-gradient(90deg, #b45309, #d97706)', color: 'white',
          padding: '0.6rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 600,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
        }}>
          <Eye size={16} />
          <span>Admin Preview Mode — This case study is currently {project.status}. Public visitors can only view Published works.</span>
        </div>
      )}

      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
          <ol style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: '#94a3b8', flexWrap: 'wrap' }}>
            <li>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                Home
              </Link>
            </li>
            <li><ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} /></li>
            <li>
              <Link to="/work" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fbbf24'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                Work
              </Link>
            </li>
            <li><ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} /></li>
            <li aria-current="page" style={{ color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
              {project.title}
            </li>
          </ol>
        </nav>

        {/* Back Button Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            type="button"
            onClick={handleBackToWork}
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Projects</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.15rem', fontSize: '0.9rem' }}
              >
                <span>Visit Live Website</span>
                <ExternalLink size={15} />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.15rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <Github size={16} />
                <span>GitHub Repo</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Title Section */}
        <header style={{ marginBottom: '2.5rem' }}>
          {project.category && (
            <div style={{ marginBottom: '0.75rem' }}>
              <span className="case-study-badge" style={{ fontSize: '0.75rem', padding: '0.3rem 0.85rem' }}>
                {project.category}
              </span>
            </div>
          )}

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'white',
            letterSpacing: '-0.025em',
            margin: '0 0 1rem 0',
            overflowWrap: 'anywhere',
            wordBreak: 'break-word'
          }}>
            {project.title}
          </h1>

          {project.short_description && (
            <p style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              color: '#cbd5e1',
              lineHeight: 1.6,
              maxWidth: '850px',
              margin: 0,
              overflowWrap: 'anywhere',
              wordBreak: 'break-word'
            }}>
              {project.short_description}
            </p>
          )}
        </header>

        {/* Cover Image Showcase with Browser Frame Mockup */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          marginBottom: '3.5rem'
        }}>
          {/* Mockup Frame Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1.25rem', background: 'rgba(6, 11, 24, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap', gap: '0.5rem'
          }}>
            {/* Window Controls Dot Decorator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
            </div>

            {/* URL Bar */}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.3rem 0.75rem', background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '20px', fontSize: '0.8rem', color: '#cbd5e1',
                  textDecoration: 'none', border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <Lock size={12} style={{ color: '#10b981' }} />
                <span>{liveDomain}</span>
                <ExternalLink size={11} style={{ opacity: 0.6 }} />
              </a>
            )}

            {/* Live Indicator */}
            {project.live_url && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                <span className="live-pulse" />
                <span>Active System</span>
              </div>
            )}
          </div>

          {/* Cover Image Element (Eager load hero image) */}
          <div style={{ width: '100%', background: '#020617', position: 'relative' }}>
            <img
              src={coverImageSrc}
              alt={`${project.title} Cover Showcase`}
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_PROJECT_PLACEHOLDER;
                e.currentTarget.onerror = null;
              }}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '650px',
                objectFit: 'cover',
                objectPosition: 'top center'
              }}
            />
          </div>
        </div>

        {/* Metadata & Tech Stack Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '12px',
          padding: '1.75rem',
          marginBottom: '3.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          {project.category && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', fontWeight: 600 }}>
                Scope &amp; Discipline
              </div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                {project.category}
              </div>
            </div>
          )}

          {project.year && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', fontWeight: 600 }}>
                Year
              </div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                {project.year}
              </div>
            </div>
          )}

          {liveDomain && (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', fontWeight: 600 }}>
                Live Deployment
              </div>
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <span>{liveDomain}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', fontWeight: 600 }}>
                Technologies &amp; Architecture
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '0.825rem',
                      fontWeight: 500
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Narrative Sections (Only render if present) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
          {/* Full Description */}
          {project.full_description && (
            <section>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', letterSpacing: '-0.015em' }}>
                Executive Overview
              </h2>
              <div style={{
                color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.05rem',
                whiteSpace: 'pre-line', overflowWrap: 'anywhere', wordBreak: 'break-word'
              }}>
                {project.full_description}
              </div>
            </section>
          )}

          {/* The Challenge */}
          {project.challenge && (
            <section style={{
              background: 'rgba(239, 68, 68, 0.03)',
              borderLeft: '4px solid #ef4444',
              borderRadius: '0 8px 8px 0',
              padding: '1.5rem 1.75rem'
            }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fca5a5', marginBottom: '0.75rem' }}>
                The Challenge
              </h2>
              <div style={{
                color: '#e2e8f0', lineHeight: 1.75, fontSize: '1rem',
                whiteSpace: 'pre-line', overflowWrap: 'anywhere', wordBreak: 'break-word'
              }}>
                {project.challenge}
              </div>
            </section>
          )}

          {/* The Solution */}
          {project.solution && (
            <section style={{
              background: 'rgba(59, 130, 246, 0.03)',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '0 8px 8px 0',
              padding: '1.5rem 1.75rem'
            }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#93c5fd', marginBottom: '0.75rem' }}>
                The Architectural Solution
              </h2>
              <div style={{
                color: '#e2e8f0', lineHeight: 1.75, fontSize: '1rem',
                whiteSpace: 'pre-line', overflowWrap: 'anywhere', wordBreak: 'break-word'
              }}>
                {project.solution}
              </div>
            </section>
          )}

          {/* The Results */}
          {project.results && (
            <section style={{
              background: 'rgba(16, 185, 129, 0.04)',
              borderLeft: '4px solid #10b981',
              borderRadius: '0 8px 8px 0',
              padding: '1.5rem 1.75rem'
            }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '0.75rem' }}>
                Key Results &amp; Impact
              </h2>
              <div style={{
                color: '#e2e8f0', lineHeight: 1.75, fontSize: '1rem',
                whiteSpace: 'pre-line', overflowWrap: 'anywhere', wordBreak: 'break-word'
              }}>
                {project.results}
              </div>
            </section>
          )}
        </div>

        {/* Gallery Showcase (Lazy loaded non-critical images) */}
        {galleryImages.length > 0 && (
          <section style={{ marginBottom: '4.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', letterSpacing: '-0.015em' }}>
              Project Media Gallery ({galleryImages.length})
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
              gap: '1.25rem'
            }}>
              {galleryImages.map((imgUrl, gIdx) => (
                <div
                  key={gIdx}
                  onClick={() => setSelectedGalleryImg(imgUrl)}
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    aspectRatio: '16/10',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  className="gallery-thumb-card"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} Gallery Asset ${gIdx + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_PROJECT_PLACEHOLDER;
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(5, 10, 22, 0.4)',
                    opacity: 0, transition: 'opacity 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white'
                  }} className="gallery-thumb-overlay">
                    <Eye size={24} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Lightbox Modal */}
        {selectedGalleryImg && (
          <div
            onClick={() => setSelectedGalleryImg(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              background: 'rgba(3, 7, 18, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <button
              onClick={() => setSelectedGalleryImg(null)}
              aria-label="Close Lightbox"
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.1)', border: 'none',
                color: 'white', width: '44px', height: '44px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10
              }}
            >
              <X size={20} />
            </button>
            <img
              src={selectedGalleryImg}
              alt="Enlarged view"
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: '92vw',
                maxHeight: '88vh',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                objectFit: 'contain'
              }}
            />
          </div>
        )}

        {/* Bottom CTA Card */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          borderRadius: '16px',
          padding: 'clamp(2rem, 4vw, 3.5rem)',
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
        }}>
          <span className="section-badge badge-dark" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} />
            Partner With Night Owls Studio
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Ready To Engineer A Similar Digital Flagship?
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.6, fontSize: '1.05rem' }}>
            Whether you need a bespoke web platform, 3D interactive experience, or conversion-focused architecture, we bring ideas into production reality.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleRequestSimilar}
              className="btn btn-primary btn-lg glow-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem' }}
            >
              <span>Book Free Consultation</span>
              <ArrowRight size={18} />
            </button>
            <a
              href="https://wa.me/918531807705?text=Hello%20Night%20Owls%20Studio,%20I%20saw%20your%20case%20studies%20and%20want%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
