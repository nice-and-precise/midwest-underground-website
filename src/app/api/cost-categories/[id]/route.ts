import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { costCategoryUpdateSchema } from '@/lib/validations';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/cost-categories/[id]
 * Get a specific cost category
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const category = await prisma.costCategory.findUnique({
      where: { id },
      include: {
        costItems: {
          where: { isActive: true },
          orderBy: { code: 'asc' }
        }
      }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Cost category not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(category);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Categories API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost category' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cost-categories/[id]
 * Update a cost category
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const body = await request.json();
    const validationResult = costCategoryUpdateSchema.safeParse(body);

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

    const category = await prisma.costCategory.update({
      where: { id },
      data: validationResult.data
    });

    const response = NextResponse.json(category);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Categories API] Error:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Cost category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update cost category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cost-categories/[id]
 * Delete a cost category (soft delete by setting isActive = false)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Soft delete - set isActive to false
    const category = await prisma.costCategory.update({
      where: { id },
      data: { isActive: false }
    });

    const response = NextResponse.json({
      message: 'Cost category deactivated',
      category
    });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Categories API] Error:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Cost category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete cost category' },
      { status: 500 }
    );
  }
}
