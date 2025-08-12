// Smart Image Loading System - Handles all image loading scenarios
(function() {
    'use strict';

    // Track loaded images to avoid repeated attempts
    const imageCache = new Map();
    const failedImages = new Set();

    // Test if an image URL exists
    function testImageUrl(url) {
        return new Promise((resolve) => {
            if (imageCache.has(url)) {
                resolve(imageCache.get(url));
                return;
            }

            const img = new Image();
            img.onload = () => {
                imageCache.set(url, true);
                resolve(true);
            };
            img.onerror = () => {
                imageCache.set(url, false);
                resolve(false);
            };
            img.src = url;
        });
    }

    // Generate all possible variations of an image path
    function getImageVariations(originalPath) {
        if (!originalPath) return [];

        const variations = [];
        const basePath = originalPath.substring(0, originalPath.lastIndexOf('.'));
        const extension = originalPath.substring(originalPath.lastIndexOf('.'));
        
        // Original path
        variations.push(originalPath);
        
        // WebP version
        variations.push(basePath + '.webp');
        
        // JPG/JPEG versions
        variations.push(basePath + '.jpg');
        variations.push(basePath + '.jpeg');
        
        // PNG version
        variations.push(basePath + '.png');
        
        // Handle case variations for the filename
        const pathParts = originalPath.split('/');
        const filename = pathParts[pathParts.length - 1];
        const directory = pathParts.slice(0, -1).join('/');
        
        if (filename) {
            // Try with different cases
            const fileBase = filename.substring(0, filename.lastIndexOf('.'));
            const fileExt = filename.substring(filename.lastIndexOf('.'));
            
            // Lowercase version
            variations.push(`${directory}/${fileBase.toLowerCase()}${fileExt}`);
            variations.push(`${directory}/${fileBase.toLowerCase()}.webp`);
            
            // Capitalize first letter
            const capitalized = fileBase.charAt(0).toUpperCase() + fileBase.slice(1).toLowerCase();
            variations.push(`${directory}/${capitalized}${fileExt}`);
            variations.push(`${directory}/${capitalized}.webp`);
            
            // All uppercase
            variations.push(`${directory}/${fileBase.toUpperCase()}${fileExt}`);
            variations.push(`${directory}/${fileBase.toUpperCase()}.webp`);
        }
        
        // Remove duplicates
        return [...new Set(variations)];
    }

    // Load image with smart fallback
    async function loadImageWithFallback(img, originalSrc, storeName) {
        // Skip if already failed
        if (failedImages.has(originalSrc)) {
            showPlaceholder(img, storeName);
            return;
        }

        const variations = getImageVariations(originalSrc);
        
        // Try each variation
        for (const url of variations) {
            const exists = await testImageUrl(url);
            if (exists) {
                img.src = url;
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.3s ease-in-out';
                    img.style.opacity = '1';
                };
                return;
            }
        }
        
        // All variations failed
        failedImages.add(originalSrc);
        showPlaceholder(img, storeName);
    }

    // Show placeholder when image fails
    function showPlaceholder(img, storeName) {
        const parent = img.parentElement;
        if (!parent) return;

        img.style.display = 'none';
        
        // Check if placeholder already exists
        if (parent.querySelector('.smart-placeholder')) return;

        const placeholder = document.createElement('div');
        placeholder.className = 'smart-placeholder';
        
        // Extract initials or use first letter
        const initial = storeName ? storeName.charAt(0).toUpperCase() : '?';
        
        // Create gradient based on the initial
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        ];
        
        const gradientIndex = initial.charCodeAt(0) % gradients.length;
        
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            min-height: 200px;
            background: ${gradients[gradientIndex]};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
            font-weight: bold;
            border-radius: 8px;
            position: relative;
        `;
        
        placeholder.innerHTML = `
            <span style="text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${initial}</span>
        `;
        
        parent.appendChild(placeholder);
    }

    // Process all images on the page
    async function processAllImages() {
        const images = document.querySelectorAll('img');
        
        for (const img of images) {
            // Skip if already processed
            if (img.dataset.smartProcessed === 'true') continue;
            
            const src = img.src || img.dataset.src;
            if (!src || src.includes('data:') || src.includes('blob:')) continue;
            
            // Mark as processed
            img.dataset.smartProcessed = 'true';
            
            // Get store name from alt text or nearby text
            const storeName = img.alt || 
                             img.closest('.store-card')?.querySelector('h3')?.textContent ||
                             img.closest('.preview-card')?.querySelector('h3')?.textContent ||
                             '';
            
            // Ensure lazy loading
            if (!img.loading) img.loading = 'lazy';
            if (!img.decoding) img.decoding = 'async';
            
            // Add error handler
            img.onerror = async function() {
                this.onerror = null; // Prevent infinite loop
                await loadImageWithFallback(this, src, storeName);
            };
            
            // If image is already showing error, process it
            if (!img.complete || img.naturalHeight === 0) {
                await loadImageWithFallback(img, src, storeName);
            }
        }
    }

    // Preload critical images
    function preloadCriticalImages() {
        const criticalPaths = [
            '/images/mapa-tiendas-silao.webp',
            '/images/stores/elektra.webp',
            '/images/stores/tiendas-del-sol.webp',
            '/images/stores/fix.webp',
            '/images/stores/zorro.webp',
            '/images/stores/Comex.webp',
            '/images/stores/infonavit.webp',
            '/images/stores/natura.webp'
        ];
        
        criticalPaths.forEach(async (path) => {
            const variations = getImageVariations(path);
            for (const url of variations) {
                const exists = await testImageUrl(url);
                if (exists) {
                    // Preload the working version
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'image';
                    link.href = url;
                    if (!document.querySelector(`link[href="${url}"]`)) {
                        document.head.appendChild(link);
                    }
                    break;
                }
            }
        });
    }

    // Monitor for new images
    function observeNewImages() {
        const observer = new MutationObserver(() => {
            processAllImages();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Add CSS for placeholders
    function addStyles() {
        if (document.getElementById('smart-image-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'smart-image-styles';
        style.textContent = `
            .smart-placeholder {
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { opacity: 1; }
                50% { opacity: 0.8; }
                100% { opacity: 1; }
            }
            
            .store-image, .preview-image {
                position: relative;
                overflow: hidden;
                background: #f3f4f6;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    async function init() {
        addStyles();
        preloadCriticalImages();
        await processAllImages();
        observeNewImages();
        
        // Reprocess after content loads
        setTimeout(() => processAllImages(), 1000);
        
        // Final check when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => processAllImages(), 500);
        });
    }

    // Export for debugging
    window.SmartImageLoader = {
        processAllImages,
        getImageVariations,
        testImageUrl,
        imageCache,
        failedImages
    };

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();