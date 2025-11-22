import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@prisma/client';

describe('Projects API', () => {
  let testUserId: string;
  let testProjectId: string;

  beforeAll(async () => {
    // Get a test user from the seeded database
    const user = await prisma.user.findFirst({
      where: { email: 'owner@midwestunderground.com' }
    });
    testUserId = user!.id;
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const projects = await prisma.project.findMany({
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          _count: {
            select: {
              bores: true,
              dailyReports: true,
              inspections: true,
              tickets811: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should filter projects by status', async () => {
      const projects = await prisma.project.findMany({
        where: { status: ProjectStatus.IN_PROGRESS }
      });

      expect(projects).toBeDefined();
      expect(Array.isArray(projects)).toBe(true);
      projects.forEach(project => {
        expect(project.status).toBe(ProjectStatus.IN_PROGRESS);
      });
    });

    it('should include related counts', async () => {
      const projects = await prisma.project.findMany({
        include: {
          _count: {
            select: {
              bores: true,
              dailyReports: true,
              inspections: true,
              tickets811: true
            }
          }
        },
        take: 1
      });

      if (projects.length > 0) {
        const project = projects[0];
        expect(project._count).toBeDefined();
        expect(typeof project._count.bores).toBe('number');
        expect(typeof project._count.dailyReports).toBe('number');
      }
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project with valid data', async () => {
      const projectData = {
        name: 'Test Project via Unit Test',
        description: 'A test project created in unit tests',
        status: ProjectStatus.PLANNING,
        customerName: 'Test Customer',
        customerContact: 'test@customer.com',
        createdById: testUserId
      };

      const project = await prisma.project.create({
        data: projectData,
        include: {
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

      testProjectId = project.id;

      expect(project).toBeDefined();
      expect(project.name).toBe(projectData.name);
      expect(project.status).toBe(ProjectStatus.PLANNING);
      expect(project.createdBy).toBeDefined();
      expect(project.createdBy.id).toBe(testUserId);
    });

    it('should fail without required name', async () => {
      const projectData = {
        description: 'Missing name field',
        createdById: testUserId
      };

      await expect(
        prisma.project.create({ data: projectData as any })
      ).rejects.toThrow();
    });

    it('should fail with invalid user ID', async () => {
      const projectData = {
        name: 'Test Project',
        createdById: 'invalid-user-id-that-does-not-exist'
      };

      await expect(
        prisma.project.create({ data: projectData })
      ).rejects.toThrow();
    });

    it('should set default status to PLANNING', async () => {
      const projectData = {
        name: 'Default Status Test',
        createdById: testUserId
        // No status provided
      };

      const project = await prisma.project.create({
        data: projectData
      });

      expect(project.status).toBe(ProjectStatus.PLANNING);

      // Cleanup
      await prisma.project.delete({ where: { id: project.id } });
    });

    it('should accept optional fields', async () => {
      const projectData = {
        name: 'Full Project Test',
        description: 'Complete project with all fields',
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        budget: 100000,
        customerName: 'Acme Corp',
        customerContact: 'john@acme.com',
        location: { address: '123 Main St', city: 'Willmar', state: 'MN' },
        createdById: testUserId
      };

      const project = await prisma.project.create({
        data: projectData
      });

      expect(project.budget).toBe(100000);
      expect(project.customerName).toBe('Acme Corp');
      expect(project.location).toBeDefined();

      // Cleanup
      await prisma.project.delete({ where: { id: project.id } });
    });
  });

  describe('GET /api/projects/[id]', () => {
    it('should return a single project with all relations', async () => {
      const project = await prisma.project.findUnique({
        where: { id: testProjectId },
        include: {
          createdBy: true,
          bores: true,
          dailyReports: true,
          inspections: true,
          tickets811: true,
          _count: {
            select: {
              bores: true,
              dailyReports: true,
              inspections: true,
              tickets811: true
            }
          }
        }
      });

      expect(project).toBeDefined();
      expect(project?.id).toBe(testProjectId);
      expect(project?.createdBy).toBeDefined();
      expect(project?._count).toBeDefined();
    });

    it('should return null for non-existent project', async () => {
      const project = await prisma.project.findUnique({
        where: { id: 'non-existent-id-12345' }
      });

      expect(project).toBeNull();
    });
  });

  describe('PUT /api/projects/[id]', () => {
    it('should update project fields', async () => {
      const updateData = {
        status: ProjectStatus.IN_PROGRESS,
        budget: 150000
      };

      const updated = await prisma.project.update({
        where: { id: testProjectId },
        data: updateData
      });

      expect(updated.status).toBe(ProjectStatus.IN_PROGRESS);
      expect(updated.budget).toBe(150000);
    });

    it('should update partial fields', async () => {
      const original = await prisma.project.findUnique({
        where: { id: testProjectId }
      });

      const updateData = {
        description: 'Updated description'
      };

      const updated = await prisma.project.update({
        where: { id: testProjectId },
        data: updateData
      });

      expect(updated.description).toBe('Updated description');
      expect(updated.name).toBe(original?.name); // Name should remain unchanged
    });

    it('should fail to update non-existent project', async () => {
      await expect(
        prisma.project.update({
          where: { id: 'non-existent-id-12345' },
          data: { status: ProjectStatus.COMPLETED }
        })
      ).rejects.toThrow();
    });
  });

  describe('DELETE /api/projects/[id]', () => {
    it('should delete a project', async () => {
      // Create a project to delete
      const project = await prisma.project.create({
        data: {
          name: 'Project to Delete',
          createdById: testUserId
        }
      });

      await prisma.project.delete({
        where: { id: project.id }
      });

      const deleted = await prisma.project.findUnique({
        where: { id: project.id }
      });

      expect(deleted).toBeNull();
    });

    it('should fail to delete non-existent project', async () => {
      await expect(
        prisma.project.delete({
          where: { id: 'non-existent-id-12345' }
        })
      ).rejects.toThrow();
    });
  });
});
