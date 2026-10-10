import React, { useState, useEffect, useRef, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import Team from './components/Team';
import Trust from './components/Trust';
import CtaBanner from './components/CtaBanner';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import MobileBottomNav from './components/MobileBottomNav';

// Lazy load non-critical and separate route components to reduce initial bundle size
const WorksPage = React.lazy(() => import('./components/WorksPage'));
const CaseStudyPage = React.lazy(() => import('./components/CaseStudyPage'));
const ProjectModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.ProjectModal })));
const PolicyModal = React.lazy(() => import('./components/Modals').then(m => ({ default: m.PolicyModal })));

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/\/$/, '');
      const hash = window.location.hash;
      if (path === '/work' || hash === '#/work' || hash === '#work') return 'work';
      if (path.startsWith('/work/') || path.startsWith('/case-study/')) return 'case-study';
      if (path === '/services') return 'services';
      if (path === '/about') return 'about';
      if (path === '/team') return 'team';
      if (path === '/contact') return 'contact';
    }
    return 'home';
  });

  const [activeProject, setActiveProject] = useState(null);
  const [activePolicy, setActivePolicy] = useState(null);
  const [preselectedService, setPreselectedService] = useState('');
  const [transitionState, setTransitionState] = useState('idle'); // 'idle' | 'exiting' | 'entering'
  const transitionTimerRef = useRef(null);

  // Handle browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '');
      const hash = window.location.hash;
      
      let targetPage = 'home';
      if (path === '/work' || hash === '#/work' || hash === '#work') targetPage = 'work';
      else if (path.startsWith('/work/') || path.startsWith('/case-study/')) targetPage = 'case-study';
      else if (path === '/services') targetPage = 'services';
      else if (path === '/about') targetPage = 'about';
      else if (path === '/team') targetPage = 'team';
      else if (path === '/contact') targetPage = 'contact';
      
      setTransitionState('exiting');
      setTimeout(() => {
        setCurrentPage(targetPage);
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTransitionState('entering');
        setTimeout(() => setTransitionState('idle'), 300);
      }, 200);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const navHeight = document.getElementById('navbar')?.offsetHeight || 72;
    const targetPos = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  };

  const navigateTo = (page, targetSection = '') => {
    if (page === currentPage) {
      if (targetSection) {
        scrollToSection(targetSection);
        if (targetSection === 'contact') {
          window.history.replaceState(null, '', '#contact');
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    // Step 1: Trigger smooth fade-out and progress bar
    setTransitionState('exiting');

    transitionTimerRef.current = setTimeout(() => {
      // Step 2: Swap the view state and reset scroll instantaneously while invisible
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (page.startsWith('/work/') || page.startsWith('/case-study/')) {
        setCurrentPage('case-study');
        window.history.pushState({ page: 'case-study' }, '', page);
      } else if (page === 'case-study') {
        setCurrentPage('case-study');
        window.history.pushState({ page: 'case-study' }, '', targetSection ? `/work/${targetSection}` : '/work');
      } else if (page === 'work') {
        setCurrentPage('work');
        window.history.pushState({ page: 'work' }, '', targetSection ? `/work#${targetSection}` : '/work');
      } else if (['services', 'about', 'team', 'contact'].includes(page)) {
        setCurrentPage(page);
        window.history.pushState({ page }, '', `/${page}`);
      } else {
        setCurrentPage('home');
        window.history.pushState({ page: 'home' }, '', targetSection ? `/#${targetSection}` : '/');
      }

      // Step 3: Trigger smooth entrance animation
      setTransitionState('entering');

      if (targetSection && !page.startsWith('/work/')) {
        setTimeout(() => scrollToSection(targetSection), 100);
        setTimeout(() => scrollToSection(targetSection), 350);
      }

      // Step 4: Settle to idle
      setTimeout(() => {
        setTransitionState('idle');
      }, 300);
    }, 220);
  };

  const handleBookConsultation = () => {
    if (currentPage !== 'home') {
      navigateTo('home', 'contact');
    } else {
      scrollToSection('contact');
      window.history.replaceState(null, '', '#contact');
    }
  };

  const handleSelectService = (service) => {
    setPreselectedService('');
    setTimeout(() => {
      setPreselectedService(service);
    }, 10);

    if (currentPage !== 'home') {
      navigateTo('home', 'contact');
    } else {
      scrollToSection('contact');
      window.history.replaceState(null, '', '#contact');
    }
  };

  return (
    <>
      {/* Top Page Route Transition Shimmer Bar */}
      <div className={`page-route-progress-bar ${transitionState !== 'idle' ? 'active' : ''}`} />

      <Navbar currentPage={currentPage === 'case-study' ? 'work' : currentPage} onNavigate={navigateTo} />

      <main className={`page-content-view page-view-${transitionState}`}>
        <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
          {currentPage === 'case-study' && (
            <CaseStudyPage
              onRequestProject={handleSelectService}
              onNavigate={navigateTo}
            />
          )}

          {currentPage === 'work' && (
            <WorksPage
              onSelectProject={(target) => navigateTo(`/work/${target}`)}
              onRequestProject={handleSelectService}
              onBackToProcess={() => navigateTo('home', 'process')}
              onBackHome={() => navigateTo('home', 'process')}
            />
          )}
        </Suspense>

        {currentPage === 'services' && (
          <div className="home-sections-flow standalone-page" style={{ paddingTop: '100px' }}>
            <Services onSelectService={handleSelectService} />
          </div>
        )}

        {currentPage === 'about' && (
          <div className="home-sections-flow standalone-page" style={{ paddingTop: '100px' }}>
            <About />
          </div>
        )}

        {currentPage === 'team' && (
          <div className="home-sections-flow standalone-page" style={{ paddingTop: '100px' }}>
            <Team />
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="home-sections-flow standalone-page" style={{ paddingTop: '100px' }}>
            <Contact preselectedService={preselectedService} />
          </div>
        )}

        {currentPage === 'home' && (
          <div className="home-sections-flow">
            <Hero
              onExploreWorks={() => navigateTo('work')}
              onBookConsultation={handleBookConsultation}
            />
            <About />
            <Services onSelectService={handleSelectService} />
            <WhyUs />
            <Process onExploreWorks={() => navigateTo('work')} />
            <Team />
            <Trust />
            <CtaBanner onBookConsultation={handleBookConsultation} />
            <Contact preselectedService={preselectedService} />
          </div>
        )}
      </main>

      <Footer
        onOpenPolicy={setActivePolicy}
        onSelectService={handleSelectService}
        onNavigate={navigateTo}
      />

      <MobileBottomNav currentPage={currentPage === 'case-study' ? 'work' : currentPage} onNavigate={navigateTo} />

      <FloatingWhatsApp />

      <Suspense fallback={null}>
        {activeProject && (
          <ProjectModal
            projectId={activeProject}
            onClose={() => setActiveProject(null)}
            onRequestProject={handleSelectService}
          />
        )}

        {activePolicy && (
          <PolicyModal
            policyType={activePolicy}
            onClose={() => setActivePolicy(null)}
          />
        )}
      </Suspense>
    </>
  );
}
