# Midwest Underground of Minnesota Inc - HDD Operations Platform

Professional HDD field operations management system for a 34-year directional drilling contractor.

[![Build Status](https://github.com/nice-and-precise/midwest-underground-website/actions/workflows/ci.yml/badge.svg)](https://github.com/nice-and-precise/midwest-underground-website/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red)](./LICENSE)

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/nice-and-precise/midwest-underground-website.git
cd midwest-underground-website

# Install dependencies
npm install

# Setup database (adjust if you use migrations)
npx prisma db push
npx ts-node --project tsconfig.seed.json prisma/seed.ts

# Start development server
npm run dev

# Visit http://localhost:3000
```

**Test Credentials:**

* Email: `owner@midwestunderground.com`
* Password: `password123`

📖 **[Complete Setup Guide →](docs/getting-started/QUICK-START.md)**

---

## 💼 About

**Company:** Midwest Underground of Minnesota Inc
**Location:** 4320 County Rd 8 SE, Willmar, MN 56201
**Phone:** (320) 382-6636
**Industry:** Horizontal Directional Drilling, Fiber Optic Installation, Underground Utilities
**Founded:** 1991 (34+ years experience)

**Business Opportunity:** Positioned to capture share of Minnesota's broadband funding (for example BEAD program).

---

## 🛠️ Technology Stack

* **Frontend:** Next.js 15.0.3 (App Router) + React 18.3.1 + TypeScript 5.x
* **Backend:** Next.js API Routes + Prisma ORM 6.0.1
* **Database:** SQLite (development) / PostgreSQL (production-ready)
* **Authentication:** NextAuth v5.0.0-beta.29 (Auth.js) with JWT
* **Styling:** Tailwind CSS 3.4.1 + custom CSS
* **Testing:** Vitest 4.0.13 (unit) + Playwright 1.56.1 (E2E)
* **Deployment:** Vercel-ready, Netlify-compatible, custom infra friendly

📐 **[View Complete Architecture →](docs/architecture/OVERVIEW.md)**

---

## ✨ Features

### Core Platform

* ✅ Project management (HDD projects, jobs, and work orders)
* ✅ Bore log tracking with rod passes and lengths
* ✅ Daily field reports for crews and supervisors
* ✅ Photo management (uploads, galleries, project associations)
* ✅ 811 ticket system for utility locates
* ✅ Equipment tracking and maintenance
* ✅ Customer management with history

### Operations & Analytics

* ✅ Real-time KPIs and dashboards
* ✅ Value stream mapping tools
* ✅ Role-based access (OWNER / SUPER / CREW)
* ✅ Responsive design from 375px up to large desktops
* ✅ Dark mode with system detection
* ✅ Service-worker-ready for offline enhancements

🔎 **[View All Features →](docs/FEATURES.md)**

---

## 📚 Documentation

**Getting Started**

* [Quick Start](docs/getting-started/QUICK-START.md)
* [Installation](docs/getting-started/INSTALLATION.md)
* [Configuration](docs/getting-started/CONFIGURATION.md)

**Architecture**

* [System Overview](docs/architecture/OVERVIEW.md)
* [Current State](docs/architecture/CURRENT-STATE.md)
* [Database Schema](docs/architecture/DATABASE-SCHEMA.md)
* [API Reference](docs/architecture/API-REFERENCE.md)
* [Architecture Decisions](docs/architecture/DECISIONS.md)
* [Migration Guide](docs/architecture/MIGRATION-GUIDE.md)

**Development**

* [Development Guide](docs/guides/DEVELOPMENT.md)
* [Testing Guide](docs/guides/TESTING.md)
* [Deployment Guide](docs/guides/DEPLOYMENT.md)
* [Troubleshooting](docs/guides/TROUBLESHOOTING.md)
* [Checklists](docs/guides/CHECKLISTS.md)

**Brand**

* [Brand Standards](docs/brand/BRAND-STANDARDS.md)
* [Naming Conventions](docs/brand/NAMING-CONVENTIONS.md)
* [Logo Usage](docs/brand/LOGO-USAGE.md)

**AI & Automation**

* [Serena System](docs/ai/SERENA-SYSTEM.md)
* [Serena Integration Guide](docs/ai/SERENA-INTEGRATION-GUIDE.md)
* [AI Context Audit](docs/ai/AI-CONTEXT-AUDIT.md)

📖 **[Full Documentation Index →](docs/README.md)**

---

## 🎨 Brand Colors

**Official Palette:**

* **Charcoal:** `#23272A` (primary)
* **Safety Orange:** `#FF5A1F` (CTAs, accents)
* **Steel:** `#4F5B66` (secondary)
* **Sand:** `#F2EDE5` (backgrounds)
* **Utility Yellow:** `#FFC400` (highlights)

📘 **[Brand Standards →](docs/brand/BRAND-STANDARDS.md)**

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

📗 **[Testing Guide →](docs/guides/TESTING.md)**

---

## 📦 Project Structure

```text
midwest-underground-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # RESTful API endpoints
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Protected dashboard pages
│   │   └── page.tsx           # Public homepage
│   ├── components/            # React components
│   ├── lib/                   # Core utilities
│   └── types/                 # TypeScript definitions
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Seed data
├── tests/                     # Vitest + Playwright
├── docs/                      # Documentation
└── public/                    # Static assets
```

🗂 **[Detailed Structure →](PROJECT_INDEX.md)**

---

## 🚢 Deployment

**Example Options:**

1. **Vercel** (recommended for Next.js)
2. **Netlify**
3. **AWS** (for example ECS + RDS)
4. **Custom VPS** (via Docker)

🧾 **[Deployment Guide →](docs/guides/DEPLOYMENT.md)**

---

## 🔐 Security

* NextAuth v5 for sessions
* JWT with httpOnly cookies
* bcryptjs password hashing
* Role-based access control
* CSRF protection
* SQL injection protection via Prisma
* XSS guarded by React

🔐 **[Security Policy →](./SECURITY.md)**

---

## 🤝 Contributing

We welcome contributions. Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

Typical workflow:

1. Fork repository
2. Create feature branch (`feat/feature-name`)
3. Implement changes with tests
4. Open pull request

---

## 📄 License

© 2025 Midwest Underground of Minnesota Inc. All rights reserved.
See [LICENSE](./LICENSE) for details.

---

## 📞 Contact

**Midwest Underground of Minnesota Inc**
4320 County Rd 8 SE
Willmar, MN 56201
Phone: (320) 382-6636
Email: [info@midwestundergroundmn.com](mailto:info@midwestundergroundmn.com)

---

**Built with:** Next.js, TypeScript, Prisma, NextAuth
**Version:** 2.0.0
**Last Updated:** 2025-11-23
