document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============ MATRIX RAIN BACKGROUND ============ */
  const matrixCanvas = document.getElementById('matrixCanvas');
  if (matrixCanvas && !prefersReducedMotion) {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const ctx = matrixCanvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.min(Math.floor(matrixCanvas.width / fontSize), 40);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = 'rgba(0, 255, 65, 0.85)';
      ctx.font = fontSize + 'px "JetBrains Mono", monospace';
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    window.addEventListener('resize', () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }, { passive: true });
  }

  /* ============ MERGED SCROLL HANDLER (navbar + progress) ============ */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scrollProgress');
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ============ MOBILE NAV ============ */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.focus();
    }
  });

  /* ============ ACTIVE NAV LINK ============ */
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

  /* ============ SCROLL ANIMATIONS ============ */
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  fadeElements.forEach(el => fadeObserver.observe(el));

  /* ============ SMOOTH SCROLL ============ */
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

  /* ============ 3D TILT EFFECT ============ */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (tiltCards.length && !prefersReducedMotion) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* ============ SKILL BAR ANIMATION ============ */
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  if (skillFills.length) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.getAttribute('data-width');
          if (width) {
            setTimeout(() => { fill.style.width = width + '%'; }, 200);
          }
          skillObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(fill => skillObserver.observe(fill));
  }

  /* ============ CONTACT FORM ============ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');
    const submitBtn = document.getElementById('formSubmit');
    const inputs = [nameInput, emailInput, subjectInput, messageInput];

    function sanitize(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.textContent;
    }

    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateField(input) {
      const errorSpan = input.parentElement.querySelector('.form-error');
      const rawValue = input.value;
      const value = sanitize(rawValue).trim();
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

    nameInput.name = 'Your Name';
    emailInput.name = 'Your Email';
    subjectInput.name = 'Subject';
    messageInput.name = 'Your Message';

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', function() {
          if (this.classList.contains('error') || this.classList.contains('valid')) validateField(this);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      let isValid = true;
      inputs.forEach(input => {
        if (input && !validateField(input)) isValid = false;
      });

      if (!isValid) {
        e.preventDefault();
        const firstError = contactForm.querySelector('.glass-input.error');
        if (firstError) firstError.focus();
        return;
      }

      inputs.forEach(input => {
        if (input) input.value = sanitize(input.value);
      });

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    });
  }

  /* ============ PARALLAX ORBS ============ */
  const heroOrbs = document.querySelectorAll('.hero-orb');
  if (heroOrbs.length && !prefersReducedMotion) {
    let orbTicking = false;
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      if (!orbTicking) {
        requestAnimationFrame(() => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          const xPercent = (clientX / innerWidth - 0.5) * 2;
          const yPercent = (clientY / innerHeight - 0.5) * 2;
          heroOrbs[0].style.transform = `translate(${xPercent * 20}px, ${yPercent * 15}px)`;
          if (heroOrbs[1]) {
            heroOrbs[1].style.transform = `translate(${xPercent * -15}px, ${yPercent * -10}px)`;
          }
          orbTicking = false;
        });
        orbTicking = true;
      }
    }, { passive: true });
  }

  /* ============ GLITCH EFFECT ON HERO TITLE ============ */
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !prefersReducedMotion) {
    function triggerGlitch() {
      heroTitle.style.animation = 'glitch 200ms ease';
      setTimeout(() => { heroTitle.style.animation = ''; }, 200);
      const nextDelay = 8000 + Math.random() * 7000;
      setTimeout(triggerGlitch, nextDelay);
    }
    const initialDelay = 8000 + Math.random() * 7000;
    setTimeout(triggerGlitch, initialDelay);
  }

  /* ============ CASE STUDIES (coming soon) ============ */
  const container = document.getElementById('caseStudiesContainer');
  if (container) {
    container.innerHTML = `
      <div class="case-study-coming-soon glass-card fade-in">
        <div class="icon-box"><i class="fas fa-rocket"></i></div>
        <h3>Case Studies Coming Soon</h3>
        <p>I'm building real results for real clients. Detailed case studies will be published here once projects are complete. Stay tuned!</p>
      </div>
    `;
  }
});
