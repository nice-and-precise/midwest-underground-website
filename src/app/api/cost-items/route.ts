import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { costItemCreateSchema } from '@/lib/validations';

/**
 * GET /api/cost-items
 * Get all cost items with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const costItems = await prisma.costItem.findMany({
      where,
      orderBy: [
        { category: { sortOrder: 'asc' } },
        { code: 'asc' }
      ],
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    const response = NextResponse.json(costItems);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Items API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cost-items
 * Create a new cost item
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const body = await request.json();
    const validationResult = costItemCreateSchema.safeParse(body);

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

    // Verify category exists
    const category = await prisma.costCategory.findUnique({
      where: { id: validationResult.data.categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Cost category not found' },
        { status: 404 }
      );
    }

    const costItem = await prisma.costItem.create({
      data: validationResult.data,
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    const response = NextResponse.json(costItem, { status: 201 });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Cost Items API] Error:', error);

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A cost item with this code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create cost item' },
      { status: 500 }
    );
  }
}
