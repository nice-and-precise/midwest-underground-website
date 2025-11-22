import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { calculateProjectKPIs, getDailyProductionTrend } from '@/lib/services/kpiService'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const trend = searchParams.get('trend')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // If requesting production trend
    if (trend === 'production') {
      const days = parseInt(searchParams.get('days') || '30')
      const trendData = await getDailyProductionTrend(projectId, days)
      return NextResponse.json(trendData)
    }

    // Calculate KPIs
    const startDate = startDateStr ? new Date(startDateStr) : undefined
    const endDate = endDateStr ? new Date(endDateStr) : undefined

    const kpis = await calculateProjectKPIs(projectId, startDate, endDate)

    return NextResponse.json(kpis)
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    )
  }
}
