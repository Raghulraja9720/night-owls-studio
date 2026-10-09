import React from 'react';
import { Home, Layers, Briefcase, Users, Mail } from 'lucide-react';

export default function MobileBottomNav({ currentPage, onNavigate }) {
  const handleNavClick = (e, page, section = '') => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page, section);
    }
  };

  return (
    <div className="mobile-bottom-nav">
      <a 
        href="/" 
        className={`mobile-nav-item ${currentPage === 'home' && (!window.location.hash || window.location.hash === '#hero') ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, 'home', 'hero')}
      >
        <div className="mobile-nav-inner">
          <Home size={20} />
          <span>Home</span>
        </div>
      </a>
      
      <a 
        href="/services" 
        className={`mobile-nav-item ${currentPage === 'services' || (currentPage === 'home' && window.location.hash === '#services') ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, 'services')}
      >
        <div className="mobile-nav-inner">
          <Layers size={20} />
          <span>Services</span>
        </div>
      </a>
      
      <a 
        href="/work" 
        className={`mobile-nav-item ${currentPage === 'work' ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, 'work')}
      >
        <div className="mobile-nav-inner">
          <Briefcase size={20} />
          <span>Work</span>
        </div>
      </a>
      
      <a 
        href="/team" 
        className={`mobile-nav-item ${currentPage === 'team' || (currentPage === 'home' && window.location.hash === '#team') ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, 'team')}
      >
        <div className="mobile-nav-inner">
          <Users size={20} />
          <span>Team</span>
        </div>
      </a>
      
      <a 
        href="/contact" 
        className={`mobile-nav-item ${currentPage === 'contact' || (currentPage === 'home' && window.location.hash === '#contact') ? 'active' : ''}`}
        onClick={(e) => handleNavClick(e, 'contact')}
      >
        <div className="mobile-nav-inner">
          <Mail size={20} />
          <span>Contact</span>
        </div>
      </a>
    </div>
  );
}
