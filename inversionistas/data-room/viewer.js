// Plaza Real Silao — Data Room viewer (view-only, watermarked)
(function () {
    'use strict';
    const PDFJS = window.pdfjsLib;
    if (!PDFJS) { console.error('pdf.js not loaded'); return; }
    PDFJS.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.js';

    const BASE = '/inversionistas/data-room/';
    let viewerLabel = 'acceso autorizado';

    function getCookie(name) {
        const m = (document.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
        return m ? decodeURIComponent(m.slice(name.length + 1)) : '';
    }

    // Identity for the watermark: self-reported name from the password gate
    // (cookie dr_who), then Cloudflare Access identity, then a generic label.
    async function getViewer() {
        const who = getCookie('dr_who');
        if (who) return who;
        try {
            const r = await fetch('/cdn-cgi/access/get-identity', { cache: 'no-store' });
            if (r.ok) { const j = await r.json(); return j.email || j.name || viewerLabel; }
        } catch (e) { /* not behind Access (e.g. local) */ }
        return viewerLabel;
    }

    // Tiled diagonal watermark baked into the canvas pixels (not removable via DOM).
    function stamp(ctx, w, h, label) {
        const text = `${label} · ${new Date().toISOString().slice(0, 10)}`;
        ctx.save();
        ctx.globalAlpha = 0.11;
        ctx.fillStyle = '#33200F';
        ctx.font = `${Math.round(w / 40)}px Inter, Arial, sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.translate(w / 2, h / 2); ctx.rotate(-Math.PI / 7); ctx.translate(-w / 2, -h / 2);
        const stepX = w / 2, stepY = h / 7;
        for (let y = -h; y < h * 2; y += stepY)
            for (let x = -w; x < w * 2; x += stepX)
                ctx.fillText(text, x, y);
        ctx.restore();
    }

    async function renderDoc(doc) {
        const pages = document.getElementById('pages');
        const empty = document.getElementById('viewerEmpty');
        if (empty) empty.hidden = true;
        pages.hidden = false;
        pages.innerHTML = '<p class="dr-loading">Cargando documento…</p>';
        try {
            const pdf = await PDFJS.getDocument(BASE + doc.file).promise;
            pages.innerHTML = '';
            const containerW = pages.clientWidth || 820;
            for (let n = 1; n <= pdf.numPages; n++) {
                const page = await pdf.getPage(n);
                const unscaled = page.getViewport({ scale: 1 });
                const scale = Math.min(2, containerW / unscaled.width) * 1.4;
                const vp = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.className = 'dr-page';
                canvas.width = Math.floor(vp.width);
                canvas.height = Math.floor(vp.height);
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport: vp }).promise;
                stamp(ctx, canvas.width, canvas.height, viewerLabel);
                pages.appendChild(canvas);
            }
        } catch (err) {
            console.error('Data room render error:', err);
            pages.innerHTML = '<p class="dr-loading">No se pudo cargar el documento.</p>';
        }
    }

    function renderList(docs) {
        const list = document.getElementById('docList');
        if (!docs.length) { list.innerHTML = '<li class="dr-loading">No hay documentos disponibles todavía.</li>'; return; }
        list.innerHTML = docs.map((d, i) => `
            <li><button class="dr-doc" data-i="${i}">
                <svg class="ico" aria-hidden="true"><use href="/images/icons/sprite.svg#file"></use></svg>
                <span class="dr-doc-text"><span class="dr-doc-t">${d.title}</span><span class="dr-doc-d">${d.desc || ''}</span></span>
            </button></li>`).join('');
        list.querySelectorAll('.dr-doc').forEach(btn => btn.addEventListener('click', () => {
            list.querySelectorAll('.dr-doc').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDoc(docs[+btn.dataset.i]);
        }));
    }

    (async function init() {
        viewerLabel = await getViewer();
        const idEl = document.getElementById('viewerId');
        if (idEl) idEl.textContent = viewerLabel;

        // View-only hardening (deterrent, not absolute — see confidential note).
        document.addEventListener('contextmenu', e => e.preventDefault());
        document.addEventListener('keydown', e => {
            const k = (e.key || '').toLowerCase();
            if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p')) e.preventDefault();
        });

        try {
            const res = await fetch(BASE + 'documents.json', { cache: 'no-store' });
            const data = await res.json();
            renderList(data.documents || []);
            document.querySelector('.dr-doc')?.click(); // auto-open first
        } catch (e) {
            document.getElementById('docList').innerHTML = '<li class="dr-loading">No hay documentos disponibles todavía.</li>';
        }
    })();
})();
