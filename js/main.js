document.addEventListener('DOMContentLoaded', () => {

  /* ============ TERMINAL THEME CSS ============ */
  const terminalStyle = document.createElement('style');
  terminalStyle.textContent = `
    .text-terminal-green { color: var(--color-terminal-green); }
    .comment-prefix { color: var(--color-terminal-green); opacity: 0.5; font-family: var(--font-mono); font-size: 0.85em; margin-right: 0.5rem; user-select: none; }
    .terminal-prompt { color: var(--color-terminal-green); font-family: var(--font-mono); margin-right: 0.5rem; user-select: none; }
    .hero-title.glitch {
      animation: glitch 200ms ease;
    }
    @keyframes glitch {
      0% { transform: translateX(0); text-shadow: none; }
      20% { transform: translateX(-3px); text-shadow: 2px 0 var(--color-terminal-green), -2px 0 var(--color-neon-pink); }
      40% { transform: translateX(3px); text-shadow: -2px 0 var(--color-terminal-green), 2px 0 var(--color-neon-pink); }
      60% { transform: translateX(-2px); text-shadow: 1px 0 var(--color-terminal-green), -1px 0 var(--color-neon-pink); }
      80% { transform: translateX(2px); text-shadow: -1px 0 var(--color-terminal-green), 1px 0 var(--color-neon-pink); }
      100% { transform: translateX(0); text-shadow: none; }
    }
  `;
  document.head.appendChild(terminalStyle);

  /* ============ NAVBAR ============ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ============ SCROLL PROGRESS ============ */
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progress));
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
  const fadeElements = document.querySelectorAll('.fade-in, .scale-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
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
  if (tiltCards.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  const magneticBtns = document.querySelectorAll('.glass-btn, .glass-btn-primary');
  if (magneticBtns.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.setProperty('--mx', `${((x / rect.width) * 50) + 50}%`);
        btn.style.setProperty('--my', `${((y / rect.height) * 50) + 50}%`);
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
            setTimeout(() => {
              fill.style.width = width + '%';
            }, 200);
          }
          skillObserver.unobserve(fill);
        }
      });
    }, { threshold: 0.3 });
    skillFills.forEach(fill => skillObserver.observe(fill));
  }

  /* ============ COUNTER ANIMATION ============ */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'), 10);
          animateCounter(el, target, 1200);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ============ PARTICLE BACKGROUND ============ */
  const particleContainer = document.querySelector('.hero');
  if (particleContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0.3';
    canvas.width = particleContainer.offsetWidth;
    canvas.height = particleContainer.offsetHeight;
    particleContainer.style.position = 'relative';
    particleContainer.insertBefore(canvas, particleContainer.firstChild);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        a: Math.random() * 0.5 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(126, 187, 197, ${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(126, 187, 197, ${0.06 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener('resize', () => {
      canvas.width = particleContainer.offsetWidth;
      canvas.height = particleContainer.offsetHeight;
    }, { passive: true });
  }

  /* ============ MATRIX RAIN EFFECT ============ */
  const heroSection = document.querySelector('.hero');
  if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0.15';
    matrixCanvas.width = heroSection.offsetWidth;
    matrixCanvas.height = heroSection.offsetHeight;
    heroSection.insertBefore(matrixCanvas, heroSection.firstChild);

    const ctx = matrixCanvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const fontSize = 14;
    const columns = Math.min(Math.floor(matrixCanvas.width / fontSize), 40);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = 'rgba(0, 255, 65, 0.9)';
      ctx.font = fontSize + 'px "JetBrains Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    window.addEventListener('resize', () => {
      matrixCanvas.width = heroSection.offsetWidth;
      matrixCanvas.height = heroSection.offsetHeight;
    }, { passive: true });
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

    nameInput.name = 'Your Name';
    emailInput.name = 'Your Email';
    subjectInput.name = 'Subject';
    messageInput.name = 'Your Message';

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', function() {
          if (this.classList.contains('error')) validateField(this);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      inputs.forEach(input => {
        if (input && !validateField(input)) isValid = false;
      });

      if (!isValid) {
        const firstError = contactForm.querySelector('.glass-input.error');
        if (firstError) firstError.focus();
        return;
      }

      sanitize(nameInput.value.trim());
      sanitize(emailInput.value.trim());
      sanitize(subjectInput.value.trim());
      sanitize(messageInput.value.trim());

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, rgba(81, 207, 102, 0.4), rgba(126, 187, 197, 0.4))';

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

  /* ============ PARALLAX ORBS ============ */
  const heroOrbs = document.querySelectorAll('.hero-orb');
  if (heroOrbs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
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

  /* ============ GLITCH EFFECT ============ */
  const glitchTitle = document.querySelector('.hero-title');
  if (glitchTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    function triggerGlitch() {
      glitchTitle.classList.add('glitch');
      setTimeout(() => {
        glitchTitle.classList.remove('glitch');
      }, 200);
      const nextDelay = 4000 + Math.random() * 4000;
      setTimeout(triggerGlitch, nextDelay);
    }
    const initialDelay = 4000 + Math.random() * 4000;
    setTimeout(triggerGlitch, initialDelay);
  }

  /* ============ FOOTER TYPING EFFECT ============ */
  setTimeout(() => {
    const typingEl = document.getElementById('footerTyping');
    if (typingEl) {
      const rawText = typingEl.getAttribute('data-text') || '';
      const year = new Date().getFullYear().toString();
      const text = rawText.replace('2026', year);
      typingEl.textContent = '';
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          typingEl.textContent += text[i];
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60);
    }
  }, 1000);

  /* ============ LAZY LOAD ============ */
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
