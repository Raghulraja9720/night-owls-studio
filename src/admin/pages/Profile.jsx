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
      <div className="admin-work-page">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-work-page">
      <div className="admin-page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="admin-page-title">Admin Profile</h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* Left Column: Account Details */}
        <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Account Details
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ background: 'var(--admin-accent)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>Primary Email</div>
                  <div style={{ color: 'white', fontWeight: 500 }}>{user?.email}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Shield size={14} /> Role
                  </div>
                  <div style={{ color: 'white', fontWeight: 500 }}>Super Admin</div>
                </div>
                
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Created
                  </div>
                  <div style={{ color: 'white', fontWeight: 500 }}>
                    {new Date(user?.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} /> Last Login
                </div>
                <div style={{ color: 'white', fontWeight: 500 }}>
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Personal Information
            </h2>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  className="admin-input" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. John Doe" 
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {profileSuccess ? (
                  <div style={{ color: 'var(--admin-success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> {profileSuccess}
                  </div>
                ) : <div />}
                
                <button type="submit" className="admin-btn-secondary" disabled={savingProfile}>
                  <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          <div className="admin-card">
            <h2 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={18} /> Update Password
            </h2>
            
            <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  className="admin-input" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)" 
                />
              </div>
              
              <div className="admin-form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  className="admin-input" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" 
                />
              </div>
              
              {passwordError && (
                <div style={{ color: 'var(--admin-danger)', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '4px' }}>
                  {passwordError}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {passwordSuccess ? (
                  <div style={{ color: 'var(--admin-success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} /> {passwordSuccess}
                  </div>
                ) : <div />}
                
                <button type="submit" className="admin-btn-primary" disabled={savingPassword || !newPassword}>
                  <Shield size={16} /> {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
