/**
 * TG DEV - Portfolio & Interactive Demos Core Script
 * Actúa con la lógica y velocidad requerida para una experiencia de usuario fluida.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Scroll Logic ---
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const isDemoPage = document.body.classList.contains('demo-body');

  // Handle header glassmorphism & shadow on scroll
  const handleScroll = () => {
    if (window.scrollY > 50) {
      if (isDemoPage) {
        header.classList.add('scrolled-light');
      } else {
        header.classList.add('scrolled');
      }
    } else {
      if (isDemoPage) {
        header.classList.remove('scrolled-light');
      } else {
        header.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case page loads scrolled down

  // Mobile navigation hamburger toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // --- Smooth Anchor Navigation ---
  // Ensure that on-page links scroll smoothly (standard behavior enhanced)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Offset scroll for sticky header
        const headerOffset = window.scrollY > 50 ? 70 : 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- E-Commerce Interactivity (demo-ecommerce.html) ---
  const cartButtons = document.querySelectorAll('.eco-btn-cart');
  const cartCountEl = document.getElementById('cart-count');
  
  if (cartButtons.length > 0 && cartCountEl) {
    let cartCount = 0;

    cartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        cartCount++;
        cartCountEl.textContent = cartCount;
        
        // Cart bounce animation
        cartCountEl.style.transform = 'scale(1.3)';
        cartCountEl.style.backgroundColor = 'var(--accent)';
        cartCountEl.style.color = '#fff';
        
        setTimeout(() => {
          cartCountEl.style.transform = 'scale(1)';
        }, 200);

        // Optional notification toast or button icon transition
        const originalContent = button.innerHTML;
        button.innerHTML = `
          <svg viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px;">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        `;
        button.style.backgroundColor = 'var(--primary)';
        button.style.color = '#fff';

        setTimeout(() => {
          button.innerHTML = originalContent;
          button.style.backgroundColor = '';
          button.style.color = '';
        }, 1000);
      });
    });
  }

  // --- Netlify AJAX Forms Submission Handling ---
  // Main Contact Form
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');

  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      // UI Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="width:18px; height:18px; margin-right:8px; display:inline-block; vertical-align:middle;" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:0.25;"></circle>
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style="opacity:0.75;"></path>
        </svg>
        Enviando...
      `;

      // Serialize form fields
      const formData = new FormData(contactForm);
      const urlSearchParams = new URLSearchParams(formData).toString();

      // Submit via Fetch API to netlify endpoint
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlSearchParams
      })
      .then(response => {
        if (response.ok) {
          contactStatus.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto a la brevedad.';
          contactStatus.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error('Server returned error status');
        }
      })
      .catch(error => {
        contactStatus.textContent = 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo o contáctanos por WhatsApp.';
        contactStatus.className = 'form-status error';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Hide message after 8 seconds
        setTimeout(() => {
          contactStatus.style.display = 'none';
        }, 8000);
      });
    });
  }

  // Lead Generation Landing Form (demo-landing.html)
  const landingForm = document.getElementById('landing-optin-form');
  const landingStatus = document.getElementById('landing-status');

  if (landingForm && landingStatus) {
    landingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = landingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando...';

      const formData = new FormData(landingForm);
      const urlSearchParams = new URLSearchParams(formData).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlSearchParams
      })
      .then(response => {
        if (response.ok) {
          landingStatus.textContent = '¡Folleto y asesoría solicitados con éxito! Te lo hemos enviado por email.';
          landingStatus.className = 'form-status success';
          landingForm.reset();
        } else {
          throw new Error('Server returned error status');
        }
      })
      .catch(error => {
        landingStatus.textContent = 'Ocurrió un error. Por favor inténtalo de nuevo.';
        landingStatus.className = 'form-status error';
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        setTimeout(() => {
          landingStatus.style.display = 'none';
        }, 8000);
      });
    });
  }
});
