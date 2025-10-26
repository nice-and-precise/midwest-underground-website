import { NextRequest, NextResponse } from 'next/server'

// GET /api/equipment/[id] - Get single equipment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // In production:
    // const equipment = await prisma.equipment.findUnique({
    //   where: { id },
    //   include: {
    //     maintenanceHistory: true,
    //     upcomingMaintenance: true,
    //     projectHistory: true,
    //     documents: true
    //   }
    // })

    const mockEquipment = {
      id,
      name: 'Ditch Witch JT40',
      type: 'Directional Drill',
      model: 'JT40',
      manufacturer: 'Ditch Witch',
      serialNumber: 'DW-2019-JT40-1247',
      year: 2019,
      status: 'Active',
      condition: 'Good',
      location: 'Willmar Shop',
      assignedTo: 'Crew A - John Smith',
      purchaseDate: '2019-04-15',
      purchasePrice: 285000,
      currentValue: 185000,

      specifications: {
        thrustPull: '40,000 lbs',
        pullback: '40,000 lbs',
        torque: '4,500 ft-lbs',
        rotationSpeed: '0-120 RPM',
        pipeCapacity: '2" - 16" diameter',
        maxDepth: '50 ft',
        engine: 'Caterpillar C7.1 ACERT (300 HP)'
      },

      operatingHours: {
        total: 3420,
        thisYear: 680,
        thisMonth: 95,
        average: 60
      },

      maintenanceHistory: [
        {
          date: '2025-10-15',
          type: 'Scheduled Maintenance',
          description: '500-hour service',
          hours: 3400,
          cost: 850,
          technician: 'Dave Anderson',
          status: 'Completed'
        }
      ],

      upcomingMaintenance: [
        {
          type: 'Scheduled Maintenance',
          description: '1000-hour service',
          dueHours: 4000,
          hoursRemaining: 580,
          estimatedCost: 1500
        }
      ],

      projectHistory: [
        {
          id: 1,
          name: 'Willmar Fiber Network - Phase 2',
          status: 'Active',
          hoursUsed: 245
        }
      ]
    }

    if (!mockEquipment) {
      return NextResponse.json(
        { success: false, error: 'Equipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockEquipment
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

// PUT /api/equipment/[id] - Update equipment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // In production:
    // const updated = await prisma.equipment.update({ where: { id }, data: body })

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
      { success: false, error: 'Failed to update equipment' },
      { status: 500 }
    )
  }
}

// DELETE /api/equipment/[id] - Delete equipment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // In production:
    // await prisma.equipment.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Equipment deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete equipment' },
      { status: 500 }
    )
  }
}
