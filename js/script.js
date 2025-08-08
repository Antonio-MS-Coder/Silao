/**
 * Plaza Real Silao - JavaScript Functionality
 * Version: 1.1
 * Description: Production-ready JavaScript for smooth scrolling,
 * interactive features, PWA support, and enhanced user experience
 */

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Silao/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
                
                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every minute
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =====================================================
    // Global Variables and Constants
    // =====================================================
    const header = document.getElementById('header');
    const navMenu = document.getElementById('navMenu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTop');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const storeCards = document.querySelectorAll('.store-card');
    // Try to find actual form element, not section
    let contactForm = document.getElementById('contactForm');
    // If contactForm is a section, look for form inside it
    if (contactForm && contactForm.tagName !== 'FORM') {
        contactForm = contactForm.querySelector('form');
    }
    const newsletterForm = document.getElementById('newsletterForm');
    
    // Performance metrics
    const perfData = {
        start: performance.now(),
        loadTime: 0
    };
    
    // Throttle function for performance optimization
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =====================================================
    // Header Scroll Effect
    // =====================================================
    const handleScroll = throttle(function() {
        const scrollPosition = window.scrollY;
        
        // Add/remove scrolled class for header styling
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        if (scrollPosition > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // =====================================================
    // Mobile Menu Toggle
    // =====================================================
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            // Toggle menu state
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Update ARIA attributes for accessibility
            mobileMenuToggle.setAttribute('aria-expanded', !isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = !isActive ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a nav link (for hash links or navigation)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Always close mobile menu when any link is clicked
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && mobileMenuToggle) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        }
    });

    // =====================================================
    // Smooth Scrolling for Navigation Links
    // =====================================================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default and do smooth scroll for hash links (same page anchors)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const headerOffset = header.offsetHeight;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For regular links (to other pages), let them navigate normally
            // Don't preventDefault() for these
        });
    });

    // =====================================================
    // Update Active Navigation Link
    // =====================================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // =====================================================
    // Back to Top Button
    // =====================================================
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =====================================================
    // Store Category Filter (Legacy - handled by stores.js on stores page)
    // =====================================================
    // This functionality is now handled by stores.js for the stores page
    // Keeping basic filter functionality for other pages if needed
    if (categoryBtns.length > 0 && !document.querySelector('.stores-page')) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter store cards with animation
                storeCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                        // Trigger reflow for animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // =====================================================
    // Form Handling
    // =====================================================
    
    // Contact Form - only handle if it's actually a form element
    if (contactForm && contactForm.tagName === 'FORM') {
        // Skip handling here - the form should submit normally to FormSubmit
        // The espacios.js file handles the rental inquiry form
        console.log('Contact form found but handled by page-specific script');
    }
    
    // Newsletter Form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Validate email
            if (validateEmail(email)) {
                // Here you would normally send the email to a server
                console.log('Newsletter subscription:', email);
                
                // Show success message
                showFormMessage(newsletterForm, 'success', 'Te has suscrito exitosamente al boletín.');
                
                // Reset form
                newsletterForm.reset();
            } else {
                showFormMessage(newsletterForm, 'error', 'Por favor ingresa un correo electrónico válido.');
            }
        });
    }
    
    // Email validation helper
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Show form message helper
    function showFormMessage(form, type, message) {
        // Remove any existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            animation: fadeInUp 0.3s ease;
        `;
        
        if (type === 'success') {
            messageEl.style.background = '#10b981';
            messageEl.style.color = 'white';
        } else {
            messageEl.style.background = '#ef4444';
            messageEl.style.color = 'white';
        }
        
        // Append message to form
        form.appendChild(messageEl);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageEl.style.animation = 'fadeOutDown 0.3s ease';
            setTimeout(() => {
                messageEl.remove();
            }, 300);
        }, 5000);
    }

    // =====================================================
    // Intersection Observer for Animations
    // =====================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optional: Stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.feature-card, .store-card, .event-card, .showcase-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        @keyframes fadeOutDown {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(10px);
            }
        }
    `;
    document.head.appendChild(style);

    // =====================================================
    // Hero Scroll Indicator
    // =====================================================
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const storesSection = document.getElementById('stores');
            if (storesSection) {
                const headerOffset = header.offsetHeight;
                const elementPosition = storesSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // =====================================================
    // Lazy Loading Images (if needed in the future)
    // =====================================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // =====================================================
    // Performance Monitoring (Updated to use Navigation Timing API v2)
    // =====================================================
    if ('performance' in window && 'PerformanceNavigationTiming' in window) {
        window.addEventListener('load', function() {
            // Use Navigation Timing API v2
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navTiming = perfEntries[0];
                const pageLoadTime = navTiming.loadEventEnd - navTiming.fetchStart;
                console.log('Page load time:', Math.round(pageLoadTime) + 'ms');
                
                // Send performance data to analytics (if implemented)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        'name': 'load',
                        'value': Math.round(pageLoadTime),
                        'event_category': 'Performance'
                    });
                }
            }
        });
    }

    // Service Worker registration moved to top of file to avoid duplication

    // =====================================================
    // Initialize on Load
    // =====================================================
    window.addEventListener('load', function() {
        // Remove loading class if exists
        document.body.classList.remove('loading');
        
        // Initialize AOS or other libraries if needed
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
        
        // Log successful initialization
        console.log('Plaza Real Silao - Website initialized successfully');
    });

    // =====================================================
    // Keyboard Navigation Support
    // =====================================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
            document.body.style.overflow = '';
        }
    });

    // =====================================================
    // Touch Events for Better Mobile Experience
    // =====================================================
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (!navMenu || !mobileMenuToggle) return;
        
        const swipeThreshold = 100;
        const diff = touchStartX - touchEndX;
        
        // Swipe left to open menu
        if (diff < -swipeThreshold && !navMenu.classList.contains('active')) {
            navMenu.classList.add('active');
            mobileMenuToggle.classList.add('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        // Swipe right to close menu
        if (diff > swipeThreshold && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // =====================================================
    // Prevent FOUC (Flash of Unstyled Content)
    // =====================================================
    document.documentElement.style.visibility = 'visible';
});

// =====================================================
// Utility Functions
// =====================================================

/**
 * Debounce function for input events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format phone number for display
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

/**
 * Check if element is in viewport
 * @param {Element} element - DOM element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// =====================================================
// Error Handling
// =====================================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Could send error to logging service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send error to logging service
});