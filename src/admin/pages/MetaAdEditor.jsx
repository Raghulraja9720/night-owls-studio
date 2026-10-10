import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Upload, X, Play } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getEmbedUrl, detectPlatform, isDirectVideo } from '../../lib/videoUtils';

export default function MetaAdEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    business_name: '',
    platform: 'Instagram',
    video_path: '', // Maps to video_url conceptually
    poster_path: '',
    status: 'DRAFT',
    display_order: 0
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  
  const posterInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      fetchAd();
    }
  }, [id]);

  const fetchAd = async () => {
    try {
      const { data, error } = await supabase
        .from('meta_ads_videos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data);
        if (data.poster_path && !data.poster_path.startsWith('http')) {
          const { data: posterData } = supabase.storage.from('media').getPublicUrl(data.poster_path);
          setPosterPreview(posterData.publicUrl);
        } else if (data.poster_path) {
           setPosterPreview(data.poster_path);
        }
      }
    } catch (err) {
      console.error('Error fetching ad:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      if (name === 'video_path') {
        const detected = detectPlatform(value);
        if (detected !== 'Unknown' && detected !== 'Invalid URL') {
          updates.platform = detected;
        }
      }
      return { ...prev, ...updates };
    });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'poster') {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const uploadFile = async (file, folder) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `meta-ads/${folder}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;
    return filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (!formData.video_path) {
        throw new Error('A video URL is required.');
      }
      
      // Basic URL validation
      try {
        const url = new URL(formData.video_path);
        if (url.protocol === 'javascript:') {
           throw new Error('Invalid URL scheme.');
        }
      } catch (err) {
        throw new Error('Please enter a valid URL (starting with http:// or https://)');
      }

      let finalPosterPath = formData.poster_path;

      if (posterFile) {
        finalPosterPath = await uploadFile(posterFile, 'posters');
        // Delete old poster if replacing and it was a stored file (not external URL)
        if (isEditing && formData.poster_path && !formData.poster_path.startsWith('http')) {
          await supabase.storage.from('media').remove([formData.poster_path]);
        }
      }

      const payload = {
        ...formData,
        poster_path: finalPosterPath
      };

      if (isEditing) {
        const { error } = await supabase
          .from('meta_ads_videos')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('meta_ads_videos')
          .insert([payload]);
        if (error) throw error;
      }

      navigate('/admin/meta-ads');
    } catch (err) {
      console.error('Error saving ad:', err);
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading-screen">Loading...</div>;

  const embedUrl = getEmbedUrl(formData.video_path, formData.platform);
  const isDirect = isDirectVideo(formData.video_path);

  return (
    <div className="admin-meta-ad-editor" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <Link 
            to="/admin/meta-ads" 
            className="admin-btn-secondary" 
            style={{ padding: '0.5rem', minWidth: '40px', minHeight: '40px' }}
            aria-label="Back to Meta Ads"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="admin-page-title">{isEditing ? 'Edit Meta Ad' : 'Add New Meta Ad'}</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={saving}
          className="admin-btn-primary"
        >
          {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
          <span>{saving ? 'Saving...' : 'Save Ad'}</span>
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', wordBreak: 'break-word' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-meta-ad-form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, width: '100%' }}>
          <div className="admin-card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', fontWeight: 600 }}>Ad Details</h2>
            
            <div className="admin-form-group">
              <label className="admin-label">Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                value={formData.title} 
                onChange={handleInputChange} 
                className="admin-input" 
                placeholder="e.g. Real Estate Spring Campaign"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Video URL *</label>
              <input 
                type="url" 
                name="video_path" 
                required 
                value={formData.video_path} 
                onChange={handleInputChange} 
                className="admin-input" 
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem' }}>
                Paste a YouTube, Vimeo, Facebook, Instagram, TikTok, or direct MP4 URL.
              </p>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Description (Optional)</label>
              <textarea 
                name="description" 
                value={formData.description || ''} 
                onChange={handleInputChange} 
                className="admin-input" 
                rows={4}
                placeholder="Brief description of the campaign or results"
              />
            </div>

            <div className="admin-editor-subgrid">
              <div className="admin-form-group">
                <label className="admin-label">Business / Client Name (Optional)</label>
                <input 
                  type="text" 
                  name="business_name" 
                  value={formData.business_name || ''} 
                  onChange={handleInputChange} 
                  className="admin-input"
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Platform (Optional)</label>
                <select 
                  name="platform" 
                  value={formData.platform || ''} 
                  onChange={handleInputChange} 
                  className="admin-input"
                >
                  <option value="">Select Platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Vimeo">Vimeo</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Direct URL">Direct Video URL</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Video Preview</h2>
            <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', background: '#000', overflow: 'hidden', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {formData.video_path && embedUrl ? (
                embedUrl ? (
                  <iframe 
                    src={embedUrl} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    title="Video Preview"
                  ></iframe>
                ) : isDirect ? (
                  <video src={formData.video_path} controls style={{ width: '100%', maxHeight: '100%' }} />
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>External Embed</p>
                    <a href={formData.video_path} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-gold)' }}>Test Link in New Tab</a>
                  </div>
                )
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>
                  <Play size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem' }}>Enter a valid URL to preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Publishing</h2>
            
            <div className="admin-form-group">
              <label className="admin-label">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange} 
                className="admin-input"
              >
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Display Order</label>
              <input 
                type="number" 
                name="display_order" 
                value={formData.display_order} 
                onChange={handleInputChange} 
                className="admin-input" 
              />
            </div>
          </div>

          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600 }}>Poster Image (Optional)</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '1rem' }}>Upload or link a poster image for direct videos.</p>
            
            <div className="admin-form-group" style={{ marginBottom: '1rem' }}>
              <input 
                type="url" 
                name="poster_path" 
                value={formData.poster_path && formData.poster_path.startsWith('http') ? formData.poster_path : ''} 
                onChange={handleInputChange} 
                className="admin-input" 
                placeholder="Or paste an image URL..."
              />
            </div>

            <div style={{ border: '2px dashed var(--admin-border)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
              {posterPreview ? (
                <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden' }}>
                  <img src={posterPreview} alt="Poster preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button"
                    onClick={() => { setPosterPreview(''); setPosterFile(null); setFormData(p => ({...p, poster_path: ''})); }}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div onClick={() => posterInputRef.current?.click()} style={{ cursor: 'pointer', padding: '1rem', color: 'var(--admin-text-muted)' }}>
                  <Upload size={20} style={{ margin: '0 auto 0.5rem auto' }} />
                  <p style={{ fontSize: '0.85rem' }}>Upload Local Poster</p>
                </div>
              )}
              <input 
                type="file" 
                ref={posterInputRef} 
                onChange={(e) => handleFileChange(e, 'poster')} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
