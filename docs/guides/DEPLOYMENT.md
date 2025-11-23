# Deployment Guide

**Last Updated:** 2025-11-23
**Version:** 1.0.0
**Target Audience:** DevOps Engineers, Developers

---

## Table of Contents

- [Deployment Overview](#deployment-overview)
- [Deployment Options](#deployment-options)
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [Netlify Deployment](#netlify-deployment)
- [Custom VPS Deployment](#custom-vps-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Build Process](#build-process)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring & Logging](#monitoring--logging)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)

---

## Deployment Overview

### Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev[Local Development]
        Test[Run Tests]
    end

    subgraph "CI/CD Pipeline"
        GitHub[GitHub Repository]
        Actions[GitHub Actions]
        Build[Build Process]
        Test2[Automated Tests]
    end

    subgraph "Staging"
        Staging[Staging Environment]
        Verify[Smoke Tests]
    end

    subgraph "Production"
        CDN[CDN<br/>Static Assets]
        App[Next.js App<br/>Vercel/Netlify]
        DB[PostgreSQL<br/>Production Database]
    end

    Dev --> GitHub
    GitHub --> Actions
    Actions --> Build
    Build --> Test2
    Test2 --> Staging
    Staging --> Verify
    Verify --> App
    App --> CDN
    App --> DB

    style Dev fill:#FF5A1F
    style App fill:#4F5B66
    style DB fill:#336791
```

### Deployment Requirements

- **Node.js:** 18.x or higher
- **PostgreSQL:** 14.x or higher (production)
- **Build Time:** ~2-3 minutes
- **Environment Variables:** 6 required
- **Domain:** SSL certificate required

---

## Deployment Options

### Comparison Matrix

| Feature | Vercel | Netlify | Custom VPS |
|---------|--------|---------|------------|
| **Setup Time** | 5 minutes | 10 minutes | 1-2 hours |
| **Cost** | Free tier available | Free tier available | $5-20/month |
| **Auto Deploy** | Yes (Git push) | Yes (Git push) | Manual/CI setup |
| **SSL** | Automatic | Automatic | Manual (Let's Encrypt) |
| **PostgreSQL** | Add-on ($20/month) | External required | Self-hosted |
| **Serverless** | Yes | Yes | No |
| **Scalability** | Automatic | Automatic | Manual |
| **Custom Domain** | Free | Free | Included |

### Recommendation

- **Production:** Vercel (best Next.js integration)
- **Budget-Conscious:** Netlify (free tier generous)
- **Full Control:** Custom VPS (advanced users)

---

## Vercel Deployment (Recommended)

### Why Vercel?

- **Zero-Config** - Automatic Next.js detection
- **Automatic SSL** - HTTPS out of the box
- **Edge Network** - Global CDN
- **Serverless Functions** - API routes scale automatically
- **Preview Deployments** - Every PR gets a URL

### Step-by-Step Deployment

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant GitHub as GitHub
    participant Vercel as Vercel
    participant DB as PostgreSQL

    Dev->>GitHub: Push to main
    GitHub->>Vercel: Webhook trigger
    Vercel->>Vercel: npm install
    Vercel->>Vercel: npm run build
    Vercel->>Vercel: Deploy to Edge
    Vercel->>DB: Run migrations
    Vercel-->>Dev: Deployment URL
```

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Link Project

```bash
cd midwest-underground-website
vercel link
```

#### 4. Configure Environment Variables

```bash
# Add production environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
```

#### 5. Deploy

```bash
# Deploy to production
vercel --prod

# Or deploy via Git push
git push origin main  # Auto-deploys to Vercel
```

### Vercel Environment Variables

```env
# Database (Vercel Postgres)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generated-secret-key"

# Production mode
NODE_ENV="production"
```

### Vercel PostgreSQL Setup

```bash
# Install Vercel Postgres
vercel postgres create

# Link to project
vercel postgres connect

# Run migrations
npm run db:migrate:deploy
```

---

## Netlify Deployment

### Step-by-Step Deployment

#### 1. Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login

```bash
netlify login
```

#### 3. Initialize Site

```bash
netlify init
```

#### 4. Configure `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

#### 5. Deploy

```bash
# Deploy to production
netlify deploy --prod

# Or push to GitHub (auto-deploy)
git push origin main
```

### Netlify Environment Variables

Add via Netlify UI: Site settings → Environment variables

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.netlify.app"
NEXTAUTH_SECRET="..."
NODE_ENV="production"
```

---

## Custom VPS Deployment

### Prerequisites

- Ubuntu 22.04 LTS
- Root access
- Domain name pointed to server IP

### Deployment Architecture

```mermaid
graph TB
    Internet[Internet] --> Nginx[Nginx<br/>Reverse Proxy]
    Nginx --> Next[Next.js App<br/>Port 3000]
    Next --> PostgreSQL[(PostgreSQL<br/>Port 5432)]

    Nginx --> SSL[SSL Certificate<br/>Let's Encrypt]

    style Nginx fill:#FF5A1F
    style Next fill:#4F5B66
    style PostgreSQL fill:#336791
```

### Step-by-Step VPS Setup

#### 1. Initial Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

#### 2. Create Application User

```bash
# Create app user
adduser mwu-app
usermod -aG sudo mwu-app

# Switch to app user
su - mwu-app
```

#### 3. Clone Repository

```bash
# Clone project
git clone https://github.com/nice-and-precise/midwest-underground-website.git
cd midwest-underground-website

# Install dependencies
npm install

# Build application
npm run build
```

#### 4. Setup PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE mwu_production;
CREATE USER mwu_user WITH ENCRYPTED PASSWORD 'secure-password';
GRANT ALL PRIVILEGES ON DATABASE mwu_production TO mwu_user;
\q

# Run migrations
DATABASE_URL="postgresql://mwu_user:secure-password@localhost:5432/mwu_production" npx prisma migrate deploy
```

#### 5. Configure Environment

```bash
# Create production .env
nano .env.production

# Add variables:
DATABASE_URL="postgresql://mwu_user:secure-password@localhost:5432/mwu_production"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generated-secret"
NODE_ENV="production"
PORT="3000"
```

#### 6. Setup PM2

```bash
# Start application with PM2
pm2 start npm --name "mwu-app" -- start

# Save PM2 config
pm2 save

# Setup PM2 startup script
pm2 startup systemd
# (follow printed instructions)
```

#### 7. Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/mwu

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/mwu /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 8. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal cron job (already configured by certbot)
# Test renewal: sudo certbot renew --dry-run
```

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Application URL | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | Session encryption key | `openssl rand -base64 32` |
| `NODE_ENV` | Environment mode | `production` |

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Environment Variable Security

- **Never commit** `.env` files to Git
- **Use secrets management** - Vercel/Netlify secrets, HashiCorp Vault
- **Rotate secrets** periodically
- **Limit access** - Only necessary services

---

## Database Setup

### Production Database Checklist

- [ ] PostgreSQL 14+ installed
- [ ] Database created
- [ ] User with correct permissions
- [ ] SSL/TLS enabled
- [ ] Backups configured
- [ ] Connection pooling (PgBouncer recommended)

### Running Migrations

```bash
# Development (with migration creation)
npx prisma migrate dev

# Production (apply existing migrations)
npx prisma migrate deploy

# Verify migration status
npx prisma migrate status
```

### Database Backup Strategy

```bash
# Manual backup
pg_dump -U mwu_user -h localhost mwu_production > backup_$(date +%Y%m%d).sql

# Automated daily backup (cron)
0 2 * * * pg_dump -U mwu_user -h localhost mwu_production > /backups/mwu_$(date +\%Y\%m\%d).sql
```

---

## Build Process

### Build Pipeline

```mermaid
graph LR
    Install[npm install] --> Lint[npm run lint]
    Lint --> Test[npm test]
    Test --> Build[npm run build]
    Build --> Migrate[prisma migrate deploy]
    Migrate --> Deploy[Deploy to Server]

    style Install fill:#FF5A1F
    style Build fill:#4F5B66
    style Deploy fill:#23272A
```

### Build Commands

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Build application
npm run build

# Start production server
npm start
```

### Build Optimization

```bash
# Remove development dependencies
npm prune --production

# Compress node_modules (if copying to server)
tar -czf node_modules.tar.gz node_modules

# Clear Next.js cache
rm -rf .next
```

---

## Post-Deployment Verification

### Health Check Checklist

- [ ] Application loads (`https://your-domain.com`)
- [ ] API routes respond (`/api/projects`)
- [ ] Database connection works
- [ ] Authentication functional (login/logout)
- [ ] Static assets load (images, fonts)
- [ ] SSL certificate valid
- [ ] Redirects working correctly

### Smoke Tests

```bash
# Check homepage
curl -I https://your-domain.com

# Check API endpoint
curl https://your-domain.com/api/kpis/overview

# Check database connection
psql -U mwu_user -h localhost -d mwu_production -c "SELECT COUNT(*) FROM \"User\";"
```

### Performance Tests

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Load test homepage
ab -n 1000 -c 10 https://your-domain.com/

# Load test API endpoint
ab -n 500 -c 5 https://your-domain.com/api/projects
```

---

## Rollback Procedures

### Vercel Rollback

```bash
# View deployments
vercel list

# Promote previous deployment
vercel promote <deployment-url>
```

### Netlify Rollback

```bash
# List deployments
netlify deploy:list

# Restore previous deployment
netlify deploy:restore <deploy-id>
```

### Custom VPS Rollback

```bash
# View Git history
git log --oneline -10

# Rollback to previous commit
git checkout <commit-hash>

# Rebuild
npm install
npm run build

# Restart PM2
pm2 restart mwu-app
```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
psql -U mwu_user -h localhost mwu_production < backup_20250123.sql
```

---

## Monitoring & Logging

### Application Monitoring

- **Vercel Analytics** - Built-in performance monitoring
- **Sentry** - Error tracking and monitoring
- **LogRocket** - Session replay and debugging

### Server Monitoring (VPS)

```bash
# CPU and memory usage
htop

# Disk usage
df -h

# View PM2 logs
pm2 logs mwu-app

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Log Rotation (VPS)

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/mwu-app

# Add configuration:
/home/mwu-app/.pm2/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
}
```

---

## Security Considerations

### Security Checklist

- [ ] HTTPS enforced (SSL certificate)
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] DDoS protection (Cloudflare)
- [ ] Regular security updates

### Security Headers (Nginx)

```nginx
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
```

### Firewall Configuration (VPS)

```bash
# Install UFW
sudo apt install ufw

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
module.exports = {
  compress: true, // Enable gzip compression
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    optimizeCss: true
  }
};
```

### Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_project_status ON "Project"(status);
CREATE INDEX idx_bore_project ON "Bore"("projectId");
CREATE INDEX idx_daily_report_date ON "DailyReport"("reportDate");

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM "Project" WHERE status = 'IN_PROGRESS';
```

### CDN Configuration

- **Static Assets** - Serve from CDN (Cloudflare, AWS CloudFront)
- **Image Optimization** - Use Next.js Image component
- **Caching** - Set appropriate cache headers

---

## Related Documentation

- [Architecture Overview](../architecture/OVERVIEW.md)
- [Development Guide](./DEVELOPMENT.md)
- [Testing Guide](./TESTING.md)
- [API Reference](../architecture/API-REFERENCE.md)

---

## References

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Netlify Deployment Documentation](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/deployment)

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-23
**Maintained By:** @nice-and-precise
