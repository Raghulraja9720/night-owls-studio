import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, FileText, Settings, LayoutGrid, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', short_description: '', full_description: '', category: '', year: '',
    technologies: [],
    cover_image: '', images: [],
    live_url: '', github_url: '',
    challenge: '', solution: '', results: '',
    seo_title: '', seo_description: '',
    status: 'DRAFT', featured: false, display_order: 0
  });

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (data && !error) {
          setFormData(data);
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.slug) {
        payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      if (isNew) {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').update(payload).eq('id', id);
        if (error) throw error;
      }
      navigate('/admin/work');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-project-editor">
      <div className="admin-page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/admin/work')} className="admin-btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="admin-page-title">{isNew ? 'Create Project' : 'Edit Project'}</h1>
        </div>
        <button onClick={handleSave} className="admin-btn-primary" disabled={loading}>
          <Save size={18} />
          <span>{loading ? 'Saving...' : 'Save Project'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar Tabs */}
        <div className="admin-card" style={{ width: '240px', flexShrink: 0, alignSelf: 'flex-start', padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '8px', border: 'none',
                  background: activeTab === tab.id ? 'var(--admin-accent)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--admin-text-muted)',
                  cursor: 'pointer', textAlign: 'left', fontSize: '0.95rem', fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="admin-card" style={{ flex: 1, minHeight: '500px' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Project Title</label>
                <input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Bamboo Biriyani" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Category</label>
                  <input type="text" className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Web App" />
                </div>
                <div className="admin-form-group" style={{ flex: 1 }}>
                  <label>Year</label>
                  <input type="text" className="admin-input" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="e.g. 2024" />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Short Description</label>
                <textarea className="admin-input" rows={3} value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="Brief overview of the project..." />
              </div>
            </div>
          )}

          {activeTab === 'publishing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Status</label>
                <select className="admin-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: '18px', height: '18px', accentColor: 'var(--admin-accent)' }} />
                  Feature on Homepage / Portfolio Top
                </label>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Technologies (Comma separated)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.technologies?.join(', ') || ''} 
                  onChange={e => setFormData({
                    ...formData, 
                    technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })} 
                  placeholder="e.g. React, Node.js, Supabase" 
                />
                <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
                  These will appear as skill tags on the project card.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Cover Image URL (Supabase Storage URL)</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={formData.cover_image || ''} 
                  onChange={e => setFormData({...formData, cover_image: e.target.value})} 
                  placeholder="https://..." 
                />
                {formData.cover_image && (
                  <div style={{ marginTop: '1rem', width: '200px', height: '120px', borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                    <img src={formData.cover_image} alt="Cover Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
              <div className="admin-form-group">
                <label>Gallery Images (One URL per line)</label>
                <textarea 
                  className="admin-input" 
                  rows={4} 
                  value={formData.images?.join('\n') || ''} 
                  onChange={e => setFormData({
                    ...formData, 
                    images: e.target.value.split('\n').map(l => l.trim()).filter(Boolean)
                  })} 
                  placeholder="https://..." 
                />
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Live Website URL</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  value={formData.live_url || ''} 
                  onChange={e => setFormData({...formData, live_url: e.target.value})} 
                  placeholder="https://www.example.com" 
                />
              </div>
              <div className="admin-form-group">
                <label>GitHub Repository URL</label>
                <input 
                  type="url" 
                  className="admin-input" 
                  value={formData.github_url || ''} 
                  onChange={e => setFormData({...formData, github_url: e.target.value})} 
                  placeholder="https://github.com/..." 
                />
              </div>
            </div>
          )}

          {activeTab === 'case-study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Full Description</label>
                <textarea className="admin-input" rows={4} value={formData.full_description || ''} onChange={e => setFormData({...formData, full_description: e.target.value})} placeholder="Detailed explanation of the project..." />
              </div>
              <div className="admin-form-group">
                <label>The Challenge</label>
                <textarea className="admin-input" rows={3} value={formData.challenge || ''} onChange={e => setFormData({...formData, challenge: e.target.value})} placeholder="What was the client trying to solve?" />
              </div>
              <div className="admin-form-group">
                <label>The Solution</label>
                <textarea className="admin-input" rows={3} value={formData.solution || ''} onChange={e => setFormData({...formData, solution: e.target.value})} placeholder="How did you solve it?" />
              </div>
              <div className="admin-form-group">
                <label>The Results</label>
                <textarea className="admin-input" rows={3} value={formData.results || ''} onChange={e => setFormData({...formData, results: e.target.value})} placeholder="What impact did this have?" />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>SEO Title</label>
                <input type="text" className="admin-input" value={formData.seo_title || ''} onChange={e => setFormData({...formData, seo_title: e.target.value})} placeholder="Custom title for search engines" />
              </div>
              <div className="admin-form-group">
                <label>SEO Description</label>
                <textarea className="admin-input" rows={3} value={formData.seo_description || ''} onChange={e => setFormData({...formData, seo_description: e.target.value})} placeholder="Meta description..." />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Temporary icon component for SEO tab if not imported above
function Search(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
}
