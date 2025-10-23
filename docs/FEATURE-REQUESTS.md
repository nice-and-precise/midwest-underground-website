# 🚀 Feature Request Guide

Complete guide for adding new features to the Midwest Underground website using Claude Code and other AI development tools.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [General Feature Request Template](#general-feature-request-template)
3. [Specific Feature Templates](#specific-feature-templates)
   - [Dark Mode Toggle](#dark-mode-toggle)
   - [Service Request Form](#service-request-form)
   - [Invoice Payment System](#invoice-payment-system)
4. [Testing & Validation](#testing--validation)
5. [Documentation Requirements](#documentation-requirements)
6. [Deployment Process](#deployment-process)
7. [Best Practices](#best-practices)
8. [Quick Reference](#quick-reference)

---

## 🚀 Quick Start

### Step 1: Navigate to Your Project

```bash
# Open your project directory
cd C:/Users/Owner/Desktop/midwest-underground-website

# Launch VS Code
code .

# In separate terminal, launch Claude Code in YOLO mode
claude --dangerously-skip-permissions
```

### Step 2: Review Current State

In Claude Code, paste this:

```
Review the current project structure and codebase.

Read these files first:
- CLAUDE.md (project context)
- README.md (project overview)
- docs/ARCHITECTURE.md (technical architecture)
- All HTML files (index.html, services.html, about.html, contact.html, projects.html)
- css/styles.css (current styles)
- js/main.js (current JavaScript)

Provide a summary of:
1. Current features implemented
2. File structure
3. Technologies used
4. Any placeholder content or TODOs
5. Current form implementations (if any)

This will help us plan new feature additions.
```

### Step 3: Use Feature Request Template

Once Claude understands the current state, use the templates below for specific features.

---

## 📝 General Feature Request Template

**Copy-Paste This for Any Feature:**

```markdown
# FEATURE REQUEST: [Feature Name]

## Context
Read CLAUDE.md and review the current codebase to understand the project structure.

## Feature Requirements

**What:** [Describe the feature in 1-2 sentences]

**Why:** [Business justification]

**User Story:** As a [user type], I want [goal] so that [benefit].

**Acceptance Criteria:**
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)
- [ ] Performance maintained (Lighthouse > 90)
- [ ] Documentation updated

## Technical Approach

**Files to Modify:**
- [List files that need changes]

**Files to Create:**
- [List new files needed]

**Dependencies:**
- [List any new libraries or tools needed]

**Design Considerations:**
- Must match existing color palette
- Must follow current component patterns
- Must maintain static site approach (no backend unless specified)
- Must be easily maintainable

## Implementation Steps

Work autonomously through these steps:

1. **Planning Phase**
   - Analyze current code structure
   - Identify integration points
   - Plan component architecture
   - Consider edge cases

2. **Implementation Phase**
   - Create/modify necessary files
   - Follow existing code patterns
   - Add comments for maintainability
   - Ensure responsive design

3. **Testing Phase**
   - Test all functionality
   - Verify mobile responsiveness
   - Check accessibility
   - Validate performance

4. **Documentation Phase**
   - Update README.md
   - Update docs/ARCHITECTURE.md
   - Update docs/MAINTENANCE.md
   - Add comments in code
   - Update PLACEHOLDERS.md if needed

5. **Review Phase**
   - Run Lighthouse audit
   - Check all acceptance criteria
   - Test cross-browser
   - Verify git commit quality

## Quality Gates

Before marking this feature complete:
- ✅ All acceptance criteria met
- ✅ Mobile responsive (375px to 1920px+)
- ✅ Accessible (keyboard nav, screen reader, ARIA)
- ✅ Performance maintained (no regression)
- ✅ Documentation updated
- ✅ Code commented and clean
- ✅ Git commit created with descriptive message
- ✅ Testing checklist completed

## Begin Implementation

Start with the Planning Phase. Use /checkpoint after completing each phase. Work autonomously and make decisions based on best practices.
```

---

## 🎨 Specific Feature Templates

### Dark Mode Toggle

**Complete implementation guide for adding dark mode to the website.**

See [docs/features/DARK-MODE.md](features/DARK-MODE.md) for complete details.

**Quick Summary:**
- Adds light/dark theme toggle
- Saves preference to localStorage
- Respects system preference
- Smooth color transitions
- Accessible toggle button
- WCAG AA contrast maintained

**Files to Modify:**
- css/styles.css
- js/main.js
- All HTML files (add toggle button)

**Implementation Time:** ~2 hours

---

### Service Request Form

**Multi-step form for customer service requests.**

See [docs/features/SERVICE-REQUEST-FORM.md](features/SERVICE-REQUEST-FORM.md) for complete details.

**Quick Summary:**
- 3-step form (Service → Details → Contact)
- Service checkboxes
- Project description
- File upload capability
- Form validation
- Formspree integration

**Files to Create:**
- service-request.html
- thank-you.html

**Files to Modify:**
- css/styles.css
- js/main.js

**Implementation Time:** ~3 hours

---

### Invoice Payment System

**Secure online invoice payment with Stripe/Square.**

See [docs/features/INVOICE-PAYMENT.md](features/INVOICE-PAYMENT.md) for complete details.

**Quick Summary:**
- Invoice lookup by number
- Secure payment processing
- Stripe/Square integration
- Payment confirmation
- Email receipt
- PCI compliance

**Files to Create:**
- pay-invoice.html
- payment-confirmation.html
- js/payment.js

**Dependencies:**
- Stripe or Square account
- HTTPS hosting (already have with Netlify)

**Implementation Time:** ~4 hours

---

## ✅ Testing & Validation

### Testing Checklist Template

**Copy-Paste After Feature Implementation:**

```markdown
# TESTING CHECKLIST: [Feature Name]

## Functional Testing
- [ ] Feature works as specified in all acceptance criteria
- [ ] All user interactions function correctly
- [ ] All edge cases handled
- [ ] Error states display properly
- [ ] Success states display properly
- [ ] Data validates correctly
- [ ] Form submissions work (if applicable)

## Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Responsive Testing
- [ ] 375px width (mobile small)
- [ ] 425px width (mobile large)
- [ ] 768px width (tablet portrait)
- [ ] 1024px width (tablet landscape / small desktop)
- [ ] 1440px width (desktop)
- [ ] 1920px width (large desktop)

## Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, Space, Arrow keys)
- [ ] Focus indicators visible
- [ ] Screen reader announces properly (NVDA/JAWS)
- [ ] ARIA labels present and correct
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Semantic HTML used
- [ ] Alt text on images
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers

## Performance Testing
- [ ] Run Lighthouse audit (target: >90 all categories)
- [ ] Check page load time (target: <3 seconds)
- [ ] Check for console errors
- [ ] Check for console warnings
- [ ] Verify no memory leaks
- [ ] Check resource loading (images, scripts, styles)
- [ ] Verify lazy loading works (if applicable)

## Security Testing (if applicable)
- [ ] Input sanitization works
- [ ] XSS protection verified
- [ ] CSRF tokens in place (if needed)
- [ ] API keys not exposed in frontend
- [ ] Sensitive data not in localStorage without encryption
- [ ] HTTPS enforced (production)
- [ ] Security headers configured

## Integration Testing
- [ ] Feature integrates with existing code
- [ ] No breaking changes to other features
- [ ] Navigation still works
- [ ] Styling consistent with site
- [ ] No CSS conflicts
- [ ] No JavaScript conflicts

## User Experience Testing
- [ ] Clear call-to-action
- [ ] Intuitive user flow
- [ ] Loading states provide feedback
- [ ] Error messages are helpful
- [ ] Success messages are clear
- [ ] No confusing UI elements

## Documentation Testing
- [ ] README.md updated and accurate
- [ ] Architecture documentation complete
- [ ] Maintenance guide clear
- [ ] Code comments helpful
- [ ] Examples work as documented

## Git & Deployment Testing
- [ ] Clean commit message
- [ ] No sensitive data in commit
- [ ] Feature branch merged correctly
- [ ] Deployed to staging successfully (if applicable)
- [ ] Deployed to production successfully
- [ ] Rollback plan documented

## Post-Deployment Monitoring
- [ ] Check analytics (feature usage)
- [ ] Monitor error logs
- [ ] Gather user feedback
- [ ] Check performance metrics
- [ ] Monitor conversion rates (if applicable)

---

## Test Results

**Date Tested:** [Date]
**Tested By:** [Name]

**Issues Found:**
1. [Issue description] - [Severity: Critical/High/Medium/Low] - [Status: Open/Fixed]

**Overall Assessment:** [Pass/Fail/Needs Revision]

**Notes:**
[Any additional observations or recommendations]
```

---

## 📚 Documentation Requirements

### Automatic Documentation Updates

After implementing any feature, update:

#### 1. README.md

Add a new section under "Features":

```markdown
### [Feature Name]
- Brief description (1-2 sentences)
- User benefit
- Technical implementation note
- Link to detailed documentation (if applicable)
```

#### 2. docs/ARCHITECTURE.md

Add technical details:

```markdown
## [Feature Name] Implementation

**Technology:** [List technologies/libraries used]

**Files:**
- [File path] - [Purpose]
- [File path] - [Purpose]

**Key Functions:**
- `functionName()` - [What it does]
- `functionName()` - [What it does]

**Integration Points:**
- [How it connects to existing code]

**Dependencies:**
- [List external dependencies]

**Future Enhancements:**
- [List potential improvements]
```

#### 3. docs/MAINTENANCE.md

Add maintenance procedures:

```markdown
## Maintaining [Feature Name]

**How to modify:**
[Step-by-step instructions for common modifications]

**Configuration:**
[Environment variables, API keys, settings]

**Troubleshooting:**
- **Problem:** [Issue description]
  **Solution:** [How to fix]

**Testing:**
[How to test this feature works correctly]
```

#### 4. In-Code Comments

Add detailed comments:

```javascript
/**
 * [Feature Name] Implementation
 *
 * Purpose: [What this code does and why]
 *
 * Dependencies: [List any external dependencies]
 *
 * Usage Example:
 * ```
 * [Code example showing how to use this]
 * ```
 *
 * @param {type} paramName - Description
 * @returns {type} Description
 */
```

#### 5. Update CHANGELOG

Create/update CHANGELOG.md:

```markdown
## [Version] - [Date]

### Added
- [Feature Name]: [Brief description]

### Changed
- [What was modified]

### Fixed
- [What bugs were fixed]
```

---

## 🚀 Deployment Process

### Standard Deployment Workflow

```bash
# 1. Test locally
# Open in browser and manually test

# 2. Commit changes
git add .
git commit -m "feat: Add [feature name] with [key details]"

# 3. Push to repository
git push origin main

# 4. Deploy (auto-deploy via Netlify/Vercel)
# Or manual deploy:
netlify deploy --prod
# or
vercel --prod

# 5. Verify deployment
# Visit live site and test feature

# 6. Monitor for issues
# Check error logs, analytics, user feedback
```

### Rollback Process (If Needed)

```bash
# If something breaks in production:

# Option 1: Revert commit
git revert HEAD
git push origin main

# Option 2: Roll back to previous commit
git reset --hard PREVIOUS_COMMIT_HASH
git push --force origin main

# Option 3: Deploy previous version via Netlify/Vercel UI
# Go to deployment history and rollback
```

---

## 💡 Best Practices

### General Guidelines

1. **Use /checkpoint frequently**
   - After each major phase
   - Before testing
   - After completing a feature
   - Saves context and enables rollback

2. **Test incrementally**
   - Don't wait until the end
   - Test after each phase
   - Fix issues immediately
   - Prevents compound errors

3. **Keep changes focused**
   - One feature per branch
   - Clear, descriptive commits
   - Easier to review and debug

4. **Documentation is not optional**
   - Update docs as you code
   - Future you will thank you
   - Others can maintain your work

5. **Accessibility from the start**
   - Don't bolt it on later
   - Test with keyboard
   - Use semantic HTML
   - Add ARIA labels

### Code Quality Standards

```javascript
// ✅ GOOD: Clear, commented, maintainable
/**
 * Toggle dark mode and save preference
 * Updates theme attribute and saves to localStorage
 */
function toggleDarkMode() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateToggleIcon(newTheme);
}

// ❌ BAD: Unclear, no comments, hard to maintain
function t() {
  var h = document.documentElement;
  var c = h.getAttribute('data-theme');
  var n = c === 'dark' ? 'light' : 'dark';
  h.setAttribute('data-theme', n);
  localStorage.setItem('theme', n);
  u(n);
}
```

### Performance Considerations

- **Minimize dependencies:** Only add libraries when truly needed
- **Optimize images:** Compress and use WebP format
- **Lazy load:** Load images and components as needed
- **Minify:** Minify CSS and JavaScript for production
- **Cache:** Leverage browser caching
- **Async/Defer:** Load scripts asynchronously when possible

---

## 🎯 Quick Reference

### Common Claude Code Commands

```bash
/checkpoint          # Save current context
/clear              # Clear context, start fresh
/ide                # Connect to VS Code
/config             # Change Claude Code settings
/bug                # Report issues

Cmd/Ctrl+C          # Interrupt Claude
Cmd/Ctrl+Esc        # Launch from VS Code
↑                   # Navigate command history
```

### Git Commit Message Format

```bash
# Format: <type>: <subject>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Formatting, no code change
refactor: # Code refactoring
test:     # Adding tests
chore:    # Maintenance tasks

# Examples:
git commit -m "feat: Add dark mode toggle with localStorage persistence"
git commit -m "fix: Correct mobile menu z-index issue"
git commit -m "docs: Update maintenance guide with dark mode instructions"
```

### Lighthouse Audit Quick Run

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-site.com --view

# Run audit with specific categories
lighthouse https://your-site.com --only-categories=performance,accessibility,seo --view
```

---

## 📞 Getting Help

### If You Get Stuck

1. **Check documentation first**
   - Review docs/ARCHITECTURE.md
   - Check docs/MAINTENANCE.md
   - Read inline code comments

2. **Search for similar issues**
   - GitHub Issues for libraries used
   - Stack Overflow
   - MDN Web Docs

3. **Ask Claude Code**
   ```
   I'm trying to implement [feature] but encountering [problem].

   Current code:
   [paste relevant code]

   Error message:
   [paste error if any]

   What I've tried:
   [list what you've attempted]

   Please help me debug and fix this issue.
   ```

4. **Use /bug command**
   ```
   /bug Report: [Describe the unexpected behavior]
   ```

---

## 🎊 Ready to Add Features

You now have everything you need to:

- ✅ Add dark mode toggle
- ✅ Implement service request forms
- ✅ Set up invoice payments
- ✅ Maintain comprehensive documentation
- ✅ Test thoroughly
- ✅ Deploy confidently

**Next Steps:**
1. Choose a feature from the templates above
2. Copy the feature request template
3. Paste into Claude Code
4. Let Claude build autonomously
5. Review, test, and deploy!

---

**Last Updated:** October 22, 2025
**Maintained By:** Midwest Underground Team
