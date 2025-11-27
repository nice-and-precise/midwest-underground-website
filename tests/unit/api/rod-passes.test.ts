import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Rod Passes API', () => {
  let testBoreId: string;
  let testRodPassId: string;
  let testUserId: string;

  beforeAll(async () => {
    const bore = await prisma.bore.findFirst();
    testBoreId = bore!.id;

    const user = await prisma.user.findFirst();
    testUserId = user!.id;
  });

  describe('GET /api/hdd/rod-passes', () => {
    it('should return all rod passes', async () => {
      const rodPasses = await prisma.rodPass.findMany({
        include: {
          bore: {
            select: {
              id: true,
              name: true,
              projectId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(rodPasses).toBeDefined();
      expect(Array.isArray(rodPasses)).toBe(true);
    });

    it('should filter rod passes by boreId', async () => {
      const rodPasses = await prisma.rodPass.findMany({
        where: { boreId: testBoreId }
      });

      rodPasses.forEach(pass => {
        expect(pass.boreId).toBe(testBoreId);
      });
    });

    it('should order by sequence', async () => {
      const rodPasses = await prisma.rodPass.findMany({
        where: { boreId: testBoreId },
        orderBy: { sequence: 'asc' }
      });

      for (let i = 1; i < rodPasses.length; i++) {
        expect(rodPasses[i].sequence).toBeGreaterThanOrEqual(rodPasses[i - 1].sequence);
      }
    });
  });

  describe('POST /api/hdd/rod-passes', () => {
    it('should create a rod pass with valid data', async () => {
      const rodPassData = {
        boreId: testBoreId,
        sequence: 1,
        passNumber: 1,
        linearFeet: 50,
        fluidMix: 'Standard bentonite',
        fluidVolumeGal: 100,
        startedAt: new Date('2025-01-15T08:00:00'),
        completedAt: new Date('2025-01-15T09:00:00'),
        notes: 'First pass completed successfully',
        loggedById: testUserId
      };

      const rodPass = await prisma.rodPass.create({
        data: rodPassData,
        include: {
          bore: true
        }
      });

      testRodPassId = rodPass.id;

      expect(rodPass).toBeDefined();
      expect(rodPass.boreId).toBe(testBoreId);
      expect(rodPass.sequence).toBe(1);
      expect(rodPass.linearFeet).toBe(50);
      expect(rodPass.fluidVolumeGal).toBe(100);
    });

    it('should fail without required boreId', async () => {
      const rodPassData = {
        sequence: 1,
        passNumber: 1,
        linearFeet: 50
      };

      await expect(
        prisma.rodPass.create({ data: rodPassData as any })
      ).rejects.toThrow();
    });

    it('should fail with invalid boreId', async () => {
      const rodPassData = {
        boreId: 'invalid-bore-id-that-does-not-exist',
        sequence: 1,
        passNumber: 1,
        linearFeet: 50,
        loggedById: testUserId
      };

      await expect(
        prisma.rodPass.create({ data: rodPassData })
      ).rejects.toThrow();
    });

    it('should calculate total length for bore', async () => {
      // Create multiple rod passes
      const passes = [
        { boreId: testBoreId, sequence: 10, passNumber: 1, linearFeet: 50, loggedById: testUserId },
        { boreId: testBoreId, sequence: 11, passNumber: 2, linearFeet: 50, loggedById: testUserId },
        { boreId: testBoreId, sequence: 12, passNumber: 3, linearFeet: 50, loggedById: testUserId }
      ];

      for (const pass of passes) {
        await prisma.rodPass.create({ data: pass });
      }

      // Get all rod passes for this bore
      const allPasses = await prisma.rodPass.findMany({
        where: { boreId: testBoreId }
      });

      const totalLength = allPasses.reduce((sum, pass) => sum + pass.linearFeet, 0);
      expect(totalLength).toBeGreaterThan(0);
    });

    it('should store optional fields', async () => {
      const rodPassData = {
        boreId: testBoreId,
        sequence: 20,
        passNumber: 1,
        linearFeet: 30,
        fluidMix: 'Modified mix with polymers',
        notes: 'Encountered harder soil',
        loggedById: testUserId
      };

      const rodPass = await prisma.rodPass.create({
        data: rodPassData
      });

      expect(rodPass.fluidMix).toBe('Modified mix with polymers');
      expect(rodPass.notes).toBe('Encountered harder soil');
    });
  });

  describe('GET /api/hdd/rod-passes/[id]', () => {
    it('should return a single rod pass with relations', async () => {
      const rodPass = await prisma.rodPass.findUnique({
        where: { id: testRodPassId },
        include: {
          bore: {
            include: {
              project: true
            }
          }
        }
      });

      expect(rodPass).toBeDefined();
      expect(rodPass?.id).toBe(testRodPassId);
      expect(rodPass?.bore).toBeDefined();
      expect(rodPass?.bore.project).toBeDefined();
    });

    it('should return null for non-existent rod pass', async () => {
      const rodPass = await prisma.rodPass.findUnique({
        where: { id: 'non-existent-id-12345' }
      });

      expect(rodPass).toBeNull();
    });
  });
});
