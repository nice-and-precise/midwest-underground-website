import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ticket811ResponseCreateSchema } from '@/lib/validations';
import { z } from 'zod';

// POST /api/hdd/811-tickets/[id]/responses - Add response to existing ticket
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = ticket811ResponseCreateSchema.parse(body);

    // Check if ticket exists
    const ticket = await prisma.ticket811.findUnique({
      where: { id }
    });

    if (!ticket) {
      return Response.json(
        { error: '811 ticket not found' },
        { status: 404 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: validatedData.respondedById }
    });

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create response
    const response = await prisma.ticket811Response.create({
      data: {
        ticketId: id,
        utilityName: validatedData.utilityName,
        responseType: validatedData.responseType,
        responseDate: validatedData.responseDate,
        locatePhotos: validatedData.locatePhotos || [],
        marksDescription: validatedData.marksDescription,
        respondedById: validatedData.respondedById
      },
      include: {
        respondedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            project: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    return Response.json({ response }, { status: 201 });
  } catch (error) {
    console.error('Error creating ticket response:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create ticket response' },
      { status: 500 }
    );
  }
}
