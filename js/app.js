/**
 * GUPRI - Guardias Privados
 * JavaScript principal para interactividad del sitio
 * @version 1.0.0
 */

(function() {
    'use strict';

    // ===================================
    // Variables globales
    // ===================================
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const statsNumbers = document.querySelectorAll('.stat-number');
    const contactForm = document.getElementById('contact-form');

    // ===================================
    // Menú móvil
    // ===================================
    function initMobileMenu() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('active');

            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isOpen);

            // Prevenir scroll del body cuando el menú está abierto
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ===================================
    // Header sticky con cambio de estilo
    // ===================================
    function initStickyHeader() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Añadir clase scrolled cuando se hace scroll
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Ocultar/mostrar header en scroll (opcional - comentado por defecto)
            /*
            if (currentScroll > lastScroll && currentScroll > 300) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            */

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ===================================
    // Smooth scroll para enlaces internos
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Actualizar URL sin salto
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ===================================
    // FAQ Accordion
    // ===================================
    function initFaqAccordion() {
        if (!faqItems.length) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');

                // Cerrar todos los demás (comportamiento accordion)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = null;
                        }
                    }
                });

                // Toggle el item actual
                item.classList.toggle('active');

                if (!isOpen) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = null;
                }
            });

            // Accesibilidad con teclado
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ===================================
    // Animación de números (contador)
    // ===================================
    function animateNumbers() {
        if (!statsNumbers.length) return;

        const animateNumber = (element) => {
            const target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateNumber = () => {
                current += step;
                if (current < target) {
                    element.textContent = Math.floor(current).toLocaleString('es-MX');
                    requestAnimationFrame(updateNumber);
                } else {
                    element.textContent = target.toLocaleString('es-MX');
                    // Añadir sufijo si existe
                    const suffix = element.getAttribute('data-suffix') || '';
                    element.textContent += suffix;
                }
            };

            updateNumber();
        };

        // Intersection Observer para activar animación cuando es visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsNumbers.forEach(stat => observer.observe(stat));
    }

    // ===================================
    // Animaciones al scroll (fade in)
    // ===================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .coverage-item');

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.classList.add('animate-ready');
            observer.observe(el);
        });
    }

    // ===================================
    // Validación y envío del formulario
    // ===================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener campos
            const nombre = contactForm.querySelector('#nombre');
            const telefono = contactForm.querySelector('#telefono');
            const email = contactForm.querySelector('#email');
            const condominio = contactForm.querySelector('#condominio');
            const mensaje = contactForm.querySelector('#mensaje');
            const privacidad = contactForm.querySelector('#privacidad');

            // Limpiar errores previos
            clearErrors();

            // Validar
            let isValid = true;

            if (!nombre.value.trim()) {
                showError(nombre, 'Por favor ingresa tu nombre');
                isValid = false;
            }

            if (!telefono.value.trim()) {
                showError(telefono, 'Por favor ingresa tu teléfono');
                isValid = false;
            } else if (!isValidPhone(telefono.value)) {
                showError(telefono, 'Ingresa un teléfono válido (10 dígitos)');
                isValid = false;
            }

            if (email.value.trim() && !isValidEmail(email.value)) {
                showError(email, 'Ingresa un correo electrónico válido');
                isValid = false;
            }

            if (!privacidad.checked) {
                showError(privacidad, 'Debes aceptar el aviso de privacidad');
                isValid = false;
            }

            if (isValid) {
                // Mostrar estado de envío
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                // Simular envío (reemplazar con llamada real a API)
                setTimeout(() => {
                    // Construir mensaje para WhatsApp como alternativa
                    const whatsappMessage = encodeURIComponent(
                        `*Nueva solicitud de cotización*\n\n` +
                        `*Nombre:* ${nombre.value}\n` +
                        `*Teléfono:* ${telefono.value}\n` +
                        `*Email:* ${email.value || 'No proporcionado'}\n` +
                        `*Condominio:* ${condominio.value || 'No especificado'}\n` +
                        `*Mensaje:* ${mensaje.value || 'Sin mensaje adicional'}`
                    );

                    // Mostrar mensaje de éxito
                    showSuccessMessage();

                    // Resetear formulario
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    // Opcional: abrir WhatsApp con el mensaje
                    // window.open(`https://wa.me/525512345678?text=${whatsappMessage}`, '_blank');

                }, 1500);
            }
        });

        // Funciones auxiliares de validación
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function isValidPhone(phone) {
            const cleaned = phone.replace(/\D/g, '');
            return cleaned.length >= 10;
        }

        function showError(field, message) {
            const formGroup = field.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('error');
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.textContent = message;
                formGroup.appendChild(errorDiv);
            }
        }

        function clearErrors() {
            contactForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
                const errorMsg = group.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        }

        function showSuccessMessage() {
            const successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = `
                <div class="success-icon"></div>
                <h3>¡Mensaje enviado!</h3>
                <p>Nos pondremos en contacto contigo en menos de 24 horas.</p>
            `;

            contactForm.parentNode.insertBefore(successDiv, contactForm);
            contactForm.style.display = 'none';

            // Opcional: restaurar formulario después de un tiempo
            setTimeout(() => {
                successDiv.remove();
                contactForm.style.display = '';
            }, 5000);
        }
    }

    // ===================================
    // Formateo automático de teléfono
    // ===================================
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');

        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length > 10) {
                    value = value.substring(0, 10);
                }

                // Formato: (55) 1234-5678
                if (value.length > 6) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
                } else if (value.length > 2) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                } else if (value.length > 0) {
                    value = `(${value}`;
                }

                e.target.value = value;
            });
        });
    }

    // ===================================
    // Botón de WhatsApp con mensaje contextual
    // ===================================
    function initWhatsAppButton() {
        const whatsappBtn = document.querySelector('.whatsapp-float');
        if (!whatsappBtn) return;

        // Mostrar tooltip después de unos segundos
        setTimeout(() => {
            const tooltip = document.createElement('div');
            tooltip.className = 'whatsapp-tooltip';
            tooltip.textContent = '¿Necesitas una cotización?';
            whatsappBtn.appendChild(tooltip);

            // Ocultar después de unos segundos
            setTimeout(() => {
                tooltip.classList.add('fade-out');
                setTimeout(() => tooltip.remove(), 300);
            }, 5000);
        }, 3000);

        // Tracking de clics (para analytics)
        whatsappBtn.addEventListener('click', function() {
            // Si tienes Google Analytics:
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'WhatsApp',
                    'event_label': 'Floating Button'
                });
            }
        });
    }

    // ===================================
    // Lazy loading de imágenes
    // ===================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if (!images.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px' });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback para navegadores sin IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    // ===================================
    // Scroll to top button
    // ===================================
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '‘';
        scrollBtn.setAttribute('aria-label', 'Volver arriba');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-primary, #1a365d);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        document.body.appendChild(scrollBtn);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        }, { passive: true });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // Active link highlighting
    // ===================================
    function initActiveLinks() {
        const sections = document.querySelectorAll('section[id]');

        if (!sections.length) return;

        window.addEventListener('scroll', function() {
            let current = '';
            const headerHeight = header ? header.offsetHeight : 0;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionHeight = section.offsetHeight;

                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }

    // ===================================
    // Preloader (opcional)
    // ===================================
    function initPreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        window.addEventListener('load', function() {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // ===================================
    // Inicialización
    // ===================================
    function init() {
        initMobileMenu();
        initStickyHeader();
        initSmoothScroll();
        initFaqAccordion();
        animateNumbers();
        initScrollAnimations();
        initContactForm();
        initPhoneFormatting();
        initWhatsAppButton();
        initLazyLoading();
        initScrollToTop();
        initActiveLinks();
        initPreloader();

        console.log('GUPRI - Sitio inicializado correctamente');
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
