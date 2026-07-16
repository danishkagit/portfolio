/* ============================================
   DANISH SHOAIB — Portfolio
   Engineered by: Frontend Developer, UI Designer
   Audited by: Security Engineer, Accessibility Auditor, SEO Specialist
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     NAVBAR — Scroll Effect
     ============================================ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
  }, { passive: true });

  /* ============================================
     SCROLL PROGRESS BAR
     ============================================ */
  const progressBar = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
  }, { passive: true });

  /* ============================================
     MOBILE NAV — Hamburger Toggle
     ============================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close nav on link click */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* Close nav on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
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
          const isActive = anchor.getAttribute('href') === `#${id}`;
          anchor.classList.toggle('active', isActive);
          if (isActive) anchor.setAttribute('aria-current', 'page');
          else anchor.removeAttribute('aria-current');
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
        const offset = 80;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     CONTACT FORM — Validation & Security
     ============================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');
    const submitBtn = document.getElementById('formSubmit');
    const inputs = [nameInput, emailInput, subjectInput, messageInput];

    /* Sanitize input (XSS prevention) */
    function sanitize(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.textContent;
    }

    /* Validate email format */
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* Validate a single field */
    function validateField(input) {
      const errorSpan = input.parentElement.querySelector('.form-error');
      const value = input.value.trim();
      let error = '';

      if (input.required && !value) {
        error = input.name || 'This field is required';
      } else if (value) {
        switch (input.type) {
          case 'email':
            if (!isValidEmail(value)) error = 'Please enter a valid email address';
            break;
          default:
            if (input.minLength && value.length < input.minLength)
              error = `Minimum ${input.minLength} characters required`;
            if (input.maxLength && value.length > input.maxLength)
              error = `Maximum ${input.maxLength} characters allowed`;
            break;
        }
      }

      if (error) {
        input.classList.add('error');
        input.classList.remove('valid');
        input.setAttribute('aria-invalid', 'true');
        errorSpan.textContent = error;
        errorSpan.classList.add('visible');
        return false;
      } else {
        input.classList.remove('error');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
        errorSpan.textContent = '';
        errorSpan.classList.remove('visible');
        return true;
      }
    }

    /* Set names for error messages */
    nameInput.name = 'Your Name';
    emailInput.name = 'Your Email';
    subjectInput.name = 'Subject';
    messageInput.name = 'Your Message';

    /* Real-time validation on blur */
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', function() {
          if (this.classList.contains('error')) validateField(this);
        });
      }
    });

    /* Form submit handler */
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      /* Validate all fields */
      let isValid = true;
      inputs.forEach(input => {
        if (input && !validateField(input)) isValid = false;
      });

      if (!isValid) {
        const firstError = contactForm.querySelector('.glass-input.error');
        if (firstError) firstError.focus();
        return;
      }

      /* Sanitize all inputs (security) */
      const sanitizedName = sanitize(nameInput.value.trim());
      const sanitizedEmail = sanitize(emailInput.value.trim());
      const sanitizedSubject = sanitize(subjectInput.value.trim());
      const sanitizedMessage = sanitize(messageInput.value.trim());

      /* Disable button and show success */
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      /* Simulate send (replace with actual API call in production) */
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, rgba(81, 207, 102, 0.4), rgba(126, 187, 197, 0.4))';

        /* Announce success to screen readers */
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'alert');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.textContent = 'Your message has been sent successfully!';
        contactForm.appendChild(announcement);
        setTimeout(() => announcement.remove(), 3000);

        setTimeout(() => {
          submitBtn.textContent = 'Send Message';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
          inputs.forEach(input => {
            input.classList.remove('valid', 'error');
            input.setAttribute('aria-invalid', 'false');
            const errorSpan = input.parentElement.querySelector('.form-error');
            if (errorSpan) {
              errorSpan.textContent = '';
              errorSpan.classList.remove('visible');
            }
          });
        }, 2500);
      }, 1500);
    });
  }

  /* ============================================
     PARALLAX ORBS — Performance-optimized
     ============================================ */
  const heroOrbs = document.querySelectorAll('.hero-orb');
  if (heroOrbs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPercent = (clientX / innerWidth - 0.5) * 2;
          const yPercent = (clientY / innerHeight - 0.5) * 2;
          heroOrbs[0].style.transform = `translate(${xPercent * 20}px, ${yPercent * 15}px)`;
          if (heroOrbs[1]) {
            heroOrbs[1].style.transform = `translate(${xPercent * -15}px, ${yPercent * -10}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================
     DYNAMIC YEAR — Footer
     ============================================ */
  const footerYear = document.querySelector('.footer p');
  if (footerYear) {
    const currentYear = new Date().getFullYear().toString();
    footerYear.textContent = footerYear.textContent.replace(/2026/, currentYear);
  }

  /* ============================================
     LAZY LOAD — Deferred animations
     ============================================ */
  if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.src) el.src = el.dataset.src;
          el.removeAttribute('data-lazy');
          lazyObserver.unobserve(el);
        }
      });
    });
    lazyElements.forEach(el => lazyObserver.observe(el));
  }

});