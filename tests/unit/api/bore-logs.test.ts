import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { BoreStatus } from '@prisma/client';

describe('Bore Logs API', () => {
  let testProjectId: string;
  let testBoreId: string;

  beforeAll(async () => {
    // Get a test project from the seeded database
    const project = await prisma.project.findFirst();
    testProjectId = project!.id;
  });

  describe('GET /api/bore-logs', () => {
    it('should return all bore logs', async () => {
      const bores = await prisma.bore.findMany({
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          _count: {
            select: {
              rodPasses: true,
              tickets811: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(bores).toBeDefined();
      expect(Array.isArray(bores)).toBe(true);
    });

    it('should filter bores by status', async () => {
      const bores = await prisma.bore.findMany({
        where: { status: BoreStatus.PLANNED }
      });

      expect(bores).toBeDefined();
      bores.forEach(bore => {
        expect(bore.status).toBe(BoreStatus.PLANNED);
      });
    });

    it('should filter bores by projectId', async () => {
      const bores = await prisma.bore.findMany({
        where: { projectId: testProjectId }
      });

      expect(bores).toBeDefined();
      bores.forEach(bore => {
        expect(bore.projectId).toBe(testProjectId);
      });
    });

    it('should include related counts', async () => {
      const bores = await prisma.bore.findMany({
        include: {
          _count: {
            select: {
              rodPasses: true,
              tickets811: true
            }
          }
        },
        take: 1
      });

      if (bores.length > 0) {
        expect(bores[0]._count).toBeDefined();
        expect(typeof bores[0]._count.rodPasses).toBe('number');
      }
    });
  });

  describe('POST /api/bore-logs', () => {
    it('should create a new bore log with valid data', async () => {
      const boreData = {
        name: 'Test Bore via Unit Test',
        projectId: testProjectId,
        status: BoreStatus.PLANNED,
        totalLength: 500.5
      };

      const bore = await prisma.bore.create({
        data: boreData,
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      testBoreId = bore.id;

      expect(bore).toBeDefined();
      expect(bore.name).toBe(boreData.name);
      expect(bore.status).toBe(BoreStatus.PLANNED);
      expect(bore.totalLength).toBe(500.5);
      expect(bore.project).toBeDefined();
    });

    it('should fail without required projectId', async () => {
      const boreData = {
        name: 'Missing Project ID'
        // projectId is required
      };

      await expect(
        prisma.bore.create({ data: boreData as any })
      ).rejects.toThrow();
    });

    it('should fail with invalid projectId', async () => {
      const boreData = {
        name: 'Invalid Project',
        projectId: 'invalid-project-id-that-does-not-exist'
      };

      await expect(
        prisma.bore.create({ data: boreData })
      ).rejects.toThrow();
    });

    it('should set default status to PLANNED', async () => {
      const boreData = {
        name: 'Default Status Test',
        projectId: testProjectId
      };

      const bore = await prisma.bore.create({
        data: boreData
      });

      expect(bore.status).toBe(BoreStatus.PLANNED);

      // Cleanup
      await prisma.bore.delete({ where: { id: bore.id } });
    });

    it('should accept optional fields', async () => {
      const boreData = {
        name: 'Full Bore Test',
        projectId: testProjectId,
        status: BoreStatus.IN_PROGRESS,
        totalLength: 750.0,
        diameterIn: 4.5,
        productMaterial: 'HDPE',
        tracerWire: true,
        alignment: {
          type: 'LineString',
          coordinates: [[45.1234, -95.1234], [45.1244, -95.1244]]
        },
        depthProfile: [
          { distance: 0, depth: 0 },
          { distance: 100, depth: 5 },
          { distance: 200, depth: 8 }
        ]
      };

      const bore = await prisma.bore.create({
        data: boreData
      });

      expect(bore.diameterIn).toBe(4.5);
      expect(bore.productMaterial).toBe('HDPE');
      expect(bore.tracerWire).toBe(true);
      expect(bore.alignment).toBeDefined();

      // Cleanup
      await prisma.bore.delete({ where: { id: bore.id } });
    });
  });

  describe('GET /api/bore-logs/[id]', () => {
    it('should return a single bore with all relations', async () => {
      const bore = await prisma.bore.findUnique({
        where: { id: testBoreId },
        include: {
          project: true,
          rodPasses: true,
          tickets811: true,
          _count: {
            select: {
              rodPasses: true,
              tickets811: true
            }
          }
        }
      });

      expect(bore).toBeDefined();
      expect(bore?.id).toBe(testBoreId);
      expect(bore?.project).toBeDefined();
      expect(bore?._count).toBeDefined();
    });

    it('should return null for non-existent bore', async () => {
      const bore = await prisma.bore.findUnique({
        where: { id: 'non-existent-id-12345' }
      });

      expect(bore).toBeNull();
    });
  });

  describe('PUT /api/bore-logs/[id]', () => {
    it('should update bore fields', async () => {
      const updateData = {
        status: BoreStatus.IN_PROGRESS,
        totalLength: 505.0
      };

      const updated = await prisma.bore.update({
        where: { id: testBoreId },
        data: updateData
      });

      expect(updated.status).toBe(BoreStatus.IN_PROGRESS);
      expect(updated.totalLength).toBe(505.0);
    });

    it('should update depth profile', async () => {
      const updateData = {
        depthProfile: [
          { distance: 0, depth: 0 },
          { distance: 250, depth: 10 },
          { distance: 500, depth: 12 }
        ]
      };

      const updated = await prisma.bore.update({
        where: { id: testBoreId },
        data: updateData
      });

      expect(updated.depthProfile).toBeDefined();
      expect(Array.isArray(updated.depthProfile)).toBe(true);
    });

    it('should fail to update non-existent bore', async () => {
      await expect(
        prisma.bore.update({
          where: { id: 'non-existent-id-12345' },
          data: { status: BoreStatus.COMPLETED }
        })
      ).rejects.toThrow();
    });
  });

  describe('DELETE /api/bore-logs/[id]', () => {
    it('should delete a bore', async () => {
      // Create a bore to delete
      const bore = await prisma.bore.create({
        data: {
          name: 'Bore to Delete',
          projectId: testProjectId
        }
      });

      await prisma.bore.delete({
        where: { id: bore.id }
      });

      const deleted = await prisma.bore.findUnique({
        where: { id: bore.id }
      });

      expect(deleted).toBeNull();
    });

    it('should fail to delete non-existent bore', async () => {
      await expect(
        prisma.bore.delete({
          where: { id: 'non-existent-id-12345' }
        })
      ).rejects.toThrow();
    });
  });
});
