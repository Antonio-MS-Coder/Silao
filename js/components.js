/**
 * Plaza Real Silao - Shared Components
 * Version: 1.0
 * Description: Reusable navigation and footer components for all pages
 */

(function() {
    'use strict';

    // Shared Navigation HTML
    const navigationHTML = `
        <nav class="navbar" role="navigation" aria-label="Navegación principal">
            <div class="container">
                <div class="nav-wrapper">
                    <!-- Logo -->
                    <div class="logo">
                        <a href="/Silao/" aria-label="Plaza Real Silao - Inicio">
                            <img src="/Silao/images/logo-silao.webp" alt="Plaza Real Silao" class="logo-img">
                            <div class="logo-text-wrapper">
                                <span class="logo-text">Plaza Real</span>
                                <span class="logo-accent">Silao</span>
                            </div>
                        </a>
                    </div>
                    
                    <!-- Desktop Navigation -->
                    <ul class="nav-menu" id="navMenu">
                        <li><a href="/Silao/" class="nav-link" data-page="home">Inicio</a></li>
                        <li><a href="/Silao/tiendas/" class="nav-link" data-page="tiendas">Tiendas</a></li>
                        <li><a href="/Silao/espacios/" class="nav-link" data-page="espacios">Espacios Disponibles</a></li>
                        <li><a href="/Silao/eventos/" class="nav-link" data-page="eventos">Eventos</a></li>
                        <li><a href="/Silao/faq/" class="nav-link" data-page="faq">FAQ</a></li>
                        <li><a href="/Silao/#contact" class="nav-link">Contacto</a></li>
                    </ul>
                    
                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Abrir menú">
                        <span class="hamburger"></span>
                        <span class="hamburger"></span>
                        <span class="hamburger"></span>
                    </button>
                </div>
            </div>
        </nav>
    `;

    // Shared Footer HTML
    const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Plaza Real Silao</h3>
                    <p>Tu centro comercial familiar en Silao de la Victoria</p>
                    <div class="social-links">
                        <a href="https://facebook.com/plazarealsilao" aria-label="Facebook" target="_blank" rel="noopener">
                            <i class="fab fa-facebook"></i>
                        </a>
                        <a href="https://instagram.com/plazarealsilao" aria-label="Instagram" target="_blank" rel="noopener">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://wa.me/5578789795" aria-label="WhatsApp" target="_blank" rel="noopener">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h4>Enlaces Rápidos</h4>
                    <ul>
                        <li><a href="/Silao/">Inicio</a></li>
                        <li><a href="/Silao/tiendas/">Tiendas</a></li>
                        <li><a href="/Silao/espacios/">Espacios Disponibles</a></li>
                        <li><a href="/Silao/eventos/">Eventos</a></li>
                        <li><a href="/Silao/faq/">Preguntas Frecuentes</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Horario General</h4>
                    <p>Lunes a Viernes: 8:00 - 22:00<br>
                    Sábado y Domingo: Variable por tienda</p>
                </div>
                
                <div class="footer-section">
                    <h4>Contacto</h4>
                    <p>
                        <i class="fas fa-map-marker-alt"></i> Libramiento Nte. 3140<br>
                        36100 Silao de la Victoria, Gto.<br>
                        <i class="fas fa-phone"></i> <a href="tel:+5578789795">(55) 7878-9795</a><br>
                        <i class="fas fa-envelope"></i> <a href="mailto:contacto@plazarealsilao.com">contacto@plazarealsilao.com</a>
                    </p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 Plaza Real Silao. Todos los derechos reservados.</p>
                <div class="footer-links">
                    <a href="/privacidad">Privacidad</a>
                    <a href="/terminos">Términos</a>
                    <a href="/sitemap.xml">Mapa del Sitio</a>
                </div>
            </div>
        </div>
    `;

    // Function to inject navigation
    function injectNavigation() {
        const header = document.getElementById('header');
        if (header && !header.querySelector('.navbar')) {
            header.innerHTML = navigationHTML;
            setActiveNavLink();
            initMobileMenu();
        }
    }

    // Function to inject footer
    function injectFooter() {
        const footer = document.querySelector('.footer');
        if (footer && !footer.querySelector('.container')) {
            footer.innerHTML = footerHTML;
        }
    }

    // Set active navigation link based on current page
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPath = link.getAttribute('href');
            
            if (linkPath === currentPath || 
                (linkPath === '/' && currentPath === '/index.html') ||
                (linkPath !== '/' && currentPath.startsWith(linkPath.replace(/\/$/, '')))) {
                link.classList.add('active');
            }
        });
    }

    // Initialize mobile menu functionality
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.nav-wrapper')) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu when clicking on a link (only for mobile)
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    // Don't prevent default - let the link work normally
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }

    // Back to Top Button functionality
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Set active navigation based on current page
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to matching link
            if (currentPath === linkPath || 
                (currentPath.includes('/tiendas/') && linkPath.includes('/tiendas/')) ||
                (currentPath.includes('/espacios/') && linkPath.includes('/espacios/')) ||
                (currentPath.includes('/eventos/') && linkPath.includes('/eventos/')) ||
                (currentPath.includes('/faq/') && linkPath.includes('/faq/'))) {
                link.classList.add('active');
            }
            
            // Special case for home page
            if ((currentPath === '/Silao/' || currentPath === '/Silao/index.html') && 
                (linkPath === '/Silao/' || linkPath === '/Silao/index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Initialize components when DOM is ready
    function initComponents() {
        injectNavigation();
        injectFooter();
        initBackToTop();
        
        // Set active navigation after injecting
        setTimeout(setActiveNavigation, 100);
    }

    // Export for use in other scripts
    window.PlazaRealComponents = {
        init: initComponents,
        injectNavigation: injectNavigation,
        injectFooter: injectFooter
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }
})();