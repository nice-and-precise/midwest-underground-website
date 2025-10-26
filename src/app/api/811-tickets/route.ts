import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockTickets = [
  {
    id: 1,
    ticketNumber: '25102200145-001',
    status: 'Active',
    type: 'Normal',
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    location: 'County Rd 5 & Hwy 12',
    digDate: '2025-10-25',
    expirationDate: '2025-11-08',
    daysRemaining: 3,
    utilitiesMarked: 4,
    totalUtilities: 5
  },
  {
    id: 2,
    ticketNumber: '25102100132-002',
    status: 'Active',
    type: 'Normal',
    project: 'CenturyLink Expansion',
    projectId: 2,
    location: 'Highway 71 North',
    digDate: '2025-10-28',
    expirationDate: '2025-11-11',
    daysRemaining: 6,
    utilitiesMarked: 3,
    totalUtilities: 3
  },
  {
    id: 3,
    ticketNumber: '25101800089-003',
    status: 'Expired',
    type: 'Normal',
    project: 'Rural Electric Co-op',
    projectId: 3,
    location: 'Township Road 145',
    digDate: '2025-10-20',
    expirationDate: '2025-11-03',
    daysRemaining: -20,
    utilitiesMarked: 5,
    totalUtilities: 5
  },
  {
    id: 4,
    ticketNumber: '25102300156-001',
    status: 'Pending',
    type: 'Emergency',
    project: 'City Water Main Extension',
    projectId: 4,
    location: '4th Street SW',
    digDate: '2025-10-26',
    expirationDate: '2025-11-09',
    daysRemaining: 4,
    utilitiesMarked: 2,
    totalUtilities: 4
  }
]

// GET /api/811-tickets - List all 811 tickets
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const tickets = await prisma.ticket811.findMany({
    //   include: { project: true, utilities: true, inspections: true }
    // })

    return NextResponse.json({
      success: true,
      data: mockTickets,
      count: mockTickets.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch 811 tickets' },
      { status: 500 }
    )
  }
}

// POST /api/811-tickets - Create new 811 ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.ticketNumber || !body.project || !body.digDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newTicket = await prisma.ticket811.create({ data: body })

    const newTicket = {
      id: mockTickets.length + 1,
      ...body,
      status: body.status || 'Pending',
      type: body.type || 'Normal',
      utilitiesMarked: 0,
      totalUtilities: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newTicket
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create 811 ticket' },
      { status: 500 }
    )
  }
}
