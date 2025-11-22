import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rodPassUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/hdd/rod-passes/[id] - Get single rod pass with relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rodPass = await prisma.rodPass.findUnique({
      where: { id },
      include: {
        bore: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true,
                location: true,
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
            }
          }
        },
        loggedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true
          }
        }
      }
    });

    if (!rodPass) {
      return Response.json(
        { error: 'Rod pass not found' },
        { status: 404 }
      );
    }

    return Response.json({ rodPass });
  } catch (error) {
    console.error('Error fetching rod pass:', error);
    return Response.json(
      { error: 'Failed to fetch rod pass' },
      { status: 500 }
    );
  }
}

// PUT /api/hdd/rod-passes/[id] - Update existing rod pass
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = rodPassUpdateSchema.parse(body);

    // Check if rod pass exists
    const existingRodPass = await prisma.rodPass.findUnique({
      where: { id }
    });

    if (!existingRodPass) {
      return Response.json(
        { error: 'Rod pass not found' },
        { status: 404 }
      );
    }

    // Update rod pass
    const rodPass = await prisma.rodPass.update({
      where: { id },
      data: validatedData,
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

    // Update bore total length if linearFeet changed
    if (validatedData.linearFeet !== undefined) {
      const allPasses = await prisma.rodPass.findMany({
        where: { boreId: existingRodPass.boreId },
        select: { linearFeet: true }
      });

      const totalLength = allPasses.reduce((sum, pass) => sum + pass.linearFeet, 0);

      await prisma.bore.update({
        where: { id: existingRodPass.boreId },
        data: { totalLength }
      });
    }

    return Response.json({ rodPass });
  } catch (error) {
    console.error('Error updating rod pass:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update rod pass' },
      { status: 500 }
    );
  }
}

// DELETE /api/hdd/rod-passes/[id] - Delete rod pass
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if rod pass exists
    const existingRodPass = await prisma.rodPass.findUnique({
      where: { id }
    });

    if (!existingRodPass) {
      return Response.json(
        { error: 'Rod pass not found' },
        { status: 404 }
      );
    }

    // Note: In production, you would check if the user has appropriate permissions
    // For now, we'll allow deletion but log a warning
    // TODO: Add session-based permission check when auth is implemented

    const boreId = existingRodPass.boreId;

    // Delete rod pass
    await prisma.rodPass.delete({
      where: { id }
    });

    // Update bore total length after deletion
    const allPasses = await prisma.rodPass.findMany({
      where: { boreId },
      select: { linearFeet: true }
    });

    const totalLength = allPasses.reduce((sum, pass) => sum + pass.linearFeet, 0);

    await prisma.bore.update({
      where: { id: boreId },
      data: { totalLength }
    });

    return Response.json({
      success: true,
      message: 'Rod pass deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rod pass:', error);
    return Response.json(
      { error: 'Failed to delete rod pass' },
      { status: 500 }
    );
  }
}
