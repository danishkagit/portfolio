/* ============================================
   DANISH SHOAIB — Portfolio
   JavaScript | Animations & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     NAVBAR — Scroll Effect
     ============================================ */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });

  /* ============================================
     MOBILE NAV — Hamburger Toggle
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  /* Close nav on link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ============================================
     ACTIVE NAV LINK — Intersection Observer
     ============================================ */
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(anchor => {
          anchor.classList.toggle('active', anchor.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  /* ============================================
     SCROLL ANIMATIONS — Fade In
     ============================================ */
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(el => fadeObserver.observe(el));

  /* ============================================
     SMOOTH SCROLL — Nav Links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================
     CONTACT FORM — Submit Handler
     ============================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = 'linear-gradient(135deg, rgba(126, 187, 197, 0.5), rgba(84, 58, 103, 0.5))';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* ============================================
     PARALLAX ORBS — Hero Section
     ============================================ */
  const heroOrbs = document.querySelectorAll('.hero-orb');
  if (heroOrbs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      heroOrbs[0].style.transform = `translate(${xPercent * 20}px, ${yPercent * 15}px)`;
      if (heroOrbs[1]) {
        heroOrbs[1].style.transform = `translate(${xPercent * -15}px, ${yPercent * -10}px)`;
      }
    });
  }

  /* ============================================
     DYNAMIC YEAR — Footer
     ============================================ */
  const footerYear = document.querySelector('.footer p');
  if (footerYear) {
    footerYear.textContent = footerYear.textContent.replace('2026', new Date().getFullYear().toString());
  }

});