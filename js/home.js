// Home Page JavaScript - Enhanced with Hero Interactions
(function() {
    'use strict';

    // Hero Slider Functionality
    let currentSlide = 1;
    let slideInterval;
    
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-nav-dots .dot');
        
        if (slides.length === 0) return;
        
        // Auto-slide function
        function nextSlide() {
            slides[currentSlide - 1].classList.remove('active');
            dots[currentSlide - 1].classList.remove('active');
            
            currentSlide = currentSlide % slides.length + 1;
            
            slides[currentSlide - 1].classList.add('active');
            dots[currentSlide - 1].classList.add('active');
        }
        
        // Start auto-sliding
        slideInterval = setInterval(nextSlide, 5000);
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                
                slides[currentSlide - 1].classList.remove('active');
                dots[currentSlide - 1].classList.remove('active');
                
                currentSlide = index + 1;
                
                slides[currentSlide - 1].classList.add('active');
                dots[currentSlide - 1].classList.add('active');
                
                // Restart auto-sliding
                slideInterval = setInterval(nextSlide, 5000);
            });
        });
    }
    
    // Animated Counter for Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const start = 0;
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = start;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                            // Add a "+" for certain stats
                            if (target === 1000) {
                                counter.textContent = target.toLocaleString() + '+';
                            }
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Parallax Effect for Hero Background
    function initParallax() {
        const heroBackground = document.querySelector('.hero-media-slider');
        if (!heroBackground) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const speed = 0.5;
            
            heroBackground.style.transform = `translateY(${scrolled * speed}px)`;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Enhanced Smooth Scroll for Hero CTA
    function initSmoothScroll() {
        const smoothLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Helper function to get category icon
    function getCategoryIcon(category) {
        const icons = {
            'retail': 'fa-shopping-bag',
            'services': 'fa-concierge-bell',
            'food': 'fa-utensils',
            'health': 'fa-heartbeat',
            'education': 'fa-graduation-cap',
            'finance': 'fa-landmark'
        };
        return icons[category] || 'fa-store';
    }

    // Load featured stores for preview
    async function loadStorePreview() {
        try {
            const response = await fetch('/Silao/data/stores.json');
            const data = await response.json();
            
            // Select featured stores (first 6 or specific IDs)
            const featuredStores = data.stores.slice(0, 6);
            
            const previewGrid = document.getElementById('storePreview');
            if (!previewGrid) return;
            
            previewGrid.innerHTML = featuredStores.map(store => `
                <div class="preview-card">
                    <a href="/Silao/tiendas/detalle.html?id=${store.id}" class="preview-card-link">
                        <div class="store-category-badge ${store.category}">
                            <i class="fas ${getCategoryIcon(store.category)}"></i>
                            <span>${store.categoryName}</span>
                        </div>
                        <div class="preview-image">
                            ${store.image ? 
                                `<img src="${store.image}" alt="${store.name}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='<span class=\\'preview-initial\\'>${store.name.charAt(0)}</span>'">` :
                                `<span class="preview-initial">${store.name.charAt(0)}</span>`
                            }
                        </div>
                        <div class="preview-info">
                            <h3>${store.name}</h3>
                            <p>${store.shortDescription}</p>
                        </div>
                    </a>
                </div>
            `).join('');
            
            // Add fade-in animation
            const cards = previewGrid.querySelectorAll('.preview-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
            
        } catch (error) {
            console.error('Error loading store preview:', error);
        }
    }

    // Initialize all hero features
    function initializeHero() {
        initHeroSlider();
        animateCounters();
        initParallax();
        initSmoothScroll();
        
        // Add entrance animations
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animate-in');
        }
        
        // Preload hero images for better performance
        const heroImages = [
            '/Silao/images/hero/shopping-experience.jpg',
            '/Silao/images/hero/family-shopping.jpg',
            '/Silao/images/hero/modern-mall.jpg'
        ];
        
        heroImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeHero();
            loadStorePreview();
        });
    } else {
        initializeHero();
        loadStorePreview();
    }
})();