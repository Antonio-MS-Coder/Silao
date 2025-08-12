// Advanced Image Optimization and Progressive Loading
(function() {
    'use strict';

    // Image cache for better performance
    const imageCache = new Map();
    
    // Fallback image patterns
    const FALLBACK_PATTERNS = {
        '.webp': '.png',
        '.png': '.jpg',
        '.jpg': ''
    };
    
    // Critical images that should load immediately
    const CRITICAL_IMAGES = [
        '/images/mapa-tiendas-silao.webp',
        '/images/stores/elektra.webp',
        '/images/stores/tiendas-del-sol.jpg'
    ];
    
    // Advanced image loading with fallback system
    function loadImageWithFallback(imgElement, src, maxRetries = 3) {
        return new Promise((resolve, reject) => {
            let retryCount = 0;
            
            function attemptLoad(currentSrc) {
                // Check cache first
                if (imageCache.has(currentSrc)) {
                    const cachedImg = imageCache.get(currentSrc);
                    if (cachedImg.complete && cachedImg.naturalWidth > 0) {
                        imgElement.src = currentSrc;
                        resolve(currentSrc);
                        return;
                    }
                }
                
                const imageLoader = new Image();
                
                imageLoader.onload = function() {
                    // Cache successful load
                    imageCache.set(currentSrc, this);
                    imgElement.src = currentSrc;
                    imgElement.classList.add('loaded');
                    imgElement.classList.remove('loading', 'error');
                    resolve(currentSrc);
                };
                
                imageLoader.onerror = function() {
                    retryCount++;
                    
                    // Try fallback formats
                    const fallbackSrc = getFallbackSrc(currentSrc);
                    if (fallbackSrc && retryCount <= maxRetries) {
                        console.log(`Image load failed: ${currentSrc}, trying fallback: ${fallbackSrc}`);
                        attemptLoad(fallbackSrc);
                    } else {
                        // All attempts failed, show placeholder
                        showImagePlaceholder(imgElement, src);
                        reject(new Error(`Failed to load image: ${src}`));
                    }
                };
                
                imageLoader.src = currentSrc;
            }
            
            imgElement.classList.add('loading');
            attemptLoad(src);
        });
    }
    
    // Get fallback source for image
    function getFallbackSrc(src) {
        for (const [ext, fallback] of Object.entries(FALLBACK_PATTERNS)) {
            if (src.includes(ext)) {
                return fallback ? src.replace(ext, fallback) : null;
            }
        }
        return null;
    }
    
    // Show placeholder when image fails to load
    function showImagePlaceholder(imgElement, originalSrc) {
        imgElement.classList.add('error');
        imgElement.classList.remove('loading');
        
        // Create placeholder based on context
        const parentCard = imgElement.closest('.store-card');
        if (parentCard) {
            const storeName = parentCard.querySelector('h3')?.textContent || 'Store';
            const storeData = getStoreDataFromName(storeName);
            
            if (storeData?.gradient) {
                // Create a placeholder with gradient and initial
                const placeholder = document.createElement('div');
                placeholder.className = 'store-placeholder';
                placeholder.style.background = storeData.gradient;
                placeholder.innerHTML = `<span class="store-initial">${storeName.charAt(0)}</span>`;
                
                imgElement.parentElement.appendChild(placeholder);
                imgElement.style.display = 'none';
            }
        }
    }
    
    // Get store data by name (simplified lookup)
    function getStoreDataFromName(name) {
        // This would ideally connect to the stores data
        const gradients = {
            'Elektra': 'linear-gradient(135deg, #FFB703, #FB8500)',
            'Fix': 'linear-gradient(135deg, #4ECDC4, #44A2A0)',
            'Default': 'linear-gradient(135deg, #9CA3AF, #6B7280)'
        };
        
        return {
            gradient: gradients[name] || gradients['Default']
        };
    }
    
    // Progressive Image Loading with enhanced lazy loading
    function progressiveImageLoad() {
        const images = document.querySelectorAll('img[data-src], img[src]:not(.loaded)');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src || img.src;
                    
                    if (src && !img.classList.contains('loaded')) {
                        loadImageWithFallback(img, src)
                            .then(() => {
                                // Image loaded successfully
                                if (img.dataset.src) {
                                    img.removeAttribute('data-src');
                                }
                                observer.unobserve(img);
                            })
                            .catch(error => {
                                console.warn('Image load failed:', error.message);
                                observer.unobserve(img);
                            });
                    }
                }
            });
        }, {
            rootMargin: '100px 0px', // Increased for better UX
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Optimize store images with lazy loading
    function optimizeStoreImages() {
        const storeImages = document.querySelectorAll('.store-image img, .map-image');
        
        storeImages.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
        });
    }

    // Enhanced critical image preloading
    function preloadCriticalImages() {
        CRITICAL_IMAGES.forEach(src => {
            // Use our advanced loading system for critical images too
            const preloadImg = new Image();
            preloadImg.onload = () => {
                imageCache.set(src, preloadImg);
                console.log(`Critical image preloaded: ${src}`);
            };
            preloadImg.onerror = () => {
                // Try fallback for critical images
                const fallbackSrc = getFallbackSrc(src);
                if (fallbackSrc) {
                    const fallbackImg = new Image();
                    fallbackImg.onload = () => {
                        imageCache.set(fallbackSrc, fallbackImg);
                        console.log(`Critical image fallback loaded: ${fallbackSrc}`);
                    };
                    fallbackImg.src = fallbackSrc;
                }
            };
            preloadImg.src = src;
            
            // Also add preload link for faster fetching
            if (!document.querySelector(`link[rel="preload"][href="${src}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            }
        });
    }

    // Enhanced WebP support with better fallback
    function setupWebPSupport() {
        // Check WebP support
        const webpSupport = new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        });
        
        webpSupport.then(hasWebP => {
            document.documentElement.classList.add(hasWebP ? 'webp' : 'no-webp');
            
            if (hasWebP) {
                console.log('WebP support detected');
                // Our image loading system already handles WebP fallbacks
                // No need to modify sources here as they're already optimized
            } else {
                console.log('WebP not supported, using fallback system');
                // The fallback system will automatically use PNG versions
            }
        });
    }

    // Enhanced styling for image loading states
    function addImageLoadAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            img {
                opacity: 1;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            
            img.loading {
                opacity: 0.3;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
            }
            
            img.loaded {
                opacity: 1;
                transform: scale(1);
            }
            
            img.error {
                opacity: 0.5;
                background: #fee2e2;
                border: 1px dashed #fca5a5;
            }
            
            .store-image img,
            .map-image {
                background: #f3f4f6;
                min-height: 200px;
                border-radius: 8px;
            }
            
            .store-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                font-size: 2rem;
            }
            
            .store-initial {
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            @keyframes loading-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Image health monitoring and auto-retry
    function monitorImageHealth() {
        setInterval(() => {
            const brokenImages = document.querySelectorAll('img.error, img[src=""], img:not([src])');
            brokenImages.forEach(img => {
                const src = img.dataset.src || img.src;
                if (src) {
                    console.log(`Retrying failed image: ${src}`);
                    loadImageWithFallback(img, src).catch(() => {
                        // Final fallback handled in loadImageWithFallback
                    });
                }
            });
        }, 10000); // Check every 10 seconds
    }
    
    // Initialize all optimizations
    function init() {
        addImageLoadAnimation();
        preloadCriticalImages();
        
        // Add small delay to ensure DOM is fully ready
        setTimeout(() => {
            progressiveImageLoad();
            optimizeStoreImages();
            setupWebPSupport();
            monitorImageHealth();
        }, 100);
        
        // Re-run optimization when new content is added
        const observer = new MutationObserver(() => {
            setTimeout(() => {
                optimizeStoreImages();
                progressiveImageLoad();
            }, 50);
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();