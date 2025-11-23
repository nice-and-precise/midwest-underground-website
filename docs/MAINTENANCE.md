<!-- TOC -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Quick Updates](#quick-updates)
  - [Tools You'll Need](#tools-youll-need)
  - [File Structure Quick Reference](#file-structure-quick-reference)
- [Editing Page Content](#editing-page-content)
  - [Step 1: Open the HTML File](#step-1-open-the-html-file)
  - [Step 2: Locate the Content](#step-2-locate-the-content)
  - [Step 3: Edit Carefully](#step-3-edit-carefully)
  - [Step 4: Save and Test](#step-4-save-and-test)
- [Adding Images](#adding-images)
  - [Step 1: Prepare Your Image](#step-1-prepare-your-image)
  - [Step 2: Upload Image](#step-2-upload-image)
  - [Step 3: Update HTML](#step-3-update-html)
  - [Step 4: Background Images](#step-4-background-images)
- [Updating Contact Information](#updating-contact-information)
  - [Phone Number](#phone-number)
  - [Email Address](#email-address)
  - [Physical Address](#physical-address)
  - [Business Hours](#business-hours)
- [Adding Services](#adding-services)
  - [Step 1: Open services.html](#step-1-open-serviceshtml)
  - [Step 2: Copy Existing Service Section](#step-2-copy-existing-service-section)
  - [Step 3: Modify Content](#step-3-modify-content)
  - [Step 4: Add to Navigation](#step-4-add-to-navigation)
  - [Step 5: Add to Homepage](#step-5-add-to-homepage)
- [Managing Projects](#managing-projects)
  - [Adding a New Project](#adding-a-new-project)
  - [Removing a Project](#removing-a-project)
- [Adding Testimonials](#adding-testimonials)
  - [Homepage Testimonials](#homepage-testimonials)
- [SEO Updates](#seo-updates)
  - [Updating Page Titles](#updating-page-titles)
  - [Updating Meta Descriptions](#updating-meta-descriptions)
  - [Updating Keywords](#updating-keywords)
- [Deploying Changes](#deploying-changes)
  - [Method 1: Netlify](#method-1-netlify)
  - [Method 2: FTP Upload](#method-2-ftp-upload)
  - [Method 3: Git + Hosting](#method-3-git-hosting)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Getting Help](#getting-help)
- [Best Practices](#best-practices)
  - [Before Making Changes](#before-making-changes)
  - [After Making Changes](#after-making-changes)
  - [Regular Maintenance Tasks](#regular-maintenance-tasks)
- [Quick Reference](#quick-reference)
  - [Common HTML Tags](#common-html-tags)
  - [Color Variables (if editing CSS)](#color-variables-if-editing-css)
  - [File Paths](#file-paths)

<!-- /TOC -->

# Website Maintenance Guide

This guide provides step-by-step instructions for maintaining and updating the Midwest Underground website. No technical expertise required!

## Table of Contents

1. [Quick Updates](#quick-updates)
2. [Editing Page Content](#editing-page-content)
3. [Adding Images](#adding-images)
4. [Updating Contact Information](#updating-contact-information)
5. [Adding Services](#adding-services)
6. [Managing Projects](#managing-projects)
7. [Adding Testimonials](#adding-testimonials)
8. [SEO Updates](#seo-updates)
9. [Deploying Changes](#deploying-changes)
10. [Troubleshooting](#troubleshooting)

---

## Quick Updates

### Tools You'll Need
- **Text Editor:** VS Code (recommended), Notepad++, or even Windows Notepad
- **Image Editor:** Any tool to resize/optimize images (optional)
- **FTP/Hosting Access:** Provided by your hosting platform

### File Structure Quick Reference
```
├── index.html          → Homepage
├── services.html       → Services page
├── about.html          → About page
├── contact.html        → Contact page
├── projects.html       → Projects page
├── css/styles.css      → Styles (rarely need to edit)
├── js/main.js          → JavaScript (rarely need to edit)
└── images/             → All images go here
```

---

## Editing Page Content

### Step 1: Open the HTML File

1. Navigate to your website folder
2. Find the page you want to edit (e.g., `about.html`)
3. Right-click → Open With → Your text editor

### Step 2: Locate the Content

**Find text using Ctrl+F (Cmd+F on Mac):**
- Search for a phrase you want to change
- The text will be highlighted in the HTML

**Example - Changing phone number:**
```html
<!-- BEFORE -->
<a href="tel:3203826636">(320) 382-6636</a>

<!-- AFTER -->
<a href="tel:3203829999">(320) 382-9999</a>
```

### Step 3: Edit Carefully

**Rules:**
- Only change text between `>` and `</`
- Don't delete HTML tags (the parts with `<` and `>`)
- Keep quotation marks intact
- Maintain spacing and formatting

**Good Edit:**
```html
<h2>Welcome to Our Company</h2>
     ↓
<h2>Welcome to Midwest Underground</h2>
```

**Bad Edit (Don't Do This):**
```html
<h2>Welcome to Our Company  ← Missing closing tag!
```

### Step 4: Save and Test

1. Save the file (Ctrl+S / Cmd+S)
2. Open the HTML file in your browser
3. Verify the change looks correct
4. If something broke, undo (Ctrl+Z) and try again

---

## Adding Images

### Step 1: Prepare Your Image

**Requirements:**
- **Format:** JPG, PNG, or WebP
- **Size:** Maximum 200KB per image (compress if needed)
- **Dimensions:**
  - Hero images: 1920x1080px
  - Project photos: 800x600px
  - Team photos: 400x400px
  - Logo: 200x60px

**Compression Tools:**
- Online: TinyPNG.com, Squoosh.app
- Desktop: ImageOptim (Mac), FileOptimizer (Windows)

### Step 2: Upload Image

1. Place image in `/images/` folder
2. Use descriptive filename (e.g., `project-willmar-fiber.jpg`)
3. No spaces in filename (use hyphens instead)

### Step 3: Update HTML

**Find the placeholder:**
```html
<img src="[PLACEHOLDER: project-name.jpg]" alt="Description">
```

**Replace with real path:**
```html
<img src="images/project-willmar-fiber.jpg" alt="Willmar Fiber Network Installation">
```

**Important:** Always include descriptive `alt` text for accessibility!

### Step 4: Background Images

**For hero sections:**
```html
<!-- BEFORE -->
<section class="hero" style="background-image: url('[PLACEHOLDER: hero-drilling.jpg]');">

<!-- AFTER -->
<section class="hero" style="background-image: url('images/hero-drilling.jpg');">
```

---

## Updating Contact Information

### Phone Number

**Search for:** `(320) 382-6636`

**Update in multiple locations:**
1. Header navigation (all pages)
2. Footer (all pages)
3. Contact page
4. Hero sections with emergency number

**Remember to update both display and tel: link:**
```html
<a href="tel:3203826636">(320) 382-6636</a>
         ↓ Update both places ↓
<a href="tel:3203829999">(320) 382-9999</a>
```

### Email Address

**Search for:** `info@midwestundergroundmn.com`

**Update in:**
1. Footer (all pages)
2. Contact page
3. Email links: `<a href="mailto:your@email.com">`

### Physical Address

**Search for:** `4320 County Rd 8 SE, Willmar, MN 56201`

**Update in:**
1. Footer (all pages)
2. About page
3. Contact page
4. Schema.org markup (in `<head>` section)

### Business Hours

**Find in contact.html:**
```html
<p><strong>Hours:</strong> Monday - Friday: 7:00 AM - 5:00 PM</p>
```

Update as needed. Remember to update Schema.org `openingHours` too:
```html
"openingHours": "Mo-Fr 07:00-17:00"
```

---

## Adding Services

### Step 1: Open services.html

### Step 2: Copy Existing Service Section

Find a service section (look for `<section id="hdd">`) and copy the entire section from `<section>` to `</section>`.

### Step 3: Modify Content

```html
<section id="new-service" class="section">
  <div class="container">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2">
        <div class="service-icon">🔧</div> ← Change emoji or icon
        <h2>New Service Name</h2>
        <p>Service description...</p>
        <!-- Add your content here -->
      </div>
    </div>
  </div>
</section>
```

### Step 4: Add to Navigation

**In services.html, add to service list:**
```html
<ul class="footer-links">
  <li><a href="services.html#new-service">New Service</a></li>
</ul>
```

### Step 5: Add to Homepage

**In index.html, find services grid and add card:**
```html
<article class="service-card">
  <div class="service-icon">🔧</div>
  <h3>New Service Name</h3>
  <p>Brief description...</p>
  <a href="services.html#new-service" class="service-link">Learn More →</a>
</article>
```

---

## Managing Projects

### Adding a New Project

**Step 1: Open projects.html**

**Step 2: Find project grid section**

**Step 3: Copy existing project card:**

```html
<article class="project-card" data-category="fiber-optic">
  <div style="position: relative; overflow: hidden; border-radius: var(--radius-lg);">
    <img src="images/your-project-photo.jpg"
         alt="Project Name"
         style="width: 100%; height: 250px; object-fit: cover;">
    <div style="position: absolute; top: 10px; right: 10px; background: var(--secondary-orange); color: var(--white); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-base); font-size: var(--text-xs); font-weight: 600;">
      Fiber Optic
    </div>
  </div>
  <div style="padding: var(--space-md);">
    <h3 style="font-size: var(--text-lg); margin-bottom: var(--space-sm);">
      Your Project Name
    </h3>
    <p style="color: var(--neutral-medium); margin-bottom: var(--space-sm);">
      📍 Location, MN
    </p>
    <p style="color: var(--neutral-medium); margin-bottom: var(--space-md);">
      Brief project description (2-3 sentences about the work performed).
    </p>
    <div style="display: flex; gap: var(--space-md); font-size: var(--text-sm); color: var(--neutral-medium);">
      <span>✓ Completed: Month Year</span>
      <span>✓ Scale: X miles</span>
    </div>
  </div>
</article>
```

**Step 4: Customize:**
- Change `data-category` to match service type
- Update image path
- Edit project details
- Save and test filtering

### Removing a Project

1. Find the project card in projects.html
2. Delete entire `<article>` block (from `<article>` to `</article>`)
3. Save file

---

## Adding Testimonials

### Homepage Testimonials

**Step 1: Open index.html**

**Step 2: Find testimonials section**

**Step 3: Copy existing testimonial:**

```html
<article style="background: var(--white); padding: var(--space-xl); border-radius: var(--radius-lg); box-shadow: var(--shadow-base);">
  <div style="color: var(--secondary-orange); font-size: var(--text-xl); margin-bottom: var(--space-md);">
    ★★★★★
  </div>
  <p style="font-style: italic; color: var(--neutral-medium); margin-bottom: var(--space-md);">
    "Customer quote goes here. Share their experience working with Midwest Underground."
  </p>
  <div style="font-weight: 600; color: var(--primary-blue);">Customer Name</div>
  <div style="font-size: var(--text-sm); color: var(--neutral-medium);">
    Job Title, Company Name
  </div>
</article>
```

**Step 4: Replace:**
- Customer quote
- Customer name
- Job title and company
- Adjust star rating if needed (use ★ for full, ☆ for empty)

---

## SEO Updates

### Updating Page Titles

**Find in `<head>` section:**
```html
<title>Current Page Title</title>
```

**Best Practices:**
- 55-60 characters maximum
- Include primary keyword
- Make it compelling

### Updating Meta Descriptions

**Find in `<head>` section:**
```html
<meta name="description" content="Your description here">
```

**Best Practices:**
- 150-160 characters maximum
- Include call-to-action
- Mention key services/location

### Updating Keywords

```html
<meta name="keywords" content="keyword1, keyword2, keyword3">
```

**Target Keywords:**
- directional drilling Minnesota
- fiber optic installation Willmar
- underground utilities contractor
- HDD contractor Kandiyohi County

---

## Deploying Changes

### Method 1: Netlify

1. Login to Netlify dashboard
2. Drag updated files to deploy zone
3. Wait for deployment (usually 30-60 seconds)
4. Visit live site to verify

### Method 2: FTP Upload

1. Open FTP client (FileZilla, Cyberduck, etc.)
2. Connect to your server
3. Upload changed files only
4. Refresh browser to see changes

### Method 3: Git + Hosting

```bash
git add .
git commit -m "Updated contact information"
git push origin main
```

Auto-deployment will trigger on most platforms (Netlify, Vercel, GitHub Pages).

---

## Troubleshooting

### Common Issues

**Problem: Changes don't appear on live site**
- Solution: Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check if correct file was uploaded
- Verify deployment completed

**Problem: Images not showing**
- Check image path is correct: `images/filename.jpg`
- Verify image was uploaded to `/images/` folder
- Check filename matches exactly (case-sensitive)

**Problem: Broken layout**
- Undo recent changes
- Check for missing closing tags (`</div>`, `</section>`, etc.)
- Validate HTML: https://validator.w3.org/

**Problem: Form not working**
- Verify Formspree form ID is correct
- Check form action URL
- Test with different email address

**Problem: Mobile menu won't open**
- Check that `main.js` file is uploaded
- Verify JavaScript console for errors (F12 in browser)
- Ensure mobile menu HTML structure is intact

### Getting Help

**Before contacting support:**
1. Note which page has the issue
2. Take screenshots of the problem
3. List what you changed recently
4. Check browser console for errors (F12 key)

**HTML Validation:**
- https://validator.w3.org/
- Paste your HTML to check for errors

**Resources:**
- HTML basics: https://developer.mozilla.org/en-US/docs/Learn/HTML
- This project documentation: `/docs/` folder

---

## Best Practices

### Before Making Changes
1. ✅ Backup current files
2. ✅ Test in local browser first
3. ✅ Make one change at a time

### After Making Changes
1. ✅ Test in multiple browsers (Chrome, Firefox, Safari)
2. ✅ Check mobile view (resize browser or use phone)
3. ✅ Verify all links work
4. ✅ Test forms if you changed contact page

### Regular Maintenance Tasks

**Weekly:**
- Monitor contact form submissions
- Check for broken links
- Review analytics (if installed)

**Monthly:**
- Add new project photos
- Request client testimonials
- Update news/announcements

**Quarterly:**
- Review service descriptions
- Update team photos/bios
- Audit SEO performance
- Backup entire site

---

## Quick Reference

### Common HTML Tags

- `<h1>` to `<h6>` - Headings (h1 largest, h6 smallest)
- `<p>` - Paragraph
- `<a href="url">` - Link
- `<img src="path">` - Image
- `<div>` - Container/section
- `<span>` - Inline text
- `<strong>` - Bold text
- `<em>` - Italic text

### Color Variables (if editing CSS)

```css
--primary-blue: #003B5C
--secondary-orange: #FF6B35
--accent-blue: #2EA3F2
--neutral-dark: #333333
--neutral-medium: #666666
--neutral-light: #F5F5F5
--white: #FFFFFF
```

### File Paths

- Same folder: `filename.html`
- Images folder: `images/filename.jpg`
- CSS folder: `css/styles.css`
- Go up one level: `../filename.html`

---

**Questions or Issues?**
Keep this guide handy and refer to specific sections as needed. Always test changes locally before deploying to production!

**Last Updated:** October 22, 2025
