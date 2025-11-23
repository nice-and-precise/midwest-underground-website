<!-- TOC -->

## Table of Contents

- [📋 Table of Contents](#table-of-contents)
- [🔧 Development Checklist](#development-checklist)
  - [Before Starting Development](#before-starting-development)
  - [During Development](#during-development)
  - [Before Creating Pull Request](#before-creating-pull-request)
- [🚀 Pre-Launch Checklist](#pre-launch-checklist)
  - [Critical Blockers (Must Complete)](#critical-blockers-must-complete)
    - [1. Environment Configuration](#1-environment-configuration)
    - [2. Database](#2-database)
    - [3. Authentication](#3-authentication)
    - [4. Content](#4-content)
  - [High Priority](#high-priority)
    - [1. Performance](#1-performance)
    - [2. SEO](#2-seo)
    - [3. Security](#3-security)
    - [4. Monitoring](#4-monitoring)
  - [Medium Priority](#medium-priority)
  - [Before Launch](#before-launch)
- [✅ QA Testing Checklist](#qa-testing-checklist)
  - [Functional Testing](#functional-testing)
    - [Public Pages](#public-pages)
    - [Dashboard (Authenticated)](#dashboard-authenticated)
    - [API Endpoints](#api-endpoints)
  - [Cross-Browser Testing](#cross-browser-testing)
    - [Desktop Browsers](#desktop-browsers)
    - [Mobile Browsers](#mobile-browsers)
  - [Responsive Design Testing](#responsive-design-testing)
  - [Accessibility Testing](#accessibility-testing)
  - [Performance Testing](#performance-testing)
  - [Security Testing](#security-testing)
- [🚢 Deployment Checklist](#deployment-checklist)
  - [Pre-Deployment](#pre-deployment)
  - [Deployment Steps](#deployment-steps)
  - [Vercel Deployment](#vercel-deployment)
  - [Manual Server Deployment](#manual-server-deployment)
- [✨ Post-Deployment Checklist](#post-deployment-checklist)
  - [Immediate Verification (0-15 minutes)](#immediate-verification-0-15-minutes)
  - [Short-Term Monitoring (15 minutes - 24 hours)](#short-term-monitoring-15-minutes-24-hours)
  - [Medium-Term Validation (1-7 days)](#medium-term-validation-1-7-days)
  - [Documentation Updates](#documentation-updates)
- [📊 Quality Gates](#quality-gates)
  - [Minimum Requirements for Production](#minimum-requirements-for-production)
- [🔍 Testing Tools](#testing-tools)
  - [Automated Testing](#automated-testing)
  - [Manual Testing Tools](#manual-testing-tools)
  - [Monitoring & Analytics](#monitoring-analytics)
- [📝 Notes](#notes)

<!-- /TOC -->

# Development & QA Checklists

**Midwest Underground Website - Comprehensive Checklists**

**Last Updated:** 2025-11-23

---

## 📋 Table of Contents

1. [Development Checklist](#development-checklist)
2. [Pre-Launch Checklist](#pre-launch-checklist)
3. [QA Testing Checklist](#qa-testing-checklist)
4. [Deployment Checklist](#deployment-checklist)
5. [Post-Deployment Checklist](#post-deployment-checklist)

---

## 🔧 Development Checklist

### Before Starting Development

- [ ] Read [Development Guide](DEVELOPMENT.md)
- [ ] Install all prerequisites ([Installation Guide](../getting-started/INSTALLATION.md))
- [ ] Configure environment variables ([Configuration Guide](../getting-started/CONFIGURATION.md))
- [ ] Run database migrations (`npm run db:push`)
- [ ] Seed database with test data (`npm run db:seed`)
- [ ] Start development server (`npm run dev`)
- [ ] Verify homepage loads at http://localhost:3000

### During Development

- [ ] Follow [naming conventions](../brand/NAMING-CONVENTIONS.md)
- [ ] Use TypeScript for type safety
- [ ] Write unit tests for new features
- [ ] Run linter before commits (`npm run lint`)
- [ ] Check TypeScript types (`npm run type-check`)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design (375px, 768px, 1024px, 1920px)
- [ ] Verify accessibility (keyboard navigation, screen readers)
- [ ] Check console for errors and warnings
- [ ] Update documentation for new features

### Before Creating Pull Request

- [ ] All tests pass (`npm test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] Code reviewed for security issues
- [ ] Environment variables documented
- [ ] API changes documented
- [ ] Database schema changes documented
- [ ] Update CHANGELOG.md

---

## 🚀 Pre-Launch Checklist

### Critical Blockers (Must Complete)

#### 1. Environment Configuration
- [ ] `.env.production` configured with secure values
- [ ] `NEXTAUTH_SECRET` generated securely (not default)
- [ ] `DATABASE_URL` points to production database
- [ ] `NEXTAUTH_URL` matches production domain
- [ ] All sensitive data in environment variables (not hardcoded)

#### 2. Database
- [ ] Production database created
- [ ] Schema pushed to production (`npm run db:push`)
- [ ] Production data seeded (if applicable)
- [ ] Database backups configured
- [ ] Connection pooling configured (for serverless)

#### 3. Authentication
- [ ] Test user accounts created
- [ ] Password reset flow tested
- [ ] Session timeout configured appropriately
- [ ] CSRF protection enabled
- [ ] Rate limiting configured

#### 4. Content
- [ ] All placeholder content replaced
- [ ] Company information accurate
- [ ] Contact information correct
- [ ] Legal pages complete (Privacy, Terms)
- [ ] Images optimized and compressed
- [ ] Alt text added to all images

### High Priority

#### 1. Performance
- [ ] Lighthouse score >90 (all categories)
- [ ] Images optimized (WebP format)
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] CDN configured (if applicable)
- [ ] Page load time <3 seconds

#### 2. SEO
- [ ] Meta titles unique for each page
- [ ] Meta descriptions compelling and unique
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Structured data (JSON-LD) added
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Google Search Console setup
- [ ] Google Analytics configured (if using)

#### 3. Security
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] CSRF tokens implemented
- [ ] Rate limiting on sensitive endpoints
- [ ] Dependencies up to date
- [ ] Security audit completed

#### 4. Monitoring
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Logging configured
- [ ] Uptime monitoring setup
- [ ] Performance monitoring setup
- [ ] Database monitoring configured

### Medium Priority

- [ ] Favicon added (multiple sizes)
- [ ] Apple touch icons added
- [ ] PWA manifest configured (if applicable)
- [ ] 404 page styled
- [ ] 500 error page styled
- [ ] Loading states for all async operations
- [ ] Toast notifications for user feedback
- [ ] Form validation on all forms
- [ ] Email notifications configured (if applicable)
- [ ] Backup strategy documented

### Before Launch

- [ ] All high-priority items completed
- [ ] Staging environment tested
- [ ] Client/stakeholder approval received
- [ ] Documentation complete
- [ ] Deployment plan documented
- [ ] Rollback plan documented
- [ ] Team trained on new system

---

## ✅ QA Testing Checklist

### Functional Testing

#### Public Pages
- [ ] Homepage loads and displays correctly
- [ ] All navigation links work
- [ ] Services page shows all offerings
- [ ] About page displays company information
- [ ] Contact form submits successfully
- [ ] Form validation works correctly
- [ ] Error messages display appropriately

#### Dashboard (Authenticated)
- [ ] Login page loads
- [ ] Login with valid credentials succeeds
- [ ] Login with invalid credentials fails appropriately
- [ ] Dashboard homepage loads after login
- [ ] All dashboard navigation links work
- [ ] Projects page displays data from database
- [ ] Bore logs page functions correctly
- [ ] Field reports page works as expected
- [ ] 811 tickets page displays correctly
- [ ] Equipment tracking works
- [ ] Customer management functions
- [ ] Reports generate correctly
- [ ] Logout works and clears session

#### API Endpoints
- [ ] All GET endpoints return correct data
- [ ] POST endpoints create records successfully
- [ ] PUT/PATCH endpoints update records correctly
- [ ] DELETE endpoints remove records
- [ ] Authentication required on protected routes
- [ ] Authorization checks work (role-based)
- [ ] Error handling returns appropriate status codes
- [ ] Input validation prevents invalid data
- [ ] Rate limiting works on sensitive endpoints

### Cross-Browser Testing

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] Samsung Internet

### Responsive Design Testing

- [ ] Mobile (375px) - iPhone SE
- [ ] Mobile (414px) - iPhone 12 Pro
- [ ] Tablet (768px) - iPad
- [ ] Tablet (1024px) - iPad Pro
- [ ] Desktop (1280px) - Small laptop
- [ ] Desktop (1920px) - Full HD
- [ ] Desktop (2560px) - 2K/4K
- [ ] All breakpoints work correctly
- [ ] No horizontal scroll
- [ ] Touch targets appropriate size (44x44px minimum)

### Accessibility Testing

- [ ] Keyboard navigation works completely
- [ ] Focus indicators visible
- [ ] Screen reader compatible (test with NVDA/JAWS/VoiceOver)
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for text)
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Error messages are announced
- [ ] Semantic HTML used throughout
- [ ] ARIA labels where appropriate
- [ ] Skip to content link available

### Performance Testing

- [ ] Lighthouse Performance score >90
- [ ] First Contentful Paint <1.8s
- [ ] Time to Interactive <3.8s
- [ ] Largest Contentful Paint <2.5s
- [ ] Cumulative Layout Shift <0.1
- [ ] No memory leaks
- [ ] Database queries optimized
- [ ] N+1 query problems eliminated
- [ ] Images lazy loaded
- [ ] Code splitting implemented

### Security Testing

- [ ] No credentials in client-side code
- [ ] No sensitive data in URLs
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] SQL injection attempts blocked
- [ ] XSS attempts blocked
- [ ] CSRF protection working
- [ ] Rate limiting prevents abuse
- [ ] Session management secure
- [ ] Password requirements enforced

---

## 🚢 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing in CI/CD
- [ ] Staging environment fully tested
- [ ] Database backup completed
- [ ] Deployment window scheduled
- [ ] Team notified of deployment
- [ ] Rollback plan documented and tested
- [ ] Monitoring alerts configured

### Deployment Steps

- [ ] Set maintenance mode (if applicable)
- [ ] Pull latest code from repository
- [ ] Install dependencies (`npm install`)
- [ ] Run database migrations (if applicable)
- [ ] Build production bundle (`npm run build`)
- [ ] Run smoke tests
- [ ] Update environment variables
- [ ] Restart application server
- [ ] Clear CDN cache (if applicable)
- [ ] Verify deployment successful
- [ ] Disable maintenance mode

### Vercel Deployment

- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Set environment variables
- [ ] Configure domain
- [ ] Enable preview deployments
- [ ] Deploy to production
- [ ] Verify deployment at production URL

### Manual Server Deployment

- [ ] SSH into server
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Build application
- [ ] Run database migrations
- [ ] Restart PM2/service
- [ ] Check logs for errors
- [ ] Verify application running

---

## ✨ Post-Deployment Checklist

### Immediate Verification (0-15 minutes)

- [ ] Production URL loads correctly
- [ ] Homepage displays without errors
- [ ] Login functionality works
- [ ] Database connection successful
- [ ] No 500 errors in logs
- [ ] No console errors in browser
- [ ] All critical paths tested
- [ ] Contact form submits successfully
- [ ] API endpoints responding

### Short-Term Monitoring (15 minutes - 24 hours)

- [ ] Monitor error rates
- [ ] Check server logs
- [ ] Monitor database performance
- [ ] Check application performance metrics
- [ ] Verify scheduled tasks running
- [ ] Monitor user feedback
- [ ] Check email notifications (if applicable)
- [ ] Verify backups running

### Medium-Term Validation (1-7 days)

- [ ] Review analytics data
- [ ] Check for increased error rates
- [ ] Monitor conversion rates
- [ ] Gather user feedback
- [ ] Review performance trends
- [ ] Check for any edge cases
- [ ] Validate all integrations working
- [ ] Review security logs

### Documentation Updates

- [ ] Update deployment documentation
- [ ] Document any issues encountered
- [ ] Update runbook if needed
- [ ] Share learnings with team
- [ ] Update change log
- [ ] Tag release in Git
- [ ] Update status page (if applicable)

---

## 📊 Quality Gates

### Minimum Requirements for Production

**Performance:**
- Lighthouse Performance: ≥90
- Lighthouse Accessibility: ≥90
- Lighthouse Best Practices: ≥90
- Lighthouse SEO: ≥90
- Page Load Time: <3 seconds

**Testing:**
- Unit Test Coverage: ≥80%
- E2E Test Pass Rate: 100%
- No Critical Bugs
- No High-Severity Security Issues

**Code Quality:**
- TypeScript: No errors
- Linter: No errors
- Build: Success
- All Dependencies: Up to date (no critical vulnerabilities)

**Functionality:**
- All critical user paths work
- Authentication and authorization function correctly
- Database operations successful
- API endpoints responding correctly
- No data loss or corruption

---

## 🔍 Testing Tools

### Automated Testing
- **Unit/Integration:** Vitest
- **E2E:** Playwright
- **Type Checking:** TypeScript compiler
- **Linting:** ESLint
- **Formatting:** Prettier

### Manual Testing Tools
- **Performance:** Lighthouse, WebPageTest
- **Accessibility:** axe DevTools, WAVE
- **Browser Testing:** BrowserStack, real devices
- **API Testing:** Postman, curl
- **Database:** Prisma Studio

### Monitoring & Analytics
- **Errors:** Sentry (if configured)
- **Analytics:** Google Analytics (if configured)
- **Uptime:** Uptime Robot, Pingdom
- **Logs:** Server logs, application logs

---

## 📝 Notes

- Check off items as you complete them
- Document any issues discovered
- Update this checklist as processes evolve
- Share with team for consistency
- Use as basis for CI/CD automation

---

**Last Updated:** 2025-11-23
**Maintained by:** Development Team
**Related:** [Development Guide](DEVELOPMENT.md) | [Testing Guide](TESTING.md) | [Deployment Guide](DEPLOYMENT.md)
