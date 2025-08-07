// Stores Page JavaScript
(function() {
    'use strict';

    let allStores = [];
    let filteredStores = [];

    // Load stores data
    async function loadStores() {
        try {
            const response = await fetch('/Silao/data/stores.json');
            const data = await response.json();
            allStores = data.stores;
            filteredStores = [...allStores];
            renderStores();
            initializeFilters();
            initializeSearch();
        } catch (error) {
            console.error('Error loading stores:', error);
            document.getElementById('storesGrid').innerHTML = 
                '<p class="error-message">Error al cargar las tiendas. Por favor, intenta más tarde.</p>';
        }
    }

    // Render stores to the grid
    function renderStores() {
        const grid = document.getElementById('storesGrid');
        
        if (filteredStores.length === 0) {
            grid.innerHTML = '<p class="no-results">No se encontraron tiendas que coincidan con tu búsqueda.</p>';
            return;
        }

        grid.innerHTML = filteredStores.map(store => `
            <div class="store-card" data-category="${store.category}">
                <a href="/Silao/tiendas/detalle.html?id=${store.id}" class="store-card-link">
                    <div class="store-image">
                        <div class="store-placeholder" style="background: ${store.gradient};">
                            <span class="store-initial">${store.name.charAt(0)}</span>
                        </div>
                    </div>
                    <div class="store-info">
                        <h3>${store.name}</h3>
                        <p>${store.shortDescription}</p>
                        <span class="store-location">${store.location}</span>
                        <span class="store-category-tag">${store.categoryName}</span>
                    </div>
                    <div class="store-card-footer">
                        <span class="view-details">Ver Detalles <i class="fas fa-arrow-right"></i></span>
                    </div>
                </a>
            </div>
        `).join('');

        // Add animation
        const cards = grid.querySelectorAll('.store-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50);
        });
    }

    // Initialize category filters
    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.category-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter stores
                const category = this.dataset.category;
                if (category === 'all') {
                    filteredStores = [...allStores];
                } else {
                    filteredStores = allStores.filter(store => store.category === category);
                }
                
                // Clear search if filtering
                document.getElementById('storeSearch').value = '';
                
                renderStores();
            });
        });
    }

    // Initialize search functionality
    function initializeSearch() {
        const searchInput = document.getElementById('storeSearch');
        
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                // Reset to current filter
                const activeFilter = document.querySelector('.category-btn.active');
                const category = activeFilter.dataset.category;
                
                if (category === 'all') {
                    filteredStores = [...allStores];
                } else {
                    filteredStores = allStores.filter(store => store.category === category);
                }
            } else {
                // Search in all stores
                filteredStores = allStores.filter(store => 
                    store.name.toLowerCase().includes(searchTerm) ||
                    store.shortDescription.toLowerCase().includes(searchTerm) ||
                    store.categoryName.toLowerCase().includes(searchTerm)
                );
            }
            
            renderStores();
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStores);
    } else {
        loadStores();
    }
})();