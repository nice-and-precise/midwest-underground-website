# Deployment Guide

Complete guide for deploying the Midwest Underground website to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Netlify Deployment (Recommended)](#netlify-deployment-recommended)
3. [Vercel Deployment](#vercel-deployment)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [Custom Domain Configuration](#custom-domain-configuration)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Continuous Deployment Setup](#continuous-deployment-setup)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying, ensure you've completed these critical tasks:

### Content Verification
- [ ] All `[PLACEHOLDER:` tags replaced with actual content or removed
- [ ] Company logo uploaded and paths updated
- [ ] Contact information verified (phone, email, address)
- [ ] Formspree form ID configured in contact.html
- [ ] Real testimonials added (or placeholder testimonials reviewed)
- [ ] Service descriptions finalized
- [ ] About page company story reviewed

### Technical Verification
- [ ] All internal links tested (use Ctrl+F to find `href="#`)
- [ ] All images optimized (WebP format, <200KB each)
- [ ] Contact form tested with real email
- [ ] Mobile menu works on small screens
- [ ] All pages load without console errors (F12 to check)
- [ ] Forms validate properly
- [ ] Phone numbers are click-to-call on mobile

### SEO Preparation
- [ ] Unique title tags on each page
- [ ] Meta descriptions on each page
- [ ] Alt text on all images
- [ ] sitemap.xml updated with production URLs
- [ ] robots.txt updated with production URLs
- [ ] Schema.org markup complete

### Performance Check
- [ ] Images compressed and optimized
- [ ] No console errors in browser
- [ ] Test load time (should be <3 seconds on 3G)
- [ ] Mobile responsive (test on real device if possible)

---

## Netlify Deployment (Recommended)

Netlify offers the easiest deployment with free hosting, automatic HTTPS, and continuous deployment.

### Option A: Drag & Drop (Easiest)

**Step 1: Create Netlify Account**
1. Visit https://www.netlify.com/
2. Sign up with email or GitHub
3. Verify email address

**Step 2: Deploy**
1. Visit https://app.netlify.com/drop
2. Drag your entire `midwest-underground-website` folder to the drop zone
3. Wait for deployment (usually 30-60 seconds)
4. You'll get a random URL like `https://random-name-123.netlify.app`

**Step 3: Rename Site**
1. Go to Site Settings
2. Click "Change site name"
3. Choose: `midwest-underground` (becomes https://midwest-underground.netlify.app)

### Option B: Git Integration (Best for Updates)

**Step 1: Push to GitHub**
```bash
# Navigate to project directory
cd C:\Users\Owner\Desktop\midwest-underground-website

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial website build"

# Create GitHub repository at https://github.com/new
# Name it: midwest-underground-website

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/midwest-underground-website.git
git branch -M main
git push -u origin main
```

**Step 2: Connect to Netlify**
1. Login to Netlify dashboard
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub"
4. Authorize Netlify to access your repositories
5. Select `midwest-underground-website` repository
6. **Build settings:**
   - Build command: Leave empty (no build needed)
   - Publish directory: Leave as root or enter `.`
7. Click "Deploy site"

**Step 3: Automatic Updates**
- Any push to `main` branch triggers automatic redeployment
- Updates go live in ~1 minute

### Option C: Netlify CLI

**Step 1: Install Netlify CLI**
```bash
npm install -g netlify-cli
```

**Step 2: Login**
```bash
netlify login
```

**Step 3: Initialize and Deploy**
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website

# Initialize (first time only)
netlify init

# Follow prompts:
# - Create & configure new site
# - Choose team
# - Site name: midwest-underground
# - Build command: (leave empty)
# - Publish directory: .

# Deploy to production
netlify deploy --prod
```

### Netlify Configuration

Your `netlify.toml` file is already configured with:
- Security headers
- Cache headers for performance
- Redirects
- No changes needed!

---

## Vercel Deployment

Vercel offers similar features to Netlify with excellent performance.

### Option A: Vercel CLI

**Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

**Step 2: Deploy**
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website

# Login (opens browser)
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Your account
# - Link to existing project: N
# - Project name: midwest-underground
# - In which directory: ./ (just press Enter)
# - Override settings: N

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard

1. Visit https://vercel.com
2. Sign up/login
3. Click "Add New Project"
4. Import from GitHub (or upload files)
5. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: ./
6. Click "Deploy"

---

## GitHub Pages Deployment

GitHub Pages is free but has some limitations (no automatic HTTPS for custom domains without extra setup).

### Step 1: Create Repository

1. Go to https://github.com/new
2. Repository name: `midwest-underground-website`
3. Public repository
4. Don't initialize with README (we already have files)
5. Create repository

### Step 2: Push Code

```bash
cd C:\Users\Owner\Desktop\midwest-underground-website

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/midwest-underground-website.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: Deploy from a branch
4. Branch: `main`, folder: `/ (root)`
5. Save

**Your site will be live at:**
`https://YOUR_USERNAME.github.io/midwest-underground-website/`

### Step 4: Custom Domain (Optional)

1. In Pages settings, enter custom domain
2. Configure DNS (see Custom Domain Configuration section)

---

## Custom Domain Configuration

### Purchase Domain

Recommended registrars:
- Namecheap.com
- GoDaddy.com
- Google Domains
- Hover.com

**Suggested domains:**
- midwestundergroundmn.com
- midwestunderground.com
- mwunderground.com

### DNS Configuration for Netlify

**Step 1: In Netlify Dashboard**
1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter your domain (e.g., `midwestundergroundmn.com`)
4. Netlify will provide DNS instructions

**Step 2: At Your Domain Registrar**

**Option A: Use Netlify DNS (Easiest)**
1. In Netlify, click "Set up Netlify DNS"
2. Copy the 4 nameservers provided
3. At your registrar, change nameservers to Netlify's
4. Wait 24-48 hours for propagation

**Option B: Use External DNS**
Add these records at your registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | 75.2.60.5 |
| CNAME | www | your-site.netlify.app |

**Step 3: Enable HTTPS**
- Netlify automatically provisions SSL certificate
- Usually ready in 10-30 minutes
- Free with Let's Encrypt

### DNS Configuration for Vercel

**At Your Domain Registrar:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**In Vercel Dashboard:**
1. Project Settings → Domains
2. Add your domain
3. Vercel verifies and provisions SSL
4. SSL ready in minutes

### DNS Configuration for GitHub Pages

**At Your Domain Registrar:**

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR_USERNAME.github.io |

**In GitHub Repository:**
1. Settings → Pages
2. Custom domain: Enter your domain
3. Check "Enforce HTTPS" (after DNS propagates)

---

## Post-Deployment Tasks

### Immediate (Within 24 Hours)

**1. Verify Site Functionality**
- [ ] Visit every page
- [ ] Test all navigation links
- [ ] Submit contact form
- [ ] Test on mobile device
- [ ] Check in multiple browsers (Chrome, Firefox, Safari)

**2. Update Placeholders with Live URLs**

Search and replace in all HTML files:
```
[PLACEHOLDER: domain-url] → https://www.yourdomain.com
```

Update in:
- All HTML files (Open Graph tags, Schema.org)
- sitemap.xml
- robots.txt

Redeploy after changes.

**3. Test Contact Form**
- Fill out form with real info
- Verify email received
- Check Formspree dashboard for submission

**4. Verify Mobile Responsiveness**
- Test on actual phone/tablet if possible
- Or use browser dev tools (F12 → Toggle device toolbar)
- Check all breakpoints (375px, 768px, 1024px)

### Within First Week

**1. Set Up Google Search Console**
- Visit https://search.google.com/search-console
- Add property (your domain)
- Verify ownership (multiple methods available)
- Submit sitemap: `https://yourdomain.com/sitemap.xml`

**2. Set Up Bing Webmaster Tools**
- Visit https://www.bing.com/webmasters
- Add site
- Verify ownership
- Submit sitemap

**3. Install Analytics (Optional)**
- Create Google Analytics 4 property
- Get tracking code
- Add to all HTML files before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**4. Create Google Business Profile**
- Visit https://www.google.com/business
- Add business listing
- Verify ownership (mail, phone, or instant)
- Add photos, hours, services
- Link to website

**5. Set Up Social Media**
- Create Facebook Business Page
- Create LinkedIn Company Page
- Link to website from all profiles
- Update social links in footer

### Ongoing Maintenance

**Weekly:**
- Check contact form for submissions
- Monitor uptime (hosting platform usually provides)
- Review any error reports

**Monthly:**
- Add new project photos
- Request and add testimonials
- Review analytics for traffic insights
- Check Google Search Console for issues

**Quarterly:**
- Review and update service descriptions
- Audit SEO performance
- Update team photos/bios
- Run Lighthouse audits
- Check for broken links
- Update copyright year if needed

---

## Continuous Deployment Setup

Once you've deployed via Git (Netlify/Vercel/GitHub Pages), any code push triggers automatic deployment.

### Workflow for Updates

**Step 1: Make Local Changes**
```bash
# Edit files in your text editor
# Test locally by opening HTML in browser
```

**Step 2: Commit Changes**
```bash
cd C:\Users\Owner\Desktop\midwest-underground-website

# See what changed
git status

# Add changes
git add .

# Commit with descriptive message
git commit -m "Updated contact information and added new project"
```

**Step 3: Push to GitHub**
```bash
git push origin main
```

**Step 4: Automatic Deployment**
- Netlify/Vercel/GitHub Pages automatically detects push
- Builds and deploys (usually 30-90 seconds)
- You'll receive email when deployment completes
- Visit live site to verify

### Deployment Status

**Netlify:**
- Dashboard shows deployment status
- Green = success, Red = failed
- View build logs for errors

**Vercel:**
- Dashboard shows deployments
- Each deployment has unique preview URL
- Click to see live version

**GitHub Pages:**
- Actions tab shows deployment workflow
- Check mark = success
- X = failed (click for logs)

---

## Troubleshooting

### Common Deployment Issues

**Problem: 404 Error on Pages**
- **Cause:** Incorrect file paths or missing files
- **Solution:** Verify all HTML files are in root directory
- Check that file names match exactly (case-sensitive on Linux servers)

**Problem: Images Not Loading**
- **Cause:** Incorrect image paths
- **Solution:** Ensure images are in `/images/` folder
- Paths should be `images/filename.jpg` (no leading slash)

**Problem: CSS/JS Not Loading**
- **Cause:** Incorrect paths in HTML
- **Solution:** Check `<link>` and `<script>` tags
- Should be: `css/styles.css` and `js/main.js`

**Problem: Form Not Working**
- **Cause:** Incorrect Formspree ID
- **Solution:** Verify form action URL in contact.html
- Test form with your own email first

**Problem: Custom Domain Not Working**
- **Cause:** DNS not propagated yet
- **Solution:** Wait 24-48 hours after DNS changes
- Use https://dnschecker.org to check propagation
- Verify nameservers/records are correct

**Problem: SSL Certificate Error**
- **Cause:** Certificate not provisioned yet
- **Solution:** Wait 10-30 minutes after adding domain
- Force SSL renewal in hosting dashboard
- Check that domain is verified

**Problem: Mobile Menu Not Opening**
- **Cause:** JavaScript file not loading
- **Solution:** Verify `js/main.js` is uploaded
- Check browser console for errors (F12)
- Clear browser cache

### Getting Help

**Netlify Support:**
- Docs: https://docs.netlify.com
- Forums: https://answers.netlify.com
- Support: support@netlify.com (premium plans)

**Vercel Support:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**GitHub Pages:**
- Docs: https://docs.github.com/en/pages
- Community: https://github.community

---

## Performance Monitoring

### Tools to Use

**1. Google PageSpeed Insights**
- URL: https://pagespeed.web.dev/
- Test each page
- Aim for 90+ scores
- Follow recommendations

**2. GTmetrix**
- URL: https://gtmetrix.com/
- Detailed performance analysis
- Waterfall chart
- Historical tracking

**3. Lighthouse (Built into Chrome)**
- Open Chrome DevTools (F12)
- Go to Lighthouse tab
- Generate report
- Check Performance, Accessibility, SEO, Best Practices

### Performance Targets

- **Performance:** > 90
- **Accessibility:** > 90
- **Best Practices:** > 90
- **SEO:** > 90
- **Load Time:** < 3 seconds
- **Page Size:** < 2MB

---

## Security Best Practices

### Headers (Already Configured in netlify.toml)
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### HTTPS
- Always use HTTPS (automatic with Netlify/Vercel)
- Force HTTPS redirects (configured in netlify.toml)

### Form Security
- Formspree handles spam filtering
- Consider adding reCAPTCHA for extra protection
- Never store sensitive data in static files

### Regular Updates
- Update dependencies if you add any later
- Monitor for security advisories
- Keep hosting platform up to date

---

## Backup Strategy

### Git = Your Backup
- All code is version controlled
- Can revert to any previous commit
- Push regularly to GitHub

### Additional Backups
- Download site files monthly
- Store in separate location (Google Drive, Dropbox)
- Include images and documentation

### Backup Command
```bash
# From project directory
git archive --format=zip --output=backup-$(date +%Y%m%d).zip main
```

---

## Quick Reference

### Deployment Commands

**Netlify:**
```bash
netlify deploy --prod
```

**Vercel:**
```bash
vercel --prod
```

**Git Push (Auto-deploy):**
```bash
git add .
git commit -m "Your message"
git push origin main
```

### Useful URLs

- **Netlify Dashboard:** https://app.netlify.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repos:** https://github.com/YOUR_USERNAME
- **Google Search Console:** https://search.google.com/search-console
- **PageSpeed Insights:** https://pagespeed.web.dev
- **DNS Checker:** https://dnschecker.org

---

**Congratulations!** Your website is now live. Monitor performance, update content regularly, and watch your business grow online.

**Last Updated:** October 22, 2025
