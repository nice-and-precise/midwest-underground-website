<!-- TOC -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [System Overview](#system-overview)
  - [Architecture Philosophy](#architecture-philosophy)
  - [Three Coexisting Systems](#three-coexisting-systems)
- [Technology Stack](#technology-stack)
  - [Core Libraries](#core-libraries)
  - [Why These Libraries?](#why-these-libraries)
  - [No Backend Requirements](#no-backend-requirements)
- [File Structure](#file-structure)
  - [New Files Created by Takeoff System](#new-files-created-by-takeoff-system)
  - [Shared Files (Existing Dashboard)](#shared-files-existing-dashboard)
- [Data Storage Strategy](#data-storage-strategy)
  - [Client-Side JSON Files](#client-side-json-files)
  - [Data Schemas](#data-schemas)
    - [1. takeoffs.json](#1-takeoffsjson)
    - [2. cost-items.json](#2-cost-itemsjson)
    - [3. estimates.json](#3-estimatesjson)
    - [4. proposals.json](#4-proposalsjson)
    - [5. bore-paths.json](#5-bore-pathsjson)
    - [6. change-orders.json](#6-change-ordersjson)
  - [Data Persistence](#data-persistence)
- [Integration Points](#integration-points)
  - [1. Integration with Next.js HDD Operations App](#1-integration-with-nextjs-hdd-operations-app)
  - [2. Integration with Legacy Dashboard](#2-integration-with-legacy-dashboard)
  - [3. Cross-System Data Flow](#3-cross-system-data-flow)
- [Development Phases](#development-phases)
  - [Phase 0: Scaffolding (Modules P0.1, P0.2, P0.3)](#phase-0-scaffolding-modules-p01-p02-p03)
  - [Phase 1: Takeoff Core (Modules 1.1, 1.2, 1.3, 1.4)](#phase-1-takeoff-core-modules-11-12-13-14)
  - [Phase 2: Estimating Engine (Modules 2.1, 2.2, 2.3, 2.4)](#phase-2-estimating-engine-modules-21-22-23-24)
  - [Phase 3: Advanced Features (Modules 3.1, 3.2, 3.3, 3.4)](#phase-3-advanced-features-modules-31-32-33-34)
- [Design Principles](#design-principles)
  - [1. Simplicity First](#1-simplicity-first)
  - [2. Progressive Enhancement](#2-progressive-enhancement)
  - [3. Separation of Concerns](#3-separation-of-concerns)
  - [4. Integration Without Interference](#4-integration-without-interference)
  - [5. Data Ownership](#5-data-ownership)
  - [6. Performance](#6-performance)
  - [7. Maintainability](#7-maintainability)
- [Reference Documentation](#reference-documentation)

<!-- /TOC -->

# Takeoff System Architecture

**Version:** 1.0
**Last Updated:** 2025-11-22
**Status:** Active Development

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [Data Storage Strategy](#data-storage-strategy)
5. [Integration Points](#integration-points)
6. [Development Phases](#development-phases)
7. [Design Principles](#design-principles)

---

## System Overview

The Midwest Underground Takeoff & Estimating System is a **construction measurement and cost estimation platform** designed specifically for HDD (Horizontal Directional Drilling) operations. It enables project estimators to:

- Upload PDF construction plans
- Measure quantities directly on digital plans (linear feet, areas, counts)
- Build detailed cost estimates from measured quantities
- Generate professional branded proposals
- Track historical project data for better estimating
- Manage change orders throughout project lifecycle

### Architecture Philosophy

This system is built as **static HTML/CSS/JavaScript pages** that integrate seamlessly into the existing dashboard infrastructure. This approach provides:

- **Zero Backend Dependencies:** All data storage uses client-side JSON files
- **Easy Deployment:** No build process, runs directly in browser
- **Coexistence:** Works alongside Next.js HDD Operations App without conflicts
- **Maintainability:** Simple architecture, easy to debug and extend

### Three Coexisting Systems

```
midwest-underground-website/
├── src/app/              # System 1: Next.js HDD Operations (COMPLETE)
│   ├── api/              # 32 RESTful endpoints
│   ├── auth/             # NextAuth v5
│   └── dashboard/        # 21 React pages
│
├── dashboard/            # System 2: Legacy Static Dashboard (EXISTING)
│   ├── *.html            # Existing static pages
│   ├── js/               # Vanilla JavaScript
│   └── css/              # Dashboard styles
│
└── dashboard/            # System 3: Takeoff & Estimating (NEW - THIS PROJECT)
    ├── takeoff.html      # PDF viewer with measurement tools
    ├── estimates.html    # Estimate builder
    ├── cost-database.html # Cost item management
    ├── proposals.html    # Proposal generator
    ├── bore-visualizer.html   # 3D bore path visualization
    ├── historical.html   # Historical project database
    └── change-orders.html # Change order management
```

---

## Technology Stack

### Core Libraries

| Library | Purpose | Version | CDN/Local | Usage |
|---------|---------|---------|-----------|-------|
| **PDF.js** | PDF rendering and navigation | Latest | CDN | Phase 1: Module 1.1 |
| **Fabric.js** | Canvas overlay for measurements | 5.x | CDN | Phase 1: Module 1.2 |
| **jsPDF** | PDF generation for proposals | Latest | CDN | Phase 2: Module 2.3 |
| **Chart.js** | Charts and visualizations | 4.x | CDN | Already used in dashboard |
| **Three.js** | 3D bore path visualization | Latest | CDN | Phase 3: Module 3.1 |

### Why These Libraries?

**PDF.js:**
- Mozilla-maintained, industry standard
- Full control over PDF rendering
- Supports zoom, pan, page navigation
- Text extraction capabilities

**Fabric.js:**
- Robust canvas manipulation
- Object-based drawing (lines, polygons, text)
- Easy serialization for save/load
- Touch and mouse event handling

**jsPDF:**
- Client-side PDF generation
- Template support for branded proposals
- Chart embedding via Chart.js integration
- No server required

**Three.js:**
- Industry-standard 3D rendering
- Bore path visualization with depth profiles
- Collision detection for utility conflicts
- Export capabilities

### No Backend Requirements

- **No database:** Client-side JSON files in `dashboard/api/data/`
- **No server:** Static HTML served directly
- **No build process:** Libraries loaded via CDN
- **No authentication:** Integrates with existing dashboard session

---

## File Structure

### New Files Created by Takeoff System

```
dashboard/
├── takeoff.html                   # Phase 1: PDF viewer with measurement tools
├── estimates.html                 # Phase 2: Estimate builder
├── cost-database.html             # Phase 2: Cost item management
├── proposals.html                 # Phase 2: Proposal generator
├── bore-visualizer.html           # Phase 3: 3D bore path visualization
├── historical.html                # Phase 3: Historical project database
├── change-orders.html             # Phase 3: Change order management
│
├── css/
│   └── takeoff.css                # Takeoff-specific styles
│
├── js/
│   ├── pdf-viewer.js              # Phase 1.1: PDF.js integration
│   ├── measurement-tools.js       # Phase 1.2: Fabric.js overlay tools
│   ├── quantity-calculator.js     # Phase 1.3: Quantity aggregation
│   ├── takeoff-export.js          # Phase 1.4: Save/load/export
│   ├── cost-database.js           # Phase 2.1: Cost item CRUD
│   ├── estimate-builder.js        # Phase 2.2: Estimate calculations
│   ├── proposal-generator.js      # Phase 2.3: jsPDF templates
│   ├── bore-visualizer.js         # Phase 3.1: 3D visualization
│   ├── historical.js              # Phase 3.2: Search/similarity
│   └── change-orders.js           # Phase 3.3: CO workflow
│
├── api/data/
│   ├── takeoffs.json              # Saved takeoffs with measurements
│   ├── cost-items.json            # Cost database (labor, equipment, materials, subs)
│   ├── estimates.json             # Estimates with line items
│   ├── proposals.json             # Proposal data and metadata
│   ├── bore-paths.json            # Bore profiles with depth data
│   └── change-orders.json         # Change orders with impact analysis
│
└── templates/
    └── proposal-template.js       # PDF proposal layout and branding
```

### Shared Files (Existing Dashboard)

**Reused:**
- `dashboard/css/dashboard.css` - Base dashboard styles
- `dashboard/js/chart.min.js` - Chart.js library (already loaded)
- `dashboard/js/dashboard.js` - Shared dashboard utilities

**Not Modified:**
- Next.js app files (`src/app/**`)
- Legacy dashboard pages (existing `dashboard/*.html`)

---

## Data Storage Strategy

### Client-Side JSON Files

All data is stored in `dashboard/api/data/*.json` files. This approach provides:

- **Simplicity:** No database setup or backend required
- **Portability:** Easy to backup, export, and migrate
- **Debugging:** Human-readable data files
- **Compatibility:** Works with existing static dashboard

### Data Schemas

#### 1. takeoffs.json

```javascript
{
  "takeoffs": [
    {
      "id": "uuid-v4",
      "projectId": "project-123",              // Optional: link to Next.js project
      "name": "Main Street Fiber Install",
      "pdfUrl": "path/to/uploaded.pdf",
      "pdfFileName": "main-street-plans.pdf",
      "scale": {
        "pixels": 100,                         // Pixels on screen
        "realWorld": 50,                       // Real-world distance
        "units": "feet"                        // feet, meters, etc.
      },
      "measurements": [
        {
          "id": "measurement-uuid",
          "type": "linear",                    // linear, area, count, polyline
          "category": "HDD",                   // HDD, fiber, trench, vault, etc.
          "points": [[x1,y1], [x2,y2]],       // Canvas coordinates
          "length": 450.5,                     // Calculated length
          "units": "feet",
          "label": "Bore Path 1",
          "notes": "Under Main St, 6' depth",
          "page": 1,                           // PDF page number
          "color": "#FF6B35",                  // Display color
          "createdAt": "2025-11-22T10:00:00Z"
        }
      ],
      "quantities": {
        "HDD": 450.5,
        "fiber": 450.5,
        "trench": 125.0,
        "vaults": 3
      },
      "createdAt": "2025-11-22T10:00:00Z",
      "updatedAt": "2025-11-22T11:30:00Z",
      "createdBy": "user@example.com"          // Optional: from dashboard session
    }
  ]
}
```

#### 2. cost-items.json

```javascript
{
  "costItems": [
    {
      "id": "uuid-v4",
      "category": "Labor",                     // Labor, Equipment, Materials, Subcontractor
      "subcategory": "HDD Crew",
      "name": "2-Person HDD Crew",
      "unit": "hour",
      "unitCost": 150.00,
      "notes": "Includes operator and locator",
      "active": true,
      "createdAt": "2025-11-22T10:00:00Z",
      "updatedAt": "2025-11-22T10:00:00Z"
    }
  ]
}
```

#### 3. estimates.json

```javascript
{
  "estimates": [
    {
      "id": "uuid-v4",
      "takeoffId": "takeoff-uuid",             // Link to takeoff
      "projectId": "project-123",              // Optional: link to Next.js project
      "name": "Main Street Estimate v2",
      "lineItems": [
        {
          "id": "line-uuid",
          "costItemId": "cost-item-uuid",
          "description": "HDD Boring - 450 LF",
          "quantity": 450.5,
          "unit": "LF",
          "unitCost": 12.50,
          "totalCost": 5631.25,
          "category": "Labor",
          "notes": "Includes setup and demob"
        }
      ],
      "subtotal": 25000.00,
      "markup": 0.15,                          // 15% markup
      "total": 28750.00,
      "status": "draft",                       // draft, approved, sent
      "createdAt": "2025-11-22T12:00:00Z",
      "updatedAt": "2025-11-22T13:00:00Z"
    }
  ]
}
```

#### 4. proposals.json

```javascript
{
  "proposals": [
    {
      "id": "uuid-v4",
      "estimateId": "estimate-uuid",
      "projectName": "Main Street Fiber Install",
      "clientName": "City of Willmar",
      "clientContact": "John Smith",
      "clientEmail": "jsmith@willmar.mn.us",
      "proposalNumber": "2025-001",
      "validUntil": "2025-12-31",
      "terms": "Net 30",
      "notes": "Pricing valid for 60 days",
      "generatedAt": "2025-11-22T14:00:00Z",
      "pdfUrl": "path/to/generated-proposal.pdf",
      "status": "sent"                         // draft, sent, accepted, rejected
    }
  ]
}
```

#### 5. bore-paths.json

```javascript
{
  "borePaths": [
    {
      "id": "uuid-v4",
      "takeoffId": "takeoff-uuid",
      "name": "Main St Crossing",
      "profile": [
        { "distance": 0, "depth": 0, "angle": 0 },
        { "distance": 50, "depth": 6, "angle": 12 },
        { "distance": 400, "depth": 6, "angle": 0 },
        { "distance": 450, "depth": 0, "angle": -12 }
      ],
      "obstacles": [
        { "distance": 200, "depth": 4, "type": "water", "label": "Water Main" }
      ],
      "createdAt": "2025-11-22T15:00:00Z"
    }
  ]
}
```

#### 6. change-orders.json

```javascript
{
  "changeOrders": [
    {
      "id": "uuid-v4",
      "estimateId": "estimate-uuid",
      "number": "CO-001",
      "description": "Additional 100 LF of bore",
      "reason": "Field conditions",
      "lineItems": [
        {
          "id": "line-uuid",
          "description": "Additional HDD - 100 LF",
          "quantity": 100,
          "unit": "LF",
          "unitCost": 12.50,
          "totalCost": 1250.00
        }
      ],
      "subtotal": 1250.00,
      "markup": 0.15,
      "total": 1437.50,
      "status": "pending",                     // pending, approved, rejected
      "createdAt": "2025-11-22T16:00:00Z",
      "approvedAt": null,
      "approvedBy": null
    }
  ]
}
```

### Data Persistence

**Read/Write Operations:**
- Load JSON files via `fetch()` API
- Modify data in memory (JavaScript objects)
- Save back to JSON files using File System Access API (where supported)
- Fallback: Download modified JSON for manual upload

**File Size Management:**
- JSON files expected to remain < 5MB each
- PDF files stored separately (not in JSON)
- Image thumbnails generated at reduced resolution

---

## Integration Points

### 1. Integration with Next.js HDD Operations App

**Shared Data:**
- **Projects:** Takeoffs can reference `projectId` from Next.js projects
- **User Authentication:** Can read NextAuth session (read-only)
- **Photos:** Photos uploaded via Next.js can be attached to takeoffs

**Separation Boundary:**
- Takeoff system is **read-only** for Next.js data
- No direct database writes from static pages
- Links via `projectId` foreign key references
- Optional integration (system works standalone)

**Example Integration:**
```javascript
// In takeoff.html
async function loadProject(projectId) {
  // Read-only access to Next.js API
  const response = await fetch(`/api/projects/${projectId}`);
  const project = await response.json();

  // Display project metadata in takeoff UI
  document.getElementById('project-name').textContent = project.name;
}
```

### 2. Integration with Legacy Dashboard

**Shared Resources:**
- Dashboard layout and navigation (`dashboard/css/dashboard.css`)
- Chart.js library (already loaded)
- Sidebar navigation structure
- Color palette and design system

**New Navigation Items:**
- "Takeoff System" menu section
- Links to: Takeoff, Estimates, Cost Database, Proposals, etc.

**Example Navigation Addition:**
```html
<!-- In dashboard sidebar -->
<li class="nav-section">
  <h3>Takeoff System</h3>
  <ul>
    <li><a href="takeoff.html">PDF Takeoff</a></li>
    <li><a href="estimates.html">Estimates</a></li>
    <li><a href="cost-database.html">Cost Database</a></li>
    <li><a href="proposals.html">Proposals</a></li>
  </ul>
</li>
```

### 3. Cross-System Data Flow

```
┌─────────────────────┐
│  Next.js HDD App    │
│  (src/app/)         │
│  - Projects         │───┐
│  - Photos           │   │ Read-Only
│  - User Auth        │   │ Reference
└─────────────────────┘   │
                          ▼
                    ┌─────────────────────┐
                    │  Takeoff System     │
                    │  (dashboard/)       │
                    │  - Takeoffs         │
                    │  - Estimates        │
                    │  - Proposals        │
                    └─────────────────────┘
                          │
                          │ Shared
                          ▼
                    ┌─────────────────────┐
                    │  Legacy Dashboard   │
                    │  (dashboard/)       │
                    │  - Layout           │
                    │  - Styles           │
                    │  - Navigation       │
                    └─────────────────────┘
```

---

## Development Phases

### Phase 0: Scaffolding (Modules P0.1, P0.2, P0.3)

**Goal:** Establish documentation, memory structure, and testing infrastructure

- **P0.1** - Repository context and documentation skeleton
- **P0.2** - Serena memory wiring and state management
- **P0.3** - Sandbox environment and test harness setup

**Deliverables:**
- Complete documentation structure
- Serena memory entities initialized
- Playwright test framework configured

---

### Phase 1: Takeoff Core (Modules 1.1, 1.2, 1.3, 1.4)

**Goal:** Build core PDF takeoff functionality with measurement tools

**Module 1.1 - PDF Plan Viewer**
- Upload PDF construction plans
- Zoom, pan, navigate pages
- Basic UI layout

**Module 1.2 - Measurement Tools**
- Set scale from plan
- Linear measurements (bore paths, fiber runs)
- Area measurements (if needed)
- Count tools (vaults, handholes)

**Module 1.3 - Quantity Calculator**
- Aggregate measurements by category
- Display totals in real-time
- Group by measurement type

**Module 1.4 - Data Export and Persistence**
- Save takeoffs to JSON
- Load existing takeoffs
- Export to CSV/PDF
- File management UI

**Deliverables:**
- Functional PDF takeoff tool
- `dashboard/takeoff.html` complete
- `dashboard/api/data/takeoffs.json` schema implemented

---

### Phase 2: Estimating Engine (Modules 2.1, 2.2, 2.3, 2.4)

**Goal:** Build cost estimation and proposal generation

**Module 2.1 - Cost Database**
- CRUD for cost items (labor, equipment, materials, subs)
- Category management
- Unit cost tracking
- `dashboard/cost-database.html`

**Module 2.2 - Estimate Builder**
- Map takeoff quantities to cost items
- Calculate line item totals
- Apply markup and overhead
- `dashboard/estimates.html`

**Module 2.3 - Proposal Generator**
- Branded PDF proposal templates
- Client information management
- Professional formatting
- `dashboard/proposals.html`

**Module 2.4 - Dashboard Integration**
- Add takeoff/estimate status to dashboard overview
- Link projects to takeoffs
- Display recent activity

**Deliverables:**
- Complete estimating workflow
- Professional proposal generation
- Integrated dashboard experience

---

### Phase 3: Advanced Features (Modules 3.1, 3.2, 3.3, 3.4)

**Goal:** Add advanced visualization, historical data, and change order management

**Module 3.1 - 3D Bore Path Visualizer**
- Three.js bore path rendering
- Depth profile visualization
- Collision detection with utilities
- `dashboard/bore-visualizer.html`

**Module 3.2 - Historical Project Database**
- Search historical projects
- Compare similar projects
- Suggest costs based on history
- `dashboard/historical.html`

**Module 3.3 - Change Order Management**
- Create change orders from estimates
- Track CO status
- Calculate impact on totals
- `dashboard/change-orders.html`

**Module 3.4 - Client Portal (Future)**
- Client login and authentication
- View projects and proposals
- Upload files and feedback
- (May move to Next.js app)

**Deliverables:**
- Advanced visualization tools
- Historical project intelligence
- Complete change order workflow

---

## Design Principles

### 1. Simplicity First

- Static HTML/CSS/JavaScript only
- No build process or bundlers
- Libraries loaded via CDN
- Human-readable data files

### 2. Progressive Enhancement

- Core functionality works without JavaScript
- Enhanced UX with JavaScript enabled
- Mobile-first responsive design
- Graceful degradation

### 3. Separation of Concerns

- Clear boundaries between HTML, CSS, and JavaScript
- Modular JavaScript files (one concern per file)
- Data layer separated from presentation
- Stateless components where possible

### 4. Integration Without Interference

- Coexists with Next.js app
- Reuses dashboard styles
- No breaking changes to existing systems
- Additive, not destructive

### 5. Data Ownership

- User owns their data (JSON files)
- Easy to backup and export
- No vendor lock-in
- Portable across systems

### 6. Performance

- Lazy load libraries only when needed
- Optimize PDF rendering for large files
- Canvas rendering optimizations
- Minimal DOM manipulation

### 7. Maintainability

- Consistent code style
- Well-documented functions
- Clear variable naming
- Minimal dependencies

---

## Reference Documentation

For detailed system architecture and development guidelines, see:

- **`.claude/takeoff-system.md`** - Complete architecture specification
- **`docs/takeoff/MEMORY.md`** - Serena memory structure
- **`docs/takeoff/TESTING.md`** - Testing strategy and conventions
- **`docs/takeoff/PROGRESS.md`** - Development progress log

---

**Document Version:** 1.0
**Maintained By:** Autonomous Development Team
**Review Frequency:** After each phase completion
