/* Easy Connect Malaysia — GSAP-powered */
gsap.registerPlugin(ScrollTrigger);

/* ─── Scroll progress bar ─── */
const progressBar = document.getElementById('scrollProgress');
ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: self => {
        if (progressBar) progressBar.style.width = (self.progress * 100) + '%';
    }
});

/* ─── Navbar ─── */
const navbar = document.getElementById('navbar');
if (navbar) {
    /* On non-hero pages keep navbar always solid */
    if (!document.querySelector('.hero')) {
        navbar.classList.add('scrolled');
    } else {
        ScrollTrigger.create({
            start: 60,
            onEnter:     () => navbar.classList.add('scrolled'),
            onLeaveBack: () => navbar.classList.remove('scrolled'),
        });
    }
}

/* ─── Mobile menu ─── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose= document.getElementById('mobileClose');

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
}
if (hamburger) hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
});
if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

/* ─── Mobile dropdown toggle ─── */
function toggleMobileDropdown(btn) {
    const sub = btn.nextElementSibling;
    if (!sub) return;
    const isOpen = sub.classList.toggle('open');
    btn.classList.toggle('is-open', isOpen);
}

/* ─── Smooth scroll with clean URLs ─── */
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"], a[href="/about"]');
    if (!link) return;
    let id = link.getAttribute('href');
    if (id === '/about') {
        if (!document.getElementById('about')) return;
        id = '#about';
    }
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    const navEl = document.getElementById('navbar');
    const offset = navEl ? navEl.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    const slug = id.replace('#', '');
    const path = slug === 'home' ? '/home' : '/' + slug;
    history.pushState(null, '', path);
}, true);

window.addEventListener('hashchange', function() {
    history.replaceState(null, '', window.location.pathname);
});

/* Keep the homepage and About section on one document with clean URLs. */
const aboutSection = document.getElementById('about');
if (aboutSection) {
    if (window.location.pathname.replace(/\/$/, '') === '/about') {
        window.addEventListener('load', () => {
            const navHeight = navbar ? navbar.offsetHeight : 0;
            window.scrollTo({ top: aboutSection.offsetTop - navHeight, behavior: 'auto' });
        });
    }
    ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top 45%',
        end: 'bottom 35%',
        onEnter: () => history.replaceState(null, '', '/about'),
        onEnterBack: () => history.replaceState(null, '', '/about'),
        onLeaveBack: () => history.replaceState(null, '', '/home')
    });
}

/* ─── Language buttons ─── */
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

/* ─── FAQ accordion ─── */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
    });
});

/* ─── Hero entrance ─── */
const heroRoot = document.querySelector('.hero');
if (heroRoot) {
const heroTl = gsap.timeline({ delay: 0.2 });
heroTl
    .fromTo('.hero-eyebrow',
        { y: 16 },
        { y: 0, duration: 0.6, ease: 'power3.out' })
    .fromTo('.hero-title',
        { y: 28 },
        { y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.3')
    .fromTo('.hero-desc',
        { y: 20 },
        { y: 0, duration: 0.65, ease: 'power3.out' }, '-=0.45')
    .fromTo('.hero-cta',
        { y: 18 },
        { y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    .fromTo('.hero-visual',
        { x: 40 },
        { x: 0, duration: 0.9, ease: 'power3.out' }, '-=0.85');
}

function batchIfPresent(selector, config) {
    if (document.querySelector(selector)) ScrollTrigger.batch(selector, config);
}

/* ─── Scroll-reveal for [data-anim] elements ─── */
document.querySelectorAll('[data-anim]').forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0) / 1000;
    ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
            gsap.to(el, {
                opacity: 1, x: 0, y: 0,
                duration: 0.65, ease: 'power3.out', delay
            });
            el.classList.add('is-visible');
        }
    });
});

/* ─── VMV cards stagger ─── */
batchIfPresent('.vmv-card', {
    start: 'top 85%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.15 }
        );
    }
});

/* ─── Core Values grid ─── */
batchIfPresent('.value-item', {
    start: 'top 88%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 24, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.4)', stagger: 0.09 }
        );
    }
});

/* ─── VMV values-wrap ─── */
const valuesWrap = document.querySelector('.vmv-values-wrap');
if (valuesWrap) {
    ScrollTrigger.create({
        trigger: valuesWrap,
        start: 'top 85%',
        once: true,
        onEnter: () => gsap.fromTo(valuesWrap,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
        )
    });
}

/* ─── Why Choose Us cards ─── */
batchIfPresent('.why-card', {
    start: 'top 88%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 }
        );
    }
});

/* ─── Product card animation ─── */
batchIfPresent('.pcard', {
    start: 'top 90%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05 }
        );
    }
});

/* ─── Solutions / Sol cards ─── */
batchIfPresent('.sol-card', {
    start: 'top 90%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07 }
        );
    }
});

/* ─── Showcase — laptop assembly (GSAP scrubbed) ─── */
(function initShowcase() {
    const section = document.querySelector('.showcase-section');
    const pin     = document.getElementById('showcasePin');
    const lid     = document.getElementById('lpLid');
    const base    = document.getElementById('lpBase');
    const screen  = document.getElementById('lpScreen');
    const glow    = document.getElementById('lpGlow');
    const steps   = document.querySelectorAll('.sc-step');
    const pd1     = document.getElementById('lpPd1');
    const pd2     = document.getElementById('lpPd2');
    const pd3     = document.getElementById('lpPd3');

    if (!section || !pin || !lid || !base) return;
    if (window.matchMedia('(max-width:900px)').matches) return;

    gsap.set(lid,    { y: -420, opacity: 0 });
    gsap.set(base,   { y:  420, opacity: 0 });
    gsap.set(screen, { opacity: 0 });
    gsap.set(glow,   { opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(lid,  { y: 0, opacity: 1, ease: 'power1.inOut', duration: 5 }, 0);
    tl.to(base, { y: 0, opacity: 1, ease: 'power1.inOut', duration: 5 }, 0);
    tl.to(lid,  { rotateX: -60, ease: 'power2.inOut', duration: 3.5 });
    tl.to(screen, { opacity: 1, ease: 'power2.out', duration: 1.5 });
    tl.to(glow,   { opacity: 1, ease: 'power2.out', duration: 1.5 }, '<');

    ScrollTrigger.create({
        trigger:      section,
        start:        'top top',
        end:          'bottom bottom',
        pin:          pin,
        anticipatePin: 1,
        scrub:        1.2,
        animation:    tl,
        onUpdate: self => {
            const p = self.progress;
            const activeIdx = Math.min(5, Math.floor(p * 6));
            steps.forEach((s, i) => s.classList.toggle('sc-step--active', i === activeIdx));
            const phase = p < 0.5 ? 0 : p < 0.85 ? 1 : 2;
            [pd1, pd2, pd3].forEach((dot, i) => {
                if (dot) dot.classList.toggle('active', i === phase);
            });
        }
    });
})();

/* ─── Sector card reveal ─── */
batchIfPresent('.sector-card', {
    start: 'top 88%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.08 }
        );
    }
});

/* ─── Blog card reveal ─── */
batchIfPresent('.blog-card', {
    start: 'top 90%',
    once: true,
    onEnter: els => {
        gsap.fromTo(els,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.07 }
        );
    }
});

/* ─── Contact Form Submission ─── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        fetch('https://formsubmit.co/ajax/info@easyconnect.my', {
            method: 'POST',
            body: new FormData(contactForm)
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                alert('Thank you! Your inquiry has been sent successfully.');
                contactForm.reset();
            } else {
                alert('Oops! Something went wrong. Please try again.');
            }
        })
        .catch(() => alert('Oops! Something went wrong. Please check your connection and try again.'))
        .finally(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        });
    });
}
