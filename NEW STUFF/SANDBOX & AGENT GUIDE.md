# 🎯 COMPLETE SANDBOX & AGENT GUIDE FOR MIDWEST UNDERGROUND WEBSITE

---

## 📋 IMPLEMENTATION STRATEGY

**Save this as:** `.claude/MASTER-SANDBOX-GUIDE.md`

Then create these companion files:
1. `.srt-settings.json` (base sandbox config)
2. `.claude/agent-configs/` directory with active agent configs only
3. Update existing `AGENT_COORDINATION.md` and `MCP-SERVERS.md`

---

## 🏢 PROJECT CONTEXT

### Company Profile
**Midwest Underground of Minnesota Inc**
- **Location:** 4320 County Rd 8 SE, Willmar, MN 56201
- **Phone:** (320) 382-6636
- **Founded:** 1991 (34 years in HDD/fiber optic services)
- **Team:** 18 employees, $2.4M annual revenue
- **Digital Status:** FIRST WEBSITE (no prior online presence)

### Market Opportunity
- **Minnesota BEAD Funding:** $651.8M for broadband expansion
- **Willmar Fiber Project:** $24.5M local network buildout
- **Competition Window:** 6-12 months before competitors establish digital presence
- **Target Market:** Central Minnesota (Kandiyohi County + surrounding)

### Tech Stack (Current)
- **Framework:** Next.js 14 (App Router)
- **Languages:** TypeScript (40.6%), HTML (30.3%), JavaScript (17%), CSS (9%)
- **Database:** Prisma + SQLite (dev) / PostgreSQL (Supabase for production)
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS + Custom CSS
- **Testing:** Vitest (unit/integration) + Playwright (E2E)
- **Deployment:** Netlify
- **MCP Servers:** Browser MCP ✅

### Project Status (as of 2025-11-23)
- **Completion:** 100% development ✅
- **Agents Completed:** 9 (all successful)
- **API Endpoints:** 31 total
- **Dashboard Pages:** 13 pages
- **Test Suite:** 133 tests (80%+ pass rate)
- **Next Phase:** Production deployment + ongoing maintenance

---

## 🛡️ SANDBOX RUNTIME PRINCIPLES

### Why Sandbox?

Based on **Anthropic's sandbox-runtime** (https://github.com/anthropic-experimental/sandbox-runtime):

1. **OS-Level Security:** Uses native primitives (sandbox-exec/macOS, bubblewrap/Linux)
2. **Secure by Default:** All access denied unless explicitly allowed
3. **Multi-Agent Safe:** Prevents agent interference through isolation
4. **Independent Operation:** No permission prompts during execution
5. **Violation Learning:** Automatically tracks blocked operations for config improvement

### Core Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Host Machine (Unrestricted)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │  HTTP Proxy (8080) + SOCKS5 Proxy (1080)         │  │
│  │  Network Filtering (Domain Allowlist)            │  │
│  └────────────────┬──────────────────────────────────┘  │
│                   │ Unix Socket / localhost             │
│  ┌────────────────▼──────────────────────────────────┐  │
│  │           Sandbox Container                       │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │  Agent Process                             │  │  │
│  │  │  - Network: Proxy-only access              │  │  │
│  │  │  - Filesystem: Restricted read/write       │  │  │
│  │  │  - Process: Isolated namespace             │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Dual Isolation Model

#### Network (Allow-Only Pattern)
```json
{
  "network": {
    "allowedDomains": ["github.com", "supabase.co", "localhost"],
    "deniedDomains": []
  }
}
```
- ✅ Default: ALL network DENIED
- ✅ Must explicitly allowlist each domain
- ✅ Works via HTTP + SOCKS5 proxies

#### Filesystem (Dual Pattern)

**Read (Deny-Only):** Default ALLOW, explicit DENY
```json
{
  "filesystem": {
    "denyRead": ["~/.ssh", ".env.production"]
  }
}
```

**Write (Allow-Only):** Default DENY, explicit ALLOW
```json
{
  "filesystem": {
    "allowWrite": ["src/**", "tests/**"],
    "denyWrite": [".env", "package.json"]
  }
}
```

---

## 🤖 AGENT ANALYSIS & RECOMMENDATIONS

### ✅ COMPLETED AGENTS (Archive Only)

These agents are done. Keep configs for reference but don't need active sandboxes:

| Agent | Mission | Status | Keep Config? |
|-------|---------|--------|--------------|
| **Agent 1** | Database Seeding | ✅ COMPLETE | Reference only |
| **Agent 2** | Authentication | ✅ COMPLETE | Reference only |
| **Agent 3** | Projects/Bores API | ✅ COMPLETE | Reference only |
| **Agent 4** | Reports/Passes API | ✅ COMPLETE | Reference only |
| **Agent 5** | Tickets/Inspections API | ✅ COMPLETE | Reference only |
| **Agent 6** | Dashboard Pages (Group A) | ✅ COMPLETE | Reference only |
| **Agent 7** | Dashboard Pages (Group B) | ✅ COMPLETE | Reference only |
| **Agent 8** | Advanced Features (KPIs/Photos) | ✅ COMPLETE | Reference only |
| **Agent 9** | Testing Suite | ✅ COMPLETE | **YES** - Still needed for regression |

---

### 🎯 ACTIVE AGENTS (Need Sandbox Configs)

Based on current project status and production readiness:

#### **Agent 10: Content Management** 🆕 HIGH PRIORITY
**Mission:** Non-technical content updates for business owner
**Why Needed:** Owner needs to update projects, services, team info without code knowledge
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "src/content/**",
      "public/images/**",
      "prisma/seed-data/**",
      ".serena/memories/agent-10-status.yml"
    ],
    "denyWrite": [
      "src/app/**",
      "src/components/**",
      "src/lib/**",
      "prisma/schema.prisma",
      ".env*"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "supabase.co"
    ]
  }
}
```
**Deliverables:**
- Content management API (CMS-like interface)
- Image upload/optimization pipeline
- Project gallery manager
- Service descriptions editor
- Team member profiles
- Client testimonials system

---

#### **Agent 11: SEO & Analytics** 🆕 HIGH PRIORITY
**Mission:** Dominate local search, track conversions
**Why Needed:** Market opportunity window is 6-12 months
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "src/app/**/metadata.ts",
      "public/robots.txt",
      "public/sitemap.xml",
      "src/lib/analytics/**",
      ".serena/memories/agent-11-status.yml"
    ],
    "denyWrite": [
      "src/app/api/**",
      "prisma/**"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "google.com",
      "google-analytics.com",
      "googletagmanager.com",
      "search.google.com"
    ]
  }
}
```
**Deliverables:**
- Google Business Profile optimization
- Local SEO schema markup (LocalBusiness, Service)
- Google Analytics 4 + Google Tag Manager
- Conversion tracking (phone, form, quote requests)
- Sitemap generation (dynamic based on projects)
- Keyword optimization ("HDD Willmar MN", "fiber optic Kandiyohi")
- Competition monitoring dashboard

---

#### **Agent 12: Email Notifications** 🆕 MEDIUM PRIORITY
**Mission:** Automated customer communication
**Why Needed:** Professional communication at scale
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "src/lib/email/**",
      "src/app/api/email/**",
      "src/components/email/**",
      ".serena/memories/agent-12-status.yml"
    ],
    "denyWrite": [
      "prisma/schema.prisma",
      ".env.production"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "api.sendgrid.com",
      "smtp.gmail.com"
    ]
  }
}
```
**Deliverables:**
- Contact form → email pipeline (SendGrid or similar)
- Quote request confirmations
- Project status update emails
- Daily report summaries for crew
- 811 ticket reminders
- Welcome emails for new dashboard users

---

#### **Agent 13: Deployment & DevOps** 🆕 HIGH PRIORITY
**Mission:** Production deployment + CI/CD pipeline
**Why Needed:** Need to go live ASAP to capture market opportunity
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      ".github/workflows/**",
      "netlify.toml",
      "vercel.json",
      "scripts/deploy/**",
      ".serena/memories/agent-13-status.yml"
    ],
    "denyWrite": [
      "src/**",
      "prisma/**",
      ".env"
    ]
  },
  "network": {
    "allowedDomains": [
      "github.com",
      "api.github.com",
      "netlify.com",
      "api.netlify.com",
      "vercel.com",
      "api.vercel.com",
      "supabase.com",
      "api.supabase.com"
    ]
  }
}
```
**Deliverables:**
- Production Netlify configuration
- Environment variable management
- Database migration strategy (SQLite → PostgreSQL/Supabase)
- CI/CD pipeline (GitHub Actions)
- SSL/HTTPS setup
- Custom domain configuration (midwestunderground.com)
- Backup/restore procedures
- Monitoring/alerting (Sentry or similar)

---

#### **Agent 14: Performance Optimization** 🆕 MEDIUM PRIORITY
**Mission:** Lighthouse 90+ score, <3s load time
**Why Needed:** SEO ranking factor + user experience
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "next.config.js",
      "public/**",
      "src/app/**/loading.tsx",
      "src/components/optimized/**",
      ".serena/memories/agent-14-status.yml"
    ],
    "denyWrite": [
      "src/app/api/**",
      "prisma/**"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "pagespeed.web.dev",
      "lighthouse-dot-webdotdevsite.appspot.com"
    ]
  }
}
```
**Deliverables:**
- Image optimization (WebP, lazy loading)
- Code splitting optimization
- Font loading strategy
- Critical CSS inlining
- Service worker for offline capability
- Lighthouse audit automation
- Performance monitoring dashboard

---

#### **Agent 15: Security Hardening** 🆕 HIGH PRIORITY
**Mission:** Protect customer data + prevent breaches
**Why Needed:** Handling sensitive project data, employee credentials
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "src/middleware.ts",
      "src/lib/security/**",
      ".serena/memories/agent-15-status.yml"
    ],
    "denyWrite": [
      ".env",
      ".env.production",
      "prisma/schema.prisma"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost"
    ]
  }
}
```
**Deliverables:**
- Rate limiting (API + auth endpoints)
- CSRF protection
- SQL injection prevention audit
- XSS protection audit
- Security headers (CSP, HSTS, etc.)
- Password policy enforcement
- 2FA/MFA implementation
- Security audit checklist
- Penetration testing report

---

#### **Agent 16: Mobile Optimization** 🆕 MEDIUM PRIORITY
**Mission:** Perfect mobile experience (crew uses phones on site)
**Why Needed:** Crew needs mobile dashboard for field work
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "src/components/mobile/**",
      "src/app/dashboard/**/mobile.tsx",
      "public/manifest.json",
      ".serena/memories/agent-16-status.yml"
    ],
    "denyWrite": [
      "src/app/api/**"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost"
    ]
  }
}
```
**Deliverables:**
- Progressive Web App (PWA) setup
- Offline-first dashboard
- Touch-optimized UI components
- Camera integration (photo uploads from site)
- GPS location tagging
- Mobile-specific navigation
- App installation prompt

---

#### **Agent 17: Documentation & Training** 🆕 LOW PRIORITY
**Mission:** User guides for owner, super users, crew
**Why Needed:** 18 employees need to learn system
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "docs/**",
      "public/help/**",
      ".serena/memories/agent-17-status.yml"
    ],
    "denyWrite": [
      "src/**",
      "prisma/**"
    ]
  },
  "network": {
    "allowedDomains": []
  }
}
```
**Deliverables:**
- Owner guide (content management, user management)
- Super user guide (project management, reporting)
- Crew guide (daily reports, rod logger, photo uploads)
- Video tutorials (screen recordings)
- FAQ section
- Troubleshooting guide
- Onboarding checklist

---

### 🔄 MAINTENANCE AGENTS (Keep Active)

#### **Agent 9: Testing & Regression** ⚡ ACTIVE
**Mission:** Maintain test suite, prevent regressions
**Why Keep Active:** Continuous testing as new features added
**Sandbox Requirements:**
```json
{
  "filesystem": {
    "allowWrite": [
      "tests/**",
      ".playwright/**",
      "test-results/**",
      "coverage/**",
      ".serena/memories/agent-9-status.yml"
    ],
    "denyWrite": [
      "src/**",
      ".env.production"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "127.0.0.1",
      "playwright.dev"
    ]
  }
}
```
**Ongoing Tasks:**
- Add tests for new agents' deliverables
- Update E2E tests for UI changes
- Maintain 80%+ code coverage
- Run nightly regression suite

---

## ⚙️ CONFIGURATION FILES

### 1. Base Configuration
**File:** `.srt-settings.json` (Create in project root)

```json
{
  "network": {
    "allowedDomains": [
      "github.com",
      "*.github.com",
      "api.github.com",
      "raw.githubusercontent.com",
      "supabase.co",
      "*.supabase.co",
      "netlify.com",
      "*.netlify.app",
      "npmjs.org",
      "registry.npmjs.org",
      "playwright.dev",
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "cdnjs.cloudflare.com",
      "unpkg.com",
      "localhost",
      "127.0.0.1",
      "google.com",
      "google-analytics.com",
      "googletagmanager.com",
      "pagespeed.web.dev"
    ],
    "deniedDomains": [],
    "allowUnixSockets": [],
    "allowLocalBinding": true
  },
  "filesystem": {
    "denyRead": [
      "~/.ssh",
      "~/.aws",
      "~/.config",
      ".env.local",
      ".env.production",
      "node_modules/**/.env*",
      ".git/config"
    ],
    "allowWrite": [
      ".",
      "src/**",
      "prisma/migrations/**",
      "prisma/dev.db",
      "prisma/test.db",
      "prisma/seed-data/**",
      "public/**",
      ".claude/**",
      ".serena/**",
      "tests/**",
      "docs/**",
      "*.md",
      ".github/workflows/**",
      "scripts/**"
    ],
    "denyWrite": [
      ".env",
      ".env.production",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      ".git/**"
    ]
  },
  "ignoreViolations": {
    "*": [
      "/usr/bin",
      "/usr/local/bin",
      "/System",
      "/Library",
      "/private/tmp",
      "/tmp"
    ],
    "npm": [
      "/private/tmp",
      "node_modules",
      ".npm"
    ],
    "playwright": [
      "/tmp/playwright*",
      "~/.cache/ms-playwright"
    ],
    "prisma": [
      "node_modules/.prisma",
      "node_modules/@prisma"
    ],
    "browsermcp": [
      "/System/Library/Fonts",
      "/Library/Fonts",
      "~/Library/Caches"
    ],
    "git": [
      ".git/objects",
      ".git/refs"
    ]
  },
  "enableWeakerNestedSandbox": false
}
```

---

### 2. Active Agent Configs

**Directory structure:**
```bash
.claude/agent-configs/
├── agent-9-testing.json          # Active
├── agent-10-content.json         # New
├── agent-11-seo.json             # New
├── agent-12-email.json           # New
├── agent-13-deployment.json      # New
├── agent-14-performance.json     # New
├── agent-15-security.json        # New
├── agent-16-mobile.json          # New
└── agent-17-docs.json            # New
```

**Agent 9: Testing & Regression** (Keep Active)
**File:** `.claude/agent-configs/agent-9-testing.json`

```json
{
  "filesystem": {
    "denyRead": [".env.production"],
    "allowWrite": [
      "tests/**",
      ".playwright/**",
      "test-results/**",
      "coverage/**",
      "vitest.config.ts",
      "playwright.config.ts",
      ".serena/memories/agent-9-status.yml"
    ],
    "denyWrite": [
      "src/**",
      "prisma/schema.prisma"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "127.0.0.1",
      "playwright.dev"
    ]
  }
}
```

**Agent 10: Content Management**
**File:** `.claude/agent-configs/agent-10-content.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "src/content/**",
      "src/app/api/content/**",
      "src/components/admin/ContentEditor.tsx",
      "public/images/**",
      "public/uploads/**",
      "prisma/seed-data/**",
      ".serena/memories/agent-10-status.yml"
    ],
    "denyWrite": [
      "src/app/(auth)/**",
      "src/lib/auth/**",
      "prisma/schema.prisma",
      ".env*"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "supabase.co",
      "*.supabase.co"
    ]
  }
}
```

**Agent 11: SEO & Analytics**
**File:** `.claude/agent-configs/agent-11-seo.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "src/app/**/metadata.ts",
      "src/lib/seo/**",
      "src/lib/analytics/**",
      "src/components/analytics/**",
      "public/robots.txt",
      "public/sitemap.xml",
      "public/.well-known/**",
      ".serena/memories/agent-11-status.yml"
    ],
    "denyWrite": [
      "src/app/api/**",
      "prisma/**"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "google.com",
      "google-analytics.com",
      "googletagmanager.com",
      "search.google.com",
      "analytics.google.com"
    ]
  }
}
```

**Agent 12: Email Notifications**
**File:** `.claude/agent-configs/agent-12-email.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "src/lib/email/**",
      "src/app/api/email/**",
      "src/components/email/**",
      "public/email-templates/**",
      ".serena/memories/agent-12-status.yml"
    ],
    "denyWrite": [
      "prisma/schema.prisma",
      ".env.production"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "api.sendgrid.com",
      "smtp.gmail.com",
      "smtp.office365.com"
    ]
  }
}
```

**Agent 13: Deployment & DevOps**
**File:** `.claude/agent-configs/agent-13-deployment.json`

```json
{
  "filesystem": {
    "allowWrite": [
      ".github/workflows/**",
      "netlify.toml",
      "vercel.json",
      "scripts/deploy/**",
      "scripts/migrate/**",
      ".serena/memories/agent-13-status.yml"
    ],
    "denyWrite": [
      "src/**",
      "prisma/schema.prisma",
      ".env"
    ]
  },
  "network": {
    "allowedDomains": [
      "github.com",
      "api.github.com",
      "netlify.com",
      "api.netlify.com",
      "vercel.com",
      "api.vercel.com",
      "supabase.com",
      "api.supabase.com"
    ]
  }
}
```

**Agent 14: Performance Optimization**
**File:** `.claude/agent-configs/agent-14-performance.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "next.config.js",
      "public/**",
      "src/app/**/loading.tsx",
      "src/components/optimized/**",
      "src/lib/performance/**",
      ".serena/memories/agent-14-status.yml"
    ],
    "denyWrite": [
      "src/app/api/**",
      "prisma/**",
      ".env*"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost",
      "pagespeed.web.dev",
      "lighthouse-dot-webdotdevsite.appspot.com"
    ]
  }
}
```

**Agent 15: Security Hardening**
**File:** `.claude/agent-configs/agent-15-security.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "src/middleware.ts",
      "src/lib/security/**",
      "src/app/api/*/middleware.ts",
      ".serena/memories/agent-15-status.yml"
    ],
    "denyWrite": [
      ".env",
      ".env.production",
      "prisma/schema.prisma"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost"
    ]
  }
}
```

**Agent 16: Mobile Optimization**
**File:** `.claude/agent-configs/agent-16-mobile.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "src/components/mobile/**",
      "src/app/dashboard/**/mobile.tsx",
      "public/manifest.json",
      "public/icons/**",
      "src/lib/pwa/**",
      ".serena/memories/agent-16-status.yml"
    ],
    "denyWrite": [
      "src/app/api/**"
    ]
  },
  "network": {
    "allowedDomains": [
      "localhost"
    ]
  }
}
```

**Agent 17: Documentation & Training**
**File:** `.claude/agent-configs/agent-17-docs.json`

```json
{
  "filesystem": {
    "allowWrite": [
      "docs/**",
      "public/help/**",
      "README.md",
      "DEPLOYMENT-GUIDE.md",
      "USER-GUIDE.md",
      ".serena/memories/agent-17-status.yml"
    ],
    "denyWrite": [
      "src/**",
      "prisma/**",
      ".env*"
    ]
  },
  "network": {
    "allowedDomains": []
  }
}
```

---

### 3. MCP Server Configuration

**File:** `%APPDATA%\Code\User\settings.json` (Windows) or `~/.config/Code/User/settings.json` (Mac/Linux)

```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "srt",
      "args": [
        "--settings",
        ".mcp-browser-sandbox.json",
        "npx",
        "@browsermcp/mcp@latest"
      ]
    },
    "playwright": {
      "command": "srt",
      "args": [
        "--settings",
        ".claude/agent-configs/agent-9-testing.json",
        "npx",
        "@modelcontextprotocol/server-playwright"
      ]
    }
  }
}
```

**File:** `.mcp-browser-sandbox.json`

```json
{
  "network": {
    "allowedDomains": [
      "localhost",
      "127.0.0.1",
      "fonts.googleapis.com",
      "fonts.gstatic.com"
    ]
  },
  "filesystem": {
    "denyRead": ["~/.ssh", ".env*"],
    "allowWrite": [
      ".mcp-screenshots/**",
      ".mcp-logs/**"
    ],
    "denyWrite": ["src/**", "prisma/**"]
  },
  "ignoreViolations": {
    "browsermcp": [
      "/System/Library/Fonts",
      "/Library/Fonts",
      "~/Library/Caches"
    ]
  }
}
```

---

### 4. Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3003",
    "dev:sandbox": "srt 'npm run dev'",
    "build": "next build",
    "build:sandbox": "srt 'npm run build'",
    "test": "vitest",
    "test:sandbox": "srt --settings .claude/agent-configs/agent-9-testing.json 'npm test'",
    "test:e2e": "playwright test",
    "test:e2e:sandbox": "srt --settings .claude/agent-configs/agent-9-testing.json 'npm run test:e2e'",
    "agent:10": "srt --settings .claude/agent-configs/agent-10-content.json 'npm run dev'",
    "agent:11": "srt --settings .claude/agent-configs/agent-11-seo.json 'npm run dev'",
    "agent:12": "srt --settings .claude/agent-configs/agent-12-email.json 'npm run dev'",
    "agent:13": "srt --settings .claude/agent-configs/agent-13-deployment.json 'npm run dev'",
    "agent:14": "srt --settings .claude/agent-configs/agent-14-performance.json 'npm run dev'",
    "agent:15": "srt --settings .claude/agent-configs/agent-15-security.json 'npm run dev'",
    "agent:16": "srt --settings .claude/agent-configs/agent-16-mobile.json 'npm run dev'",
    "agent:17": "srt --settings .claude/agent-configs/agent-17-docs.json 'npm run dev'"
  }
}
```

---

## 📝 STEP-BY-STEP IMPLEMENTATION

### Phase 1: Setup (30 minutes)

```bash
# 1. Install sandbox runtime
npm install -D @anthropic-ai/sandbox-runtime

# 2. Verify installation
npx srt --version

# 3. Create config directory
mkdir -p .claude/agent-configs
mkdir -p .serena/memories

# 4. Create base config
# Copy .srt-settings.json from Configuration Files section above

# 5. Create agent configs
# Copy each agent-XX-*.json file from Configuration Files section above

# 6. Create violation tracking
cat > .serena/memories/sandbox-violations.yml << 'EOF'
violations: []
EOF

# 7. Create MCP browser config
# Copy .mcp-browser-sandbox.json from Configuration Files section above

# 8. Update package.json scripts
# Add scripts from Configuration Files section above

# 9. Test base sandbox
npx srt "echo 'Sandbox working!'"

# 10. Test with dev server
npm run dev:sandbox
```

### Phase 2: Priority Agents (Week 1)

**Priority Order:**
1. **Agent 13: Deployment** (URGENT - get site live)
2. **Agent 11: SEO** (URGENT - capture market window)
3. **Agent 15: Security** (HIGH - protect data)
4. **Agent 10: Content** (HIGH - owner needs CMS)

```bash
# Day 1-2: Agent 13 Deployment
npm run agent:13
# Work on production deployment, CI/CD, database migration

# Day 3-4: Agent 11 SEO
npm run agent:11
# Implement SEO, analytics, Google Business Profile

# Day 5: Agent 15 Security
npm run agent:15
# Security hardening, rate limiting, headers

# Day 6-7: Agent 10 Content
npm run agent:10
# Content management system for owner
```

### Phase 3: Enhancement Agents (Week 2)

```bash
# Day 1-2: Agent 12 Email
npm run agent:12
# Email notifications, confirmations

# Day 3-4: Agent 14 Performance
npm run agent:14
# Optimization, Lighthouse 90+

# Day 5-7: Agent 16 Mobile
npm run agent:16
# PWA, offline support, mobile UI
```

### Phase 4: Polish (Week 3)

```bash
# Agent 17: Documentation
npm run agent:17
# User guides, training materials

# Agent 9: Final Testing
npm run test:sandbox
npm run test:e2e:sandbox
# Comprehensive test suite run
```

---

## 🚨 TROUBLESHOOTING

### Issue 1: Sandbox dependencies missing

**Error:**
```
Error: Sandbox dependencies are not available on this system.
Required: ripgrep (rg), bubblewrap (bwrap), and socat.
```

**Solution:**
```bash
# macOS
brew install ripgrep

# Ubuntu/Debian
sudo apt-get update && sudo apt-get install -y bubblewrap socat ripgrep

# Fedora
sudo dnf install -y bubblewrap socat ripgrep
```

### Issue 2: Network request blocked

**Error:**
```
Connection blocked by network allowlist
```

**Solution:**
```bash
# 1. Check violation log
tail .serena/memories/sandbox-violations.yml

# 2. Add domain to config
# Edit .srt-settings.json or agent-specific config
# Add domain to "allowedDomains" array

# 3. Retry operation
```

### Issue 3: File write blocked

**Error:**
```
Operation not permitted
```

**Solution:**
```bash
# 1. Check which file was blocked
tail .serena/memories/sandbox-violations.yml

# 2. Verify it's safe to allow
# Is it a source file? Config file? Database?

# 3. Add to allowWrite (if safe)
# Edit agent config file

# 4. If it's sensitive (like .env), keep blocked!
```

### Issue 4: MCP server won't start

**Error:**
```
Failed to start MCP server
```

**Solution:**
```bash
# 1. Test MCP without sandbox
npx @browsermcp/mcp@latest

# 2. If works, check sandbox config
cat .mcp-browser-sandbox.json

# 3. Check ignoreViolations for browser-specific paths
# Add browser cache/font paths if needed
```

---

## 📚 QUICK REFERENCE

### Common Commands

```bash
# Development (sandboxed)
npm run dev:sandbox

# Testing (sandboxed)
npm run test:sandbox
npm run test:e2e:sandbox

# Agent-specific work
npm run agent:10  # Content management
npm run agent:11  # SEO & analytics
npm run agent:12  # Email notifications
npm run agent:13  # Deployment
npm run agent:14  # Performance
npm run agent:15  # Security
npm run agent:16  # Mobile
npm run agent:17  # Documentation

# Check violations
tail -f .serena/memories/sandbox-violations.yml

# Review agent status
cat .serena/memories/agent-{NUMBER}-status.yml
```

### File Locations

- **Base Config:** `.srt-settings.json`
- **Agent Configs:** `.claude/agent-configs/agent-*.json`
- **Violation Log:** `.serena/memories/sandbox-violations.yml`
- **Agent Status:** `.serena/memories/agent-{NUMBER}-status.yml`
- **MCP Config:** `.mcp-browser-sandbox.json`

### Decision Tree: Allow or Deny?

```
Operation Blocked?
  ├─→ Is it reading/writing .env, ~/.ssh, or secrets?
  │    └─→ KEEP BLOCKED (security risk)
  │
  ├─→ Is it modifying package.json or prisma/schema.prisma?
  │    └─→ KEEP BLOCKED (structural changes need review)
  │
  ├─→ Is it writing to src/, tests/, docs/?
  │    └─→ ALLOW (normal development)
  │
  ├─→ Is it network to unknown domain?
  │    ├─→ Is domain necessary? (CDN, API, etc.)
  │    │    └─→ ALLOW (add to allowedDomains)
  │    └─→ Random/suspicious domain?
  │         └─→ KEEP BLOCKED
  │
  └─→ Is it system path (/usr/bin, /System)?
       └─→ ADD TO ignoreViolations (OS-level, harmless)
```

---

## 🎯 RECOMMENDED AGENT PRIORITY

### Immediate (This Week)
1. **Agent 13: Deployment** - Get site live
2. **Agent 11: SEO** - Capture market opportunity
3. **Agent 15: Security** - Protect data

### Short Term (Next 2 Weeks)
4. **Agent 10: Content** - Owner CMS needs
5. **Agent 12: Email** - Professional communication
6. **Agent 14: Performance** - User experience

### Medium Term (Month 1)
7. **Agent 16: Mobile** - Crew field access
8. **Agent 17: Documentation** - Training materials

### Ongoing
9. **Agent 9: Testing** - Continuous regression prevention

---

## 📞 NEXT STEPS FOR USER (nice-and-precise)

### Step 1: Save This Guide
```bash
# Save this entire document as:
.claude/MASTER-SANDBOX-GUIDE.md
```

### Step 2: Choose Implementation Method

**Option A: Manual Setup (30 min, full control)**
- Copy/paste each config file from this guide
- Manually create `.srt-settings.json`
- Manually create each agent config in `.claude/agent-configs/`
- Test each file individually

**Option B: Let Claude Code Do It (5 min, automated)**
Tell Claude Code:
```
"Using MASTER-SANDBOX-GUIDE.md, set up sandbox runtime:
1. Install @anthropic-ai/sandbox-runtime
2. Create all config files from guide
3. Update package.json scripts
4. Test sandbox with simple command
5. Verify all agent configs created correctly"
```

### Step 3: Test Setup
```bash
# Test 1: Base sandbox
npx srt "echo 'Testing sandbox'"

# Test 2: Dev server
npm run dev:sandbox

# Test 3: Open http://localhost:3003 in browser
# Should work normally

# Test 4: Check violations (should be empty)
cat .serena/memories/sandbox-violations.yml
```

### Step 4: Start First Agent
```bash
# Recommended: Start with Agent 13 (Deployment)
npm run agent:13

# Then tell Claude Code:
"I'm ready for Agent 13 to begin deployment work.
Use agent-13-deployment.json sandbox config.
Focus on production Netlify setup and database migration to Supabase."
```

---

## 🏁 SUMMARY

### What You're Getting
- ✅ **Secure Sandbox System:** OS-level protection for all agent work
- ✅ **9 Active Agent Configs:** Ready for production phase
- ✅ **Violation Tracking:** Automatic security monitoring
- ✅ **MCP Integration:** Sandboxed browser and testing tools
- ✅ **Priority Roadmap:** Clear sequence for agents 10-17

### Why This Matters
- 🛡️ **Security:** Agents can't accidentally expose secrets or break production
- ⚡ **Speed:** Agents work independently without permission prompts
- 🤝 **Coordination:** Violation tracking prevents agent conflicts
- 📈 **Learning:** System improves over time as permissions are refined

### Time to Value
- **Setup:** 30 minutes
- **First Agent (13 Deployment):** 4-8 hours
- **Site Live:** End of Week 1
- **Full Production Ready:** End of Week 3

---

**Prepared by:** Anthropic Claude (with GitHub Copilot assistance)  
**Date:** 2025-11-23  
**Version:** 1.0  
**Status:** READY FOR IMPLEMENTATION