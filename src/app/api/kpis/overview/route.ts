import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { calculateOverviewKPIs } from '@/lib/services/kpiService'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only OWNER and SUPER can view company-wide KPIs
    if (session.user.role !== 'OWNER' && session.user.role !== 'SUPER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const kpis = await calculateOverviewKPIs()

    return NextResponse.json({
      success: true,
      kpis,
      period: 'Last 30 days'
    })
  } catch (error) {
    console.error('Error fetching overview KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch overview KPIs' },
      { status: 500 }
    )
  }
}
