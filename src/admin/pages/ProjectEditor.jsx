import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Settings,
  LayoutGrid,
  CheckCircle,
  ExternalLink,
  Eye,
  Plus,
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Search,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ImagePreviewCard from '../components/ImagePreviewCard';
import { validateImageUrl, validateGalleryUrls } from '../../lib/imageUrlUtils';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!isNew);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newTechInput, setNewTechInput] = useState('');
  const [newGalleryInput, setNewGalleryInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    category: '',
    year: new Date().getFullYear().toString(),
    technologies: [],
    cover_image: '',
    images: [],
    live_url: '',
    github_url: '',
    challenge: '',
    solution: '',
    results: '',
    seo_title: '',
    seo_description: '',
    status: 'DRAFT',
    featured: false,
    display_order: 0
  });

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        setInitialLoading(true);
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              ...data,
              technologies: Array.isArray(data.technologies) ? data.technologies : [],
              images: Array.isArray(data.images) ? data.images : []
            });
          }
        } catch (err) {
          console.error('Error fetching project:', err);
          setErrorMessage('Could not load project details.');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProject();
    }
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'tech', label: 'Technologies', icon: Settings },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'case-study', label: 'Case Study', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'publishing', label: 'Publishing', icon: CheckCircle }
  ];

  // Gallery validation feedback
  const galleryAnalysis = validateGalleryUrls(formData.images || []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (!formData.title?.trim()) {
        setActiveTab('overview');
        throw new Error('Project Title is required.');
      }

      // Auto-generate or normalize slug
      let finalSlug = formData.slug?.trim();
      if (!finalSlug) {
        finalSlug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      } else {
        finalSlug = finalSlug
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      // Check slug uniqueness
      let slugCheckQuery = supabase.from('projects').select('id').eq('slug', finalSlug);
      if (!isNew && id) {
        slugCheckQuery = slugCheckQuery.neq('id', id);
      }
      const { data: existingSlugData } = await slugCheckQuery.maybeSingle();
      if (existingSlugData) {
        setActiveTab('overview');
        throw new Error(`The slug "${finalSlug}" is already in use by another project. Please provide a unique slug.`);
      }

      // Validate cover image if provided
      if (formData.cover_image?.trim()) {
        const coverVal = validateImageUrl(formData.cover_image.trim());
        if (!coverVal.isValid) {
          setActiveTab('media');
          throw new Error(`Cover Image URL is invalid: ${coverVal.error}`);
        }
      }

      // Clean gallery images array
      const cleanedImages = (formData.images || [])
        .map(url => (typeof url === 'string' ? url.trim() : ''))
        .filter(Boolean);

      const payload = {
        title: formData.title.trim(),
        slug: finalSlug,
        short_description: formData.short_description || null,
        full_description: formData.full_description || null,
        category: formData.category || null,
        year: formData.year || null,
        technologies: formData.technologies || [],
        cover_image: formData.cover_image?.trim() || null,
        images: cleanedImages,
        live_url: formData.live_url?.trim() || null,
        github_url: formData.github_url?.trim() || null,
        challenge: formData.challenge || null,
        solution: formData.solution || null,
        results: formData.results || null,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        status: formData.status || 'DRAFT',
        featured: Boolean(formData.featured),
        display_order: parseInt(formData.display_order, 10) || 0,
        updated_at: new Date().toISOString()
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('projects')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        setSuccessMessage('Project created successfully!');
        if (data?.id) {
          setTimeout(() => navigate(`/admin/work/${data.id}`), 1200);
        } else {
          setTimeout(() => navigate('/admin/work'), 1200);
        }
      } else {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', id);

        if (error) throw error;
        setFormData(prev => ({ ...prev, ...payload }));
        setSuccessMessage('Project and Case Study saved successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      }
    } catch (err) {
      console.error('Error saving project:', err);
      setErrorMessage(err.message || 'Failed to save project. Please check the fields.');
    } finally {
      setLoading(false);
    }
  };

  // Add a single technology
  const handleAddTech = (e) => {
    if (e) e.preventDefault();
    const tech = newTechInput.trim();
    if (!tech) return;
    if (!formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
    setNewTechInput('');
  };

  // Remove a technology
  const handleRemoveTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== techToRemove)
    }));
  };

  // Add gallery image from quick input
  const handleAddGalleryUrl = (e) => {
    if (e) e.preventDefault();
    const url = newGalleryInput.trim();
    if (!url) return;
    const validation = validateImageUrl(url);
    if (!validation.isValid) {
      alert(`Invalid URL: ${validation.error}`);
      return;
    }
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), url]
    }));
    setNewGalleryInput('');
  };

  // Remove single gallery image
  const handleRemoveGalleryUrl = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Open Public / Preview Case Study
  const handlePreviewCaseStudy = () => {
    const targetSlug = formData.slug || id;
    if (!targetSlug) {
      alert('Please enter a Title or Slug to preview.');
      return;
    }
    window.open(`/work/${targetSlug}?preview=true`, '_blank');
  };

  if (initialLoading) {
    return (
      <div className="admin-project-editor" style={{ width: '100%', padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
        <Loader2 size={32} className="spin" style={{ margin: '0 auto 1rem', color: 'var(--admin-accent)' }} />
        <p>Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="admin-project-editor" style={{ width: '100%', minWidth: 0 }}>
      {/* Header with Title and Action Buttons */}
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/admin/work')} 
            className="admin-btn-secondary" 
            style={{ padding: '0.5rem', minWidth: '40px', minHeight: '40px' }}
            aria-label="Back to projects"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="admin-page-title" style={{ margin: 0 }}>{isNew ? 'Create Project' : 'Edit Project'}</h1>
            {!isNew && (
              <span style={{
                fontSize: '0.75rem',
                color: formData.status === 'PUBLISHED' ? 'var(--admin-success)' : 'var(--admin-text-muted)',
                fontWeight: 600,
                marginTop: '0.2rem',
                display: 'inline-block'
              }}>
                ● {formData.status}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Public / Draft Preview Button */}
          {(formData.slug || id) && (
            <button
              type="button"
              onClick={handlePreviewCaseStudy}
              className="admin-btn-secondary"
              title="Preview case study in new tab"
              style={{ minHeight: '40px' }}
            >
              <Eye size={16} />
              <span>Preview Case Study</span>
            </button>
          )}

          {/* Save Button */}
          <button onClick={handleSave} className="admin-btn-primary" disabled={loading} style={{ minHeight: '40px' }}>
            {loading ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
            <span>{loading ? 'Saving...' : 'Save Project'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px', color: '#6ee7b7', fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
          {(formData.slug || id) && (
            <a
              href={`/work/${formData.slug || id}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fbbf24', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>View Live / Preview</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.875rem 1.25rem', marginBottom: '1.25rem',
          background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px', color: '#fca5a5', fontSize: '0.9rem'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="admin-editor-layout">
        {/* Sidebar Tabs (Scrollable on mobile) */}
        <div className="admin-card admin-editor-sidebar">
          <div className="admin-editor-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`admin-editor-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Panes */}
        <div className="admin-card admin-editor-content">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="proj-title">Project Title *</label>
                <input
                  id="proj-title"
                  type="text"
                  className="admin-input"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Bamboo Biriyani — Digital Ordering Platform"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="proj-slug">URL Slug</label>
                <input
                  id="proj-slug"
                  type="text"
                  className="admin-input"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. bamboo-biriyani (auto-generated from title if blank)"
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
                  Public URL will be: <code>/work/{formData.slug || 'your-slug'}</code>
                </span>
              </div>

              <div className="admin-editor-subgrid">
                <div className="admin-form-group">
                  <label htmlFor="proj-category">Category / Scope</label>
                  <input
                    id="proj-category"
                    type="text"
                    className="admin-input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Custom Furniture • 3D Interior Showcase"
                  />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="proj-year">Year</label>
                  <input
                    id="proj-year"
                    type="text"
                    className="admin-input"
                    value={formData.year}
                    onChange={e => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="proj-short-desc">Short Description (Summary Card Badge)</label>
                <textarea
                  id="proj-short-desc"
                  className="admin-input"
                  rows={3}
                  value={formData.short_description || ''}
                  onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Brief 1-2 sentence overview shown on the card and case study header..."
                />
              </div>
            </div>
          )}

          {/* TAB 2: TECHNOLOGIES */}
          {activeTab === 'tech' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Technologies &amp; Tools
                </label>
                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '0 0 1rem 0' }}>
                  Add technologies used in this project. They appear as tags on the project card and metadata bar.
                </p>

                {/* Tag Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', minHeight: '40px', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                  {formData.technologies && formData.technologies.length > 0 ? (
                    formData.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.35rem 0.65rem', borderRadius: '6px',
                          background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)',
                          color: '#fbbf24', fontSize: '0.85rem', fontWeight: 500
                        }}
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          aria-label={`Remove ${tech}`}
                          style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', padding: 0, display: 'flex' }}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', padding: '0.25rem' }}>No technologies added yet.</span>
                  )}
                </div>

                {/* Add Technology Input */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    className="admin-input"
                    value={newTechInput}
                    onChange={e => setNewTechInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="e.g. React, Supabase, Tailwind CSS, 3D Canvas..."
                    style={{ flex: 1, minWidth: '220px' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="admin-btn-secondary"
                    style={{ minHeight: '42px' }}
                  >
                    <Plus size={16} />
                    <span>Add Tag</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA (COVER IMAGE + GALLERY) */}
          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
              {/* URL-Only Workflow & Local Screenshot Limitation Notice */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                color: '#e2e8f0',
                lineHeight: 1.5
              }}>
                <strong style={{ color: '#93c5fd', display: 'block', marginBottom: '0.2rem' }}>
                  URL-Only Image Workflow:
                </strong>
                Paste public image URLs from any host (Unsplash, Cloudinary, ImgBB, custom CDN, signed URLs, or Supabase Storage). No uploads to GitHub or repository files required.
                <div style={{ marginTop: '0.35rem', color: '#cbd5e1' }}>
                  <strong>Important limitation:</strong> A URL-only workflow requires an accessible public URL. If an image exists only on your device (e.g. local screenshot), host it on an external service before pasting. Also note that webpage share links (Google Drive viewer, Dropbox share page, Imgur gallery) return HTML and cannot be decoded inside image tags.
                </div>
              </div>

              {/* SECTION: COVER IMAGE */}
              <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)' }}>
                <h3 style={{ fontSize: '1.05rem', color: 'white', margin: '0 0 0.5rem 0' }}>
                  Cover Image
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '0 0 1rem 0' }}>
                  Enter any valid HTTP or HTTPS image URL (Supabase Storage, Unsplash, Cloudinary, ImgBB, Imgur, or direct CDN).
                </p>

                <div className="admin-form-group">
                  <label htmlFor="cover-img-input">Cover Image URL (External or Supabase Storage URL)</label>
                  <input
                    id="cover-img-input"
                    type="url"
                    className="admin-input"
                    value={formData.cover_image || ''}
                    onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or https://your-server.com/image.jpg"
                  />
                </div>

                {/* Live Image Preview with error resilience */}
                {formData.cover_image && (
                  <ImagePreviewCard
                    url={formData.cover_image}
                    label="Cover Image Preview"
                    onRemove={() => setFormData({ ...formData, cover_image: '' })}
                    onApplyDirectUrl={(direct) => setFormData({ ...formData, cover_image: direct })}
                    aspectRatio="16/9"
                  />
                )}
              </div>

              {/* SECTION: GALLERY IMAGES */}
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'white', margin: '0 0 0.5rem 0' }}>
                  Gallery Images ({formData.images?.length || 0})
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '0 0 1rem 0' }}>
                  Add multiple project screenshots, mockups, or renders. Enter one image URL per line.
                </p>

                {/* Quick Add URL Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <input
                    type="url"
                    className="admin-input"
                    value={newGalleryInput}
                    onChange={e => setNewGalleryInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGalleryUrl();
                      }
                    }}
                    placeholder="Paste image URL and click Add..."
                    style={{ flex: 1, minWidth: '240px' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    className="admin-btn-secondary"
                    style={{ minHeight: '42px' }}
                  >
                    <Plus size={16} />
                    <span>Add to Gallery</span>
                  </button>
                </div>

                {/* Textarea for bulk editing */}
                <div className="admin-form-group" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="gallery-textarea">Gallery URLs (One per line)</label>
                  <textarea
                    id="gallery-textarea"
                    className="admin-input"
                    rows={4}
                    value={formData.images?.join('\n') || ''}
                    onChange={e => {
                      const lines = e.target.value.split('\n');
                      setFormData({ ...formData, images: lines });
                    }}
                    placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.jpg"
                  />
                </div>

                {/* Line validation feedback */}
                {galleryAnalysis.hasErrors && (
                  <div style={{
                    padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px',
                    color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem'
                  }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>⚠️ Invalid Gallery URLs detected:</div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                      {galleryAnalysis.lineResults.filter(r => !r.isValid).map((err, i) => (
                        <li key={i}>Line {err.line}: {err.error} (<code>{err.raw}</code>)</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gallery Previews Grid */}
                {formData.images && formData.images.filter(Boolean).length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Gallery Preview ({formData.images.filter(Boolean).length} items)
                    </span>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '1rem'
                    }}>
                      {formData.images.filter(Boolean).map((imgUrl, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <ImagePreviewCard
                            url={imgUrl}
                            label={`Gallery Image ${idx + 1}`}
                            aspectRatio="16/10"
                            onRemove={() => handleRemoveGalleryUrl(idx)}
                          />
                          <span style={{
                            position: 'absolute', bottom: '0.5rem', left: '0.5rem',
                            background: 'rgba(0,0,0,0.7)', color: 'white',
                            fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                            fontWeight: 600
                          }}>
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LINKS */}
          {activeTab === 'links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="proj-live-url">Live Website URL</label>
                <input
                  id="proj-live-url"
                  type="url"
                  className="admin-input"
                  value={formData.live_url || ''}
                  onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                  placeholder="https://www.example.com"
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
                  Visitors can click "Visit Live Website" to test the production system directly.
                </span>
              </div>

              <div className="admin-form-group">
                <label htmlFor="proj-github-url">GitHub Repository URL (Optional)</label>
                <input
                  id="proj-github-url"
                  type="url"
                  className="admin-input"
                  value={formData.github_url || ''}
                  onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/your-org/your-repo"
                />
              </div>
            </div>
          )}

          {/* TAB 5: CASE STUDY */}
          {activeTab === 'case-study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="cs-full-desc">Executive Overview / Full Description</label>
                <textarea
                  id="cs-full-desc"
                  className="admin-input"
                  rows={5}
                  value={formData.full_description || ''}
                  onChange={e => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Comprehensive narrative of the project, commercial context, and client objectives..."
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="cs-challenge">The Challenge</label>
                <textarea
                  id="cs-challenge"
                  className="admin-input"
                  rows={4}
                  value={formData.challenge || ''}
                  onChange={e => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="What operational or conversion problems was the client facing? What technical bottlenecks existed?"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="cs-solution">The Solution</label>
                <textarea
                  id="cs-solution"
                  className="admin-input"
                  rows={4}
                  value={formData.solution || ''}
                  onChange={e => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="How did Night Owls Studio engineer the solution? Highlight architecture, design patterns, and workflows."
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="cs-results">Key Results &amp; Impact</label>
                <textarea
                  id="cs-results"
                  className="admin-input"
                  rows={4}
                  value={formData.results || ''}
                  onChange={e => setFormData({ ...formData, results: e.target.value })}
                  placeholder="Quantifiable or qualitative results (e.g. sub-second load times, WhatsApp enquiries generated, client feedback)..."
                />
              </div>
            </div>
          )}

          {/* TAB 6: SEO */}
          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="seo-title">SEO Title</label>
                <input
                  id="seo-title"
                  type="text"
                  className="admin-input"
                  value={formData.seo_title || ''}
                  onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="e.g. Sai Indirabala Furniture — Case Study | Night Owls Studio"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="seo-desc">SEO Description</label>
                <textarea
                  id="seo-desc"
                  className="admin-input"
                  rows={3}
                  value={formData.seo_description || ''}
                  onChange={e => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Meta description for search engines and social link sharing (150-160 characters)..."
                />
              </div>

              {/* Google Search Snippet Preview */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--admin-border)',
                borderRadius: '8px',
                padding: '1.25rem'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Google Search Snippet Preview
                </span>
                <div style={{ color: '#8ab4f8', fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {formData.seo_title || formData.title || 'Project Title — Case Study'} | Night Owls Studio
                </div>
                <div style={{ color: '#22c55e', fontSize: '0.78rem', marginBottom: '0.35rem' }}>
                  https://nightowlsstudio.com/work/{formData.slug || 'project-slug'}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.4 }}>
                  {formData.seo_description || formData.short_description || 'Explore the technical architecture and digital case study designed by Night Owls Studio.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PUBLISHING */}
          {activeTab === 'publishing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="proj-status">Publication Status</label>
                <select
                  id="proj-status"
                  className="admin-input"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="DRAFT">Draft (Visible only to Admins in Preview)</option>
                  <option value="PUBLISHED">Published (Publicly live on Portfolio &amp; Case Study routes)</option>
                  <option value="ARCHIVED">Archived (Unpublished and hidden)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="proj-order">Display Order (Lowest numbers appear first)</label>
                <input
                  id="proj-order"
                  type="number"
                  className="admin-input"
                  value={formData.display_order}
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 0 })}
                  style={{ maxWidth: '160px' }}
                />
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: 'white' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--admin-accent)', cursor: 'pointer' }}
                  />
                  <span>Feature on Homepage and Portfolio Top (Flagship Showcase)</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
