/**
 * dashboard.js – ToolShare Dashboards
 * Handles: Section navigation, sidebar toggle, profile save, toast integration
 */

'use strict';

/* ══════════════════════════════════════
   SECTION NAVIGATION (SPA-like tabs)
══════════════════════════════════════ */
const DashNav = {
  init() {
    const navItems = document.querySelectorAll('[data-section]');
    if (!navItems.length) return;

    navItems.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const section = item.dataset.section;
        this.show(section);
        // Update active sidebar item
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
        // Update page title
        const topTitle = document.querySelector('.dash-top-title');
        if (topTitle) topTitle.textContent = item.textContent.trim().replace(/\d+$/, '').trim();
      });
    });

    // Section link buttons (e.g. "View All" in overview)
    document.querySelectorAll('[data-section-link]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const section = btn.dataset.sectionLink;
        this.show(section);
        document.querySelectorAll('[data-section]').forEach(n => {
          n.classList.toggle('active', n.dataset.section === section);
        });
      });
    });
  },

  show(name) {
    document.querySelectorAll('[id^="section-"]').forEach(sec => {
      sec.style.display = sec.id === `section-${name}` ? 'block' : 'none';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/* ══════════════════════════════════════
   MOBILE SIDEBAR TOGGLE
══════════════════════════════════════ */
const DashSidebar = {
  init() {
    const sidebar = document.getElementById('dashSidebar');
    const toggle  = document.getElementById('mobileSidebarToggle');
    if (!sidebar) return;

    // Show button on mobile
    const mq = window.matchMedia('(max-width:1023px)');
    const update = () => {
      if (toggle) toggle.style.display = mq.matches ? 'grid' : 'none';
    };
    mq.addEventListener('change', update);
    update();

    toggle?.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar when nav item clicked on mobile
    sidebar.querySelectorAll('.dash-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (mq.matches) sidebar.classList.remove('mobile-open');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (mq.matches && !sidebar.contains(e.target) && !toggle?.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
};

/* ══════════════════════════════════════
   PROFILE SAVE
══════════════════════════════════════ */
const ProfileManager = {
  init() {
    document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
      const form = document.getElementById('profileForm');
      if (!form) return;
      // Validate managed by FormValidator in main.js
      const isValid = window.FormValidator?.validateForm(form) !== false;
      if (isValid) {
        // TODO: POST to backend API
        window.Toast?.show('Profile saved successfully!', 'success');
      }
    });
  }
};

/* ══════════════════════════════════════
   QUICK ACTIONS
══════════════════════════════════════ */
const QuickActions = {
  init() {
    // Extend loan buttons
    document.querySelectorAll('[title="Extend"]').forEach(btn => {
      btn.addEventListener('click', () => {
        window.Toast?.show('Loan extension requested. You will receive a confirmation email.', 'info');
      });
    });
  }
};

/* ══════════════════════════════════════
   SIGNOUT FUNCTION
══════════════════════════════════════ */
const SignOut = {
  init() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.Toast?.show('Successfully signed out.', 'success');
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1500);
      });
    }
  }
};

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DashNav.init();
  DashSidebar.init();
  ProfileManager.init();
  QuickActions.init();
  SignOut.init();
});
