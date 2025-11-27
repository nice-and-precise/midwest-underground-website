import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import { ReportStatus } from '@prisma/client';

describe('Daily Reports API', () => {
  let testProjectId: string;
  let testReportId: string;

  beforeAll(async () => {
    const project = await prisma.project.findFirst();
    testProjectId = project!.id;
  });

  describe('GET /api/hdd/daily-reports', () => {
    it('should return all daily reports', async () => {
      const reports = await prisma.dailyReport.findMany({
        include: {
          project: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { reportDate: 'desc' }
      });

      expect(reports).toBeDefined();
      expect(Array.isArray(reports)).toBe(true);
    });

    it('should filter reports by projectId', async () => {
      const reports = await prisma.dailyReport.findMany({
        where: { projectId: testProjectId }
      });

      reports.forEach(report => {
        expect(report.projectId).toBe(testProjectId);
      });
    });

    it('should filter reports by status', async () => {
      const reports = await prisma.dailyReport.findMany({
        where: { status: ReportStatus.DRAFT }
      });

      reports.forEach(report => {
        expect(report.status).toBe(ReportStatus.DRAFT);
      });
    });
  });

  describe('POST /api/hdd/daily-reports', () => {
    it('should create a daily report with valid data', async () => {
      const reportData = {
        projectId: testProjectId,
        reportDate: new Date('2025-01-15'),
        crew: [
          { name: 'John Doe', role: 'Operator', hours: 8 },
          { name: 'Jane Smith', role: 'Locator', hours: 8 }
        ],
        production: [
          { activity: 'Drilling', lf: 250, startTime: '08:00', endTime: '12:00' }
        ],
        weather: {
          condition: 'Sunny',
          temp: 45,
          impact: 'None'
        },
        notes: 'Good progress today',
        status: ReportStatus.DRAFT
      };

      const report = await prisma.dailyReport.create({
        data: reportData,
        include: {
          project: true
        }
      });

      testReportId = report.id;

      expect(report).toBeDefined();
      expect(report.projectId).toBe(testProjectId);
      expect(report.crew).toBeDefined();
      expect(Array.isArray(report.crew)).toBe(true);
      expect(report.production).toBeDefined();
      expect(report.status).toBe(ReportStatus.DRAFT);
    });

    it('should fail without required projectId', async () => {
      const reportData = {
        reportDate: new Date()
      };

      await expect(
        prisma.dailyReport.create({ data: reportData as any })
      ).rejects.toThrow();
    });

    it('should set default status to DRAFT', async () => {
      const reportData = {
        projectId: testProjectId,
        reportDate: new Date()
      };

      const report = await prisma.dailyReport.create({
        data: reportData
      });

      expect(report.status).toBe(ReportStatus.DRAFT);

      await prisma.dailyReport.delete({ where: { id: report.id } });
    });

    it('should store complex JSON data', async () => {
      const reportData = {
        projectId: testProjectId,
        reportDate: new Date(),
        labor: [
          { name: 'Operator', hours: 8, rate: 75, total: 600 },
          { name: 'Locator', hours: 8, rate: 65, total: 520 }
        ],
        equipment: [
          { name: 'D24x40 Drill', hours: 8, rate: 150, total: 1200 }
        ],
        materials: [
          { description: 'Bentonite', qty: 50, unit: 'bags', cost: 15, total: 750 }
        ]
      };

      const report = await prisma.dailyReport.create({
        data: reportData
      });

      expect(report.labor).toBeDefined();
      expect(report.equipment).toBeDefined();
      expect(report.materials).toBeDefined();

      await prisma.dailyReport.delete({ where: { id: report.id } });
    });
  });

  describe('GET /api/hdd/daily-reports/[id]', () => {
    it('should return a single report with relations', async () => {
      const report = await prisma.dailyReport.findUnique({
        where: { id: testReportId },
        include: {
          project: true,
          signedBy: true
        }
      });

      expect(report).toBeDefined();
      expect(report?.id).toBe(testReportId);
      expect(report?.project).toBeDefined();
    });

    it('should return null for non-existent report', async () => {
      const report = await prisma.dailyReport.findUnique({
        where: { id: 'non-existent-id-12345' }
      });

      expect(report).toBeNull();
    });
  });

  describe('PUT /api/hdd/daily-reports/[id]', () => {
    it('should update report status', async () => {
      const updated = await prisma.dailyReport.update({
        where: { id: testReportId },
        data: { status: ReportStatus.SUBMITTED }
      });

      expect(updated.status).toBe(ReportStatus.SUBMITTED);
    });

    it('should update production data', async () => {
      const updated = await prisma.dailyReport.update({
        where: { id: testReportId },
        data: {
          production: [
            { activity: 'Drilling', lf: 300, startTime: '08:00', endTime: '14:00' }
          ]
        }
      });

      expect(updated.production).toBeDefined();
    });

    it('should add signature', async () => {
      const user = await prisma.user.findFirst();

      const updated = await prisma.dailyReport.update({
        where: { id: testReportId },
        data: {
          signedById: user!.id,
          status: ReportStatus.APPROVED
        }
      });

      expect(updated.signedById).toBe(user!.id);
      expect(updated.status).toBe(ReportStatus.APPROVED);
    });
  });
});
