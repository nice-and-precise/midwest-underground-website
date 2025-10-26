import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Create or update bore
    const bore = await prisma.bore.upsert({
      where: { id: body.boreId },
      update: {
        totalDepth: body.targetDepth,
        linearFeet: body.rodPasses.reduce((sum: number, pass: any) => sum + pass.linearFeet, 0)
      },
      create: {
        id: body.boreId,
        projectId: body.projectId,
        plannedDate: new Date(body.startDate),
        crew: body.crew,
        location: body.location || {},
        totalDepth: body.targetDepth,
        linearFeet: body.rodPasses.reduce((sum: number, pass: any) => sum + pass.linearFeet, 0),
        pipeSize: body.pipeSize,
        pipeType: body.pipeType,
        status: 'COMPLETED',
        createdById: session.user.id as string
      }
    })

    // Create rod passes
    const rodPassPromises = body.rodPasses.map((pass: any) => {
      return prisma.rodPass.create({
        data: {
          boreId: bore.id,
          passNumber: pass.passNumber,
          linearFeet: pass.linearFeet,
          startTime: new Date(pass.startTime),
          endTime: pass.endTime ? new Date(pass.endTime) : null,
          fluidMix: pass.fluidMix,
          fluidVolumeGal: pass.fluidVolumeGal,
          pumpPressure: pass.pumpPressure,
          notes: pass.notes || '',
          events: pass.events || []
        }
      })
    })

    await Promise.all(rodPassPromises)

    return NextResponse.json({ bore, passesCreated: body.rodPasses.length }, { status: 201 })
  } catch (error) {
    console.error('Error creating rod passes:', error)
    return NextResponse.json(
      { error: 'Failed to create rod passes' },
      { status: 500 }
    )
  }
}
