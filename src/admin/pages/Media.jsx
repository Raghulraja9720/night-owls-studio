import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Link2, Copy, Check, ExternalLink, AlertTriangle, AlertCircle, Info,
  Search, Image as ImageIcon, RefreshCw, Trash2, Plus, Database,
  Sparkles, Upload, Loader2, ArrowUpRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { validateImageUrl, detectWebpageShareLink, DEFAULT_PROJECT_PLACEHOLDER } from '../../lib/imageUrlUtils';
import ImagePreviewCard from '../components/ImagePreviewCard';

// Default curated public image examples for reference
const DEFAULT_SAVED_URLS = [
  {
    id: 'sample-1',
    title: 'Modern Architecture / Geometric Concrete',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    category: 'Architecture',
    addedAt: '2026-01-01'
  },
  {
    id: 'sample-2',
    title: 'Minimalist Dark Interface Mockup',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    category: 'UI/UX',
    addedAt: '2026-01-01'
  },
  {
    id: 'sample-3',
    title: 'Studio Lighting & Creative Direction',
    url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80',
    category: 'Creative',
    addedAt: '2026-01-01'
  }
];

export default function Media() {
  const [activeTab, setActiveTab] = useState('url-manager'); // 'url-manager' | 'db-inspector' | 'storage'
  
  // URL Inspector / Quick Tester State
  const [testUrl, setTestUrl] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [urlCategory, setUrlCategory] = useState('General');
  const [copiedKey, setCopiedKey] = useState(null);

  // Managed external URLs (persisted in localStorage)
  const [managedUrls, setManagedUrls] = useState(() => {
    try {
      const stored = localStorage.getItem('nightowls_managed_image_urls');
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_URLS;
    } catch {
      return DEFAULT_SAVED_URLS;
    }
  });

  // Database Images Inspector State
  const [dbImages, setDbImages] = useState([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbSearch, setDbSearch] = useState('');

  // Storage Bucket State (for backward compatibility)
  const [storageFiles, setStorageFiles] = useState([]);
  const [storageLoading, setStorageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [storageSearch, setStorageSearch] = useState('');
  const fileInputRef = useRef(null);
  const BUCKET_NAME = 'media';

  // Save managed URLs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nightowls_managed_image_urls', JSON.stringify(managedUrls));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [managedUrls]);

  // Load database images when inspector tab is selected
  useEffect(() => {
    if (activeTab === 'db-inspector') {
      fetchDatabaseImages();
    } else if (activeTab === 'storage') {
      fetchStorageFiles();
    }
  }, [activeTab]);

  const copyToClipboard = (url, key) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddManagedUrl = (e) => {
    e.preventDefault();
    if (!testUrl.trim()) return;

    const validation = validateImageUrl(testUrl.trim());
    if (!validation.isValid) {
      alert(`Invalid URL: ${validation.error}`);
      return;
    }

    const newEntry = {
      id: `url-${Date.now()}`,
      title: urlTitle.trim() || 'Untitled Image Asset',
      url: testUrl.trim(),
      category: urlCategory || 'General',
      addedAt: new Date().toISOString().split('T')[0]
    };

    setManagedUrls([newEntry, ...managedUrls]);
    setUrlTitle('');
    alert('URL saved to your Quick-Reference library!');
  };

  const handleRemoveManagedUrl = (id) => {
    if (window.confirm('Remove this URL from your saved quick-reference list?')) {
      setManagedUrls(managedUrls.filter(item => item.id !== id));
    }
  };

  // Fetch images stored in Supabase database (projects cover_image, images[], team members)
  const fetchDatabaseImages = async () => {
    setDbLoading(true);
    try {
      const items = [];

      // Fetch projects
      const { data: projects, error: pErr } = await supabase
        .from('projects')
        .select('id, title, slug, cover_image, images');

      if (!pErr && projects) {
        projects.forEach(p => {
          if (p.cover_image) {
            items.push({
              id: `proj-cover-${p.id}`,
              url: p.cover_image,
              source: `Project: ${p.title} (Cover)`,
              projectId: p.id,
              projectSlug: p.slug,
              type: 'Project Cover'
            });
          }
          if (Array.isArray(p.images)) {
            p.images.forEach((gUrl, idx) => {
              if (gUrl) {
                items.push({
                  id: `proj-gallery-${p.id}-${idx}`,
                  url: gUrl,
                  source: `Project: ${p.title} (Gallery #${idx + 1})`,
                  projectId: p.id,
                  projectSlug: p.slug,
                  type: 'Gallery Image'
                });
              }
            });
          }
        });
      }

      // Fetch team members
      const { data: team, error: tErr } = await supabase
        .from('team_members')
        .select('id, name, role, image_url');

      if (!tErr && team) {
        team.forEach(t => {
          if (t.image_url) {
            items.push({
              id: `team-${t.id}`,
              url: t.image_url,
              source: `Team: ${t.name} (${t.role || 'Member'})`,
              type: 'Team Avatar'
            });
          }
        });
      }

      setDbImages(items);
    } catch (err) {
      console.error('Failed to load database images:', err);
    } finally {
      setDbLoading(false);
    }
  };

  // Fetch Supabase storage files (backwards compatibility)
  const fetchStorageFiles = async () => {
    setStorageLoading(true);
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error) {
        console.warn('Storage list notice:', error.message);
        setStorageFiles([]);
        return;
      }

      const validFiles = data?.filter(file => file.name !== '.emptyFolderPlaceholder') || [];
      const filesWithUrls = validFiles.map(file => {
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);
        return { ...file, publicUrl };
      });

      setStorageFiles(filesWithUrls);
    } catch (err) {
      console.error('Storage fetch exception:', err);
    } finally {
      setStorageLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const baseName = file.name.replace(`.${fileExt}`, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const cleanName = `${baseName}-${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage.from(BUCKET_NAME).upload(cleanName, file, {
          cacheControl: '3600',
          upsert: false
        });

        if (error) throw error;
      }
      await fetchStorageFiles();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message?.includes('Bucket not found')
        ? 'Bucket "media" not found in Supabase. You can use the URL-only manager without any storage bucket.'
        : 'Failed to upload image.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteStorageFile = async (file) => {
    if (!window.confirm(`Delete ${file.name} from Supabase Storage?`)) return;
    try {
      const { error } = await supabase.storage.from(BUCKET_NAME).remove([file.name]);
      if (error) throw error;
      setStorageFiles(storageFiles.filter(f => f.id !== file.id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete file.');
    }
  };

  // Live test evaluation
  const activeValidation = testUrl ? validateImageUrl(testUrl) : null;
  const activeShareCheck = testUrl ? detectWebpageShareLink(testUrl) : null;

  // Filtered lists
  const filteredDbImages = dbImages.filter(item =>
    item.source.toLowerCase().includes(dbSearch.toLowerCase()) ||
    item.url.toLowerCase().includes(dbSearch.toLowerCase())
  );

  const filteredStorageFiles = storageFiles.filter(f =>
    f.name.toLowerCase().includes(storageSearch.toLowerCase())
  );

  return (
    <div className="admin-media-page" style={{ width: '100%', minWidth: 0 }}>
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Link2 size={26} style={{ color: 'var(--admin-accent)' }} />
            <span>Media &amp; Image URL Manager</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', margin: '0.25rem 0 0 0' }}>
            Manage and preview public image URLs from any host. No GitHub or Supabase Storage uploads required.
          </p>
        </div>
      </div>

      {/* CRITICAL LIMITATION NOTICE CALLOUT */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'flex-start'
      }}>
        <Info size={22} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#e2e8f0' }}>
          <strong style={{ color: '#93c5fd', display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
            Important Note on Local Files &amp; Screenshots:
          </strong>
          A URL-only workflow requires an accessible public URL. If an image exists only on your local computer or phone (such as a local screenshot), website visitors cannot view it until it has been hosted on a public image host (e.g., Unsplash, Cloudinary, ImgBB, PostImages, or your own CDN). Once hosted, simply paste its public URL here.
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--admin-border)',
        marginBottom: '1.75rem',
        overflowX: 'auto'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('url-manager')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'url-manager' ? '2px solid var(--admin-accent)' : '2px solid transparent',
            color: activeTab === 'url-manager' ? 'white' : 'var(--admin-text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Sparkles size={16} />
          <span>URL-Only Image Manager &amp; Tester</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('db-inspector')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'db-inspector' ? '2px solid var(--admin-accent)' : '2px solid transparent',
            color: activeTab === 'db-inspector' ? 'white' : 'var(--admin-text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Database size={16} />
          <span>Active Database Images</span>
          {dbImages.length > 0 && (
            <span style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '0.1rem 0.45rem',
              borderRadius: '10px',
              fontSize: '0.75rem'
            }}>
              {dbImages.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('storage')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'storage' ? '2px solid var(--admin-accent)' : '2px solid transparent',
            color: activeTab === 'storage' ? 'white' : 'var(--admin-text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <Upload size={16} />
          <span>Supabase Storage (Optional)</span>
        </button>
      </div>

      {/* TAB 1: URL-ONLY MANAGER & VALIDATOR */}
      {activeTab === 'url-manager' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Card: URL Validator & Quick Preview */}
          <div className="admin-card" style={{ padding: '1.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'white', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link2 size={18} style={{ color: 'var(--admin-accent)' }} />
              <span>Inspect &amp; Test Any Public Image URL</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '0 0 1.25rem 0' }}>
              Paste an image URL from any provider (Unsplash, Cloudinary, ImgBB, Imgur, AWS S3, or any CDN). Supports extensionless URLs, query parameters, and signed tokens.
            </p>

            <form onSubmit={handleAddManagedUrl} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label htmlFor="media-test-url" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Public Image URL <span style={{ color: 'var(--admin-accent)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    id="media-test-url"
                    type="url"
                    className="admin-input"
                    value={testUrl}
                    onChange={e => setTestUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-... or https://res.cloudinary.com/... or https://your-cdn.com/image"
                    style={{ flex: 1, minWidth: '260px' }}
                    required
                  />
                  {testUrl && (
                    <button
                      type="button"
                      onClick={() => setTestUrl('')}
                      className="admin-btn-secondary"
                      style={{ padding: '0 0.75rem' }}
                    >
                      Clear
                    </button>
                  )}
                  {testUrl && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(testUrl, 'test-url')}
                      className="admin-btn-secondary"
                      style={{ padding: '0 0.75rem' }}
                      title="Copy URL"
                    >
                      {copiedKey === 'test-url' ? <Check size={16} style={{ color: '#10b981' }} /> : <Copy size={16} />}
                      <span>{copiedKey === 'test-url' ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Validation & Share Link Diagnostics */}
              {testUrl && (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>URL Syntax:</span>
                    {activeValidation?.isValid ? (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600
                      }}>
                        <CheckCircle2 size={12} /> Valid RFC Syntax
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
                        background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 600
                      }}>
                        <AlertCircle size={12} /> {activeValidation?.error}
                      </span>
                    )}

                    {/* HTTPS vs Image Reminder Badge */}
                    <span style={{
                      fontSize: '0.72rem', color: '#94a3b8',
                      background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', borderRadius: '4px'
                    }}>
                      Host: {(() => {
                        try { return new URL(testUrl).hostname; } catch { return 'unknown'; }
                      })()}
                    </span>
                  </div>

                  {/* Share page warning if detected */}
                  {activeShareCheck?.isSharePage && (
                    <div style={{
                      background: 'rgba(234, 88, 12, 0.12)',
                      border: '1px solid rgba(234, 88, 12, 0.35)',
                      borderRadius: '6px',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.8rem',
                      color: '#fb923c'
                    }}>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                        <AlertTriangle size={14} />
                        <span>Share Page Link Detected ({activeShareCheck.service})</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#fed7aa', lineHeight: 1.4 }}>
                        {activeShareCheck.advice} Web browsers require direct image byte streams, not HTML pages.
                      </div>
                      {activeShareCheck.directUrlSuggestion && (
                        <button
                          type="button"
                          onClick={() => setTestUrl(activeShareCheck.directUrlSuggestion)}
                          className="admin-btn-secondary"
                          style={{ marginTop: '0.4rem', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        >
                          Convert to Direct Image Link
                        </button>
                      )}
                    </div>
                  )}

                  {/* Live Render Preview */}
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.35rem' }}>
                      Live Browser Render Test:
                    </span>
                    <ImagePreviewCard
                      url={testUrl}
                      label="Test Image"
                      aspectRatio="16/9"
                      onApplyDirectUrl={(direct) => setTestUrl(direct)}
                    />
                  </div>
                </div>
              )}

              {/* Optional: Save to Quick Reference List */}
              {testUrl && activeValidation?.isValid && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.75rem',
                  paddingTop: '0.5rem'
                }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Label / Description (Optional)
                    </label>
                    <input
                      type="text"
                      className="admin-input"
                      value={urlTitle}
                      onChange={e => setUrlTitle(e.target.value)}
                      placeholder="e.g. Hero Banner 3D"
                      style={{ fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                      Category Tag
                    </label>
                    <select
                      className="admin-input"
                      value={urlCategory}
                      onChange={e => setUrlCategory(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="General">General</option>
                      <option value="Cover Image">Cover Image</option>
                      <option value="Gallery">Gallery</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Branding">Branding</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      type="submit"
                      className="admin-btn-primary"
                      style={{ width: '100%', minHeight: '40px' }}
                    >
                      <Plus size={16} />
                      <span>Save to Quick Reference</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Quick-Reference Image Bank */}
          <div className="admin-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', color: 'white', margin: 0 }}>
                  Quick-Reference Image Library ({managedUrls.length})
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', margin: '0.2rem 0 0 0' }}>
                  Bookmark verified public URLs here to quickly copy and paste them into your Projects, Case Studies, and Team profiles.
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.25rem'
            }}>
              {managedUrls.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '160px', width: '100%', background: '#0a101f', position: 'relative' }}>
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROJECT_PLACEHOLDER;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', top: '0.5rem', right: '0.5rem',
                      display: 'flex', gap: '0.4rem'
                    }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.url, item.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', minHeight: '28px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        title="Copy image URL"
                      >
                        {copiedKey === item.id ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                        <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveManagedUrl(item.id)}
                        aria-label={`Remove ${item.title}`}
                        style={{
                          background: 'rgba(239, 68, 68, 0.75)', border: 'none', color: 'white',
                          padding: '0.35rem', borderRadius: '4px', cursor: 'pointer', backdropFilter: 'blur(4px)'
                        }}
                        title="Remove from saved list"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '0.5rem', left: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)',
                      color: '#fbbf24', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 500
                    }}>
                      {item.category}
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {item.url.slice(0, 60)}...
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--admin-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <span>Open directly</span>
                        <ArrowUpRight size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setTestUrl(item.url);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Inspect in Tester
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Best Practices Panel */}
          <div className="admin-card" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.015)' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'white', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={18} style={{ color: '#fbbf24' }} />
              <span>URL-Only Image Management Guidelines</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <strong style={{ color: 'white', display: 'block', marginBottom: '0.35rem' }}>
                  1. Direct Image Streams vs Webpages
                </strong>
                HTML `&lt;img&gt;` tags require raw image data (JPEG, PNG, WebP, SVG, AVIF). Webpage share links (e.g. Google Drive `/view`, Dropbox previews, Pinterest pins, Imgur albums) return full HTML websites and will fail to render as images. Always copy the direct image link (e.g., right-click image &rarr; "Copy Image Address").
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <strong style={{ color: 'white', display: 'block', marginBottom: '0.35rem' }}>
                  2. Never Assume HTTPS Guarantees an Image
                </strong>
                Just because a link begins with `https://` does not mean it points to a valid image file. It could return a 404 page, an error JSON, or require login cookies. The live preview verifies that the image decodes properly in the browser.
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <strong style={{ color: 'white', display: 'block', marginBottom: '0.35rem' }}>
                  3. Query Parameters &amp; Signed URLs
                </strong>
                URLs with query strings (e.g., `?w=1600&auto=format` on Unsplash) or signed access tokens are fully supported. The database stores the complete, original URL string without altering or truncating it.
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
                <strong style={{ color: 'white', display: 'block', marginBottom: '0.35rem' }}>
                  4. Zero Local Storage Overhead
                </strong>
                Images hosted on reliable external hosts or CDNs do not consume GitHub repository space, disk storage, or database blob quotas. The database stores only the URL text pointer.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE DATABASE IMAGES INSPECTOR */}
      {activeTab === 'db-inspector' && (
        <div className="admin-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>
                Active Site Images from Supabase Database
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '0.25rem 0 0 0' }}>
                All image URLs currently stored in your Supabase `projects` and `team_members` tables.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div className="admin-search-box" style={{ position: 'relative', width: '220px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Filter images..."
                  value={dbSearch}
                  onChange={e => setDbSearch(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
              </div>
              <button
                type="button"
                onClick={fetchDatabaseImages}
                className="admin-btn-secondary"
                disabled={dbLoading}
                style={{ minHeight: '38px' }}
                title="Refresh database records"
              >
                <RefreshCw size={15} className={dbLoading ? 'spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {dbLoading ? (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <Loader2 size={28} className="spin" style={{ margin: '0 auto 0.75rem auto', color: 'var(--admin-accent)' }} />
              <div>Scanning Supabase database records...</div>
            </div>
          ) : filteredDbImages.length === 0 ? (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <Database size={40} style={{ opacity: 0.25, margin: '0 auto 0.75rem auto' }} />
              <p style={{ color: 'white', fontWeight: 500, marginBottom: '0.25rem' }}>No database images matched</p>
              <p style={{ fontSize: '0.85rem' }}>Add cover images or gallery images in the Projects CMS editor.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.25rem'
            }}>
              {filteredDbImages.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '170px', width: '100%', background: '#0a101f', position: 'relative' }}>
                    <img
                      src={item.url}
                      alt={item.source}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROJECT_PLACEHOLDER;
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', top: '0.5rem', right: '0.5rem',
                      display: 'flex', gap: '0.4rem'
                    }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.url, item.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', minHeight: '28px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        title="Copy image URL"
                      >
                        {copiedKey === item.id ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                        <span>{copiedKey === item.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: '0.5rem', left: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
                      color: '#fbbf24', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600
                    }}>
                      {item.type}
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>
                      {item.source}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {item.url}
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {item.projectId ? (
                        <Link
                          to={`/admin/work/${item.projectId}`}
                          style={{ fontSize: '0.78rem', color: 'var(--admin-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <span>Edit Project</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Team Profile</span>
                      )}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'none' }}
                      >
                        Test Link
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUPABASE STORAGE BUCKET (OPTIONAL / PRESERVED) */}
      {activeTab === 'storage' && (
        <div className="admin-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'white', margin: 0 }}>
                Supabase Storage Files (Optional)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', margin: '0.25rem 0 0 0' }}>
                Files in your Supabase 'media' bucket. You do not need to use this bucket if you prefer external image URLs.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="admin-search-box" style={{ position: 'relative', width: '200px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Search bucket files..."
                  value={storageSearch}
                  onChange={e => setStorageSearch(e.target.value)}
                  style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
                />
              </div>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleUploadClick}
                disabled={uploading}
                style={{ flexShrink: 0 }}
              >
                {uploading ? <Loader2 size={16} className="spin" /> : <Upload size={16} />}
                <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                multiple
                accept="image/*"
              />
            </div>
          </div>

          {storageLoading ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              Loading storage files...
            </div>
          ) : storageFiles.length === 0 ? (
            <div style={{ padding: '3.5rem 1rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
              <ImageIcon size={44} style={{ opacity: 0.25, margin: '0 auto 0.75rem auto' }} />
              <p style={{ color: 'white', fontWeight: 500, marginBottom: '0.25rem' }}>No bucket files found</p>
              <p style={{ fontSize: '0.85rem' }}>
                Storage bucket is empty or not configured. You can use the URL-only manager without any storage bucket.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
              gap: '1.25rem'
            }}>
              {filteredStorageFiles.map(file => (
                <div
                  key={file.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '160px', width: '100%', background: '#0a101f', position: 'relative' }}>
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_PROJECT_PLACEHOLDER;
                      }}
                    />
                    <div style={{
                      position: 'absolute', top: '0.5rem', right: '0.5rem',
                      display: 'flex', gap: '0.4rem'
                    }}>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(file.publicUrl, file.id)}
                        className="admin-btn-secondary"
                        style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem', minHeight: '28px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        title="Copy public URL"
                      >
                        {copiedKey === file.id ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStorageFile(file)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.8)', border: 'none', color: 'white',
                          padding: '0.35rem', borderRadius: '4px', cursor: 'pointer', backdropFilter: 'blur(4px)'
                        }}
                        title="Delete file"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', fontSize: '0.82rem' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500, color: 'white', marginBottom: '0.2rem' }} title={file.name}>
                      {file.name}
                    </div>
                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem' }}>
                      {new Date(file.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
