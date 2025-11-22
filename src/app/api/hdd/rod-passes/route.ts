import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rodPassCreateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/hdd/rod-passes - List all rod passes with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boreId = searchParams.get('boreId');
    const passNumber = searchParams.get('passNumber');

    // Build where clause
    const where: any = {};
    if (boreId) where.boreId = boreId;
    if (passNumber) where.passNumber = parseInt(passNumber);

    const rodPasses = await prisma.rodPass.findMany({
      where,
      include: {
        bore: {
          select: {
            id: true,
            name: true,
            status: true,
            projectId: true,
            diameterIn: true,
            productMaterial: true,
            totalLength: true
          }
        },
        loggedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: [
        { boreId: 'asc' },
        { sequence: 'asc' }
      ]
    });

    return Response.json({ rodPasses });
  } catch (error) {
    console.error('Error fetching rod passes:', error);
    return Response.json(
      { error: 'Failed to fetch rod passes' },
      { status: 500 }
    );
  }
}

// POST /api/hdd/rod-passes - Create new rod pass
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = rodPassCreateSchema.parse(body);

    // Verify bore exists
    const bore = await prisma.bore.findUnique({
      where: { id: validatedData.boreId }
    });

    if (!bore) {
      return Response.json(
        { error: 'Bore not found' },
        { status: 404 }
      );
    }

    // For now, use first user as loggedById (in production, use session)
    // TODO: Replace with actual session user ID when auth is implemented
    const users = await prisma.user.findMany({ take: 1 });
    const loggedById = users[0]?.id;

    if (!loggedById) {
      return Response.json(
        { error: 'No users found in system' },
        { status: 500 }
      );
    }

    // Create rod pass
    const rodPass = await prisma.rodPass.create({
      data: {
        ...validatedData,
        loggedById
      },
      include: {
        bore: {
          select: {
            id: true,
            name: true,
            status: true,
            projectId: true,
            diameterIn: true,
            productMaterial: true,
            totalLength: true
          }
        },
        loggedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    // Update bore total length if needed
    const allPasses = await prisma.rodPass.findMany({
      where: { boreId: validatedData.boreId },
      select: { linearFeet: true }
    });

    const totalLength = allPasses.reduce((sum, pass) => sum + pass.linearFeet, 0);

    await prisma.bore.update({
      where: { id: validatedData.boreId },
      data: { totalLength }
    });

    return Response.json({ rodPass }, { status: 201 });
  } catch (error) {
    console.error('Error creating rod pass:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create rod pass' },
      { status: 500 }
    );
  }
}
