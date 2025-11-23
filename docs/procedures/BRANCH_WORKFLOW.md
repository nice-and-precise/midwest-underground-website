<!-- TOC -->

## Table of Contents

  - [Overview](#overview)
  - [Branch Structure](#branch-structure)
    - [Protected Branches](#protected-branches)
      - [1. master (Production)](#1-master-production)
      - [2. develop (Staging)](#2-develop-staging)
    - [Feature Branches](#feature-branches)
      - [Naming Convention](#naming-convention)
      - [Examples](#examples)
      - [Rules](#rules)
  - [Development Workflow](#development-workflow)
    - [1. Starting New Work](#1-starting-new-work)
- [1. Ensure you're on develop and up to date](#1-ensure-youre-on-develop-and-up-to-date)
- [2. Create feature branch](#2-create-feature-branch)
- [3. Make your first commit](#3-make-your-first-commit)
- [4. Push to remote](#4-push-to-remote)
    - [2. Daily Development](#2-daily-development)
- [1. Make changes and commit frequently](#1-make-changes-and-commit-frequently)
- [2. Push to remote daily](#2-push-to-remote-daily)
- [3. Sync with develop (every 2-3 days)](#3-sync-with-develop-every-2-3-days)
- [4. Resolve conflicts if any](#4-resolve-conflicts-if-any)
- [(Use git rerere to remember resolutions)](#use-git-rerere-to-remember-resolutions)
    - [3. Preparing for Merge](#3-preparing-for-merge)
- [1. Final sync with develop](#1-final-sync-with-develop)
- [2. Run all tests](#2-run-all-tests)
- [3. Run linters](#3-run-linters)
- [4. Update documentation](#4-update-documentation)
- [Edit CHANGELOG.md, README.md, etc.](#edit-changelogmd-readmemd-etc)
- [5. Push final changes](#5-push-final-changes)
    - [4. Creating Pull Request](#4-creating-pull-request)
  - [Description](#description)
  - [Related Issues](#related-issues)
  - [Type of Change](#type-of-change)
  - [Testing](#testing)
  - [Screenshots (if applicable)](#screenshots-if-applicable)
  - [Checklist](#checklist)
    - [5. Code Review Process](#5-code-review-process)
      - [For Reviewers](#for-reviewers)
      - [For Authors](#for-authors)
    - [6. Merging](#6-merging)
- [Option A: Merge via GitHub/GitLab UI (Recommended)](#option-a-merge-via-githubgitlab-ui-recommended)
- [- Use "Squash and Merge" for clean history](#use-squash-and-merge-for-clean-history)
- [- Delete branch after merge](#delete-branch-after-merge)
- [Option B: Command Line Merge](#option-b-command-line-merge)
  - [Commit Message Guidelines](#commit-message-guidelines)
    - [Format](#format)
    - [Types](#types)
    - [Examples](#examples)
      - [Good Commits](#good-commits)
      - [Bad Commits](#bad-commits)
  - [Conflict Prevention Strategies](#conflict-prevention-strategies)
    - [1. Frequent Rebasing](#1-frequent-rebasing)
- [Rebase from develop every 2-3 days](#rebase-from-develop-every-2-3-days)
    - [2. Small, Focused Branches](#2-small-focused-branches)
    - [3. Communication](#3-communication)
    - [4. File Ownership](#4-file-ownership)
- [CODEOWNERS](#codeowners)
    - [5. Protected Files](#5-protected-files)
  - [CI/CD Integration](#cicd-integration)
    - [Required Status Checks](#required-status-checks)
      - [For develop branch:](#for-develop-branch)
      - [For master branch:](#for-master-branch)
    - [GitHub Actions Workflow](#github-actions-workflow)
  - [Emergency Procedures](#emergency-procedures)
    - [Hotfix Process (Production Bug)](#hotfix-process-production-bug)
- [1. Create hotfix branch from master](#1-create-hotfix-branch-from-master)
- [2. Fix the bug](#2-fix-the-bug)
- [Make minimal changes](#make-minimal-changes)
- [3. Test thoroughly](#3-test-thoroughly)
- [4. Create PR to master](#4-create-pr-to-master)
- [Tag as "HOTFIX" and "URGENT"](#tag-as-hotfix-and-urgent)
- [Get immediate review](#get-immediate-review)
- [5. After merge to master, backport to develop](#5-after-merge-to-master-backport-to-develop)
- [6. Delete hotfix branch](#6-delete-hotfix-branch)
    - [Rollback Process](#rollback-process)
- [Option A: Revert the merge commit](#option-a-revert-the-merge-commit)
- [Option B: Reset to previous tag](#option-b-reset-to-previous-tag)
- [Option C: Deploy previous version](#option-c-deploy-previous-version)
- [(If using deployment tags/releases)](#if-using-deployment-tagsreleases)
  - [Branch Protection Settings (GitHub)](#branch-protection-settings-github)
    - [Master Branch Settings](#master-branch-settings)
    - [Develop Branch Settings](#develop-branch-settings)
  - [Best Practices](#best-practices)
    - [DO ✅](#do)
    - [DON'T ❌](#dont)
  - [Conflict Resolution Tips](#conflict-resolution-tips)
    - [When Conflicts Occur](#when-conflicts-occur)
- [1. Fetch latest changes](#1-fetch-latest-changes)
- [2. Rebase (preferred) or merge](#2-rebase-preferred-or-merge)
- [OR](#or)
- [3. Resolve conflicts in your editor](#3-resolve-conflicts-in-your-editor)
- [Look for markers: <<<<<<<, =======, >>>>>>>](#look-for-markers)
- [4. Stage resolved files](#4-stage-resolved-files)
- [5. Continue rebase/merge](#5-continue-rebasemerge)
- [OR](#or)
- [6. Push changes](#6-push-changes)
    - [Common Conflict Scenarios](#common-conflict-scenarios)
      - [Scenario 1: package.json conflicts](#scenario-1-packagejson-conflicts)
- [Always keep both sets of dependencies](#always-keep-both-sets-of-dependencies)
- [Merge them manually and run npm install](#merge-them-manually-and-run-npm-install)
      - [Scenario 2: Same file, different sections](#scenario-2-same-file-different-sections)
- [Usually auto-resolved](#usually-auto-resolved)
- [If not, use "both changes" strategy](#if-not-use-both-changes-strategy)
- [Or manually merge in editor](#or-manually-merge-in-editor)
      - [Scenario 3: File moved/renamed](#scenario-3-file-movedrenamed)
- [Git usually handles this, but verify paths](#git-usually-handles-this-but-verify-paths)
- [Check imports/references in other files](#check-importsreferences-in-other-files)
  - [Tools & Resources](#tools-resources)
    - [Helpful Git Aliases](#helpful-git-aliases)
    - [Git GUI Tools](#git-gui-tools)
    - [Command Reference](#command-reference)
- [View branch relationships](#view-branch-relationships)
- [Check what will be merged](#check-what-will-be-merged)
- [Find who changed a line](#find-who-changed-a-line)
- [Search commit history](#search-commit-history)
- [Interactive rebase (clean up commits)](#interactive-rebase-clean-up-commits)
- [Stash changes temporarily](#stash-changes-temporarily)
- [Cherry-pick specific commits](#cherry-pick-specific-commits)
  - [Metrics & Monitoring](#metrics-monitoring)
    - [Track These Metrics](#track-these-metrics)
    - [Goals](#goals)
  - [Team Agreements](#team-agreements)
    - [Code Review Standards](#code-review-standards)
    - [Communication Channels](#communication-channels)
    - [Working Hours](#working-hours)
  - [Appendix](#appendix)
    - [Git Rerere (Reuse Recorded Resolution)](#git-rerere-reuse-recorded-resolution)
    - [GitHub Branch Protection API](#github-branch-protection-api)
    - [Semantic Versioning](#semantic-versioning)
  - [Document Control](#document-control)

<!-- /TOC -->

# Branch Workflow & Protection Rules

**Last Updated:** November 23, 2025
**Status:** 🟢 Active workflow guidelines for all contributors

---

## Overview

This document defines the branching strategy, protection rules, and development workflow for the Midwest Underground Website project.

**Goal:** Prevent merge conflicts, maintain code quality, and enable parallel development.

---

## Branch Structure

### Protected Branches

#### 1. `master` (Production)
- **Protection Level:** 🔴 **MAXIMUM**
- **Purpose:** Production-ready code
- **Auto-Deploy:** Yes (to production environment)
- **Rules:**
  - ✅ Require pull request reviews (minimum 1 approval)
  - ✅ Require status checks to pass
  - ✅ Require branches to be up to date
  - ✅ Require linear history (no merge commits from PRs)
  - ✅ Require signed commits
  - ❌ Allow force pushes
  - ❌ Allow deletions

#### 2. `develop` (Staging)
- **Protection Level:** 🟡 **HIGH**
- **Purpose:** Integration branch for testing
- **Auto-Deploy:** Yes (to staging environment)
- **Rules:**
  - ✅ Require pull request reviews (minimum 1 approval)
  - ✅ Require status checks to pass
  - ⚠️ Allow force pushes (with admin rights only)
  - ❌ Allow deletions

### Feature Branches

#### Naming Convention
```
feat/<feature-name>       # New features
fix/<bug-name>           # Bug fixes
docs/<doc-name>          # Documentation only
refactor/<refactor-name> # Code refactoring
test/<test-name>         # Test improvements
chore/<task-name>        # Maintenance tasks
```

#### Examples
```
feat/brand-refresh
feat/nextjs-migration
feat/takeoff-system
fix/navigation-mobile-menu
docs/update-readme
refactor/cleanup-components
test/add-e2e-coverage
chore/update-dependencies
```

#### Rules
- **Naming:** Lowercase with hyphens, descriptive
- **Lifetime:** Delete after merge (keep for 30 days max)
- **Base:** Always branch from `develop` (not `master`)
- **Sync:** Rebase from `develop` regularly (every 2-3 days)
- **Size:** Keep focused (one feature/fix per branch)

---

## Development Workflow

### 1. Starting New Work

```bash
# 1. Ensure you're on develop and up to date
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feat/your-feature-name

# 3. Make your first commit
git commit -m "feat: Initial commit for your feature"

# 4. Push to remote
git push -u origin feat/your-feature-name
```

### 2. Daily Development

```bash
# 1. Make changes and commit frequently
git add .
git commit -m "feat: Implement X functionality"

# 2. Push to remote daily
git push origin feat/your-feature-name

# 3. Sync with develop (every 2-3 days)
git fetch origin
git rebase origin/develop

# 4. Resolve conflicts if any
# (Use git rerere to remember resolutions)
git push origin feat/your-feature-name --force-with-lease
```

### 3. Preparing for Merge

```bash
# 1. Final sync with develop
git fetch origin
git rebase origin/develop

# 2. Run all tests
npm run test
npm run build
npx playwright test

# 3. Run linters
npm run lint
npm run type-check

# 4. Update documentation
# Edit CHANGELOG.md, README.md, etc.

# 5. Push final changes
git push origin feat/your-feature-name --force-with-lease
```

### 4. Creating Pull Request

**Required Information:**
- Clear title (following conventional commits)
- Description of changes
- Link to issue/ticket
- Screenshots/GIFs (for UI changes)
- Test coverage report
- Breaking changes (if any)
- Migration steps (if any)

**Template:**
```markdown
## Description
Brief description of what this PR does.

## Related Issues
Closes #123
Related to #456

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Build succeeds

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

### 5. Code Review Process

#### For Reviewers
- Review within 24 hours
- Check code quality, not just functionality
- Test locally if possible
- Provide constructive feedback
- Approve only if ready for production

#### For Authors
- Respond to feedback within 24 hours
- Make requested changes
- Re-request review after changes
- Squash commits before merge (optional)

### 6. Merging

```bash
# Option A: Merge via GitHub/GitLab UI (Recommended)
# - Use "Squash and Merge" for clean history
# - Delete branch after merge

# Option B: Command Line Merge
git checkout develop
git merge --no-ff feat/your-feature-name
git push origin develop
git branch -d feat/your-feature-name
git push origin --delete feat/your-feature-name
```

---

## Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

### Examples

#### Good Commits
```
feat(takeoff): Add PDF measurement tools with Fabric.js

Implements linear, area, and count measurement tools for digital
takeoff from PDF drawings. Includes scale calibration and real-time
display of measurements.

Closes #42
```

```
fix(auth): Resolve NextAuth session timeout on mobile

Mobile users were experiencing premature session expiration.
Updated session maxAge from 1h to 24h and added keep-alive ping.

Fixes #38
```

#### Bad Commits
```
fix stuff
update files
wip
asdf
minor changes
```

---

## Conflict Prevention Strategies

### 1. **Frequent Rebasing**
```bash
# Rebase from develop every 2-3 days
git fetch origin
git rebase origin/develop
```

**Benefits:**
- Catches conflicts early (when they're small)
- Keeps feature branch up to date
- Makes final merge cleaner

### 2. **Small, Focused Branches**
- One feature per branch
- 50-300 lines of changes ideal
- Merge within 3-7 days

### 3. **Communication**
- Announce major changes in Slack/Discord
- Use draft PRs for work-in-progress
- Tag team members on potential conflicts

### 4. **File Ownership**
Create a `CODEOWNERS` file:
```
# CODEOWNERS
/app/takeoff/*          @takeoff-team
/app/auth/*             @auth-team
/prisma/*               @database-team
/docs/*                 @docs-team
*.md                    @docs-team
```

### 5. **Protected Files**
Mark certain files as requiring extra review:
- `package.json` - Dependency changes
- `prisma/schema.prisma` - Database schema
- `.env.example` - Environment variables
- `tsconfig.json` - TypeScript configuration

---

## CI/CD Integration

### Required Status Checks

#### For `develop` branch:
- ✅ TypeScript compilation (`npm run type-check`)
- ✅ ESLint (`npm run lint`)
- ✅ Unit tests (`npm run test`)
- ✅ Build success (`npm run build`)
- ✅ E2E tests (`npx playwright test`)

#### For `master` branch:
- ✅ All checks from `develop`
- ✅ Performance budget (Lighthouse >90)
- ✅ Security scan (`npm audit`)
- ✅ Manual QA approval

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [develop, master]
  push:
    branches: [develop, master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - run: npx playwright test

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: echo "Deploy to staging"

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/master'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: echo "Deploy to production"
```

---

## Emergency Procedures

### Hotfix Process (Production Bug)

```bash
# 1. Create hotfix branch from master
git checkout master
git pull origin master
git checkout -b hotfix/critical-bug-name

# 2. Fix the bug
# Make minimal changes
git commit -m "fix: Critical bug description"

# 3. Test thoroughly
npm run test
npm run build

# 4. Create PR to master
# Tag as "HOTFIX" and "URGENT"
# Get immediate review

# 5. After merge to master, backport to develop
git checkout develop
git pull origin develop
git cherry-pick <hotfix-commit-hash>
git push origin develop

# 6. Delete hotfix branch
git branch -d hotfix/critical-bug-name
```

### Rollback Process

```bash
# Option A: Revert the merge commit
git checkout master
git revert -m 1 HEAD
git push origin master

# Option B: Reset to previous tag
git checkout master
git reset --hard v2.0.0
git push origin master --force  # ⚠️ Requires team coordination

# Option C: Deploy previous version
# (If using deployment tags/releases)
```

---

## Branch Protection Settings (GitHub)

### Master Branch Settings
```json
{
  "required_pull_request_reviews": {
    "required_approving_review_count": 2,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "ci/test",
      "ci/build",
      "ci/lint",
      "ci/e2e"
    ]
  },
  "enforce_admins": true,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_signatures": true
}
```

### Develop Branch Settings
```json
{
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "required_status_checks": {
    "strict": false,
    "contexts": [
      "ci/test",
      "ci/build",
      "ci/lint"
    ]
  },
  "enforce_admins": false,
  "allow_force_pushes": true,
  "allow_deletions": false
}
```

---

## Best Practices

### DO ✅
- Branch from `develop`, merge to `develop`
- Use descriptive branch names
- Commit frequently with clear messages
- Rebase regularly from `develop`
- Write tests for new features
- Update documentation
- Request review when ready
- Delete branches after merge

### DON'T ❌
- Branch from `master` directly
- Use generic branch names (`test`, `fix`, `update`)
- Make huge commits (1000+ lines)
- Let branches get stale (>2 weeks)
- Skip tests
- Force push to protected branches
- Merge without review
- Keep old branches indefinitely

---

## Conflict Resolution Tips

### When Conflicts Occur

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Rebase (preferred) or merge
git rebase origin/develop
# OR
git merge origin/develop

# 3. Resolve conflicts in your editor
# Look for markers: <<<<<<<, =======, >>>>>>>

# 4. Stage resolved files
git add <resolved-file>

# 5. Continue rebase/merge
git rebase --continue
# OR
git commit

# 6. Push changes
git push origin your-branch --force-with-lease
```

### Common Conflict Scenarios

#### Scenario 1: `package.json` conflicts
```bash
# Always keep both sets of dependencies
# Merge them manually and run npm install
npm install
git add package.json package-lock.json
git rebase --continue
```

#### Scenario 2: Same file, different sections
```bash
# Usually auto-resolved
# If not, use "both changes" strategy
git checkout --ours <file>    # Keep your changes
git checkout --theirs <file>  # Keep their changes
# Or manually merge in editor
```

#### Scenario 3: File moved/renamed
```bash
# Git usually handles this, but verify paths
# Check imports/references in other files
```

---

## Tools & Resources

### Helpful Git Aliases

Add to `~/.gitconfig`:
```ini
[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --oneline --graph --decorate --all
    undo = reset HEAD~1 --mixed
    amend = commit --amend --no-edit
```

### Git GUI Tools
- **GitKraken** - Visual git client
- **GitHub Desktop** - Simple GitHub integration
- **SourceTree** - Free git GUI
- **VS Code** - Built-in git support

### Command Reference

```bash
# View branch relationships
git show-branch

# Check what will be merged
git diff develop...feat/your-branch

# Find who changed a line
git blame <file>

# Search commit history
git log --grep="keyword"

# Interactive rebase (clean up commits)
git rebase -i HEAD~5

# Stash changes temporarily
git stash
git stash pop

# Cherry-pick specific commits
git cherry-pick <commit-hash>
```

---

## Metrics & Monitoring

### Track These Metrics
- Average PR size (lines changed)
- PR merge time (creation to merge)
- Number of merge conflicts per week
- Build success rate
- Test coverage percentage
- Time to resolve conflicts

### Goals
- PR size: <300 lines (80% of PRs)
- PR merge time: <2 days (90% of PRs)
- Merge conflicts: <5 per week
- Build success: >95%
- Test coverage: >80%
- Conflict resolution: <30 minutes

---

## Team Agreements

### Code Review Standards
- **Response Time:** Within 24 hours
- **Review Depth:** Read all code, not just diff
- **Testing:** Pull and test locally for major changes
- **Tone:** Constructive and respectful
- **Approval:** Only approve if you'd deploy to production

### Communication Channels
- **Slack/Discord:** Daily updates, quick questions
- **GitHub Issues:** Feature requests, bug reports
- **Pull Requests:** Code-specific discussions
- **Weekly Meetings:** Planning, retrospectives

### Working Hours
- **Core Hours:** 10am-4pm (overlap for all team members)
- **Async Work:** Encouraged outside core hours
- **Response Time:** Within 24 hours for PR reviews

---

## Appendix

### Git Rerere (Reuse Recorded Resolution)

Enable `rerere` to remember conflict resolutions:
```bash
git config --global rerere.enabled true
```

When you resolve a conflict, git will remember and automatically apply the same resolution in the future.

### GitHub Branch Protection API

Automate branch protection with GitHub API:
```bash
curl -X PUT \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/branches/master/protection \
  -d '{"required_pull_request_reviews":{"required_approving_review_count":2}}'
```

### Semantic Versioning

Follow semver for releases:
- **MAJOR:** Breaking changes (v2.0.0 → v3.0.0)
- **MINOR:** New features (v2.0.0 → v2.1.0)
- **PATCH:** Bug fixes (v2.0.0 → v2.0.1)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-23 | Claude Code | Initial workflow documentation |

---

**Next Steps:** Implement branch protection rules in GitHub repository settings.

**Owner:** Development Team Lead
**Reviewers:** All team members
**Approvers:** CTO

---

*This document is a living guide and should be updated as the team's workflow evolves.*
