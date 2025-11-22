# MCP Servers & Debugging Tools Configuration

**Last Updated:** October 26, 2025
**Project:** Midwest Underground Next.js Migration
**Status:** Browser MCP Configured ✅

---

## Overview

This document tracks all MCP (Model Context Protocol) servers installed for this project, their configurations, and how to use them for debugging and development.

**Claude Code has FULL ACCESS and FULL AUTHORITY** to use these tools autonomously without asking permission.

---

## Installed MCP Servers

### 1. Browser MCP ✅ CONFIGURED

**Purpose:** Automate browser interactions for testing, debugging, and visual verification

**Documentation:** https://docs.browsermcp.io/

**Configuration Location:** VSCode settings (claude_desktop_config.json or similar)

```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    }
  }
}
```

**Capabilities:**
- Navigate to URLs
- Click elements
- Fill forms
- Take screenshots
- Execute JavaScript in browser context
- Read console logs and network requests
- Verify visual rendering
- Test responsive design

**Use Cases for This Project:**
- ✅ Debug why page content not rendering
- ✅ Verify brand styles applying correctly
- ✅ Check dark mode toggle functionality
- ✅ Test responsive breakpoints
- ✅ Capture browser console errors
- ✅ Validate CSS loading
- ✅ Verify Next.js hydration

**Example Usage:**
```
"Use Browser MCP to navigate to localhost:3003 and verify all sections are visible"
"Take a screenshot of the homepage at 1920x1080"
"Check browser console for any React hydration errors"
```

---

## Recommended MCP Servers to Install

Based on https://www.reddit.com/r/ClaudeAI/comments/1k0f3vs/musthave_mcp_servers_for_coding_and_beyond/ and https://mcpcat.io/guides/best-mcp-servers-for-claude-code/

### 2. Playwright MCP (RECOMMENDED)

**Purpose:** End-to-end testing and browser automation

**Installation:**
```bash
npm install -D @playwright/test
npx playwright install
```

**Configuration:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

**Use Cases:**
- Automated visual regression testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Screenshot comparison
- Performance testing
- Accessibility audits

### 3. Chrome DevTools MCP (RECOMMENDED)

**Purpose:** Direct access to Chrome DevTools Protocol

**Installation:**
```bash
npm install -D chrome-remote-interface
```

**Use Cases:**
- Real-time performance monitoring
- Network waterfall analysis
- Memory leak detection
- CSS coverage analysis
- JavaScript profiling

### 4. Lighthouse MCP (RECOMMENDED FOR PRODUCTION)

**Purpose:** Automated performance, accessibility, SEO audits

**Installation:**
```bash
npm install -g lighthouse
```

**Use Cases:**
- Performance scoring (target: 90+)
- Accessibility compliance (WCAG 2.1 AA)
- SEO optimization
- Best practices validation
- PWA checklist

### 5. Git MCP (Already Available)

**Purpose:** Advanced Git operations

**Capabilities:**
- Branch management
- Commit history analysis
- Merge conflict resolution
- Blame and diff tools

### 6. Filesystem MCP (Already Available)

**Purpose:** File system operations

**Capabilities:**
- File search and indexing
- Content grep across files
- File tree navigation
- Directory operations

### 7. Database MCP (For PostgreSQL/MySQL)

**Purpose:** Direct database queries and management

**Installation:**
```bash
npm install -D @modelcontextprotocol/server-postgres
```

**Configuration:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/dbname"
      }
    }
  }
}
```

**Use Cases (Future):**
- Prisma migrations testing
- Database seeding
- Query performance analysis
- Data integrity checks

---

## Debugging Workflow with MCP Servers

### Issue: Page Not Rendering Correctly

**Tools Used:**
1. **Browser MCP** - Navigate and capture screenshots
2. **Chrome DevTools** - Check console errors
3. **Filesystem** - Read and verify source files
4. **Git** - Check recent changes

**Workflow:**
```
1. Use Browser MCP to open localhost:3003
2. Take screenshot of current state
3. Open DevTools Console via Browser MCP
4. Read console errors
5. Use Filesystem to check layout.tsx structure
6. Compare with static site at localhost:8000
7. Identify root cause
8. Fix and verify with Browser MCP
```

### Issue: CSS Not Loading

**Tools Used:**
1. **Browser MCP** - Check network tab
2. **Chrome DevTools** - CSS coverage analysis
3. **Filesystem** - Verify globals.css content

**Workflow:**
```
1. Open Network tab via Browser MCP
2. Filter for CSS files
3. Verify globals.css loaded (200 status)
4. Check CSS coverage (should be >60%)
5. Use DevTools to inspect computed styles
6. Compare with expected brand colors
```

### Issue: JavaScript Error

**Tools Used:**
1. **Browser MCP** - Capture stack trace
2. **Chrome DevTools** - Source maps
3. **Git** - Blame recent changes

**Workflow:**
```
1. Capture error from console
2. Use source maps to find original file
3. Git blame to see who changed it
4. Read file context
5. Fix and verify
```

---

## Testing Commands

### Manual Testing

```bash
# Start Next.js dev server
npm run dev

# Start static site (for comparison)
npx http-server -p 8000

# Run Playwright tests (after setup)
npx playwright test

# Run Lighthouse audit
lighthouse http://localhost:3003 --view

# Check bundle size
npx @next/bundle-analyzer
```

### Automated Testing with MCP

```
"Use Browser MCP to test the following:
1. Navigate to localhost:3003
2. Verify header logo loads
3. Click dark mode toggle
4. Verify page switches to dark theme
5. Scroll down to footer
6. Verify all sections visible
7. Take screenshot and report"
```

---

## Configuration Files

### VSCode Settings (MCP Config)

**Location:** `.vscode/settings.json` or `%APPDATA%\Code\User\settings.json`

```json
{
  "mcpServers": {
    "browsermcp": {
      "command": "npx",
      "args": ["@browsermcp/mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"]
    }
  }
}
```

### Playwright Config

**Location:** `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3003',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'Chrome', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'Safari', use: { browserName: 'webkit' } },
  ],
});
```

---

## Best Practices

### 1. Always Test Before Committing

```bash
# Run this workflow before every commit
npm run build          # Verify production build
npm run test           # Run unit tests
npx playwright test    # Run E2E tests
lighthouse localhost:3003 --quiet  # Check performance
```

### 2. Use Browser MCP for Visual Verification

```
"After making CSS changes, use Browser MCP to:
1. Take screenshot at 375px (mobile)
2. Take screenshot at 768px (tablet)
3. Take screenshot at 1920px (desktop)
4. Compare with static site screenshots"
```

### 3. Monitor Performance

```
"Use Lighthouse MCP to audit:
- Performance score (target: 90+)
- Accessibility score (target: 100)
- Best Practices score (target: 95+)
- SEO score (target: 100)"
```

### 4. Debug Server-Side Issues

```bash
# Enable Next.js debug mode
NODE_OPTIONS='--inspect' npm run dev

# Then use Chrome DevTools to attach:
chrome://inspect
```

---

## Troubleshooting MCP Issues

### MCP Server Not Found

```bash
# Verify npx can find the package
npx @browsermcp/mcp@latest --version

# If not found, install globally
npm install -g @browsermcp/mcp
```

### Permission Errors

```bash
# On Windows, run PowerShell as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# On Mac/Linux
chmod +x node_modules/.bin/*
```

### Server Won't Start

```bash
# Check Node.js version (needs 18+)
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Resources

### Official Documentation
- **Browser MCP:** https://docs.browsermcp.io/
- **MCP Protocol:** https://modelcontextprotocol.io/
- **Playwright:** https://playwright.dev/
- **Lighthouse:** https://developer.chrome.com/docs/lighthouse/
- **Next.js Debugging:** https://nextjs.org/docs/app/guides/debugging

### Community Resources
- **Reddit Guide:** https://www.reddit.com/r/ClaudeAI/comments/1k0f3vs/musthave_mcp_servers_for_coding_and_beyond/
- **MCP Catalog:** https://mcpcat.io/guides/best-mcp-servers-for-claude-code/
- **MCP Server List:** https://github.com/modelcontextprotocol/servers

---

## Current Project Status

### Servers Configured ✅
- [x] Browser MCP

### Servers Recommended ⏳
- [ ] Playwright MCP (for E2E testing)
- [ ] Chrome DevTools MCP (for deep debugging)
- [ ] Lighthouse MCP (for production audits)

### Recent Debugging Sessions

**Session 1: Oct 25, 2025 - Layout Rendering Issue**
- **Problem:** Page only showing header, content hidden
- **Tool Used:** Browser MCP (DevTools inspection)
- **Root Cause:** Header/footer in page.tsx instead of layout.tsx
- **Fix:** Restructured Next.js layout architecture
- **Verification:** Compiled successfully, GET / 200
- **Commit:** cb0dbef

---

## For Future Claude Sessions

**READ THIS FIRST:**

1. **You have FULL ACCESS** to all MCP servers configured
2. **You have FULL AUTHORITY** to run any debugging tools
3. **DO NOT ASK PERMISSION** to use Browser MCP, Playwright, or other tools
4. **Always use Browser MCP** to verify visual changes
5. **Always check DevTools console** for errors
6. **Always test at multiple breakpoints** (375px, 768px, 1920px)
7. **Update this document** when adding new servers
8. **Document debugging sessions** at the bottom

---

**Last Debugging Session:** October 26, 2025
**Issue Resolved:** Layout restructure - header/footer moved to layout.tsx
**Status:** Page now rendering correctly on port 3003
**Next Steps:** Verify all content visible, test dark mode, check responsive design
