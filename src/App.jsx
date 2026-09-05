import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Process from './components/Process';
import WorksPage from './components/WorksPage';
import Team from './components/Team';
import Trust from './components/Trust';
import CtaBanner from './components/CtaBanner';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { ProjectModal, PolicyModal } from './components/Modals';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/work' || path === '/work/' || hash === '#/work' || hash === '#work') {
        return 'work';
      }
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
      const path = window.location.pathname;
      const hash = window.location.hash;
      const targetPage = (path === '/work' || path === '/work/' || hash === '#/work' || hash === '#work') ? 'work' : 'home';
      
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
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (page === 'work') {
        window.history.pushState({ page: 'work' }, '', '/work');
      } else {
        window.history.pushState({ page: 'home' }, '', targetSection ? `/#${targetSection}` : '/');
      }

      // Step 3: Trigger smooth entrance animation
      setTransitionState('entering');

      if (targetSection) {
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

      <Navbar currentPage={currentPage} onNavigate={navigateTo} />

      <main className={`page-content-view page-view-${transitionState}`}>
        {currentPage === 'work' ? (
          <WorksPage
            onSelectProject={setActiveProject}
            onRequestProject={handleSelectService}
            onBackToProcess={() => navigateTo('home', 'process')}
            onBackHome={() => navigateTo('home', 'process')}
          />
        ) : (
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

      <FloatingWhatsApp />

      <ProjectModal
        projectId={activeProject}
        onClose={() => setActiveProject(null)}
        onRequestProject={handleSelectService}
      />

      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </>
  );
}
