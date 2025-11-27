import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { estimateCreateSchema } from '@/lib/validations';
import { auth } from '@/auth';

/**
 * GET /api/estimates
 * Get all estimates with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { customerName: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const estimates = await prisma.estimate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { lines: true }
        }
      }
    });

    const response = NextResponse.json(estimates);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimates API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/estimates
 * Create a new estimate
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = estimateCreateSchema.safeParse(body);

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

    // If projectId is provided, verify it exists
    if (validationResult.data.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: validationResult.data.projectId }
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
    }

    const estimate = await prisma.estimate.create({
      data: {
        ...validationResult.data,
        createdById: session.user.id
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    const response = NextResponse.json(estimate, { status: 201 });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimates API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create estimate' },
      { status: 500 }
    );
  }
}
