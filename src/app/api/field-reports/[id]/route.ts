import { NextRequest, NextResponse } from 'next/server'

// GET /api/field-reports/[id] - Get single field report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    // In production:
    // const report = await prisma.fieldReport.findUnique({
    //   where: { id },
    //   include: {
    //     project: true,
    //     crew: true,
    //     equipment: true,
    //     materials: true,
    //     photos: true,
    //     signatures: true
    //   }
    // })

    const mockReport = {
      id,
      date: '2025-10-22',
      project: 'Willmar Fiber Network - Phase 2',
      projectId: 1,
      crewName: 'Crew A - John Smith',
      location: 'County Rd 5 & Hwy 12',
      status: 'Submitted',
      submittedBy: 'John Smith',
      submittedAt: '2025-10-22 16:45',

      workPerformed: {
        startTime: '07:30 AM',
        endTime: '04:15 PM',
        totalHours: 8.75,
        breakTime: 0.5,
        workingHours: 8.25,
        description: 'Completed HDD bore 485 feet, installed 2-inch HDPE conduit'
      },

      equipment: [
        { name: 'Ditch Witch JT40', hours: 8.5, operator: 'Mike Johnson' },
        { name: 'Vacuum Excavator', hours: 2.0, operator: 'Dave Anderson' }
      ],

      crew: [
        { name: 'John Smith', role: 'Crew Lead', hours: 8.75 },
        { name: 'Mike Johnson', role: 'Operator', hours: 8.75 }
      ],

      materials: [
        { item: '2" HDPE Conduit', quantity: 500, unit: 'ft', notes: 'Black DR11' },
        { item: 'Bentonite Drilling Fluid', quantity: 150, unit: 'gallons', notes: 'Mixed on-site' }
      ],

      safetyObservations: {
        incidents: 0,
        nearMisses: 0,
        hazards: ['Traffic control maintained', 'Underground utilities marked'],
        notes: 'No safety incidents. All crew attended safety briefing.'
      },

      weather: {
        condition: 'Sunny',
        temperature: '68°F',
        wind: 'Light, 5-10 mph',
        precipitation: 'None',
        impact: 'None - excellent working conditions'
      },

      progress: {
        planned: '450 ft',
        actual: '485 ft',
        variance: '+35 ft',
        percentComplete: 108
      },

      photos: [
        { filename: 'entry-pit-setup.jpg', caption: 'Entry pit setup', timestamp: '07:45 AM' },
        { filename: 'bore-in-progress.jpg', caption: 'Drilling operation', timestamp: '10:30 AM' }
      ],

      signatures: {
        crewLead: { name: 'John Smith', signed: true, timestamp: '2025-10-22 16:30' },
        supervisor: { name: 'Mike Johnson', signed: true, timestamp: '2025-10-22 17:15' }
      }
    }

    if (!mockReport) {
      return NextResponse.json(
        { success: false, error: 'Field report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockReport
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch field report' },
      { status: 500 }
    )
  }
}

// PUT /api/field-reports/[id] - Update field report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await request.json()

    // In production:
    // const updated = await prisma.fieldReport.update({ where: { id }, data: body })

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
      { success: false, error: 'Failed to update field report' },
      { status: 500 }
    )
  }
}

// DELETE /api/field-reports/[id] - Delete field report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    // In production:
    // await prisma.fieldReport.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Field report deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete field report' },
      { status: 500 }
    )
  }
}
