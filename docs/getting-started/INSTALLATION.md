<!-- TOC -->

## Table of Contents

  - [📋 Prerequisites](#prerequisites)
    - [Required](#required)
    - [Database Options](#database-options)
    - [Optional Tools](#optional-tools)
  - [🚀 Installation Steps](#installation-steps)
    - [1. Clone the Repository](#1-clone-the-repository)
- [Using HTTPS](#using-https)
- [OR using SSH](#or-using-ssh)
- [Navigate to project directory](#navigate-to-project-directory)
- [Navigate to existing directory](#navigate-to-existing-directory)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Configure Environment Variables](#3-configure-environment-variables)
- [Copy the example file](#copy-the-example-file)
- [OR create manually](#or-create-manually)
- [Database](#database)
- [Auth](#auth)
- [Optional: Session settings](#optional-session-settings)
- [Database (example for local PostgreSQL)](#database-example-for-local-postgresql)
- [OR for hosted service (example: Neon, Supabase)](#or-for-hosted-service-example-neon-supabase)
- [Auth](#auth)
- [Optional: Additional settings](#optional-additional-settings)
- [Using OpenSSL (recommended)](#using-openssl-recommended)
- [OR using Node.js](#or-using-nodejs)
    - [4. Set Up Database](#4-set-up-database)
      - [Option A: Using SQLite (Quick Start)](#option-a-using-sqlite-quick-start)
- [Generate Prisma client](#generate-prisma-client)
- [Push schema to database (creates dev.db file)](#push-schema-to-database-creates-devdb-file)
- [Seed with test data](#seed-with-test-data)
      - [Option B: Using PostgreSQL](#option-b-using-postgresql)
- [1. Create database](#1-create-database)
- [OR using psql](#or-using-psql)
- [2. Update DATABASE_URL in .env with your credentials](#2-update-database_url-in-env-with-your-credentials)
- [3. Generate Prisma client](#3-generate-prisma-client)
- [4. Push schema to database](#4-push-schema-to-database)
- [5. Seed with test data](#5-seed-with-test-data)
    - [5. Verify Installation](#5-verify-installation)
- [Check TypeScript compilation](#check-typescript-compilation)
- [Run linter](#run-linter)
- [Run tests (optional but recommended)](#run-tests-optional-but-recommended)
- [Start development server](#start-development-server)
    - [6. Test Login](#6-test-login)
  - [✅ Verification Checklist](#verification-checklist)
  - [🔧 Advanced Installation Options](#advanced-installation-options)
    - [Using Different Node Version Manager](#using-different-node-version-manager)
- [Install and use Node 18](#install-and-use-node-18)
- [Verify version](#verify-version)
    - [Using pnpm Instead of npm](#using-pnpm-instead-of-npm)
- [Install pnpm](#install-pnpm)
- [Install dependencies](#install-dependencies)
- [Run commands with pnpm](#run-commands-with-pnpm)
    - [Using Yarn Instead of npm](#using-yarn-instead-of-npm)
- [Install Yarn](#install-yarn)
- [Install dependencies](#install-dependencies)
- [Run commands with yarn](#run-commands-with-yarn)
    - [Docker Setup (Optional)](#docker-setup-optional)
  - [🗄️ Database Setup Details](#database-setup-details)
    - [Understanding Prisma Workflow](#understanding-prisma-workflow)
    - [Database Commands Reference](#database-commands-reference)
- [Generate Prisma Client](#generate-prisma-client)
- [Push schema changes (no migrations)](#push-schema-changes-no-migrations)
- [Seed database](#seed-database)
- [Reset database (warning: deletes all data)](#reset-database-warning-deletes-all-data)
- [Open Prisma Studio (database GUI)](#open-prisma-studio-database-gui)
- [Validate schema](#validate-schema)
- [Format schema file](#format-schema-file)
    - [Migrations (Production)](#migrations-production)
- [Create migration](#create-migration)
- [Apply migrations (production)](#apply-migrations-production)
- [Check migration status](#check-migration-status)
  - [🐛 Common Installation Issues](#common-installation-issues)
    - [Issue: npm install fails with EACCES error](#issue-npm-install-fails-with-eacces-error)
- [Fix npm permissions (Unix/Mac)](#fix-npm-permissions-unixmac)
- [Or use nvm to manage Node.js](#or-use-nvm-to-manage-nodejs)
    - [Issue: Prisma generate fails](#issue-prisma-generate-fails)
- [Clear Prisma cache](#clear-prisma-cache)
- [Reinstall](#reinstall)
    - [Issue: Database connection fails](#issue-database-connection-fails)
- [Check DATABASE_URL in .env](#check-database_url-in-env)
- [For PostgreSQL, verify database exists](#for-postgresql-verify-database-exists)
- [For SQLite, check file permissions](#for-sqlite-check-file-permissions)
    - [Issue: Port 3000 already in use](#issue-port-3000-already-in-use)
- [Find and kill process using port 3000](#find-and-kill-process-using-port-3000)
- [Windows:](#windows)
- [Unix/Mac:](#unixmac)
- [OR start on different port](#or-start-on-different-port)
    - [Issue: TypeScript errors after installation](#issue-typescript-errors-after-installation)
- [Regenerate types](#regenerate-types)
- [Clear Next.js cache](#clear-nextjs-cache)
- [Restart TypeScript server in VS Code](#restart-typescript-server-in-vs-code)
- [Command Palette (Ctrl+Shift+P) > "TypeScript: Restart TS Server"](#command-palette-ctrlshiftp-typescript-restart-ts-server)
  - [🔄 Updating Installation](#updating-installation)
- [Pull latest changes](#pull-latest-changes)
- [Install any new dependencies](#install-any-new-dependencies)
- [Update database schema](#update-database-schema)
- [Regenerate Prisma client](#regenerate-prisma-client)
- [Restart dev server](#restart-dev-server)
  - [🚀 Next Steps](#next-steps)
  - [📞 Getting Help](#getting-help)
  - [📚 Additional Resources](#additional-resources)

<!-- /TOC -->

# Installation Guide

**Midwest Underground Website - Complete Installation Instructions**

**Last Updated:** 2025-11-23

---

## 📋 Prerequisites

Before installing, ensure you have the following installed on your system:

### Required

- **Node.js:** Version 18.x or higher
  - Check: `node --version`
  - Download: https://nodejs.org/

- **npm:** Version 9.x or higher (comes with Node.js)
  - Check: `npm --version`

- **Git:** Version 2.x or higher
  - Check: `git --version`
  - Download: https://git-scm.com/

### Database Options

Choose one:

**Option 1: SQLite (Development - Recommended for Getting Started)**
- No additional installation required
- Works out of the box
- Included with Prisma

**Option 2: PostgreSQL (Production)**
- Version 14+ recommended
- Download: https://www.postgresql.org/download/
- Or use hosted service (Neon, Supabase, Railway, etc.)

### Optional Tools

- **VS Code:** Recommended IDE
  - Download: https://code.visualstudio.com/
  - Extensions: ESLint, Prettier, Prisma, Tailwind CSS IntelliSense

- **Prisma Studio:** Database GUI (included with Prisma)
  - Launches with `npm run db:studio`

---

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/nice-and-precise/midwest-underground-website.git

# OR using SSH
git clone git@github.com:nice-and-precise/midwest-underground-website.git

# Navigate to project directory
cd midwest-underground-website
```

**Or if you're working locally:**

```bash
# Navigate to existing directory
cd C:\Users\Owner\Desktop\midwest-underground-website
```

---

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15.0.3
- React 18.3.1
- Prisma 6.0.1
- NextAuth v5
- Tailwind CSS 3.4.1
- Vitest, Playwright, and more

**Expected time:** 2-5 minutes depending on internet speed

**Common issues:**
- If `npm install` fails, try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- If you see peer dependency warnings, they're usually safe to ignore

---

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env

# OR create manually
touch .env
```

**For SQLite (Development):**

```env
# Database
DATABASE_URL="file:./dev.db"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"

# Optional: Session settings
SESSION_TIMEOUT=3600
```

**For PostgreSQL (Production):**

```env
# Database (example for local PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/midwest_underground?schema=public"

# OR for hosted service (example: Neon, Supabase)
DATABASE_URL="postgresql://user:password@host.region.provider.com/dbname?sslmode=require"

# Auth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# Optional: Additional settings
SESSION_TIMEOUT=3600
NODE_ENV="production"
```

**Generate a secure NEXTAUTH_SECRET:**

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# OR using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

📘 **For complete environment configuration, see [Configuration Guide](CONFIGURATION.md)**

---

### 4. Set Up Database

#### Option A: Using SQLite (Quick Start)

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates dev.db file)
npm run db:push

# Seed with test data
npm run db:seed
```

#### Option B: Using PostgreSQL

```bash
# 1. Create database
createdb midwest_underground

# OR using psql
psql -U postgres
CREATE DATABASE midwest_underground;
\q

# 2. Update DATABASE_URL in .env with your credentials

# 3. Generate Prisma client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Seed with test data
npm run db:seed
```

**Database will be populated with:**
- 6 test users (1 owner, 2 supervisors, 3 crew members)
- 7 HDD projects
- 6 bore logs with detailed rod passes
- 4 daily field reports
- 4 811 utility tickets
- Sample inspections, photos, equipment records, and more

**Total: ~66 records across all tables**

---

### 5. Verify Installation

```bash
# Check TypeScript compilation
npm run type-check

# Run linter
npm run lint

# Run tests (optional but recommended)
npm test

# Start development server
npm run dev
```

**Expected output:**

```
> next dev

  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.xxx:3000

 ✓ Ready in 2.5s
```

**Open your browser:** http://localhost:3000

You should see the homepage load successfully.

---

### 6. Test Login

1. Navigate to: http://localhost:3000/auth/login
2. Use test credentials:
   - **Email:** `owner@midwestunderground.com`
   - **Password:** `password123`
3. You should be redirected to the dashboard

**If login fails:**
- Check database was seeded correctly: `npm run db:studio`
- Verify `.env` file has correct `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
- Check console for errors: Browser DevTools (F12) > Console

---

## ✅ Verification Checklist

After installation, verify the following:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`ls node_modules` shows packages)
- [ ] `.env` file created and configured
- [ ] Database schema pushed (`dev.db` file exists or PostgreSQL tables created)
- [ ] Database seeded (verify in Prisma Studio: `npm run db:studio`)
- [ ] TypeScript compiles without errors (`npm run type-check`)
- [ ] Lint passes (`npm run lint`)
- [ ] Tests pass (`npm test`)
- [ ] Development server starts (`npm run dev`)
- [ ] Homepage loads at http://localhost:3000
- [ ] Login works with test credentials
- [ ] Dashboard accessible after login

---

## 🔧 Advanced Installation Options

### Using Different Node Version Manager

If you use nvm (Node Version Manager):

```bash
# Install and use Node 18
nvm install 18
nvm use 18

# Verify version
node --version
```

### Using pnpm Instead of npm

```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Run commands with pnpm
pnpm dev
pnpm test
```

### Using Yarn Instead of npm

```bash
# Install Yarn
npm install -g yarn

# Install dependencies
yarn install

# Run commands with yarn
yarn dev
yarn test
```

### Docker Setup (Optional)

Coming soon - Docker Compose setup for containerized development.

---

## 🗄️ Database Setup Details

### Understanding Prisma Workflow

1. **Schema:** `prisma/schema.prisma` defines data models
2. **Client:** `npm run db:generate` generates TypeScript client
3. **Push:** `npm run db:push` syncs schema to database
4. **Seed:** `npm run db:seed` populates initial data

### Database Commands Reference

```bash
# Generate Prisma Client
npm run db:generate
npx prisma generate

# Push schema changes (no migrations)
npm run db:push
npx prisma db push

# Seed database
npm run db:seed
npx ts-node --project tsconfig.seed.json prisma/seed.ts

# Reset database (warning: deletes all data)
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio
npx prisma studio

# Validate schema
npx prisma validate

# Format schema file
npx prisma format
```

### Migrations (Production)

For production, use migrations instead of `db push`:

```bash
# Create migration
npx prisma migrate dev --name descriptive_name

# Apply migrations (production)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

---

## 🐛 Common Installation Issues

### Issue: npm install fails with EACCES error

**Solution:**
```bash
# Fix npm permissions (Unix/Mac)
sudo chown -R $USER:$USER ~/.npm

# Or use nvm to manage Node.js
```

### Issue: Prisma generate fails

**Solution:**
```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Reinstall
npm install
npm run db:generate
```

### Issue: Database connection fails

**Solution:**
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# For PostgreSQL, verify database exists
psql -U postgres -l

# For SQLite, check file permissions
ls -la dev.db
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find and kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Unix/Mac:
lsof -ti:3000 | xargs kill -9

# OR start on different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors after installation

**Solution:**
```bash
# Regenerate types
npm run db:generate
npm run type-check

# Clear Next.js cache
rm -rf .next

# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) > "TypeScript: Restart TS Server"
```

---

## 🔄 Updating Installation

To update to the latest version:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Update database schema
npm run db:push

# Regenerate Prisma client
npm run db:generate

# Restart dev server
npm run dev
```

---

## 🚀 Next Steps

After successful installation:

1. **Read Quick Start:** [QUICK-START.md](QUICK-START.md)
2. **Configure Environment:** [CONFIGURATION.md](CONFIGURATION.md)
3. **Start Developing:** [Development Guide](../guides/DEVELOPMENT.md)
4. **Understand Architecture:** [Architecture Overview](../architecture/OVERVIEW.md)
5. **Explore Features:** [Features Documentation](../features/)

---

## 📞 Getting Help

If you encounter issues not covered here:

1. Check [Troubleshooting Guide](../guides/TROUBLESHOOTING.md)
2. Search existing issues on GitHub
3. Review [Architecture Documentation](../architecture/)
4. Check Serena memories in `.serena/memories/`

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://authjs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Installation Complete!** 🎉

You're now ready to start development.

**Time to complete:** Approximately 15-30 minutes for first-time setup.

---

**Last Updated:** 2025-11-23
**Next:** [Configuration Guide](CONFIGURATION.md) → [Quick Start](QUICK-START.md) → [Development Guide](../guides/DEVELOPMENT.md)
