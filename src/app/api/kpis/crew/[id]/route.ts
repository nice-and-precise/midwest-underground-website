import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { calculateCrewKPIs } from '@/lib/services/kpiService'

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

    // Only OWNER/SUPER can view other crew members' KPIs
    if (id !== session.user.id &&
        session.user.role !== 'OWNER' &&
        session.user.role !== 'SUPER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')

    const startDate = startDateStr ? new Date(startDateStr) : undefined
    const endDate = endDateStr ? new Date(endDateStr) : undefined

    const kpis = await calculateCrewKPIs(id, startDate, endDate)

    return NextResponse.json({
      success: true,
      crewMemberId: id,
      kpis,
      period: startDate && endDate
        ? `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`
        : 'Last 30 days'
    })
  } catch (error) {
    console.error('Error fetching crew KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crew KPIs' },
      { status: 500 }
    )
  }
}
