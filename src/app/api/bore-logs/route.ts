import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockBoreLogs = [
  {
    id: 1,
    date: '2025-10-20',
    project: 'Willmar Fiber Network - Phase 2',
    location: 'County Rd 5 & Hwy 12',
    totalDepth: '485 ft',
    rodCount: 97,
    status: 'Completed',
    crew: 'Crew A - John Smith'
  },
  {
    id: 2,
    date: '2025-10-21',
    project: 'CenturyLink Expansion',
    location: '1st St & Main Ave',
    totalDepth: '320 ft',
    rodCount: 64,
    status: 'Completed',
    crew: 'Crew B - Mike Johnson'
  },
  {
    id: 3,
    date: '2025-10-22',
    project: 'Rural Electric Co-op',
    location: 'Township Rd 42',
    totalDepth: '680 ft',
    rodCount: 136,
    status: 'In Progress',
    crew: 'Crew A - John Smith'
  },
  {
    id: 4,
    date: '2025-10-23',
    project: 'City Water Main',
    location: '3rd St & Oak Dr',
    totalDepth: '210 ft',
    rodCount: 42,
    status: 'Planned',
    crew: 'Crew C - Dave Anderson'
  }
]

// GET /api/bore-logs - List all bore logs
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const boreLogs = await prisma.boreLog.findMany()

    return NextResponse.json({
      success: true,
      data: mockBoreLogs,
      count: mockBoreLogs.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bore logs' },
      { status: 500 }
    )
  }
}

// POST /api/bore-logs - Create new bore log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.date || !body.project || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newBoreLog = await prisma.boreLog.create({ data: body })

    const newBoreLog = {
      id: mockBoreLogs.length + 1,
      ...body,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newBoreLog
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create bore log' },
      { status: 500 }
    )
  }
}
