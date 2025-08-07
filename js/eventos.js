/**
 * Eventos - JavaScript functionality
 * Handles event filtering, calendar, modal, and subscriptions
 */

// Event data structure
const eventsData = {
    upcoming: [
        {
            id: 'festival-verano',
            title: 'Festival de Verano 2024',
            date: new Date(2024, 7, 15),
            time: '16:00 - 22:00',
            location: 'Plaza Central',
            category: 'familiar',
            description: 'Celebra el verano con música en vivo, juegos mecánicos, food trucks y actividades para toda la familia.',
            fullDescription: `
                <h2>Festival de Verano 2024</h2>
                <p>Únete a nosotros para el evento más esperado del verano. Un día lleno de diversión, música y actividades para toda la familia.</p>
                <h3>Programa de Actividades:</h3>
                <ul>
                    <li>16:00 - Apertura y bienvenida</li>
                    <li>16:30 - Show de magia para niños</li>
                    <li>17:30 - Concurso de talentos locales</li>
                    <li>19:00 - Presentación de bandas locales</li>
                    <li>21:00 - Show de fuegos artificiales</li>
                </ul>
                <h3>Atracciones:</h3>
                <ul>
                    <li>Juegos mecánicos para todas las edades</li>
                    <li>Food trucks con variedad gastronómica</li>
                    <li>Zona de pintacaritas y globoflexia</li>
                    <li>Stands de artesanías locales</li>
                </ul>
                <p><strong>Entrada libre</strong> - No te lo pierdas!</p>
            `,
            image: '/images/events/festival-verano.jpg'
        },
        {
            id: 'venta-nocturna',
            title: 'Venta Nocturna',
            date: new Date(2024, 7, 20),
            time: '18:00 - 23:00',
            location: 'Todas las tiendas',
            category: 'promocional',
            description: 'Descuentos de hasta 50% en tiendas participantes.',
            fullDescription: `
                <h2>Venta Nocturna - Agosto 2024</h2>
                <p>Prepárate para una noche de compras inolvidable con descuentos exclusivos en todas las tiendas participantes.</p>
                <h3>Beneficios Especiales:</h3>
                <ul>
                    <li>Hasta 50% de descuento en productos seleccionados</li>
                    <li>3x2 en artículos marcados</li>
                    <li>Meses sin intereses en compras mayores a $1,000</li>
                    <li>Regalos sorpresa en compras mayores a $500</li>
                </ul>
                <h3>Tiendas Participantes:</h3>
                <p>Elektra, Fix Truper, Zonatura, y más de 10 tiendas adicionales.</p>
                <p><strong>Tip:</strong> Llega temprano para aprovechar las mejores ofertas.</p>
            `,
            image: '/images/events/venta-nocturna.jpg'
        },
        {
            id: 'expo-artesanias',
            title: 'Expo Artesanías Guanajuato',
            date: new Date(2024, 7, 25),
            endDate: new Date(2024, 7, 27),
            time: '10:00 - 20:00',
            location: 'Pasillos principales',
            category: 'cultural',
            description: 'Exposición y venta de artesanías tradicionales de Guanajuato.',
            image: '/images/events/expo-artesanias.jpg'
        },
        {
            id: 'carrera-5k',
            title: 'Carrera 5K Plaza Real',
            date: new Date(2024, 8, 1),
            time: '07:00',
            location: 'Salida: Plaza Real',
            category: 'deportivo',
            description: 'Carrera anual de 5K con premios y medallas.',
            image: '/images/events/carrera-5k.jpg'
        },
        {
            id: 'cine-aire-libre',
            title: 'Cine al Aire Libre',
            date: new Date(2024, 8, 7),
            time: '19:30',
            location: 'Estacionamiento Norte',
            category: 'familiar',
            description: 'Proyección de "Coco" bajo las estrellas.',
            image: '/images/events/cine-aire-libre.jpg'
        },
        {
            id: 'fiestas-patrias',
            title: 'Celebración Fiestas Patrias',
            date: new Date(2024, 8, 15),
            endDate: new Date(2024, 8, 16),
            time: '18:00 - 23:00',
            location: 'Plaza Central',
            category: 'temporada',
            description: 'Grito de Independencia con mariachi y fuegos artificiales.',
            image: '/images/events/fiestas-patrias.jpg'
        }
    ]
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initEventFilters();
    initCalendar();
    initEventModals();
    initSubscriptionForm();
    initScrollAnimations();
    initLoadMore();
});

/**
 * Initialize event category filters
 */
function initEventFilters() {
    const categoryButtons = document.querySelectorAll('.category-card');
    const eventCards = document.querySelectorAll('.event-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter events
            eventCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Initialize calendar functionality
 */
function initCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    if (!calendarGrid) return;
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const prevLastDay = new Date(currentYear, currentMonth, 0);
        
        const firstDayOfWeek = firstDay.getDay();
        const lastDateOfMonth = lastDay.getDate();
        const prevLastDate = prevLastDay.getDate();
        
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        
        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        let html = '';
        
        // Day headers
        dayNames.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        
        // Previous month days
        for (let i = firstDayOfWeek; i > 0; i--) {
            html += `<div class="calendar-day other-month">
                <div class="calendar-day-number">${prevLastDate - i + 1}</div>
            </div>`;
        }
        
        // Current month days
        for (let i = 1; i <= lastDateOfMonth; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const isToday = isDateToday(date);
            const events = getEventsForDate(date);
            
            html += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${date.toISOString()}">
                <div class="calendar-day-number">${i}</div>`;
            
            if (events.length > 0) {
                html += '<div class="calendar-events">';
                events.forEach(event => {
                    html += `<span class="calendar-event-dot ${event.category}" title="${event.title}"></span>`;
                });
                html += '</div>';
            }
            
            html += '</div>';
        }
        
        // Next month days
        const remainingDays = 42 - (firstDayOfWeek + lastDateOfMonth);
        for (let i = 1; i <= remainingDays; i++) {
            html += `<div class="calendar-day other-month">
                <div class="calendar-day-number">${i}</div>
            </div>`;
        }
        
        calendarGrid.innerHTML = html;
        
        // Add click events to calendar days
        const calendarDays = calendarGrid.querySelectorAll('.calendar-day:not(.other-month)');
        calendarDays.forEach(day => {
            day.addEventListener('click', function() {
                const date = new Date(this.dataset.date);
                const events = getEventsForDate(date);
                if (events.length > 0) {
                    showDayEvents(date, events);
                }
            });
        });
    }
    
    function isDateToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    function getEventsForDate(date) {
        return eventsData.upcoming.filter(event => {
            const eventDate = new Date(event.date);
            if (event.endDate) {
                const endDate = new Date(event.endDate);
                return date >= eventDate && date <= endDate;
            }
            return eventDate.getDate() === date.getDate() &&
                   eventDate.getMonth() === date.getMonth() &&
                   eventDate.getFullYear() === date.getFullYear();
        });
    }
    
    function showDayEvents(date, events) {
        const modal = document.getElementById('eventModal');
        const modalBody = document.getElementById('modalBody');
        
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        let html = `
            <h2>Eventos del ${date.getDate()} de ${monthNames[date.getMonth()]}</h2>
            <div class="day-events-list">
        `;
        
        events.forEach(event => {
            html += `
                <div class="day-event-item">
                    <h3>${event.title}</h3>
                    <p><i class="far fa-clock"></i> ${event.time}</p>
                    <p><i class="far fa-map-marker-alt"></i> ${event.location}</p>
                    <p>${event.description}</p>
                </div>
            `;
        });
        
        html += '</div>';
        
        modalBody.innerHTML = html;
        modal.classList.add('active');
    }
    
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });
    
    renderCalendar();
}

/**
 * Initialize event modals
 */
function initEventModals() {
    const eventButtons = document.querySelectorAll('.event-btn');
    const modal = document.getElementById('eventModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    
    eventButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.dataset.event;
            const event = eventsData.upcoming.find(e => e.id === eventId);
            
            if (event && event.fullDescription) {
                modalBody.innerHTML = event.fullDescription;
                modal.classList.add('active');
            }
        });
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }
}

/**
 * Initialize subscription form
 */
function initSubscriptionForm() {
    const form = document.getElementById('eventSubscriptionForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const preferences = this.querySelector('select[name="preferences"]').value;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor ingresa un correo válido', 'error');
            return;
        }
        
        // Save subscription
        const subscriptions = JSON.parse(localStorage.getItem('eventSubscriptions') || '[]');
        const existingSubscription = subscriptions.find(sub => sub.email === email);
        
        if (existingSubscription) {
            existingSubscription.preferences = preferences;
            existingSubscription.updatedAt = new Date().toISOString();
        } else {
            subscriptions.push({
                email,
                preferences,
                subscribedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('eventSubscriptions', JSON.stringify(subscriptions));
        
        // Show success message
        showNotification('¡Suscripción exitosa! Recibirás información sobre los eventos seleccionados.', 'success');
        
        // Reset form
        this.reset();
    });
}

/**
 * Initialize scroll animations
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
 * Initialize load more functionality
 */
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreEvents');
    if (!loadMoreBtn) return;
    
    let moreEventsLoaded = false;
    
    loadMoreBtn.addEventListener('click', function() {
        if (moreEventsLoaded) {
            showNotification('No hay más eventos para mostrar', 'info');
            return;
        }
        
        const eventsGrid = document.getElementById('eventsGrid');
        
        // Additional events to load
        const moreEvents = [
            {
                category: 'cultural',
                title: 'Taller de Pintura',
                date: '10 OCT',
                time: '17:00 - 19:00',
                location: 'Sala de Eventos',
                description: 'Aprende técnicas básicas de pintura al óleo con artistas locales.',
                tags: ['Cupo limitado', 'Inscripción previa']
            },
            {
                category: 'promocional',
                title: 'Black Friday',
                date: '29 NOV',
                time: 'Todo el día',
                location: 'Todas las tiendas',
                description: 'El evento de descuentos más grande del año. Hasta 70% de descuento.',
                tags: ['Mega descuentos', 'Un día único']
            },
            {
                category: 'temporada',
                title: 'Villa Navideña',
                date: '01 DIC',
                time: '16:00 - 21:00',
                location: 'Plaza Central',
                description: 'Inauguración de la villa navideña con Santa Claus, villancicos y chocolate caliente.',
                tags: ['Entrada libre', 'Fotos con Santa']
            }
        ];
        
        moreEvents.forEach((event, index) => {
            setTimeout(() => {
                const eventCard = createEventCard(event);
                eventsGrid.insertAdjacentHTML('beforeend', eventCard);
                
                // Trigger animation
                const newCard = eventsGrid.lastElementChild;
                setTimeout(() => {
                    newCard.classList.add('visible');
                }, 50);
            }, index * 100);
        });
        
        moreEventsLoaded = true;
        this.textContent = 'No hay más eventos';
        this.disabled = true;
    });
}

/**
 * Create event card HTML
 */
function createEventCard(event) {
    const [day, month] = event.date.split(' ');
    
    let tagsHtml = '';
    event.tags.forEach(tag => {
        tagsHtml += `<span class="tag">${tag}</span>`;
    });
    
    return `
        <article class="event-card animate-on-scroll" data-category="${event.category}">
            <div class="event-image">
                <img src="/images/events/placeholder.jpg" alt="${event.title}" loading="lazy">
                <div class="event-date">
                    <span class="date-day">${day}</span>
                    <span class="date-month">${month}</span>
                </div>
            </div>
            <div class="event-content">
                <span class="event-category">${getCategoryName(event.category)}</span>
                <h3>${event.title}</h3>
                <div class="event-meta">
                    <span><i class="far fa-clock"></i> ${event.time}</span>
                    <span><i class="far fa-map-marker-alt"></i> ${event.location}</span>
                </div>
                <p>${event.description}</p>
                <div class="event-tags">${tagsHtml}</div>
                <button class="btn btn-primary event-btn">
                    Más Información
                </button>
            </div>
        </article>
    `;
}

/**
 * Get category display name
 */
function getCategoryName(category) {
    const categories = {
        cultural: 'Evento Cultural',
        promocional: 'Promoción Especial',
        familiar: 'Evento Familiar',
        temporada: 'Evento de Temporada',
        deportivo: 'Evento Deportivo'
    };
    return categories[category] || 'Evento';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification styles
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
        z-index: 10000;
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
    
    .day-events-list {
        margin-top: 1.5rem;
    }
    
    .day-event-item {
        padding: 1rem;
        background: #f9fafb;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .day-event-item h3 {
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .day-event-item p {
        color: #6b7280;
        margin: 0.25rem 0;
    }
    
    .day-event-item i {
        color: #2563eb;
        margin-right: 0.5rem;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);