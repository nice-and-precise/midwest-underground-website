import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { InspectionStatus } from '@prisma/client';

describe('Inspection Workflow (Integration)', () => {
  let userId: string;
  let projectId: string;
  let boreId: string;
  let preConstructionId: string;
  let progressId: string;
  let finalId: string;

  beforeAll(async () => {
    const user = await prisma.user.findFirst();
    userId = user!.id;

    const project = await prisma.project.findFirst();
    projectId = project!.id;

    const bore = await prisma.bore.findFirst();
    boreId = bore!.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.inspection.deleteMany({
      where: { id: { in: [preConstructionId, progressId, finalId] } }
    });
  });

  it('should complete pre-construction inspection', async () => {
    // Step 1: Schedule pre-construction inspection
    const inspection = await prisma.inspection.create({
      data: {
        projectId,
        boreId,
        templateName: 'Pre-Construction Checklist',
        items: [
          { id: 1, category: 'Safety', description: 'Site safety briefing completed', status: 'pending' },
          { id: 2, category: 'Permits', description: '811 ticket valid and active', status: 'pending' },
          { id: 3, category: 'Equipment', description: 'Drill rig inspection complete', status: 'pending' },
          { id: 4, category: 'Locate', description: 'All utilities marked and verified', status: 'pending' },
          { id: 5, category: 'Site', description: 'Entry and exit pits excavated', status: 'pending' }
        ],
        status: InspectionStatus.OPEN,
        createdById: userId,
        dueDate: new Date('2025-01-05')
      }
    });

    preConstructionId = inspection.id;

    expect(inspection).toBeDefined();
    expect(inspection.status).toBe(InspectionStatus.OPEN);
    expect(inspection.items).toHaveLength(5);
  });

  it('should assign inspector and start inspection', async () => {
    // Step 2: Assign to inspector
    const assigned = await prisma.inspection.update({
      where: { id: preConstructionId },
      data: {
        assigneeId: userId,
        status: InspectionStatus.IN_PROGRESS
      }
    });

    expect(assigned.assigneeId).toBe(userId);
    expect(assigned.status).toBe(InspectionStatus.IN_PROGRESS);
  });

  it('should update inspection items during inspection', async () => {
    // Step 3: Inspector fills out checklist
    const updatedItems = [
      { id: 1, category: 'Safety', description: 'Site safety briefing completed', status: 'pass', notes: 'All crew attended' },
      { id: 2, category: 'Permits', description: '811 ticket valid and active', status: 'pass', notes: 'Ticket expires 2025-02-01' },
      { id: 3, category: 'Equipment', description: 'Drill rig inspection complete', status: 'pass', notes: 'All systems operational' },
      { id: 4, category: 'Locate', description: 'All utilities marked and verified', status: 'pass', notes: 'Flags and paint verified' },
      { id: 5, category: 'Site', description: 'Entry and exit pits excavated', status: 'pass', notes: 'Pits meet specifications' }
    ];

    const updated = await prisma.inspection.update({
      where: { id: preConstructionId },
      data: { items: updatedItems }
    });

    expect(updated.items).toHaveLength(5);
    expect(updated.items.every((item: any) => item.status === 'pass')).toBe(true);
  });

  it('should complete pre-construction inspection', async () => {
    // Step 4: Mark inspection complete
    const completed = await prisma.inspection.update({
      where: { id: preConstructionId },
      data: {
        status: InspectionStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    expect(completed.status).toBe(InspectionStatus.COMPLETED);
    expect(completed.completedAt).toBeDefined();
  });

  it('should perform progress inspection with partial failures', async () => {
    // Step 5: Create progress inspection during drilling
    const progressInspection = await prisma.inspection.create({
      data: {
        projectId,
        boreId,
        templateName: 'Progress Inspection',
        items: [
          { id: 1, description: 'Drilling within grade tolerance', status: 'pending' },
          { id: 2, description: 'Fluid returns adequate', status: 'pending' },
          { id: 3, description: 'Tracking equipment operational', status: 'pending' },
          { id: 4, description: 'Daily reports up to date', status: 'pending' }
        ],
        status: InspectionStatus.OPEN,
        createdById: userId
      }
    });

    progressId = progressInspection.id;

    // Start inspection
    await prisma.inspection.update({
      where: { id: progressId },
      data: { status: InspectionStatus.IN_PROGRESS }
    });

    // Fill out with some failures
    const mixedResults = [
      { id: 1, description: 'Drilling within grade tolerance', status: 'pass' },
      { id: 2, description: 'Fluid returns adequate', status: 'fail', notes: 'Low returns at station 150' },
      { id: 3, description: 'Tracking equipment operational', status: 'pass' },
      { id: 4, description: 'Daily reports up to date', status: 'fail', notes: 'Yesterday report missing signatures' }
    ];

    const updated = await prisma.inspection.update({
      where: { id: progressId },
      data: {
        items: mixedResults,
        status: InspectionStatus.FAILED
      }
    });

    expect(updated.status).toBe(InspectionStatus.FAILED);

    // Find failed items
    const failedItems = updated.items.filter((item: any) => item.status === 'fail');
    expect(failedItems).toHaveLength(2);
  });

  it('should create final inspection', async () => {
    // Step 6: Final inspection after bore complete
    const finalInspection = await prisma.inspection.create({
      data: {
        projectId,
        boreId,
        templateName: 'Final Inspection',
        items: [
          { id: 1, description: 'Bore completed to specified length', status: 'pass' },
          { id: 2, description: 'Product installed correctly', status: 'pass' },
          { id: 3, description: 'Tracer wire continuous', status: 'pass' },
          { id: 4, description: 'Pits backfilled and compacted', status: 'pass' },
          { id: 5, description: 'Site restored to original condition', status: 'pass' },
          { id: 6, description: 'As-built documentation complete', status: 'pass' }
        ],
        status: InspectionStatus.IN_PROGRESS,
        createdById: userId,
        assigneeId: userId
      }
    });

    finalId = finalInspection.id;

    // Complete final inspection
    const completed = await prisma.inspection.update({
      where: { id: finalId },
      data: {
        status: InspectionStatus.COMPLETED,
        completedAt: new Date()
      }
    });

    expect(completed.status).toBe(InspectionStatus.COMPLETED);
  });

  it('should track all inspections for a bore', async () => {
    // Step 7: Get inspection history for bore
    const inspections = await prisma.inspection.findMany({
      where: {
        boreId,
        id: { in: [preConstructionId, progressId, finalId] }
      },
      orderBy: { createdAt: 'asc' }
    });

    expect(inspections).toHaveLength(3);
    expect(inspections[0].templateName).toBe('Pre-Construction Checklist');
    expect(inspections[1].templateName).toBe('Progress Inspection');
    expect(inspections[2].templateName).toBe('Final Inspection');
  });

  it('should calculate inspection statistics', async () => {
    // Step 8: Calculate pass/fail rates
    const allInspections = await prisma.inspection.findMany({
      where: { boreId }
    });

    const completed = allInspections.filter(i => i.status === InspectionStatus.COMPLETED).length;
    const failed = allInspections.filter(i => i.status === InspectionStatus.FAILED).length;
    const inProgress = allInspections.filter(i => i.status === InspectionStatus.IN_PROGRESS).length;

    expect(completed).toBeGreaterThan(0);
    expect(typeof failed).toBe('number');
    expect(typeof inProgress).toBe('number');
  });
});
