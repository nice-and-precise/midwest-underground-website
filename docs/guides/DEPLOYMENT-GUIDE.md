<!-- TOC -->

## Table of Contents

  - [📋 Pre-Deployment Checklist](#pre-deployment-checklist)
    - [✅ Completed](#completed)
    - [⚠️ Required Before Launch](#required-before-launch)
  - [🎯 Deployment Options](#deployment-options)
    - [Option 1: Vercel (Recommended)](#option-1-vercel-recommended)
- [From project root](#from-project-root)
    - [Option 2: Netlify](#option-2-netlify)
    - [Option 3: Self-Hosted (VPS/Server)](#option-3-self-hosted-vpsserver)
- [Install Node.js 18+](#install-nodejs-18)
- [Install PM2](#install-pm2)
- [Install PostgreSQL](#install-postgresql)
- [Edit .env.local with production values](#edit-envlocal-with-production-values)
- [Run migrations](#run-migrations)
- [(Optional) Seed initial data](#optional-seed-initial-data)
  - [🗄️ Database Setup](#database-setup)
    - [PostgreSQL Database (Production)](#postgresql-database-production)
- [Add Heroku Postgres addon](#add-heroku-postgres-addon)
- [Get connection string](#get-connection-string)
- [Create database](#create-database)
- [Connection string:](#connection-string)
- [postgresql://midwest_user:SecurePassword123@localhost:5432/midwest_underground](#postgresqlmidwest_usersecurepassword123localhost5432midwest_underground)
    - [Run Migrations](#run-migrations)
- [Set DATABASE_URL in environment](#set-database_url-in-environment)
- [Run migrations](#run-migrations)
- [Generate Prisma client](#generate-prisma-client)
- [(Optional) Open Prisma Studio to verify](#optional-open-prisma-studio-to-verify)
  - [🔐 Security Configuration](#security-configuration)
    - [1. Generate NextAuth Secret](#1-generate-nextauth-secret)
    - [2. Configure Security Headers](#2-configure-security-headers)
    - [3. Environment Variable Security](#3-environment-variable-security)
  - [📊 Post-Deployment Testing](#post-deployment-testing)
    - [1. Functional Testing](#1-functional-testing)
    - [2. Performance Testing](#2-performance-testing)
    - [3. Security Testing](#3-security-testing)
    - [4. Cross-Browser Testing](#4-cross-browser-testing)
    - [5. Mobile Testing](#5-mobile-testing)
  - [🚀 Go-Live Checklist](#go-live-checklist)
    - [Final Checks](#final-checks)
    - [DNS Configuration](#dns-configuration)
    - [Monitoring Setup](#monitoring-setup)
    - [Backup Strategy](#backup-strategy)
  - [🔄 Deployment Workflow](#deployment-workflow)
    - [Staging Deployment (Recommended)](#staging-deployment-recommended)
    - [Production Deployment Process](#production-deployment-process)
- [1. Ensure all tests pass](#1-ensure-all-tests-pass)
- [2. Commit and push](#2-commit-and-push)
- [3. Deploy (Vercel example)](#3-deploy-vercel-example)
- [4. Run migrations](#4-run-migrations)
- [5. Verify deployment](#5-verify-deployment)
  - [🐛 Troubleshooting](#troubleshooting)
    - [Build Failures](#build-failures)
- [Clear node_modules and reinstall](#clear-node_modules-and-reinstall)
    - [Runtime Errors](#runtime-errors)
    - [Performance Issues](#performance-issues)
  - [📞 Support Resources](#support-resources)
    - [Documentation](#documentation)
    - [Internal Documentation](#internal-documentation)
  - [📝 Post-Launch Tasks](#post-launch-tasks)
    - [Week 1](#week-1)
    - [Month 1](#month-1)
    - [Ongoing](#ongoing)

<!-- /TOC -->

# Deployment Guide - Midwest Underground Website

**Last Updated:** October 26, 2025
**Status:** Ready for Production Deployment

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] All TypeScript errors resolved (0 errors)
- [x] Production build successful (45 routes)
- [x] Images optimized (93.5% reduction, 20MB saved)
- [x] WebP versions created for modern browsers
- [x] Comprehensive documentation (16 guides, 9,000+ lines)
- [x] QA audit checklist prepared
- [x] Environment configuration templates created

### ⚠️ Required Before Launch
- [ ] Database provisioned (PostgreSQL recommended)
- [ ] Environment variables configured
- [ ] Content placeholders replaced (see PLACEHOLDERS.md)
- [ ] Full QA audit executed
- [ ] Domain name configured
- [ ] SSL certificate obtained
- [ ] Deployment platform selected

---

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Built for Next.js applications
- Automatic HTTPS
- Global CDN
- Zero configuration
- Free tier available
- Excellent DX

**Steps:**

1. **Install Vercel CLI** (optional, can use web dashboard)
   ```bash
   npm install -g vercel
   ```

2. **Prepare Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.production`:
     - `DATABASE_URL` (your PostgreSQL connection string)
     - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
     - `NEXTAUTH_URL` (your production domain)
     - `NEXT_PUBLIC_APP_URL` (same as NEXTAUTH_URL)

3. **Deploy**
   ```bash
   # From project root
   vercel --prod
   ```

   Or via web:
   - Push code to GitHub
   - Connect repository in Vercel dashboard
   - Configure environment variables
   - Deploy

4. **Post-Deployment**
   - Configure custom domain
   - Run Prisma migrations: `npx prisma migrate deploy`
   - Verify all routes load correctly

---

### Option 2: Netlify

**Steps:**

1. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Configure Environment Variables**
   - Netlify Dashboard → Site Settings → Build & Deploy → Environment
   - Add all variables from `.env.production`

3. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Deploy

---

### Option 3: Self-Hosted (VPS/Server)

**Requirements:**
- Node.js 18+ installed
- PostgreSQL database running
- Nginx/Apache web server
- PM2 or similar process manager
- SSL certificate (Let's Encrypt)

**Steps:**

1. **Server Setup**
   ```bash
   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install PostgreSQL
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Clone and Build**
   ```bash
   cd /var/www
   git clone <your-repo-url> midwest-underground
   cd midwest-underground
   npm install
   npm run build
   ```

3. **Configure Environment**
   ```bash
   cp .env.production .env.local
   # Edit .env.local with production values
   nano .env.local
   ```

4. **Database Setup**
   ```bash
   # Run migrations
   npx prisma migrate deploy

   # (Optional) Seed initial data
   npx prisma db seed
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "midwest-underground" -- start
   pm2 save
   pm2 startup
   ```

6. **Nginx Configuration**
   ```nginx
   server {
       server_name midwestundergroundmn.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       listen 443 ssl;
       ssl_certificate /etc/letsencrypt/live/midwestundergroundmn.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/midwestundergroundmn.com/privkey.pem;
   }
   ```

7. **SSL Certificate**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d midwestundergroundmn.com
   ```

---

## 🗄️ Database Setup

### PostgreSQL Database (Production)

**Option 1: Supabase (Recommended for simplicity)**

1. Create free account at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Use in `DATABASE_URL` environment variable
5. Connection pooling included

**Option 2: Heroku Postgres**

```bash
# Add Heroku Postgres addon
heroku addons:create heroku-postgresql:mini

# Get connection string
heroku config:get DATABASE_URL
```

**Option 3: Self-Hosted PostgreSQL**

```bash
# Create database
sudo -u postgres psql
CREATE DATABASE midwest_underground;
CREATE USER midwest_user WITH PASSWORD 'SecurePassword123';
GRANT ALL PRIVILEGES ON DATABASE midwest_underground TO midwest_user;
\q

# Connection string:
# postgresql://midwest_user:SecurePassword123@localhost:5432/midwest_underground
```

### Run Migrations

```bash
# Set DATABASE_URL in environment
export DATABASE_URL="your-production-db-url"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to verify
npx prisma studio
```

---

## 🔐 Security Configuration

### 1. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` environment variable.

### 2. Configure Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### 3. Environment Variable Security

**NEVER commit these to version control:**
- `.env.local`
- `.env.production`
- `.env` files with secrets

**Add to `.gitignore`:**
```
.env*.local
.env.production
.env
```

---

## 📊 Post-Deployment Testing

### 1. Functional Testing

Visit and verify:
- [ ] Homepage loads (https://yourdomain.com)
- [ ] Login works (https://yourdomain.com/auth/login)
- [ ] Dashboard accessible after login
- [ ] All 21 dashboard routes load
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Images display properly (check optimized versions)
- [ ] Forms submit successfully

### 2. Performance Testing

Run Lighthouse audit:
```bash
npx lighthouse https://yourdomain.com --view
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### 3. Security Testing

- [ ] HTTPS enabled and working
- [ ] Security headers present (check browser devtools)
- [ ] No sensitive data in client-side code
- [ ] Authentication working correctly
- [ ] API routes properly protected
- [ ] No exposed environment variables

### 4. Cross-Browser Testing

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 5. Mobile Testing

Test on:
- [ ] iPhone (375px width)
- [ ] Android phone (360px-412px width)
- [ ] iPad (768px width)
- [ ] Desktop (1920px+ width)

---

## 🚀 Go-Live Checklist

### Final Checks
- [ ] All environment variables set correctly
- [ ] Database migrations run successfully
- [ ] Content placeholders replaced
- [ ] QA audit completed and approved
- [ ] Performance metrics meet targets
- [ ] All images optimized and loading
- [ ] Forms tested and working
- [ ] Analytics configured (if using)
- [ ] Error tracking configured (if using)
- [ ] Backups configured

### DNS Configuration
- [ ] A record pointing to server IP (or CNAME to Vercel/Netlify)
- [ ] SSL certificate active
- [ ] WWW redirect configured
- [ ] DNS propagation verified

### Monitoring Setup
- [ ] Uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Analytics (Google Analytics, Plausible, etc.)
- [ ] Database monitoring
- [ ] Performance monitoring

### Backup Strategy
- [ ] Automated database backups
- [ ] Code repository backed up
- [ ] Environment variables documented securely
- [ ] Disaster recovery plan documented

---

## 🔄 Deployment Workflow

### Staging Deployment (Recommended)

1. **Create Staging Branch**
   ```bash
   git checkout -b staging
   git push origin staging
   ```

2. **Deploy to Staging**
   - Use Vercel preview deployment
   - Or create separate Netlify site
   - Or use separate subdomain (staging.yourdomain.com)

3. **Run Full QA on Staging**
   - Execute QA-AUDIT-CHECKLIST.md
   - Fix any issues found
   - Get stakeholder approval

4. **Promote to Production**
   ```bash
   git checkout master
   git merge staging
   git push origin master
   ```

### Production Deployment Process

```bash
# 1. Ensure all tests pass
npm run build

# 2. Commit and push
git add .
git commit -m "feat: production-ready deployment"
git push origin master

# 3. Deploy (Vercel example)
vercel --prod

# 4. Run migrations
npx prisma migrate deploy

# 5. Verify deployment
curl -I https://yourdomain.com
```

---

## 🐛 Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: "Database connection failed"**
- Verify `DATABASE_URL` is correctly set
- Check database server is accessible
- Verify credentials are correct
- Check firewall rules

### Runtime Errors

**500 Error on API Routes**
- Check server logs
- Verify environment variables
- Check database connection
- Review Prisma schema matches migrations

**Images Not Loading**
- Verify images exist in `/public` directory
- Check file paths are correct
- Verify image optimization completed
- Check CDN/hosting configuration

### Performance Issues

**Slow Page Loads**
- Check image sizes (should be optimized)
- Verify CDN is working
- Check database query performance
- Review bundle sizes

---

## 📞 Support Resources

### Documentation
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)
- [Vercel Documentation](https://vercel.com/docs)

### Internal Documentation
- [README.md](../../README.md) - Project overview
- [QA-AUDIT-CHECKLIST.md](QA-AUDIT-CHECKLIST.md) - Testing guide
- [IMAGE-OPTIMIZATION-RECOMMENDATIONS.md](IMAGE-OPTIMIZATION-RECOMMENDATIONS.md) - Image optimization
- [SESSION-SUMMARY-OCT-25-2025.md](../archive/sessions/SESSION-SUMMARY-OCT-25-2025.md) - Recent changes

---

## 📝 Post-Launch Tasks

### Week 1
- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Fix any critical bugs immediately

### Month 1
- [ ] Review analytics data
- [ ] Optimize based on real usage
- [ ] Plan feature enhancements
- [ ] Update documentation

### Ongoing
- [ ] Regular security updates
- [ ] Database backup verification
- [ ] Performance monitoring
- [ ] Content updates as needed

---

**Deployment Status:** ✅ Ready for Production
**Last Build:** Successful (0 errors, 45 routes)
**Image Optimization:** ✅ Complete (93.5% reduction)
**Documentation:** ✅ Complete (16 guides)

🚀 **Ready to deploy!**

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
