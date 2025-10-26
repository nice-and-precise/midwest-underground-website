import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockEquipment = [
  {
    id: 1,
    name: 'Ditch Witch JT40',
    type: 'Directional Drill',
    model: 'JT40',
    status: 'Active',
    location: 'Willmar Shop',
    assignedTo: 'Crew A - John Smith',
    totalHours: 3420,
    condition: 'Good'
  },
  {
    id: 2,
    name: 'Vermeer D24x40',
    type: 'Directional Drill',
    model: 'D24x40',
    status: 'Active',
    location: 'Job Site - County Rd 5',
    assignedTo: 'Crew B - Mike Davis',
    totalHours: 2150,
    condition: 'Excellent'
  },
  {
    id: 3,
    name: 'Ditch Witch JT20',
    type: 'Directional Drill',
    model: 'JT20',
    status: 'Maintenance',
    location: 'Service Center',
    assignedTo: 'None',
    totalHours: 4820,
    condition: 'Fair'
  },
  {
    id: 4,
    name: 'Vacuum Excavator',
    type: 'Excavation',
    model: 'Vactor HXX',
    status: 'Active',
    location: 'Willmar Shop',
    assignedTo: 'Crew A - John Smith',
    totalHours: 1650,
    condition: 'Good'
  },
  {
    id: 5,
    name: 'Utility Locator',
    type: 'Locating Equipment',
    model: 'Radiodetection RD8200',
    status: 'Active',
    location: 'Job Site - Downtown',
    assignedTo: 'Crew C - Dave Wilson',
    totalHours: 890,
    condition: 'Excellent'
  }
]

// GET /api/equipment - List all equipment
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const equipment = await prisma.equipment.findMany({
    //   include: { maintenanceHistory: true, projectAssignments: true }
    // })

    return NextResponse.json({
      success: true,
      data: mockEquipment,
      count: mockEquipment.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

// POST /api/equipment - Create new equipment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.type || !body.model) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newEquipment = await prisma.equipment.create({ data: body })

    const newEquipment = {
      id: mockEquipment.length + 1,
      ...body,
      status: body.status || 'Active',
      totalHours: 0,
      condition: body.condition || 'New',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newEquipment
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}
