// Plaza Real Silao — Home page
(function () {
    'use strict';

    const CATEGORY_ICON = {
        retail: 'bag', services: 'bell', food: 'utensils', health: 'heart',
        education: 'cap', finance: 'landmark', telecom: 'signal',
        government: 'landmark', beauty: 'sparkles'
    };
    const icon = c => CATEGORY_ICON[c] || 'store';

    async function loadStorePreview() {
        const grid = document.getElementById('storePreview');
        if (!grid) return;
        try {
            const res = await fetch('/data/stores.json');
            const data = await res.json();
            const featured = (data.stores || []).filter(s => s.status !== 'coming-soon').slice(0, 6);

            grid.innerHTML = featured.map(store => `
                <a class="store-card card" href="/tiendas/detalle.html?id=${store.id}">
                    <div class="store-card-media">
                        <img src="${store.image}" alt="${store.name}" width="400" height="300" loading="lazy"
                             onerror="this.style.display='none';this.parentElement.classList.add('no-img');this.parentElement.dataset.initial='${store.name.charAt(0)}'">
                    </div>
                    <div class="store-card-body">
                        <span class="badge"><svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#${icon(store.category)}"></use></svg>${store.categoryName}</span>
                        <h3>${store.name}</h3>
                        <p>${store.shortDescription || ''}</p>
                    </div>
                </a>
            `).join('');
        } catch (err) {
            console.error('Error loading store preview:', err);
            grid.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No se pudieron cargar las tiendas. <a href="/tiendas/">Ver el directorio</a>.</p>';
        }
    }

    function initAvisame() {
        document.querySelectorAll('.avisame-form').forEach(form => {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();
                const brand = form.dataset.brand || '';
                const btn = form.querySelector('button');
                if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
                try {
                    await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                    if (typeof gtag !== 'undefined') gtag('event', 'lead', { event_category: 'avisame', event_label: brand });
                } catch (_) { /* still show success — submission queued */ }
                form.outerHTML = `<div class="avisame-done"><svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#check"></use></svg>¡Listo! Te avisaremos cuando abra${brand ? ' ' + brand : ''}.</div>`;
            });
        });
    }

    // Próximamente: temporary announcement. Closeable, but reappears on a new
    // visit (sessionStorage, not localStorage) — never feels like a permanent section.
    function initProxAnnounce() {
        const sec = document.getElementById('proximamente');
        if (!sec) return;
        const open = () => { sec.hidden = false; try { sessionStorage.removeItem('pr_prox_closed'); } catch (e) {} };
        let closedThisSession = false;
        try { closedThisSession = sessionStorage.getItem('pr_prox_closed') === '1'; } catch (e) {}
        if (!closedThisSession) sec.hidden = false;

        const close = document.getElementById('proxClose');
        close && close.addEventListener('click', () => {
            sec.hidden = true;
            try { sessionStorage.setItem('pr_prox_closed', '1'); } catch (e) {}
        });

        // Any "Avísame" / #proximamente link (incl. the top banner) re-opens the
        // announcement even if it was closed. Capture phase so it runs before the
        // smooth-scroll handler, which then scrolls to the now-visible section.
        document.addEventListener('click', e => {
            if (e.target.closest('a[href*="#proximamente"]')) open();
        }, true);

        // Arriving from another page via the banner (e.g. /tiendas → /#proximamente)
        if (location.hash === '#proximamente') {
            open();
            setTimeout(() => {
                const h = document.querySelector('.navbar')?.offsetHeight || 72;
                const y = sec.getBoundingClientRect().top + window.scrollY - h - 8;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 150);
        }
    }

    function init() { loadStorePreview(); initAvisame(); initProxAnnounce(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
