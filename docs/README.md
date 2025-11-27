# Documentation Index

Midwest Underground Website - Complete Documentation Hub

**Last Updated:** 2025-11-27
**Version:** 7.0.0
**Security Status:** Hardened (Audit Complete 2025-11-27)

---

## Quick Navigation

| Category | Description | Key Docs |
|----------|-------------|----------|
| [Getting Started](#-getting-started) | Setup & configuration | Quick Start, Installation |
| [Architecture](#-architecture) | System design | Overview, API, Database |
| [Development](#-development-guides) | Coding & testing | Dev Guide, Testing |
| [Features](#-features) | Feature documentation | Dashboard, Takeoff System |
| [Security](#-security) | Security practices | Audit Report, Hardening |
| [Brand](#-brand-standards) | Design standards | Colors, Typography |
| [AI](#-ai-integration) | Serena MCP system | Memories, Integration |

---

## Project Statistics (2025-11-27)

```
Next.js App:          34 pages, 32+ API routes
Database:             17 Prisma models
Components:           6 shared + 5 dashboard-specific
Tests:                113/133 passing (85%)
Security:             HARDENED (5 headers, auth fixed)
Space Cleanup:        37MB recovered (200+ files removed)
```

---

## Getting Started

Essential guides for new developers:

| Document | Purpose |
|----------|---------|
| **[Quick Start](getting-started/QUICK-START.md)** | 5-minute setup guide |
| **[Installation](getting-started/INSTALLATION.md)** | Full installation with prerequisites |
| **[Configuration](getting-started/CONFIGURATION.md)** | Environment variables and secrets |

**Quick Commands:**
```bash
npm install              # Install dependencies
npm run dev              # Start dev server (localhost:3000)
npx prisma db push       # Apply database schema
npm run db:seed          # Seed test data
```

---

## Architecture

System design and technical specifications:

| Document | Description |
|----------|-------------|
| **[Overview](architecture/OVERVIEW.md)** | High-level system architecture |
| **[Current State](architecture/CURRENT-STATE.md)** | Running system status |
| **[Route Groups](architecture/ROUTE-GROUPS.md)** | Next.js App Router structure |
| **[Database Schema](architecture/DATABASE-SCHEMA.md)** | 17 Prisma models explained |
| **[API Reference](architecture/API-REFERENCE.md)** | 32+ REST endpoints |
| **[Decisions](architecture/DECISIONS.md)** | Architecture Decision Records (ADRs) |
| **[Migration Guide](architecture/MIGRATION-GUIDE.md)** | Static HTML to Next.js evolution |

**Directory Structure:**
```
src/
├── app/                 # Next.js 15 App Router
│   ├── (marketing)/     # Public pages (homepage)
│   ├── api/             # 32+ REST API routes
│   ├── auth/            # Login page
│   └── dashboard/       # 22 protected dashboard pages
├── components/          # React components
│   ├── dashboard/       # Sidebar, Header, Navigation
│   ├── hdd/             # BoreLogCard, etc.
│   └── photos/          # PhotoGallery, Uploader
└── lib/                 # Utilities (prisma, validations)
```

---

## Development Guides

Day-to-day development workflows:

| Document | Purpose |
|----------|---------|
| **[Development](guides/DEVELOPMENT.md)** | Local workflow, linting, formatting |
| **[Testing](guides/TESTING.md)** | Vitest unit & Playwright E2E |
| **[Deployment](guides/DEPLOYMENT.md)** | Production deployment |
| **[Troubleshooting](guides/TROUBLESHOOTING.md)** | Common issues and solutions |
| **[Database Quick Start](guides/DATABASE-QUICK-START.md)** | Prisma commands cheatsheet |
| **[MCP Servers](guides/MCP-SERVERS.md)** | MCP configuration guide |
| **[MCP Startup](guides/MCP-STARTUP-GUIDE.md)** | MCP initialization |
| **[Quick Start After Restart](guides/QUICK-START-AFTER-RESTART.md)** | Session recovery |

**Additional Guides:**
- [Content Guide](guides/CONTENT-GUIDE.md) - Writing content
- [Website Structure](guides/WEBSITE-STRUCTURE-GUIDE.md) - Site organization
- [Image Optimization](guides/IMAGE-OPTIMIZATION-RECOMMENDATIONS.md) - Performance

**Checklists:**
- [Pre-Launch Checklist](guides/PRE-LAUNCH-CHECKLIST.md)
- [QA Audit Checklist](guides/QA-AUDIT-CHECKLIST.md)
- [Development Checklists](guides/CHECKLISTS.md)

---

## Features

Feature-specific documentation:

### Core Features
| Feature | Document |
|---------|----------|
| **Business Dashboard** | [BUSINESS-DASHBOARD.md](features/BUSINESS-DASHBOARD.md) |
| **Dark Mode** | [DARK-MODE.md](features/DARK-MODE.md) |
| **Service Request Form** | [SERVICE-REQUEST-FORM.md](features/SERVICE-REQUEST-FORM.md) |
| **Invoice Payment** | [INVOICE-PAYMENT.md](features/INVOICE-PAYMENT.md) |

### Takeoff System
The PDF measurement and estimating tool:

| Document | Description |
|----------|-------------|
| **[Architecture](takeoff/ARCHITECTURE.md)** | Takeoff system design |
| **[Progress](takeoff/PROGRESS.md)** | Implementation status |
| **[Memory](takeoff/MEMORY.md)** | Serena memory integration |
| **[Testing](takeoff/TESTING.md)** | Test coverage |
| **[Test Results](takeoff/TEST-RESULTS.md)** | Latest test execution |
| **[Testing Conventions](takeoff/TESTING-CONVENTIONS.md)** | Test naming standards |

**Takeoff Modules:**
- `takeoff/modules/` - Module specifications
- `takeoff/plans/` - Implementation plans
- `takeoff/serena/` - Serena memories for takeoff

---

## Security

Security documentation and audit reports:

| Document | Purpose |
|----------|---------|
| **[Security Audit Report](AUDIT-REPORT-2025-11-27.md)** | Complete security audit |
| **[SECURITY.md](../SECURITY.md)** | Security policy |

**Security Status (2025-11-27):**
- Authentication bypass in middleware **FIXED**
- Strong 256-bit NEXTAUTH_SECRET **GENERATED**
- 5 security headers **CONFIGURED**
- File upload magic number validation **IMPLEMENTED**
- Path traversal protection **IMPLEMENTED**
- 200+ dead files **REMOVED**

---

## Brand Standards

Visual design and naming conventions:

| Document | Purpose |
|----------|---------|
| **[Brand Standards](brand/BRAND-STANDARDS.md)** | Colors, typography, design tokens |
| **[Naming Conventions](brand/NAMING-CONVENTIONS.md)** | Files, code, API, database, git |
| **[Logo Usage](brand/LOGO-USAGE.md)** | Logo variants and guidelines |

**Official Color Palette:**
- Charcoal: `#23272A` (primary text)
- Safety Orange: `#FF5A1F` (CTA accent)
- Steel: `#4F5B66` (secondary)
- Sand: `#F2EDE5` (backgrounds)
- Utility Yellow: `#FFC400` (highlights)

---

## AI Integration

Serena MCP memory system and AI agent coordination:

| Document | Purpose |
|----------|---------|
| **[Serena System](ai/SERENA-SYSTEM.md)** | Serena MCP overview |
| **[Serena Integration Guide](ai/SERENA-INTEGRATION-GUIDE.md)** | Memory patterns |
| **[AI Context Audit](ai/AI-CONTEXT-AUDIT.md)** | Context file inventory |

**Key AI Context Files:**
- `CLAUDE.md` - Primary AI context (root)
- `PROJECT_INDEX.md` - Token-efficient index
- `.serena/memories/` - 90+ Serena memories

---

## Additional Documentation

### Root-Level Documents
| File | Purpose |
|------|---------|
| [README.md](../README.md) | Project overview |
| [CLAUDE.md](../CLAUDE.md) | AI agent context |
| [PROJECT_INDEX.md](../PROJECT_INDEX.md) | Token-efficient project index |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Contribution guidelines |
| [CHANGELOG.md](../CHANGELOG.md) | Version history |
| [SECURITY.md](../SECURITY.md) | Security policy |

### Planning & Reports
| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture overview |
| [BRAND-REFRESH-SUMMARY.md](BRAND-REFRESH-SUMMARY.md) | Brand update summary |
| [BRANCH-MERGE-STRATEGY.md](BRANCH-MERGE-STRATEGY.md) | Git workflow |
| [CONTRAST-AUDIT.md](CONTRAST-AUDIT.md) | Accessibility audit |
| [CONTRAST-GUIDE.md](CONTRAST-GUIDE.md) | Color contrast guidelines |
| [DARK-MODE-TEST-PLAN.md](DARK-MODE-TEST-PLAN.md) | Dark mode testing |
| [DASHBOARD-USER-GUIDE.md](DASHBOARD-USER-GUIDE.md) | User documentation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Deployment notes |
| [FEATURE-REQUESTS.md](FEATURE-REQUESTS.md) | Feature backlog |
| [FEATURES.md](FEATURES.md) | Feature overview |
| [MAINTENANCE.md](MAINTENANCE.md) | Maintenance procedures |
| [PLACEHOLDERS.md](PLACEHOLDERS.md) | Placeholder content |
| [SERVICE-AREA-MAP-PLAN.md](SERVICE-AREA-MAP-PLAN.md) | Map implementation |
| [VALIDATION-RESULTS.md](VALIDATION-RESULTS.md) | Validation reports |

### Archives
Historical documentation in `archive/`:
- `archive/sessions/` - Session logs and handoffs
- `archive/planning/` - Completed planning documents
- `archive/reports/` - Build and status reports
- `archive/deprecated/` - Superseded documentation

See [archive/ARCHIVE-LOG.md](archive/ARCHIVE-LOG.md) for mappings.

### Checklists & Procedures
| Directory | Purpose |
|-----------|---------|
| `checklists/` | Development checklists |
| `procedures/` | Operational procedures |
| `screenshots/` | Visual documentation |

---

## Database Models (17 Total)

```
Core                    HDD Operations          Financial
─────────────────────   ─────────────────────   ─────────────────────
User                    Project                 TMTicket
                        Bore                    ChangeOrder
                        RodPass
                        DailyReport             Compliance
                        Inspection              ─────────────────────
                        CorrectiveAction        Ticket811
                        RFI                     Ticket811Response
                        Event
                        Pit                     Assets
                        ReportAudit             ─────────────────────
                                                Photo
```

---

## API Endpoints (32+)

```
Authentication          HDD Operations          Resources
─────────────────────   ─────────────────────   ─────────────────────
POST /api/auth/*        /api/projects/*         /api/customers/*
                        /api/bore-logs/*        /api/equipment/*
Dashboard               /api/hdd/rod-passes/*   /api/inspections/*
─────────────────────   /api/hdd/daily-reports/* /api/photos/*
/api/kpis/*             /api/hdd/811-tickets/*  /api/field-reports/*
/api/kpis/overview      /api/811-tickets/*      /api/financials/*
/api/kpis/crew/*
/api/kpis/project/*
```

---

## Quick Search

```bash
# Search all docs for a keyword
grep -ri "keyword" docs/

# List all markdown files
find docs/ -name "*.md" | wc -l   # ~130 files

# Find specific topic
find docs/ -name "*KEYWORD*"
```

---

## Contributing to Documentation

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

**Documentation Standards:**
1. Use SCREAMING-KEBAB-CASE for doc filenames
2. Include "Last Updated" timestamps
3. Keep internal links relative
4. Run `npm run docs:validate` before committing

---

*Last Updated: 2025-11-27 | Maintained by @nice-and-precise*
