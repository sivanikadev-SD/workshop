/**
 * main.js – Neighborhood Tool Library & Community Workshop
 * Handles: Theme toggle, RTL toggle, Mobile nav, Scroll reveal,
 *          Form validation, Toast notifications, Modals, Skeleton loaders
 */

'use strict';

/* ══════════════════════════════════════
   THEME MANAGEMENT
══════════════════════════════════════ */
const ThemeManager = {
  STORAGE_KEY: 'tl-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const sys   = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.apply(saved || sys);

    document.querySelectorAll('#themeToggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
      btn.setAttribute('aria-label', 'Toggle dark/light mode');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.STORAGE_KEY)) this.apply(e.matches ? 'dark' : 'light');
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('#themeToggle').forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.STORAGE_KEY, next);
    this.apply(next);
  }
};

/* ══════════════════════════════════════
   RTL MANAGEMENT
══════════════════════════════════════ */
const RTLManager = {
  STORAGE_KEY: 'tl-dir',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || 'ltr';
    this.apply(saved);

    document.querySelectorAll('#rtlToggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
      btn.setAttribute('aria-label', 'Toggle RTL/LTR layout');
    });
  },

  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('#rtlToggle').forEach(btn => {
      btn.setAttribute('aria-pressed', dir === 'rtl');
      btn.title = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next    = current === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem(this.STORAGE_KEY, next);
    this.apply(next);
  }
};

/* ══════════════════════════════════════
   MOBILE NAVIGATION
══════════════════════════════════════ */
const NavManager = {
  init() {
    const hamburger = document.getElementById('hamburger');
    const drawer    = document.getElementById('navDrawer');
    if (!hamburger || !drawer) return;

    hamburger.addEventListener('click', () => this.toggle(hamburger, drawer));

    // Close on outside click
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !drawer.contains(e.target)) {
        this.close(hamburger, drawer);
      }
    });

    // Close on ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close(hamburger, drawer);
    });

    // Close on drawer link click
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.close(hamburger, drawer));
    });

    // Sticky nav shadow
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }

    // Active link
    this.setActiveLink();
  },

  toggle(hamburger, drawer) {
    const isOpen = drawer.classList.contains('open');
    isOpen ? this.close(hamburger, drawer) : this.open(hamburger, drawer);
  },

  open(hamburger, drawer) {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  close(hamburger, drawer) {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(link => {
      const href = link.getAttribute('href')?.split('/').pop();
      if (href === path) link.classList.add('active');
    });
  }
};

/* ══════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════ */
const ScrollReveal = {
  init() {
    const isMobile = window.innerWidth < 640;
    const opts     = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Stagger children if parent has data-stagger
          if (e.target.dataset.stagger) {
            Array.from(e.target.children).forEach((child, i) => {
              setTimeout(() => child.classList.add('visible'), i * 120);
            });
          } else {
            e.target.classList.add('visible');
          }
          observer.unobserve(e.target);
        }
      });
    }, opts);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      if (isMobile) { el.classList.add('visible'); return; }
      observer.observe(el);
    });
  }
};

/* ══════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════ */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1800;
        let start = null;

        const step = ts => {
          if (!start) start = ts;
          const progress = Math.min((ts - start) / dur, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * end).toLocaleString() + (el.dataset.suffix || '');
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }
};

/* ══════════════════════════════════════
   TOAST NOTIFICATIONS
══════════════════════════════════════ */
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 4000) {
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark',
                    warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <i class="fa-solid ${icons[type]} toast-icon" aria-hidden="true"></i>
      <span class="toast-msg">${message}</span>
      <button class="toast-close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button>
    `;
    toast.querySelector('.toast-close').addEventListener('click', () => this.dismiss(toast));
    this.container.appendChild(toast);
    if (duration > 0) setTimeout(() => this.dismiss(toast), duration);
  },

  dismiss(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }
};

/* ══════════════════════════════════════
   FORM VALIDATION
══════════════════════════════════════ */
const FormValidator = {
  rules: {
    required:  (v)        => v.trim() !== '' || 'This field is required.',
    email:     (v)        => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
    minLength: (v, n)     => v.length >= n || `Must be at least ${n} characters.`,
    maxLength: (v, n)     => v.length <= n || `Must be at most ${n} characters.`,
    phone:     (v)        => /^[+\d\s\-()]{7,20}$/.test(v) || 'Enter a valid phone number.',
    nonempty:  (v)        => v !== '' || 'Please make a selection.',
  },

  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', e => {
        if (!this.validateForm(form)) {
          e.preventDefault();
          const first = form.querySelector('.is-invalid');
          first?.focus();
        }
      });

      // Live validation on blur
      form.querySelectorAll('[data-rules]').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('is-invalid')) this.validateField(field);
        });
      });
    });
  },

  validateForm(form) {
    let valid = true;
    form.querySelectorAll('[data-rules]').forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  },

  validateField(field) {
    const rulesStr = field.dataset.rules || '';
    const rules    = rulesStr.split('|').map(r => r.trim()).filter(Boolean);
    const errEl    = field.parentElement.querySelector('.form-error');

    for (const rule of rules) {
      const [name, param] = rule.split(':');
      const fn = this.rules[name];
      if (!fn) continue;
      const result = fn(field.value, param);
      if (result !== true) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.setAttribute('aria-invalid', 'true');
        if (errEl) { errEl.textContent = result; errEl.classList.add('visible'); }
        return false;
      }
    }

    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    field.setAttribute('aria-invalid', 'false');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
    return true;
  }
};

/* ══════════════════════════════════════
   MODAL MANAGER
══════════════════════════════════════ */
const ModalManager = {
  init() {
    // Open triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const id = trigger.dataset.modal;
        this.open(id);
      });
    });

    // Close triggers
    document.querySelectorAll('[data-modal-close], .modal-overlay').forEach(el => {
      el.addEventListener('click', e => {
        if (e.target === el) this.closeAll();
      });
    });

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => this.closeAll());
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeAll();
    });
  },

  open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('[data-modal-close], .modal__close')?.focus();
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach(el => {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }
};

/* ══════════════════════════════════════
   SKELETON LOADER HELPER
══════════════════════════════════════ */
const SkeletonLoader = {
  show(container) {
    if (!container) return;
    container.innerHTML = Array.from({ length: 3 }, () => `
      <div class="card">
        <div class="skeleton skeleton-img"></div>
        <div class="card__body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text" style="width:80%"></div>
          <div class="skeleton skeleton-text" style="width:60%"></div>
        </div>
      </div>
    `).join('');
  },
  hide(container) {
    if (!container) container?.querySelectorAll('.skeleton').forEach(s => s.remove());
  }
};

/* ══════════════════════════════════════
   FILTER CHIPS
══════════════════════════════════════ */
const FilterChips = {
  init() {
    document.querySelectorAll('.filter-chips').forEach(group => {
      group.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const exclusive = group.dataset.exclusive !== 'false';
          if (exclusive) group.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
          chip.classList.toggle('active');
          // Dispatch custom event for catalog pages to hook into
          group.dispatchEvent(new CustomEvent('filter-change', { bubbles: true,
            detail: { value: chip.dataset.filter, group: group.id } }));
        });
      });
    });
  }
};

/* ══════════════════════════════════════
   RESERVATION MODAL (catalog page)
══════════════════════════════════════ */
const ReservationFlow = {
  init() {
    document.querySelectorAll('[data-reserve]').forEach(btn => {
      btn.addEventListener('click', () => {
        const toolName = btn.closest('.card')?.querySelector('.card__title')?.textContent || 'Tool';
        const modal    = document.getElementById('reserveModal');
        if (!modal) return;
        const titleEl = modal.querySelector('#reserveToolName');
        if (titleEl) titleEl.textContent = toolName;
        ModalManager.open('reserveModal');
      });
    });
  }
};

/* ══════════════════════════════════════
   NEWSLETTER FORM (Mailchimp-ready)
══════════════════════════════════════ */
const NewsletterForm = {
  init() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = form.querySelector('[name="email"]')?.value;
      if (!email) return;
      // TODO: Replace with Mailchimp/ConvertKit endpoint
      Toast.show(`You're subscribed! Check ${email} for confirmation.`, 'success');
      form.reset();
    });
  }
};

/* ══════════════════════════════════════
   INIT ALL
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  NavManager.init();
  ScrollReveal.init();
  CounterAnimation.init();
  Toast.init();
  FormValidator.init();
  ModalManager.init();
  FilterChips.init();
  ReservationFlow.init();
  NewsletterForm.init();
});
