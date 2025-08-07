/**
 * FAQ Page - JavaScript functionality
 * Handles accordion, search, and category filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    initFAQAccordion();
    initFAQSearch();
    initCategoryFilter();
    initSmoothScroll();
});

/**
 * Initialize FAQ accordion functionality
 */
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');
            
            // Close all other items in the same section
            const section = this.closest('.faq-section');
            const sectionItems = section.querySelectorAll('.faq-item');
            sectionItems.forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            if (isActive) {
                faqItem.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                
                // Smooth scroll to item if needed
                setTimeout(() => {
                    const itemTop = faqItem.getBoundingClientRect().top;
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    
                    if (itemTop < headerHeight) {
                        window.scrollTo({
                            top: window.pageYOffset + itemTop - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
    });
}

/**
 * Initialize FAQ search functionality
 */
function initFAQSearch() {
    const searchInput = document.getElementById('faqSearch');
    const searchButton = searchInput?.nextElementSibling;
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    // Search on input with debounce
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value.toLowerCase());
        }, 300);
    });
    
    // Search on enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            performSearch(this.value.toLowerCase());
        }
    });
    
    // Search on button click
    searchButton?.addEventListener('click', function() {
        performSearch(searchInput.value.toLowerCase());
    });
}

/**
 * Perform search across all FAQ items
 */
function performSearch(query) {
    const faqSections = document.querySelectorAll('.faq-section');
    const categoryButtons = document.querySelectorAll('.category-btn');
    let hasResults = false;
    
    if (!query) {
        // Reset if search is empty
        resetSearch();
        return;
    }
    
    // Show all categories
    categoryButtons.forEach(btn => {
        if (btn.dataset.category === 'all') {
            btn.click();
        }
    });
    
    faqSections.forEach(section => {
        const faqItems = section.querySelectorAll('.faq-item');
        let sectionHasResults = false;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(query) || answer.includes(query)) {
                item.style.display = '';
                highlightText(item, query);
                hasResults = true;
                sectionHasResults = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide section if no results
        if (!sectionHasResults) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(!hasResults, query);
}

/**
 * Reset search and show all items
 */
function resetSearch() {
    const faqSections = document.querySelectorAll('.faq-section');
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqSections.forEach(section => {
        section.style.display = '';
    });
    
    faqItems.forEach(item => {
        item.style.display = '';
        removeHighlight(item);
    });
    
    removeNoResultsMessage();
}

/**
 * Highlight search terms in text
 */
function highlightText(element, query) {
    removeHighlight(element);
    
    if (!query) return;
    
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(query)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(textNode => {
        const span = document.createElement('span');
        span.innerHTML = textNode.nodeValue.replace(
            new RegExp(`(${escapeRegExp(query)})`, 'gi'),
            '<span class="highlight">$1</span>'
        );
        textNode.parentNode.replaceChild(span, textNode);
    });
}

/**
 * Remove highlight from element
 */
function removeHighlight(element) {
    const highlights = element.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

/**
 * Escape special characters for regex
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Show no results message
 */
function showNoResultsMessage(show, query) {
    removeNoResultsMessage();
    
    if (show) {
        const message = document.createElement('div');
        message.className = 'no-results';
        message.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No se encontraron resultados</h3>
            <p>No encontramos preguntas que coincidan con "${query}"</p>
            <p>Intenta con otros términos o <a href="#" id="clearSearch">limpia la búsqueda</a></p>
        `;
        
        const faqGrid = document.querySelector('.faq-grid');
        faqGrid.appendChild(message);
        
        // Add clear search functionality
        document.getElementById('clearSearch')?.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('faqSearch').value = '';
            resetSearch();
        });
    }
}

/**
 * Remove no results message
 */
function removeNoResultsMessage() {
    const message = document.querySelector('.no-results');
    if (message) {
        message.remove();
    }
}

/**
 * Initialize category filtering
 */
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqSections = document.querySelectorAll('.faq-section');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Clear search when changing category
            const searchInput = document.getElementById('faqSearch');
            if (searchInput) {
                searchInput.value = '';
            }
            resetSearch();
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter sections
            if (category === 'all') {
                faqSections.forEach(section => {
                    section.style.display = '';
                    fadeIn(section);
                });
            } else {
                faqSections.forEach(section => {
                    if (section.dataset.category === category) {
                        section.style.display = '';
                        fadeIn(section);
                    } else {
                        section.style.display = 'none';
                    }
                });
            }
            
            // Scroll to FAQ content
            const faqContent = document.querySelector('.faq-content');
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            window.scrollTo({
                top: faqContent.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Fade in animation
 */
function fadeIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 10);
}

/**
 * Initialize smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                
                window.scrollTo({
                    top: target.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Track FAQ interactions for analytics
 */
function trackFAQInteraction(action, label) {
    // Google Analytics tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'FAQ',
            'event_label': label
        });
    }
    
    // Custom tracking
    const interactions = JSON.parse(localStorage.getItem('faqInteractions') || '[]');
    interactions.push({
        action,
        label,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 interactions
    if (interactions.length > 50) {
        interactions.shift();
    }
    
    localStorage.setItem('faqInteractions', JSON.stringify(interactions));
}

// Track FAQ question clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.faq-question')) {
        const question = e.target.closest('.faq-question').querySelector('span').textContent;
        trackFAQInteraction('question_click', question);
    }
});

// Track search usage
document.getElementById('faqSearch')?.addEventListener('search', function() {
    trackFAQInteraction('search', this.value);
});