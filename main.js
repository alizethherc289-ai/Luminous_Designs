/* =============================================
   LUMINOUS DESIGNS — main.js
   Navigation, animations, utilities
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── ACTIVE NAV LINK ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navbar .nav-links a, #mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar && navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── REVEAL ON SCROLL (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── PAGE TRANSITION ── */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    // On page load: fade in
    overlay.classList.remove('active');
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('javascript')) return;
      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 480);
      });
    });
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-toggle').textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.querySelector('.faq-toggle').textContent = '×';
      }
    });
  });

  /* ── CONTACT FORM (Formspree async) ── */
  const form = document.getElementById('contact-form');
  const successDiv = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Enviando...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          if (successDiv) successDiv.style.display = 'block';
        } else {
          btn.innerHTML = 'Error — intenta de nuevo';
          btn.disabled = false;
        }
      } catch {
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  }

  /* ── PROJECT FILTER ── */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.filter;
        projectCards.forEach(card => {
          const match = cat === 'all' || card.dataset.category === cat;
          card.style.display = match ? 'block' : 'none';
          card.style.animation = match ? 'fadeUp .4s ease' : 'none';
        });
      });
    });
  }

  /* ── LAZY LOAD IMAGES ── */
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if (lazyImgs.length) {
    const lazyObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          lazyObs.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(img => lazyObs.observe(img));
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = +el.dataset.count;
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current) + suffix;
          }, 16);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }

});

// Keyframe for filter animation
const style = document.createElement('style');
style.textContent = '@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(style);
