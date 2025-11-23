<!-- TOC -->

## Table of Contents

  - [📍 Project Location](#project-location)
  - [⚡ 5-Minute Local Setup](#5-minute-local-setup)
    - [Prerequisites](#prerequisites)
    - [Quick Start Commands](#quick-start-commands)
- [1. Navigate to project](#1-navigate-to-project)
- [2. Install dependencies (if not already done)](#2-install-dependencies-if-not-already-done)
- [3. Set up database](#3-set-up-database)
- [4. Start development server](#4-start-development-server)
- [5. Open in browser](#5-open-in-browser)
- [Visit: http://localhost:3000](#visit-httplocalhost3000)
  - [🗄️ Database Quick Setup](#database-quick-setup)
    - [Test User Credentials](#test-user-credentials)
    - [Database Commands](#database-commands)
- [View database in browser (Prisma Studio)](#view-database-in-browser-prisma-studio)
- [Seed database with test data](#seed-database-with-test-data)
- [Reset database and reseed](#reset-database-and-reseed)
- [Generate Prisma Client after schema changes](#generate-prisma-client-after-schema-changes)
- [Push schema changes to database](#push-schema-changes-to-database)
    - [Database Contents](#database-contents)
  - [🚀 Deployment Options](#deployment-options)
    - [Option 1: Vercel (Recommended for Next.js)](#option-1-vercel-recommended-for-nextjs)
    - [Option 2: Netlify](#option-2-netlify)
    - [Option 3: Manual Build](#option-3-manual-build)
- [Build for production](#build-for-production)
- [Start production server](#start-production-server)
  - [📖 Essential Documentation](#essential-documentation)
    - [New User Path](#new-user-path)
    - [Architecture & Technical](#architecture-technical)
    - [Development Guides](#development-guides)
  - [🔧 Common Development Tasks](#common-development-tasks)
    - [Starting Development](#starting-development)
- [Start dev server with hot reload](#start-dev-server-with-hot-reload)
- [Start dev server on specific port](#start-dev-server-on-specific-port)
- [Watch for file changes](#watch-for-file-changes)
- [(Next.js does this automatically)](#nextjs-does-this-automatically)
    - [Running Tests](#running-tests)
- [Run all tests](#run-all-tests)
- [Run E2E tests](#run-e2e-tests)
- [Run specific test file](#run-specific-test-file)
    - [Database Operations](#database-operations)
- [View data in browser](#view-data-in-browser)
- [Update schema and migrate](#update-schema-and-migrate)
- [Reset and reseed](#reset-and-reseed)
- [Check database connection](#check-database-connection)
    - [Building for Production](#building-for-production)
- [Create optimized production build](#create-optimized-production-build)
- [Test production build locally](#test-production-build-locally)
- [Check build size](#check-build-size)
  - [🐛 Troubleshooting Quick Fixes](#troubleshooting-quick-fixes)
    - [Server Won't Start](#server-wont-start)
- [Kill existing processes](#kill-existing-processes)
- [Clear build cache](#clear-build-cache)
- [Reinstall dependencies](#reinstall-dependencies)
- [Try again](#try-again)
    - [Database Connection Issues](#database-connection-issues)
- [Check .env file exists](#check-env-file-exists)
- [Regenerate Prisma client](#regenerate-prisma-client)
- [Push schema to database](#push-schema-to-database)
- [Verify connection](#verify-connection)
    - [Page Shows Blank](#page-shows-blank)
- [Clear browser cache (Ctrl+Shift+R)](#clear-browser-cache-ctrlshiftr)
- [Check browser console (F12) for errors](#check-browser-console-f12-for-errors)
- [Verify server is running on correct port](#verify-server-is-running-on-correct-port)
- [Check for compilation errors in terminal](#check-for-compilation-errors-in-terminal)
- [Clear Next.js cache](#clear-nextjs-cache)
    - [Build Errors](#build-errors)
- [Check for TypeScript errors](#check-for-typescript-errors)
- [Check for lint errors](#check-for-lint-errors)
- [Clean build](#clean-build)
  - [📂 Project Structure](#project-structure)
  - [🎯 Development Workflow](#development-workflow)
    - [Making Changes](#making-changes)
- [1. Create feature branch](#1-create-feature-branch)
- [2. Make changes to code](#2-make-changes-to-code)
- [Edit files in src/](#edit-files-in-src)
- [3. Test locally](#3-test-locally)
- [Visit http://localhost:3000](#visit-httplocalhost3000)
- [4. Run tests](#4-run-tests)
- [5. Build to verify](#5-build-to-verify)
- [6. Commit changes](#6-commit-changes)
- [7. Push to remote](#7-push-to-remote)
- [8. Create pull request (if using GitHub)](#8-create-pull-request-if-using-github)
    - [Working with Database](#working-with-database)
- [1. Modify schema](#1-modify-schema)
- [Edit prisma/schema.prisma](#edit-prismaschemaprisma)
- [2. Generate Prisma client](#2-generate-prisma-client)
- [3. Push to database](#3-push-to-database)
- [4. Update seed data if needed](#4-update-seed-data-if-needed)
- [Edit prisma/seed.ts](#edit-prismaseedts)
- [5. Reseed database](#5-reseed-database)
  - [🔍 Quick Reference](#quick-reference)
    - [Important URLs](#important-urls)
    - [Important Files](#important-files)
    - [Key Commands](#key-commands)
  - [📞 Getting Help](#getting-help)
    - [Check Documentation First](#check-documentation-first)
    - [Still Stuck?](#still-stuck)
    - [Using AI Assistance](#using-ai-assistance)
  - [✅ Verification Checklist](#verification-checklist)
  - [🎉 Ready to Go!](#ready-to-go)

<!-- /TOC -->

# Quick Start Guide

**Midwest Underground Website - Get Up and Running in Minutes**

**Last Updated:** 2025-11-23

---

## 📍 Project Location

```
C:\Users\Owner\Desktop\midwest-underground-website
```

**Status:** Production-ready Next.js application with database integration

---

## ⚡ 5-Minute Local Setup

### Prerequisites

- Node.js 18+ installed
- Git installed
- PostgreSQL database (or use SQLite for development)

### Quick Start Commands

```bash
# 1. Navigate to project
cd C:\Users\Owner\Desktop\midwest-underground-website

# 2. Install dependencies (if not already done)
npm install

# 3. Set up database
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev

# 5. Open in browser
# Visit: http://localhost:3000
```

**Development server will start on port 3000** (or next available port if 3000 is busy)

---

## 🗄️ Database Quick Setup

### Test User Credentials

All passwords: `password123`

| Email | Role | Name |
|-------|------|------|
| owner@midwestunderground.com | OWNER | Mike Anderson |
| super@midwestunderground.com | SUPER | Tom Jenkins |
| supervisor@midwestunderground.com | SUPER | Sarah Miller |
| crew@midwestunderground.com | CREW | Dave Johnson |
| operator@midwestunderground.com | CREW | Rick Thompson |
| locator@midwestunderground.com | CREW | James Rodriguez |

### Database Commands

```bash
# View database in browser (Prisma Studio)
npm run db:studio

# Seed database with test data
npm run db:seed

# Reset database and reseed
npm run db:reset

# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push
```

### Database Contents

After seeding, you'll have:
- **Users:** 6 (1 owner, 2 supervisors, 3 crew)
- **Projects:** 7 HDD projects with full details
- **Bores:** 6 bore paths with coordinates
- **Rod Passes:** 20 detailed logging entries
- **Daily Reports:** 4 field reports
- **811 Tickets:** 4 utility locate tickets
- **Inspections:** 4 QA/QC inspections

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Push to GitHub
2. Import project at https://vercel.com/new
3. Configure environment variables
4. Deploy in 60 seconds!

### Option 2: Netlify

1. Push to GitHub
2. Import project at https://app.netlify.com
3. Build command: `npm run build`
4. Publish directory: `.next`

### Option 3: Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📖 Essential Documentation

### New User Path

1. **[README.md](../../README.md)** - Project overview
2. **[Installation Guide](INSTALLATION.md)** - Detailed setup
3. **[Configuration Guide](CONFIGURATION.md)** - Environment variables
4. **[Development Guide](../guides/DEVELOPMENT.md)** - Development workflow

### Architecture & Technical

- **[Architecture Overview](../architecture/OVERVIEW.md)** - System design
- **[Database Schema](../architecture/DATABASE-SCHEMA.md)** - Data models
- **[API Reference](../architecture/API-REFERENCE.md)** - API endpoints
- **[Current State](../architecture/CURRENT-STATE.md)** - Branch status

### Development Guides

- **[Development Guide](../guides/DEVELOPMENT.md)** - Dev workflow
- **[Testing Guide](../guides/TESTING.md)** - Testing strategy
- **[Deployment Guide](../guides/DEPLOYMENT.md)** - Deploy to production
- **[Troubleshooting](../guides/TROUBLESHOOTING.md)** - Common issues

---

## 🔧 Common Development Tasks

### Starting Development

```bash
# Start dev server with hot reload
npm run dev

# Start dev server on specific port
PORT=3007 npm run dev

# Watch for file changes
# (Next.js does this automatically)
```

### Running Tests

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- src/__tests__/specific-test.test.ts
```

### Database Operations

```bash
# View data in browser
npm run db:studio

# Update schema and migrate
npm run db:push

# Reset and reseed
npm run db:reset

# Check database connection
npm run db:generate
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Test production build locally
npm run build && npm start

# Check build size
npm run build -- --analyze
```

---

## 🐛 Troubleshooting Quick Fixes

### Server Won't Start

```bash
# Kill existing processes
taskkill /F /IM node.exe

# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try again
npm run dev
```

### Database Connection Issues

```bash
# Check .env file exists
cat .env

# Regenerate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Verify connection
npm run db:studio
```

### Page Shows Blank

```bash
# Clear browser cache (Ctrl+Shift+R)
# Check browser console (F12) for errors
# Verify server is running on correct port
# Check for compilation errors in terminal

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Build Errors

```bash
# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint

# Clean build
rm -rf .next node_modules
npm install
npm run build
```

---

## 📂 Project Structure

```
midwest-underground-website/
├── src/
│   ├── app/              # Next.js 15 app router
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Dashboard pages
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── lib/              # Utilities & helpers
│   └── types/            # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── public/               # Static assets
├── tests/                # Test files
├── docs/                 # Documentation
├── .env                  # Environment variables (local)
├── .env.production       # Production variables
├── next.config.js        # Next.js config
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Project overview
```

---

## 🎯 Development Workflow

### Making Changes

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes to code
# Edit files in src/

# 3. Test locally
npm run dev
# Visit http://localhost:3000

# 4. Run tests
npm test

# 5. Build to verify
npm run build

# 6. Commit changes
git add .
git commit -m "feat: your feature description"

# 7. Push to remote
git push origin feature/your-feature

# 8. Create pull request (if using GitHub)
```

### Working with Database

```bash
# 1. Modify schema
# Edit prisma/schema.prisma

# 2. Generate Prisma client
npm run db:generate

# 3. Push to database
npm run db:push

# 4. Update seed data if needed
# Edit prisma/seed.ts

# 5. Reseed database
npm run db:seed
```

---

## 🔍 Quick Reference

### Important URLs

- **Local Dev:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555 (after `npm run db:studio`)
- **API Docs:** http://localhost:3000/api (when server running)

### Important Files

- **Environment:** `.env` (local), `.env.production` (production)
- **Database Schema:** `prisma/schema.prisma`
- **Next Config:** `next.config.js`
- **Root Layout:** `src/app/layout.tsx`
- **Home Page:** `src/app/page.tsx`

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm test` | Run tests |
| `npm run lint` | Check code quality |
| `npm run db:studio` | Open database browser |
| `npm run db:seed` | Seed database |
| `npm run db:push` | Update database schema |

---

## 📞 Getting Help

### Check Documentation First

1. **Installation issues?** → [Installation Guide](INSTALLATION.md)
2. **Configuration problems?** → [Configuration Guide](CONFIGURATION.md)
3. **Development questions?** → [Development Guide](../guides/DEVELOPMENT.md)
4. **Common errors?** → [Troubleshooting](../guides/TROUBLESHOOTING.md)

### Still Stuck?

Check the archive for similar issues:
- `docs/archive/sessions/` - Previous debugging sessions
- `docs/archive/reports/` - Build and test reports
- `docs/procedures/` - Standard procedures

### Using AI Assistance

```
I'm trying to [task] but encountering [problem].

Current code:
[paste relevant code]

Error message:
[paste error if any]

Steps I've tried:
1. [step 1]
2. [step 2]

Please help me resolve this.
```

---

## ✅ Verification Checklist

Before starting development, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Dependencies installed (`ls node_modules`)
- [ ] `.env` file exists and configured
- [ ] Database connection works (`npm run db:studio`)
- [ ] Server starts successfully (`npm run dev`)
- [ ] Homepage loads at http://localhost:3000
- [ ] Tests pass (`npm test`)
- [ ] Build completes (`npm run build`)

---

## 🎉 Ready to Go!

You now have:
- ✅ Development server running
- ✅ Database seeded with test data
- ✅ Test users for authentication
- ✅ Full feature set available
- ✅ Documentation at your fingertips

**Next Steps:**
1. Explore the application at http://localhost:3000
2. Log in with test credentials
3. Review [Development Guide](../guides/DEVELOPMENT.md)
4. Start building features!

---

**Built:** 2025
**For:** Midwest Underground of Minnesota Inc
**Stack:** Next.js 15, Prisma, PostgreSQL
**Status:** Production Ready 🚀

---

**Need more detail?** See:
- [Installation Guide](INSTALLATION.md) - Prerequisites and setup
- [Configuration Guide](CONFIGURATION.md) - Environment variables
- [Development Guide](../guides/DEVELOPMENT.md) - Detailed workflows
