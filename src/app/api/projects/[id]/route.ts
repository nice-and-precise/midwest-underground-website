import { NextRequest, NextResponse } from 'next/server'

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // In production:
    // const project = await prisma.project.findUnique({
    //   where: { id },
    //   include: { team: true, milestones: true, activities: true }
    // })

    const mockProject = {
      id,
      name: 'Willmar Fiber Network - Phase 2',
      client: 'Willmar Municipal Utilities',
      startDate: '2025-09-15',
      endDate: '2025-11-30',
      budget: 245000,
      actualCost: 159250,
      progress: 65,
      status: 'Active',
      footage: '12,450 ft',
      description: 'Installation of fiber optic cable infrastructure for Phase 2 of the city-wide broadband network. Includes directional drilling under major roadways and installation of conduit for fiber cable.',

      team: [
        { name: 'Tom Anderson', role: 'Project Manager', email: 'tanderson@willmarmu.gov' },
        { name: 'John Smith', role: 'Crew Lead', email: 'jsmith@midwestunderground.com' },
        { name: 'Mike Johnson', role: 'Operator', email: 'mjohnson@midwestunderground.com' }
      ],

      milestones: [
        { name: 'Site Survey Complete', date: '2025-09-20', status: 'Completed' },
        { name: 'Permits Obtained', date: '2025-09-25', status: 'Completed' },
        { name: 'Phase 1 Drilling', date: '2025-10-15', status: 'Completed' },
        { name: 'Phase 2 Drilling', date: '2025-11-01', status: 'In Progress' },
        { name: 'Fiber Installation', date: '2025-11-15', status: 'Pending' },
        { name: 'Final Inspection', date: '2025-11-30', status: 'Pending' }
      ],

      recentActivity: [
        { date: '2025-10-23', action: 'Bore log created', user: 'John Smith', details: 'County Rd 5 Bore #12 completed' },
        { date: '2025-10-22', action: 'Field report submitted', user: 'Mike Johnson', details: '485 ft drilled, 8.5 hours' },
        { date: '2025-10-21', action: 'Equipment assigned', user: 'System', details: 'Ditch Witch JT40 assigned to crew' }
      ]
    }

    if (!mockProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockProject
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()

    // In production:
    // const updated = await prisma.project.update({ where: { id }, data: body })

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
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // In production:
    // await prisma.project.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
