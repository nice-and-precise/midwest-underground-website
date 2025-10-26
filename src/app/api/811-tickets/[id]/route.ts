import { NextRequest, NextResponse } from 'next/server'

// GET /api/811-tickets/[id] - Get single 811 ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // In production:
    // const ticket = await prisma.ticket811.findUnique({
    //   where: { id },
    //   include: {
    //     project: true,
    //     utilities: true,
    //     inspections: true,
    //     documentation: true,
    //     notes: true
    //   }
    // })

    const mockTicket = {
      id,
      ticketNumber: '25102200145-001',
      status: 'Active',
      type: 'Normal',
      workType: 'Directional Boring',
      digDate: '2025-10-25',
      expirationDate: '2025-11-08',
      daysRemaining: 3,

      requestor: {
        name: 'John Smith',
        company: 'Midwest Underground of Minnesota',
        phone: '(320) 382-6636',
        email: 'jsmith@midwestunderground.com',
        requestDate: '2025-10-22 09:15 AM'
      },

      location: {
        address: 'County Rd 5 & Hwy 12, Willmar, MN 56201',
        county: 'Kandiyohi',
        township: 'Willmar Township',
        coordinates: '45.1234° N, 95.0567° W',
        workArea: '500 ft linear bore along County Rd 5'
      },

      project: {
        id: 1,
        name: 'Willmar Fiber Network - Phase 2',
        client: 'Willmar Municipal Utilities',
        contactPerson: 'Tom Anderson',
        contactPhone: '(320) 235-4422'
      },

      utilities: [
        {
          company: 'Xcel Energy',
          type: 'Electric',
          marked: true,
          markDate: '2025-10-23',
          color: 'Red',
          contact: 'Mark Wilson',
          phone: '(800) 895-4999',
          notes: 'Primary electric service line marked at 4ft depth'
        },
        {
          company: 'CenterPoint Energy',
          type: 'Gas',
          marked: true,
          markDate: '2025-10-23',
          color: 'Yellow',
          contact: 'Sarah Johnson',
          phone: '(800) 245-7464',
          notes: 'Gas main marked at 3.5ft depth'
        }
      ],

      inspections: [
        {
          date: '2025-10-23',
          inspector: 'John Smith',
          status: 'Verified',
          notes: 'All utilities marked and verified in field'
        }
      ],

      notes: [
        {
          date: '2025-10-23 14:30',
          user: 'John Smith',
          note: 'All utilities located and marked. Field verification complete.'
        }
      ]
    }

    if (!mockTicket) {
      return NextResponse.json(
        { success: false, error: '811 ticket not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockTicket
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch 811 ticket' },
      { status: 500 }
    )
  }
}

// PUT /api/811-tickets/[id] - Update 811 ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // In production:
    // const updated = await prisma.ticket811.update({ where: { id }, data: body })

    const updated = {
      id,
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updated
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update 811 ticket' },
      { status: 500 }
    )
  }
}

// DELETE /api/811-tickets/[id] - Delete 811 ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // In production:
    // await prisma.ticket811.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '811 ticket deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete 811 ticket' },
      { status: 500 }
    )
  }
}
