import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Layers, Mail, User } from 'lucide-react';

const bottomNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/work', label: 'Work', icon: Briefcase },
  { path: '/admin/services', label: 'Services', icon: Layers },
  { path: '/admin/inquiries', label: 'Inquiries', icon: Mail, hasBadge: true },
  { path: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminBottomNav({ newInquiriesCount = 0 }) {
  return (
    <nav className="admin-bottom-nav" aria-label="Admin mobile navigation">
      {bottomNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.exact}
          className={({ isActive }) => `admin-bottom-nav-item ${isActive ? 'active' : ''}`}
          aria-label={item.label}
        >
          <div className="admin-bottom-nav-inner">
            <div className="admin-bottom-nav-icon-wrap">
              <item.icon size={20} strokeWidth={2} />
              {item.hasBadge && newInquiriesCount > 0 && (
                <span className="admin-bottom-nav-badge" aria-label={`${newInquiriesCount} new inquiries`}>
                  {newInquiriesCount > 99 ? '99+' : newInquiriesCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
}
