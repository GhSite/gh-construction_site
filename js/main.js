/* ================================================
   GH CONSTRUCTIONS 31 — main.js
================================================ */

/* -----------------------------------------------
   HEADER : transparent → solid au scroll
----------------------------------------------- */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Déclencher immédiatement si la page est déjà scrollée
if (window.scrollY > 60) header.classList.add('scrolled');

/* -----------------------------------------------
   MENU MOBILE (burger)
----------------------------------------------- */
const burger   = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

function openMenu() {
    burger.classList.add('open');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    burger.classList.remove('open');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (burger && mobileNav) {
    burger.addEventListener('click', () => {
        burger.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Fermer au clic sur un lien
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fermer avec Échap
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });
}

/* -----------------------------------------------
   ANIMATIONS AU SCROLL (IntersectionObserver)
----------------------------------------------- */
const animTargets = document.querySelectorAll(
    '.service-card, .review-card, .process-step, .gallery-card, .fade-up'
);

if (animTargets.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animTargets.forEach(el => observer.observe(el));
}

/* -----------------------------------------------
   SMOOTH SCROLL sur les ancres internes
----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        closeMenu();
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* -----------------------------------------------
   FORMULAIRE DE CONTACT
----------------------------------------------- */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        // Simulation d'envoi — à remplacer par un vrai backend / service email
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
    });
}

/* -----------------------------------------------
   COMPTEUR ANIMÉ DES STATISTIQUES (hero)
----------------------------------------------- */
function animateCounter(el, target, suffix = '') {
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const value    = Math.round(ease * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsSection = document.querySelector('.hero-stats');

if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.stat strong').forEach(el => {
                const raw    = el.textContent.trim();
                const num    = parseInt(raw.replace(/\D/g, ''), 10);
                const suffix = raw.replace(/[0-9]/g, '');
                if (!isNaN(num) && num > 0) animateCounter(el, num, suffix);
            });
            statsObserver.disconnect();
        }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

/* -----------------------------------------------
   PARALLAX LÉGER SUR LE HERO
----------------------------------------------- */
const heroBg = document.querySelector('.hero-bg');

if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroBg.style.transform = `scale(1.03) translateY(${scrolled * 0.25}px)`;
        }
    }, { passive: true });
}
