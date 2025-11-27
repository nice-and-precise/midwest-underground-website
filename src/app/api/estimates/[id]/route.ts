import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { estimateUpdateSchema } from '@/lib/validations';
import { calculateEstimateTotals, roundToCents } from '@/lib/services/costCalculator';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/estimates/[id]
 * Get a specific estimate with all lines
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const estimate = await prisma.estimate.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, customerName: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        lines: {
          orderBy: { lineNumber: 'asc' },
          include: {
            costItem: {
              select: { id: true, code: true, name: true, unit: true }
            }
          }
        }
      }
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(estimate);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimates API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimate' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/estimates/[id]
 * Update an estimate
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const body = await request.json();
    const validationResult = estimateUpdateSchema.safeParse(body);

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

    // If projectId is being updated, verify it exists
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

    const estimate = await prisma.estimate.update({
      where: { id },
      data: validationResult.data,
      include: {
        project: {
          select: { id: true, name: true }
        },
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        lines: {
          orderBy: { lineNumber: 'asc' }
        }
      }
    });

    const response = NextResponse.json(estimate);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimates API] Error:', error);

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update estimate' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/estimates/[id]
 * Delete an estimate and all its lines
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Delete estimate (lines cascade delete)
    await prisma.estimate.delete({
      where: { id }
    });

    const response = NextResponse.json({
      message: 'Estimate deleted successfully'
    });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimates API] Error:', error);

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete estimate' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/estimates/[id]
 * Recalculate estimate totals from lines
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Get estimate with lines
    const estimate = await prisma.estimate.findUnique({
      where: { id },
      include: { lines: true }
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    // Calculate totals
    const totals = calculateEstimateTotals(
      estimate.lines.map(line => ({
        subtotal: line.subtotal,
        quantity: line.quantity,
        markup: line.markup
      })),
      estimate.markupPercent,
      estimate.taxPercent
    );

    // Update estimate with calculated totals
    const updatedEstimate = await prisma.estimate.update({
      where: { id },
      data: {
        subtotal: roundToCents(totals.subtotal),
        markupAmount: roundToCents(totals.markupAmount),
        taxAmount: roundToCents(totals.taxAmount),
        total: roundToCents(totals.total)
      },
      include: {
        project: {
          select: { id: true, name: true }
        },
        lines: {
          orderBy: { lineNumber: 'asc' }
        }
      }
    });

    const response = NextResponse.json(updatedEstimate);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimates API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to recalculate estimate' },
      { status: 500 }
    );
  }
}
