# Content Placeholders Tracking

This document tracks all placeholder content that needs to be replaced with actual company information, images, and data.

## Priority: HIGH (Launch Blockers)

### Images - Logo & Branding
- [ ] **Logo image** (SVG or PNG)
  - Location: All pages (header)
  - Recommended: 200x60px transparent PNG or SVG
  - Current: Text-based logo with emoji
  - Replace: `<span>⚙️</span> <span>Midwest Underground</span>`

### Images - Hero Backgrounds
- [ ] **Homepage hero background**
  - Location: index.html
  - File: `[PLACEHOLDER: hero-directional-drilling.jpg]`
  - Recommended: 1920x1080px, WebP format, <300KB
  - Subject: Directional drilling rig in action or completed fiber installation

### Forms & Integrations
- [ ] **Formspree Form ID**
  - Location: contact.html
  - Current: `action="https://formspree.io/f/YOUR_FORM_ID"`
  - Action: Create Formspree account, get form ID
  - Priority: Required for contact form to work

### Domain & URLs
- [ ] **Production Domain URL**
  - Locations: All HTML files (Open Graph tags, Schema.org)
  - Current: `[PLACEHOLDER: domain-url]`
  - Example: `https://www.midwestundergroundmn.com`
  - Files to update:
    - index.html
    - services.html
    - about.html
    - contact.html
    - projects.html
    - sitemap.xml
    - robots.txt

- [ ] **Logo URL for Schema/OG**
  - Locations: All HTML files
  - Current: `[PLACEHOLDER: logo-url]`
  - Should be: Full URL to uploaded logo (e.g., https://domain.com/images/logo.png)

- [ ] **Open Graph Image**
  - Location: index.html and all pages
  - Current: `[PLACEHOLDER: og-image.jpg]`
  - Recommended: 1200x630px image with company name/logo
  - Upload to /images/ directory and update path

## Priority: MEDIUM (Pre-Launch)

### Images - Services Page
- [ ] **HDD drilling rig photo**
  - Location: services.html
  - File: `[PLACEHOLDER: hdd-drilling-rig.jpg]`
  - Subject: Company's directional drilling equipment

- [ ] **Fiber optic installation photo**
  - Location: services.html
  - File: `[PLACEHOLDER: fiber-optic-installation.jpg]`
  - Subject: Fiber cable being installed or spliced

- [ ] **Underground utilities work photo**
  - Location: services.html
  - File: `[PLACEHOLDER: underground-utilities.jpg]`
  - Subject: Utility trenching or installation in progress

- [ ] **Telecommunications equipment photo**
  - Location: services.html
  - File: `[PLACEHOLDER: telecommunications-infrastructure.jpg]`
  - Subject: Telecom network installation or cabinet

- [ ] **Emergency service vehicle photo**
  - Location: services.html
  - File: `[PLACEHOLDER: emergency-services.jpg]`
  - Subject: Company truck with emergency equipment

- [ ] **Geothermal installation photo**
  - Location: services.html
  - File: `[PLACEHOLDER: geothermal-installation.jpg]`
  - Subject: Geothermal loop field installation

### Images - About Page
- [ ] **Company history photo**
  - Location: about.html
  - File: `[PLACEHOLDER: company-history.jpg]`
  - Subject: Early company photo from 1990s or founders

- [ ] **Team member photos (6 total)**
  - Location: about.html
  - Files:
    - `[PLACEHOLDER: team-president.jpg]`
    - `[PLACEHOLDER: team-operations.jpg]`
    - `[PLACEHOLDER: team-safety.jpg]`
    - `[PLACEHOLDER: team-hdd-operator.jpg]`
    - `[PLACEHOLDER: team-fiber-specialist.jpg]`
    - `[PLACEHOLDER: team-project-coordinator.jpg]`
  - Recommended: Professional headshots, 400x400px, consistent style

- [ ] **Equipment showcase photos**
  - Location: about.html
  - Files: 6 equipment category photos
  - Subject: Modern HDD rigs, fiber tools, locating systems, etc.

- [ ] **Safety culture photo**
  - Location: about.html
  - File: `[PLACEHOLDER: safety-meeting.jpg]`
  - Subject: Safety meeting, PPE, or safety protocols in action

### Images - Projects Page
- [ ] **Project photos (12 total)**
  - Location: projects.html
  - Files:
    - `[PLACEHOLDER: project-willmar-fiber.jpg]` - City fiber network
    - `[PLACEHOLDER: project-county-crossing.jpg]` - Utility crossing
    - `[PLACEHOLDER: project-regional-broadband.jpg]` - Telecom installation
    - `[PLACEHOLDER: project-emergency-repair.jpg]` - Emergency work
    - `[PLACEHOLDER: project-residential-geothermal.jpg]` - Home geothermal
    - `[PLACEHOLDER: project-municipal-sewer.jpg]` - Sewer extension
    - `[PLACEHOLDER: project-commercial-fiber.jpg]` - Business campus
    - `[PLACEHOLDER: project-power-crossing.jpg]` - Highway power line
    - `[PLACEHOLDER: project-rural-broadband.jpg]` - Rural fiber
    - `[PLACEHOLDER: project-industrial-park.jpg]` - Infrastructure development
    - `[PLACEHOLDER: project-hospital-fiber.jpg]` - Emergency fiber repair
    - `[PLACEHOLDER: project-agricultural-geothermal.jpg]` - Farm geothermal
  - Recommended: 800x600px, WebP format, before/after if possible

### Content - Company Information
- [ ] **Refine company story**
  - Location: about.html
  - Current: Generic placeholder narrative
  - Action: Get real founding story, key milestones, owner insights

- [ ] **Team member bios**
  - Location: about.html
  - Current: Generic placeholder bios
  - Action: Get actual names, titles, years with company, specialties

- [ ] **Real certifications & license numbers**
  - Location: about.html
  - Current: Generic certification list
  - Action: Gather all license numbers, insurance details, safety certs

### Content - Testimonials
- [ ] **Customer testimonials (6 total)**
  - Locations: index.html (3), projects.html (3)
  - Current: Fictional placeholder testimonials
  - Action: Request testimonials from recent clients
  - Include: Name, title, company, project type, quote

### Maps & Locations
- [ ] **Service area map**
  - Location: index.html
  - Current: Text placeholder
  - Action: Create visual map showing Kandiyohi County coverage

## Priority: LOW (Post-Launch)

### Social Media
- [ ] **Social media links**
  - Location: contact.html footer (all pages)
  - Current: Placeholder `#` links
  - Action: Create and link Facebook, LinkedIn, Twitter/X accounts

### Analytics
- [ ] **Google Analytics tracking code**
  - Location: All HTML files (before closing `</head>`)
  - Action: Set up GA4 property, add tracking script

### Additional Content
- [ ] **FAQ expansion**
  - Location: contact.html
  - Action: Add more questions based on actual customer inquiries

- [ ] **Blog/News section**
  - Location: New page or section
  - Action: Phase 2 enhancement - add news updates

### Video Content
- [ ] **Equipment demonstration videos**
  - Location: services.html or about.html
  - Action: Record short videos of equipment in action

- [ ] **Customer testimonial videos**
  - Location: projects.html or dedicated page
  - Action: Record video testimonials from satisfied clients

## Priority: DOCUMENTATION

### Business Information Needed

**Company Details:**
- [ ] Exact legal business name
- [ ] Tax ID / EIN (if needed for official docs)
- [ ] Insurance policy numbers and coverage amounts
- [ ] Technology Systems Contractor License number
- [ ] Any additional certifications (OSHA, etc.)
- [ ] Years for each team member
- [ ] Actual fleet size and equipment inventory

**Contact Information:**
- [ ] Verify phone number: (320) 382-6636
- [ ] Verify address: 4320 County Rd 8 SE, Willmar, MN 56201
- [ ] Actual business email (or confirm info@midwestundergroundmn.com)
- [ ] After-hours emergency contact (if different)
- [ ] Actual business hours (currently M-F 7AM-5PM)

**Marketing Details:**
- [ ] Preferred tagline or slogan (if any)
- [ ] Any specific brand guidelines (colors, fonts beyond current design)
- [ ] Existing marketing materials to reference
- [ ] Competitor analysis insights
- [ ] Target customer personas

**Project History:**
- [ ] List of notable projects with details:
  - Project name
  - Client name (if can be shared)
  - Location
  - Project type
  - Date completed
  - Scale (miles of fiber, bore length, etc.)
  - Photos available?

**Client References:**
- [ ] 5-10 clients willing to provide testimonials
- [ ] Contact information to reach out for quotes
- [ ] Preferred projects to highlight

## Replacement Instructions

### For Images:
1. Save high-quality images to `/images/` directory
2. Name files clearly (e.g., `hero-drilling-rig.jpg`)
3. Optimize images (WebP format, compress to <200KB each)
4. Search for `[PLACEHOLDER: filename.jpg]` in HTML files
5. Replace with actual path: `images/filename.jpg`

### For Text Content:
1. Search for `[PLACEHOLDER: description]`
2. Replace with actual content
3. Maintain similar length/tone
4. Ensure formatting is preserved

### For URLs:
1. Purchase and configure domain
2. Find all instances: Search `[PLACEHOLDER: domain-url]`
3. Replace with `https://www.yourdomain.com`
4. Update sitemap.xml with real URLs
5. Update robots.txt with real sitemap URL

### For Form Integration:
1. Create free Formspree account: https://formspree.io
2. Create new form for contact inquiries
3. Copy form ID (looks like: `mxyzabc123`)
4. Update contact.html: `action="https://formspree.io/f/mxyzabc123"`
5. Test form submission

## Tracking Progress

- **Total Placeholders:** 50+
- **High Priority:** 8 items
- **Medium Priority:** 30+ items
- **Low Priority:** 12+ items

Use checkboxes above to track completion. Prioritize HIGH items before launch, MEDIUM items within 2 weeks of launch, and LOW items as ongoing improvements.

## Notes

- All image placeholders use `[PLACEHOLDER: filename]` format
- Search project-wide for `[PLACEHOLDER:` to find all instances
- Image recommendations are guidelines; adjust as needed
- Maintain aspect ratios for best responsive design
- Always optimize images before uploading (WebP, compression)
- Test site thoroughly after each major content update

---

**Last Updated:** October 23, 2025
**Next Review:** Before production deployment
**Status:** All placeholders documented and tracked (88 items total)
