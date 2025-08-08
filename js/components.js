/**
 * Plaza Real Silao - Shared Components
 * Version: 1.0
 * Description: Reusable navigation and footer components for all pages
 */

(function() {
    'use strict';
    
    // Detect if running on GitHub Pages or locally
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/Silao' : '';

    // Shared Navigation HTML
    const navigationHTML = `
        <nav class="navbar" role="navigation" aria-label="Navegación principal">
            <div class="container">
                <div class="nav-wrapper">
                    <!-- Logo -->
                    <div class="logo">
                        <a href="${basePath}/" aria-label="Plaza Real Silao - Inicio">
                            <img src="${basePath}/images/logo-silao.webp" alt="Plaza Real Silao" class="logo-img">
                            <div class="logo-text-wrapper">
                                <span class="logo-text">Plaza Real</span>
                                <span class="logo-accent">Silao</span>
                            </div>
                        </a>
                    </div>
                    
                    <!-- Desktop Navigation -->
                    <ul class="nav-menu" id="navMenu">
                        <li><a href="${basePath}/" class="nav-link" data-page="home">Inicio</a></li>
                        <li><a href="${basePath}/tiendas/" class="nav-link" data-page="tiendas">Tiendas</a></li>
                        <li><a href="${basePath}/espacios/" class="nav-link" data-page="espacios">Espacios Disponibles</a></li>
                        <!-- <li><a href="${basePath}/eventos/" class="nav-link" data-page="eventos">Eventos</a></li> -->
                        <li><a href="${basePath}/faq/" class="nav-link" data-page="faq">FAQ</a></li>
                        <li><a href="${basePath}/#contact" class="nav-link">Visítanos</a></li>
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
        
        <!-- Mobile Sidebar -->
        <div class="mobile-sidebar" id="mobileSidebar">
            <div class="mobile-sidebar-header">
                <div class="mobile-sidebar-logo">
                    <img src="${basePath}/images/logo-silao.webp" alt="Plaza Real Silao">
                    <span>Plaza Real Silao</span>
                </div>
                <button class="mobile-sidebar-close" id="mobileSidebarClose" aria-label="Cerrar menú">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="mobile-sidebar-nav">
                <a href="${basePath}/" class="mobile-nav-link">
                    <i class="fas fa-home"></i>
                    <span>Inicio</span>
                </a>
                <a href="${basePath}/tiendas/" class="mobile-nav-link">
                    <i class="fas fa-store"></i>
                    <span>Tiendas</span>
                </a>
                <a href="${basePath}/espacios/" class="mobile-nav-link">
                    <i class="fas fa-building"></i>
                    <span>Espacios Disponibles</span>
                </a>
                <a href="${basePath}/faq/" class="mobile-nav-link">
                    <i class="fas fa-question-circle"></i>
                    <span>Preguntas Frecuentes</span>
                </a>
                <a href="${basePath}/#contact" class="mobile-nav-link">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Visítanos</span>
                </a>
            </nav>
            <div class="mobile-sidebar-footer">
                <div class="mobile-contact-info">
                    <a href="tel:+5578789795" class="mobile-contact-link">
                        <i class="fas fa-phone"></i>
                        <span>(55) 7878-9795</span>
                    </a>
                    <a href="mailto:contacto@plazarealsilao.com" class="mobile-contact-link">
                        <i class="fas fa-envelope"></i>
                        <span>Contacto</span>
                    </a>
                </div>
                <div class="mobile-social-links">
                    <a href="https://facebook.com/plazarealsilao" target="_blank" rel="noopener">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="https://instagram.com/plazarealsilao" target="_blank" rel="noopener">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="https://wa.me/5578789795" target="_blank" rel="noopener">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
        
        <!-- Mobile Sidebar Overlay -->
        <div class="mobile-sidebar-overlay" id="mobileSidebarOverlay"></div>
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
                        <li><a href="${basePath}/">Inicio</a></li>
                        <li><a href="${basePath}/tiendas/">Tiendas</a></li>
                        <li><a href="${basePath}/espacios/">Espacios Disponibles</a></li>
                        <li><a href="${basePath}/eventos/">Eventos</a></li>
                        <li><a href="${basePath}/faq/">Preguntas Frecuentes</a></li>
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
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileSidebarClose = document.getElementById('mobileSidebarClose');
        const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        if (mobileToggle && mobileSidebar) {
            // Open sidebar
            mobileToggle.addEventListener('click', function() {
                openMobileSidebar();
            });
            
            // Close sidebar with close button
            if (mobileSidebarClose) {
                mobileSidebarClose.addEventListener('click', function() {
                    closeMobileSidebar();
                });
            }
            
            // Close sidebar with overlay click
            if (mobileSidebarOverlay) {
                mobileSidebarOverlay.addEventListener('click', function() {
                    closeMobileSidebar();
                });
            }
            
            // Close sidebar when clicking a nav link
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileSidebar();
                });
            });
        }
        
        // Helper functions
        function openMobileSidebar() {
            mobileSidebar.classList.add('active');
            mobileSidebarOverlay.classList.add('active');
            document.body.classList.add('menu-open');
            mobileToggle.classList.add('active');
        }
        
        function closeMobileSidebar() {
            mobileSidebar.classList.remove('active');
            mobileSidebarOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileToggle.classList.remove('active');
        }
        
        // Close sidebar on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
                closeMobileSidebar();
            }
        });
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