import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { savePhoto } from '@/lib/photo-storage'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const boreId = formData.get('boreId') as string | null
    const inspectionId = formData.get('inspectionId') as string | null
    const dailyReportId = formData.get('dailyReportId') as string | null

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Upload and save all photos
    const uploadedPhotos = []

    for (const file of files) {
      if (!(file instanceof File)) {
        continue
      }

      // Save to filesystem
      const uploadResult = await savePhoto(file, { generateThumbnail: true })

      // Save to database
      const photo = await prisma.photo.create({
        data: {
          filename: uploadResult.filename,
          url: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnailUrl,
          size: uploadResult.size,
          mimeType: uploadResult.mimeType,
          uploadedById: session.user.id,
          ...(boreId && { boreId }),
          ...(inspectionId && { inspectionId }),
          ...(dailyReportId && { dailyReportId })
        }
      })

      uploadedPhotos.push(photo)
    }

    return NextResponse.json({
      success: true,
      photos: uploadedPhotos,
      count: uploadedPhotos.length
    })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload photos' },
      { status: 500 }
    )
  }
}
