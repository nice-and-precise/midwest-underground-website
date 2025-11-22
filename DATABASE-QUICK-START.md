# Database Quick Start Guide

## Test User Credentials

All passwords: `password123`

| Email | Role | Name |
|-------|------|------|
| owner@midwestunderground.com | OWNER | Mike Anderson |
| super@midwestunderground.com | SUPER | Tom Jenkins |
| supervisor@midwestunderground.com | SUPER | Sarah Miller |
| crew@midwestunderground.com | CREW | Dave Johnson |
| operator@midwestunderground.com | CREW | Rick Thompson |
| locator@midwestunderground.com | CREW | James Rodriguez |

## Useful Commands

```bash
# View database in browser
npm run db:studio

# Seed database with test data
npm run db:seed

# Reset database and reseed
npm run db:reset

# Generate Prisma Client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Start development server
npm run dev
```

## Database Contents

- **Users:** 6 (1 owner, 2 supervisors, 3 crew)
- **Projects:** 7 HDD projects
- **Bores:** 6 bore paths
- **Rod Passes:** 20 detailed logging entries
- **Daily Reports:** 4 field reports
- **811 Tickets:** 4 utility locate tickets
- **Inspections:** 4 QA/QC inspections
- **And more...** (66 total records)

## Quick Links

- Full Documentation: `DATABASE-SETUP-REPORT.md`
- Schema: `prisma/schema.prisma`
- Seed Script: `prisma/seed.ts`

## Next Steps

1. Start dev server: `npm run dev`
2. Open Prisma Studio: `npm run db:studio`
3. Test login at: http://localhost:3000/auth/login
4. Connect API routes to database (see report for examples)
