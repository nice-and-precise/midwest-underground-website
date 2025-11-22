import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockFieldReports = [
  {
    id: 1,
    date: '2025-10-22',
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    crew: 'Crew A - John Smith',
    location: 'County Rd 5 & Hwy 12',
    status: 'Submitted',
    totalHours: 8.75,
    workDescription: 'HDD bore 485 ft, conduit installation'
  },
  {
    id: 2,
    date: '2025-10-21',
    project: 'CenturyLink Expansion',
    projectId: 2,
    crew: 'Crew B - Mike Davis',
    location: 'Highway 71 North',
    status: 'Submitted',
    totalHours: 9.0,
    workDescription: 'Site prep and entry pit excavation'
  },
  {
    id: 3,
    date: '2025-10-20',
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    crew: 'Crew A - John Smith',
    location: 'County Rd 5 & Hwy 12',
    status: 'Approved',
    totalHours: 8.5,
    workDescription: 'Exit pit excavation and setup'
  },
  {
    id: 4,
    date: '2025-10-19',
    project: 'Rural Electric Co-op',
    projectId: 3,
    crew: 'Crew C - Dave Wilson',
    location: 'Township Road 145',
    status: 'Approved',
    totalHours: 7.5,
    workDescription: 'Utility locates and site survey'
  },
  {
    id: 5,
    date: '2025-10-18',
    project: 'City Water Main Extension',
    projectId: 4,
    crew: 'Crew A - John Smith',
    location: '4th Street SW',
    status: 'Approved',
    totalHours: 8.0,
    workDescription: 'Final bore completion and restoration'
  }
]

// GET /api/field-reports - List all field reports
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const reports = await prisma.fieldReport.findMany({
    //   include: { project: true, crew: true, equipment: true }
    // })

    return NextResponse.json({
      success: true,
      data: mockFieldReports,
      count: mockFieldReports.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch field reports' },
      { status: 500 }
    )
  }
}

// POST /api/field-reports - Create new field report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.date || !body.project || !body.crew) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newReport = await prisma.fieldReport.create({ data: body })

    const newReport = {
      id: mockFieldReports.length + 1,
      ...body,
      status: body.status || 'Draft',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newReport
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create field report' },
      { status: 500 }
    )
  }
}
