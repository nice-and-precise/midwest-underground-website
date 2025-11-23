# Repository Index Files

## Location
`C:\Users\Owner\Desktop\midwest-underground-website\`

## Files
- **PROJECT_INDEX.md** (1.7KB) - Human-readable markdown
- **PROJECT_INDEX.json** (2.1KB) - Machine-readable JSON

## Purpose
Quick project context loading with 92.2% token reduction

## Usage
```bash
# Read index for context
cat PROJECT_INDEX.md

# Parse JSON for tooling
cat PROJECT_INDEX.json | jq .
```

## Token Efficiency
- Before: 58,000 tokens (full codebase)
- After: 4,500 tokens (index only)
- Savings: 53,500 tokens per session

## When to Use
- Project onboarding
- Context loading at session start
- Quick reference for structure
- Tool integration via JSON

**Last Updated**: 2025-11-23
