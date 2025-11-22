# Suggested Commands

## Development
```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Database Management
```bash
# View database in browser GUI (http://localhost:5555)
npm run db:studio

# Generate Prisma Client (after schema changes)
npm run db:generate

# Push schema changes to database (no migrations)
npm run db:push

# Seed database with test data
npm run db:seed

# Reset database and reseed (⚠️ destroys all data)
npm run db:reset
```

## Git (Windows)
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "message"

# Push to remote
git push origin feat/nextjs-migration

# Pull latest changes
git pull origin feat/nextjs-migration

# View diff
git diff

# View log
git log --oneline -10
```

## System Utilities (Windows)
```bash
# List directory contents
dir
ls  # if using Git Bash

# Change directory
cd path\to\directory

# Find files
dir /s /b *.tsx

# Search in files (Git Bash)
grep -r "search term" src/

# View file content
type filename.txt
cat filename.txt  # Git Bash

# Clear console
cls
clear  # Git Bash
```

## Testing (When Available)
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Quick Checks
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Verify Prisma installation
npx prisma --version

# Check TypeScript
npx tsc --version
```
