import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { calculateProjectKPIs } from '@/lib/services/kpiService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')

    const startDate = startDateStr ? new Date(startDateStr) : undefined
    const endDate = endDateStr ? new Date(endDateStr) : undefined

    const kpis = await calculateProjectKPIs(id, startDate, endDate)

    return NextResponse.json({
      success: true,
      projectId: id,
      kpis,
      period: startDate && endDate
        ? `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
        : 'Last 30 days'
    })
  } catch (error) {
    console.error('Error fetching project KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project KPIs' },
      { status: 500 }
    )
  }
}
