import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { costCategoryCreateSchema } from '@/lib/validations';

/**
 * GET /api/cost-categories
 * Get all cost categories
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const categories = await prisma.costCategory.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { costItems: true }
        }
      }
    });

    const response = NextResponse.json(categories);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Categories API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cost-categories
 * Create a new cost category
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const body = await request.json();
    const validationResult = costCategoryCreateSchema.safeParse(body);

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

    const category = await prisma.costCategory.create({
      data: validationResult.data
    });

    const response = NextResponse.json(category, { status: 201 });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Categories API] Error:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create cost category' },
      { status: 500 }
    );
  }
}
