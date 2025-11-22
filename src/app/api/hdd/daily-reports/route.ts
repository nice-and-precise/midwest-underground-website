import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dailyReportCreateSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/hdd/daily-reports - List all daily reports with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    // Build where clause
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (date) where.reportDate = new Date(date);

    const dailyReports = await prisma.dailyReport.findMany({
      where,
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
      },
      orderBy: { reportDate: 'desc' }
    });

    return Response.json({ dailyReports });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    return Response.json(
      { error: 'Failed to fetch daily reports' },
      { status: 500 }
    );
  }
}

// POST /api/hdd/daily-reports - Create new daily report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = dailyReportCreateSchema.parse(body);

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: validatedData.projectId }
    });

    if (!project) {
      return Response.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // For now, use first user as createdById (in production, use session)
    // TODO: Replace with actual session user ID when auth is implemented
    const users = await prisma.user.findMany({ take: 1 });
    const createdById = users[0]?.id;

    if (!createdById) {
      return Response.json(
        { error: 'No users found in system' },
        { status: 500 }
      );
    }

    // Create daily report
    const dailyReport = await prisma.dailyReport.create({
      data: {
        ...validatedData,
        createdById
      },
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
        }
      }
    });

    // Create audit record
    await prisma.reportAudit.create({
      data: {
        reportId: dailyReport.id,
        changes: body,
        snapshot: dailyReport,
        changedById: createdById
      }
    });

    return Response.json({ dailyReport }, { status: 201 });
  } catch (error) {
    console.error('Error creating daily report:', error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to create daily report' },
      { status: 500 }
    );
  }
}
