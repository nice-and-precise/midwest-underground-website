import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { boreSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/bore-logs - List all bores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const projectId = searchParams.get('projectId');

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (projectId) {
      where.projectId = projectId;
    }

    const bores = await prisma.bore.findMany({
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
        entryPit: {
          select: {
            id: true,
            type: true,
            location: true,
            elevation: true
          }
        },
        exitPit: {
          select: {
            id: true,
            type: true,
            location: true,
            elevation: true
          }
        },
        _count: {
          select: {
            rodPasses: true,
            inspections: true,
            rfis: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json({ bores });
  } catch (error) {
    console.error('Error fetching bores:', error);
    return Response.json(
      { error: 'Failed to fetch bores' },
      { status: 500 }
    );
  }
}

// POST /api/bore-logs - Create new bore
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = boreSchema.parse(body);

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

    // Create bore
    const bore = await prisma.bore.create({
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
            rfis: true
          }
        }
      }
    });

    return Response.json({ bore }, { status: 201 });
  } catch (error) {
    console.error('Error creating bore:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create bore' },
      { status: 500 }
    );
  }
}
