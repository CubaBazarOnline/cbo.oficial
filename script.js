// script.js - Código mejorado y organizado para CBO

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización
    initApp();
    
    // Configuración de eventos
    setupEventListeners();
});

// Función de inicialización
function initApp() {
    // Manejar hash en la URL para scroll
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(function() {
                target.scrollIntoView();
            }, 100);
        }
    }
    
    // Solicitar permisos para notificaciones
    setTimeout(requestNotificationPermission, 5000);
    
    // Registrar Service Worker si está disponible
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
}

// Configuración de event listeners
function setupEventListeners() {
    // Navegación suave para enlaces internos
    setupSmoothScrolling();
    
    // Cambio de estilo del header al hacer scroll
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        setupFormValidation(contactForm);
    }
    
    // Menú móvil toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

// Navegación suave
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                scrollToElement(targetElement);
                updateBrowserHistory(targetId);
            }
        });
    });
}

// Scroll a elemento
function scrollToElement(element) {
    if ('scrollBehavior' in document.documentElement.style) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    } else {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
            top: targetPosition,
            behavior: 'auto'
        });
    }
}

// Actualizar historial del navegador
function updateBrowserHistory(hash) {
    if (history.pushState) {
        history.pushState(null, null, hash);
    } else {
        location.hash = hash;
    }
}

// Manejar scroll del header
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(44, 62, 80, 0.95)';
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'var(--primary)';
        header.style.padding = '1rem 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
}

// Manejar envío del formulario
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Validar formulario
    if (!validateForm(formData)) {
        return;
    }
    
    // Preparar y enviar correo
    sendEmail(formData);
    
    // Mostrar notificación de éxito
    showNotification('success', 'Gracias por tu mensaje. Redirigiendo a tu cliente de correo...');
    
    // Resetear formulario
    form.reset();
}

// Validar formulario
function validateForm(formData) {
    let isValid = true;
    const errors = {};
    
    // Validar nombre
    if (!formData.name) {
        errors.name = 'El nombre es requerido';
        isValid = false;
    }
    
    // Validar email
    if (!formData.email) {
        errors.email = 'El correo electrónico es requerido';
        isValid = false;
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Por favor ingrese un correo electrónico válido';
        isValid = false;
    }
    
    // Validar servicio
    if (!formData.service) {
        errors.service = 'Por favor seleccione un servicio';
        isValid = false;
    }
    
    // Validar mensaje
    if (!formData.message) {
        errors.message = 'El mensaje es requerido';
        isValid = false;
    }
    
    // Mostrar errores
    showFormErrors(errors);
    
    return isValid;
}

// Validar email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Mostrar errores de formulario
function showFormErrors(errors) {
    // Limpiar errores previos
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Mostrar nuevos errores
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}-error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });
}

// Configurar validación en tiempo real
function setupFormValidation(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let error = '';
    
    if (field.hasAttribute('required') && !value) {
        error = 'Este campo es requerido';
    } else if (fieldName === 'email' && value && !validateEmail(value)) {
        error = 'Por favor ingrese un correo electrónico válido';
    }
    
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = error;
    }
    
    return !error;
}

// Limpiar error de campo
function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Enviar email
function sendEmail(formData) {
    const emailBody = `Nombre: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0ATeléfono: ${formData.phone || 'No proporcionado'}%0D%0AServicio de interés: ${formData.service}%0D%0A%0D%0AMensaje:%0D%0A${formData.message}`;
    const mailtoLink = `mailto:cubabazaronline@gmail.com?subject=Solicitud de servicio CBO - ${formData.name}&body=${emailBody}`;
    
    window.location.href = mailtoLink;
}

// Mostrar notificación
function showNotification(type, message, duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    
    let icon;
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle" aria-hidden="true"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle" aria-hidden="true"></i>';
    }
    
    notification.innerHTML = `${icon}<span>${message}</span><button class="close-notification" aria-label="Cerrar notificación">&times;</button>`;
    container.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(function() {
        notification.classList.add('show');
    }, 10);
    
    // Configurar botón de cierre
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeNotification(notification);
        });
    }
    
    // Cerrar automáticamente después de la duración especificada
    if (duration) {
        setTimeout(function() {
            closeNotification(notification);
        }, duration);
    }
}

// Cerrar notificación
function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Solicitar permiso para notificaciones
function requestNotificationPermission() {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showDailyNotifications();
            }
        });
    } else if (Notification.permission === 'granted') {
        showDailyNotifications();
    }
}

// Mostrar notificaciones diarias
function showDailyNotifications() {
    const now = new Date();
    const lastNotification = localStorage.getItem('lastNotification');
    const lastNotificationDate = lastNotification ? new Date(lastNotification) : null;
    
    // No mostrar más de una notificación por día
    if (lastNotificationDate && 
        lastNotificationDate.getDate() === now.getDate() && 
        lastNotificationDate.getMonth() === now.getMonth() && 
        lastNotificationDate.getFullYear() === now.getFullYear()) {
        return;
    }
    
    const messages = [
        {
            type: 'info',
            title: 'Recordatorio CBO',
            message: '¿Sabías que puedes actualizar tu página web cada 15 días sin costo adicional?',
            icon: 'fas fa-sync-alt'
        },
        {
            type: 'promo',
            title: 'Oferta Especial CBO',
            message: 'Clientes frecuentes obtienen 10% de descuento en su tercer mes',
            icon: 'fas fa-percentage'
        },
        {
            type: 'success',
            title: '¡Felicitaciones!',
            message: 'Más de 50 MIPYMES ya tienen su sitio web con CBO',
            icon: 'fas fa-trophy'
        },
        {
            type: 'warning',
            title: 'Soporte Disponible',
            message: 'Recuerda que nuestro equipo de soporte está disponible para ayudarte',
            icon: 'fas fa-headset'
        }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Notificación del sistema
    if (Notification.permission === 'granted') {
        new Notification(randomMessage.title, {
            body: randomMessage.message,
            icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968527.png'
        });
    }
    
    // Notificación en la página
    const notificationHTML = `
        <div class="notification-schedule">
            <i class="${randomMessage.icon}" aria-hidden="true"></i>
            <span>${randomMessage.message}</span>
            <button class="close-schedule" aria-label="Cerrar notificación">&times;</button>
        </div>
    `;
    
    const notificationElement = document.createElement('div');
    notificationElement.innerHTML = notificationHTML;
    document.body.appendChild(notificationElement);
    
    const closeBtn = notificationElement.querySelector('.close-schedule');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notificationElement.remove();
        });
    }
    
    // Eliminar automáticamente después de 10 segundos
    setTimeout(() => {
        if (notificationElement.parentNode) {
            notificationElement.remove();
        }
    }, 10000);
    
    // Guardar fecha de la última notificación
    localStorage.setItem('lastNotification', now.toString());
}

// Registrar Service Worker
function registerServiceWorker() {
    navigator.serviceWorker.register('sw.js')
        .then(function(registration) {
            console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
}

// Toggle menú móvil
function toggleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const headerButtons = document.querySelector('.header-buttons');
    
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    headerButtons.classList.toggle('active');
}

// Iniciar intervalo para notificaciones diarias
setInterval(showDailyNotifications, 24 * 60 * 60 * 1000);