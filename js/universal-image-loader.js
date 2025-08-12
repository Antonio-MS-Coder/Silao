// Universal Image Loading System with Multiple Fallbacks
(function() {
    'use strict';

    // Configuration
    const IMAGE_FORMATS = {
        webp: '.webp',
        jpg: '.jpg',
        jpeg: '.jpeg',
        png: '.png'
    };

    // Map of known image conversions
    const IMAGE_MAPPINGS = {
        // Plaza images (now optimized as JPG)
        '/images/plaza/acceso.png': '/images/plaza/acceso.jpg',
        '/images/plaza/local-comercial.png': '/images/plaza/local-comercial.jpg',
        '/images/plaza/plaza-exterior.png': '/images/plaza/plaza-exterior.jpg',
        '/images/plaza/plaza-main.png': '/images/plaza/plaza-main.jpg',
        
        // Store images that should use WebP
        '/images/stores/tiendas-del-sol.jpg': '/images/stores/tiendas-del-sol.webp',
        '/images/stores/elektra.png': '/images/stores/elektra.webp',
        '/images/stores/fix.png': '/images/stores/fix.webp',
        '/images/stores/zorro.png': '/images/stores/zorro.webp',
        '/images/stores/Chevrolet.png': '/images/stores/Chevrolet.webp',
        '/images/stores/telcel.png': '/images/stores/telcel.webp',
        '/images/stores/infonavit.png': '/images/stores/infonavit.webp',
        '/images/stores/natura.png': '/images/stores/natura.webp',
        '/images/stores/Comex.png': '/images/stores/Comex.webp',
        '/images/stores/att.png': '/images/stores/att.webp',
        '/images/stores/abogados.png': '/images/stores/abogados.webp',
        '/images/stores/acceso.png': '/images/stores/acceso.webp',
        '/images/stores/doll.png': '/images/stores/doll.webp',
        '/images/stores/Gobierno.png': '/images/stores/Gobierno.webp',
        '/images/stores/Optica.png': '/images/stores/Optica.webp',
        '/images/stores/Zapateria.png': '/images/stores/Zapateria.webp',
        '/images/stores/Escuela_Peluqueria.png': '/images/stores/Escuela_Peluqueria.webp',
        '/images/stores/Homemoda.png': '/images/stores/Homemoda.webp',
        '/images/stores/Comida_China.png': '/images/stores/Comida_China.webp',
        '/images/stores/Restaurante.png': '/images/stores/Restaurante.webp'
    };

    // Create optimized image element with fallback chain
    function createOptimizedImage(originalSrc, alt, className) {
        const img = document.createElement('img');
        img.alt = alt || '';
        if (className) img.className = className;
        
        // Get the best available source
        const optimizedSrc = IMAGE_MAPPINGS[originalSrc] || originalSrc;
        
        // Try to load optimized version first
        img.src = optimizedSrc;
        img.loading = 'lazy';
        img.decoding = 'async';
        
        // Fallback chain
        img.onerror = function() {
            // Try original source
            if (this.src !== originalSrc) {
                this.src = originalSrc;
                return;
            }
            
            // Try alternative formats
            const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('.'));
            const formats = ['.webp', '.jpg', '.jpeg', '.png'];
            let formatIndex = 0;
            
            const tryNextFormat = () => {
                if (formatIndex < formats.length) {
                    const newSrc = basePath + formats[formatIndex];
                    formatIndex++;
                    
                    // Check if file exists
                    const testImg = new Image();
                    testImg.onload = () => {
                        this.src = newSrc;
                    };
                    testImg.onerror = tryNextFormat;
                    testImg.src = newSrc;
                } else {
                    // All formats failed - show placeholder
                    this.onerror = null;
                    this.style.display = 'none';
                    
                    // Create placeholder
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder';
                    placeholder.style.cssText = `
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 3rem;
                        font-weight: bold;
                        border-radius: 8px;
                    `;
                    placeholder.textContent = alt ? alt.charAt(0).toUpperCase() : '?';
                    this.parentElement.appendChild(placeholder);
                }
            };
            
            tryNextFormat();
        };
        
        return img;
    }

    // Process all images on the page
    function processAllImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Skip if already processed
            if (img.dataset.processed === 'true') return;
            
            const src = img.src || img.dataset.src;
            if (!src) return;
            
            // Check if we have an optimized version
            if (IMAGE_MAPPINGS[src]) {
                img.src = IMAGE_MAPPINGS[src];
                
                // Add fallback
                const originalSrc = src;
                img.onerror = function() {
                    if (this.src !== originalSrc) {
                        this.src = originalSrc;
                    }
                };
            }
            
            // Ensure lazy loading
            if (!img.loading) {
                img.loading = 'lazy';
            }
            if (!img.decoding) {
                img.decoding = 'async';
            }
            
            img.dataset.processed = 'true';
        });
    }

    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = [
            '/images/mapa-tiendas-silao.webp',
            '/images/stores/elektra.webp',
            '/images/stores/tiendas-del-sol.webp',
            '/images/stores/fix.webp',
            '/images/stores/zorro.webp'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            link.type = 'image/webp';
            
            if (!document.querySelector(`link[href="${src}"]`)) {
                document.head.appendChild(link);
            }
            
            // Also preload in memory
            const img = new Image();
            img.src = src;
        });
    }

    // Monitor for dynamically added images
    function observeNewImages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG') {
                            processAllImages();
                        } else if (node.querySelectorAll) {
                            const images = node.querySelectorAll('img');
                            if (images.length > 0) {
                                processAllImages();
                            }
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Export for global use
    window.ImageOptimizer = {
        createOptimizedImage,
        processAllImages,
        preloadCriticalImages
    };

    // Initialize
    function init() {
        preloadCriticalImages();
        processAllImages();
        observeNewImages();
        
        // Process again after a short delay to catch any late-loading content
        setTimeout(processAllImages, 1000);
        
        // And once more when everything is loaded
        window.addEventListener('load', processAllImages);
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();