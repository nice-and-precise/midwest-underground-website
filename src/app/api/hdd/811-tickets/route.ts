import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ticket811CreateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/hdd/811-tickets - List all 811 tickets with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status as any;

    const tickets811 = await prisma.ticket811.findMany({
      where,
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
      },
      orderBy: {
        ticketDate: 'desc'
      }
    });

    return Response.json({ tickets811 });
  } catch (error) {
    console.error('Error fetching 811 tickets:', error);
    return Response.json(
      { error: 'Failed to fetch 811 tickets' },
      { status: 500 }
    );
  }
}

// POST /api/hdd/811-tickets - Create new 811 ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = ticket811CreateSchema.parse(body);

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

    // Create 811 ticket
    const ticket811 = await prisma.ticket811.create({
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        responses: true
      }
    });

    return Response.json({ ticket811 }, { status: 201 });
  } catch (error) {
    console.error('Error creating 811 ticket:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create 811 ticket' },
      { status: 500 }
    );
  }
}
