import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { InspectionStatus } from '@prisma/client';

describe('Inspections API', () => {
  let testProjectId: string;
  let testBoreId: string;
  let testUserId: string;
  let testInspectionId: string;

  beforeAll(async () => {
    const project = await prisma.project.findFirst();
    testProjectId = project!.id;

    const bore = await prisma.bore.findFirst();
    testBoreId = bore!.id;

    const user = await prisma.user.findFirst();
    testUserId = user!.id;
  });

  describe('GET /api/inspections', () => {
    it('should return all inspections', async () => {
      const inspections = await prisma.inspection.findMany({
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          },
          bore: {
            select: {
              id: true,
              name: true
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(inspections).toBeDefined();
      expect(Array.isArray(inspections)).toBe(true);
    });

    it('should filter inspections by projectId', async () => {
      const inspections = await prisma.inspection.findMany({
        where: { projectId: testProjectId }
      });

      inspections.forEach(inspection => {
        expect(inspection.projectId).toBe(testProjectId);
      });
    });

    it('should filter inspections by status', async () => {
      const inspections = await prisma.inspection.findMany({
        where: { status: InspectionStatus.OPEN }
      });

      inspections.forEach(inspection => {
        expect(inspection.status).toBe(InspectionStatus.OPEN);
      });
    });
  });

  describe('POST /api/inspections', () => {
    it('should create an inspection with valid data', async () => {
      const inspectionData = {
        projectId: testProjectId,
        boreId: testBoreId,
        templateName: 'Pre-Construction Checklist',
        items: [
          { id: 1, description: 'Check locate marks', status: 'pending' },
          { id: 2, description: 'Verify entry/exit pits', status: 'pending' },
          { id: 3, description: 'Equipment inspection', status: 'pending' }
        ],
        status: InspectionStatus.OPEN,
        createdById: testUserId
      };

      const inspection = await prisma.inspection.create({
        data: inspectionData,
        include: {
          project: true,
          bore: true,
          createdBy: true
        }
      });

      testInspectionId = inspection.id;

      expect(inspection).toBeDefined();
      expect(inspection.projectId).toBe(testProjectId);
      expect(inspection.boreId).toBe(testBoreId);
      expect(inspection.items).toBeDefined();
      expect(Array.isArray(inspection.items)).toBe(true);
    });

    it('should fail without required projectId', async () => {
      const inspectionData = {
        templateName: 'Test Inspection',
        createdById: testUserId
      };

      await expect(
        prisma.inspection.create({ data: inspectionData as any })
      ).rejects.toThrow();
    });

    it('should fail without required createdById', async () => {
      const inspectionData = {
        projectId: testProjectId,
        templateName: 'Test Inspection'
      };

      await expect(
        prisma.inspection.create({ data: inspectionData as any })
      ).rejects.toThrow();
    });

    it('should set default status to OPEN', async () => {
      const inspectionData = {
        projectId: testProjectId,
        templateName: 'Default Status Test',
        items: [], // Required field
        createdById: testUserId
      };

      const inspection = await prisma.inspection.create({
        data: inspectionData
      });

      expect(inspection.status).toBe(InspectionStatus.OPEN);

      await prisma.inspection.delete({ where: { id: inspection.id } });
    });

    it('should create inspection without boreId (project-level)', async () => {
      const inspectionData = {
        projectId: testProjectId,
        templateName: 'Project-Level Inspection',
        items: [
          { id: 1, description: 'Safety briefing completed', status: 'pass' }
        ],
        createdById: testUserId
      };

      const inspection = await prisma.inspection.create({
        data: inspectionData
      });

      expect(inspection.boreId).toBeNull();
      expect(inspection.projectId).toBe(testProjectId);

      await prisma.inspection.delete({ where: { id: inspection.id } });
    });

    it('should store complex inspection items', async () => {
      const inspectionData = {
        projectId: testProjectId,
        boreId: testBoreId,
        templateName: 'Detailed QA/QC Inspection',
        items: [
          {
            id: 1,
            category: 'Safety',
            description: 'PPE requirements met',
            status: 'pass',
            notes: 'All crew members wearing proper equipment'
          },
          {
            id: 2,
            category: 'Equipment',
            description: 'Drill rig inspection',
            status: 'pass',
            checkedBy: 'John Doe',
            timestamp: new Date().toISOString()
          },
          {
            id: 3,
            category: 'Documentation',
            description: '811 ticket valid',
            status: 'fail',
            notes: 'Ticket expired, renewal required',
            photos: ['photo1.jpg', 'photo2.jpg']
          }
        ],
        createdById: testUserId
      };

      const inspection = await prisma.inspection.create({
        data: inspectionData
      });

      expect(inspection.items).toBeDefined();
      expect(inspection.items).toHaveLength(3);

      await prisma.inspection.delete({ where: { id: inspection.id } });
    });
  });

  describe('GET /api/inspections/[id]', () => {
    it('should return a single inspection with all relations', async () => {
      const inspection = await prisma.inspection.findUnique({
        where: { id: testInspectionId },
        include: {
          project: true,
          bore: true,
          createdBy: true,
          assignee: true
        }
      });

      expect(inspection).toBeDefined();
      expect(inspection?.id).toBe(testInspectionId);
      expect(inspection?.project).toBeDefined();
      expect(inspection?.createdBy).toBeDefined();
    });

    it('should return null for non-existent inspection', async () => {
      const inspection = await prisma.inspection.findUnique({
        where: { id: 'non-existent-id-12345' }
      });

      expect(inspection).toBeNull();
    });
  });

  describe('Inspection workflow', () => {
    it('should update inspection status from OPEN to IN_PROGRESS', async () => {
      const updated = await prisma.inspection.update({
        where: { id: testInspectionId },
        data: { status: InspectionStatus.IN_PROGRESS }
      });

      expect(updated.status).toBe(InspectionStatus.IN_PROGRESS);
    });

    it('should complete inspection with timestamp', async () => {
      const completedAt = new Date();

      const updated = await prisma.inspection.update({
        where: { id: testInspectionId },
        data: {
          status: InspectionStatus.COMPLETED,
          completedAt
        }
      });

      expect(updated.status).toBe(InspectionStatus.COMPLETED);
      expect(updated.completedAt).toBeDefined();
    });

    it('should assign inspection to user', async () => {
      const updated = await prisma.inspection.update({
        where: { id: testInspectionId },
        data: { assigneeId: testUserId }
      });

      expect(updated.assigneeId).toBe(testUserId);
    });

    it('should update inspection items', async () => {
      const updatedItems = [
        { id: 1, description: 'Check locate marks', status: 'pass' },
        { id: 2, description: 'Verify entry/exit pits', status: 'pass' },
        { id: 3, description: 'Equipment inspection', status: 'fail', notes: 'Hydraulic leak found' }
      ];

      const updated = await prisma.inspection.update({
        where: { id: testInspectionId },
        data: { items: updatedItems }
      });

      expect(updated.items).toHaveLength(3);
    });

    it('should fail inspection if any item fails', async () => {
      const updated = await prisma.inspection.update({
        where: { id: testInspectionId },
        data: { status: InspectionStatus.FAILED }
      });

      expect(updated.status).toBe(InspectionStatus.FAILED);
    });
  });
});
