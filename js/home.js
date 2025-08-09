// Home Page JavaScript
(function() {
    'use strict';

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
            const response = await fetch('/data/stores.json');
            const data = await response.json();
            
            // Select featured stores (first 6 or specific IDs)
            const featuredStores = data.stores.slice(0, 6);
            
            const previewGrid = document.getElementById('storePreview');
            if (!previewGrid) return;
            
            previewGrid.innerHTML = featuredStores.map(store => `
                <div class="preview-card">
                    <a href="/tiendas/detalle.html?id=${store.id}" class="preview-card-link">
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

    // Smooth scroll for contact link
    function initializeSmoothScroll() {
        const contactLink = document.querySelector('a[href="#contact"]');
        if (contactLink) {
            contactLink.addEventListener('click', function(e) {
                e.preventDefault();
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    // Initialize hero animations
    function initializeHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.classList.add('animate-in');
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            loadStorePreview();
            initializeSmoothScroll();
            initializeHeroAnimations();
        });
    } else {
        loadStorePreview();
        initializeSmoothScroll();
        initializeHeroAnimations();
    }
})();