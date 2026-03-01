/* ========================================
   DAIRA '26 - JavaScript
   ======================================== */


// ---- Cards: 3D Tilt Effect (Category + About) ----
(function () {
    const cards = document.querySelectorAll('.category-card, .about-card');
    if (!cards.length) return;

    const maxTilt = 18; // degrees

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate tilt: mouse at edge = max tilt
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = ((centerY - y) / centerY) * maxTilt;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

            // Position the light highlight at cursor
            const percentX = (x / rect.width) * 100;
            const percentY = (y / rect.height) * 100;
            card.style.setProperty('--mouse-x', percentX + '%');
            card.style.setProperty('--mouse-y', percentY + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
        });
    });
})();

// ---- Scroll-triggered fade-in for sections ----
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.about-card, .category-card, .section-title, .section-tag, .section-desc').forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

// ---- Navbar scroll effect ----
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollY = window.scrollY;

    if (scrollY > 80) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.85)';
    }

    lastScroll = scrollY;
});

// ---- Mobile Menu Toggle ----
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
        mobileToggle.classList.toggle('active');
    });
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Add fade-in CSS dynamically ----
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
    .fade-in:nth-child(2) { transition-delay: 0.1s; }
    .fade-in:nth-child(3) { transition-delay: 0.2s; }
    .fade-in:nth-child(4) { transition-delay: 0.3s; }

    /* Mobile nav styles */
    @media (max-width: 1024px) {
        .nav-links.nav-open {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            padding: 16px 24px;
            border-bottom: 1px solid var(--border-subtle);
            gap: 4px;
        }
        .mobile-toggle.active span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }
        .mobile-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-toggle.active span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(style);
// ---- Counter Animation for Stats ----
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            const duration = 2000; // ms
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smoother finish
                const easeOutQuad = (t) => t * (2 - t);
                const currentCount = Math.floor(easeOutQuad(progress) * target);

                // Format with commas and add "+"
                el.innerText = currentCount.toLocaleString() + "+";

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    el.innerText = target.toLocaleString() + "+"; // Ensure final value is exact
                }
            }

            requestAnimationFrame(updateCount);
            countObserver.unobserve(el); // Only animate once
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number-lg').forEach(el => countObserver.observe(el));
