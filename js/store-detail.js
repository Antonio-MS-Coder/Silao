// Store Detail Page JavaScript
(function() {
    'use strict';

    let currentStore = null;
    let allStores = [];

    // Get store ID from URL
    function getStoreId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // Load store data
    async function loadStoreData() {
        try {
            const response = await fetch('/Silao/data/stores.json');
            const data = await response.json();
            allStores = data.stores;
            
            const storeId = getStoreId();
            
            if (!storeId) {
                showError('No se especificó ninguna tienda');
                return;
            }
            
            currentStore = allStores.find(store => store.id === storeId);
            
            if (!currentStore) {
                showError('Tienda no encontrada');
                return;
            }
            
            displayStoreDetails();
            loadRelatedStores();
        } catch (error) {
            console.error('Error loading store data:', error);
            showError('Error al cargar la información de la tienda');
        }
    }

    // Display store details
    function displayStoreDetails() {
        // Update page title and meta
        document.title = `${currentStore.name} | Plaza Real Silao`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = currentStore.description;
        }

        // Update hero section
        const heroSection = document.getElementById('storeHero');
        const heroBg = heroSection.querySelector('.store-hero-bg');
        heroBg.style.background = currentStore.gradient;
        
        // Update breadcrumb
        document.getElementById('breadcrumbStore').textContent = currentStore.name;
        
        // Update store name and category
        document.getElementById('storeName').textContent = currentStore.name;
        document.getElementById('storeCategory').textContent = currentStore.categoryName;
        
        // Update store image
        const storeImage = document.getElementById('storeImage');
        if (currentStore.image && currentStore.image !== '/images/stores/placeholder.jpg') {
            storeImage.src = currentStore.image;
            storeImage.alt = currentStore.name;
        } else {
            // Create a placeholder with gradient
            const imageContainer = document.getElementById('storeMainImage');
            imageContainer.innerHTML = `
                <div class="store-image-placeholder" style="background: ${currentStore.gradient};">
                    <span class="store-initial-large">${currentStore.name.charAt(0)}</span>
                </div>
            `;
        }
        
        // Update store information
        document.getElementById('storeDescription').textContent = currentStore.description;
        document.getElementById('storeLocation').textContent = currentStore.location;
        document.getElementById('storeHours').textContent = currentStore.hours;
        
        // Update contact info
        const phoneElement = document.getElementById('storePhone');
        const emailElement = document.getElementById('storeEmail');
        
        if (currentStore.phone && currentStore.phone !== 'Próximamente') {
            phoneElement.innerHTML = `<a href="tel:${currentStore.phone.replace(/\s/g, '')}">${currentStore.phone}</a>`;
        } else {
            phoneElement.textContent = 'Próximamente';
        }
        
        if (currentStore.email && currentStore.email !== 'Próximamente') {
            emailElement.innerHTML = `<a href="mailto:${currentStore.email}">${currentStore.email}</a>`;
        } else {
            emailElement.textContent = 'Próximamente';
        }
        
        // Update services
        const servicesList = document.getElementById('storeServices');
        servicesList.innerHTML = currentStore.services.map(service => 
            `<li><i class="fas fa-check"></i> ${service}</li>`
        ).join('');
        
        // Update contact button
        const contactBtn = document.getElementById('contactStore');
        if (currentStore.phone && currentStore.phone !== 'Próximamente') {
            contactBtn.href = `tel:${currentStore.phone.replace(/\s/g, '')}`;
        } else if (currentStore.email && currentStore.email !== 'Próximamente') {
            contactBtn.href = `mailto:${currentStore.email}`;
            contactBtn.innerHTML = '<i class="fas fa-envelope"></i> Enviar Email';
        } else {
            contactBtn.style.display = 'none';
        }
    }

    // Load related stores
    function loadRelatedStores() {
        // Get stores from the same category, excluding current store
        const relatedStores = allStores
            .filter(store => 
                store.category === currentStore.category && 
                store.id !== currentStore.id
            )
            .slice(0, 3); // Show max 3 related stores
        
        // If not enough related stores, add random ones
        if (relatedStores.length < 3) {
            const otherStores = allStores
                .filter(store => 
                    store.id !== currentStore.id &&
                    !relatedStores.includes(store)
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 3 - relatedStores.length);
            
            relatedStores.push(...otherStores);
        }
        
        const relatedGrid = document.getElementById('relatedStores');
        
        if (relatedStores.length === 0) {
            relatedGrid.parentElement.style.display = 'none';
            return;
        }
        
        relatedGrid.innerHTML = relatedStores.map(store => `
            <div class="store-card">
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
                    </div>
                </a>
            </div>
        `).join('');
    }

    // Show error message
    function showError(message) {
        const mainContent = document.querySelector('.store-details');
        mainContent.innerHTML = `
            <div class="container">
                <div class="error-container">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Error</h2>
                    <p>${message}</p>
                    <a href="/Silao/tiendas/" class="btn btn-primary">Ver Todas las Tiendas</a>
                </div>
            </div>
        `;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStoreData);
    } else {
        loadStoreData();
    }
})();