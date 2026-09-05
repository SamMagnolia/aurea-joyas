/* ==========================================================
   AUREA JOYAS — main.js
   Menú móvil, header en scroll, revelado de títulos,
   animación de destellos en el hero y formulario.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initSmoothAnchors();
  initRevealOnScroll();
  initSparkles();
  initNewsletterForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- header background on scroll ---------- */
function initHeaderScroll(){
  const header = document.getElementById('siteHeader');
  if(!header) return;

  const toggle = () => {
    if(window.scrollY > 40){
      header.classList.add('is-scrolled');
    }else{
      header.classList.remove('is-scrolled');
    }
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- mobile nav toggle ---------- */
function initMobileNav(){
  const toggleBtn = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if(!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- smooth scroll for in-page anchors ---------- */
function initSmoothAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if(id.length <= 1) return;
      const target = document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------- fade-in reveal for section titles only ---------- */
function initRevealOnScroll(){
  const targets = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  targets.forEach(t => {
    t.classList.add('reveal-ready');
    observer.observe(t);
  });
}

/* ---------- hero sparkle canvas ----------
   A quiet field of small gold specks that drift and twinkle,
   evoking light catching on metal and stones. Single orchestrated
   animation for the hero only. */
function initSparkles(){
  const canvas = document.getElementById('sparkleCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.closest('.hero');

  let particles = [];
  let width, height, dpr;
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }

  function buildParticles(){
    const count = Math.round((width * height) / 22000);
    particles = Array.from({ length: count }, () => spawnParticle());
  }

  function spawnParticle(){
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.5,
      baseAlpha: Math.random() * 0.5 + 0.25,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.15 + 0.03,
      drift: (Math.random() - 0.5) * 0.12
    };
  }

  const goldRGB = '184,135,74';

  function draw(t){
    ctx.clearRect(0, 0, width, height);
    for(const p of particles){
      const twinkle = 0.5 + 0.5 * Math.sin(t * 0.0015 * p.speed * 10 + p.phase);
      const alpha = p.baseAlpha * twinkle;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${goldRGB}, ${alpha.toFixed(3)})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      p.y -= p.speed;
      p.x += p.drift;
      if(p.y < -4){
        p.y = height + 4;
        p.x = Math.random() * width;
      }
    }
    if(!reduced){
      requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener('resize', resize);

  if(reduced){
    draw(0); // draw a single static frame, no loop
  }else{
    requestAnimationFrame(draw);
  }
}

/* ---------- newsletter form (front-end only) ---------- */
function initNewsletterForm(){
  const form = document.getElementById('newsletterForm');
  const note = document.getElementById('formNote');
  if(!form || !note) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('emailInput');
    const email = input.value.trim();
    if(!email){
      note.textContent = 'Escribe un correo para continuar.';
      return;
    }
    note.textContent = `Gracias, te escribiremos a ${email} con las novedades.`;
    form.reset();
  });
}
