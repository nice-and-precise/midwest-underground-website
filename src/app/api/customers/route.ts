import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockCustomers = [
  {
    id: 1,
    name: 'Willmar Municipal Utilities',
    contactPerson: 'Tom Anderson',
    email: 'tanderson@willmarmu.gov',
    phone: '(320) 235-4422',
    type: 'Municipal',
    status: 'Active',
    activeProjects: 2,
    totalRevenue: 1245000
  },
  {
    id: 2,
    name: 'CenturyLink Communications',
    contactPerson: 'Sarah Johnson',
    email: 'sjohnson@centurylink.com',
    phone: '(800) 244-1111',
    type: 'Telecom',
    status: 'Active',
    activeProjects: 1,
    totalRevenue: 680000
  },
  {
    id: 3,
    name: 'Kandiyohi Power Cooperative',
    contactPerson: 'Mike Stevens',
    email: 'mstevens@kpc.coop',
    phone: '(320) 231-4500',
    type: 'Utility Cooperative',
    status: 'Active',
    activeProjects: 1,
    totalRevenue: 520000
  },
  {
    id: 4,
    name: 'Xcel Energy',
    contactPerson: 'Jennifer Martinez',
    email: 'jennifer.martinez@xcelenergy.com',
    phone: '(800) 895-4999',
    type: 'Electric Utility',
    status: 'Active',
    activeProjects: 0,
    totalRevenue: 340000
  },
  {
    id: 5,
    name: 'City of Willmar',
    contactPerson: 'Bob Wilson',
    email: 'bwilson@willmarmn.gov',
    phone: '(320) 235-4913',
    type: 'Municipal',
    status: 'Active',
    activeProjects: 1,
    totalRevenue: 285000
  }
]

// GET /api/customers - List all customers
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const customers = await prisma.customer.findMany({
    //   include: { projects: true }
    // })

    return NextResponse.json({
      success: true,
      data: mockCustomers,
      count: mockCustomers.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

// POST /api/customers - Create new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would be:
    // const newCustomer = await prisma.customer.create({ data: body })

    const newCustomer = {
      id: mockCustomers.length + 1,
      ...body,
      status: body.status || 'Active',
      activeProjects: 0,
      totalRevenue: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: newCustomer
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
