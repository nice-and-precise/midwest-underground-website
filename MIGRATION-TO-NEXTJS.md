# Next.js Migration Documentation

**Date:** October 25, 2025
**Branch:** `feat/nextjs-migration`
**Status:** 🟢 In Progress - Infrastructure Complete, Building Features

---

## 📋 Table of Contents

1. [Migration Overview](#migration-overview)
2. [Why Next.js?](#why-nextjs)
3. [What Changed](#what-changed)
4. [Database Schema](#database-schema)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Setup Instructions](#setup-instructions)
8. [Development Workflow](#development-workflow)
9. [API Routes](#api-routes)
10. [Authentication](#authentication)
11. [Migration Status](#migration-status)
12. [Testing Checklist](#testing-checklist)
13. [Deployment Notes](#deployment-notes)

---

## Migration Overview

We're migrating the Midwest Underground website from a static HTML/CSS/JavaScript site to a full-stack Next.js application to support advanced HDD (Horizontal Directional Drilling) field operations management features.

### Key Drivers

- **HDD Field Operations App Integration** - Need backend database and API
- **Procore-Inspired Dashboard** - Advanced project management features
- **Real-time Data Tracking** - Bore logs, field reports, 811 compliance
- **Role-Based Access Control** - OWNER, SUPER, CREW permissions
- **Offline-First Capability** - Field crews work without internet
- **Audit Logging** - Track all changes to reports and data

### Migration Approach

- ✅ **Safe Migration** - New code on separate branch (`feat/nextjs-migration`)
- ✅ **Preserve Existing Work** - All static site files retained
- ✅ **Incremental Testing** - Test thoroughly before merging to main
- ✅ **No Loss of Progress** - Can rollback if needed

---

## Why Next.js?

### Benefits

1. **Full-Stack Framework** - Backend API + Frontend in one codebase
2. **TypeScript Support** - Type safety reduces bugs
3. **API Routes** - Build REST APIs without separate backend
4. **Server-Side Rendering (SSR)** - Better SEO than client-side apps
5. **Static Site Generation (SSG)** - Keep fast loading for public pages
6. **File-Based Routing** - Intuitive page structure
7. **Built-in Optimization** - Images, fonts, code splitting
8. **Easy Deployment** - Deploy to Vercel, Netlify, AWS, etc.
9. **Production Ready** - Used by Fortune 500 companies

### Why Not Alternatives?

- **Pure React** - No built-in API or SSR
- **Vue/Nuxt** - Less TypeScript ecosystem
- **Remix** - Newer, smaller ecosystem
- **SvelteKit** - Less corporate adoption
- **Django/Rails** - Separate frontend/backend complexity

---

## What Changed

### Before (Static Site)
```
midwest-underground-website/
├── index.html
├── services.html
├── about.html
├── contact.html
├── projects.html
├── dashboard/
│   ├── index.html
│   ├── bore-logs.html
│   ├── field-reports.html
│   ├── projects.html
│   ├── financials.html
│   ├── customers.html
│   ├── equipment.html
│   └── reports.html
├── css/
│   ├── styles.css
│   └── dashboard.css
└── js/
    ├── main.js
    └── dashboard.js
```

### After (Next.js App)
```
midwest-underground-website/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage (/)
│   │   ├── globals.css           # Global styles
│   │   ├── api/                  # Backend API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/route.ts
│   │   │   └── hdd/              # HDD API endpoints
│   │   │       ├── bores/route.ts
│   │   │       ├── daily-reports/route.ts
│   │   │       ├── rod-passes/route.ts
│   │   │       ├── inspections/route.ts
│   │   │       └── 811-tickets/route.ts
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── bore-logs/page.tsx
│   │   │   ├── field-reports/page.tsx
│   │   │   └── projects/page.tsx
│   │   └── auth/                 # Auth pages
│   │       ├── login/page.tsx
│   │       └── register/page.tsx
│   ├── components/               # React components
│   ├── lib/                      # Utilities
│   │   ├── prisma.ts            # Database client
│   │   └── auth.ts              # Auth config
│   └── types/                    # TypeScript types
│       └── next-auth.d.ts
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # SQLite database (dev)
├── public/                      # Static files
│   ├── images/
│   ├── css/                     # Legacy CSS (reference)
│   └── js/                      # Legacy JS (reference)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.js               # Next.js config
├── .env                         # Environment variables
└── .env.local                   # Local environment variables
```

---

## Database Schema

We're using **Prisma ORM** with **SQLite** (development) / **PostgreSQL** (production).

### Key Models

#### Core Operations
- **User** - Authentication, roles (OWNER, SUPER, CREW)
- **Project** - HDD projects with budget, timeline, customer
- **Bore** - Individual bore paths with alignment, depth profile
- **RodPass** - Rod-by-rod logging (pilot, reaming passes)

#### Field Documentation
- **DailyReport** - Daily field reports with crew, production, costs
- **ReportAudit** - Audit trail for report changes
- **Inspection** - QA/QC inspections with corrective actions
- **Event** - Significant events (frac-outs, obstructions)

#### Project Management
- **RFI** - Requests for Information
- **TMTicket** - Time & Materials tickets
- **ChangeOrder** - Change orders with budget impact
- **Ticket811** - 811 utility locate compliance tracking

#### Spatial Data
- **Pit** - Entry/exit pits with GPS coordinates

### Database File Locations

- **Development:** `prisma/dev.db` (SQLite)
- **Production:** PostgreSQL (connection string in `.env`)

### Schema Management Commands

```bash
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Push schema to database (no migrations)
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Create migration (production)
npx prisma migrate dev --name migration_name
```

---

## Tech Stack

### Core Framework
- **Next.js 15.0.3** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript** - Type-safe JavaScript

### Database & ORM
- **Prisma 6.0.1** - Database ORM
- **SQLite** - Development database
- **PostgreSQL** - Production database (recommended)

### Authentication
- **NextAuth.js 4.24.10** - Authentication solution
- **bcryptjs** - Password hashing

### UI & Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Alert Dialog, Dialog, Dropdown Menu, Label, Select
- **Lucide React** - Icon library

### Data Visualization
- **Chart.js 4.4.7** - Charts and graphs
- **react-chartjs-2 5.3.0** - React wrapper for Chart.js
- **Leaflet 1.9.4** - Interactive maps for bore alignments

### Validation
- **Zod 3.23.8** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Prisma CLI** - Database management

---

## Project Structure

### `/src/app` - Next.js App Router

**Convention:** File-based routing
- `page.tsx` = Page component
- `layout.tsx` = Layout wrapper
- `route.ts` = API endpoint
- `loading.tsx` = Loading state
- `error.tsx` = Error boundary

### `/src/components` - React Components

Reusable UI components (buttons, forms, tables, charts, etc.)

### `/src/lib` - Utilities

- `prisma.ts` - Database client singleton
- `auth.ts` - NextAuth configuration
- `utils.ts` - Helper functions

### `/src/types` - TypeScript Types

Type definitions and interfaces

### `/prisma` - Database

- `schema.prisma` - Database schema definition
- `dev.db` - SQLite database file (gitignored)

### `/public` - Static Assets

Images, fonts, legacy CSS/JS (served from `/`)

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd midwest-underground-website

# Checkout migration branch
git checkout feat/nextjs-migration

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma Client
npx prisma generate

# Create database schema
npx prisma db push

# (Optional) Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"  # SQLite for dev
# DATABASE_URL="postgresql://user:pass@localhost:5432/midwest_underground"  # PostgreSQL for prod

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Development Workflow

### Running the App

```bash
# Start development server (with hot reload)
npm run dev
# Visit http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Making Changes

1. **Edit code** in `src/` directory
2. **Save file** - Hot reload updates browser automatically
3. **Check terminal** for errors
4. **Test in browser** at http://localhost:3000

### Database Changes

```bash
# After editing prisma/schema.prisma:

# Generate Prisma Client (TypeScript types)
npx prisma generate

# Update database schema
npx prisma db push

# View changes in Prisma Studio
npx prisma studio
```

---

## API Routes

All API routes are in `src/app/api/`

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - User logout

### HDD Operations (Coming Soon)

- `GET /api/hdd/bores` - List all bores
- `POST /api/hdd/bores` - Create new bore
- `GET /api/hdd/bores/[id]` - Get bore details
- `PUT /api/hdd/bores/[id]` - Update bore
- `DELETE /api/hdd/bores/[id]` - Delete bore

- `GET /api/hdd/daily-reports` - List field reports
- `POST /api/hdd/daily-reports` - Create field report
- `GET /api/hdd/daily-reports/[id]` - Get report
- `PUT /api/hdd/daily-reports/[id]` - Update report
- `POST /api/hdd/daily-reports/[id]/sign` - Sign report

- `GET /api/hdd/rod-passes` - List rod passes
- `POST /api/hdd/rod-passes` - Log rod pass

- `GET /api/hdd/811-tickets` - List 811 tickets
- `POST /api/hdd/811-tickets` - Create ticket
- `GET /api/hdd/811-tickets/expiring` - Get expiring tickets

### API Response Format

```typescript
// Success
{
  "success": true,
  "data": { /* payload */ }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

---

## Authentication

### NextAuth Setup

- **Provider:** Credentials (email/password)
- **Session:** JWT-based
- **Password Hashing:** bcryptjs
- **Role-Based Access:** OWNER, SUPER, CREW

### User Roles

| Role | Permissions |
|------|------------|
| **OWNER** | Full access to all features, financial data, user management |
| **SUPER** | Project management, reports, inspections, no financial data |
| **CREW** | Field data entry, view assigned projects, limited editing |

### Protected Routes

```typescript
// Middleware checks authentication
// src/middleware.ts

import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/login'
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/api/hdd/:path*']
}
```

---

## Migration Status

### ✅ Completed

1. **Next.js Infrastructure**
   - Installed dependencies (492 packages)
   - Created Next.js app structure
   - Configured TypeScript
   - Set up Tailwind CSS

2. **Database Setup**
   - Created Prisma schema with 17+ models
   - Generated Prisma Client
   - Created SQLite database
   - Pushed schema to database

3. **Authentication**
   - Configured NextAuth.js
   - Created auth API routes
   - Set up type definitions
   - Configured JWT sessions

4. **Static Assets Migration**
   - Copied CSS to `public/css`
   - Copied JavaScript to `public/js`
   - Copied images to `public/images`
   - Migrated dashboard HTML to `public/dashboard` (for reference)

5. **Basic Pages**
   - Created homepage (`src/app/page.tsx`)
   - Created root layout (`src/app/layout.tsx`)
   - Migrated global CSS

6. **Development Server**
   - ✅ Next.js running at http://localhost:3000
   - ✅ No compilation errors
   - ✅ TypeScript configured correctly

### 🔄 In Progress

7. **Migration Documentation** (This file)
8. **Updating README and other docs**

### ⏳ Pending

9. **API Routes Implementation**
   - Bore management endpoints
   - Daily field reports endpoints
   - Rod-by-rod logging endpoints
   - Inspection endpoints
   - RFI endpoints
   - T&M ticket endpoints
   - Change order endpoints
   - 811 ticket endpoints

10. **Dashboard Pages**
    - Convert static HTML to React components
    - Implement data fetching
    - Add CRUD operations
    - Build bore logs page
    - Build field reports page
    - Build projects page

11. **Advanced Features**
    - Rod-by-rod logger component
    - 811 compliance tracker
    - Offline-first functionality (IndexedDB)
    - Photo upload and management
    - PDF report generation
    - KPI calculation service

12. **Testing**
    - Unit tests for API routes
    - Integration tests for auth
    - E2E tests for critical flows
    - Manual testing checklist

13. **Deployment**
    - Set up production database (PostgreSQL)
    - Configure environment variables
    - Deploy to hosting platform
    - DNS configuration

---

## Testing Checklist

### Phase 1: Infrastructure ✅
- [x] npm install succeeds
- [x] Prisma generate succeeds
- [x] Database created successfully
- [x] Next.js dev server starts
- [x] Homepage loads at http://localhost:3000
- [x] No console errors

### Phase 2: Authentication (Coming Soon)
- [ ] User registration works
- [ ] User login works
- [ ] Session persists on refresh
- [ ] Protected routes redirect to login
- [ ] Logout works
- [ ] Role-based access works

### Phase 3: API Routes (Coming Soon)
- [ ] Bore CRUD operations work
- [ ] Daily reports CRUD operations work
- [ ] Rod pass logging works
- [ ] 811 ticket tracking works
- [ ] Photo uploads work
- [ ] Error handling works

### Phase 4: Dashboard (Coming Soon)
- [ ] Dashboard layout renders
- [ ] Bore logs page works
- [ ] Field reports page works
- [ ] Projects page works
- [ ] Data displays correctly
- [ ] Forms submit successfully

### Phase 5: Deployment (Coming Soon)
- [ ] Production build succeeds
- [ ] App runs in production mode
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] SSL/HTTPS configured
- [ ] Performance acceptable (Lighthouse 90+)

---

## Deployment Notes

### Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| Database | SQLite (file:./prisma/dev.db) | PostgreSQL (hosted) |
| Build | `npm run dev` | `npm run build && npm run start` |
| Source Maps | Enabled | Disabled |
| Hot Reload | Yes | No |
| Minification | No | Yes |
| Environment | .env.local | .env (server) |

### Recommended Hosting

1. **Vercel** (Easiest)
   - One-click deploy from GitHub
   - Automatic HTTPS
   - Free tier available
   - Built by Next.js creators

2. **Netlify**
   - Similar to Vercel
   - Good performance
   - Free tier available

3. **DigitalOcean App Platform**
   - More control
   - Includes database hosting
   - $5-15/month

4. **AWS/GCP/Azure**
   - Enterprise-grade
   - More complex setup
   - Higher cost

### Database Hosting

For production, use PostgreSQL:

- **Vercel Postgres** - Integrated with Vercel
- **Supabase** - Free tier, great dev experience
- **Railway** - Simple PostgreSQL hosting
- **PlanetScale** - MySQL alternative (requires schema changes)
- **DigitalOcean Managed Databases** - $15/month

### Environment Variables in Production

Set these in your hosting platform:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="<generate-random-secret>"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

---

## Next Steps

1. ✅ **Infrastructure Complete** - Next.js, Prisma, Auth configured
2. 🔄 **Documentation** - This file, README updates
3. ⏳ **Build API Routes** - Implement HDD endpoints
4. ⏳ **Build Dashboard** - Convert HTML to React components
5. ⏳ **Implement Features** - Rod logging, 811 tracking, offline mode
6. ⏳ **Test Everything** - Manual and automated tests
7. ⏳ **Deploy** - Production database and hosting
8. ⏳ **Merge to Main** - After thorough testing

---

## Questions or Issues?

If you encounter problems:

1. Check Next.js terminal for errors
2. Check browser console for errors
3. Verify environment variables in `.env`
4. Run `npx prisma generate` if database types are wrong
5. Clear `.next` folder and rebuild: `rm -rf .next && npm run dev`
6. Check this documentation for setup steps

---

**Last Updated:** October 25, 2025
**Next.js Version:** 15.0.3
**Prisma Version:** 6.18.0
