/**
 * Plaza Real Silao - Shared Components
 * Version: 2.0 (warm/editorial redesign)
 * Reusable navigation + footer injected on every page. SVG icons via sprite.
 */

(function () {
    'use strict';

    // Detect GitHub Pages vs custom domain / Cloudflare
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/Silao' : '';
    const ico = (id, cls) => `<svg class="ico${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="${basePath}/images/icons/sprite.svg#${id}"></use></svg>`;

    const navigationHTML = `
        <nav class="navbar" role="navigation" aria-label="Navegación principal">
            <div class="container nav-wrapper">
                <a class="logo" href="${basePath}/" aria-label="Plaza Real Silao - Inicio">
                    <img src="${basePath}/images/logo-silao.webp" alt="Plaza Real Silao" class="logo-img" width="44" height="44">
                    <span class="logo-text-wrapper">
                        <span class="logo-text">Plaza Real</span>
                        <span class="logo-accent">Silao</span>
                    </span>
                </a>

                <ul class="nav-menu">
                    <li><a href="${basePath}/" class="nav-link" data-page="home">Inicio</a></li>
                    <li><a href="${basePath}/tiendas/" class="nav-link" data-page="tiendas">Tiendas</a></li>
                    <li><a href="${basePath}/espacios/" class="nav-link" data-page="espacios">Espacios</a></li>
                    <li><a href="${basePath}/faq/" class="nav-link" data-page="faq">FAQ</a></li>
                    <li><a href="${basePath}/inversionistas/" class="nav-link" data-page="inversionistas">Inversionistas</a></li>
                    <li><a href="${basePath}/#contact" class="nav-link nav-cta">Visítanos</a></li>
                </ul>

                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Abrir menú" aria-expanded="false">
                    ${ico('menu')}
                </button>
            </div>
        </nav>

        <div class="mobile-sidebar" id="mobileSidebar" aria-hidden="true">
            <div class="mobile-sidebar-header">
                <div class="mobile-sidebar-logo">
                    <img src="${basePath}/images/logo-silao.webp" alt="Plaza Real Silao" width="36" height="36">
                    <span>Plaza Real Silao</span>
                </div>
                <button class="mobile-sidebar-close" id="mobileSidebarClose" aria-label="Cerrar menú">${ico('x')}</button>
            </div>
            <nav class="mobile-sidebar-nav">
                <a href="${basePath}/" class="mobile-nav-link">${ico('home')}<span>Inicio</span></a>
                <a href="${basePath}/tiendas/" class="mobile-nav-link">${ico('store')}<span>Tiendas</span></a>
                <a href="${basePath}/espacios/" class="mobile-nav-link">${ico('building')}<span>Espacios disponibles</span></a>
                <a href="${basePath}/faq/" class="mobile-nav-link">${ico('help')}<span>Preguntas frecuentes</span></a>
                <a href="${basePath}/inversionistas/" class="mobile-nav-link">${ico('lock')}<span>Inversionistas</span></a>
                <a href="${basePath}/#contact" class="mobile-nav-link">${ico('pin')}<span>Visítanos</span></a>
            </nav>
            <div class="mobile-sidebar-footer">
                <a href="tel:+5578789795" class="mobile-contact-link">${ico('phone')}<span>(55) 7878-9795</span></a>
                <a href="mailto:contacto@plazarealsilao.com" class="mobile-contact-link">${ico('mail')}<span>Contacto</span></a>
                <div class="mobile-social-links">
                    <a href="https://facebook.com/plazarealsilao" target="_blank" rel="noopener" aria-label="Facebook">${ico('facebook')}</a>
                    <a href="https://instagram.com/plazarealsilao" target="_blank" rel="noopener" aria-label="Instagram">${ico('instagram')}</a>
                    <a href="https://wa.me/5578789795" target="_blank" rel="noopener" aria-label="WhatsApp">${ico('whatsapp')}</a>
                </div>
            </div>
        </div>
        <div class="mobile-sidebar-overlay" id="mobileSidebarOverlay"></div>
    `;

    const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section footer-brand">
                    <a class="footer-logo" href="${basePath}/">
                        <img src="${basePath}/images/logo-silao.webp" alt="Plaza Real Silao" width="40" height="40">
                        <span>Plaza Real Silao</span>
                    </a>
                    <p>Tu centro comercial familiar en Silao de la Victoria, Guanajuato.</p>
                    <div class="social-links">
                        <a href="https://facebook.com/plazarealsilao" aria-label="Facebook" target="_blank" rel="noopener">${ico('facebook')}</a>
                        <a href="https://instagram.com/plazarealsilao" aria-label="Instagram" target="_blank" rel="noopener">${ico('instagram')}</a>
                        <a href="https://wa.me/5578789795" aria-label="WhatsApp" target="_blank" rel="noopener">${ico('whatsapp')}</a>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Explora</h4>
                    <ul>
                        <li><a href="${basePath}/">Inicio</a></li>
                        <li><a href="${basePath}/tiendas/">Tiendas</a></li>
                        <li><a href="${basePath}/espacios/">Espacios disponibles</a></li>
                        <li><a href="${basePath}/faq/">Preguntas frecuentes</a></li>
                        <li><a href="${basePath}/inversionistas/">Inversionistas</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Horario general</h4>
                    <p>Lunes a Viernes: 8:00 - 22:00<br>Sábado y Domingo: variable por tienda</p>
                </div>
                <div class="footer-section">
                    <h4>Contacto</h4>
                    <p class="footer-contact">
                        ${ico('pin')} Libramiento Nte. 3140, 36100 Silao, Gto.<br>
                        ${ico('phone')} <a href="tel:+5578789795">(55) 7878-9795</a><br>
                        ${ico('mail')} <a href="mailto:contacto@plazarealsilao.com">contacto@plazarealsilao.com</a>
                    </p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Plaza Real Silao. Todos los derechos reservados.</p>
                <div class="footer-links">
                    <a href="${basePath}/sitemap.xml">Mapa del sitio</a>
                </div>
            </div>
        </div>
    `;

    function injectNavigation() {
        const header = document.getElementById('header');
        if (header && !header.querySelector('.navbar')) {
            header.innerHTML = navigationHTML;
            setActiveNavLink();
            initMobileMenu();
            initNavScroll();
        }
    }

    function injectFooter() {
        const footer = document.querySelector('.footer');
        if (footer && !footer.querySelector('.container')) {
            footer.innerHTML = footerHTML;
        }
    }

    function setActiveNavLink() {
        const path = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = new URL(link.href).pathname;
            const isHome = (href === basePath + '/' || href === '/' || href === '/index.html');
            if (isHome && (path === basePath + '/' || path === '/' || path === '/index.html')) {
                link.classList.add('active');
            } else if (!isHome && href !== basePath + '/#contact' && path.startsWith(href.replace(/\/$/, ''))) {
                link.classList.add('active');
            }
        });
    }

    function initNavScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('mobileSidebar');
        const closeBtn = document.getElementById('mobileSidebarClose');
        const overlay = document.getElementById('mobileSidebarOverlay');
        if (!toggle || !sidebar) return;

        const open = () => {
            sidebar.classList.add('active'); overlay.classList.add('active');
            document.body.classList.add('menu-open'); toggle.setAttribute('aria-expanded', 'true');
            sidebar.setAttribute('aria-hidden', 'false');
        };
        const close = () => {
            sidebar.classList.remove('active'); overlay.classList.remove('active');
            document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false');
            sidebar.setAttribute('aria-hidden', 'true');
        };

        toggle.addEventListener('click', open);
        closeBtn && closeBtn.addEventListener('click', close);
        overlay && overlay.addEventListener('click', close);
        sidebar.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', close));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;
        window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    function initComponents() {
        injectNavigation();
        injectFooter();
        initBackToTop();
    }

    window.PlazaRealComponents = { init: initComponents, injectNavigation, injectFooter };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();
