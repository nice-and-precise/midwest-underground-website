import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // In production:
    // const response = await prisma.ticket811Response.create({
    //   data: {
    //     ticketId: id,
    //     utilityName: body.utilityName,
    //     responseType: body.responseType,
    //     responseDate: new Date(body.responseDate),
    //     locatePhotos: body.locatePhotos || [],
    //     ticket: { connect: { id: parseInt(id) } },
    //     respondedBy: { connect: { id: session.user.id } }
    //   }
    // })

    const mockResponse = {
      id: Math.floor(Math.random() * 1000),
      ticketId: id,
      utilityName: body.utilityName,
      responseType: body.responseType,
      responseDate: new Date(body.responseDate).toISOString(),
      locatePhotos: body.locatePhotos || [],
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(mockResponse, { status: 201 })
  } catch (error) {
    console.error('Error creating ticket response:', error)
    return NextResponse.json(
      { error: 'Failed to create ticket response' },
      { status: 500 }
    )
  }
}
