import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Video,
  Globe,
  ArrowLeft,
  RefreshCw,
  Play,
  VolumeX,
  Volume2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getEmbedUrl, isDirectVideo } from '../lib/videoUtils';

const MetaAdCard = ({ ad, index, totalAds }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);
  const embedUrl = getEmbedUrl(ad.video_path, ad.platform);
  const isDirect = isDirectVideo(ad.video_path);
  const posterUrl = ad.poster_path 
    ? (ad.poster_path.startsWith('http') ? ad.poster_path : supabase.storage.from('media').getPublicUrl(ad.poster_path).data.publicUrl)
    : undefined;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (isDirect && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleWatchAgain = (e) => {
    if (e) e.stopPropagation();
    setIsEnded(false);
    if (isDirect && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      setIframeKey(prev => prev + 1);
    }
  };

  const handleSeeNext = () => {
    const nextIndex = index + 1;
    if (nextIndex < totalAds) {
      const nextCard = document.getElementById(`meta-ad-${nextIndex}`);
      if (nextCard) {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="meta-ad-card-wrapper" id={`meta-ad-${index}`}>
      <div className="meta-ad-card">
        <div className="meta-ad-video-container" onClick={isDirect ? togglePlay : undefined} style={ad.platform === 'Instagram' ? { aspectRatio: '9/16', overflow: 'hidden', position: 'relative' } : { cursor: isDirect ? 'pointer' : 'default' }}>
          {ad.platform && (
            <div className="meta-ad-badge">
              {ad.platform === 'Instagram' ? <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" style={{width: 14, height: 14}} alt="ig"/> :
               ad.platform === 'Facebook' ? <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" style={{width: 14, height: 14}} alt="fb"/> :
               ad.platform === 'YouTube' ? <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" style={{width: 14, height: 10}} alt="yt"/> :
               ad.platform === 'TikTok' ? <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" style={{width: 14, height: 14}} alt="tt"/> :
               ad.platform === 'Vimeo' ? <img src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Vimeo_Logo.svg" style={{width: 14, height: 14}} alt="vimeo"/> :
               <Video size={14} />}
              {ad.platform}
            </div>
          )}
          
          {ad.video_path && embedUrl ? (
            embedUrl ? (
              <iframe 
                key={iframeKey}
                src={embedUrl} 
                style={{
                  width: ad.platform === 'Instagram' ? 'calc(100% + 2px)' : '100%',
                  height: ad.platform === 'Instagram' ? 'calc(100% + 215px)' : '100%',
                  position: ad.platform === 'Instagram' ? 'absolute' : 'static',
                  top: ad.platform === 'Instagram' ? '-54px' : 'auto',
                  left: ad.platform === 'Instagram' ? '-1px' : 'auto',
                  border: 'none',
                  aspectRatio: (ad.platform === 'TikTok') ? '9/16' : (ad.platform === 'YouTube' || ad.platform === 'Vimeo' || ad.platform === 'Facebook') ? '16/9' : 'auto'
                }}
                frameBorder="0" 
                scrolling="no"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title={ad.title || 'Video'}
              ></iframe>
            ) : isDirect ? (
              <>
                <video 
                  ref={videoRef}
                  src={ad.video_path}
                  poster={posterUrl}
                  muted={isMuted}
                  playsInline
                  preload="none"
                  onEnded={() => { setIsEnded(true); setIsPlaying(false); }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Custom Play/Mute controls for direct video */}
                <div className="meta-video-controls" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}>
                  <div className="meta-mobile-mute" onClick={toggleMute} style={{ pointerEvents: 'auto' }}>
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </div>
                  {!isPlaying && !isEnded && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '50%', display: 'flex' }}>
                      <Play size={32} fill="white" color="white" />
                    </div>
                  )}
                </div>

                <div className={`meta-ad-overlay ${isEnded ? 'active' : ''}`} style={{ zIndex: 5 }}>
                  <button className="meta-ad-overlay-btn primary" onClick={handleWatchAgain}>
                    <RefreshCw size={14} /> Watch Again
                  </button>
                  {index < totalAds - 1 && (
                    <button className="meta-ad-overlay-btn secondary" onClick={handleSeeNext}>
                      See Next <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>External Embed</p>
                <a href={ad.video_path} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-gold)' }}>View Video</a>
              </div>
            )
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>No Video Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Portfolio({ onSelectProject, onRequestProject, isStandalonePage = false, activeTab, onTabChange }) {
  const [projects, setProjects] = useState([]);
  const [metaAds, setMetaAds] = useState([]);
  const [internalTab, setInternalTab] = useState(null); // null | 'website' | 'metaAds'
  const workTab = activeTab !== undefined ? activeTab : internalTab;

  const handleTabChange = (tab) => {
    if (onTabChange) onTabChange(tab);
    setInternalTab(tab);
  };

  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'PUBLISHED')
          .order('display_order', { ascending: true });
        
        
        if (error) {
          console.error('Error fetching projects from Supabase:', error);
          return;
        }

        if (data) {
          // Map DB schema to frontend schema
          const mappedData = data.map(dbProj => {
            let domain = '';
            if (dbProj.live_url) {
              try {
                domain = new URL(dbProj.live_url).hostname.replace(/^www\./, '');
              } catch {
                domain = dbProj.live_url;
              }
            }

            return {
              id: dbProj.id,
              slug: dbProj.slug || dbProj.id,
              category: dbProj.category || 'custom-furniture',
              domain,
              liveUrl: dbProj.live_url,
              badge: dbProj.short_description || '',
              tags: dbProj.technologies || [],
              name: dbProj.title,
              client: '',
              summary: dbProj.full_description,
              image: dbProj.cover_image || '/assets/images/sai-indirabala.png'
            };
          });
          setProjects(mappedData);
        }
      } catch (err) {
        console.error('Exception fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    const fetchMetaAds = async () => {
      try {
        const { data, error } = await supabase
          .from('meta_ads_videos')
          .select('*')
          .eq('status', 'PUBLISHED')
          .order('display_order', { ascending: true });
        if (!error && data) {
          setMetaAds(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMetaAds();
  }, []);

  const categoryCounts = {
    all: projects.length,
    furniture: projects.filter((p) => p.category === 'custom-furniture').length
  };


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

  const isSelectionScreen = workTab === null;
  const isMetaAds = workTab === 'metaAds';
  const sectionClasses = `section ${(isSelectionScreen || isMetaAds) ? 'bg-dark dark-theme' : 'light-theme bg-light'} ${isStandalonePage ? 'portfolio-standalone' : ''}`;

  return (
    <section id="work" className={sectionClasses} style={(isSelectionScreen || isMetaAds) ? { background: '#0a0f1c', minHeight: '80vh', display: isSelectionScreen ? 'flex' : 'block', alignItems: isSelectionScreen ? 'center' : 'stretch', paddingTop: isSelectionScreen ? '6rem' : '4rem', paddingBottom: '4rem' } : {}}>
      <div className="container">
        {/* Section Header (omitted if standalone page, as WorksPage has its own hero) */}
        {!isStandalonePage && !isSelectionScreen && (
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

        {workTab === null ? (
          <div className="work-selection-screen">
            <div className="text-center" style={{ marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
              <div className="section-badge badge-dark" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
                <Sparkles size={13} style={{ marginRight: '6px' }} />
                <span>Our Capabilities</span>
              </div>
              <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Explore Our <span style={{ color: 'var(--primary-gold, #f59e0b)' }}>Digital Expertise</span>
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.15rem', fontWeight: 400, maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
                Select a category below to discover our featured websites, web applications, and high-converting advertising creatives.
              </p>
            </div>
            
            <div className="work-selection-grid">
              {/* Website Development Card */}
              <div 
                className="work-selection-card website" 
                onClick={() => handleTabChange('website')}
              >
                <div className="work-selection-img-wrapper">
                  <img className="work-selection-img" src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Website Development" />
                </div>
                <h4 className="work-selection-title">Website Development</h4>
                <p className="work-selection-desc">Explore websites and web projects we've built.</p>
                <button className="work-selection-btn">
                  <span>Explore Websites</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Meta Ads Card */}
              <div 
                className="work-selection-card meta" 
                onClick={() => handleTabChange('metaAds')}
              >
                <div className="work-selection-img-wrapper meta-bg">
                  <img className="work-selection-img-contain" src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" alt="Meta Ads" />
                </div>
                <h4 className="work-selection-title">Meta Ads</h4>
                <p className="work-selection-desc">Watch our Facebook and Instagram video ad creatives.</p>
                <button className="work-selection-btn">
                  <span>Explore Meta Ads</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : workTab === 'website' ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <button 
                onClick={() => handleTabChange(null)} 
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ArrowLeft size={16} />
                <span>Back to Work Categories</span>
              </button>
            </div>
            
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
          {filteredProjects.map((project) => {
            const projectTarget = project.slug || project.id;
            return (
              <div
                key={project.id}
                className="project-card flagship-showcase-card"
                role="button"
                tabIndex={0}
                aria-label={`View ${project.name} case study`}
                onClick={() => onSelectProject(projectTarget)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProject(projectTarget);
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
                  <picture style={{ display: 'contents' }}>
                    <img
                      src={project.image}
                      alt={project.name}
                      className="project-img flagship-img"
                      loading="lazy"
                      decoding="async"
                      width="1024"
                      height="521"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/sai-indirabala.png';
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </picture>

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
                      <a
                        href={`/work/${projectTarget}`}
                        className="overlay-action-btn secondary"
                        onClick={(e) => {
                          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                            e.preventDefault();
                            e.stopPropagation();
                            onSelectProject(projectTarget);
                          }
                        }}
                        title="Read complete case study & technical architecture"
                      >
                        <Eye size={15} />
                        <span>View Case Study</span>
                      </a>
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
                  {project.client && (
                    <span className="project-client-name">
                      Crafted for {project.client}
                    </span>
                  )}

                  {/* Summary Description */}
                  {project.summary && (
                    <p className="project-summary">{project.summary}</p>
                  )}

                  {/* General Scope / Highlight Pills */}
                  <div className="project-general-pills">
                    {project.tags && project.tags.length > 0 ? (
                      project.tags.slice(0, 4).map((tag, tIdx) => (
                        <span key={tIdx} className="gen-pill">{tag}</span>
                      ))
                    ) : (
                      <>
                        <span className="gen-pill">3D Visualization</span>
                        <span className="gen-pill">Custom Furniture</span>
                        <span className="gen-pill">WhatsApp Enquiries</span>
                        <span className="gen-pill">SEO Optimized</span>
                      </>
                    )}
                  </div>

                  {/* Card Bottom Access Strip */}
                  <div className="project-bottom">
                    <a
                      href={`/work/${projectTarget}`}
                      className="project-cta-btn secondary"
                      onClick={(e) => {
                        if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                          e.preventDefault();
                          e.stopPropagation();
                          onSelectProject(projectTarget);
                        }
                      }}
                    >
                      <Eye size={14} />
                      <span>View Case Study</span>
                    </a>

                    {project.liveUrl && (
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
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </>
        ) : (
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>


            <div className="meta-ads-masonry">
            {metaAds.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                <Video size={48} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Meta Ads Available</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Check back later for new advertising campaigns.</p>
              </div>
            ) : (
              metaAds.map((ad, index) => (
                <MetaAdCard key={ad.id} ad={ad} index={index} totalAds={metaAds.length} />
              ))
            )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
