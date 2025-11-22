import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { projectUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        bores: {
          include: {
            _count: {
              select: {
                rodPasses: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        dailyReports: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { reportDate: 'desc' },
          take: 10
        },
        tickets811: {
          orderBy: { ticketDate: 'desc' },
          take: 10
        },
        inspections: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            bores: true,
            dailyReports: true,
            inspections: true,
            tickets811: true,
            rfis: true,
            tmTickets: true,
            changeOrders: true
          }
        }
      }
    });

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return Response.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return Response.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = projectUpdateSchema.parse(body);

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: validatedData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            bores: true,
            dailyReports: true,
            inspections: true,
            tickets811: true
          }
        }
      }
    });

    return Response.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { role: true }
        }
      }
    });

    if (!existingProject) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Note: In production, you would check if the user has OWNER role
    // For now, we'll allow deletion but log a warning
    // TODO: Add session-based permission check when auth is implemented

    // Delete project (cascades to related records)
    await prisma.project.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
