import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with Prisma in production
const mockFinancials = [
  {
    id: 1,
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    category: 'Labor',
    budgeted: 98000,
    actual: 64500,
    variance: 33500,
    variancePercent: 34,
    status: 'Under Budget'
  },
  {
    id: 2,
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    category: 'Equipment',
    budgeted: 52000,
    actual: 38250,
    variance: 13750,
    variancePercent: 26,
    status: 'Under Budget'
  },
  {
    id: 3,
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    category: 'Materials',
    budgeted: 75000,
    actual: 42500,
    variance: 32500,
    variancePercent: 43,
    status: 'Under Budget'
  },
  {
    id: 4,
    project: 'Willmar Fiber Network - Phase 2',
    projectId: 1,
    category: 'Subcontractors',
    budgeted: 20000,
    actual: 14000,
    variance: 6000,
    variancePercent: 30,
    status: 'Under Budget'
  },
  {
    id: 5,
    project: 'CenturyLink Expansion',
    projectId: 2,
    category: 'Labor',
    budgeted: 72000,
    actual: 18000,
    variance: 54000,
    variancePercent: 75,
    status: 'Under Budget'
  },
  {
    id: 6,
    project: 'CenturyLink Expansion',
    projectId: 2,
    category: 'Equipment',
    budgeted: 38000,
    actual: 9500,
    variance: 28500,
    variancePercent: 75,
    status: 'Under Budget'
  },
  {
    id: 7,
    project: 'CenturyLink Expansion',
    projectId: 2,
    category: 'Materials',
    budgeted: 55000,
    actual: 13750,
    variance: 41250,
    variancePercent: 75,
    status: 'Under Budget'
  },
  {
    id: 8,
    project: 'CenturyLink Expansion',
    projectId: 2,
    category: 'Subcontractors',
    budgeted: 15000,
    actual: 3750,
    variance: 11250,
    variancePercent: 75,
    status: 'Under Budget'
  },
  {
    id: 9,
    project: 'Rural Electric Co-op',
    projectId: 3,
    category: 'Labor',
    budgeted: 128000,
    actual: 35840,
    variance: 92160,
    variancePercent: 72,
    status: 'Under Budget'
  },
  {
    id: 10,
    project: 'Rural Electric Co-op',
    projectId: 3,
    category: 'Equipment',
    budgeted: 64000,
    actual: 17920,
    variance: 46080,
    variancePercent: 72,
    status: 'Under Budget'
  },
  {
    id: 11,
    project: 'Rural Electric Co-op',
    projectId: 3,
    category: 'Materials',
    budgeted: 96000,
    actual: 26880,
    variance: 69120,
    variancePercent: 72,
    status: 'Under Budget'
  },
  {
    id: 12,
    project: 'Rural Electric Co-op',
    projectId: 3,
    category: 'Subcontractors',
    budgeted: 32000,
    actual: 8960,
    variance: 23040,
    variancePercent: 72,
    status: 'Under Budget'
  }
]

// GET /api/financials - List all financial records
export async function GET(request: NextRequest) {
  try {
    // In production, this would be:
    // const financials = await prisma.financial.findMany({
    //   include: { project: true }
    // })

    // Calculate totals
    const totalBudgeted = mockFinancials.reduce((sum, f) => sum + f.budgeted, 0)
    const totalActual = mockFinancials.reduce((sum, f) => sum + f.actual, 0)
    const totalVariance = totalBudgeted - totalActual
    const variancePercent = ((totalVariance / totalBudgeted) * 100).toFixed(1)

    return NextResponse.json({
      success: true,
      data: mockFinancials,
      count: mockFinancials.length,
      summary: {
        totalBudgeted,
        totalActual,
        totalVariance,
        variancePercent: parseFloat(variancePercent)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch financial records' },
      { status: 500 }
    )
  }
}
