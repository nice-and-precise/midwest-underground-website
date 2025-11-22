# Task Completion Checklist

## After Completing Any Task

### 1. Build Verification
```bash
npm run build
```
- Must complete successfully with 0 errors
- Check for TypeScript errors
- Verify all routes compile

### 2. Code Quality
```bash
npm run lint
```
- Fix any linting errors
- Ensure code follows conventions

### 3. Manual Testing
- Test the feature you just built
- Verify in browser at http://localhost:3000
- Test error cases
- Check responsive design (mobile, tablet, desktop)

### 4. Database Verification (if applicable)
```bash
npm run db:studio
```
- Check data was created/updated correctly
- Verify relationships are correct
- Ensure no orphaned records

### 5. Documentation
- Update AGENT_COORDINATION.md with progress
- Document any new patterns or decisions
- Note any blockers or issues

### 6. Git (Optional, but recommended)
```bash
git add .
git commit -m "feat: descriptive commit message"
```

## Before Calling Task Complete

- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Feature tested in browser
- [ ] No console errors
- [ ] Database state verified (if applicable)
- [ ] Documentation updated
- [ ] Tests written (if applicable)

## Red Flags (Must Fix)
- ❌ TypeScript errors in build
- ❌ Runtime errors in console
- ❌ Database queries failing
- ❌ Authentication broken
- ❌ Pages returning 404/500
- ❌ Unhandled promise rejections
