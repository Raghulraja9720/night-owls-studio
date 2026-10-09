import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  ActivitySquare,
  LogOut,
  Menu,
  X,
  Mail,
  User,
  Bell,
  Video
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/work', label: 'Our Work', icon: Briefcase },
  { path: '/admin/meta-ads', label: 'Meta Ads', icon: Video },
  { path: '/admin/services', label: 'Services', icon: Settings },
  { path: '/admin/team', label: 'Team', icon: Users },
  { path: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  { path: '/admin/media', label: 'Media', icon: ImageIcon },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/activity', label: 'Activity', icon: ActivitySquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminLayout({ session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewInquiriesCount();
    
    // Optional: Set up an interval to refresh count occasionally, 
    // or just rely on page navigation. Doing a simple fetch on mount.
  }, []);

  const fetchNewInquiriesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'NEW');
      
      if (!error && count !== null) {
        setNewInquiriesCount(count);
      }
    } catch (err) {
      console.error('Error fetching unread inquiries count:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-wrap">
            <div className="admin-logo-circle">
              <picture>
                <source type="image/webp" srcSet="/assets/logo/night-owls-logo-40.webp 1x, /assets/logo/night-owls-logo-80.webp 2x" />
                <img src="/assets/logo/night owls logo.png" alt="Night Owls Studio Logo" className="admin-logo-img" width="36" height="36" />
              </picture>
            </div>
            <h2 className="admin-brand">NIGHT OWLS<span>.</span></h2>
          </div>
          <button className="admin-close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              <User size={20} />
            </div>
            <div className="admin-user-details">
              <span className="admin-user-email">{session?.user?.email}</span>
              <span className="admin-user-role">ADMIN</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="admin-topbar-mobile-brand">
              <div className="admin-logo-circle admin-logo-circle-sm">
                <img src="/assets/logo/night-owls-logo-40.webp" alt="Night Owls Logo" className="admin-logo-img" width="28" height="28" />
              </div>
              <span className="admin-topbar-brand-text">NIGHT OWLS<span>.</span></span>
            </div>
          </div>
          
          <div className="admin-topbar-right">
            <button className="admin-notification-btn" onClick={() => navigate('/admin/inquiries')}>
              <Bell size={20} />
              {newInquiriesCount > 0 && (
                <span className="admin-notification-badge">{newInquiriesCount}</span>
              )}
            </button>
          </div>
        </header>

        <main className="admin-main-content">
          <Outlet context={{ session }} />
        </main>
      </div>
    </div>
  );
}
