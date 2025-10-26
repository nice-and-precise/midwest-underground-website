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
        totalLength: body.rodPasses.reduce((sum: number, pass: any) => sum + pass.linearFeet, 0),
        status: 'COMPLETED'
      },
      create: {
        id: body.boreId,
        projectId: body.projectId,
        name: body.name || `Bore ${body.boreId}`,
        totalLength: body.rodPasses.reduce((sum: number, pass: any) => sum + pass.linearFeet, 0),
        diameterIn: body.pipeSize ? parseFloat(body.pipeSize) : null,
        productMaterial: body.pipeType || null,
        status: 'COMPLETED'
      }
    })

    // Create rod passes
    const rodPassPromises = body.rodPasses.map((pass: any) => {
      return prisma.rodPass.create({
        data: {
          boreId: bore.id,
          sequence: pass.sequence || pass.passNumber,
          passNumber: pass.passNumber,
          linearFeet: pass.linearFeet,
          startedAt: pass.startTime ? new Date(pass.startTime) : null,
          completedAt: pass.endTime ? new Date(pass.endTime) : null,
          fluidMix: pass.fluidMix || null,
          fluidVolumeGal: pass.fluidVolumeGal || null,
          notes: pass.notes || null,
          loggedById: session.user.id as string
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
