# Route Groups Architecture

<!-- Last Updated: 2025-11-23 -->
<!-- Version: 1.0.0 -->

## Overview

This document explains the route groups pattern implemented in the Midwest Underground website to separate marketing pages from the dashboard application, providing different layouts and navigation for each section.

## Problem Solved

**Previous Issue:**
- The root layout contained header/footer that appeared on ALL pages including dashboard
- Dashboard needed its own sidebar navigation separate from marketing pages
- Conditional rendering in root layout caused JSX syntax errors and cache issues
- Marketing pages and dashboard pages needed completely different UI structures

**Solution:**
- Implemented Next.js route groups to separate layouts
- Created (marketing) route group for public-facing pages with header/footer
- Dashboard pages have their own layout with sidebar navigation
- Root layout remains minimal, only providing HTML/body wrapper

## File Structure

```
src/app/
├── layout.tsx                          # Root layout (minimal)
├── (marketing)/                        # Marketing route group
│   ├── layout.tsx                      # Marketing layout with header/footer
│   ├── page.tsx                        # Home page
│   ├── about/
│   ├── services/
│   ├── contact/
│   └── projects/
├── dashboard/                          # Dashboard (no parentheses = shows in URL)
│   ├── layout.tsx                      # Dashboard layout with sidebar
│   ├── page.tsx                        # Dashboard home
│   ├── projects/
│   ├── bore-logs/
│   ├── field-reports/
│   ├── equipment/
│   ├── photos/
│   ├── customers/
│   ├── financials/
│   ├── inspections/
│   ├── reports/
│   └── 811-tickets/
├── auth/                               # Auth pages (separate from both)
│   ├── login/
│   └── error/
└── api/                                # API routes (unaffected by route groups)
```

## Route Groups Explained

### What are Route Groups?

Route groups are folders wrapped in parentheses like `(marketing)` that:
- **Do NOT appear in the URL path** - `/` not `/(marketing)`
- Allow you to organize routes without affecting the URL structure
- Enable different layouts for different sections of your app
- Are the recommended Next.js pattern for multiple layouts

### URL Examples

| File Path | URL Path | Layout Used |
|-----------|----------|-------------|
| `src/app/(marketing)/page.tsx` | `/` | Marketing layout |
| `src/app/(marketing)/about/page.tsx` | `/about` | Marketing layout |
| `src/app/dashboard/page.tsx` | `/dashboard` | Dashboard layout |
| `src/app/dashboard/projects/page.tsx` | `/dashboard/projects` | Dashboard layout |

## Layout Hierarchy

### 1. Root Layout (`src/app/layout.tsx`)

**Purpose:** Minimal wrapper providing only HTML/body tags and font configuration

**Contents:**
- HTML lang attribute
- Font configuration (Oswald for headings, Inter for body)
- Global CSS import
- No header, footer, or navigation

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable} no-transition`}>
      <body>{children}</body>
    </html>
  )
}
```

### 2. Marketing Layout (`src/app/(marketing)/layout.tsx`)

**Purpose:** Provides header and footer for public-facing pages

**Contents:**
- Site header with logo and navigation
- Desktop navigation with links (Home, Dashboard, Login)
- Phone number CTA
- Dark mode toggle
- User menu (when logged in)
- Mobile menu component
- Full footer with company info, contact, quick links
- Main content wrapper

**Pages Using This Layout:**
- Home (`/`)
- About (`/about`)
- Services (`/services`)
- Contact (`/contact`)
- Projects (`/projects`)

### 3. Dashboard Layout (`src/app/dashboard/layout.tsx`)

**Purpose:** Provides sidebar navigation for dashboard pages

**Contents:**
- Authentication check (redirects to login if not authenticated)
- Flex container with sidebar and main content area
- DashboardSidebar component (fixed on desktop, hidden on mobile)
- Main content area with scroll and padding
- Dark mode support via Tailwind classes

**Pages Using This Layout:**
- All pages under `/dashboard/*`

**Layout Structure:**
```typescript
<div className="flex h-screen overflow-hidden">
  {/* Sidebar - Fixed on desktop, hidden on mobile */}
  <div className="hidden md:flex md:w-64 md:flex-col">
    <DashboardSidebar user={session.user} />
  </div>

  {/* Main content area */}
  <div className="flex flex-1 flex-col overflow-hidden">
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
      {children}
    </main>
  </div>
</div>
```

## Dashboard Sidebar Component

**Location:** `src/components/dashboard/DashboardSidebar.tsx`

**Features:**
- Logo/brand section linking to dashboard home
- User info display with avatar, name, and role
- 12 navigation items with icons:
  1. Dashboard
  2. Projects
  3. Bore Logs
  4. Field Reports
  5. Takeoff & Estimating (external link to HTML tool)
  6. 811 Tickets
  7. Equipment
  8. Photos
  9. Customers
  10. Financials
  11. Inspections
  12. Reports
- Active link highlighting using `usePathname()`
- Sign out button at bottom
- Responsive (hidden on mobile, shown on desktop)

**TypeScript Interface:**
```typescript
interface DashboardSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}
```

## Adding New Pages

### To Add a Marketing Page

1. Create page in `src/app/(marketing)/new-page/page.tsx`
2. URL will be `/new-page`
3. Automatically gets header and footer from marketing layout
4. No additional configuration needed

### To Add a Dashboard Page

1. Create page in `src/app/dashboard/new-feature/page.tsx`
2. URL will be `/dashboard/new-feature`
3. Automatically gets sidebar from dashboard layout
4. Add navigation item to `DashboardSidebar.tsx` if needed:

```typescript
const navigationItems = [
  // ... existing items
  {
    name: 'New Feature',
    href: '/dashboard/new-feature',
    icon: YourIcon, // Import from lucide-react
  },
]
```

## Authentication Flow

**Marketing Pages:**
- No authentication required
- Can view when logged in or logged out
- Show user menu when authenticated

**Dashboard Pages:**
- Authentication required via middleware (`src/middleware.ts`)
- Layout checks for session and redirects to login if not authenticated
- All dashboard routes protected automatically

## Responsive Behavior

### Marketing Layout
- Full responsive header with mobile menu
- Hamburger menu on mobile
- Full navigation on desktop

### Dashboard Layout
- Sidebar hidden on mobile (`hidden md:flex`)
- Sidebar shows on desktop (`md:flex`)
- Main content area always visible
- Full screen height with scroll

**Note:** Mobile navigation for dashboard is not yet implemented. The sidebar is simply hidden on mobile devices. Future enhancement should add a mobile menu for dashboard pages.

## Technical Details

### Why This Pattern?

**Next.js Recommendation:**
- Route groups are the official Next.js pattern for multiple layouts
- Cleaner than conditional rendering in root layout
- Better performance (layouts are cached separately)
- Easier to maintain and understand

**Benefits Over Conditional Rendering:**
- No JSX syntax errors from complex conditionals
- No pathname detection needed in root layout
- Cleaner separation of concerns
- Each layout can have its own state and logic
- Better TypeScript support

### Performance Considerations

- Each layout is rendered only once and cached
- Child pages inherit layout without re-rendering it
- Server components by default (except sidebar which uses client-side routing)
- No unnecessary re-renders when navigating within same section

## Migration Notes

**Files Modified:**
1. `src/app/layout.tsx` - Simplified to minimal root layout
2. `src/app/(marketing)/layout.tsx` - Created with header/footer
3. `src/app/page.tsx` - Moved to `src/app/(marketing)/page.tsx`
4. `src/app/dashboard/layout.tsx` - Updated with sidebar
5. `src/components/dashboard/DashboardSidebar.tsx` - Completely rewritten

**Breaking Changes:**
- None - all URLs remain the same
- Home page still at `/`
- Dashboard still at `/dashboard`
- Route structure unchanged from user perspective

## Troubleshooting

### Sidebar Not Showing

**Check:**
1. Is the dev server running?
2. Navigate to `/dashboard` (not just `/`)
3. Are you logged in? (sidebar only shows for authenticated users)
4. Check browser console for errors
5. Clear Next.js cache: `rm -rf .next` and restart

### Marketing Header Showing on Dashboard

**Check:**
1. Verify you're in `/dashboard/*` not `/`
2. Check that dashboard layout exists at `src/app/dashboard/layout.tsx`
3. Clear Next.js cache and rebuild

### Routes Not Working

**Check:**
1. Route group folders have parentheses: `(marketing)` not `marketing`
2. Page files are named `page.tsx`
3. Layouts are named `layout.tsx`
4. No duplicate layouts in the same route hierarchy

## Future Enhancements

1. **Mobile Dashboard Navigation**
   - Add hamburger menu for dashboard on mobile
   - Toggle sidebar visibility
   - Maintain active state

2. **Additional Route Groups**
   - `(admin)` for admin-only pages with different layout
   - `(public-api)` for public API documentation

3. **Nested Layouts**
   - Sub-layouts within dashboard sections
   - Shared UI for related pages

4. **Layout Transitions**
   - Smooth transitions between layouts
   - Loading states during layout switches

## References

- [Next.js Route Groups Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Next.js Layouts and Templates](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [Lucide React Icons](https://lucide.dev/icons/)

---

**Last Updated:** 2025-11-23
**Maintained by:** @nice-and-precise
