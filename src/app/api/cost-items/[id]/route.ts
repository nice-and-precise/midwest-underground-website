import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { costItemUpdateSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/cost-items/[id]
 * Get a specific cost item
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const costItem = await prisma.costItem.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    if (!costItem) {
      return NextResponse.json(
        { error: 'Cost item not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(costItem);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Items API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost item' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cost-items/[id]
 * Update a cost item
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const body = await request.json();
    const validationResult = costItemUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return withRateLimitHeaders(
        NextResponse.json(
          {
            error: 'Validation Error',
            details: validationResult.error.flatten().fieldErrors,
          },
          { status: 400 }
        ),
        rateLimitResult.headers
      );
    }

    // If categoryId is being updated, verify it exists
    if (validationResult.data.categoryId) {
      const category = await prisma.costCategory.findUnique({
        where: { id: validationResult.data.categoryId }
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Cost category not found' },
          { status: 404 }
        );
      }
    }

    const costItem = await prisma.costItem.update({
      where: { id },
      data: validationResult.data,
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    const response = NextResponse.json(costItem);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Items API] Error:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Cost item not found' },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A cost item with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update cost item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cost-items/[id]
 * Delete a cost item (soft delete by setting isActive = false)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Soft delete - set isActive to false
    const costItem = await prisma.costItem.update({
      where: { id },
      data: { isActive: false }
    });

    const response = NextResponse.json({
      message: 'Cost item deactivated',
      costItem
    });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Items API] Error:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Cost item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete cost item' },
      { status: 500 }
    );
  }
}
