import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { boreUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/bore-logs/[id] - Get single bore
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bore = await prisma.bore.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            customerName: true,
            customerContact: true,
            startDate: true,
            endDate: true
          }
        },
        entryPit: {
          select: {
            id: true,
            type: true,
            location: true,
            elevation: true,
            notes: true,
            photos: true
          }
        },
        exitPit: {
          select: {
            id: true,
            type: true,
            location: true,
            elevation: true,
            notes: true,
            photos: true
          }
        },
        rodPasses: {
          include: {
            loggedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { sequence: 'asc' }
        },
        inspections: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        rfis: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            respondedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        events: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { timestamp: 'desc' }
        },
        _count: {
          select: {
            rodPasses: true,
            inspections: true,
            rfis: true,
            events: true
          }
        }
      }
    });

    if (!bore) {
      return Response.json(
        { error: 'Bore not found' },
        { status: 404 }
      );
    }

    return Response.json({ bore });
  } catch (error) {
    console.error('Error fetching bore:', error);
    return Response.json(
      { error: 'Failed to fetch bore' },
      { status: 500 }
    );
  }
}

// PUT /api/bore-logs/[id] - Update bore
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = boreUpdateSchema.parse(body);

    // Check if bore exists
    const existingBore = await prisma.bore.findUnique({
      where: { id }
    });

    if (!existingBore) {
      return Response.json(
        { error: 'Bore not found' },
        { status: 404 }
      );
    }

    // Verify pits exist if provided
    if (validatedData.entryPitId) {
      const entryPit = await prisma.pit.findUnique({
        where: { id: validatedData.entryPitId }
      });
      if (!entryPit) {
        return Response.json(
          { error: 'Entry pit not found' },
          { status: 404 }
        );
      }
    }

    if (validatedData.exitPitId) {
      const exitPit = await prisma.pit.findUnique({
        where: { id: validatedData.exitPitId }
      });
      if (!exitPit) {
        return Response.json(
          { error: 'Exit pit not found' },
          { status: 404 }
        );
      }
    }

    // Update bore
    const bore = await prisma.bore.update({
      where: { id },
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            customerName: true
          }
        },
        entryPit: true,
        exitPit: true,
        _count: {
          select: {
            rodPasses: true,
            inspections: true,
            rfis: true,
            events: true
          }
        }
      }
    });

    return Response.json({ bore });
  } catch (error) {
    console.error('Error updating bore:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update bore' },
      { status: 500 }
    );
  }
}

// DELETE /api/bore-logs/[id] - Delete bore
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if bore exists
    const existingBore = await prisma.bore.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            createdBy: {
              select: { role: true }
            }
          }
        }
      }
    });

    if (!existingBore) {
      return Response.json(
        { error: 'Bore not found' },
        { status: 404 }
      );
    }

    // Note: In production, you would check if the user has OWNER/SUPER role
    // For now, we'll allow deletion but log a warning
    // TODO: Add session-based permission check when auth is implemented

    // Delete bore (cascades to rod passes)
    await prisma.bore.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Bore deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bore:', error);
    return Response.json(
      { error: 'Failed to delete bore' },
      { status: 500 }
    );
  }
}
