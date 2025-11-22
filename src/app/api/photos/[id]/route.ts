import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { deletePhoto } from '@/lib/photo-storage'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get photo to delete
    const photo = await prisma.photo.findUnique({
      where: { id }
    })

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    // Check if user owns the photo or is OWNER/SUPER
    if (photo.uploadedById !== session.user.id &&
        session.user.role !== 'OWNER' &&
        session.user.role !== 'SUPER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete from filesystem
    await deletePhoto(photo.filename)

    // Delete from database
    await prisma.photo.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    )
  }
}
