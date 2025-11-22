import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  projectSchema,
  boreSchema,
  dailyReportCreateSchema,
  rodPassCreateSchema,
  ticket811CreateSchema,
  inspectionCreateSchema
} from '@/lib/validations';
import { z } from 'zod';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'user@midwestunderground.com',
        password: 'password123'
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'password123'
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid email');
      }
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'user@midwestunderground.com',
        password: '12345' // Only 5 characters
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 6 characters');
      }
    });

    it('should reject missing fields', () => {
      const invalidData = {
        email: 'user@midwestunderground.com'
        // password is missing
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('projectSchema', () => {
    it('should validate correct project data', () => {
      const validData = {
        name: 'Test Project',
        description: 'A test project',
        status: 'PLANNING',
        createdById: 'user-id-123'
      };

      const result = projectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        createdById: 'user-id-123'
      };

      const result = projectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        name: 'Test Project',
        status: 'INVALID_STATUS',
        createdById: 'user-id-123'
      };

      const result = projectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
      const validData = {
        name: 'Full Project',
        description: 'Complete project data',
        status: 'IN_PROGRESS',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        budget: 100000,
        customerName: 'Acme Corp',
        customerContact: 'john@acme.com',
        location: { city: 'Willmar', state: 'MN' },
        createdById: 'user-id-123'
      };

      const result = projectSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject negative budget', () => {
      const invalidData = {
        name: 'Test Project',
        budget: -1000,
        createdById: 'user-id-123'
      };

      const result = projectSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should transform date strings to Date objects', () => {
      const validData = {
        name: 'Test Project',
        startDate: '2025-01-01',
        createdById: 'user-id-123'
      };

      const result = projectSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.startDate).toBeInstanceOf(Date);
      }
    });
  });

  describe('boreSchema', () => {
    it('should validate correct bore data', () => {
      const validData = {
        name: 'Test Bore',
        projectId: 'project-id-123',
        status: 'PLANNED',
        totalLength: 500
      };

      const result = boreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing projectId', () => {
      const invalidData = {
        name: 'Test Bore',
        status: 'PLANNED'
      };

      const result = boreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        name: 'Test Bore',
        projectId: 'project-id-123',
        status: 'INVALID_STATUS'
      };

      const result = boreSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional technical fields', () => {
      const validData = {
        name: 'Test Bore',
        projectId: 'project-id-123',
        diameterIn: 4.5,
        productMaterial: 'HDPE',
        tracerWire: true,
        alignment: {
          type: 'LineString',
          coordinates: [[45.1234, -95.1234], [45.1244, -95.1244]]
        }
      };

      const result = boreSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('dailyReportCreateSchema', () => {
    it('should validate correct daily report data', () => {
      const validData = {
        projectId: 'project-id-123',
        reportDate: new Date('2025-01-15'),
        crew: [{ name: 'John Doe', role: 'Operator', hours: 8 }],
        production: [{ activity: 'Drilling', lf: 250 }],
        status: 'DRAFT'
      };

      const result = dailyReportCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing projectId', () => {
      const invalidData = {
        reportDate: new Date(),
        status: 'DRAFT'
      };

      const result = dailyReportCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should set default empty arrays', () => {
      const validData = {
        projectId: 'project-id-123',
        reportDate: new Date()
      };

      const result = dailyReportCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data.crew)).toBe(true);
        expect(Array.isArray(result.data.production)).toBe(true);
        expect(result.data.status).toBe('DRAFT');
      }
    });
  });

  describe('rodPassCreateSchema', () => {
    it('should validate correct rod pass data', () => {
      const validData = {
        boreId: 'bore-id-123',
        sequence: 1,
        passNumber: 1,
        linearFeet: 50,
        fluidMix: 'Standard bentonite',
        fluidVolumeGal: 100
      };

      const result = rodPassCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing boreId', () => {
      const invalidData = {
        sequence: 1,
        passNumber: 1,
        linearFeet: 50
      };

      const result = rodPassCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative linearFeet', () => {
      const invalidData = {
        boreId: 'bore-id-123',
        sequence: 1,
        passNumber: 1,
        linearFeet: -10
      };

      const result = rodPassCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject zero or negative sequence', () => {
      const invalidData = {
        boreId: 'bore-id-123',
        sequence: 0,
        passNumber: 1,
        linearFeet: 50
      };

      const result = rodPassCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept optional timestamp fields', () => {
      const validData = {
        boreId: 'bore-id-123',
        sequence: 1,
        passNumber: 1,
        linearFeet: 50,
        startedAt: '2025-01-15T08:00:00Z',
        completedAt: '2025-01-15T09:00:00Z',
        notes: 'First pass completed'
      };

      const result = rodPassCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('ticket811CreateSchema', () => {
    it('should validate correct 811 ticket data', () => {
      const validData = {
        ticketNumber: '811-TEST-001',
        projectId: 'project-id-123',
        ticketDate: '2025-01-01T00:00:00Z',
        expirationDate: '2025-02-01T00:00:00Z',
        status: 'ACTIVE'
      };

      const result = ticket811CreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing ticketNumber', () => {
      const invalidData = {
        projectId: 'project-id-123',
        ticketDate: '2025-01-01T00:00:00Z',
        expirationDate: '2025-02-01T00:00:00Z'
      };

      const result = ticket811CreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        ticketNumber: '811-TEST-001',
        projectId: 'project-id-123',
        ticketDate: '2025-01-01T00:00:00Z',
        expirationDate: '2025-02-01T00:00:00Z',
        status: 'INVALID_STATUS'
      };

      const result = ticket811CreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should transform date strings to Date objects', () => {
      const validData = {
        ticketNumber: '811-TEST-001',
        projectId: 'project-id-123',
        ticketDate: '2025-01-01T00:00:00Z',
        expirationDate: '2025-02-01T00:00:00Z'
      };

      const result = ticket811CreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.ticketDate).toBeInstanceOf(Date);
        expect(result.data.expirationDate).toBeInstanceOf(Date);
      }
    });
  });

  describe('inspectionCreateSchema', () => {
    it('should validate correct inspection data', () => {
      const validData = {
        projectId: 'project-id-123',
        boreId: 'bore-id-123',
        templateName: 'Pre-Construction Checklist',
        items: [
          { id: 1, description: 'Check locates', status: 'pending' }
        ],
        status: 'OPEN',
        createdById: 'user-id-123'
      };

      const result = inspectionCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing projectId', () => {
      const invalidData = {
        templateName: 'Test Inspection',
        createdById: 'user-id-123'
      };

      const result = inspectionCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing createdById', () => {
      const invalidData = {
        projectId: 'project-id-123',
        templateName: 'Test Inspection'
      };

      const result = inspectionCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should set default items to empty array', () => {
      const validData = {
        projectId: 'project-id-123',
        createdById: 'user-id-123'
      };

      const result = inspectionCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data.items)).toBe(true);
        expect(result.data.items).toHaveLength(0);
        expect(result.data.status).toBe('OPEN');
      }
    });

    it('should accept optional boreId', () => {
      const validData = {
        projectId: 'project-id-123',
        boreId: 'bore-id-123',
        createdById: 'user-id-123'
      };

      const result = inspectionCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
