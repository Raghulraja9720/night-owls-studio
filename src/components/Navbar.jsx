import React, { useState, useEffect } from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';

export default function Navbar({ currentPage = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (currentPage === 'work') {
      setActiveSection('work');
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'services', 'why-us', 'process', 'team', 'guarantee', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const closeDrawer = () => setDrawerOpen(false);

  const handleNavClick = (e, page, section = '') => {
    e.preventDefault();
    closeDrawer();
    if (onNavigate) {
      onNavigate(page, section);
    }
  };

  return (
    <>
      <header id="navbar" className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a
            href="/"
            className="brand-logo"
            aria-label="Night Owls Studio Home"
            onClick={(e) => handleNavClick(e, 'home', 'hero')}
          >
            <div className="logo-image-wrap">
              <img src="/assets/logo/night owls logo.png" alt="Night Owls Studio Logo" className="nav-logo-img" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Night Owls</span>
              <span className="brand-tag">Studio</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="nav-menu" id="nav-menu" aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                <a
                  href="/#about"
                  className={`nav-link ${currentPage === 'home' && activeSection === 'about' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'home', 'about')}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className={`nav-link ${currentPage === 'home' && activeSection === 'services' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'home', 'services')}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/#why-us"
                  className={`nav-link ${currentPage === 'home' && activeSection === 'why-us' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'home', 'why-us')}
                >
                  Why Us
                </a>
              </li>
              <li>
                <a
                  href="/#process"
                  className={`nav-link ${currentPage === 'home' && activeSection === 'process' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'home', 'process')}
                >
                  Process
                </a>
              </li>
              <li>
                <a
                  href="/work"
                  className={`nav-link ${currentPage === 'work' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'work')}
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="/#team"
                  className={`nav-link ${currentPage === 'home' && activeSection === 'team' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'home', 'team')}
                >
                  Team
                </a>
              </li>
              <li>
                <a
                  href="/#guarantee"
                  className={`nav-link ${currentPage === 'home' && activeSection === 'guarantee' ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, 'home', 'guarantee')}
                >
                  Trust
                </a>
              </li>
            </ul>
          </nav>

          {/* Dedicated Call to Action Button directly near Menu Bar */}
          <div className="nav-cta-wrap">
            <a href="tel:8531807705" className="btn btn-primary nav-cta-btn" aria-label="Call 8531807705">
              <Phone className="icon-sm" />
              <span>Call Now</span>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-toggle"
              id="mobile-toggle"
              aria-label="Toggle Menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`} id="mobile-drawer">
        <div className="drawer-header">
          <div
            className="brand-logo"
            role="button"
            tabIndex={0}
            onClick={(e) => handleNavClick(e, 'home', 'hero')}
          >
            <div className="logo-image-wrap">
              <img src="/assets/logo/night owls logo.png" alt="Night Owls Studio Logo" className="nav-logo-img" />
            </div>
            <div className="brand-text">
              <span className="brand-title">Night Owls</span>
              <span className="brand-tag">Studio</span>
            </div>
          </div>
          <button className="drawer-close" id="drawer-close" aria-label="Close Menu" onClick={closeDrawer}>
            <X size={22} />
          </button>
        </div>

        <ul className="drawer-links">
          <li><a href="/" className={`drawer-link ${currentPage === 'home' && activeSection === 'hero' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'home', 'hero')}>Home</a></li>
          <li><a href="/#about" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'about')}>About</a></li>
          <li><a href="/#services" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'services')}>Services</a></li>
          <li><a href="/#why-us" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'why-us')}>Why Choose Us</a></li>
          <li><a href="/#process" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'process')}>Our Process</a></li>
          <li><a href="/work" className={`drawer-link ${currentPage === 'work' ? 'active' : ''}`} onClick={(e) => handleNavClick(e, 'work')}>Explore Works</a></li>
          <li><a href="/#team" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'team')}>Our Team</a></li>
          <li><a href="/#guarantee" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'guarantee')}>Why Trust Us</a></li>
          <li><a href="/#contact" className="drawer-link" onClick={(e) => handleNavClick(e, 'home', 'contact')}>Contact</a></li>
        </ul>

        <div className="drawer-footer">
          <a href="tel:8531807705" className="btn btn-primary w-full drawer-cta" onClick={closeDrawer}>
            <Phone size={18} />
            <span>Call Now: 8531807705</span>
          </a>
          <a
            href="https://wa.me/918531807705?text=Hello%20Night%20Owls%20Studio,%20I%20want%20to%20engineer%20my%20digital%20presence."
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp w-full"
            onClick={closeDrawer}
          >
            <MessageCircle size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {drawerOpen && <div className="drawer-backdrop open" onClick={closeDrawer}></div>}
    </>
  );
}
