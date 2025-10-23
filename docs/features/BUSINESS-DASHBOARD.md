# Business Dashboard Specification

## Overview

A comprehensive business intelligence dashboard for Midwest Underground of Minnesota Inc that provides real-time insights into operations, financials, and project management.

## Purpose

Enable the business owner to:
- Monitor key performance indicators (KPIs)
- Track project progress and profitability
- Analyze revenue and expense trends
- Manage customer relationships
- Monitor equipment utilization
- View employee productivity
- Access financial reports
- Make data-driven decisions

## Key Metrics & Features

### 1. Revenue Analytics
- **Monthly Revenue Tracking**
  - Current month vs previous month
  - Year-over-year comparisons
  - Revenue by service type
  - Revenue by customer type

- **Revenue Forecasting**
  - Projected revenue based on pipeline
  - Seasonal trends analysis
  - Growth rate indicators

### 2. Project Management
- **Active Projects Dashboard**
  - Project status (Planning, In Progress, Completed)
  - Budget vs actual costs
  - Timeline adherence
  - Project profitability margins

- **Project Pipeline**
  - Upcoming projects (quotes sent)
  - Estimated project values
  - Win rate tracking
  - Average project size

### 3. Financial Overview
- **Profit & Loss Summary**
  - Gross revenue
  - Operating expenses
  - Net profit margin
  - EBITDA

- **Cash Flow Management**
  - Accounts receivable aging
  - Accounts payable schedule
  - Cash on hand
  - Outstanding invoices

### 4. Customer Analytics
- **Customer Insights**
  - Total active customers
  - Customer acquisition cost
  - Customer lifetime value
  - Repeat customer rate
  - Customer satisfaction scores

- **Top Customers**
  - By revenue
  - By project count
  - By service type

### 5. Equipment & Resources
- **Equipment Utilization**
  - Equipment usage hours
  - Maintenance schedule
  - Equipment ROI
  - Downtime tracking

- **Crew Productivity**
  - Labor hours per project
  - Crew efficiency metrics
  - Overtime tracking
  - Safety incidents

### 6. Service Line Performance
- **Service Breakdown**
  - HDD (Horizontal Directional Drilling)
  - Fiber Optic Installation
  - Underground Utilities
  - Telecommunications
  - Geothermal Systems
  - Emergency Services

- **Service Metrics**
  - Revenue by service
  - Profit margin by service
  - Project count by service
  - Average project duration

### 7. Geographic Analytics
- **Service Area Performance**
  - Projects by county
  - Revenue by region
  - Customer density mapping
  - Market penetration rates

### 8. Emergency Services
- **24/7 Service Metrics**
  - Response time averages
  - Emergency call volume
  - Emergency revenue
  - Customer satisfaction for emergencies

## Dashboard Layout

### Main Dashboard (index)
```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Logo, User Info, Notifications, Logout          │
├─────────────────────────────────────────────────────────┤
│ SIDEBAR NAVIGATION                                       │
│ - Dashboard Home                                         │
│ - Projects                                               │
│ - Financials                                             │
│ - Customers                                              │
│ - Equipment                                              │
│ - Reports                                                │
│ - Settings                                               │
├─────────────────────────────────────────────────────────┤
│ KPI CARDS (4 across)                                     │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                   │
│ │Revenue│ │Active│ │Profit│ │Cust. │                   │
│ │ YTD   │ │Proj. │ │Margin│ │ Count│                   │
│ └──────┘ └──────┘ └──────┘ └──────┘                   │
├─────────────────────────────────────────────────────────┤
│ CHARTS ROW 1                                             │
│ ┌────────────────┐  ┌────────────────┐                 │
│ │ Monthly Revenue│  │ Project Status │                 │
│ │  Line Chart    │  │  Pie Chart     │                 │
│ └────────────────┘  └────────────────┘                 │
├─────────────────────────────────────────────────────────┤
│ CHARTS ROW 2                                             │
│ ┌────────────────┐  ┌────────────────┐                 │
│ │Service Revenue │  │Top Customers   │                 │
│ │  Bar Chart     │  │  Table         │                 │
│ └────────────────┘  └────────────────┘                 │
├─────────────────────────────────────────────────────────┤
│ RECENT ACTIVITY                                          │
│ - Recent projects completed                              │
│ - Pending quotes                                         │
│ - Overdue invoices                                       │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- HTML5 (semantic structure)
- CSS3 (custom styling with CSS Grid & Flexbox)
- Vanilla JavaScript (ES6+)
- Chart.js (data visualization)
- No framework (zero build process)

### Backend
- PHP 8.0+ (RESTful API)
- JSON (data interchange)
- Dummy data generation
- Session-based authentication

### Data Storage
- JSON files (for dummy data)
- localStorage (for user preferences)
- Future: MySQL/PostgreSQL integration ready

## API Endpoints

### Dashboard API
```
GET  /api/dashboard/overview.php    - Main dashboard data
GET  /api/dashboard/revenue.php     - Revenue analytics
GET  /api/dashboard/projects.php    - Project data
GET  /api/dashboard/customers.php   - Customer analytics
GET  /api/dashboard/equipment.php   - Equipment metrics
GET  /api/dashboard/financials.php  - Financial reports
```

### Authentication API
```
POST /api/auth/login.php            - User login
POST /api/auth/logout.php           - User logout
GET  /api/auth/session.php          - Session validation
```

### Projects API
```
GET  /api/projects/list.php         - All projects
GET  /api/projects/details.php?id=X - Single project
POST /api/projects/update.php       - Update project
```

### Reports API
```
GET  /api/reports/revenue.php       - Revenue report
GET  /api/reports/profit-loss.php   - P&L statement
GET  /api/reports/cash-flow.php     - Cash flow report
```

## Dummy Data Structure

### Projects
- 50 historical projects (completed)
- 15 active projects (in progress)
- 20 pipeline projects (quoted/planning)

### Customers
- 35 unique customers
- Mix of: Municipal, Commercial, Residential, Telecom
- Realistic contact information

### Financials
- 24 months of historical data
- Monthly revenue: $180K - $450K
- Realistic expense categories
- Seasonal variations

### Equipment
- 8 major equipment pieces
- Utilization rates (60-95%)
- Maintenance schedules
- Operating costs

### Employees
- 12 crew members
- 3 office staff
- Realistic productivity metrics

## Security Features

### Authentication
- Secure login with password hashing
- Session management
- Auto-logout after inactivity
- CSRF protection

### Access Control
- Admin role (full access)
- Manager role (limited financial access)
- Viewer role (read-only)

### Demo Credentials
```
Admin:
Username: admin
Password: MidwestUnderground2025!

Manager:
Username: manager
Password: Manager2025!

Viewer:
Username: viewer
Password: Viewer2025!
```

## Responsive Design

- Desktop: Full dashboard with sidebar
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation, stacked cards

## Dark Mode

- Inherits site-wide dark mode toggle
- Dashboard-specific color scheme
- Chart colors adapt to theme

## Charts & Visualizations

### Chart.js Integration
1. **Revenue Line Chart** - Monthly revenue trend
2. **Project Status Pie Chart** - Active/Completed/Planning
3. **Service Revenue Bar Chart** - Revenue by service type
4. **Customer Growth Area Chart** - Customer acquisition over time
5. **Equipment Utilization Gauge Charts** - Per equipment piece
6. **Cash Flow Waterfall Chart** - Income vs expenses

## Export Features

- Export to PDF (reports)
- Export to CSV (data tables)
- Print-friendly views
- Email reports (future)

## Notifications

- Overdue invoices alert
- Project deadline warnings
- Equipment maintenance reminders
- Low cash flow warnings
- Emergency service requests

## Implementation Phases

### Phase 1: Core Dashboard (Now)
- Authentication system
- Main dashboard layout
- KPI cards
- Basic charts (Chart.js)
- Dummy data API

### Phase 2: Enhanced Features (Future)
- Advanced filtering
- Custom date ranges
- Real-time updates
- Mobile app integration

### Phase 3: Production Ready (Future)
- Database integration
- Real accounting software sync
- Email notifications
- Advanced reporting

## Files Structure

```
dashboard/
├── index.html                 # Dashboard home
├── login.html                 # Login page
├── projects.html              # Projects management
├── financials.html            # Financial reports
├── customers.html             # Customer management
├── equipment.html             # Equipment tracking
├── reports.html               # Report generation
│
├── css/
│   ├── dashboard.css          # Dashboard-specific styles
│   └── charts.css             # Chart styling
│
├── js/
│   ├── dashboard.js           # Main dashboard logic
│   ├── auth.js                # Authentication
│   ├── charts.js              # Chart initialization
│   └── api.js                 # API calls
│
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── session.php
│   │
│   ├── dashboard/
│   │   ├── overview.php
│   │   ├── revenue.php
│   │   ├── projects.php
│   │   └── customers.php
│   │
│   └── data/
│       ├── projects.json      # Dummy project data
│       ├── customers.json     # Dummy customer data
│       ├── financials.json    # Dummy financial data
│       └── equipment.json     # Dummy equipment data
│
└── docs/
    └── DASHBOARD-API.md       # API documentation
```

## Success Metrics

- Load time < 2 seconds
- Responsive on all devices
- Accessible (WCAG 2.1 AA)
- Intuitive navigation
- Actionable insights
- Real business value

## Future Enhancements

- QuickBooks integration
- Mobile app (React Native)
- Customer portal integration
- Real-time GPS tracking
- Predictive analytics
- AI-powered insights

---

**Status:** Ready to Implement
**Estimated Time:** 4-6 hours
**Priority:** High
**Business Value:** Critical for decision-making
