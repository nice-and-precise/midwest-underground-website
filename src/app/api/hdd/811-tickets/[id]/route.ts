import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ticket811UpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/hdd/811-tickets/[id] - Get single 811 ticket with responses
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ticket811 = await prisma.ticket811.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            customerName: true
          }
        },
        responses: {
          include: {
            respondedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          },
          orderBy: {
            responseDate: 'desc'
          }
        }
      }
    });

    if (!ticket811) {
      return Response.json(
        { error: '811 ticket not found' },
        { status: 404 }
      );
    }

    return Response.json({ ticket811 });
  } catch (error) {
    console.error('Error fetching 811 ticket:', error);
    return Response.json(
      { error: 'Failed to fetch 811 ticket' },
      { status: 500 }
    );
  }
}

// PUT /api/hdd/811-tickets/[id] - Update 811 ticket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = ticket811UpdateSchema.parse(body);

    // Check if ticket exists
    const existingTicket = await prisma.ticket811.findUnique({
      where: { id }
    });

    if (!existingTicket) {
      return Response.json(
        { error: '811 ticket not found' },
        { status: 404 }
      );
    }

    // Update ticket
    const ticket811 = await prisma.ticket811.update({
      where: { id },
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        responses: {
          include: {
            respondedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            responseDate: 'desc'
          }
        }
      }
    });

    return Response.json({ ticket811 });
  } catch (error) {
    console.error('Error updating 811 ticket:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update 811 ticket' },
      { status: 500 }
    );
  }
}

// DELETE /api/hdd/811-tickets/[id] - Delete 811 ticket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if ticket exists
    const existingTicket = await prisma.ticket811.findUnique({
      where: { id }
    });

    if (!existingTicket) {
      return Response.json(
        { error: '811 ticket not found' },
        { status: 404 }
      );
    }

    // Delete ticket (cascades to responses)
    await prisma.ticket811.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: '811 ticket deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting 811 ticket:', error);
    return Response.json(
      { error: 'Failed to delete 811 ticket' },
      { status: 500 }
    );
  }
}
