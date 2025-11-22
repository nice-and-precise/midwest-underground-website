# Project Index: Midwest Underground Website

**Generated:** 2025-11-21
**Branch:** feat/nextjs-migration
**Status:** 40% Complete - Infrastructure Ready, Features Need Implementation

---

## 📁 Project Structure

```
midwest-underground-website/
├── src/                          # Next.js application source
│   ├── app/                      # App Router pages & API
│   │   ├── page.tsx             # Homepage
│   │   ├── layout.tsx           # Root layout
│   │   ├── api/                 # API Routes (24 endpoints)
│   │   │   ├── auth/            # Authentication
│   │   │   ├── 811-tickets/     # 811 compliance API
│   │   │   ├── bore-logs/       # Bore management API
│   │   │   ├── customers/       # Customer API
│   │   │   ├── equipment/       # Equipment API
│   │   │   ├── field-reports/   # Daily reports API
│   │   │   ├── financials/      # Financial API
│   │   │   ├── hdd/             # HDD-specific APIs
│   │   │   ├── inspections/     # QA/QC API
│   │   │   └── projects/        # Project API
│   │   ├── dashboard/           # Dashboard pages (32 pages)
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── 811-tickets/     # 811 compliance pages
│   │   │   ├── bore-logs/       # Bore tracking pages
│   │   │   ├── customers/       # Customer management
│   │   │   ├── equipment/       # Equipment tracking
│   │   │   ├── field-reports/   # Daily reports
│   │   │   ├── financials/      # Financial overview
│   │   │   ├── hdd/             # HDD operations
│   │   │   ├── inspections/     # QA/QC inspections
│   │   │   ├── projects/        # Project management
│   │   │   └── reports/         # Reporting
│   │   └── auth/                # Authentication pages
│   │       └── login/           # Login page
│   ├── components/              # React components
│   │   ├── DarkModeToggle.tsx   # Theme switcher
│   │   ├── LoginForm.tsx        # Login form
│   │   ├── MobileMenu.tsx       # Mobile navigation
│   │   ├── ParallaxHero.tsx     # Hero component
│   │   ├── ParallaxSection.tsx  # Parallax sections
│   │   └── hdd/                 # HDD components
│   │       ├── KPIDashboard.tsx # KPI metrics
│   │       └── OfflineSyncIndicator.tsx
│   ├── lib/                     # Utilities & services
│   │   ├── prisma.ts            # Database client
│   │   ├── validations.ts       # Zod schemas
│   │   ├── offlineSync.ts       # Offline sync logic
│   │   └── services/
│   │       └── kpiService.ts    # KPI calculations
│   ├── types/                   # TypeScript types
│   │   └── next-auth.d.ts       # Auth type extensions
│   ├── auth.ts                  # NextAuth config
│   └── middleware.ts            # Route protection
├── prisma/                      # Database
│   ├── schema.prisma            # Database schema (17+ models)
│   └── prisma/                  # Generated artifacts
├── public/                      # Static assets
│   ├── images/                  # Image files
│   ├── css/                     # Legacy CSS (migrated)
│   └── js/                      # Legacy JS (migrated)
├── docs/                        # Documentation (26 files)
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── MAINTENANCE.md
│   ├── features/                # Feature docs
│   └── ...
├── dashboard/                   # Legacy HTML dashboard (reference)
├── api/                         # Legacy API data (reference)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── .env                         # Environment variables
└── README.md                    # Project overview
```

---

## 🚀 Entry Points

### Main Application
- **Homepage:** `src/app/page.tsx` - Public-facing homepage
- **Root Layout:** `src/app/layout.tsx` - Shared layout with header/footer
- **Dashboard:** `src/app/dashboard/page.tsx` - Protected dashboard home

### Authentication
- **Login Page:** `src/app/auth/login/page.tsx` - User login
- **Auth API:** `src/app/api/auth/[...nextauth]/route.ts` - NextAuth.js endpoint
- **Auth Config:** `src/auth.ts` - NextAuth configuration
- **Middleware:** `src/middleware.ts` - Route protection

### Database
- **Schema:** `prisma/schema.prisma` - Full database schema (480 lines)
- **Client:** `src/lib/prisma.ts` - Prisma client singleton

---

## 📦 Core Modules

### API Routes (24 endpoints)
**Status:** ⚠️ STUBS ONLY - Return mock data, no database operations

1. **Authentication API**
   - Path: `src/app/api/auth/[...nextauth]/route.ts`
   - Purpose: NextAuth.js authentication handlers

2. **Projects API**
   - GET/POST: `src/app/api/projects/route.ts`
   - GET/PUT/DELETE: `src/app/api/projects/[id]/route.ts`
   - Purpose: Project CRUD operations

3. **Bore Logs API**
   - GET/POST: `src/app/api/bore-logs/route.ts`
   - GET/PUT/DELETE: `src/app/api/bore-logs/[id]/route.ts`
   - Purpose: HDD bore tracking

4. **Daily Reports API**
   - GET/POST: `src/app/api/field-reports/route.ts`
   - GET/PUT/DELETE: `src/app/api/field-reports/[id]/route.ts`
   - Purpose: Field report management

5. **811 Compliance API**
   - GET/POST: `src/app/api/811-tickets/route.ts`
   - GET/PUT/DELETE: `src/app/api/811-tickets/[id]/route.ts`
   - Purpose: Utility locate ticket tracking

6. **HDD Operations APIs**
   - `src/app/api/hdd/projects/route.ts` - HDD project data
   - `src/app/api/hdd/daily-reports/route.ts` - Daily bore logs
   - `src/app/api/hdd/rod-passes/route.ts` - Rod-by-rod logging
   - `src/app/api/hdd/kpis/route.ts` - KPI metrics
   - `src/app/api/hdd/811-tickets/route.ts` - 811 tickets
   - `src/app/api/hdd/811-tickets/[id]/responses/route.ts` - Ticket responses

7. **Supporting APIs**
   - Customers: `src/app/api/customers/route.ts`
   - Equipment: `src/app/api/equipment/route.ts`
   - Inspections: `src/app/api/inspections/route.ts`
   - Financials: `src/app/api/financials/route.ts`

### Dashboard Pages (32 pages)
**Status:** ⚠️ PLACEHOLDERS - UI exists but no functionality

1. **Dashboard Home** - `src/app/dashboard/page.tsx`
   - KPI overview, quick actions, recent activity

2. **Bore Logs** (3 pages)
   - List: `src/app/dashboard/bore-logs/page.tsx`
   - Detail: `src/app/dashboard/bore-logs/[id]/page.tsx`

3. **Field Reports** (3 pages)
   - List: `src/app/dashboard/field-reports/page.tsx`
   - New: `src/app/dashboard/field-reports/new/page.tsx`
   - Detail: `src/app/dashboard/field-reports/[id]/page.tsx`

4. **Projects** (2 pages)
   - List: `src/app/dashboard/projects/page.tsx`
   - Detail: `src/app/dashboard/projects/[id]/page.tsx`

5. **811 Compliance** (2 pages)
   - List: `src/app/dashboard/811-tickets/page.tsx`
   - Detail: `src/app/dashboard/811-tickets/[id]/page.tsx`

6. **HDD Operations** (3 pages)
   - Daily Report: `src/app/dashboard/hdd/daily-report/page.tsx`
   - Rod Logger: `src/app/dashboard/hdd/rod-logger/page.tsx`
   - 811 Compliance: `src/app/dashboard/hdd/811-compliance/page.tsx`

7. **Supporting Pages**
   - Customers (2 pages)
   - Equipment (2 pages)
   - Inspections (2 pages)
   - Financials (1 page)
   - Reports (1 page)

### Components (8 files)

1. **DarkModeToggle** - `src/components/DarkModeToggle.tsx`
   - Client component for theme switching
   - Supports light/dark modes with system preference

2. **LoginForm** - `src/components/LoginForm.tsx`
   - Login form with email/password
   - Client-side validation

3. **MobileMenu** - `src/components/MobileMenu.tsx`
   - Responsive mobile navigation
   - Hamburger menu implementation

4. **ParallaxHero** - `src/components/ParallaxHero.tsx`
   - Homepage hero section with parallax effect

5. **ParallaxSection** - `src/components/ParallaxSection.tsx`
   - Reusable parallax section component

6. **KPIDashboard** - `src/components/hdd/KPIDashboard.tsx`
   - HDD KPI metrics display
   - Charts and statistics

7. **OfflineSyncIndicator** - `src/components/hdd/OfflineSyncIndicator.tsx`
   - Shows offline sync status
   - Queue indicator

### Utilities & Services

1. **Prisma Client** - `src/lib/prisma.ts`
   - Singleton database client
   - Prevents connection pool issues in dev

2. **Validations** - `src/lib/validations.ts`
   - Zod schemas for API validation
   - Type-safe form validation

3. **Offline Sync** - `src/lib/offlineSync.ts`
   - IndexedDB integration
   - Background sync queue

4. **KPI Service** - `src/lib/services/kpiService.ts`
   - KPI calculation logic
   - Metrics aggregation

---

## 🗄️ Database Schema

**ORM:** Prisma
**Development DB:** SQLite (`prisma/dev.db`)
**Production DB:** PostgreSQL (not yet configured)

### Models (17 total)

#### User Management
- **User** - Authentication, roles (OWNER, SUPER, CREW)

#### Project Management
- **Project** - HDD projects with budget, timeline, customer
- **Customer** (implied, not in current schema)

#### HDD Operations
- **Bore** - Individual bore paths with alignment, depth profile
- **RodPass** - Rod-by-rod logging (pilot, reaming passes)
- **Pit** - Entry/exit pits with GPS coordinates

#### Field Documentation
- **DailyReport** - Daily field reports with crew, production, costs
- **ReportAudit** - Audit trail for report changes
- **Inspection** - QA/QC inspections with corrective actions
- **CorrectiveAction** - Actions taken from inspections
- **Event** - Significant events (frac-outs, obstructions)

#### Project Management
- **RFI** - Requests for Information
- **TMTicket** - Time & Materials tickets
- **ChangeOrder** - Change orders with budget impact

#### Compliance
- **Ticket811** - 811 utility locate compliance tracking
- **Ticket811Response** - Utility company responses

### Schema Highlights
- All models have timestamps (createdAt, updatedAt)
- Foreign key relationships with cascade deletes
- JSON fields for flexible data (alignment, depth profiles, location)
- Enum types for status tracking
- Audit logging built-in

---

## 🔧 Configuration Files

### Core Configuration
- **package.json** - Dependencies, scripts
  - Next.js 15.0.3
  - React 18.3.1
  - Prisma 6.0.1
  - NextAuth 5.0.0-beta.29
  - Tailwind CSS 3.4.1

- **tsconfig.json** - TypeScript configuration
  - Strict mode enabled
  - Path aliases (@/components, @/lib, etc.)

- **next.config.js** - Next.js configuration
  - Image optimization
  - Environment variables

- **tailwind.config.js** - Tailwind CSS configuration
  - Custom color palette
  - Custom spacing
  - Dark mode support

### Environment Variables
- **DATABASE_URL** - Prisma database connection
- **NEXTAUTH_URL** - NextAuth base URL
- **NEXTAUTH_SECRET** - Session encryption key
- **NEXT_PUBLIC_APP_URL** - Public app URL

### Deployment
- **netlify.toml** - Netlify deployment configuration

---

## 📚 Documentation

### Root Documentation (12 files)
- **README.md** - Project overview, quick start
- **CLAUDE.md** - AI assistant context
- **MIGRATION-TO-NEXTJS.md** - Migration guide (200 lines)
- **MIGRATION-STATUS.md** - Current migration status
- **FINAL-COMPLETION-REPORT.md** - Latest completion report
- **QA-TEST-RESULTS.md** - Test results
- **DEPLOYMENT-GUIDE.md** - Deployment instructions
- **QUICK-START.md** - Quick start guide
- **CHECKLIST.md** - Pre-launch checklist
- **PROJECT-SUMMARY.md** - Project summary
- **CONTENT-GUIDE.md** - Content guidelines
- **BRAND-UPDATE.md** - Brand guidelines

### Technical Documentation (docs/)
- **ARCHITECTURE.md** - System architecture
- **DEPLOYMENT.md** - Deployment procedures
- **MAINTENANCE.md** - Maintenance guide
- **DASHBOARD-USER-GUIDE.md** - Dashboard user guide
- **DARK-MODE-TEST-PLAN.md** - Dark mode testing
- **PLACEHOLDERS.md** - Content placeholders
- **LOGO-USAGE.md** - Logo guidelines
- **CONTRAST-GUIDE.md** - Accessibility contrast guide

### Feature Documentation (docs/features/)
- **DARK-MODE.md** - Dark mode implementation
- **SERVICE-REQUEST-FORM.md** - Service form spec
- **INVOICE-PAYMENT.md** - Payment processing
- **BUSINESS-DASHBOARD.md** - Dashboard features

---

## 🧪 Test Coverage

**Status:** ❌ NO TESTS
- **Unit Tests:** 0 files
- **Integration Tests:** 0 files
- **E2E Tests:** 0 files
- **Test Coverage:** 0%

**Test Files Needed:**
- API route tests
- Component tests
- Authentication tests
- Database tests

---

## 🔗 Key Dependencies

### Core Framework
- **next:** 15.0.3 - React framework with SSR/SSG
- **react:** 18.3.1 - UI library
- **react-dom:** 18.3.1 - DOM renderer

### Database & ORM
- **@prisma/client:** 6.0.1 - Database client
- **prisma:** 6.0.1 - ORM and migrations

### Authentication
- **next-auth:** 5.0.0-beta.29 - Authentication
- **bcryptjs:** 2.4.3 - Password hashing

### UI Libraries
- **@radix-ui/*** - Headless UI components
  - react-alert-dialog, react-dialog, react-dropdown-menu
  - react-label, react-select, react-separator, react-slot
  - react-tabs, react-toast
- **lucide-react:** 0.460.0 - Icon library
- **chart.js:** 4.4.7 - Charting library
- **react-chartjs-2:** 5.3.0 - React wrapper for Chart.js
- **leaflet:** 1.9.4 - Interactive maps

### Styling
- **tailwindcss:** 3.4.1 - Utility-first CSS
- **tailwindcss-animate:** 1.0.7 - Animation utilities
- **tailwind-merge:** 2.5.4 - Class merging utility
- **class-variance-authority:** 0.7.1 - Component variants
- **clsx:** 2.1.1 - Conditional classes

### Validation
- **zod:** 3.25.76 - Schema validation

### Build Tools
- **typescript:** 5.x - Type checking
- **eslint:** 9.x - Linting
- **postcss:** 8.x - CSS processing
- **sharp:** 0.34.4 - Image optimization

---

## 📝 Quick Start

### Development Setup
```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma generate
npx prisma db push

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start dev server
npm run dev
# Visit http://localhost:3000
```

### Database Management
```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Generate Prisma Client
npx prisma generate
```

### Build & Deploy
```bash
# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## ⚠️ Known Issues & Incomplete Features

### Critical Issues
1. **All API routes are STUBS** - Return mock data only
2. **No authentication flow** - Login page doesn't work
3. **Dashboard pages are PLACEHOLDERS** - No real functionality
4. **No database seeding** - Empty database
5. **Zero test coverage** - No tests exist

### Partially Implemented
1. **Dark mode** - Toggle works, some styling issues
2. **Responsive design** - Basic responsiveness, needs refinement
3. **Form validation** - Schemas defined, not integrated
4. **Offline sync** - Code exists, not functional

### Not Started
1. **Photo uploads** - No implementation
2. **PDF export** - No implementation
3. **Email notifications** - No implementation
4. **Search functionality** - No implementation
5. **Advanced filtering** - No implementation

---

## 🎯 Next Steps (Priority Order)

### Phase 1: Foundation (CRITICAL)
1. Database seeding with test data
2. Environment variable configuration
3. Update documentation

### Phase 2: Authentication (HIGH)
1. Implement login/logout flow
2. Session management
3. Protected route middleware
4. User registration (if needed)

### Phase 3: Core APIs (HIGH)
1. Projects API (full CRUD)
2. Bore Logs API (full CRUD)
3. Daily Reports API (full CRUD)
4. Rod Passes API (full CRUD)
5. 811 Tickets API (full CRUD)

### Phase 4: Dashboard UI (MEDIUM)
1. Dashboard homepage with KPIs
2. Bore logs list/detail pages
3. Field reports pages
4. Projects pages
5. 811 compliance pages

### Phase 5: Advanced Features (LOW)
1. KPI dashboard with charts
2. Offline sync functionality
3. Photo upload system
4. PDF export
5. Search & filters

### Phase 6: Testing (MEDIUM)
1. Unit tests for APIs
2. Integration tests for auth
3. Component tests
4. E2E tests (optional)

### Phase 7: Production (HIGH)
1. PostgreSQL migration
2. Production environment setup
3. Deploy to Vercel/Netlify
4. SSL and DNS configuration

---

## 📈 Completion Status

**Overall Progress:** 40% Complete

| Category | Status | Completion |
|----------|--------|------------|
| **Infrastructure** | ✅ Complete | 100% |
| **Database Schema** | ✅ Complete | 100% |
| **Authentication Config** | ✅ Complete | 100% |
| **Static Assets** | ✅ Complete | 100% |
| **Documentation** | ✅ Complete | 100% |
| **API Routes (Structure)** | ✅ Complete | 100% |
| **Dashboard Pages (Structure)** | ✅ Complete | 100% |
| **API Routes (Logic)** | ❌ Not Started | 0% |
| **Dashboard Pages (Logic)** | ❌ Not Started | 0% |
| **Authentication Flow** | ❌ Not Started | 0% |
| **Testing** | ❌ Not Started | 0% |
| **Advanced Features** | ❌ Not Started | 0% |

---

## 📞 Support

**Project Repository:** https://github.com/nice-and-precise/midwest-underground-website
**Branch:** feat/nextjs-migration
**Company:** Midwest Underground of Minnesota Inc
**Contact:** (320) 382-6636

---

**Last Updated:** 2025-11-21
**Index Version:** 1.0.0
