import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockProjects = [
  {
    id: 1,
    name: 'Willmar Fiber Network - Phase 2',
    client: 'Willmar Municipal Utilities',
    startDate: '2025-09-15',
    endDate: '2025-11-30',
    budget: 245000,
    actualCost: 159250,
    progress: 65,
    status: 'Active',
    footage: '12,450 ft'
  },
  {
    id: 2,
    name: 'CenturyLink Expansion',
    client: 'CenturyLink Communications',
    startDate: '2025-10-01',
    endDate: '2025-12-15',
    budget: 180000,
    actualCost: 45000,
    progress: 25,
    status: 'Active',
    footage: '8,200 ft'
  },
  {
    id: 3,
    name: 'Rural Electric Co-op',
    client: 'Kandiyohi Power Cooperative',
    startDate: '2025-11-01',
    endDate: '2026-01-31',
    budget: 320000,
    actualCost: 89000,
    progress: 28,
    status: 'Active',
    footage: '15,800 ft'
  },
  {
    id: 4,
    name: 'City Water Main Extension',
    client: 'City of Willmar',
    startDate: '2025-08-01',
    endDate: '2025-10-31',
    budget: 156000,
    actualCost: 152000,
    progress: 98,
    status: 'Completing',
    footage: '6,500 ft'
  },
  {
    id: 5,
    name: 'Highway 12 Fiber Crossing',
    client: 'MN Department of Transportation',
    startDate: '2025-12-01',
    endDate: '2026-02-28',
    budget: 95000,
    actualCost: 0,
    progress: 0,
    status: 'Planned',
    footage: '3,200 ft'
  }
]

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const projects = await prisma.project.findMany()

    return NextResponse.json({
      success: true,
      data: mockProjects,
      count: mockProjects.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.client || !body.startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newProject = await prisma.project.create({ data: body })

    const newProject = {
      id: mockProjects.length + 1,
      ...body,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newProject
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
