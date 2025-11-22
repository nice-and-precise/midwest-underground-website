import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { inspectionCreateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/inspections - List all inspections with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boreId = searchParams.get('boreId');
    const projectId = searchParams.get('projectId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    if (boreId) where.boreId = boreId;
    if (projectId) where.projectId = projectId;
    if (assigneeId) where.assigneeId = assigneeId;
    if (status) where.status = status as any;

    const inspections = await prisma.inspection.findMany({
      where,
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
        _count: {
          select: {
            correctiveActions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return Response.json({ inspections });
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return Response.json(
      { error: 'Failed to fetch inspections' },
      { status: 500 }
    );
  }
}

// POST /api/inspections - Create new inspection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = inspectionCreateSchema.parse(body);

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId }
    });

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
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

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { id: validatedData.createdById }
    });

    if (!creator) {
      return Response.json(
        { error: 'Creator user not found' },
        { status: 404 }
      );
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

    // Create inspection
    const inspection = await prisma.inspection.create({
      data: {
        ...validatedData,
        items: validatedData.items || []
      },
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
        }
      }
    });

    return Response.json({ inspection }, { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create inspection' },
      { status: 500 }
    );
  }
}
