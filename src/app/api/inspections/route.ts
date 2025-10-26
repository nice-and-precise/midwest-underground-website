import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockInspections = [
  {
    id: 1,
    inspectionNumber: 'INS-2025-001-MU',
    date: '2025-10-23',
    type: 'Final Inspection',
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    location: 'County Rd 5 & Hwy 12',
    inspector: 'Tom Anderson',
    status: 'Passed',
    itemsInspected: 16,
    itemsPassed: 16
  },
  {
    id: 2,
    inspectionNumber: 'INS-2025-002-MU',
    date: '2025-10-21',
    type: 'Progress Inspection',
    project: 'CenturyLink Expansion',
    projectId: 2,
    location: 'Highway 71 North',
    inspector: 'Sarah Miller',
    status: 'Passed',
    itemsInspected: 12,
    itemsPassed: 12
  },
  {
    id: 3,
    inspectionNumber: 'INS-2025-003-MU',
    date: '2025-10-18',
    type: 'Pre-Construction',
    project: 'Rural Electric Co-op',
    projectId: 3,
    location: 'Township Road 145',
    inspector: 'Tom Anderson',
    status: 'Passed',
    itemsInspected: 8,
    itemsPassed: 8
  },
  {
    id: 4,
    inspectionNumber: 'INS-2025-004-MU',
    date: '2025-10-15',
    type: 'Final Inspection',
    project: 'City Water Main Extension',
    projectId: 4,
    location: '4th Street SW',
    inspector: 'Bob Wilson',
    status: 'Conditional',
    itemsInspected: 16,
    itemsPassed: 14
  }
]

// GET /api/inspections - List all inspections
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const inspections = await prisma.inspection.findMany({
    //   include: { project: true, inspector: true, items: true }
    // })

    return NextResponse.json({
      success: true,
      data: mockInspections,
      count: mockInspections.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inspections' },
      { status: 500 }
    )
  }
}

// POST /api/inspections - Create new inspection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.date || !body.type || !body.project || !body.inspector) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newInspection = await prisma.inspection.create({ data: body })

    const newInspection = {
      id: mockInspections.length + 1,
      inspectionNumber: `INS-2025-${String(mockInspections.length + 1).padStart(3, '0')}-MU`,
      ...body,
      status: body.status || 'Pending',
      itemsInspected: 0,
      itemsPassed: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newInspection
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create inspection' },
      { status: 500 }
    )
  }
}
