import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, LayoutGrid, CheckCircle, Type, List, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ServiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', slug: '', short_description: '', full_description: '',
    icon: 'Globe', cta_text: '', features: [], status: 'DRAFT', display_order: 0
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (id) {
      const fetchService = async () => {
        const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
        if (data && !error) {
          setFormData(data);
        }
      };
      fetchService();
    }
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'content', label: 'Content', icon: Type },
    { id: 'features', label: 'Features', icon: List },
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
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').update(payload).eq('id', id);
        if (error) throw error;
      }
      navigate('/admin/services');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (index) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="admin-service-editor" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <button 
            onClick={() => navigate('/admin/services')} 
            className="admin-btn-secondary" 
            style={{ padding: '0.5rem', minWidth: '40px', minHeight: '40px' }}
            aria-label="Back to services"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="admin-page-title">{isNew ? 'Create Service' : 'Edit Service'}</h1>
        </div>
        <button onClick={handleSave} className="admin-btn-primary" disabled={loading}>
          <Save size={18} />
          <span>{loading ? 'Saving...' : 'Save Service'}</span>
        </button>
      </div>

      <div className="admin-editor-layout">
        <div className="admin-card admin-editor-sidebar">
          <div className="admin-editor-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-editor-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card admin-editor-content">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <div className="admin-form-group">
                <label>Service Title</label>
                <input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Website Development" />
              </div>
              <div className="admin-form-group">
                <label>Slug</label>
                <input type="text" className="admin-input" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="e.g. website-development" />
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem', display: 'block' }}>Leave blank to auto-generate from title.</span>
              </div>
              <div className="admin-editor-subgrid">
                <div className="admin-form-group">
                  <label>Icon Identifier</label>
                  <input type="text" className="admin-input" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="e.g. Globe" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem', display: 'block' }}>Lucide icon name.</span>
                </div>
                <div className="admin-form-group">
                  <label>Button Text (CTA)</label>
                  <input type="text" className="admin-input" value={formData.cta_text || ''} onChange={e => setFormData({...formData, cta_text: e.target.value})} placeholder="e.g. Learn More" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.35rem', display: 'block' }}>Text for the action button.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Short Description (Subtitle)</label>
                <textarea className="admin-input" rows={2} value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="Modern, Responsive & High-Performance" />
              </div>
              <div className="admin-form-group">
                <label>Full Description</label>
                <textarea className="admin-input" rows={6} value={formData.full_description} onChange={e => setFormData({...formData, full_description: e.target.value})} placeholder="Bespoke digital flagships built with clean React architectures..." />
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Service Features (Tags)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={featureInput} 
                    onChange={e => setFeatureInput(e.target.value)} 
                    placeholder="e.g. Sub-Second Speed"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  />
                  <button onClick={addFeature} className="admin-btn-secondary">Add</button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(formData.features || []).map((feature, i) => (
                    <div key={i} style={{ 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', 
                      padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                      <span>{feature}</span>
                      <button onClick={() => removeFeature(i)} style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>&times;</button>
                    </div>
                  ))}
                </div>
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
                <label>Display Order</label>
                <input type="number" className="admin-input" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
