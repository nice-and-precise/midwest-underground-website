/**
 * Midwest Underground of Minnesota Inc
 * Main JavaScript File
 *
 * Handles:
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Sticky header on scroll
 * - Back to top button
 * - Form validation
 * - Lazy loading images
 * - Active navigation highlighting
 */

// ==========================================================================
// MOBILE MENU
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
  const body = document.body;

  if (mobileMenuToggle && mobileMenu && mobileMenuBackdrop) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function() {
      const isActive = mobileMenu.classList.contains('active');

      if (isActive) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking backdrop
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);

    // Close menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileMenu.style.display = 'block';
    mobileMenuBackdrop.style.display = 'block';

    // Trigger reflow
    void mobileMenu.offsetWidth;

    mobileMenu.classList.add('active');
    mobileMenuBackdrop.classList.add('active');
    mobileMenuToggle.classList.add('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuBackdrop.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';

    // Wait for transition to complete
    setTimeout(() => {
      if (!mobileMenu.classList.contains('active')) {
        mobileMenu.style.display = 'none';
        mobileMenuBackdrop.style.display = 'none';
      }
    }, 300);
  }

  // ==========================================================================
  // STICKY HEADER ON SCROLL
  // ==========================================================================

  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  });

  // ==========================================================================
  // SMOOTH SCROLLING FOR ANCHOR LINKS
  // ==========================================================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if href is just "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // BACK TO TOP BUTTON
  // ==========================================================================

  const backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });

    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // ACTIVE NAVIGATION HIGHLIGHTING
  // ==========================================================================

  function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-links a');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');

      if (linkPage === currentPage ||
          (currentPage === '' && linkPage === 'index.html') ||
          (currentPage === '/' && linkPage === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();

  // ==========================================================================
  // LAZY LOADING IMAGES
  // ==========================================================================

  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    lazyImages.forEach(function(img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  // ==========================================================================
  // FORM VALIDATION (for contact form)
  // ==========================================================================

  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear previous errors
      const errorMessages = contactForm.querySelectorAll('.error-message');
      errorMessages.forEach(msg => msg.remove());

      const formFields = contactForm.querySelectorAll('input, textarea, select');
      formFields.forEach(field => field.classList.remove('error'));

      let isValid = true;

      // Validate name
      const nameField = contactForm.querySelector('[name="name"]');
      if (nameField && nameField.value.trim() === '') {
        showError(nameField, 'Name is required');
        isValid = false;
      }

      // Validate email
      const emailField = contactForm.querySelector('[name="email"]');
      if (emailField) {
        const emailValue = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
          showError(emailField, 'Email is required');
          isValid = false;
        } else if (!emailRegex.test(emailValue)) {
          showError(emailField, 'Please enter a valid email address');
          isValid = false;
        }
      }

      // Validate phone (optional but must be valid if provided)
      const phoneField = contactForm.querySelector('[name="phone"]');
      if (phoneField && phoneField.value.trim() !== '') {
        const phoneValue = phoneField.value.trim();
        const phoneRegex = /^[\d\s\-\(\)]+$/;

        if (!phoneRegex.test(phoneValue) || phoneValue.length < 10) {
          showError(phoneField, 'Please enter a valid phone number');
          isValid = false;
        }
      }

      // Validate message
      const messageField = contactForm.querySelector('[name="message"]');
      if (messageField && messageField.value.trim() === '') {
        showError(messageField, 'Message is required');
        isValid = false;
      }

      // If form is valid, submit it
      if (isValid) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Submit form via Formspree or native submit
        // For now, we'll use native submit which will work with Formspree
        contactForm.submit();

        // Note: In production, you might want to use fetch() for AJAX submission
        // and display a success message without page reload
      }
    });
  }

  function showError(field, message) {
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = 'var(--error)';
    errorDiv.style.fontSize = 'var(--text-sm)';
    errorDiv.style.marginTop = 'var(--space-xs)';
    errorDiv.textContent = message;

    field.parentNode.insertBefore(errorDiv, field.nextSibling);

    // Focus the first error field
    if (field === contactForm.querySelector('.error')) {
      field.focus();
    }
  }

  // ==========================================================================
  // PROJECT FILTER (for projects page)
  // ==========================================================================

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filter projects
        projectCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            // Add animation
            card.style.animation = 'fadeIn 0.5s ease-in-out';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ==========================================================================
  // TESTIMONIAL CAROUSEL (if implemented)
  // ==========================================================================

  const testimonialCarousel = document.querySelector('.testimonials-carousel');

  if (testimonialCarousel) {
    let currentSlide = 0;
    const slides = testimonialCarousel.querySelectorAll('.testimonial-slide');
    const prevButton = testimonialCarousel.querySelector('.carousel-prev');
    const nextButton = testimonialCarousel.querySelector('.carousel-next');

    if (slides.length > 0) {
      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.style.display = i === index ? 'block' : 'none';
        });
      }

      function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
      }

      function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
      }

      if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
      }

      if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
      }

      // Auto-advance every 5 seconds
      let autoAdvance = setInterval(nextSlide, 5000);

      // Pause on hover
      testimonialCarousel.addEventListener('mouseenter', function() {
        clearInterval(autoAdvance);
      });

      testimonialCarousel.addEventListener('mouseleave', function() {
        autoAdvance = setInterval(nextSlide, 5000);
      });

      // Initialize
      showSlide(currentSlide);
    }
  }

  // ==========================================================================
  // CLICK TO CALL TRACKING (placeholder for analytics)
  // ==========================================================================

  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  phoneLinks.forEach(link => {
    link.addEventListener('click', function() {
      // Placeholder for analytics tracking
      // Example: gtag('event', 'phone_call', { 'event_category': 'Contact' });
      console.log('Phone click tracked:', this.getAttribute('href'));
    });
  });

  // ==========================================================================
  // ANIMATIONS ON SCROLL (Optional Enhancement)
  // ==========================================================================

  const animateOnScroll = document.querySelectorAll('.animate-on-scroll');

  if (animateOnScroll.length > 0 && 'IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animateOnScroll.forEach(element => {
      scrollObserver.observe(element);
    });
  }
});

// ==========================================================================
// ADD FADE-IN ANIMATION KEYFRAMES DYNAMICALLY
// ==========================================================================

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error {
    border-color: var(--error) !important;
  }

  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
