# Code Style & Conventions

## TypeScript Configuration
- **Strict Mode:** Enabled
- **Path Aliases:** 
  - `@/components` → `src/components`
  - `@/lib` → `src/lib`
  - `@/app` → `src/app`
- **Target:** ES2017
- **Module:** ESNext
- **JSX:** preserve (for React)

## File Naming
- **Components:** PascalCase (e.g., `DarkModeToggle.tsx`, `LoginForm.tsx`)
- **Pages:** kebab-case (e.g., `bore-logs/`, `field-reports/`)
- **Utilities:** camelCase (e.g., `offlineSync.ts`, `kpiService.ts`)
- **Types:** PascalCase (e.g., `next-auth.d.ts`)
- **Config:** kebab-case (e.g., `next.config.js`, `tailwind.config.js`)

## Code Patterns

### Next.js 15 Conventions
```typescript
// Dynamic route params MUST be awaited
export async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}

// API routes
export async function GET(request: NextRequest) {
  // Handle GET requests
}

export async function POST(request: NextRequest) {
  // Handle POST requests
}
```

### Prisma Usage
```typescript
import { prisma } from '@/lib/prisma';

// Always use the singleton client
const users = await prisma.user.findMany();
```

### Error Handling
```typescript
try {
  // Database operation
} catch (error) {
  console.error('Descriptive error message:', error);
  return Response.json(
    { error: 'User-friendly message' },
    { status: 500 }
  );
}
```

### Component Structure
```typescript
'use client'; // Only when needed (interactivity, hooks)

import { useState } from 'react';

export default function ComponentName() {
  const [state, setState] = useState();
  
  return (
    <div className="tailwind-classes">
      {/* Content */}
    </div>
  );
}
```

## Styling
- **Primary:** Tailwind utility classes
- **Custom CSS:** Minimize, prefer Tailwind
- **Dark Mode:** Use CSS variables (`var(--color-primary)`)
- **Responsive:** Mobile-first approach

## Validation
- **Use Zod** for all form/API input validation
- Define schemas in `src/lib/validations.ts`
- Validate before database operations

## Database
- **Never** use raw SQL
- Always use Prisma Client
- Include relations when needed
- Handle errors gracefully

## Comments
- **Minimal:** Code should be self-documenting
- **When needed:** Complex business logic, non-obvious decisions
- **JSDoc:** For public APIs and complex functions

## Imports
- Group and order:
  1. React/Next.js
  2. Third-party libraries
  3. Local utilities
  4. Components
  5. Types

```typescript
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import type { User } from '@prisma/client';
```
