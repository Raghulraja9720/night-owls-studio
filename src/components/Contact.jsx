import React, { useState, useEffect } from 'react';
import { MessageCircle, Phone, Mail, Send, CheckCircle2, Instagram } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Fallback values in case DB fetch fails or is not set up
const FALLBACK_WHATSAPP = '918531807705';
const FALLBACK_PHONE = '+91 85318 07705';
const FALLBACK_EMAIL = 'contact.nightowls.team@gmail.com';
const FALLBACK_INSTA = 'https://www.instagram.com/night_owls_studios/';

export default function Contact({ preselectedService }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    serviceRequired: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    // Fetch global site settings
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (data) setSiteSettings(data);
      } catch (err) {
        console.warn('Error fetching site settings:', err);
      }
    };
    fetchSettings();
    
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, serviceRequired: preselectedService }));
      setTimeout(() => {
        const selectEl = document.getElementById('serviceRequired');
        if (selectEl) {
          selectEl.focus({ preventScroll: true });
        }
      }, 350);
    }
  }, [preselectedService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const waText =
      `*🚀 New Client Query Received on Night Owls Studio*\n\n` +
      `👤 *Client Name:* ${formData.fullName}\n` +
      `📞 *Phone / WhatsApp:* ${formData.phone}\n` +
      `✉️ *Email Address:* ${formData.email}\n` +
      `🏢 *Business / Website:* ${formData.businessName || 'N/A'}\n` +
      `🛠️ *Service Required:* ${formData.serviceRequired || 'General Inquiry'}\n` +
      `📝 *Project Overview:* ${formData.message || 'None'}\n` +
      `📅 *Submitted:* ${new Date().toLocaleString()}`;

    // 1. Save to persistent localStorage
    const stored = JSON.parse(localStorage.getItem('nightowls_enquiries') || '[]');
    stored.unshift({
      ...formData,
      date: new Date().toISOString()
    });
    localStorage.setItem('nightowls_enquiries', JSON.stringify(stored));

    // 2. Save directly to Supabase CMS
    try {
      await supabase.from('inquiries').insert([
        {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.businessName || '',
          service: formData.serviceRequired || 'General Inquiry',
          message: formData.message || '',
          status: 'NEW'
        }
      ]);
    } catch (err) {
      console.warn('Supabase save error:', err);
    }

    // 3. Open WhatsApp with pre-filled message
    const whatsappNum = siteSettings?.whatsapp || FALLBACK_WHATSAPP;
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(waText)}`;
    window.open(whatsappUrl, '_blank');

    // 6. Reset form and display success without redirect
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        businessName: '',
        serviceRequired: '',
        message: ''
      });
      setSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    }, 450);
  };

  return (
    <section id="contact" className="section light-theme bg-white">
      <div className="container">
        <div className="contact-layout-grid">
          {/* Contact Details Left */}
          <div className="contact-info-col">
            <div className="section-badge">Get in Touch</div>
            <h2 className="section-title">
              Ready to Elevate Your Digital Flagship? <br />
              <span className="highlight-text">Let's Talk Today.</span>
            </h2>
            <p className="section-description">
              Send us an inquiry below or reach out directly on WhatsApp. We analyze your requirements and provide a clear, honest architectural roadmap within 24 hours.
            </p>

            <div className="contact-quick-cards">
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/${siteSettings?.whatsapp || FALLBACK_WHATSAPP}?text=Hi%20Night%20Owls%20Studio%20Team!%20I'm%20interested%20in%20engineering%20my%20digital%20presence%20with%20your%20services.`}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-card whatsapp-card"
              >
                <div className="quick-icon-box whatsapp-icon">
                  <MessageCircle size={22} />
                </div>
                <div className="quick-details">
                  <span className="quick-label">Fastest Response</span>
                  <span className="quick-value">Chat Directly on WhatsApp</span>
                  <span className="quick-sub">Click to start conversation &rarr;</span>
                </div>
              </a>

              {/* Direct Phone Card */}
              <a href={`tel:${siteSettings?.whatsapp || FALLBACK_WHATSAPP}`} className="quick-contact-card">
                <div className="quick-icon-box">
                  <Phone size={22} />
                </div>
                <div className="quick-details">
                  <span className="quick-label">Direct Phone Line</span>
                  <span className="quick-value">{siteSettings?.phone || FALLBACK_PHONE}</span>
                  <span className="quick-sub">Click to call immediately &rarr;</span>
                </div>
              </a>

              {/* Email Card */}
              <a href={`mailto:${siteSettings?.contact_email || FALLBACK_EMAIL}`} className="quick-contact-card">
                <div className="quick-icon-box">
                  <Mail size={22} />
                </div>
                <div className="quick-details">
                  <span className="quick-label">Email Us</span>
                  <span className="quick-value">{siteSettings?.contact_email || FALLBACK_EMAIL}</span>
                  <span className="quick-sub">Direct response within 24 hours</span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={siteSettings?.instagram || FALLBACK_INSTA}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-card instagram-card"
              >
                <div className="quick-icon-box instagram-icon">
                  <Instagram size={22} />
                </div>
                <div className="quick-details">
                  <span className="quick-label">Instagram</span>
                  <span className="quick-value">{siteSettings?.instagram ? '@' + siteSettings.instagram.split('/').filter(Boolean).pop() : '@night_owls_studios'}</span>
                  <span className="quick-sub">Follow &amp; DM us on Instagram &rarr;</span>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form Right */}
          <div className="contact-form-col">
            <div className="contact-form-wrapper">
              <h3 className="form-title">Send Us An Enquiry</h3>
              <p className="form-subtitle">Tell us about your project and we'll reply with a clear, fixed quote.</p>

              <form id="enquiryForm" className="enquiry-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullName">Your Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone / WhatsApp <span className="required">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="businessName">Business Name / Website</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="e.g. Meridian Advisory / mybrand.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serviceRequired">Service Required <span className="required">*</span></label>
                  <select
                    id="serviceRequired"
                    name="serviceRequired"
                    value={formData.serviceRequired}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a Service</option>
                    <option value="Website Development">Website Development (Modern &amp; High-Performance)</option>
                    <option value="UI/UX Design">UI/UX Design (Website &amp; App Interfaces)</option>
                    <option value="Web Application Development">Web Application Development (Custom Systems)</option>
                    <option value="Mobile-Friendly Development">Mobile-Friendly Development (All Screen Sizes)</option>
                    <option value="Landing Pages">Landing Pages (Conversion-Focused)</option>
                    <option value="Meta Ads Management">Meta Ads Management (FB &amp; Instagram Ads)</option>
                    <option value="SEO Optimization">SEO Optimization (Technical &amp; On-Page)</option>
                    <option value="Website Optimization">Website Optimization (Speed &amp; UX)</option>
                    <option value="Website Maintenance">Website Maintenance (Updates &amp; Support)</option>
                    <option value="Other Consultation">Other Consultation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Project Overview</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your objectives, timeline, or current website..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-full submit-btn" id="submitBtn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="submit-spinner"></span>
                      <span>Submitting Query...</span>
                    </>
                  ) : submitted ? (
                    <>
                      <CheckCircle2 size={18} />
                      <span>Query Submitted Successfully!</span>
                    </>
                  ) : (
                    <>
                      <span>Send Enquiry</span>
                      <Send size={16} />
                    </>
                  )}
                </button>

                {submitted && (
                  <div id="formSuccessMessage" className="form-alert success-alert">
                    <CheckCircle2 size={18} />
                    <div>
                      <strong>Query submitted successfully!</strong>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
