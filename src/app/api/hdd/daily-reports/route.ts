import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')

    const where: any = {}
    if (projectId) where.projectId = projectId
    if (status) where.status = status

    const reports = await prisma.dailyReport.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        reportDate: 'desc'
      }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching daily reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily reports' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const report = await prisma.dailyReport.create({
      data: {
        projectId: body.projectId,
        reportDate: new Date(body.reportDate),
        crew: body.crew || [],
        production: body.production || [],
        labor: body.labor || [],
        equipment: body.equipment || [],
        materials: body.materials || [],
        weather: body.weather || {},
        photos: body.photos || [],
        notes: body.notes || '',
        status: body.status || 'DRAFT',
        createdById: session.user.id as string
      }
    })

    // Create audit record
    await prisma.reportAudit.create({
      data: {
        reportId: report.id,
        changes: body,
        snapshot: report,
        changedById: session.user.id as string
      }
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error('Error creating daily report:', error)
    return NextResponse.json(
      { error: 'Failed to create daily report' },
      { status: 500 }
    )
  }
}
