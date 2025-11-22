# Advanced Features Documentation

## Overview
This document covers the advanced features implemented in Wave 4 of the Midwest Underground Website project, including KPI tracking, photo management, and offline synchronization.

## Table of Contents
1. [KPI System](#kpi-system)
2. [Photo Management](#photo-management)
3. [Offline Sync System](#offline-sync-system)
4. [API Reference](#api-reference)
5. [Component Reference](#component-reference)

---

## KPI System

### Description
Comprehensive Key Performance Indicators tracking for HDD operations, providing real-time metrics at company, project, and crew levels.

### KPI Categories

#### Company-Wide KPIs (Overview)
- **Active Projects**: Number of projects in IN_PROGRESS status
- **Bores in Progress**: Number of bores currently being drilled
- **Average Bore Completion Rate**: Linear feet per day across all active bores
- **811 Compliance Rate**: Percentage of projects with active 811 tickets
- **Inspection Pass Rate**: Percentage of inspections passed without corrective actions
- **Rod Logging Efficiency**: Percentage of rod passes logged vs expected (based on bore length)
- **Daily Report Completion Rate**: Percentage of reports submitted by 8pm deadline
- **Equipment Utilization Rate**: Percentage of equipment hours used (placeholder for future enhancement)
- **Total Linear Feet**: Sum of all linear feet drilled in last 30 days
- **Average Project Profitability**: Revenue vs cost percentage (placeholder)

#### Project-Specific KPIs
- **Feet Per Crew Hour**: Production efficiency metric
- **Cost Per Linear Foot**: Total costs divided by total linear feet
- **Budget Per Linear Foot**: Project budget divided by target footage
- **Bores Per Day**: Average number of bores worked per day
- **Compliance Rate**: 811 ticket compliance percentage
- **On-Time Reports**: Percentage of daily reports submitted on time
- **RFI Cycle Time**: Average days from RFI submission to response

#### Crew Performance KPIs
- **Total Hours**: Hours worked in period
- **Total Linear Feet**: Production output
- **Average Feet Per Hour**: Efficiency metric
- **Projects Worked**: Number of distinct projects
- **Reports Submitted**: Number of daily reports created
- **On-Time Report Rate**: Percentage of timely submissions
- **Safety Incidents**: Count of safety incidents (placeholder)

### API Endpoints

```typescript
// Get company-wide overview (OWNER/SUPER only)
GET /api/kpis/overview
Response: {
  success: true,
  kpis: OverviewKPIs,
  period: string
}

// Get project-specific KPIs
GET /api/kpis/project/[id]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: {
  success: true,
  projectId: string,
  kpis: ProjectKPIs,
  period: string
}

// Get crew member KPIs
GET /api/kpis/crew/[id]?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: {
  success: true,
  crewMemberId: string,
  kpis: CrewKPIs,
  period: string
}
```

### Implementation Files
- `src/lib/services/kpiService.ts` - KPI calculation logic
- `src/app/api/kpis/overview/route.ts` - Company-wide KPI endpoint
- `src/app/api/kpis/project/[id]/route.ts` - Project KPI endpoint
- `src/app/api/kpis/crew/[id]/route.ts` - Crew KPI endpoint
- `src/components/dashboard/AdvancedKPICards.tsx` - Dashboard display component

### Usage Example

```typescript
// In a React component
const fetchProjectKPIs = async (projectId: string) => {
  const response = await fetch(`/api/kpis/project/${projectId}`)
  const data = await response.json()
  return data.kpis
}
```

---

## Photo Management

### Description
Full-featured photo upload and management system for bore logs, inspections, and daily reports.

### Features
- Multi-file drag-and-drop upload
- Image type validation (JPEG, PNG, WebP)
- File size validation (max 5MB per file)
- Thumbnail generation (placeholder - same as original in dev)
- Photo gallery with lightbox viewer
- Photo deletion with authorization
- EXIF metadata extraction (placeholder)

### Database Schema

```prisma
model Photo {
  id            String       @id @default(cuid())
  filename      String
  url           String
  thumbnailUrl  String?
  size          Int
  mimeType      String
  boreId        String?
  inspectionId  String?
  dailyReportId String?
  uploadedById  String
  createdAt     DateTime     @default(now())

  bore          Bore?        @relation(...)
  inspection    Inspection?  @relation(...)
  dailyReport   DailyReport? @relation(...)
  uploadedBy    User         @relation(...)
}
```

### API Endpoints

```typescript
// Upload photos
POST /api/photos/upload
Body: FormData {
  files: File[],
  boreId?: string,
  inspectionId?: string,
  dailyReportId?: string
}
Response: {
  success: true,
  photos: Photo[],
  count: number
}

// Get photos for a bore
GET /api/photos/bore/[id]
Response: {
  photos: Photo[],
  count: number
}

// Get photos for an inspection
GET /api/photos/inspection/[id]
Response: {
  photos: Photo[],
  count: number
}

// Delete a photo
DELETE /api/photos/[id]
Response: {
  success: true,
  message: string
}
```

### Storage Configuration

**Development:** Local filesystem at `public/uploads/photos/`
**Production:** Configurable via `src/lib/photo-storage.ts`

To switch to cloud storage (e.g., AWS S3), update the `savePhoto` and `deletePhoto` functions in `photo-storage.ts`.

### Components

#### PhotoUploader
```tsx
import PhotoUploader from '@/components/photos/PhotoUploader'

<PhotoUploader
  boreId="bore-123"
  onUploadComplete={(photos) => console.log(photos)}
  maxFiles={10}
/>
```

#### PhotoGallery
```tsx
import PhotoGallery from '@/components/photos/PhotoGallery'

<PhotoGallery
  photos={photoArray}
  onDelete={(photoId) => handleDelete(photoId)}
  canDelete={true}
/>
```

### Implementation Files
- `src/lib/photo-storage.ts` - Storage abstraction layer
- `src/app/api/photos/upload/route.ts` - Upload endpoint
- `src/app/api/photos/bore/[id]/route.ts` - Bore photos endpoint
- `src/app/api/photos/inspection/[id]/route.ts` - Inspection photos endpoint
- `src/app/api/photos/[id]/route.ts` - Delete endpoint
- `src/components/photos/PhotoUploader.tsx` - Upload UI
- `src/components/photos/PhotoGallery.tsx` - Gallery UI with lightbox

---

## Offline Sync System

### Description
IndexedDB-based offline storage with automatic synchronization when connection is restored.

### Features
- Auto-save every 30 seconds
- Queue pending API requests
- Automatic sync when online
- Periodic sync every 5 minutes
- Visual sync indicator
- Conflict resolution (last-write-wins)

### Storage Stores
- `dailyReports` - Daily report drafts
- `rodPasses` - Rod pass data
- `photos` - Photo metadata (files saved separately)
- `syncQueue` - Pending API requests

### API Functions

```typescript
import {
  initOfflineDB,
  saveOffline,
  getOffline,
  queueForSync,
  processQueue,
  getPendingCount
} from '@/lib/offlineSync'

// Initialize database
await initOfflineDB()

// Save data offline
await saveOffline('dailyReports', { id: '123', data: {...} })

// Retrieve offline data
const data = await getOffline('dailyReports', '123')

// Queue an API request for sync
await queueForSync('POST', '/api/hdd/daily-reports', reportData)

// Process sync queue
const result = await processQueue()
// { success: 5, failed: 0 }

// Get pending count
const pending = await getPendingCount()
```

### Integration Example

```typescript
'use client'

import { useEffect } from 'react'
import { saveOffline, queueForSync } from '@/lib/offlineSync'

export default function MyForm() {
  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      await saveOffline('myStore', formData)
    }, 30000)
    return () => clearInterval(interval)
  }, [formData])

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify(formData)
      })

      if (!response.ok && !navigator.onLine) {
        // Queue for later sync
        await queueForSync('POST', '/api/endpoint', formData)
      }
    } catch (error) {
      // Network error - queue for sync
      await queueForSync('POST', '/api/endpoint', formData)
    }
  }
}
```

### Implementation Files
- `src/lib/offlineSync.ts` - Core offline sync logic
- `src/components/hdd/OfflineSyncIndicator.tsx` - Sync status indicator
- `src/app/dashboard/hdd/rod-logger/page.tsx` - Rod logger with offline support
- `src/app/dashboard/hdd/daily-report/page.tsx` - Daily report with offline support

### Event Handlers
The offline sync system automatically:
- Listens for `online` event to trigger sync
- Runs periodic sync every 5 minutes when online
- Retries failed requests up to 3 times

---

## API Reference

### Authentication
All endpoints require authentication via NextAuth.js session.

### Role-Based Access
- **OWNER/SUPER**: Access to all endpoints including company-wide KPIs
- **CREW**: Access to own data and assigned projects

### Error Responses
```json
// Unauthorized
{ "error": "Unauthorized", status: 401 }

// Forbidden
{ "error": "Forbidden", status: 403 }

// Bad Request
{ "error": "Error message", status: 400 }

// Server Error
{ "error": "Failed to ...", status: 500 }
```

---

## Component Reference

### AdvancedKPICards
Client-side component that fetches and displays company-wide KPIs.

**Props:** None (uses internal API fetch)

**Features:**
- Loading skeleton
- Color-coded metrics (green = good, red = bad)
- Trend indicators
- Alert icons for compliance issues
- Responsive grid layout

### PhotoUploader
Drag-and-drop photo upload component.

**Props:**
- `boreId?: string` - Associate with bore
- `inspectionId?: string` - Associate with inspection
- `dailyReportId?: string` - Associate with daily report
- `onUploadComplete?: (photos) => void` - Callback after upload
- `maxFiles?: number` - Maximum files allowed (default: 10)

### PhotoGallery
Grid-based photo gallery with lightbox viewer.

**Props:**
- `photos: Photo[]` - Array of photo objects
- `onDelete?: (photoId) => void` - Delete callback
- `canDelete?: boolean` - Show delete button (default: false)

**Features:**
- Grid layout (responsive)
- Hover overlay with actions
- Keyboard navigation in lightbox
- Photo download
- Photo deletion with confirmation

---

## Testing

### Manual Testing Checklist

**KPI System:**
- [ ] Company overview loads for OWNER/SUPER
- [ ] Project KPIs calculate correctly
- [ ] Crew KPIs filter by date range
- [ ] Trend indicators show correct direction
- [ ] Alert icons appear for low compliance

**Photo Management:**
- [ ] Drag-and-drop upload works
- [ ] Multiple files upload successfully
- [ ] File type validation rejects non-images
- [ ] File size validation rejects large files
- [ ] Gallery displays photos correctly
- [ ] Lightbox navigation works
- [ ] Photo deletion requires confirmation
- [ ] Photos associate with correct entities

**Offline Sync:**
- [ ] Auto-save triggers every 30 seconds
- [ ] Data persists in IndexedDB
- [ ] Queue stores failed requests
- [ ] Sync processes when back online
- [ ] Sync indicator shows correct status
- [ ] Pending count updates correctly

### Build Verification
```bash
npm run build  # Must pass with no errors
```

---

## Future Enhancements

### KPI System
1. Custom date range selection
2. Export to CSV/PDF
3. Chart visualizations
4. Email reports
5. Threshold alerts

### Photo Management
1. Actual thumbnail generation with Sharp
2. Real EXIF extraction
3. Image compression before upload
4. GPS tagging on photos
5. Cloud storage integration (S3, Azure Blob)
6. Batch operations

### Offline Sync
1. Service Worker for true offline-first
2. Conflict resolution UI
3. Selective sync
4. Background sync API
5. Storage quota management

---

## Support

For issues or questions:
1. Check build logs: `npm run build`
2. Review Prisma schema: `prisma/schema.prisma`
3. Check API responses in browser DevTools
4. Review IndexedDB in Application tab

## Contributors
- Agent 8: Advanced Features Implementation (Wave 4)
