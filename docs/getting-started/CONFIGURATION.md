# Configuration Guide

**Midwest Underground Website - Environment Configuration**

**Last Updated:** 2025-11-23

---

## 📋 Overview

This guide covers all configuration options for the Midwest Underground Website, including environment variables, database setup, authentication, and optional integrations.

---

## 🔐 Environment Variables

All configuration is managed through environment variables stored in `.env` files.

### File Structure

```
.env                 # Local development (not committed)
.env.example         # Template file (committed)
.env.production      # Production template (not committed)
.env.local           # Local overrides (not committed)
.env.test            # Test environment (optional)
```

**Important:** Never commit `.env` files with real credentials to version control!

---

## 🚀 Development Configuration

Create a `.env` file in the project root for local development:

```env
# ================================
# DATABASE CONFIGURATION
# ================================
# SQLite (default for development)
DATABASE_URL="file:./dev.db"

# OR PostgreSQL (local)
# DATABASE_URL="postgresql://postgres:password@localhost:5432/midwest_underground?schema=public"

# ================================
# AUTHENTICATION
# ================================
# Local development URL
NEXTAUTH_URL="http://localhost:3000"

# Generate with: openssl rand -base64 32
# For dev, can be any string, but production MUST be secure
NEXTAUTH_SECRET="development-secret-change-in-production"

# ================================
# APPLICATION
# ================================
# Public URL for development
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node environment
NODE_ENV="development"

# ================================
# SESSION SETTINGS
# ================================
# Session timeout in seconds (default: 1 hour)
SESSION_TIMEOUT="3600"

# Maximum session age in seconds (default: 30 days)
SESSION_MAX_AGE="2592000"
```

---

## 🏭 Production Configuration

For production deployments, use these settings:

```env
# ================================
# DATABASE CONFIGURATION
# ================================
# PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="postgresql://username:password@your-host.com:5432/midwest_underground"

# Connection pooling (for serverless, e.g., Vercel)
# DATABASE_URL="postgresql://user:pass@pooler.example.com:5432/db?pgbouncer=true"

# Alternative: Use direct URL for connection pooling services
# POSTGRES_URL="postgres://user:pass@host:5432/db"
# POSTGRES_URL_NON_POOLING="postgres://user:pass@host:5432/db"

# ================================
# AUTHENTICATION
# ================================
# Your production domain (no trailing slash)
NEXTAUTH_URL="https://midwestundergroundmn.com"

# Generate secure secret with: openssl rand -base64 32
# CRITICAL: Must be unique and secret
NEXTAUTH_SECRET="YOUR_SECURE_RANDOM_STRING_HERE"

# ================================
# APPLICATION
# ================================
# Public production URL
NEXT_PUBLIC_APP_URL="https://midwestundergroundmn.com"

# Node environment
NODE_ENV="production"

# ================================
# SESSION SETTINGS
# ================================
# Production session settings
SESSION_TIMEOUT="3600"         # 1 hour
SESSION_MAX_AGE="2592000"      # 30 days
```

---

## 🗄️ Database Configuration

### SQLite (Development)

Simple file-based database, perfect for development:

```env
DATABASE_URL="file:./dev.db"
```

**Pros:**
- Zero configuration
- No separate database server needed
- Fast for development
- Included with Prisma

**Cons:**
- Not suitable for production
- Limited concurrency
- No network access

### PostgreSQL (Production)

Recommended for production deployments:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/midwest_underground?schema=public"

# Hosted services
# Neon
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/midwest_underground?sslmode=require"

# Supabase
DATABASE_URL="postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?schema=public"

# Railway
DATABASE_URL="postgresql://postgres:pass@containers-us-west-xxx.railway.app:5432/railway"

# Heroku
DATABASE_URL="postgres://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/dbname"
```

**Connection string format:**
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA&sslmode=require
```

**Components:**
- `USERNAME`: Database user
- `PASSWORD`: User password (URL encode special characters)
- `HOST`: Database server hostname
- `PORT`: Database port (default: 5432)
- `DATABASE`: Database name
- `schema`: Schema name (default: public)
- `sslmode`: SSL mode (require, prefer, disable)

### Connection Pooling

For serverless deployments (Vercel, Netlify Functions):

```env
# Use connection pooler endpoint
DATABASE_URL="postgresql://user:pass@pooler.provider.com:5432/db?pgbouncer=true"

# Or separate pooling and direct URLs
POSTGRES_URL="postgresql://user:pass@pooler.provider.com:5432/db"
POSTGRES_URL_NON_POOLING="postgresql://user:pass@direct.provider.com:5432/db"
```

**Why connection pooling?**
- Serverless functions create new connections frequently
- Prevents "too many connections" errors
- Improves performance and reliability

---

## 🔑 Authentication Configuration

### NEXTAUTH_URL

The base URL where your app is accessible:

```env
# Development
NEXTAUTH_URL="http://localhost:3000"

# Production
NEXTAUTH_URL="https://midwestundergroundmn.com"

# Production with subdomain
NEXTAUTH_URL="https://app.midwestundergroundmn.com"
```

**Rules:**
- Must match exactly where users access the app
- No trailing slash
- Include protocol (`http://` or `https://`)
- Use `https://` in production

### NEXTAUTH_SECRET

Critical security value for JWT signing and encryption:

```bash
# Generate secure secret
openssl rand -base64 32

# OR using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Example output:
```
K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=
```

**Then set in .env:**
```env
NEXTAUTH_SECRET="K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols="
```

**Important:**
- Must be at least 32 characters
- Must be unique per environment
- Must be kept secret
- Changing this invalidates all existing sessions

### Session Settings

Control session behavior:

```env
# How long before session times out due to inactivity (seconds)
SESSION_TIMEOUT="3600"          # 1 hour

# Maximum session age before forced re-login (seconds)
SESSION_MAX_AGE="2592000"       # 30 days (2592000 seconds)
```

**Common values:**
```env
# Short sessions (high security)
SESSION_TIMEOUT="1800"          # 30 minutes
SESSION_MAX_AGE="86400"         # 1 day

# Standard sessions
SESSION_TIMEOUT="3600"          # 1 hour
SESSION_MAX_AGE="2592000"       # 30 days

# Extended sessions (convenience)
SESSION_TIMEOUT="7200"          # 2 hours
SESSION_MAX_AGE="7776000"       # 90 days
```

---

## 📧 Email Configuration (Optional)

If you want to send emails (contact forms, notifications):

```env
# ================================
# EMAIL / SMTP CONFIGURATION
# ================================
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-specific-password"
SMTP_FROM="noreply@midwestundergroundmn.com"

# Email settings
EMAIL_ENABLED="true"
CONTACT_EMAIL="info@midwestundergroundmn.com"
```

### Gmail Setup

1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password (not your regular password) in `SMTP_PASSWORD`

### Other Email Providers

**SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
```

**Mailgun:**
```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@mg.yourdomain.com"
SMTP_PASSWORD="your-mailgun-smtp-password"
```

**AWS SES:**
```env
SMTP_HOST="email-smtp.us-east-1.amazonaws.com"
SMTP_PORT="587"
SMTP_USER="your-aws-access-key-id"
SMTP_PASSWORD="your-aws-secret-access-key"
```

---

## 📊 Analytics & Monitoring (Optional)

### Google Analytics

```env
# Google Analytics 4
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Universal Analytics (legacy)
NEXT_PUBLIC_GA_TRACKING_ID="UA-XXXXXXXXX-X"
```

Get your ID from: https://analytics.google.com/

### Sentry Error Tracking

```env
# Sentry DSN
SENTRY_DSN="https://your-key@o123456.ingest.sentry.io/7890123"

# Environment
SENTRY_ENVIRONMENT="production"

# Release tracking
SENTRY_RELEASE="1.0.0"
```

Get your DSN from: https://sentry.io/

### Other Monitoring

```env
# LogRocket
NEXT_PUBLIC_LOGROCKET_ID="your-app-id/project-name"

# PostHog
NEXT_PUBLIC_POSTHOG_KEY="phc_xxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

---

## 🚀 Deployment Platform Configuration

### Vercel

Vercel auto-provides some variables:

```env
# Automatically set by Vercel
VERCEL="1"
VERCEL_URL="your-project-xxx.vercel.app"
VERCEL_ENV="production"

# Use for public URLs
NEXT_PUBLIC_VERCEL_URL="auto"
```

**Setting variables in Vercel:**
1. Go to project settings
2. Navigate to Environment Variables
3. Add each variable
4. Choose environments (Production, Preview, Development)
5. Redeploy

### Netlify

```env
# Set via Netlify UI or netlify.toml
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"
```

**Setting variables in Netlify:**
1. Go to Site settings
2. Navigate to Environment variables
3. Add variables
4. Redeploy or trigger new build

### Railway

Railway auto-injects database URLs:

```env
# Railway provides these automatically
DATABASE_URL="${{Postgres.DATABASE_URL}}"
DATABASE_PRIVATE_URL="${{Postgres.DATABASE_PRIVATE_URL}}"
```

---

## 🎛️ Feature Flags (Optional)

Control features via environment variables:

```env
# ================================
# FEATURE FLAGS
# ================================
# Enable/disable specific features
FEATURE_EQUIPMENT_TRACKING="true"
FEATURE_FINANCIAL_REPORTS="true"
FEATURE_PDF_EXPORT="false"
FEATURE_DARK_MODE="true"
FEATURE_NOTIFICATIONS="false"

# Maintenance mode
MAINTENANCE_MODE="false"
```

Use in code:
```typescript
const isEquipmentEnabled = process.env.FEATURE_EQUIPMENT_TRACKING === 'true';
```

---

## 🔒 Security Settings

### Rate Limiting

```env
# Rate limiting configuration
RATE_LIMIT_WINDOW="900000"      # 15 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS="100"   # Max requests per window

# Per-endpoint overrides
RATE_LIMIT_LOGIN="5"             # Login attempts per window
RATE_LIMIT_API="60"              # API calls per window
```

### CORS Configuration

```env
# Allowed origins (comma-separated)
CORS_ORIGINS="https://midwestundergroundmn.com,https://www.midwestundergroundmn.com"

# Allow credentials
CORS_CREDENTIALS="true"
```

### Content Security Policy

```env
# CSP directives
CSP_REPORT_URI="https://your-app.report-uri.com/r/d/csp/enforce"
```

---

## 🧪 Testing Configuration

Create `.env.test` for test environment:

```env
# Test database
DATABASE_URL="file:./test.db"

# Test auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-not-for-production"

# Disable external services in tests
SMTP_HOST=""
SENTRY_DSN=""
NEXT_PUBLIC_GA_ID=""
```

---

## 📝 Configuration Checklist

### Development Setup
- [ ] Create `.env` file
- [ ] Set `DATABASE_URL` for SQLite
- [ ] Set `NEXTAUTH_URL` to `http://localhost:3000`
- [ ] Set `NEXTAUTH_SECRET` (can be simple for dev)
- [ ] Run `npm run db:push`
- [ ] Run `npm run db:seed`

### Production Setup
- [ ] Generate secure `NEXTAUTH_SECRET` with OpenSSL
- [ ] Configure PostgreSQL `DATABASE_URL`
- [ ] Set production `NEXTAUTH_URL` with your domain
- [ ] Configure `NEXT_PUBLIC_APP_URL`
- [ ] Set up email SMTP (if needed)
- [ ] Add analytics keys (if using)
- [ ] Configure error tracking (if using)
- [ ] Test all integrations
- [ ] Verify environment variables in deployment platform
- [ ] Never commit `.env` files to Git

---

## 🔍 Verifying Configuration

### Check Current Config

```bash
# List all environment variables
printenv | grep -E "DATABASE|NEXTAUTH|NODE_ENV"

# Or in Node.js/Next.js
node -e "console.log(process.env.DATABASE_URL)"
```

### Test Database Connection

```bash
# Open Prisma Studio
npm run db:studio

# Should open at http://localhost:5555
# If database connection works, you'll see tables
```

### Test Authentication

```bash
# Start dev server
npm run dev

# Try to log in at http://localhost:3000/auth/login
# Use test credentials: owner@midwestunderground.com / password123
```

---

## 🐛 Common Configuration Issues

### Issue: Database connection fails

**Solution:**
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# For PostgreSQL, verify:
# - Username and password are correct
# - Host and port are reachable
# - Database exists
# - User has correct permissions

# For SQLite, verify:
# - File path is correct
# - Directory is writable
```

### Issue: NEXTAUTH_URL mismatch

**Error:** `[auth][error] MissingSecret`

**Solution:**
```bash
# Verify NEXTAUTH_URL matches browser URL exactly
# No trailing slash
# Include protocol (http:// or https://)
```

### Issue: Session not persisting

**Solution:**
```bash
# Verify NEXTAUTH_SECRET is set
# Check SESSION_MAX_AGE is reasonable
# Clear browser cookies
# Check browser console for errors
```

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js Configuration](https://authjs.dev/reference/configuration)
- [Prisma Connection URLs](https://www.prisma.io/docs/reference/database-reference/connection-urls)

---

## 🎉 Configuration Complete!

Your environment is now configured.

**Next Steps:**
1. Start development server: `npm run dev`
2. Read [Quick Start Guide](QUICK-START.md)
3. Begin development: [Development Guide](../guides/DEVELOPMENT.md)

---

**Last Updated:** 2025-11-23
**Previous:** [Installation Guide](INSTALLATION.md)
**Next:** [Quick Start](QUICK-START.md) → [Development Guide](../guides/DEVELOPMENT.md)
