// Plaza Real Silao — Stores directory
(function () {
    'use strict';

    let allStores = [];
    let filteredStores = [];

    const CATEGORY_ICON = {
        retail: 'bag', services: 'bell', food: 'utensils', health: 'heart',
        education: 'cap', finance: 'landmark', telecom: 'signal',
        government: 'landmark', beauty: 'sparkles'
    };
    const icon = c => CATEGORY_ICON[c] || 'store';

    async function loadStores() {
        const grid = document.getElementById('storesGrid');
        try {
            const res = await fetch('/data/stores.json');
            const data = await res.json();
            // Coming-soon first so new anchors lead the directory.
            allStores = (data.stores || []).slice().sort((a, b) =>
                (b.status === 'coming-soon') - (a.status === 'coming-soon'));
            filteredStores = [...allStores];
            renderStores();
            initFilters();
            initSearch();
        } catch (err) {
            console.error('Error loading stores:', err);
            if (grid) grid.innerHTML = '<p class="no-results">No se pudieron cargar las tiendas. Intenta más tarde.</p>';
        }
    }

    function storeCard(store) {
        const coming = store.status === 'coming-soon';
        const badge = coming
            ? `<span class="badge badge--amber store-flag">Próximamente</span>`
            : '';
        const media = `
            <div class="store-card-media">
                ${badge}
                <img src="${store.image}" alt="${store.name}" width="400" height="300" loading="lazy"
                     onerror="this.style.display='none';this.parentElement.classList.add('no-img');this.parentElement.dataset.initial='${store.name.charAt(0)}'">
            </div>`;
        const body = `
            <div class="store-card-body">
                <span class="badge"><svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#${icon(store.category)}"></use></svg>${store.categoryName}</span>
                <h3>${store.name}</h3>
                <p>${store.shortDescription || ''}</p>
            </div>`;
        if (coming) {
            return `<div class="store-card card coming" data-category="${store.category}">${media}${body}</div>`;
        }
        return `<a class="store-card card" data-category="${store.category}" href="/tiendas/detalle.html?id=${store.id}">${media}${body}
            <span class="store-card-foot">Ver detalles <svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#arrow-right"></use></svg></span></a>`;
    }

    function renderStores() {
        const grid = document.getElementById('storesGrid');
        if (!grid) return;
        if (!filteredStores.length) {
            grid.innerHTML = '<p class="no-results">No se encontraron tiendas que coincidan con tu búsqueda.</p>';
            return;
        }
        grid.innerHTML = filteredStores.map(storeCard).join('');
    }

    function applyCategory(category) {
        filteredStores = category === 'all' ? [...allStores] : allStores.filter(s => s.category === category);
    }

    function initFilters() {
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => btn.addEventListener('click', function () {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const search = document.getElementById('storeSearch');
            if (search) search.value = '';
            applyCategory(this.dataset.category);
            renderStores();
        }));
    }

    function initSearch() {
        const input = document.getElementById('storeSearch');
        if (!input) return;
        input.addEventListener('input', function () {
            const term = this.value.toLowerCase().trim();
            if (!term) {
                const active = document.querySelector('.category-btn.active');
                applyCategory(active ? active.dataset.category : 'all');
            } else {
                filteredStores = allStores.filter(s =>
                    s.name.toLowerCase().includes(term) ||
                    (s.shortDescription || '').toLowerCase().includes(term) ||
                    s.categoryName.toLowerCase().includes(term));
            }
            renderStores();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadStores);
    } else { loadStores(); }
})();
