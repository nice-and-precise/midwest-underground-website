import { NextRequest, NextResponse } from 'next/server'

// GET /api/bore-logs/[id] - Get single bore log
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    // In production:
    // const boreLog = await prisma.boreLog.findUnique({ where: { id } })

    const mockBoreLog = {
      id,
      date: '2025-10-20',
      project: 'Willmar Fiber Network - Phase 2',
      location: 'County Rd 5 & Hwy 12',
      totalDepth: '485 ft',
      rodCount: 97,
      status: 'Completed',
      crew: 'Crew A - John Smith',
      equipment: 'Ditch Witch JT40',
      startTime: '07:30 AM',
      endTime: '04:15 PM',
      weather: 'Sunny, 68°F',
      soilType: 'Clay/Sand Mix',
      notes: 'Smooth operation. No obstacles encountered.'
    }

    if (!mockBoreLog) {
      return NextResponse.json(
        { success: false, error: 'Bore log not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockBoreLog
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bore log' },
      { status: 500 }
    )
  }
}

// PUT /api/bore-logs/[id] - Update bore log
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await request.json()

    // In production:
    // const updated = await prisma.boreLog.update({ where: { id }, data: body })

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
      { success: false, error: 'Failed to update bore log' },
      { status: 500 }
    )
  }
}

// DELETE /api/bore-logs/[id] - Delete bore log
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    // In production:
    // await prisma.boreLog.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Bore log deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete bore log' },
      { status: 500 }
    )
  }
}
