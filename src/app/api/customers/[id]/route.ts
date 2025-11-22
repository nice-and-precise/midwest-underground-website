import { NextRequest, NextResponse } from 'next/server'

// GET /api/customers/[id] - Get single customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    // In production:
    // const customer = await prisma.customer.findUnique({
    //   where: { id },
    //   include: { projects: true, contacts: true, revenueHistory: true, notes: true }
    // })

    const mockCustomer = {
      id,
      name: 'Willmar Municipal Utilities',
      contactPerson: 'Tom Anderson',
      email: 'tanderson@willmarmu.gov',
      phone: '(320) 235-4422',
      address: '333 6th St SW, Willmar, MN 56201',
      type: 'Municipal',
      status: 'Active',
      since: '2018-03-15',
      totalRevenue: 1245000,
      currentProjects: 2,
      completedProjects: 8,
      website: 'https://www.willmarmn.gov',

      projects: [
        {
          id: 1,
          name: 'Willmar Fiber Network - Phase 2',
          status: 'Active',
          startDate: '2025-09-15',
          endDate: '2025-11-30',
          budget: 245000,
          progress: 65
        },
        {
          id: 6,
          name: 'Downtown Fiber Loop',
          status: 'Active',
          startDate: '2025-10-10',
          endDate: '2025-12-20',
          budget: 180000,
          progress: 40
        }
      ],

      revenueHistory: [
        { year: 2025, revenue: 425000, projects: 2 },
        { year: 2024, revenue: 520000, projects: 4 },
        { year: 2023, revenue: 180000, projects: 2 },
        { year: 2022, revenue: 120000, projects: 2 }
      ],

      contacts: [
        { name: 'Tom Anderson', role: 'Project Manager', email: 'tanderson@willmarmu.gov', phone: '(320) 235-4422' },
        { name: 'Sarah Miller', role: 'Procurement Director', email: 'smiller@willmarmu.gov', phone: '(320) 235-4423' }
      ],

      notes: [
        { date: '2025-10-20', user: 'System', note: 'Phase 2 project progressing ahead of schedule' },
        { date: '2025-10-15', user: 'John Smith', note: 'Met with Tom Anderson on-site to discuss expansion plans for 2026' }
      ]
    }

    if (!mockCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mockCustomer
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)
    const body = await request.json()

    // In production:
    // const updated = await prisma.customer.update({ where: { id }, data: body })

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
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    )
  }
}

// DELETE /api/customers/[id] - Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId)

    // In production:
    // await prisma.customer.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    )
  }
}
