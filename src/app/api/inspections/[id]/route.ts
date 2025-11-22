import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inspectionUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/inspections/[id] - Get single inspection with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const inspection = await prisma.inspection.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            customerName: true,
            customerContact: true,
            location: true
          }
        },
        bore: {
          select: {
            id: true,
            name: true,
            status: true,
            diameterIn: true,
            productMaterial: true,
            totalLength: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        correctiveActions: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!inspection) {
      return Response.json(
        { error: 'Inspection not found' },
        { status: 404 }
      );
    }

    return Response.json({ inspection });
  } catch (error) {
    console.error('Error fetching inspection:', error);
    return Response.json(
      { error: 'Failed to fetch inspection' },
      { status: 500 }
    );
  }
}

// PUT /api/inspections/[id] - Update inspection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = inspectionUpdateSchema.parse(body);

    // Check if inspection exists
    const existingInspection = await prisma.inspection.findUnique({
      where: { id }
    });

    if (!existingInspection) {
      return Response.json(
        { error: 'Inspection not found' },
        { status: 404 }
      );
    }

    // Verify bore exists if provided
    if (validatedData.boreId) {
      const bore = await prisma.bore.findUnique({
        where: { id: validatedData.boreId }
      });

      if (!bore) {
        return Response.json(
          { error: 'Bore not found' },
          { status: 404 }
        );
      }
    }

    // Verify assignee exists if provided
    if (validatedData.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: validatedData.assigneeId }
      });

      if (!assignee) {
        return Response.json(
          { error: 'Assignee user not found' },
          { status: 404 }
        );
      }
    }

    // Update inspection
    const inspection = await prisma.inspection.update({
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
        bore: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        correctiveActions: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    return Response.json({ inspection });
  } catch (error) {
    console.error('Error updating inspection:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update inspection' },
      { status: 500 }
    );
  }
}

// DELETE /api/inspections/[id] - Delete inspection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if inspection exists
    const existingInspection = await prisma.inspection.findUnique({
      where: { id }
    });

    if (!existingInspection) {
      return Response.json(
        { error: 'Inspection not found' },
        { status: 404 }
      );
    }

    // Delete inspection (cascades to corrective actions)
    await prisma.inspection.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Inspection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inspection:', error);
    return Response.json(
      { error: 'Failed to delete inspection' },
      { status: 500 }
    );
  }
}
