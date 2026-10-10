import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Clock, Shield, Key, Save, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile Form
  const [fullName, setFullName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password Form
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || '');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => setProfileSuccess(''), 5000);
      fetchUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setPasswordSuccess('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-profile-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Admin Profile</h1>
        </div>
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Admin Profile</h1>
      </div>

      <div className="admin-profile-grid">
        
        {/* Left Column: Account Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, width: '100%' }}>
          
          <div className="admin-card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <User size={18} color="var(--admin-accent)" /> Account Details
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', minWidth: 0 }}>
              
              {/* Primary Email: Full-width card */}
              <div className="admin-profile-card-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  background: 'var(--admin-accent)', 
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  fontSize: '1.2rem', 
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Mail size={13} /> Primary Email
                  </div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                    {user?.email}
                  </div>
                </div>
              </div>
              
              {/* Role & Created: Two equal-width cards, stack on narrow screens */}
              <div className="admin-profile-meta-row">
                <div className="admin-profile-card-item">
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Shield size={14} color="var(--admin-accent)" /> Role
                  </div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>
                    Super Admin
                  </div>
                </div>
                
                <div className="admin-profile-card-item">
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} color="var(--admin-accent)" /> Created
                  </div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-word' }}>
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Last Login: Full-width card */}
              <div className="admin-profile-card-item">
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} color="var(--admin-accent)" /> Last Login
                </div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Active now'}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, width: '100%' }}>
          
          {/* Personal Information */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <User size={18} color="var(--admin-accent)" /> Personal Information
            </h2>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="fullName">Display Name</label>
                <input 
                  id="fullName"
                  type="text" 
                  className="admin-input" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. John Doe" 
                />
              </div>
              
              <div className="admin-form-actions">
                {profileSuccess ? (
                  <div style={{ color: 'var(--admin-success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> {profileSuccess}
                  </div>
                ) : <div />}
                
                <button type="submit" className="admin-btn-secondary" disabled={savingProfile}>
                  <Save size={16} />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Update Password */}
          <div className="admin-card">
            <h2 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <Key size={18} color="var(--admin-accent)" /> Update Password
            </h2>
            
            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <div className="admin-form-group">
                <label htmlFor="newPassword">New Password</label>
                <input 
                  id="newPassword"
                  type="password" 
                  className="admin-input" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)" 
                  autoComplete="new-password"
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  className="admin-input" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" 
                  autoComplete="new-password"
                />
              </div>
              
              {passwordError && (
                <div style={{ color: 'var(--admin-danger)', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)', wordBreak: 'break-word' }}>
                  {passwordError}
                </div>
              )}

              <div className="admin-form-actions">
                {passwordSuccess ? (
                  <div style={{ color: 'var(--admin-success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> {passwordSuccess}
                  </div>
                ) : <div />}
                
                <button type="submit" className="admin-btn-primary" disabled={savingPassword || !newPassword}>
                  <Shield size={16} />
                  <span>{savingPassword ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
