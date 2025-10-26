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

    const where: any = {}
    if (projectId) where.projectId = projectId

    const tickets = await prisma.ticket811.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        responses: {
          orderBy: {
            responseDate: 'desc'
          }
        }
      },
      orderBy: {
        ticketDate: 'desc'
      }
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching 811 tickets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch 811 tickets' },
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

    const ticket = await prisma.ticket811.create({
      data: {
        ticketNumber: body.ticketNumber,
        projectId: body.projectId,
        ticketDate: new Date(body.ticketDate),
        expirationDate: new Date(body.expirationDate),
        location: body.location,
        type: body.type || 'NORMAL',
        status: body.status || 'ACTIVE'
      }
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (error) {
    console.error('Error creating 811 ticket:', error)
    return NextResponse.json(
      { error: 'Failed to create 811 ticket' },
      { status: 500 }
    )
  }
}
