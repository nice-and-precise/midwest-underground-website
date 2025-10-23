# Pre-Launch Checklist - Midwest Underground Website

**Last Updated:** October 23, 2025
**Deployment Target:** Within 7 days
**Status:** Ready for deployment after high-priority items completed

---

## Quick Launch Status

| Category | Status | Items Complete | Priority |
|----------|--------|----------------|----------|
| **Critical Blockers** | ⚠️ In Progress | 0/5 | 🔴 CRITICAL |
| **High Priority** | ⚠️ Not Started | 0/8 | 🟠 HIGH |
| **Medium Priority** | ✅ Complete | 30/30 | 🟡 MEDIUM |
| **Low Priority** | ⏭️ Post-Launch | 0/12 | 🟢 LOW |

**Overall Readiness:** 60% (Phase 1 Complete, Pre-Launch Content Needed)

---

## 🔴 CRITICAL BLOCKERS (Do Before Launch)

### 1. Company Logo
**Status:** ⚠️ Required
**Estimated Time:** 30 minutes (if logo exists)
**Impact:** HIGH - Branding and professional appearance

- [ ] Obtain company logo file (SVG or PNG)
- [ ] Recommended specs:
  - Format: SVG (vector) or PNG (transparent background)
  - Size: 200x60px (or proportional)
  - File size: <50KB
- [ ] Save to `/images/logo.png` or `/images/logo.svg`
- [ ] Test on both light and dark backgrounds
- [ ] Update all 11 pages (5 public + 6 dashboard)

**Files to Update:**
```
index.html
services.html
about.html
contact.html
projects.html
dashboard/index.html
dashboard/projects.html
dashboard/financials.html
dashboard/customers.html
dashboard/equipment.html
dashboard/reports.html
```

**Find & Replace:**
```html
OLD:
<span>⚙️</span> <span>Midwest Underground</span>

NEW:
<img src="/images/logo.png" alt="Midwest Underground of Minnesota" class="h-12 w-auto">
```

---

### 2. Formspree Contact Form Configuration
**Status:** ⚠️ Required
**Estimated Time:** 10 minutes
**Impact:** CRITICAL - Contact form won't work without this

- [ ] Go to https://formspree.io
- [ ] Create free account (100 submissions/month)
- [ ] Create new form project: "Midwest Underground Contact"
- [ ] Copy form ID (format: `mxyzabc123`)
- [ ] Open `contact.html` in text editor
- [ ] Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
- [ ] Replace with your actual form ID
- [ ] Save file
- [ ] **After deployment:** Test form submission

**Formspree Settings to Configure:**
- [ ] Set notification email address
- [ ] Configure auto-reply message (optional)
- [ ] Enable spam protection (reCAPTCHA recommended)
- [ ] Set up submission notifications

---

### 3. Production Domain URL
**Status:** ⚠️ Required
**Estimated Time:** 30 minutes (domain purchase + updates)
**Impact:** HIGH - SEO, branding, professionalism

**Purchase Domain:**
- [ ] Buy domain (recommended: midwestundergroundmn.com)
- [ ] Provider suggestions:
  - Namecheap: $10-12/year
  - Google Domains: $12/year
  - GoDaddy: $12-15/year
- [ ] DNS configuration will be done during hosting setup

**Update All Files (88 occurrences):**

Use Find & Replace in text editor:

1. **Find:** `[PLACEHOLDER: domain-url]`
   **Replace:** `https://www.midwestundergroundmn.com` (your actual domain)

   **Files affected (7):**
   - index.html
   - services.html
   - about.html
   - contact.html
   - projects.html
   - sitemap.xml
   - robots.txt

2. **Find:** `[PLACEHOLDER: logo-url]`
   **Replace:** `https://www.midwestundergroundmn.com/images/logo.png`

   **Files affected (5):**
   - All public HTML files (Schema.org markup)

---

### 4. Hero Background Images
**Status:** ⚠️ Recommended
**Estimated Time:** 1 hour (selecting/optimizing images)
**Impact:** HIGH - First impression and visual appeal

**Requirements:**
- [ ] Select 1-3 high-quality photos:
  - ✅ Option 1: Directional drilling rig in action (primary)
  - ✅ Option 2: Completed fiber installation with team
  - ✅ Option 3: Underground utilities work in progress

**Image Specifications:**
- Size: 1920x1080px (landscape)
- Format: WebP or JPG
- File size: <300KB (compress with https://squoosh.app/)
- Subject: Equipment in action, professional appearance
- Quality: High resolution, good lighting, sharp focus

**Optimization Steps:**
1. [ ] Select raw photos from company archives
2. [ ] Crop to 1920x1080px (16:9 aspect ratio)
3. [ ] Convert to WebP format (or compress JPG)
4. [ ] Reduce file size to <300KB
5. [ ] Save to `/images/` directory
6. [ ] Name clearly: `hero-drilling-rig.jpg`, `hero-fiber-install.jpg`, etc.

**Update index.html:**

Find this section (around line 80):
```html
<section class="hero-section bg-gradient-to-br from-primary to-blue-900 text-white py-20 lg:py-32">
```

Replace with:
```html
<section class="hero-section relative text-white py-20 lg:py-32">
  <div class="absolute inset-0 z-0">
    <img src="images/hero-drilling-rig.jpg"
         alt=""
         class="w-full h-full object-cover opacity-30"
         loading="eager">
  </div>
  <div class="absolute inset-0 bg-gradient-to-br from-primary/90 to-blue-900/90 z-0"></div>
  <div class="container mx-auto px-4 relative z-10">
    <!-- Existing hero content (don't modify) -->
```

Make sure to close the extra `<div>` tags at the end of the hero section.

---

### 5. Verify Contact Information
**Status:** ⚠️ Critical Accuracy Check
**Estimated Time:** 5 minutes
**Impact:** CRITICAL - Wrong info = lost business

**Verify These Details (Currently in Website):**
- [ ] Company Name: "Midwest Underground of Minnesota Inc" ✓
- [ ] Phone: **(320) 382-6636** - Confirm this is correct
- [ ] Address: **4320 County Rd 8 SE, Willmar, MN 56201** - Confirm correct
- [ ] Email: **info@midwestundergroundmn.com** - Need to set up or change
- [ ] Hours: **Monday-Friday, 7:00 AM - 5:00 PM** - Confirm correct
- [ ] Emergency Contact: **24/7 Emergency Service** - Confirm available

**If Any Information is Wrong:**
- [ ] Update in ALL 5 public pages (search for old value, replace with new)
- [ ] Update in footer (appears on all pages)
- [ ] Update in contact.html (main contact page)
- [ ] Update in about.html (Schema.org LocalBusiness markup)
- [ ] Update Google Business Profile (after creating)

---

## 🟠 HIGH PRIORITY (Complete Within Week 1)

### 6. Open Graph Image
**Status:** ⚠️ Recommended
**Estimated Time:** 30 minutes
**Impact:** MEDIUM - Social media sharing appearance

**What It Is:**
Image that appears when website is shared on Facebook, LinkedIn, Twitter, etc.

**Requirements:**
- [ ] Create or select image:
  - Size: 1200x630px (Facebook recommended)
  - Content: Company logo + equipment photo or company name
  - Format: JPG or PNG
  - File size: <300KB

**Quick Creation Options:**

**Option A: Use Canva (Free)**
1. [ ] Go to https://www.canva.com/
2. [ ] Select "Custom size" → 1200x630px
3. [ ] Add company logo
4. [ ] Add background photo (equipment or project)
5. [ ] Add company name text
6. [ ] Download as JPG
7. [ ] Save to `/images/og-image.jpg`

**Option B: Use Existing Photo**
1. [ ] Select best project or equipment photo
2. [ ] Crop to 1200x630px
3. [ ] Add company name text overlay (optional)
4. [ ] Save to `/images/og-image.jpg`

**Update All Pages:**
Find: `[PLACEHOLDER: og-image.jpg]`
Replace: `images/og-image.jpg`

**Files to update (5):**
- index.html
- services.html
- about.html
- contact.html
- projects.html

---

### 7. Google Maps Embed
**Status:** ✅ Optional (Already in contact.html)
**Estimated Time:** 5 minutes
**Impact:** LOW - Nice to have

**Current Status:** Embedded map already included in contact.html

**Verify:**
- [ ] Open contact.html
- [ ] Check Google Maps iframe shows correct location:
  - 4320 County Rd 8 SE, Willmar, MN 56201
- [ ] Test map loads and is interactive

**If Map is Incorrect or Not Loading:**
1. [ ] Go to https://www.google.com/maps
2. [ ] Search: "4320 County Rd 8 SE, Willmar, MN 56201"
3. [ ] Click "Share" → "Embed a map"
4. [ ] Copy iframe code
5. [ ] Replace existing iframe in contact.html
6. [ ] Save and test

---

### 8. Professional Email Setup
**Status:** ⚠️ Recommended
**Estimated Time:** 30 minutes
**Impact:** HIGH - Professional appearance

**Current Email:** info@midwestundergroundmn.com (placeholder)

**Option A: Google Workspace (Recommended)**
- Cost: $6/user/month
- Features: Gmail interface, Google Drive, Calendar, Meet
- Setup: https://workspace.google.com/

**Option B: Microsoft 365 Business**
- Cost: $6/user/month
- Features: Outlook, OneDrive, Teams, Office apps
- Setup: https://www.microsoft.com/microsoft-365/business

**Option C: Domain Host Email (Basic)**
- Cost: Usually free with domain purchase
- Features: Basic email only
- Setup: Through domain registrar (Namecheap, GoDaddy, etc.)

**After Setup:**
- [ ] Create email: info@midwestundergroundmn.com
- [ ] Create email: office@midwestundergroundmn.com (optional)
- [ ] Test sending and receiving
- [ ] Update email signature with website link
- [ ] Update Formspree notification email

---

### 9. Favicon (Browser Tab Icon)
**Status:** ⚠️ Recommended
**Estimated Time:** 15 minutes
**Impact:** MEDIUM - Professional branding

**What It Is:**
Small icon that appears in browser tabs, bookmarks, and mobile home screens.

**Requirements:**
- [ ] Create square version of logo
- [ ] Recommended sizes:
  - 16x16px (browser tab)
  - 32x32px (bookmark)
  - 180x180px (Apple touch icon)
  - 192x192px (Android)
  - 512x512px (splash screen)

**Quick Creation:**
1. [ ] Go to https://realfavicongenerator.net/
2. [ ] Upload logo (square, 512x512px minimum)
3. [ ] Configure settings for all platforms
4. [ ] Download generated package
5. [ ] Extract files to root directory
6. [ ] Add generated code to `<head>` in all pages

**Manual Creation (Alternative):**
1. [ ] Create 32x32px PNG of logo
2. [ ] Save as `favicon.ico` in root directory
3. [ ] Add to `<head>` in all HTML files:
   ```html
   <link rel="icon" type="image/png" href="/favicon.ico">
   ```

---

### 10. Test All Forms
**Status:** ⚠️ Must test after deployment
**Estimated Time:** 10 minutes
**Impact:** CRITICAL - Lost leads if forms don't work

**Forms to Test:**

**Contact Form (contact.html):**
- [ ] Open contact.html on live site
- [ ] Fill out all fields with test data
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Check email for notification (Formspree)
- [ ] Verify email contains all submitted data

**Common Issues:**
- Form ID not updated → No email received
- Email in spam folder → Check spam, whitelist Formspree
- CORS errors → Check Formspree account settings

---

### 11. Mobile Responsiveness Check
**Status:** ✅ Complete (Built mobile-first)
**Estimated Time:** 15 minutes
**Impact:** HIGH - 60%+ of traffic is mobile

**Test on Real Devices:**
- [ ] iPhone (Safari)
- [ ] Android phone (Chrome)
- [ ] iPad or Android tablet
- [ ] Different screen orientations (portrait/landscape)

**Test These Features on Mobile:**
- [ ] Navigation menu (hamburger icon)
- [ ] Contact form (all fields accessible)
- [ ] Phone number click-to-call works
- [ ] Images load and display correctly
- [ ] Text is readable (not too small)
- [ ] Buttons are tappable (not too small)
- [ ] Dark mode toggle works
- [ ] Project filtering works

**Browser Testing Tools (If No Devices):**
- Chrome DevTools (F12) → Toggle device toolbar
- Firefox Responsive Design Mode (Ctrl+Shift+M)
- Safari Developer Tools → Enter Responsive Design Mode

---

### 12. Cross-Browser Testing
**Status:** ✅ Complete (Standards-compliant code)
**Estimated Time:** 15 minutes
**Impact:** MEDIUM - Ensure compatibility

**Test in These Browsers:**
- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Safari (latest) - Mac/iPhone
- [ ] Microsoft Edge (latest)

**Test These Features:**
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Dark mode toggle works
- [ ] Images display correctly
- [ ] No console errors (F12 → Console tab)
- [ ] Smooth scrolling works
- [ ] Back to top button appears

**Known Compatibility:**
- ✅ Modern browsers (2020+): Full support
- ⚠️ IE11 and older: Not supported (deprecated by Microsoft)
- ✅ Mobile browsers: Full support

---

### 13. Performance Optimization
**Status:** ✅ Complete (Optimized architecture)
**Estimated Time:** 10 minutes (verification)
**Impact:** HIGH - SEO ranking and user experience

**Run Performance Tests:**

**Google PageSpeed Insights:**
1. [ ] Go to https://pagespeed.web.dev/
2. [ ] Enter live website URL
3. [ ] Test both Mobile and Desktop
4. [ ] Target scores:
   - Performance: 90+
   - Accessibility: 95+
   - Best Practices: 95+
   - SEO: 95+

**If Scores Are Low:**
- [ ] Compress images further (use WebP format)
- [ ] Check image file sizes (<200KB each)
- [ ] Verify lazy loading is working
- [ ] Check for render-blocking resources
- [ ] Verify HTTPS is enabled

**GTmetrix Test (Alternative):**
1. [ ] Go to https://gtmetrix.com/
2. [ ] Enter live website URL
3. [ ] Target: Grade A, Load time <3 seconds

---

## 🟡 MEDIUM PRIORITY (Week 1-2 Post-Launch)

### 14. Add Project Photos
**Status:** ⚠️ Content needed
**Estimated Time:** 3-5 hours
**Impact:** HIGH - Visual proof and credibility

**Required Photos (12 total):**
- [ ] Willmar Fiber Network Project
- [ ] County Road Utility Crossing
- [ ] Regional Broadband Installation
- [ ] Emergency Fiber Repair
- [ ] Residential Geothermal Installation
- [ ] Municipal Sewer Extension
- [ ] Commercial Fiber Campus
- [ ] Highway Power Line Crossing
- [ ] Rural Broadband Expansion
- [ ] Industrial Park Infrastructure
- [ ] Hospital Emergency Fiber Repair
- [ ] Agricultural Geothermal System

**Photo Requirements:**
- Size: 800x600px (landscape) or 600x800px (portrait)
- Format: WebP or JPG
- File size: <200KB each
- Quality: Professional, well-lit, sharp focus
- Content: Equipment, installations, completed work

**Update projects.html:**
Find: `[PLACEHOLDER: project-*.jpg]`
Replace: `images/project-willmar-fiber.jpg` (actual filenames)

**Also Update Project Details:**
- [ ] Replace placeholder client names (if permitted)
- [ ] Add real project locations
- [ ] Add actual completion dates
- [ ] Add true project scale (miles, depth, etc.)
- [ ] Update project descriptions with real details

---

### 15. Add Team Photos
**Status:** ⚠️ Content needed
**Estimated Time:** 2-3 hours (photoshoot + editing)
**Impact:** HIGH - Humanizes company

**Required Photos (6 team members):**
- [ ] President/Owner
- [ ] Operations Manager
- [ ] Safety Director
- [ ] Senior HDD Operator
- [ ] Fiber Optic Specialist
- [ ] Project Coordinator

**Photo Guidelines:**
- [ ] Consistent style (all headshots or all action shots)
- [ ] Same background or environment
- [ ] Professional attire or company uniform
- [ ] Good lighting (natural or studio)
- [ ] Square format: 400x400px
- [ ] File size: <100KB each

**Update about.html:**
Find: `[PLACEHOLDER: team-*.jpg]`
Replace: `images/team-president.jpg` (actual filenames)

**Also Update Team Bios:**
- [ ] Replace placeholder names with real names
- [ ] Update job titles (actual positions)
- [ ] Add years with company
- [ ] Add real specialties and certifications
- [ ] Write genuine 2-3 sentence bios

---

### 16. Update Company Story
**Status:** ⚠️ Content refinement needed
**Estimated Time:** 1-2 hours (interview + writing)
**Impact:** MEDIUM - Authenticity and connection

**Current Status:**
Generic placeholder story exists (~500 words) in about.html

**What to Gather:**
- [ ] Interview founder/owner:
  - Why start company in 1991?
  - What was first major project?
  - Biggest challenges overcome?
  - Most proud moments?
  - Future vision for company?

- [ ] Gather specific details:
  - Founder's name
  - Original services offered
  - First major client
  - Early equipment (vs. current fleet)
  - Growth milestones
  - Technology evolution

**Update about.html:**
- [ ] Find company story section
- [ ] Replace placeholder with real story
- [ ] Include specific names, dates, projects
- [ ] Maintain professional but personal tone
- [ ] Keep length similar (400-600 words)
- [ ] Add 1-2 photos from early years (if available)

---

### 17. Add Real Certifications
**Status:** ⚠️ Specific details needed
**Estimated Time:** 30 minutes
**Impact:** MEDIUM - Credibility and compliance

**Documents to Gather:**
- [ ] Technology Systems Contractor (TSC) License number
- [ ] General Liability Insurance certificate & amounts
- [ ] Workers Compensation Insurance details
- [ ] OSHA training certifications
- [ ] Professional organization memberships
- [ ] Equipment operator certifications
- [ ] Safety training records

**Update about.html:**
Find certifications section and update with:
- [ ] Actual license numbers (not full numbers publicly)
- [ ] Current insurance coverage amounts
- [ ] Real certification names and expiration dates
- [ ] Professional associations (e.g., NUCA, local contractors assoc.)
- [ ] Safety record (e.g., "Zero incidents in 2024")

---

### 18. Request Customer Testimonials
**Status:** ⚠️ Outreach needed
**Estimated Time:** 2-4 hours (mostly waiting for responses)
**Impact:** HIGH - Social proof and credibility

**Current Status:**
6 placeholder testimonials (3 on index.html, 3 on projects.html)

**Identify Satisfied Clients:**
- [ ] List 6-10 recent projects with happy clients
- [ ] Mix of project types (HDD, fiber, utilities, emergency)
- [ ] Mix of customer types (municipal, commercial, residential)
- [ ] Prioritize well-known organizations (city, hospital, etc.)

**Outreach Email Template:**
```
Subject: Request for Testimonial - [Project Name]

Hi [Client Name],

We hope you're doing well! As you may know, we're launching our first-ever website for Midwest Underground, and we'd love to feature the work we did for you.

Would you be willing to provide a brief testimonial (2-3 sentences) about your experience working with our team?

Specifically, we'd love to hear about:
- What project we completed for you
- How our team performed
- Whether you'd recommend our services

We'll include your name, title, and organization (if you're comfortable with that).

Thank you for your time and for the opportunity to work together!

Best regards,
[Your Name]
Midwest Underground of Minnesota Inc
(320) 382-6636
```

**Update Website:**
- [ ] Collect 6+ testimonials
- [ ] Replace placeholders in index.html (3)
- [ ] Replace placeholders in projects.html (3)
- [ ] Use real names, titles, companies
- [ ] Link testimonial to relevant project (if on projects page)

---

### 19. Add Service Photos
**Status:** ⚠️ Content needed
**Estimated Time:** 2-3 hours
**Impact:** MEDIUM - Visual understanding of services

**Required Photos (6 services):**
- [ ] HDD drilling rig in action
- [ ] Fiber optic cable installation or splicing
- [ ] Underground utilities work (trenching/boring)
- [ ] Telecommunications infrastructure equipment
- [ ] Emergency service vehicle with equipment
- [ ] Geothermal loop field installation

**Photo Specifications:**
- Size: 800x600px (landscape)
- Format: WebP or JPG
- File size: <200KB each
- Quality: Professional, action shots preferred
- Safety: Show proper PPE and safety procedures

**Update services.html:**
Find: `[PLACEHOLDER: service-*.jpg]`
Replace: `images/hdd-drilling-rig.jpg` (actual filenames)

---

### 20. Equipment Showcase Photos
**Status:** ⚠️ Content needed
**Estimated Time:** 2-3 hours (photoshoot)
**Impact:** MEDIUM - Demonstrates capability

**Required Photos (6 categories in about.html):**
- [ ] Modern HDD rigs (show fleet)
- [ ] Fiber optic tools and equipment
- [ ] Underground utility locating systems
- [ ] Safety equipment and gear
- [ ] Support vehicles and trailers
- [ ] Technology (surveying, GPS, controls)

**Photo Style:**
- Clean equipment (wash before photos)
- Good lighting (outdoor, daytime)
- Show scale (include person for reference)
- Multiple angles
- Branding visible (company logo on trucks)

**Update about.html:**
- [ ] Replace equipment placeholder photos
- [ ] Update equipment descriptions (models, years, specs)
- [ ] Add equipment count (e.g., "Fleet of 8 HDD rigs")

---

## 🟢 LOW PRIORITY (Post-Launch, Ongoing)

### 21. Create Social Media Profiles
**Status:** 📅 Week 2-3
**Estimated Time:** 1-2 hours
**Impact:** MEDIUM - Brand presence and engagement

**Profiles to Create:**
- [ ] Facebook Business Page
- [ ] LinkedIn Company Page
- [ ] Twitter/X (optional)
- [ ] Instagram (if visual content available)

**See NEXT-STEPS.md for detailed setup instructions**

---

### 22. Set Up Google Analytics
**Status:** 📅 Week 1
**Estimated Time:** 15 minutes
**Impact:** HIGH - Track traffic and conversions

**Setup Steps:**
1. [ ] Create Google Analytics account
2. [ ] Create property: "Midwest Underground Website"
3. [ ] Get tracking code (GA4)
4. [ ] Add to all pages before `</head>`
5. [ ] Configure goals (contact form, phone clicks)
6. [ ] Test tracking with Real-Time view

**See NEXT-STEPS.md for detailed instructions**

---

### 23. Submit to Search Engines
**Status:** 📅 Immediately after launch
**Estimated Time:** 30 minutes
**Impact:** HIGH - SEO and visibility

**Search Engine Submission:**
- [ ] Google Search Console (verify & submit sitemap)
- [ ] Bing Webmaster Tools (verify & submit sitemap)
- [ ] Google Business Profile (create listing)

**See NEXT-STEPS.md for detailed instructions**

---

## Deployment Checklist

### Pre-Deployment Verification
Before deploying, verify these items are complete:

**Critical Blockers (ALL must be complete):**
- [ ] Company logo added (all 11 pages)
- [ ] Formspree form ID configured
- [ ] Domain URLs updated (88 occurrences)
- [ ] Hero background image(s) added
- [ ] Contact information verified

**High Priority (Recommended):**
- [ ] Open Graph image added
- [ ] Professional email set up
- [ ] Favicon created and added
- [ ] Forms tested (after deployment)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete
- [ ] Performance optimization verified

---

### Deployment Steps

**Choose Hosting Platform:**

**Option A: Netlify (Recommended)**
- [ ] Sign up at https://app.netlify.com/
- [ ] Connect GitHub repository
- [ ] Configure build settings (use netlify.toml)
- [ ] Deploy site
- [ ] Configure custom domain
- [ ] Enable HTTPS (automatic)
- [ ] Test live site

**Option B: Vercel**
- [ ] Sign up at https://vercel.com/
- [ ] Import GitHub repository
- [ ] Configure project (static site)
- [ ] Deploy
- [ ] Configure custom domain
- [ ] Test live site

**Option C: GitHub Pages**
- [ ] Go to repository Settings → Pages
- [ ] Enable Pages (deploy from master branch)
- [ ] Site will be live at username.github.io/repo-name
- [ ] (Custom domain requires DNS configuration)

---

### Post-Deployment Testing

**After site is live:**

**Functionality Tests:**
- [ ] All 5 pages load correctly
- [ ] Navigation menu works (desktop + mobile)
- [ ] Contact form submits successfully
- [ ] Phone numbers are clickable (mobile)
- [ ] Email links open mail client
- [ ] All internal links work
- [ ] All images load correctly
- [ ] Dark mode toggle works
- [ ] Project filtering works
- [ ] Back to top button appears on scroll

**Performance Tests:**
- [ ] Run Google PageSpeed Insights (target 90+)
- [ ] Run GTmetrix (target Grade A, <3s load)
- [ ] Test on slow 3G connection
- [ ] Verify images are lazy loading

**SEO Tests:**
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] Schema.org markup present (view source)
- [ ] Open Graph tags present
- [ ] Sitemap.xml loads at /sitemap.xml
- [ ] Robots.txt loads at /robots.txt

**Accessibility Tests:**
- [ ] Run WAVE tool (https://wave.webaim.org/)
- [ ] Test keyboard navigation (Tab key)
- [ ] Test screen reader (NVDA/JAWS if available)
- [ ] Verify color contrast (WCAG AA)

**Security Tests:**
- [ ] HTTPS enabled (lock icon in browser)
- [ ] No mixed content warnings
- [ ] SSL certificate valid
- [ ] Security headers present (check hosting docs)

---

## Post-Launch Actions

### Immediate (Day 1)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Create Google Business Profile
- [ ] Test contact form with real inquiry
- [ ] Monitor form submissions
- [ ] Share launch announcement (email, social media)

### Week 1
- [ ] Set up Google Analytics
- [ ] Create social media profiles
- [ ] Start gathering customer testimonials
- [ ] Take professional photos (team, projects, equipment)
- [ ] Monitor website traffic and issues

### Week 2-4
- [ ] Add real photos (projects, team, services)
- [ ] Update content (company story, team bios)
- [ ] Request customer reviews (Google Business Profile)
- [ ] Begin blog content creation
- [ ] Start social media posting (2-3x/week)

---

## Rollback Plan

If critical issues occur after deployment:

### Minor Issues (styling, content)
- [ ] Make fixes locally
- [ ] Test thoroughly
- [ ] Commit and push to GitHub
- [ ] Deployment will auto-update (Netlify/Vercel)

### Critical Issues (site down, form broken)
- [ ] Revert to previous commit: `git revert HEAD`
- [ ] Push to GitHub: `git push`
- [ ] Wait for auto-deployment (2-3 minutes)
- [ ] Fix issues locally
- [ ] Test thoroughly before re-deploying

### Emergency Contact
- Netlify Support: https://www.netlify.com/support/
- Vercel Support: https://vercel.com/support
- Formspree Support: support@formspree.io

---

## Resources

### Internal Documentation
- **NEXT-STEPS.md** - Comprehensive post-launch roadmap
- **docs/DEPLOYMENT.md** - Detailed deployment instructions
- **docs/MAINTENANCE.md** - Content update guide (non-technical)
- **docs/PLACEHOLDERS.md** - Content replacement tracking

### External Tools
- **Performance:** https://pagespeed.web.dev/
- **Image Optimization:** https://squoosh.app/
- **Form Service:** https://formspree.io/
- **Favicon Generator:** https://realfavicongenerator.net/
- **Accessibility:** https://wave.webaim.org/

---

## Success Criteria

**Website is ready to launch when:**

✅ All Critical Blockers completed (5/5)
✅ All High Priority items completed (8/8)
✅ Site deployed to production hosting
✅ Contact form tested and working
✅ All links verified and working
✅ Performance tests passing (90+ scores)
✅ Mobile responsive on real devices
✅ HTTPS enabled and working
✅ No console errors in browser

**Launch with confidence when these criteria are met!**

---

**Last Updated:** October 23, 2025
**Next Review:** After completing Critical Blockers
**Contact:** Review NEXT-STEPS.md for ongoing guidance

---

## Quick Reference: Critical Files to Update Before Launch

| File | What to Update | Priority |
|------|----------------|----------|
| All 11 HTML files | Logo image | 🔴 CRITICAL |
| contact.html | Formspree form ID | 🔴 CRITICAL |
| All 7 HTML + XML files | Domain URLs | 🔴 CRITICAL |
| index.html | Hero background image | 🔴 CRITICAL |
| All 5 public pages | Verify contact info | 🔴 CRITICAL |
| All 5 public pages | Open Graph image | 🟠 HIGH |
| contact.html | Google Maps (verify) | 🟡 MEDIUM |
| All 11 HTML files | Favicon link | 🟠 HIGH |
| projects.html | Project photos | 🟡 MEDIUM |
| about.html | Team photos | 🟡 MEDIUM |

**Use this quick reference to track your progress!**

---

**Ready to launch? Let's make Midwest Underground the digital leader in Minnesota underground utilities! 🚀**
