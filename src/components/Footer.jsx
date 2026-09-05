import React from 'react';
import { MessageCircle, Mail, Instagram, Linkedin, Phone, Clock } from 'lucide-react';

export default function Footer({ onOpenPolicy, onSelectService, onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleFooterNav = (e, page, section = '') => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(page, section);
    }
  };

  return (
    <footer className="footer dark-theme">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <a
              href="/"
              className="brand-logo footer-logo"
              onClick={(e) => handleFooterNav(e, 'home', 'hero')}
            >
              <div className="logo-image-wrap footer-logo-wrap">
                <img src="/assets/logo/night owls logo.png" alt="Night Owls Studio Logo" className="nav-logo-img" />
              </div>
              <div className="brand-text">
                <span className="brand-title text-white">Night Owls</span>
                <span className="brand-tag">Studio</span>
              </div>
            </a>
            <p className="footer-bio">
              The always-on digital engineering collective. Bespoke websites, high-conversion landing pages, and scalable web architectures.
            </p>
            <div className="footer-social-links">
              <a
                href="https://wa.me/918531807705?text=Hello%20Night%20Owls%20Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a href="mailto:contact.nightowls.team@gmail.com" className="social-icon" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><a href="/" onClick={(e) => handleFooterNav(e, 'home', 'hero')}>Home</a></li>
              <li><a href="/#about" onClick={(e) => handleFooterNav(e, 'home', 'about')}>About</a></li>
              <li><a href="/#services" onClick={(e) => handleFooterNav(e, 'home', 'services')}>Services</a></li>
              <li><a href="/#why-us" onClick={(e) => handleFooterNav(e, 'home', 'why-us')}>Why Choose Us</a></li>
              <li><a href="/work" onClick={(e) => handleFooterNav(e, 'work')}>Explore Works</a></li>
              <li><a href="/#process" onClick={(e) => handleFooterNav(e, 'home', 'process')}>Our Process</a></li>
              <li><a href="/#team" onClick={(e) => handleFooterNav(e, 'home', 'team')}>Our Team</a></li>
              <li><a href="/#guarantee" onClick={(e) => handleFooterNav(e, 'home', 'guarantee')}>Why Trust Us</a></li>
              <li><a href="/#contact" onClick={(e) => handleFooterNav(e, 'home', 'contact')}>Contact</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Website Development'); }}>Website Development</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('UI/UX Design'); }}>UI/UX Design</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Web Application Development'); }}>Web Application</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Mobile-Friendly Development'); }}>Mobile Optimization</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Landing Pages'); }}>Landing Pages</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Meta Ads Management'); }}>Meta Ads</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('SEO Optimization'); }}>SEO Optimization</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Website Optimization'); }}>Site Optimization</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); onSelectService && onSelectService('Website Maintenance'); }}>Maintenance</a></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="footer-heading">Direct Connect</h4>
            <ul className="footer-contact-list">
              <li><Phone size={16} /> <a href="tel:8531807705" style={{ color: 'inherit' }}>+91 85318 07705</a></li>
              <li><MessageCircle size={16} /> <a href="https://wa.me/918531807705" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>WhatsApp Support</a></li>
              <li><Mail size={16} /> <a href="mailto:contact.nightowls.team@gmail.com" style={{ color: 'inherit' }}>contact.nightowls.team@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; <span id="currentYear">{currentYear}</span> <strong>Night Owls Studio</strong>. All rights reserved.
          </p>
          <div className="footer-legal">
            <button className="legal-btn" onClick={() => onOpenPolicy('privacy')}>Privacy Policy</button>
            <span className="legal-dot">&bull;</span>
            <button className="legal-btn" onClick={() => onOpenPolicy('terms')}>Terms &amp; Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
