import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dailyReportUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/hdd/daily-reports/[id] - Get single daily report with full relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dailyReport = await prisma.dailyReport.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            status: true,
            location: true,
            customerName: true,
            customerContact: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true
          }
        },
        signedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        auditLogs: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { changedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!dailyReport) {
      return Response.json(
        { error: 'Daily report not found' },
        { status: 404 }
      );
    }

    return Response.json({ dailyReport });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return Response.json(
      { error: 'Failed to fetch daily report' },
      { status: 500 }
    );
  }
}

// PUT /api/hdd/daily-reports/[id] - Update existing daily report
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod
    const validatedData = dailyReportUpdateSchema.parse(body);

    // Check if daily report exists
    const existingReport = await prisma.dailyReport.findUnique({
      where: { id }
    });

    if (!existingReport) {
      return Response.json(
        { error: 'Daily report not found' },
        { status: 404 }
      );
    }

    // For now, use first user as changedById (in production, use session)
    // TODO: Replace with actual session user ID when auth is implemented
    const users = await prisma.user.findMany({ take: 1 });
    const changedById = users[0]?.id;

    if (!changedById) {
      return Response.json(
        { error: 'No users found in system' },
        { status: 500 }
      );
    }

    // Update daily report
    const dailyReport = await prisma.dailyReport.update({
      where: { id },
      data: validatedData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            location: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        signedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create audit record for update
    await prisma.reportAudit.create({
      data: {
        reportId: dailyReport.id,
        changes: body,
        snapshot: dailyReport,
        changedById
      }
    });

    return Response.json({ dailyReport });
  } catch (error) {
    console.error('Error updating daily report:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to update daily report' },
      { status: 500 }
    );
  }
}

// DELETE /api/hdd/daily-reports/[id] - Delete daily report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if daily report exists
    const existingReport = await prisma.dailyReport.findUnique({
      where: { id }
    });

    if (!existingReport) {
      return Response.json(
        { error: 'Daily report not found' },
        { status: 404 }
      );
    }

    // Note: In production, you would check if the user has appropriate permissions
    // For now, we'll allow deletion but log a warning
    // TODO: Add session-based permission check when auth is implemented

    // Delete daily report (cascades to audit logs)
    await prisma.dailyReport.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Daily report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting daily report:', error);
    return Response.json(
      { error: 'Failed to delete daily report' },
      { status: 500 }
    );
  }
}
