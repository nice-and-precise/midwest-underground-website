import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { rateLimit, withRateLimitHeaders } from '@/lib/rate-limit';
import { estimateLineCreateSchema } from '@/lib/validations';
import { calculateLineCost, roundToCents } from '@/lib/services/costCalculator';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/estimates/[id]/lines
 * Get all lines for an estimate
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'read');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Verify estimate exists
    const estimate = await prisma.estimate.findUnique({
      where: { id }
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    const lines = await prisma.estimateLine.findMany({
      where: { estimateId: id },
      orderBy: { lineNumber: 'asc' },
      include: {
        costItem: {
          select: { id: true, code: true, name: true, unit: true }
        }
      }
    });

    const response = NextResponse.json(lines);
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimate Lines API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimate lines' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/estimates/[id]/lines
 * Add a line to an estimate
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    // Verify estimate exists
    const estimate = await prisma.estimate.findUnique({
      where: { id }
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Override estimateId with URL parameter
    body.estimateId = id;

    // If no lineNumber provided, auto-assign next number
    if (!body.lineNumber) {
      const lastLine = await prisma.estimateLine.findFirst({
        where: { estimateId: id },
        orderBy: { lineNumber: 'desc' }
      });
      body.lineNumber = (lastLine?.lineNumber || 0) + 1;
    }

    const validationResult = estimateLineCreateSchema.safeParse(body);

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

    // If costItemId provided, get cost item data
    let costItemData = null;
    if (validationResult.data.costItemId) {
      costItemData = await prisma.costItem.findUnique({
        where: { id: validationResult.data.costItemId }
      });
    }

    // Calculate line costs
    const costs = calculateLineCost({
      quantity: validationResult.data.quantity,
      unitCost: validationResult.data.unitCost,
      laborRate: costItemData?.laborRate || validationResult.data.laborCost,
      equipmentRate: costItemData?.equipmentRate || validationResult.data.equipmentCost,
      materialCost: costItemData?.materialCost || validationResult.data.materialCost,
      markupPercent: validationResult.data.markup || costItemData?.markup || 0.15
    });

    // Create line with calculated values
    const line = await prisma.estimateLine.create({
      data: {
        estimateId: id,
        costItemId: validationResult.data.costItemId,
        lineNumber: validationResult.data.lineNumber,
        description: validationResult.data.description,
        quantity: validationResult.data.quantity,
        unit: validationResult.data.unit,
        unitCost: validationResult.data.unitCost,
        laborCost: roundToCents(costs.laborCost),
        equipmentCost: roundToCents(costs.equipmentCost),
        materialCost: roundToCents(costs.materialCost),
        subtotal: roundToCents(costs.subtotal),
        markup: roundToCents(costs.markup),
        total: roundToCents(costs.total),
        notes: validationResult.data.notes
      },
      include: {
        costItem: {
          select: { id: true, code: true, name: true, unit: true }
        }
      }
    });

    // Update estimate totals
    await updateEstimateTotals(id);

    const response = NextResponse.json(line, { status: 201 });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimate Lines API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create estimate line' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/estimates/[id]/lines
 * Delete all lines from an estimate (bulk delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const rateLimitResult = rateLimit(request, 'api');
    if (!rateLimitResult.success) {
      return rateLimitResult.response!;
    }

    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId');

    if (lineId) {
      // Delete specific line
      await prisma.estimateLine.delete({
        where: { id: lineId }
      });
    } else {
      // Delete all lines
      await prisma.estimateLine.deleteMany({
        where: { estimateId: id }
      });
    }

    // Update estimate totals
    await updateEstimateTotals(id);

    const response = NextResponse.json({
      message: lineId ? 'Line deleted successfully' : 'All lines deleted successfully'
    });
    return withRateLimitHeaders(response, rateLimitResult.headers);
  } catch (error) {
    console.error('[Estimate Lines API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete estimate line(s)' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to update estimate totals
 */
async function updateEstimateTotals(estimateId: string) {
  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
    include: { lines: true }
  });

  if (!estimate) return;

  const subtotal = estimate.lines.reduce((sum, line) => sum + line.subtotal, 0);
  const markupAmount = subtotal * estimate.markupPercent;
  const taxableAmount = subtotal + markupAmount;
  const taxAmount = taxableAmount * estimate.taxPercent;
  const total = taxableAmount + taxAmount;

  await prisma.estimate.update({
    where: { id: estimateId },
    data: {
      subtotal: roundToCents(subtotal),
      markupAmount: roundToCents(markupAmount),
      taxAmount: roundToCents(taxAmount),
      total: roundToCents(total)
    }
  });
}
