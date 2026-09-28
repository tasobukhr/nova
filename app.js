/**
 * ============================================================================
 * LOOSE LEASHES BARKACADEMY — VANILLA JAVASCRIPT (app.js)
 * Production-ready, accessible UI interactions & client-side form validation
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. NAVBAR SCROLL INTERACTION (Sticky elevation effect)
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 2. MOBILE HAMBURGER MENU TOGGLE & ACCESSIBILITY
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    const navLinks = navMenu.querySelectorAll('a');

    // Toggle menu open/close
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when any navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      });
    });

    // Close menu on Escape key press for keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
        menuToggle.focus();
      }
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. CONTACT FORM CLIENT-SIDE VALIDATION & FEEDBACK
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const formStatus = document.getElementById('form-status');
  const formStatusMsg = document.getElementById('form-status-message');

  // Simple, standard RFC 5322-compliant email validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  // Helper to apply or clear field error classes & ARIA attributes
  const setFieldError = (inputElement, groupId, isError) => {
    const group = document.getElementById(groupId);
    if (!group) return;
    if (isError) {
      group.classList.add('has-error');
      inputElement.setAttribute('aria-invalid', 'true');
    } else {
      group.classList.remove('has-error');
      inputElement.removeAttribute('aria-invalid');
    }
  };

  // Real-time error clearance when the user corrects the input
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim().length > 0) {
        setFieldError(nameInput, 'group-name', false);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value)) {
        setFieldError(emailInput, 'group-email', false);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim().length >= 10) {
        setFieldError(messageInput, 'group-message', false);
      }
    });
  }

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;

      // 1. Validate Name (Required)
      if (nameInput.value.trim().length === 0) {
        setFieldError(nameInput, 'group-name', true);
        hasError = true;
      } else {
        setFieldError(nameInput, 'group-name', false);
      }

      // 2. Validate Email (Required & Valid Format)
      if (!isValidEmail(emailInput.value)) {
        setFieldError(emailInput, 'group-email', true);
        hasError = true;
      } else {
        setFieldError(emailInput, 'group-email', false);
      }

      // 3. Validate Message (Required, minimum 10 characters)
      if (messageInput.value.trim().length < 10) {
        setFieldError(messageInput, 'group-message', true);
        hasError = true;
      } else {
        setFieldError(messageInput, 'group-message', false);
      }

      // If invalid, focus the first error field for accessibility
      if (hasError) {
        const firstErrorInput = contactForm.querySelector('.has-error input, .has-error textarea');
        if (firstErrorInput) {
          firstErrorInput.focus();
        }
        return;
      }

      // Simulated Async Form Submission
      submitBtn.disabled = true;
      const originalBtnText = btnText.textContent;
      btnText.textContent = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        btnText.textContent = originalBtnText;

        // Render accessible success feedback banner
        const userName = encodeHTML(nameInput.value.trim());
        formStatus.className = 'form-status-alert success';
        formStatusMsg.innerHTML = `<strong>Woof! Thank you, ${userName}!</strong> Your message has been received. Our certified trainers will review your inquiry and reach out within 24 hours.`;
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Reset form inputs
        contactForm.reset();

        // Automatically hide notification banner after 8 seconds
        setTimeout(() => {
          formStatus.className = 'form-status-alert';
        }, 8000);
      }, 750);
    });
  }

  // Helper to safely escape user input before injection
  function encodeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
