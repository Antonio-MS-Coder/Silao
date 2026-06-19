// Plaza Real Silao — Store detail
(function () {
    'use strict';

    let currentStore = null;
    let allStores = [];

    const CATEGORY_ICON = {
        retail: 'bag', services: 'bell', food: 'utensils', health: 'heart',
        education: 'cap', finance: 'landmark', telecom: 'signal',
        government: 'landmark', beauty: 'sparkles'
    };
    const icon = c => CATEGORY_ICON[c] || 'store';
    const useIco = id => `<svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#${id}"></use></svg>`;

    function getStoreId() {
        return new URLSearchParams(window.location.search).get('id');
    }

    async function loadStoreData() {
        try {
            const res = await fetch('/data/stores.json');
            const data = await res.json();
            allStores = data.stores || [];
            const id = getStoreId();
            if (!id) return showError('No se especificó ninguna tienda');
            currentStore = allStores.find(s => s.id === id);
            if (!currentStore) return showError('Tienda no encontrada');
            displayStoreDetails();
            loadRelatedStores();
        } catch (err) {
            console.error('Error loading store data:', err);
            showError('Error al cargar la información de la tienda');
        }
    }

    function displayStoreDetails() {
        const s = currentStore;
        const coming = s.status === 'coming-soon';

        document.title = `${s.name} | Plaza Real Silao`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.content = s.shortDescription || s.description;

        const hero = document.getElementById('storeHero');
        if (s.gradient) hero.style.background = s.gradient;

        document.getElementById('breadcrumbStore').textContent = s.name;
        document.getElementById('storeName').textContent = s.name;
        document.getElementById('storeCategoryBadge').innerHTML = `${useIco(icon(s.category))}${s.categoryName}`;

        // Image
        const media = document.getElementById('storeMainImage');
        const img = document.getElementById('storeImage');
        if (s.image) {
            img.src = s.image; img.alt = s.name;
            if (coming || /\.svg$/.test(s.image)) media.classList.add('logo');
            img.onerror = () => { media.innerHTML = `<span class="media-initial">${s.name.charAt(0)}</span>`; };
        } else {
            media.innerHTML = `<span class="media-initial">${s.name.charAt(0)}</span>`;
        }

        // Coming-soon banner
        const status = document.getElementById('storeStatus');
        status.innerHTML = coming
            ? `<span class="badge badge--amber">Próximamente · Apertura 2026</span>`
            : '';

        document.getElementById('storeDescription').textContent = s.description;
        document.getElementById('storeLocation').textContent = s.location;
        document.getElementById('storeHours').textContent = s.hours;

        const phoneEl = document.getElementById('storePhone');
        const emailEl = document.getElementById('storeEmail');
        if (s.phone && s.phone !== 'Próximamente') {
            phoneEl.innerHTML = `<a href="tel:${s.phone.replace(/\s/g, '')}">${s.phone}</a>`;
        } else { phoneEl.textContent = 'Próximamente'; }
        if (s.email && s.email !== 'Próximamente') {
            emailEl.innerHTML = `<a href="mailto:${s.email}">${s.email}</a>`;
        } else { emailEl.textContent = 'Próximamente'; }

        document.getElementById('servicesTitle').textContent = coming ? 'Lo que encontrarás' : 'Servicios disponibles';
        document.getElementById('storeServices').innerHTML = (s.services || [])
            .map(svc => `<li>${useIco('check')}${svc}</li>`).join('');

        // Primary action
        const btn = document.getElementById('contactStore');
        if (coming) {
            btn.href = '/#proximamente'; btn.innerHTML = `${useIco('bell')} Avísame de la apertura`;
        } else if (s.phone && s.phone !== 'Próximamente') {
            btn.href = `tel:${s.phone.replace(/\s/g, '')}`; btn.innerHTML = `${useIco('phone')} Llamar`;
        } else if (s.email && s.email !== 'Próximamente') {
            btn.href = `mailto:${s.email}`; btn.innerHTML = `${useIco('mail')} Enviar email`;
        } else {
            btn.style.display = 'none';
        }
    }

    function loadRelatedStores() {
        const pool = allStores.filter(s => s.id !== currentStore.id && s.status !== 'coming-soon');
        let related = pool.filter(s => s.category === currentStore.category).slice(0, 3);
        if (related.length < 3) {
            related = related.concat(pool.filter(s => !related.includes(s)).slice(0, 3 - related.length));
        }
        const grid = document.getElementById('relatedStores');
        if (!related.length) { grid.closest('section').style.display = 'none'; return; }
        grid.innerHTML = related.map(s => `
            <a class="store-card card" href="/tiendas/detalle.html?id=${s.id}">
                <div class="store-card-media">
                    <img src="${s.image}" alt="${s.name}" width="400" height="300" loading="lazy"
                         onerror="this.style.display='none';this.parentElement.classList.add('no-img');this.parentElement.dataset.initial='${s.name.charAt(0)}'">
                </div>
                <div class="store-card-body">
                    <span class="badge">${useIco(icon(s.category))}${s.categoryName}</span>
                    <h3>${s.name}</h3>
                    <p>${s.shortDescription || ''}</p>
                </div>
            </a>`).join('');
    }

    function showError(message) {
        const main = document.querySelector('.store-detail .container') || document.getElementById('main');
        main.innerHTML = `<div class="error-container">
            ${useIco('help')}<h2>Ups…</h2><p>${message}</p>
            <a href="/tiendas/" class="btn btn-primary">Ver todas las tiendas</a></div>`;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStoreData);
    } else { loadStoreData(); }
})();
