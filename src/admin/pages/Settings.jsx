import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Loader2, Globe, Phone, Mail, Instagram, Facebook, Linkedin, Code } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const [settings, setSettings] = useState({
    studio_name: '',
    contact_email: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    seo_title: '',
    seo_description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [dbError, setDbError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setDbError('');
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) {
        if (error.code === '42P01') { // relation does not exist
          setDbError('The site_settings table does not exist yet. Please run the add_settings_table.sql migration in Supabase.');
        } else {
          throw error;
        }
      } else if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });
        
      if (error) throw error;
      
      setSuccess('Settings saved successfully. Changes are now live on the public website.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-work-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          Loading settings...
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="admin-work-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Site Settings</h1>
        </div>
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--admin-warning)', marginBottom: '1rem' }}>
            <Code size={48} />
          </div>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Database Setup Required</h2>
          <p style={{ color: 'var(--admin-text-muted)' }}>{dbError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-work-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Site Settings</h1>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: 'calc(8rem + env(safe-area-inset-bottom, 0px))' }}>
        
        {/* General Settings */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} /> General Information
          </h2>
          
          <div className="admin-editor-subgrid">
            <div className="admin-form-group">
              <label>Studio Name</label>
              <input 
                type="text" 
                name="studio_name"
                className="admin-input" 
                value={settings.studio_name || ''}
                onChange={handleChange}
                placeholder="Night Owls Studio" 
              />
            </div>
            
            <div className="admin-form-group">
              <label>Contact Email</label>
              <input 
                type="email" 
                name="contact_email"
                className="admin-input" 
                value={settings.contact_email || ''}
                onChange={handleChange}
                placeholder="contact@nightowls.com" 
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={18} /> Phone & WhatsApp
          </h2>
          
          <div className="admin-editor-subgrid">
            <div className="admin-form-group">
              <label>Display Phone Number (e.g. +91 85318 07705)</label>
              <input 
                type="text" 
                name="phone"
                className="admin-input" 
                value={settings.phone || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="admin-form-group">
              <label>WhatsApp Number (Numeric only, for API link)</label>
              <input 
                type="text" 
                name="whatsapp"
                className="admin-input" 
                value={settings.whatsapp || ''}
                onChange={handleChange}
                placeholder="918531807705"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Instagram size={18} /> Social Media Links
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Instagram size={14} /> Instagram URL
              </label>
              <input 
                type="url" 
                name="instagram"
                className="admin-input" 
                value={settings.instagram || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Facebook size={14} /> Facebook URL
              </label>
              <input 
                type="url" 
                name="facebook"
                className="admin-input" 
                value={settings.facebook || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="admin-form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Linkedin size={14} /> LinkedIn URL
              </label>
              <input 
                type="url" 
                name="linkedin"
                className="admin-input" 
                value={settings.linkedin || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="admin-card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe size={18} /> Search Engine Optimization
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-form-group">
              <label>Global SEO Title</label>
              <input 
                type="text" 
                name="seo_title"
                className="admin-input" 
                value={settings.seo_title || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="admin-form-group">
              <label>Global SEO Description</label>
              <textarea 
                name="seo_description"
                className="admin-input" 
                rows="3"
                value={settings.seo_description || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Floating Save Action */}
        <div className="admin-floating-save-bar">
          <div>
            {success && (
              <div style={{ color: 'var(--admin-success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} /> {success}
              </div>
            )}
          </div>
          <button type="submit" className="admin-btn-primary" disabled={saving}>
            {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
