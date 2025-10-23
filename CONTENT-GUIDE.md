# Content Update Guide - Midwest Underground Website

**Last Updated:** October 23, 2025
**Audience:** Business owners, marketing staff, non-technical users
**Purpose:** Easy content updates without coding knowledge

---

## Quick Reference

| What to Update | Where to Find It | Time Required |
|----------------|------------------|---------------|
| Contact info | Footer (all pages) | 5 minutes |
| Services | services.html | 10-15 minutes |
| Team bios | about.html | 15-20 minutes |
| Projects | projects.html | 20-30 minutes |
| Testimonials | index.html, projects.html | 10 minutes |
| Company story | about.html | 20-30 minutes |

---

## Before You Start

### Tools You Need
- **Text Editor:** Notepad++ (Windows), TextEdit (Mac), or VS Code
- **Web Browser:** Chrome, Firefox, or Edge for testing
- **Image Editor (optional):** Photoshop, GIMP, or online tools

### Important Rules
1. ✅ **Always make a backup** before editing any file
2. ✅ **Test changes locally** before deploying
3. ✅ **Keep formatting consistent** (don't delete HTML tags)
4. ✅ **Save files with UTF-8 encoding**
5. ❌ **Never delete HTML tags** (anything in `< >` brackets)

### How to Make a Backup
1. Find the file you want to edit
2. Right-click → "Copy"
3. Right-click → "Paste"
4. Rename copy to include date: `index-backup-2025-10-23.html`

---

## Common Content Updates

### 1. Update Contact Information

**Files to Update:** All pages have footer with contact info

**Example Footer Code:**
```html
<p><strong>Phone:</strong> <a href="tel:+13203826636">(320) 382-6636</a></p>
<p><strong>Email:</strong> <a href="mailto:info@midwestundergroundmn.com">info@midwestundergroundmn.com</a></p>
<p><strong>Address:</strong> 4320 County Rd 8 SE, Willmar, MN 56201</p>
```

**To Update:**
1. Open any HTML file in text editor
2. Search for "Phone:" or "Email:" or "Address:"
3. Find the text between `>` and `</` tags
4. Replace with new information
5. **Keep the HTML tags intact** (everything in `< >`)
6. Save file
7. Repeat for all 11 pages

**Files to Update (11 total):**
- index.html
- services.html
- about.html
- contact.html
- projects.html
- dashboard/index.html
- dashboard/projects.html
- dashboard/financials.html
- dashboard/customers.html
- dashboard/equipment.html
- dashboard/reports.html

---

### 2. Update Business Hours

**File:** contact.html
**Location:** Contact information section

**Find This:**
```html
<p><strong>Hours:</strong> Monday - Friday: 7:00 AM - 5:00 PM</p>
```

**Change To:**
```html
<p><strong>Hours:</strong> Monday - Friday: 8:00 AM - 6:00 PM</p>
```

**Example: Adding Saturday Hours**
```html
<p><strong>Hours:</strong><br>
Monday - Friday: 7:00 AM - 5:00 PM<br>
Saturday: 8:00 AM - 12:00 PM<br>
Sunday: Closed (Emergency calls only)</p>
```

---

### 3. Add a New Service

**File:** services.html
**Location:** Services section

**Step 1: Find the Last Service**
Look for code that looks like this:
```html
<div class="service-card">
  <div class="service-icon">🔧</div>
  <h3>Service Name</h3>
  <p>Service description...</p>
  <ul>
    <li>Benefit 1</li>
    <li>Benefit 2</li>
    <li>Benefit 3</li>
  </ul>
</div>
```

**Step 2: Copy Entire Service Card**
Copy from `<div class="service-card">` to the closing `</div>`

**Step 3: Paste After Last Service**
Paste the copied code after the last service card

**Step 4: Update Content**
- Change icon emoji (🔧 → ⚡ or 💧)
- Change service name
- Change description
- Update benefit bullets

**Example: Adding "Storm Drain Installation"**
```html
<div class="service-card">
  <div class="service-icon">💧</div>
  <h3>Storm Drain Installation</h3>
  <p>Professional storm water management systems to prevent flooding and erosion on your property. We install catch basins, drainage pipes, and complete stormwater solutions.</p>
  <ul>
    <li>Prevent property flooding</li>
    <li>Erosion control systems</li>
    <li>Compliant with local codes</li>
    <li>French drain systems</li>
    <li>Sump pump integration</li>
  </ul>
</div>
```

---

### 4. Update Company Story

**File:** about.html
**Location:** Company story section (near top of page)

**Find This Section:**
```html
<section class="py-16">
  <div class="container mx-auto px-4">
    <h2 class="section-heading">Our Story</h2>
    <div class="content-wrapper">
      <p>Founded in 1991...</p>
```

**What to Update:**
- Company founding story
- Key milestones
- Owner/founder information
- Growth trajectory
- Future vision

**Tips for Writing:**
- Keep paragraphs 3-5 sentences
- Total length: 400-600 words
- Mention specific years, projects, or achievements
- Keep professional but personal tone
- Include "why we do what we do"

**Example Opening:**
```html
<p>Midwest Underground was founded in 1991 by [Founder Name], who saw an opportunity to bring modern horizontal directional drilling technology to central Minnesota. Starting with a single drill rig and a commitment to quality, we've grown into one of the region's most trusted underground contractors.</p>

<p>Our first major project in 1992 was [specific project], which taught us valuable lessons about [key learning]. Since then, we've completed over 500 projects, installed more than 250 miles of fiber optic cable, and built a reputation for safety, reliability, and technical expertise.</p>
```

---

### 5. Update Team Member Profiles

**File:** about.html
**Location:** Team section

**Find Team Member Card:**
```html
<div class="team-member">
  <img src="images/team-president.jpg" alt="President Name" class="team-photo">
  <h3>John Doe</h3>
  <p class="text-secondary">President & Owner</p>
  <p>Bio text here...</p>
</div>
```

**What to Update:**
- Replace `[PLACEHOLDER: team-*.jpg]` with actual photo path
- Change "John Doe" to real name
- Update title/position
- Write genuine bio (2-3 sentences)

**Bio Writing Tips:**
- Mention years with company
- Include key certifications or expertise
- Mention one personal detail (hometown, interests)
- Keep professional tone

**Example Bio:**
```html
<p>John has been with Midwest Underground since 2005, bringing over 20 years of HDD experience. He holds advanced certifications in fiber optic splicing and is a certified OSHA safety trainer. When not on job sites, John enjoys fishing on Minnesota lakes.</p>
```

---

### 6. Add a New Project to Portfolio

**File:** projects.html
**Location:** Projects grid section

**Step 1: Copy Existing Project Card**
```html
<div class="project-card" data-category="fiber">
  <img src="images/project-willmar-fiber.jpg"
       alt="Willmar Fiber Network"
       class="project-image">
  <div class="project-info">
    <h3>Willmar Municipal Fiber Network</h3>
    <p><strong>Client:</strong> City of Willmar</p>
    <p><strong>Scope:</strong> 15 miles of underground fiber optic cable installation connecting government buildings, schools, and public facilities.</p>
    <p><strong>Completed:</strong> March 2024</p>
    <span class="project-tag">Fiber Optic</span>
  </div>
</div>
```

**Step 2: Update Content**
- Change `data-category` to match service type:
  - `hdd` - Horizontal Directional Drilling
  - `fiber` - Fiber Optic
  - `utilities` - Underground Utilities
  - `telecom` - Telecommunications
  - `emergency` - Emergency Services
  - `geothermal` - Geothermal Systems

- Change image path (after uploading photo)
- Update project name
- Update client name (or use "Confidential Client")
- Update scope description
- Update completion date
- Change project tag to match category

**Example: New Geothermal Project**
```html
<div class="project-card" data-category="geothermal">
  <img src="images/project-farm-geothermal-2025.jpg"
       alt="Agricultural Geothermal System"
       class="project-image">
  <div class="project-info">
    <h3>Large-Scale Farm Geothermal Installation</h3>
    <p><strong>Client:</strong> Confidential Agricultural Client</p>
    <p><strong>Scope:</strong> 12,000 feet of geothermal loop field installation for heating and cooling a 10,000 sq ft shop and office facility. Reduced energy costs by 60%.</p>
    <p><strong>Completed:</strong> September 2025</p>
    <span class="project-tag">Geothermal</span>
  </div>
</div>
```

**Step 3: Add Project Photo**
1. Take or select project photo
2. Resize to 800x600px
3. Compress to <200KB (use https://squoosh.app/)
4. Save to `/images/` folder
5. Name clearly: `project-farm-geothermal-2025.jpg`
6. Update image path in code

---

### 7. Add or Update Testimonials

**Files:** index.html (3 testimonials), projects.html (3 testimonials)

**Find Testimonial:**
```html
<div class="testimonial-card">
  <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
  <p class="testimonial-text">"Quote from customer..."</p>
  <div class="testimonial-author">
    <strong>John Smith</strong><br>
    Facilities Director, City of Willmar
  </div>
</div>
```

**What to Update:**
- Star rating (⭐⭐⭐⭐⭐ = 5 stars)
- Customer quote (keep 2-4 sentences)
- Customer name
- Customer title
- Company/organization name

**Testimonial Best Practices:**
- Get written permission to use name and quote
- Keep quotes authentic (don't edit too much)
- Use real titles and organizations
- Mix different customer types (municipal, commercial, residential)
- Focus on specific benefits or outcomes

**Example Real Testimonial:**
```html
<div class="testimonial-card">
  <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
  <p class="testimonial-text">"Midwest Underground completed our fiber installation three weeks ahead of schedule and under budget. Their crew was professional, safety-focused, and minimized disruption to city operations. I'd recommend them without hesitation."</p>
  <div class="testimonial-author">
    <strong>Sarah Johnson</strong><br>
    Public Works Director, City of Willmar
  </div>
</div>
```

---

### 8. Update Service Statistics

**File:** index.html
**Location:** "Why Choose Us" section

**Find Statistics:**
```html
<div class="stat-card">
  <div class="stat-number">34+</div>
  <p>Years Experience</p>
</div>
```

**Statistics to Update:**
- Years Experience (update annually)
- Team size (update when hiring)
- Projects completed
- Miles of fiber installed
- Safety record

**How to Update:**
1. Find the stat-card section
2. Change number inside `<div class="stat-number">`
3. Keep formatting (like `+` signs or `%`)
4. Save and test

**Example Update (2026):**
```html
<div class="stat-card">
  <div class="stat-number">35+</div>
  <p>Years Experience</p>
</div>

<div class="stat-card">
  <div class="stat-number">20</div>
  <p>Team Members</p>
</div>

<div class="stat-card">
  <div class="stat-number">600+</div>
  <p>Projects Completed</p>
</div>
```

---

### 9. Update Certifications and Licenses

**File:** about.html
**Location:** Certifications section

**Find This:**
```html
<ul class="cert-list">
  <li>Minnesota Technology Systems Contractor (TSC) License</li>
  <li>General Liability Insurance ($2M coverage)</li>
  <li>Workers Compensation Insurance</li>
  <li>OSHA Safety Certified</li>
</ul>
```

**What to Add:**
- New certifications (with dates)
- Updated insurance amounts
- Professional organization memberships
- Safety certifications
- Equipment operator certifications

**Example: Adding New Certification**
```html
<ul class="cert-list">
  <li>Minnesota Technology Systems Contractor (TSC) License #12345</li>
  <li>General Liability Insurance ($2M coverage)</li>
  <li>Workers Compensation Insurance</li>
  <li>OSHA 30-Hour Construction Safety Certification</li>
  <li>Fiber Optic Association (FOA) Certified</li>
  <li>National Utility Contractors Association (NUCA) Member</li>
  <li>Better Business Bureau A+ Rating</li>
</ul>
```

---

### 10. Add Equipment to About Page

**File:** about.html
**Location:** Equipment showcase section

**Find Equipment Item:**
```html
<div class="equipment-item">
  <h3>Modern HDD Rigs</h3>
  <p>Fleet of 8 directional drilling rigs ranging from compact units for residential work to large rigs capable of 1,200-foot bores.</p>
</div>
```

**To Add New Equipment:**
1. Copy entire `<div class="equipment-item">` to `</div>` block
2. Paste after last equipment item
3. Update heading (equipment name)
4. Update description

**Example: Adding New Equipment**
```html
<div class="equipment-item">
  <h3>Vacuum Excavation Trucks</h3>
  <p>State-of-the-art hydro-vac trucks for safe excavation around existing utilities, minimizing risk of damage and providing precise digging for utility location and potholing.</p>
</div>
```

---

## Image Management

### Image Requirements

| Location | Recommended Size | Max File Size | Format |
|----------|------------------|---------------|--------|
| Logo | 200x60px | 50KB | PNG or SVG |
| Hero images | 1920x1080px | 300KB | WebP or JPG |
| Project photos | 800x600px | 200KB | WebP or JPG |
| Team photos | 400x400px | 100KB | JPG |
| Service photos | 800x600px | 200KB | WebP or JPG |
| Equipment photos | 800x600px | 200KB | WebP or JPG |

### How to Optimize Images

**Option 1: Online Tool (Easiest)**
1. Go to https://squoosh.app/
2. Upload image
3. Choose WebP or JPG format
4. Adjust quality slider (usually 75-85% is good)
5. Check file size (<200KB for most images)
6. Download optimized image

**Option 2: Photoshop**
1. Open image in Photoshop
2. Image → Image Size → Set recommended dimensions
3. File → Export → Save for Web (Legacy)
4. Choose JPG, Quality: 60-80
5. Save optimized image

**Option 3: GIMP (Free)**
1. Open image in GIMP
2. Image → Scale Image → Set dimensions
3. File → Export As
4. Select JPG, adjust quality (60-80)
5. Export

### Uploading Images

1. Place optimized images in `/images/` folder
2. Name files clearly (no spaces):
   - Good: `project-willmar-fiber-2024.jpg`
   - Bad: `IMG_1234.jpg` or `my project photo.jpg`
3. Update HTML to reference image:
   ```html
   <img src="images/project-willmar-fiber-2024.jpg" alt="Willmar Fiber Network Installation">
   ```

### Alt Text for Images

**Always include alt text** for accessibility and SEO:

```html
<!-- Good alt text -->
<img src="images/hdd-rig.jpg" alt="Directional drilling rig working on fiber installation">

<!-- Bad alt text -->
<img src="images/hdd-rig.jpg" alt="Image">

<!-- Also bad (no alt text) -->
<img src="images/hdd-rig.jpg">
```

**Alt Text Rules:**
- Describe what's in the image
- Be specific and concise (5-15 words)
- Include relevant keywords naturally
- Don't start with "Image of..." or "Picture of..."

---

## Testing Your Changes

### Before Deployment Checklist

**Visual Check:**
- [ ] Open updated page in web browser
- [ ] Check spelling and grammar
- [ ] Verify phone numbers and email addresses
- [ ] Confirm all images load correctly
- [ ] Check for broken layout (misaligned text, overlapping elements)

**Link Check:**
- [ ] Click all internal links (go to correct page?)
- [ ] Click phone numbers (open dial app on mobile?)
- [ ] Click email addresses (open email client?)
- [ ] Test contact form submission

**Mobile Check:**
- [ ] Open on phone or tablet
- [ ] Text readable (not too small?)
- [ ] Images display correctly?
- [ ] Buttons are tappable?
- [ ] Menu opens and closes?

**Dark Mode Check:**
- [ ] Toggle dark mode on
- [ ] Text readable in dark theme?
- [ ] Images look good?
- [ ] Toggle back to light mode

---

## Common Mistakes to Avoid

### ❌ DON'T Do This:

1. **Don't delete HTML tags**
   ```html
   <!-- WRONG - deleted <p> tags -->
   Contact us today!

   <!-- CORRECT - kept <p> tags -->
   <p>Contact us today!</p>
   ```

2. **Don't delete closing tags**
   ```html
   <!-- WRONG - missing </div> -->
   <div class="service-card">
     <h3>Service Name</h3>

   <!-- CORRECT - has closing </div> -->
   <div class="service-card">
     <h3>Service Name</h3>
   </div>
   ```

3. **Don't use special characters unencoded**
   ```html
   <!-- WRONG -->
   <p>We're #1 in drilling & utilities</p>

   <!-- CORRECT -->
   <p>We're #1 in drilling &amp; utilities</p>
   ```

   **Special Character Codes:**
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`
   - `"` → `&quot;`
   - `'` → `&apos;` or `&#39;`

4. **Don't upload huge images**
   - Slows down website
   - Uses mobile data
   - Hurts SEO
   - Always optimize (see Image Management section)

5. **Don't change file names without updating references**
   ```html
   <!-- If you rename "project-fiber.jpg" to "project-willmar.jpg" -->
   <!-- You must update the HTML too: -->
   <img src="images/project-willmar.jpg" alt="...">
   ```

---

## Emergency Rollback

If you break something and need to restore:

### Option 1: Use Your Backup
1. Delete broken file
2. Rename backup file (remove "-backup-2025-10-23" from filename)
3. Refresh browser

### Option 2: Re-download from Hosting
1. Go to Netlify/Vercel dashboard
2. Find "Deploys" section
3. Click on last successful deployment
4. Download original files
5. Replace broken file

### Option 3: Use Git (If Available)
1. Open terminal/command prompt
2. Navigate to project folder
3. Run: `git checkout -- filename.html`
4. File will be restored to last committed version

---

## Content Calendar & Strategy

### Monthly Content Updates

**Every Month:**
- [ ] Review and update project statistics
- [ ] Add 1-2 new completed projects to portfolio
- [ ] Check for outdated information
- [ ] Update any seasonal messaging

**Quarterly (Every 3 Months):**
- [ ] Review and refresh team photos if needed
- [ ] Update certifications and licenses
- [ ] Add new customer testimonials
- [ ] Review and optimize page content

**Annually:**
- [ ] Update "Years Experience" stat
- [ ] Refresh company story with new milestones
- [ ] Take new project photos
- [ ] Review entire website for accuracy

### Content Ideas for Blog (Future)

When you add a blog section, consider these topics:

**Technical Topics:**
- How HDD works (simplified explanation)
- Benefits of fiber optic vs. copper
- Geothermal systems explained
- Safety best practices

**Project Spotlights:**
- Featured project of the month
- Before/after photos
- Client interviews
- Lessons learned

**Industry News:**
- Minnesota broadband expansion updates
- New equipment or technology
- Regulatory changes
- Industry trends

**Company News:**
- New equipment acquisitions
- Team member spotlights
- Community involvement
- Safety milestones

---

## Getting Help

### Internal Documentation
- **MAINTENANCE.md** - Technical maintenance guide
- **NEXT-STEPS.md** - Roadmap and action plan
- **PRE-LAUNCH-CHECKLIST.md** - Deployment checklist
- **PLACEHOLDERS.md** - Track content that needs replacing

### Need Technical Help?
- Check docs/ folder for technical guides
- Search issue on Google
- Consider hiring web developer for complex changes

### Quick Questions?
- **HTML basics:** https://www.w3schools.com/html/
- **Image optimization:** https://squoosh.app/
- **Color picker:** https://htmlcolorcodes.com/
- **Icon finder:** https://emojipedia.org/

---

## Summary Checklist

**Before Editing:**
- [ ] Make backup copy of file
- [ ] Know what you want to change
- [ ] Have new content ready (text, images)

**While Editing:**
- [ ] Use text editor (not Word or Pages)
- [ ] Don't delete HTML tags
- [ ] Keep formatting consistent
- [ ] Save frequently

**After Editing:**
- [ ] Test locally in browser
- [ ] Check on mobile device
- [ ] Verify all links work
- [ ] Check spelling
- [ ] Deploy to production

**After Deployment:**
- [ ] Test live site
- [ ] Check on real mobile device
- [ ] Ask colleague to review
- [ ] Monitor for issues

---

**Remember:** Take your time, test changes, and don't be afraid to use your backup if something goes wrong. You've got this! 🚀

---

**Last Updated:** October 23, 2025
**Questions?** Review MAINTENANCE.md for more technical details or hire a developer for complex changes.
