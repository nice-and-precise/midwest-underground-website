import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { ProjectStatus, BoreStatus, ReportStatus } from '@prisma/client';

describe('Bore Logging Workflow (Integration)', () => {
  let userId: string;
  let projectId: string;
  let boreId: string;
  let reportId: string;

  beforeAll(async () => {
    // Get existing user
    const user = await prisma.user.findFirst({
      where: { email: 'owner@midwestunderground.com' }
    });
    userId = user!.id;
  });

  it('should complete full bore logging workflow', async () => {
    // Step 1: Create a new project
    const project = await prisma.project.create({
      data: {
        name: 'Integration Test - Fiber Project',
        status: ProjectStatus.IN_PROGRESS,
        customerName: 'Test Customer',
        createdById: userId
      }
    });
    projectId = project.id;
    expect(project).toBeDefined();
    expect(project.status).toBe(ProjectStatus.IN_PROGRESS);

    // Step 2: Create a bore log for the project
    const bore = await prisma.bore.create({
      data: {
        name: 'Test Bore #1',
        projectId: project.id,
        status: BoreStatus.PLANNED,
        totalLength: 0,
        diameterIn: 4.5,
        productMaterial: 'HDPE'
      }
    });
    boreId = bore.id;
    expect(bore).toBeDefined();
    expect(bore.status).toBe(BoreStatus.PLANNED);

    // Step 3: Start the bore (update status)
    const startedBore = await prisma.bore.update({
      where: { id: bore.id },
      data: { status: BoreStatus.IN_PROGRESS }
    });
    expect(startedBore.status).toBe(BoreStatus.IN_PROGRESS);

    // Step 4: Log rod passes
    const rodPass1 = await prisma.rodPass.create({
      data: {
        boreId: bore.id,
        sequence: 1,
        passNumber: 1,
        linearFeet: 50,
        fluidMix: 'Standard bentonite',
        fluidVolumeGal: 100,
        loggedById: userId
      }
    });

    const rodPass2 = await prisma.rodPass.create({
      data: {
        boreId: bore.id,
        sequence: 2,
        passNumber: 2,
        linearFeet: 50,
        fluidMix: 'Standard bentonite',
        fluidVolumeGal: 100,
        loggedById: userId
      }
    });

    expect(rodPass1.linearFeet).toBe(50);
    expect(rodPass2.linearFeet).toBe(50);

    // Step 5: Calculate total length from rod passes
    const allRodPasses = await prisma.rodPass.findMany({
      where: { boreId: bore.id }
    });
    const totalLength = allRodPasses.reduce((sum, pass) => sum + pass.linearFeet, 0);
    expect(totalLength).toBe(100);

    // Step 6: Update bore with total length
    const updatedBore = await prisma.bore.update({
      where: { id: bore.id },
      data: { totalLength }
    });
    expect(updatedBore.totalLength).toBe(100);

    // Step 7: Create daily report
    const dailyReport = await prisma.dailyReport.create({
      data: {
        projectId: project.id,
        reportDate: new Date(),
        crew: [
          { name: 'John Doe', role: 'Operator', hours: 8 },
          { name: 'Jane Smith', role: 'Locator', hours: 8 }
        ],
        production: [
          { boreId: bore.id, activity: 'Drilling', lf: 100, startTime: '08:00', endTime: '16:00' }
        ],
        labor: [
          { name: 'Operator', hours: 8, rate: 75, total: 600 },
          { name: 'Locator', hours: 8, rate: 65, total: 520 }
        ],
        equipment: [
          { name: 'D24x40 Drill', hours: 8, rate: 150, total: 1200 }
        ],
        notes: 'Completed 100 LF of drilling',
        status: ReportStatus.DRAFT,
        createdById: userId
      }
    });
    reportId = dailyReport.id;

    expect(dailyReport).toBeDefined();
    expect(dailyReport.status).toBe(ReportStatus.DRAFT);
    expect(dailyReport.crew).toHaveLength(2);
    expect(dailyReport.production).toHaveLength(1);

    // Step 8: Submit daily report for approval
    const submittedReport = await prisma.dailyReport.update({
      where: { id: dailyReport.id },
      data: { status: ReportStatus.SUBMITTED }
    });
    expect(submittedReport.status).toBe(ReportStatus.SUBMITTED);

    // Step 9: Approve daily report
    const approvedReport = await prisma.dailyReport.update({
      where: { id: dailyReport.id },
      data: {
        status: ReportStatus.APPROVED,
        signedById: userId
      }
    });
    expect(approvedReport.status).toBe(ReportStatus.APPROVED);
    expect(approvedReport.signedById).toBe(userId);

    // Step 10: Complete the bore
    const completedBore = await prisma.bore.update({
      where: { id: bore.id },
      data: { status: BoreStatus.COMPLETED }
    });
    expect(completedBore.status).toBe(BoreStatus.COMPLETED);

    // Verify final state
    const finalBore = await prisma.bore.findUnique({
      where: { id: bore.id },
      include: {
        rodPasses: true,
        project: true
      }
    });

    expect(finalBore).toBeDefined();
    expect(finalBore?.rodPasses).toHaveLength(2);
    expect(finalBore?.totalLength).toBe(100);
    expect(finalBore?.status).toBe(BoreStatus.COMPLETED);
  });

  it('should enforce data relationships', async () => {
    // Verify project has the bore
    const projectWithBores = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        bores: true,
        dailyReports: true
      }
    });

    expect(projectWithBores?.bores).toHaveLength(1);
    expect(projectWithBores?.dailyReports).toHaveLength(1);
  });

  it('should cascade delete properly', async () => {
    // Delete the bore - rod passes should be deleted too
    await prisma.bore.delete({
      where: { id: boreId }
    });

    // Verify rod passes are gone
    const orphanedPasses = await prisma.rodPass.findMany({
      where: { boreId: boreId }
    });
    expect(orphanedPasses).toHaveLength(0);

    // Clean up project and report
    await prisma.dailyReport.delete({ where: { id: reportId } });
    await prisma.project.delete({ where: { id: projectId } });
  });
});
