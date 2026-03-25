# ToolShare – Neighborhood Tool Library & Community Workshop

A complete, production-ready website template for a neighborhood tool library. Built with semantic HTML, vanilla CSS (CSS variables + BEM), and vanilla ES6+ JavaScript.

---

## 📁 File Structure

```
tool-library/
├── assets/
│   ├── css/
│   │   ├── style.css          ← Main styles + CSS variable palette
│   │   ├── dark-mode.css      ← Dark theme overrides
│   │   ├── rtl.css            ← RTL layout support
│   │   └── dashboard.css      ← Dashboard-specific layout
│   ├── js/
│   │   ├── main.js            ← Theme, RTL, nav, forms, toasts, modals
│   │   └── dashboard.js       ← Dashboard section nav, sidebar, profile
│   ├── images/                ← Add your images here
│   └── fonts/                 ← Optional self-hosted fonts
├── pages/
│   ├── index.html             ← Home page
│   ├── catalog.html           ← Tool catalog with filters
│   ├── workshops.html         ← Workshop calendar & booking
│   ├── membership.html        ← Pricing tiers & FAQ
│   ├── about.html             ← Mission, team, history
│   └── contact.html           ← Contact form + map
├── dashboard/
│   ├── user.html              ← Member dashboard
│   └── admin.html             ← Admin dashboard
└── README.md
```

---

## 🎨 Color Palette

| Variable                | Value     | Use                      |
|-------------------------|-----------|--------------------------|
| `--color-primary`       | `#212121` | Main dark color          |
| `--color-secondary`     | `#424242` | Secondary surfaces       |
| `--color-accent`        | `#FF6F00` | CTAs, highlights, badges |
| `--color-bg`            | `#FAFAFA` | Page background          |
| `--color-text`          | `#212121` | Body text (light mode)   |
| `--color-text-inv`      | `#EEEEEE` | Body text (dark mode)    |

To retheme, edit the `:root {}` block at the top of `style.css`.

---

## 🚀 Quick Start

1. Open any page from `pages/` in a browser — no build step needed.
2. For production, serve the `tool-library/` folder with any static host (Netlify, Vercel, GitHub Pages).

---

## 🔌 Integrations (Replace Placeholders)

| Feature        | How to enable                                                              |
|----------------|---------------------------------------------------------------------------|
| Contact Form   | Replace `action="https://formspree.io/f/YOUR_FORM_ID"` in `contact.html` |
| Newsletter     | Replace the submit handler in `main.js` `NewsletterForm` with Mailchimp API |
| Google Maps    | Replace `<!-- TODO: Replace with Google Maps iframe -->` in `contact.html`|
| Stripe Payment | Replace `<!-- TODO: Integrate Stripe.js Elements -->` in `membership.html` + `user.html` |
| Analytics      | Replace `<!-- TODO: Connect Chart.js -->` in `admin.html` dashboard       |

---

## 🌙 Dark Mode

Automatically detects system preference. User can toggle via the sun/moon button in the nav. Preference is saved to `localStorage`.

## 🔁 RTL Support

Click the ↔ button in the nav. Full right-to-left layout via `dir="rtl"` on `<html>`. Preference saved to `localStorage`.

## ♿ Accessibility

- ARIA labels on all interactive elements
- Keyboard-navigable modals (ESC closes, focus trap)
- Form errors linked to fields via `role="alert"`
- Semantic HTML throughout (`<nav>`, `<main>`, `<article>`, `<aside>`)
- WCAG 2.1 AA color contrast ratios maintained

---

## 📱 Responsive Breakpoints

| Breakpoint | Range          |
|------------|----------------|
| Mobile     | < 640px        |
| Tablet     | 640px–1024px   |
| Desktop    | 1024px–1280px  |
| Large      | > 1280px       |

---

## 📄 Credits

- **Fonts:** [Google Fonts – Inter & Outfit](https://fonts.google.com)
- **Icons:** [Font Awesome 6](https://fontawesome.com)
- **Placeholder images:** [Unsplash](https://unsplash.com)
- **Avatars:** [Unavatar / pravatar.cc](https://pravatar.cc)

---

## 📝 Changelog

### v1.0.0 — March 2025
- Initial release
- 6 public pages + 2 dashboards
- Dark/light theme toggle + RTL support
- Full form validation suite
- WCAG 2.1 AA compliant

---

## 💬 Support

Open an issue or contact `hello@toolshare.org` for customization help.
