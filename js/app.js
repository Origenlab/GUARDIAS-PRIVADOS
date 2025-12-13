/**
 * GUPRI - Guardias Privados
 * JavaScript principal - Version estatica (sin animaciones)
 * @version 2.0.0
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
    const cotizacionForm = document.getElementById('cotizacion-form');

    // ===================================
    // Menu movil
    // ===================================
    function initMobileMenu() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('active');

            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !isOpen);

            // Prevenir scroll del body cuando el menu esta abierto
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Cerrar menu al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menu al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Cerrar menu con tecla Escape
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

        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ===================================
    // Scroll para enlaces internos
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
                        top: targetPosition
                    });

                    // Actualizar URL sin salto
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // ===================================
    // Validacion y envio del formulario
    // ===================================
    function initCotizacionForm() {
        if (!cotizacionForm) return;

        cotizacionForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener campos
            const nombre = cotizacionForm.querySelector('#nombre');
            const telefono = cotizacionForm.querySelector('#telefono');
            const email = cotizacionForm.querySelector('#email');
            const tipo = cotizacionForm.querySelector('#tipo');
            const unidades = cotizacionForm.querySelector('#unidades');
            const mensaje = cotizacionForm.querySelector('#mensaje');

            // Limpiar errores previos
            clearErrors();

            // Validar
            let isValid = true;

            if (!nombre.value.trim()) {
                showError(nombre, 'Por favor ingresa tu nombre');
                isValid = false;
            }

            if (!telefono.value.trim()) {
                showError(telefono, 'Por favor ingresa tu telefono');
                isValid = false;
            } else if (!isValidPhone(telefono.value)) {
                showError(telefono, 'Ingresa un telefono valido (10 digitos)');
                isValid = false;
            }

            if (!email.value.trim()) {
                showError(email, 'Por favor ingresa tu email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Ingresa un correo electronico valido');
                isValid = false;
            }

            if (!tipo.value) {
                showError(tipo, 'Selecciona el tipo de inmueble');
                isValid = false;
            }

            if (isValid) {
                // Mostrar estado de envio
                const submitBtn = cotizacionForm.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                // Construir mensaje para WhatsApp
                const whatsappMessage = encodeURIComponent(
                    `*Nueva solicitud de cotizacion GUPRI*\n\n` +
                    `*Nombre:* ${nombre.value}\n` +
                    `*Telefono:* ${telefono.value}\n` +
                    `*Email:* ${email.value}\n` +
                    `*Tipo de inmueble:* ${tipo.options[tipo.selectedIndex].text}\n` +
                    `*No. de unidades:* ${unidades.value || 'No especificado'}\n` +
                    `*Mensaje:* ${mensaje.value || 'Sin mensaje adicional'}`
                );

                // Simular envio
                setTimeout(() => {
                    // Mostrar mensaje de exito
                    showSuccessMessage();

                    // Resetear formulario
                    cotizacionForm.reset();
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;

                    // Abrir WhatsApp con el mensaje
                    window.open(`https://wa.me/5215512345678?text=${whatsappMessage}`, '_blank');

                }, 1000);
            }
        });

        // Funciones auxiliares de validacion
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
            cotizacionForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
                const errorMsg = group.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        }

        function showSuccessMessage() {
            const successDiv = document.createElement('div');
            successDiv.className = 'form-success';
            successDiv.innerHTML = `
                <div class="success-icon">✓</div>
                <h3>Solicitud enviada</h3>
                <p>Nos pondremos en contacto contigo en menos de 24 horas.</p>
            `;

            cotizacionForm.parentNode.insertBefore(successDiv, cotizacionForm);
            cotizacionForm.style.display = 'none';

            // Restaurar formulario despues de un tiempo
            setTimeout(() => {
                successDiv.remove();
                cotizacionForm.style.display = '';
            }, 5000);
        }
    }

    // ===================================
    // Formateo automatico de telefono
    // ===================================
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');

        phoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');

                if (value.length > 10) {
                    value = value.substring(0, 10);
                }

                // Formato: 55 1234 5678
                if (value.length > 6) {
                    value = `${value.substring(0, 2)} ${value.substring(2, 6)} ${value.substring(6)}`;
                } else if (value.length > 2) {
                    value = `${value.substring(0, 2)} ${value.substring(2)}`;
                }

                e.target.value = value;
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
    // Boton scroll to top
    // ===================================
    function initScrollToTop() {
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '↑';
        scrollBtn.setAttribute('aria-label', 'Volver arriba');
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1a365d;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            opacity: 0;
            visibility: hidden;
            z-index: 998;
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
                top: 0
            });
        });
    }

    // ===================================
    // Inicializacion
    // ===================================
    function init() {
        initMobileMenu();
        initStickyHeader();
        initSmoothScroll();
        initCotizacionForm();
        initPhoneFormatting();
        initActiveLinks();
        initScrollToTop();
    }

    // Ejecutar cuando el DOM este listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
