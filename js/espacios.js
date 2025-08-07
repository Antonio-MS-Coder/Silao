/**
 * Espacios Disponibles - JavaScript functionality
 * Handles form validation, animations, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations on scroll
    initScrollAnimations();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize space selection
    initSpaceSelection();
    
    // Initialize newsletter form
    initNewsletterForm();
});

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Contact form handling with validation
 */
function initContactForm() {
    const form = document.getElementById('rentalInquiryForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Store form data for thank you page
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            sessionStorage.setItem('inquiryData', JSON.stringify(data));
        }
    });
}

/**
 * Field validation
 */
function validateField(field) {
    const errorMessage = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let message = '';
    
    // Remove previous error state
    field.classList.remove('error');
    if (errorMessage) errorMessage.textContent = '';
    
    // Check if field is required and empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        message = 'Este campo es obligatorio';
        isValid = false;
    } else if (field.type === 'email' && field.value) {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            message = 'Por favor ingresa un correo válido';
            isValid = false;
        }
    } else if (field.type === 'tel' && field.value) {
        // Phone validation (Mexican format)
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(field.value) || field.value.replace(/\D/g, '').length < 10) {
            message = 'Por favor ingresa un teléfono válido (10 dígitos)';
            isValid = false;
        }
    } else if (field.id === 'name' && field.value) {
        // Name validation
        if (field.value.length < 3) {
            message = 'El nombre debe tener al menos 3 caracteres';
            isValid = false;
        }
    }
    
    // Show error if validation failed
    if (!isValid) {
        field.classList.add('error');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    
    return isValid;
}

/**
 * Space selection handling
 */
function initSpaceSelection() {
    const spaceButtons = document.querySelectorAll('.space-btn');
    const spaceSelect = document.getElementById('space');
    const customSpaceBtn = document.getElementById('customSpaceBtn');
    
    spaceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const spaceName = this.getAttribute('data-space');
            
            // Scroll to form
            const formSection = document.getElementById('contactForm');
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Pre-select the space in the form
            if (spaceSelect) {
                spaceSelect.value = spaceName;
                // Add highlight effect
                spaceSelect.style.backgroundColor = '#f0f9ff';
                setTimeout(() => {
                    spaceSelect.style.backgroundColor = '';
                }, 2000);
            }
        });
    });
    
    // Custom space button
    if (customSpaceBtn) {
        customSpaceBtn.addEventListener('click', function() {
            const formSection = document.getElementById('contactForm');
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            if (spaceSelect) {
                spaceSelect.value = 'Personalizado';
                spaceSelect.style.backgroundColor = '#f0f9ff';
                setTimeout(() => {
                    spaceSelect.style.backgroundColor = '';
                }, 2000);
            }
        });
    }
}

/**
 * Newsletter form handling
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor ingresa un correo válido', 'error');
            return;
        }
        
        // Simulate subscription (in production, this would be an API call)
        const button = this.querySelector('button');
        const originalText = button.textContent;
        button.textContent = 'Suscribiendo...';
        button.disabled = true;
        
        setTimeout(() => {
            // Store subscription in localStorage
            const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                
                showNotification('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.', 'success');
                emailInput.value = '';
            } else {
                showNotification('Este correo ya está suscrito.', 'info');
            }
            
            button.textContent = originalText;
            button.disabled = false;
        }, 1000);
    });
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Format phone number as user types
 */
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = value;
                } else if (value.length <= 6) {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            
            e.target.value = formattedValue;
        });
    }
});

// Add CSS for notifications dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 9999;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-success i {
        color: #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-error i {
        color: #ef4444;
    }
    
    .notification-info {
        border-left: 4px solid #3b82f6;
    }
    
    .notification-info i {
        color: #3b82f6;
    }
    
    .form-group input.error,
    .form-group select.error {
        border-color: #ef4444;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);