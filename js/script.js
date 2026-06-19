/**
 * Plaza Real Silao - Core JavaScript
 * Version: 2.0 (redesign)
 * Service worker, in-page smooth scroll, reveal-on-scroll, perf beacon.
 * Nav, mobile menu and back-to-top are handled by components.js.
 */

// Mark JS available so reveal animations only hide content when JS can reveal it.
document.documentElement.classList.add('js');

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ---- Smooth scroll for in-page hash links (accounts for sticky header) ----
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"], a[href*="/#"]');
        if (!link) return;
        const url = new URL(link.href, window.location.href);
        if (url.pathname !== window.location.pathname || !url.hash) return; // let cross-page links navigate
        const target = document.querySelector(url.hash);
        if (!target) return;
        e.preventDefault();
        const headerH = document.querySelector('.navbar')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
    });

    // ---- Reveal-on-scroll (safe: hidden only when .js + observer available) ----
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => io.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('in'));
    }

    // ---- Performance beacon to GA ----
    if ('performance' in window && typeof gtag !== 'undefined') {
        window.addEventListener('load', () => {
            const nav = performance.getEntriesByType('navigation')[0];
            if (nav) gtag('event', 'timing_complete', {
                name: 'load', value: Math.round(nav.loadEventEnd - nav.fetchStart), event_category: 'Performance'
            });
        });
    }
});
