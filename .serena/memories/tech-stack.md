# Tech Stack

## Core Framework
- **Next.js:** 15.0.3 (App Router, React Server Components)
- **React:** 18.3.1
- **TypeScript:** 5.x (strict mode)
- **Node.js:** 18+ required

## Database & ORM
- **Prisma:** 6.0.1 (ORM)
- **Database (Dev):** SQLite (file:./prisma/dev.db)
- **Database (Prod):** PostgreSQL (not yet configured)
- **Schema:** 17 models covering HDD operations

## Authentication
- **NextAuth.js:** 5.0.0-beta.29 (Credentials provider)
- **Password Hashing:** bcryptjs 2.4.3
- **Session:** JWT-based
- **Roles:** OWNER, SUPER, CREW

## UI & Styling
- **Tailwind CSS:** 3.4.1
- **Radix UI:** Component library (dialog, dropdown, tabs, toast, etc.)
- **Lucide React:** 0.460.0 (icons)
- **Chart.js:** 4.4.7 + react-chartjs-2 (charts/graphs)
- **Leaflet:** 1.9.4 (maps)
- **Dark Mode:** System preference + manual toggle

## Validation & Utilities
- **Zod:** 3.25.76 (schema validation)
- **clsx:** 2.1.1 (conditional classes)
- **tailwind-merge:** 2.5.4 (class merging)
- **class-variance-authority:** 0.7.1 (component variants)

## Development Tools
- **ESLint:** 9.x
- **PostCSS:** 8.x
- **Sharp:** 0.34.4 (image optimization)
- **ts-node:** 10.9.2 (TypeScript execution)

## File Structure
- Next.js App Router (`src/app/`)
- API routes (`src/app/api/`)
- Components (`src/components/`)
- Utilities (`src/lib/`)
- Prisma schema (`prisma/schema.prisma`)
