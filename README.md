# Midwest Underground of Minnesota Inc - Website

Professional website for Midwest Underground of Minnesota Inc, a directional drilling and underground utilities contractor serving central Minnesota since 1991.

## Project Overview

This is a static HTML/CSS/JavaScript website built to establish Midwest Underground's first digital presence and capture market share in Minnesota's $651M broadband infrastructure expansion.

**Company:** Midwest Underground of Minnesota Inc
**Location:** 4320 County Rd 8 SE, Willmar, MN 56201
**Phone:** (320) 382-6636
**Founded:** 1991 (34+ years experience)
**Industry:** Directional Drilling, Fiber Optic Installation, Underground Utilities

## Technology Stack

- **HTML5** - Semantic markup for structure
- **CSS3** - Custom properties + Tailwind CDN for styling
- **Vanilla JavaScript** - ES6+ for interactivity
- **No Framework** - Zero build process, runs directly in browser
- **No Backend** - Static site with Formspree for contact forms
- **Hosting Ready** - Netlify, Vercel, or GitHub Pages compatible

## Project Structure

```
midwest-underground-website/
├── index.html              # Homepage
├── services.html           # Service descriptions
├── about.html              # Company information
├── contact.html            # Contact form & info
├── projects.html           # Project portfolio
│
├── css/
│   └── styles.css          # All custom styles
│
├── js/
│   └── main.js             # All interactions
│
├── images/                 # Image assets (placeholders)
│   └── .gitkeep
│
├── docs/
│   ├── ARCHITECTURE.md     # Technical decisions
│   ├── PLACEHOLDERS.md     # Content to replace
│   ├── MAINTENANCE.md      # Update procedures
│   └── DEPLOYMENT.md       # Deployment guide
│
├── CLAUDE.md               # Project context
├── README.md               # This file
├── sitemap.xml            # SEO sitemap
├── robots.txt             # SEO robots
└── netlify.toml           # Deployment config
```

## Features

### Pages (5 Total)

1. **Homepage (index.html)**
   - Hero section with dual CTAs
   - Services overview grid
   - Why Choose Us statistics
   - Broadband expansion CTA
   - Client testimonials
   - Service area information

2. **Services Page (services.html)**
   - Detailed service descriptions
   - Equipment & technology showcase
   - Process overview
   - Service area coverage

3. **About Page (about.html)**
   - Company story & history
   - Mission & core values
   - Team member profiles
   - Certifications & licenses
   - Safety commitment
   - Equipment showcase

4. **Contact Page (contact.html)**
   - Contact form (Formspree integration)
   - Contact information
   - Google Maps embed
   - Response time expectations
   - FAQ section

5. **Projects Page (projects.html)**
   - Project portfolio grid (12 projects)
   - Filter by service category
   - Project capabilities
   - Client testimonials

### Core Features

- ✅ **Mobile-first responsive design** (375px to 1920px+)
- ✅ **Sticky navigation** with mobile hamburger menu
- ✅ **Smooth scrolling** to anchor links
- ✅ **Form validation** with user-friendly error messages
- ✅ **Project filtering** by service category
- ✅ **Back to top button** appears on scroll
- ✅ **Lazy loading images** (Intersection Observer API)
- ✅ **Click-to-call** functionality on phone numbers
- ✅ **24/7 emergency service** prominently displayed
- ✅ **SEO optimized** with meta tags, Schema.org markup
- ✅ **Accessibility compliant** (WCAG 2.1 AA)

## Local Development

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, Atom, etc.)
- Optional: Local web server for testing

### Quick Start

1. **Clone or download this repository**

2. **Open in browser**
   ```bash
   # Navigate to project directory
   cd midwest-underground-website

   # Open index.html in your default browser
   # Option 1: Double-click index.html
   # Option 2: Use command line
   start index.html          # Windows
   open index.html           # macOS
   xdg-open index.html       # Linux
   ```

3. **Optional: Use a local server**
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js with http-server
   npx http-server -p 8000

   # VS Code Live Server extension
   # Right-click index.html > "Open with Live Server"
   ```

   Then visit: http://localhost:8000

### Making Changes

1. Edit HTML files directly in your text editor
2. Edit CSS in `css/styles.css`
3. Edit JavaScript in `js/main.js`
4. Refresh browser to see changes
5. No build process required!

## Deployment

### Option 1: Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd midwest-underground-website
netlify deploy --prod
```

**Or use Netlify drag & drop:**
1. Visit https://app.netlify.com/drop
2. Drag the entire project folder
3. Site is live instantly!

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd midwest-underground-website
vercel --prod
```

### Option 3: GitHub Pages

1. Create GitHub repository
2. Push code to `main` branch
3. Go to Settings > Pages
4. Select `main` branch as source
5. Site is live at `https://username.github.io/repo-name`

### Custom Domain Setup

After deploying, configure your custom domain (e.g., midwestundergroundmn.com):

**Netlify:**
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Configure DNS records as instructed

**Vercel:**
1. Go to Project Settings > Domains
2. Add domain and configure DNS

## Configuration

### Update Contact Information

**Phone Number:**
- Search for `(320) 382-6636` and replace globally
- Update in header, footer, contact page

**Email Address:**
- Search for `info@midwestundergroundmn.com` and replace
- Update in footer, contact page

**Physical Address:**
- Search for `4320 County Rd 8 SE, Willmar, MN 56201`
- Update in footer, about page, contact page
- Update Google Maps embed in contact.html

### Update Form Integration

Replace Formspree placeholder:
1. Create free account at https://formspree.io
2. Create new form, get form ID
3. Update `contact.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID">
   ```

### Update Domain URLs

Search and replace `[PLACEHOLDER: domain-url]` with your actual domain in:
- All HTML files (Open Graph tags, Schema.org markup)
- sitemap.xml
- robots.txt

## Content Placeholders

All placeholder content is marked with `[PLACEHOLDER: description]`. See `docs/PLACEHOLDERS.md` for complete list of content that needs real information.

**Priority replacements:**
1. Logo image
2. Hero background images
3. Project photos
4. Team member photos
5. About page company story refinement
6. Real client testimonials

## SEO Optimization

### Implemented

- ✅ Unique title tags (55-60 characters)
- ✅ Meta descriptions (150-160 characters)
- ✅ Open Graph tags for social sharing
- ✅ Schema.org LocalBusiness markup
- ✅ Semantic HTML5 structure
- ✅ Alt text placeholders for images
- ✅ Internal linking structure
- ✅ sitemap.xml
- ✅ robots.txt
- ✅ Mobile-friendly design

### Target Keywords

- Primary: "directional drilling Minnesota"
- Secondary: "fiber optic installation Willmar"
- Long-tail: "HDD contractor Kandiyohi County"
- Local: "underground utilities central Minnesota"

### Post-Launch SEO Tasks

1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Create Google Business Profile
4. Build local citations
5. Generate review requests
6. Create social media profiles
7. Monthly content updates

## Performance

### Current Optimization

- Mobile-first responsive design
- Lazy loading images
- Minimal external dependencies
- Efficient CSS (single file)
- Vanilla JavaScript (no framework overhead)
- CDN for fonts and Tailwind

### Performance Targets

- **Lighthouse Performance:** > 90
- **Lighthouse SEO:** > 90
- **Lighthouse Accessibility:** > 90
- **Lighthouse Best Practices:** > 90
- **Load Time (3G):** < 3 seconds
- **Total Page Size:** < 2MB per page

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## Accessibility

### Compliance: WCAG 2.1 AA

- ✅ Semantic HTML5 elements
- ✅ ARIA labels where appropriate
- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ Color contrast meets standards
- ✅ Skip to content link
- ✅ Alt text for images
- ✅ Form labels properly associated
- ✅ Touch targets minimum 44x44px

## Support & Maintenance

### Updating Content

See `docs/MAINTENANCE.md` for detailed instructions on:
- Editing page content
- Adding new services
- Updating contact information
- Adding project photos
- Managing testimonials

### Common Tasks

**Add a new testimonial:**
1. Open relevant page (index.html or projects.html)
2. Find testimonials section
3. Copy existing testimonial card HTML
4. Update content (quote, name, company)

**Add a new project:**
1. Open projects.html
2. Find project grid section
3. Copy existing project card HTML
4. Update content and data-category attribute

**Update service descriptions:**
1. Open services.html
2. Find service section by ID
3. Edit description text
4. Save and redeploy

## Roadmap

### Phase 2 (Months 2-3)
- Real project photos and content
- Customer testimonials (video)
- Blog/news section
- Online quote request system
- Enhanced project filtering
- Case studies

### Phase 3 (Months 4-6)
- CMS integration (Netlify CMS)
- Client portal for project tracking
- Interactive service area map
- Live chat widget
- Video content (equipment demos)
- Analytics dashboard

### Phase 4 (Months 7-12)
- Equipment availability calendar
- Crew scheduling integration
- Multi-language support (Spanish)
- Progressive Web App features
- Advanced analytics
- Marketing automation

## License

© 2025 Midwest Underground of Minnesota Inc. All rights reserved.

## Contact

**Midwest Underground of Minnesota Inc**
4320 County Rd 8 SE
Willmar, MN 56201
Phone: (320) 382-6636
Email: info@midwestundergroundmn.com

---

**Built with:** HTML5, CSS3, Vanilla JavaScript
**Deployment:** Netlify/Vercel/GitHub Pages Ready
**Build Date:** October 2025
**Version:** 1.0.0
