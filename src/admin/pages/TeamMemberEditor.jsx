import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, LayoutGrid, CheckCircle, Type, List, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TeamMemberEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', role: '', department: '', bio: '', image_url: '',
    icon: 'Crown', skills: [], linkedin_url: '', status: 'DRAFT', display_order: 0
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
        if (data && !error) {
          setFormData(data);
        }
      };
      fetchMember();
    }
  }, [id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'bio', label: 'Biography', icon: Type },
    { id: 'skills', label: 'Skills & Links', icon: List },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'publishing', label: 'Publishing', icon: CheckCircle }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...formData };

      if (isNew) {
        const { error } = await supabase.from('team_members').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').update(payload).eq('id', id);
        if (error) throw error;
      }
      navigate('/admin/team');
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('Failed to save team member. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setFormData({ ...formData, skills: [...(formData.skills || []), skillInput.trim()] });
    setSkillInput('');
  };

  const removeSkill = (index) => {
    const newSkills = [...(formData.skills || [])];
    newSkills.splice(index, 1);
    setFormData({ ...formData, skills: newSkills });
  };

  return (
    <div className="admin-team-editor" style={{ width: '100%', minWidth: 0 }}>
      <div className="admin-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <button 
            onClick={() => navigate('/admin/team')} 
            className="admin-btn-secondary" 
            style={{ padding: '0.5rem', minWidth: '40px', minHeight: '40px' }}
            aria-label="Back to team members"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="admin-page-title">{isNew ? 'Add Team Member' : 'Edit Team Member'}</h1>
        </div>
        <button onClick={handleSave} className="admin-btn-primary" disabled={loading}>
          <Save size={18} />
          <span>{loading ? 'Saving...' : 'Save Member'}</span>
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
                <label>Full Name</label>
                <input type="text" className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="admin-form-group">
                <label>Role</label>
                <input type="text" className="admin-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. Lead Designer" />
              </div>
              <div className="admin-form-group">
                <label>Department</label>
                <input type="text" className="admin-input" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Web & App Development" />
              </div>
              <div className="admin-form-group">
                <label>Badge Icon</label>
                <input type="text" className="admin-input" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} placeholder="e.g. Crown" />
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem', display: 'block' }}>Lucide icon name.</span>
              </div>
            </div>
          )}

          {activeTab === 'bio' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Biography</label>
                <textarea className="admin-input" rows={6} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Enter a short bio for this team member..." />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>LinkedIn URL</label>
                <input type="url" className="admin-input" value={formData.linkedin_url || ''} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
              </div>
              
              <div className="admin-form-group">
                <label>Skills</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input 
                    type="text" 
                    className="admin-input" 
                    value={skillInput} 
                    onChange={e => setSkillInput(e.target.value)} 
                    placeholder="e.g. React.js"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  />
                  <button onClick={addSkill} className="admin-btn-secondary">Add</button>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(formData.skills || []).map((skill, i) => (
                    <div key={i} style={{ 
                      background: 'rgba(255,255,255,0.05)', border: '1px solid var(--admin-border)', 
                      padding: '0.5rem 0.75rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(i)} style={{ background: 'none', border: 'none', color: 'var(--admin-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Image URL</label>
                <input type="text" className="admin-input" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="/assets/images/team-member.jpg" />
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem', display: 'block' }}>Relative path or absolute URL to image.</span>
              </div>
              {formData.image_url && (
                <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--admin-border)', background: '#050a16' }}>
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    onError={(e) => {
                      e.currentTarget.src = '/assets/images/placeholder.jpg';
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
              )}
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
