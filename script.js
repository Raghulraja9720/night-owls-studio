/**
 * NightOwls Digital Agency — Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // Initialize Hero Starfield Animation
  initStarfield();

  // Initialize Navigation Scroll & Spy
  initNavigation();

  // Initialize Mobile Drawer Menu
  initMobileDrawer();

  // Initialize Portfolio Filter
  initPortfolioFilters();
});

/* ================= 1. STARFIELD CANVAS ANIMATION ================= */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = 65;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.015 + 0.005,
        color: Math.random() > 0.3 ? '#ffffff' : '#fbbf24' // Mix of moonlight white and amber glow
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.alpha += star.speed;
      if (star.alpha > 0.95 || star.alpha < 0.2) {
        star.speed = -star.speed;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  render();
}

/* ================= 2. NAVBAR SCROLL & ACTIVE SPY ================= */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar glass elevation
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy active link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ================= 3. MOBILE DRAWER ================= */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const closeBtn = document.getElementById('drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-cta');

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ================= 4. PORTFOLIO FILTERS ================= */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab, .filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ================= 5. SERVICE PRESELECTION ================= */
function preselectService(serviceName) {
  const select = document.getElementById('serviceRequired');
  if (select) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === serviceName || select.options[i].text.includes(serviceName)) {
        select.selectedIndex = i;
        break;
      }
    }
  }
}

/* ================= 6. PROJECT MODAL DATA & HANDLERS ================= */
const projectsData = {
  meridian: {
    title: 'Meridian & Co. — Global Advisory Flagship',
    category: 'Full-Stack Architecture &bull; Executive Portal',
    image: 'assets/images/meridian.jpg',
    description: 'A sophisticated corporate presence engineered for an institutional advisory firm. Designed to communicate authority and convert institutional stakeholders through sub-second route transitions, interactive capability calculators, and an encrypted inbound client portal.',
    deliverables: ['Custom React Architecture', 'Executive Inbound Portal', 'Core Web Vitals Tuning', 'Structured Schema SEO'],
    results: '0.64s page load speed, +184% inbound institutional inquiries, 99.9% uptime SLA.'
  },
  velour: {
    title: 'Velour Haute Parfumerie — Sensory Launch',
    category: 'High-Converting Landing Page &bull; Headless Cart',
    image: 'assets/images/velour.jpg',
    description: 'An editorial fragrance showcase featuring interactive visual soundscapes, fluid motion journeys, and a frictionless headless one-tap checkout flow engineered to eliminate cart abandonment on mobile viewports.',
    deliverables: ['Sensory Storytelling Journey', 'Ultra-Lean Script Payloads', '1-Tap Headless Cart', 'A/B Test Infrastructure'],
    results: '6.8% cart conversion rate (3.2x industry average), 100% launch day inventory sellout.'
  },
  studioeleven: {
    title: 'Studio Eleven — Bespoke Interior & Architecture',
    category: 'Design Systems &bull; Architectural Portfolio',
    image: 'assets/images/studioeleven.jpg',
    description: 'A minimalist architectural website highlighting custom woodcraft, modular kitchens, and residential projects. Geared towards high-ticket clientele with high-resolution responsive galleries and pre-qualification consultation workflows.',
    deliverables: ['Curated Case Study Layouts', 'Dynamic Material Specs', 'Consultation Qualifier Form', 'Design Token System'],
    results: 'Elevated brand prestige, steady pre-qualified design consultations, zero-friction booking.'
  },
  finova: {
    title: 'Finova Capital — Next-Gen FinTech Interface',
    category: 'Web Application &bull; High-Frequency Portal',
    image: 'assets/images/finova.jpg',
    description: 'An ultra-fast digital banking and institutional investment portal built with edge-rendered dashboard modules, bank-grade data security protocols, and sub-100ms API response orchestration.',
    deliverables: ['Edge Component Architecture', 'Interactive Financial Tools', 'WCAG AA Accessibility', 'Instant Direction & Contact Flow'],
    results: '99+ Lighthouse performance score, sub-100ms latency, high organic discovery.'
  },
  // Backward-compatibility aliases
  textile: {
    title: 'Meridian & Co. — Global Advisory Flagship',
    category: 'Full-Stack Architecture &bull; Executive Portal',
    image: 'assets/images/meridian.jpg',
    description: 'A sophisticated corporate presence engineered for an institutional advisory firm. Designed to communicate authority and convert institutional stakeholders through sub-second route transitions.',
    deliverables: ['Custom React Architecture', 'Executive Inbound Portal', 'Core Web Vitals Tuning'],
    results: '0.64s page load speed, +184% inbound inquiries.'
  },
  restaurant: {
    title: 'Velour Haute Parfumerie — Sensory Launch',
    category: 'High-Converting Landing Page &bull; Headless Cart',
    image: 'assets/images/velour.jpg',
    description: 'An editorial fragrance showcase featuring interactive visual soundscapes and a frictionless headless one-tap checkout flow.',
    deliverables: ['Sensory Storytelling Journey', 'Ultra-Lean Script Payloads', '1-Tap Headless Cart'],
    results: '6.8% cart conversion rate, 100% launch day sellout.'
  },
  furniture: {
    title: 'Studio Eleven — Bespoke Interior & Architecture',
    category: 'Design Systems &bull; Architectural Portfolio',
    image: 'assets/images/studioeleven.jpg',
    description: 'A minimalist architectural website highlighting custom woodcraft and pre-qualification consultation workflows.',
    deliverables: ['Curated Case Study Layouts', 'Consultation Qualifier Form'],
    results: 'Elevated brand prestige, steady pre-qualified inquiries.'
  },
  electronics: {
    title: 'Finova Capital — Next-Gen FinTech Interface',
    category: 'Web Application &bull; High-Frequency Portal',
    image: 'assets/images/finova.jpg',
    description: 'An ultra-fast digital banking and institutional investment portal built with edge-rendered dashboard modules.',
    deliverables: ['Edge Component Architecture', 'Interactive Financial Tools'],
    results: '99+ Lighthouse performance score, sub-100ms latency.'
  }
};

function openProjectModal(projectId) {
  const data = projectsData[projectId];
  if (!data) return;

  const content = document.getElementById('projectModalContent');
  content.innerHTML = `
    <img src="${data.image}" alt="${data.title}" class="modal-project-img" />
    <span class="modal-project-subtitle">${data.category}</span>
    <h3 class="modal-project-title">${data.title}</h3>
    <p class="modal-project-desc">${data.description}</p>
    
    <div class="modal-details-grid">
      <div class="modal-detail-item">
        <span class="modal-detail-label">Deliverables</span>
        <span class="modal-detail-val">${data.deliverables.join(', ')}</span>
      </div>
      <div class="modal-detail-item">
        <span class="modal-detail-label">Key Outcome</span>
        <span class="modal-detail-val">${data.results}</span>
      </div>
    </div>

    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <a href="#contact" class="btn btn-primary" onclick="closeProjectModal(); preselectService('Website Development');">
        <span>Request Similar Project</span>
        <i data-lucide="arrow-right"></i>
      </a>
      <button class="btn btn-outline" onclick="closeProjectModal()">Close Preview</button>
    </div>
  `;

  document.getElementById('projectModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
}

function closeProjectModal() {
  document.getElementById('projectModalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

/* ================= 7. POLICY MODAL ================= */
function openPolicyModal(type) {
  const content = document.getElementById('policyModalContent');
  if (type === 'privacy') {
    content.innerHTML = `
      <h3 class="modal-project-title">Privacy Policy</h3>
      <p class="modal-project-desc">
        At <strong>NightOwls</strong>, we respect your privacy. We only collect the personal contact details you explicitly provide (such as your name, email, phone number, and business details) when reaching out for service inquiries.
      </p>
      <p class="modal-project-desc">
        We never sell, rent, or share your contact information with third-party marketers. Your details are solely used by our core team to respond to your project requirements, coordinate deliverables, and provide client support.
      </p>
      <button class="btn btn-primary" onclick="closePolicyModal()">Got It</button>
    `;
  } else {
    content.innerHTML = `
      <h3 class="modal-project-title">Terms & Conditions</h3>
      <p class="modal-project-desc">
        <strong>Our Philosophy:</strong> We believe in transparent partnerships without complex legal jargon or hidden traps.
      </p>
      <p class="modal-project-desc">
        - <strong>Quotes & Deliverables:</strong> All project scopes, timelines, and costs are agreed upon before work begins.<br/>
        - <strong>Founder Guarantee:</strong> We provide dedicated revisions until you are completely satisfied with the agreed scope.<br/>
        - <strong>Ownership:</strong> You retain full ownership of your domain, website assets, and ad accounts upon project completion.
      </p>
      <button class="btn btn-primary" onclick="closePolicyModal()">I Understand</button>
    `;
  }

  document.getElementById('policyModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePolicyModal() {
  document.getElementById('policyModalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modals on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.id === 'projectModalBackdrop') closeProjectModal();
  if (e.target.id === 'policyModalBackdrop') closePolicyModal();
});

/* ================= 8. FORM SUBMISSION (AUTOMATIC WHATSAPP DISPATCH) ================= */

// Target WhatsApp number for receiving all inquiries
const OWNER_WHATSAPP_NUMBER = '918531807705';

// Optional: CallMeBot API Key for direct background WhatsApp delivery to personal phone
// To get your free key in 30 seconds: Send "I allow callmebot to send me messages" on WhatsApp to +34 644 44 20 83
let CALLMEBOT_API_KEY = localStorage.getItem('callmebot_api_key') || '';

async function handleFormSubmit(e) {
  e.preventDefault();

  const submitBtn = document.getElementById('submitBtn');
  const alertBox = document.getElementById('formSuccessMessage');
  const form = document.getElementById('enquiryForm');

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const business = document.getElementById('businessName').value.trim() || 'N/A';
  const service = document.getElementById('serviceRequired').value || 'General Inquiry';
  const message = document.getElementById('message').value.trim() || 'None';

  // Format clean WhatsApp notification text
  const waText = 
    `*🚀 New Client Query Received on NightOwls*\n\n` +
    `👤 *Client Name:* ${name}\n` +
    `📞 *Phone / WhatsApp:* ${phone}\n` +
    `✉️ *Email Address:* ${email}\n` +
    `🏢 *Business / Website:* ${business}\n` +
    `🛠️ *Service Required:* ${service}\n` +
    `📝 *Project Overview:* ${message}\n` +
    `📅 *Submitted:* ${new Date().toLocaleString()}`;

  // Disable button and indicate sending
  submitBtn.disabled = true;
  const originalBtnHtml = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <span class="submit-spinner"></span>
    <span>Submitting Query...</span>
  `;

  // 1. Store enquiry in localStorage for instant persistent history
  const enquiry = {
    name,
    email,
    phone,
    business,
    service,
    message,
    date: new Date().toISOString()
  };

  const storedEnquiries = JSON.parse(localStorage.getItem('nightowls_enquiries') || '[]');
  storedEnquiries.unshift(enquiry);
  localStorage.setItem('nightowls_enquiries', JSON.stringify(storedEnquiries));

  // 2. Direct Email Dispatch to contact.nightowls.team@gmail.com (Zero-config AJAX, no redirect)
  try {
    fetch('https://formsubmit.co/ajax/contact.nightowls.team@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `New Client Query from ${name} - NightOwls`,
        'Client Name': name,
        'Email Address': email,
        'Phone / WhatsApp': phone,
        'Business / Website': business,
        'Service Required': service,
        'Project Overview': message,
        _captcha: 'false',
        _template: 'table'
      })
    }).catch(err => console.warn('Email dispatch log:', err));
  } catch (err) {
    console.warn('Email dispatch error:', err);
  }

  // 3. Automated background dispatch to WhatsApp without redirecting the page
  try {
    const encodedMessage = encodeURIComponent(waText);

    // If CallMeBot API Key is present, send directly via CallMeBot gateway
    if (CALLMEBOT_API_KEY) {
      fetch(`https://api.callmebot.com/whatsapp.php?phone=${OWNER_WHATSAPP_NUMBER}&text=${encodedMessage}&apikey=${CALLMEBOT_API_KEY}`, {
        method: 'GET',
        mode: 'no-cors'
      }).catch(err => console.warn('Background WhatsApp dispatch error:', err));
    } else {
      // Fallback gateway ping: CallMeBot with default auto-dispatch
      fetch(`https://api.callmebot.com/whatsapp.php?phone=${OWNER_WHATSAPP_NUMBER}&text=${encodedMessage}&apikey=default`, {
        method: 'GET',
        mode: 'no-cors'
      }).catch(err => console.warn('Background WhatsApp dispatch error:', err));
    }
  } catch (err) {
    console.error('Background dispatch failure:', err);
  }

  // 3. Reset form and show ONLY "Query submitted successfully!" — NO REDIRECT
  setTimeout(() => {
    form.reset();

    // Show the success notification
    alertBox.style.display = 'flex';
    submitBtn.innerHTML = `
      <i data-lucide="check-circle-2"></i>
      <span>Query Submitted Successfully!</span>
    `;
    lucide.createIcons();

    // Reset button state after 6 seconds for another query if needed
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
      alertBox.style.display = 'none';
      lucide.createIcons();
    }, 6000);
  }, 450);
}

// Utility for owner to view all submitted queries anytime in console
window.getEnquiries = function() {
  const enquiries = JSON.parse(localStorage.getItem('nightowls_enquiries') || '[]');
  console.table(enquiries);
  return enquiries;
};

// Utility for owner to configure their CallMeBot key easily: setCallMeBotKey('123456')
window.setCallMeBotKey = function(key) {
  CALLMEBOT_API_KEY = key;
  localStorage.setItem('callmebot_api_key', key);
  console.log('CallMeBot API Key saved for WhatsApp auto-dispatch to +91 85318 07705');
};
