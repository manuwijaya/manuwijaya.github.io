/**
 * Modern Portfolio JavaScript
 * Features: Dark mode, animations, scroll effects, form handling
 */

(function() {
  'use strict';

  // ========================================
  // DOM ELEMENTS
  // ========================================
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const scrollTopBtn = document.getElementById('scrollTop');
  const contactForm = document.getElementById('contactForm');
  const yearSpan = document.getElementById('year');
  const skillBars = document.querySelectorAll('.skill-progress');
  const animatedElements = document.querySelectorAll('[data-aos]');

  // ========================================
  // THEME MANAGEMENT
  // ========================================
  
  const ThemeManager = {
    init() {
      // Check for saved theme preference or default to 'light'
      const savedTheme = localStorage.getItem('theme') || 'light';
      this.setTheme(savedTheme);
      
      // Theme toggle event listener
      themeToggle.addEventListener('click', () => this.toggle());
    },

    get() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.updateIcon(theme);
    },

    toggle() {
      const currentTheme = this.get();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },

    updateIcon(theme) {
      const icon = themeToggle.querySelector('i');
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    }
  };

  // ========================================
  // NAVIGATION
  // ========================================
  
  const Navigation = {
    init() {
      // Mobile menu toggle
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
      
      // Close mobile menu when clicking a link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
          this.closeMobileMenu();
        }
      });

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
      });

      // Navbar scroll effect
      window.addEventListener('scroll', () => this.handleScroll());
    },

    toggleMobileMenu() {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    },

    closeMobileMenu() {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    },

    handleSmoothScroll(e) {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      
      if (targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    },

    handleScroll() {
      const scrollY = window.scrollY;
      
      // Add/remove scrolled class to navbar
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Show/hide scroll to top button
      if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }

      // Update active nav link
      this.updateActiveNavLink();
    },

    updateActiveNavLink() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + navbar.offsetHeight + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }
  };

  // ========================================
  // SCROLL TO TOP
  // ========================================
  
  const ScrollToTop = {
    init() {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ========================================
  // ANIMATIONS
  // ========================================
  
  const AnimationManager = {
    init() {
      this.initAOS();
      this.initSkillBars();
    },

    initAOS() {
      // Intersection Observer for scroll animations
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      animatedElements.forEach(el => observer.observe(el));
    },

    initSkillBars() {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.getAttribute('data-width');
            
            // Add slight delay for visual effect
            setTimeout(() => {
              progressBar.style.width = `${width}%`;
            }, 200);
            
            observer.unobserve(progressBar);
          }
        });
      }, observerOptions);

      skillBars.forEach(bar => observer.observe(bar));
    }
  };

  // ========================================
  // FORM HANDLING
  // ========================================
  
  const FormHandler = {
    init() {
      if (!contactForm) return;

      contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Real-time validation
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearError(input));
      });
    },

    handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      // Validate all fields
      let isValid = true;
      const inputs = contactForm.querySelectorAll('input, textarea');
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        this.showNotification('Please fill in all required fields correctly.', 'error');
        return;
      }

      // Simulate form submission
      this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();

      // In a real implementation, you would send data to a server here
      console.log('Form data:', data);
    },

    validateField(field) {
      const value = field.value.trim();
      let isValid = true;
      let errorMessage = '';

      // Remove existing error
      this.clearError(field);

      // Check required
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      }

      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      }

      if (!isValid) {
        this.showError(field, errorMessage);
      }

      return isValid;
    },

    showError(field, message) {
      field.classList.add('error');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
      `;
      
      field.parentNode.appendChild(errorDiv);
    },

    clearError(field) {
      field.classList.remove('error');
      const errorDiv = field.parentNode.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.remove();
      }
    },

    showNotification(message, type = 'success') {
      // Remove existing notifications
      const existing = document.querySelector('.notification');
      if (existing) existing.remove();

      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
      `;
      
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 5000);
    }
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  const Utils = {
    init() {
      // Update copyright year
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }

      // Add CSS animation keyframes for notifications
      this.addNotificationStyles();
    },

    addNotificationStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ef4444 !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  // ========================================
  // PERFORMANCE OPTIMIZATIONS
  // ========================================
  
  const Performance = {
    init() {
      // Lazy load images
      this.lazyLoadImages();
      
      // Preload critical resources
      this.preloadResources();
    },

    lazyLoadImages() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              img.classList.add('loaded');
              imageObserver.unobserve(img);
            }
          });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
          imageObserver.observe(img);
        });
      }
    },

    preloadResources() {
      // Preload critical fonts
      const criticalFonts = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap'
      ];

      criticalFonts.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = font;
        document.head.appendChild(link);
      });
    }
  };

  // ========================================
  // INITIALIZATION
  // ========================================
  
  function init() {
    // Initialize all modules
    ThemeManager.init();
    Navigation.init();
    ScrollToTop.init();
    AnimationManager.init();
    FormHandler.init();
    Utils.init();
    Performance.init();

    console.log('🚀 Portfolio initialized successfully!');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize on page show (for back/forward navigation)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      ThemeManager.setTheme(ThemeManager.get());
    }
  });

})();
